// Godseye: answers only about Trikhya, from the knowledge text in godseye_settings. Logs every exchange.
import { createClient } from "jsr:@supabase/supabase-js@2";
import { chat, cors, json, parseJson } from "../_shared/llm.ts";

type Turn = { role: "user" | "assistant"; content: string };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const t0 = Date.now();
  try {
    const { session_id, question, history = [], path = null } = await req.json();
    if (typeof question !== "string" || !question.trim() || typeof session_id !== "string") return json({ error: "bad request" }, 400);
    const q = question.trim().slice(0, 600);
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: s } = await sb.from("godseye_settings").select("*").eq("id", 1).single();
    if (!s || !s.enabled) return json({ fallback: true, reason: "disabled" });

    // Caps: per day overall, per visitor session.
    const since = new Date(); since.setUTCHours(0, 0, 0, 0);
    const { count: today } = await sb.from("godseye_conversations").select("id", { count: "exact", head: true }).gte("ts", since.toISOString());
    if ((today ?? 0) >= s.daily_cap) return json({ fallback: true, reason: "cap" });
    const { count: mine } = await sb.from("godseye_conversations").select("id", { count: "exact", head: true }).eq("session_id", session_id);
    if ((mine ?? 0) >= s.max_turns) return json({ answer: s.handoff, in_scope: true, limited: true });

    const system = `You are Godseye, the website assistant of Trikhya Intelligence Foundry.
You answer ONLY questions about Trikhya: the company, what it does and has built, its services, approach, people-facing pages (insights, careers, contact), and how to work with it.
Everything you may state is in KNOWLEDGE below. Do not invent facts, numbers, clients or names. Never name a client.
If the question is not about Trikhya (weather, general knowledge, coding help, other companies, personal advice, anything else), it is OUT OF SCOPE.
If the visitor asks to talk to a person, quote a price, or something the knowledge does not cover, answer briefly with what you know and point them to the Contact page.
Reply in 1 to 3 short sentences, plain English, no markdown, no emojis.

Return ONLY JSON: {"in_scope": true|false, "answer": "..."}. When in_scope is false, set answer to an empty string.

KNOWLEDGE
${s.knowledge}`;

    const turns: Turn[] = (Array.isArray(history) ? history : []).slice(-8).filter((h: Turn) => h && (h.role === "user" || h.role === "assistant") && typeof h.content === "string").map((h: Turn) => ({ role: h.role, content: h.content.slice(0, 600) }));
    const raw = await chat(s.provider, s.model, [{ role: "system", content: system }, ...turns, { role: "user", content: q }], 350, 0.2);
    let in_scope = true, answer = "";
    try { const j = parseJson<{ in_scope: boolean; answer: string }>(raw); in_scope = j.in_scope !== false; answer = String(j.answer ?? "").trim(); }
    catch { answer = raw.trim(); }
    if (!in_scope || !answer) { in_scope = false; answer = s.refusal; }

    const latency_ms = Date.now() - t0;
    await sb.from("godseye_conversations").insert({ session_id, path, question: q, answer, in_scope, latency_ms, model: `${s.provider}/${s.model}` });
    return json({ answer, in_scope, latency_ms });
  } catch (e) {
    return json({ fallback: true, error: String((e as Error).message) }, 200);
  }
});
