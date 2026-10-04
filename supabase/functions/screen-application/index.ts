// Screens one application: extract resume text, structure it with the model, score it against the
// role's criteria, write a short rationale. Runs with the service role; the browser only passes an id.
import { createClient } from "jsr:@supabase/supabase-js@2";
import { extractText, getDocumentProxy } from "npm:unpdf@0.12.1";
import { chat, cors, json, parseJson } from "../_shared/llm.ts";
import { normaliseParsed, score, type Criteria, type ParsedResume } from "../_shared/scoring.ts";

const PARSE_PROMPT = `You are extracting candidate information from a resume for a hiring system.
Return ONLY a JSON object with exactly this schema (use null or [] when not found, never invent):
{"name":string|null,"email":string|null,"phone":string|null,
 "education":[{"degree":string,"field":string|null,"year":number|null,"institution":string|null}],
 "experience":[{"company":string,"role":string,"years":number,"summary":string}],
 "total_experience_years":number,
 "skills":[string],
 "languages":[{"name":string,"read":boolean,"write":boolean}]}
Rules: skills come from any skills/tools section AND from experience bullets, each listed individually.
Years are decimals (e.g. 2.5). total_experience_years is the sum of experience.years, without double counting overlaps.
For languages, if proficiency is unspecified mark read and write true; if only spoken or conversational, mark both false.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { application_id } = await req.json();
    if (!application_id || typeof application_id !== "string") return json({ error: "application_id required" }, 400);
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: app, error } = await sb.from("applications").select("*").eq("id", application_id).single();
    if (error || !app) return json({ error: "application not found" }, 404);
    if (!["new", "failed"].includes(app.status)) return json({ ok: true, skipped: app.status });
    await sb.from("applications").update({ status: "screening", screen_error: null }).eq("id", app.id);

    const { data: job } = await sb.from("jobs").select("*").eq("id", app.job_id).single();
    const { data: settings } = await sb.from("godseye_settings").select("provider, model").eq("id", 1).single();
    const provider = settings?.provider ?? "sarvam", model = settings?.model ?? "sarvam-105b";

    try {
      // 1. Resume text (first ~12k characters is plenty for a resume).
      let text = "";
      if (app.resume_path) {
        const { data: file, error: dl } = await sb.storage.from("resumes").download(app.resume_path);
        if (dl || !file) throw new Error(`resume download failed: ${dl?.message}`);
        const pdf = await getDocumentProxy(new Uint8Array(await file.arrayBuffer()));
        text = (await extractText(pdf, { mergePages: true })).text.replace(/\s+\n/g, "\n").slice(0, 12000);
      }
      const answers = app.answers ?? {};
      const formText = Object.entries(answers).map(([k, v]) => `${k}: ${v}`).join("\n");

      // 2. Structure with the model.
      const raw = await chat(provider, model, [
        { role: "system", content: PARSE_PROMPT },
        { role: "user", content: `APPLICATION FORM\n${formText}\n\nRESUME TEXT\n${text || "(no resume text could be extracted)"}` },
      ], 1800, 0);
      const parsed: ParsedResume = normaliseParsed(parseJson(raw));
      if (!parsed.name) parsed.name = app.candidate_name;
      if (!parsed.email) parsed.email = app.email;
      // Trust the form's experience number if the resume gave nothing.
      if (!parsed.total_experience_years && typeof answers.total_experience === "number") parsed.total_experience_years = answers.total_experience;
      if (typeof answers.skills === "string" && answers.skills.trim()) parsed.skills = [...new Set([...parsed.skills, ...answers.skills.split(",").map((s: string) => s.trim()).filter(Boolean)])];
      if (typeof answers.languages === "string" && answers.languages.trim()) for (const l of answers.languages.split(",").map((s: string) => s.trim()).filter(Boolean)) if (!parsed.languages.some((x) => x.name.toLowerCase() === l.toLowerCase())) parsed.languages.push({ name: l, read: true, write: true });

      // 3. Mechanical score.
      const criteria: Criteria = { min_education: null, min_experience_years: 0, required_languages: [], must_have_skills: [], good_to_have_skills: [], ...(job?.criteria ?? {}) };
      const mech = score(parsed, criteria);

      // 4. Rationale.
      const rationale = await chat(provider, model, [
        { role: "system", content: "You summarise candidate fit for a hiring manager. Honest, concise, no fluff. Under 140 words." },
        { role: "user", content: `JOB: ${job?.title}\nMin education: ${criteria.min_education ?? "any"} · Min experience: ${criteria.min_experience_years} years\nMust-have: ${criteria.must_have_skills.join(", ") || "none"}\nGood-to-have: ${criteria.good_to_have_skills.join(", ") || "none"}\nLanguages: ${criteria.required_languages.join(", ") || "none"}\n\nCANDIDATE: ${parsed.name}\nExperience: ${parsed.total_experience_years} years\nTop education: ${mech.breakdown.education.candidate_top ?? "unknown"}\nSkills: ${parsed.skills.slice(0, 30).join(", ")}\nRecent roles: ${parsed.experience.slice(0, 3).map((e) => `${e.role} at ${e.company} (${e.years}y)`).join("; ")}\nWhy this role (their words): ${String(answers.cover_letter ?? "").slice(0, 600) || "not given"}\n\nMECHANICAL: score ${mech.score}/100, hard filter ${mech.must_have_pass ? "PASS" : "FAIL"}; must-haves matched ${mech.breakdown.must_haves.matched.join(", ") || "none"}, missing ${mech.breakdown.must_haves.missing.join(", ") || "none"}.\n\nWrite exactly:\nStrengths\n- …\n- …\n- …\n\nGaps\n- …\n- …\n- …` },
      ], 400, 0.3);

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
