// Screens one application with Claude, as in the original hiring module: the PDF goes to the model as a
// document, the structured profile is scored mechanically, and a short rationale is written.
// Runs with the service role; the browser only passes an application id.
import { createClient } from "jsr:@supabase/supabase-js@2";
import { allowedOrigin, cors, json, parseJson } from "../_shared/llm.ts";
import { normaliseParsed, score, type Criteria, type ParsedResume } from "../_shared/scoring.ts";

const MODEL = Deno.env.get("SCREENING_MODEL") ?? "claude-haiku-4-5";
const MAX_ATTEMPTS = 4;

const PARSE_PROMPT = `You are extracting candidate information from a resume for a hiring system.
Return ONLY a JSON object with exactly this schema (use null or [] when not found, never invent):
{"name":string|null,"email":string|null,"phone":string|null,
 "education":[{"degree":string,"field":string|null,"year":number|null,"institution":string|null}],
 "experience":[{"company":string,"role":string,"years":number,"summary":string}],
 "total_experience_years":number,
 "skills":[string],
 "languages":[{"name":string,"read":boolean,"write":boolean}]}
Rules: skills come from any skills/tools section AND from experience bullets, each listed individually.
Years are decimals (e.g. 2.5). total_experience_years is the total professional experience without double counting overlaps.
For languages, if proficiency is unspecified mark read and write true; if only spoken or conversational, mark both false.
The application form answers are also given; use them to fill gaps but prefer the resume where they disagree.`;

type Block = { type: "text"; text: string } | { type: "document"; source: { type: "base64"; media_type: "application/pdf"; data: string } };

async function claude(system: string, content: Block[] | string, maxTokens: number): Promise<string> {
  const key = Deno.env.get("ANTHROPIC_API_KEY")?.trim(); if (!key) throw new Error("ANTHROPIC_API_KEY is not set on the server");
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, temperature: 0, system, messages: [{ role: "user", content }] }),
  });
  if (!r.ok) throw new Error(`Anthropic ${r.status}: ${(await r.text()).slice(0, 300)}`);
  const j = await r.json();
  return (j.content ?? []).filter((b: { type: string }) => b.type === "text").map((b: { text: string }) => b.text).join("").trim();
}

function b64(bytes: Uint8Array) { let s = ""; const chunk = 0x8000; for (let i = 0; i < bytes.length; i += chunk) s += String.fromCharCode(...bytes.subarray(i, i + chunk)); return btoa(s); }

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (!allowedOrigin(req)) return json({ error: "forbidden" }, 403);
  try {
    const { application_id } = await req.json();
    if (typeof application_id !== "string" || !/^[0-9a-f-]{36}$/.test(application_id)) return json({ error: "application_id required" }, 400);
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: app, error } = await sb.from("applications").select("*").eq("id", application_id).single();
    if (error || !app) return json({ error: "application not found" }, 404);
    if (!["new", "failed"].includes(app.status)) return json({ ok: true, skipped: app.status });
    if ((app.screen_attempts ?? 0) >= MAX_ATTEMPTS) return json({ error: "too many attempts" }, 429);
    await sb.from("applications").update({ status: "screening", screen_error: null, screen_attempts: (app.screen_attempts ?? 0) + 1 }).eq("id", app.id);

    const { data: job } = await sb.from("jobs").select("*").eq("id", app.job_id).single();

    try {
      const answers = app.answers ?? {};
      const formText = Object.entries(answers).filter(([k]) => !k.startsWith("_")).map(([k, v]) => `${k}: ${v}`).join("\n");
      const content: Block[] = [];
      if (app.resume_path) {
        const { data: file, error: dl } = await sb.storage.from("resumes").download(app.resume_path);
        if (dl || !file) throw new Error(`resume download failed: ${dl?.message}`);
        content.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: b64(new Uint8Array(await file.arrayBuffer())) } });
      }
      content.push({ type: "text", text: `APPLICATION FORM ANSWERS\n${formText}\n\nExtract the candidate profile as JSON.` });

      // 1. Parse with the PDF as a document block.
      const parsed: ParsedResume = normaliseParsed(parseJson(await claude(PARSE_PROMPT, content, 2500)));
      if (!parsed.name) parsed.name = app.candidate_name;
      if (!parsed.email) parsed.email = app.email;
      if (!parsed.total_experience_years && typeof answers.total_experience === "number") parsed.total_experience_years = answers.total_experience;
      if (typeof answers.skills === "string" && answers.skills.trim()) parsed.skills = [...new Set([...parsed.skills, ...answers.skills.split(",").map((s: string) => s.trim()).filter(Boolean)])];
      if (typeof answers.languages === "string" && answers.languages.trim()) for (const l of answers.languages.split(",").map((s: string) => s.trim()).filter(Boolean)) if (!parsed.languages.some((x) => x.name.toLowerCase() === l.toLowerCase())) parsed.languages.push({ name: l, read: true, write: true });

      // 2. Mechanical score.
      const criteria: Criteria = { min_education: null, min_experience_years: 0, required_languages: [], must_have_skills: [], good_to_have_skills: [], ...(job?.criteria ?? {}) };
      const mech = score(parsed, criteria);

      // 3. Rationale.
      const rationale = await claude(
        "You summarise candidate fit for a hiring manager. Honest, concise, no fluff. Under 140 words. Plain text, no markdown bold.",
        `JOB: ${job?.title}\nMin education: ${criteria.min_education ?? "any"} · Min experience: ${criteria.min_experience_years} years\nMust-have: ${criteria.must_have_skills.join(", ") || "none"}\nGood-to-have: ${criteria.good_to_have_skills.join(", ") || "none"}\nLanguages: ${criteria.required_languages.join(", ") || "none"}\n\nCANDIDATE: ${parsed.name}\nExperience: ${parsed.total_experience_years} years\nTop education: ${mech.breakdown.education.candidate_top ?? "unknown"}\nSkills: ${parsed.skills.slice(0, 30).join(", ")}\nRecent roles: ${parsed.experience.slice(0, 3).map((e) => `${e.role} at ${e.company} (${e.years}y)`).join("; ")}\nWhy this role (their words): ${String(answers.cover_letter ?? "").slice(0, 600) || "not given"}\n\nMECHANICAL: score ${mech.score}/100, hard filter ${mech.must_have_pass ? "PASS" : "FAIL"}; must-haves matched ${mech.breakdown.must_haves.matched.join(", ") || "none"}, missing ${mech.breakdown.must_haves.missing.join(", ") || "none"}.\n\nWrite exactly:\nStrengths\n- …\n- …\n- …\n\nGaps\n- …\n- …\n- …`,
        400,
      );

      await sb.from("applications").update({ parsed, score: mech.score, breakdown: mech.breakdown, must_have_pass: mech.must_have_pass, rationale, status: "screened", screened_at: new Date().toISOString() }).eq("id", app.id);
      return json({ ok: true, score: mech.score, must_have_pass: mech.must_have_pass });
    } catch (e) {
      await sb.from("applications").update({ status: "failed", screen_error: String((e as Error).message).slice(0, 500) }).eq("id", app.id);
      return json({ error: String((e as Error).message) }, 500);
    }
  } catch (e) {
    return json({ error: String((e as Error).message) }, 500);
  }
});
