// Starts AI phone screening for one or more shortlisted candidates. Creates an interview row per
// candidate and hands the call to the interview bridge (an always-on service that joins the phone line
// to Sarvam speech and the interviewer model). Until the bridge is configured, rows wait as "queued".
import { createClient } from "jsr:@supabase/supabase-js@2";
import { allowedOrigin, cors, json } from "../_shared/llm.ts";

const BRIDGE_URL = Deno.env.get("INTERVIEW_BRIDGE_URL");
const BRIDGE_SECRET = Deno.env.get("INTERVIEW_SHARED_SECRET");

/** Normalise to E.164; bare 10-digit numbers are treated as Indian mobiles. */
function toE164(raw: string) {
  const n = String(raw).replace(/[^\d+]/g, "");
  if (n.startsWith("+")) return n;
  if (n.length === 10) return `+91${n}`;
  if (n.length === 12 && n.startsWith("91")) return `+${n}`;
  return `+${n}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (!allowedOrigin(req)) return json({ error: "forbidden" }, 403);
  try {
    const { application_ids } = await req.json();
    const ids: string[] = Array.isArray(application_ids) ? application_ids.filter((x) => typeof x === "string" && /^[0-9a-f-]{36}$/.test(x)).slice(0, 50) : [];
    if (!ids.length) return json({ error: "application_ids required" }, 400);

    const auth = req.headers.get("Authorization") ?? "";
    const user = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: auth } } });
    const { data: isAdmin } = await user.rpc("is_admin");
    if (!isAdmin) return json({ error: "admins only" }, 403);

    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: apps } = await sb.from("applications").select("id, job_id, candidate_name, phone, status, parsed").in("id", ids);
    const results: { application_id: string; interview_id?: string; status: string; error?: string }[] = [];

    for (const a of apps ?? []) {
      if (a.status !== "shortlisted") { results.push({ application_id: a.id, status: "skipped", error: "only shortlisted candidates are called" }); continue; }
      const phone = [a.phone, (a.parsed as { phone?: string } | null)?.phone].find((p) => p && String(p).replace(/\D/g, "").length >= 10);
      if (!phone) { results.push({ application_id: a.id, status: "skipped", error: "no valid phone number on file" }); continue; }
      // One live interview at a time per candidate.
      const { data: open } = await sb.from("interviews").select("id").eq("application_id", a.id).in("status", ["queued", "initiating", "ringing", "in_progress"]).limit(1);
      if (open?.length) { results.push({ application_id: a.id, interview_id: open[0].id, status: "already_running" }); continue; }

      const { data: iv, error: ivErr } = await sb.from("interviews").insert({ application_id: a.id, job_id: a.job_id, status: "queued" }).select().single();
      if (!iv) { results.push({ application_id: a.id, status: "failed", error: `could not create interview (${ivErr?.message ?? "unknown"}; has migration 0004 been run?)` }); continue; }

      if (!BRIDGE_URL || !BRIDGE_SECRET) {
        await sb.from("interviews").update({ error: "Calling is not connected yet: the interview bridge and a phone number need to be set up." }).eq("id", iv.id);
        results.push({ application_id: a.id, interview_id: iv.id, status: "queued" });
        continue;
      }
      try {
        const { data: job } = await sb.from("jobs").select("title, summary, requirements, criteria").eq("id", a.job_id).single();
        const r = await fetch(`${BRIDGE_URL.replace(/\/$/, "")}/start`, {
          method: "POST", headers: { "content-type": "application/json", "x-interview-secret": BRIDGE_SECRET },
          body: JSON.stringify({ interview_id: iv.id, to: toE164(phone), candidate: { name: a.candidate_name }, job }),
        });
        if (!r.ok) throw new Error(`bridge ${r.status}: ${(await r.text()).slice(0, 200)}`);
        const j = await r.json().catch(() => ({}));
        await sb.from("interviews").update({ status: "initiating", call_sid: j.call_sid ?? null }).eq("id", iv.id);
        results.push({ application_id: a.id, interview_id: iv.id, status: "initiating" });
      } catch (e) {
        await sb.from("interviews").update({ status: "failed", error: String((e as Error).message).slice(0, 300) }).eq("id", iv.id);
        results.push({ application_id: a.id, interview_id: iv.id, status: "failed", error: String((e as Error).message) });
      }
    }
    return json({ ok: true, configured: !!(BRIDGE_URL && BRIDGE_SECRET), results });
  } catch (e) {
    return json({ error: String((e as Error).message) }, 500);
  }
});
