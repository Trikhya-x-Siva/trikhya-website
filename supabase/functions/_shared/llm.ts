// Minimal chat-completion client. Sarvam (OpenAI-compatible) by default; Anthropic as an alternative.
// Keys come from Supabase secrets: SARVAM_API_KEY, ANTHROPIC_API_KEY.

export type Msg = { role: "system" | "user" | "assistant"; content: string };

export async function chat(provider: string, model: string, messages: Msg[], maxTokens = 600, temperature = 0.2): Promise<string> {
  if (provider === "anthropic") {
    const key = Deno.env.get("ANTHROPIC_API_KEY")?.trim(); if (!key) throw new Error("ANTHROPIC_API_KEY is not set");
    const system = messages.filter((m) => m.role === "system").map((m) => m.content).join("\n\n");
    const rest = messages.filter((m) => m.role !== "system").map((m) => ({ role: m.role, content: m.content }));
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model, max_tokens: maxTokens, temperature, system, messages: rest }),
    });
    if (!r.ok) throw new Error(`Anthropic ${r.status}: ${(await r.text()).slice(0, 300)}`);
    const j = await r.json();
    return (j.content ?? []).filter((b: { type: string }) => b.type === "text").map((b: { text: string }) => b.text).join("").trim();
  }
  const key = Deno.env.get("SARVAM_API_KEY")?.trim(); if (!key) throw new Error("SARVAM_API_KEY is not set");
  // sarvam-m was retired in 2026; map old settings rows forward.
  // sarvam-105b reasons first and, since October 2026, often spends the whole budget on it and returns no content.
  // The conversations variant answers directly, so legacy names map there.
  const m = model === "sarvam-m" || model === "sarvam-105b" || !model ? "sarvam-105b-conversations" : model;
  const r = await fetch("https://api.sarvam.ai/v1/chat/completions", {
    method: "POST", headers: { "api-subscription-key": key, "content-type": "application/json" },
    // Sarvam's current models reason before answering; keep that short and leave room for the answer itself.
    body: JSON.stringify({ model: m, messages, max_tokens: Math.max(maxTokens, 1200), temperature, reasoning_effort: "low" }),
  });
  if (!r.ok) throw new Error(`Sarvam ${r.status}: ${(await r.text()).slice(0, 300)}`);
  const j = await r.json();
  const msg = j.choices?.[0]?.message ?? {};
  const content = String(msg.content ?? "").trim();
  if (content) return content;
  // Budget exhausted inside the reasoning: salvage a JSON object from it if there is one.
  const reasoning = String(msg.reasoning_content ?? "");
  const a = reasoning.lastIndexOf("{"), b = reasoning.lastIndexOf("}");
  if (a >= 0 && b > a) return reasoning.slice(a, b + 1);
  throw new Error("Sarvam returned no answer text (finish_reason=" + (j.choices?.[0]?.finish_reason ?? "?") + ")");
}

/** Pull the JSON object out of a model reply, tolerating code fences, chatter, double-encoding and escaped quotes. */
export function parseJson<T>(raw: string): T {
  let s = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  for (let attempt = 0; attempt < 3; attempt++) {
    try { const v = JSON.parse(s); if (typeof v === "string") { s = v.trim(); continue; } if (v && typeof v === "object") return v as T; } catch { /* keep trying */ }
    const a = s.indexOf("{"), b = s.lastIndexOf("}");
    if (a >= 0 && b > a) {
      const inner = s.slice(a, b + 1);
      try { const v = JSON.parse(inner); if (typeof v === "string") { s = v.trim(); continue; } if (v && typeof v === "object") return v as T; } catch { /* keep trying */ }
      s = inner.replace(/\\"/g, '"');
      continue;
    }
    break;
  }
  throw new Error("Model did not return JSON");
}

/** Browser callers must come from one of our origins. Every function here is called from the browser, so a
 *  request with no Origin header is refused too. Add the Vercel project's own *.vercel.app hostname (never a
 *  wildcard: anyone can deploy to vercel.app) through the ALLOWED_ORIGINS secret, comma-separated. */
const ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "https://trikhya.ai,https://www.trikhya.ai,http://localhost:3000").split(",").map((s) => s.trim()).filter(Boolean);
export function allowedOrigin(req: Request) {
  const o = req.headers.get("Origin"); if (!o) return false;
  if (ORIGINS.includes(o)) return true;
  try { const h = new URL(o).hostname; return o.startsWith("https://") && (h === "trikhya.ai" || h.endsWith(".trikhya.ai")); } catch { return false; }
}

/** Stable, non-reversible id for the caller's network address, for per-visitor limits that a new session id cannot reset. */
export async function callerHash(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("cf-connecting-ip") || "unknown";
  const salt = Deno.env.get("IP_HASH_SALT") ?? "trikhya";
  const bytes = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}:${ip}`)));
  return Array.from(bytes.slice(0, 16)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
export const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "content-type": "application/json" } });
