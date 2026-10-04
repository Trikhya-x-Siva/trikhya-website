// Minimal chat-completion client. Sarvam (OpenAI-compatible) by default; Anthropic as an alternative.
// Keys come from Supabase secrets: SARVAM_API_KEY, ANTHROPIC_API_KEY.

export type Msg = { role: "system" | "user" | "assistant"; content: string };

export async function chat(provider: string, model: string, messages: Msg[], maxTokens = 600, temperature = 0.2): Promise<string> {
  if (provider === "anthropic") {
    const key = Deno.env.get("ANTHROPIC_API_KEY"); if (!key) throw new Error("ANTHROPIC_API_KEY is not set");
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
  const key = Deno.env.get("SARVAM_API_KEY"); if (!key) throw new Error("SARVAM_API_KEY is not set");
  const r = await fetch("https://api.sarvam.ai/v1/chat/completions", {
    method: "POST", headers: { "api-subscription-key": key, "content-type": "application/json" },
    body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature }),
  });
  if (!r.ok) throw new Error(`Sarvam ${r.status}: ${(await r.text()).slice(0, 300)}`);
  const j = await r.json();
  return String(j.choices?.[0]?.message?.content ?? "").trim();
}

/** Pull the first JSON object out of a model reply, tolerating code fences and chatter. */
export function parseJson<T>(raw: string): T {
  const s = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  try { return JSON.parse(s) as T; } catch { /* fall through */ }
  const a = s.indexOf("{"), b = s.lastIndexOf("}");
  if (a >= 0 && b > a) return JSON.parse(s.slice(a, b + 1)) as T;
  throw new Error("Model did not return JSON");
}

export const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
export const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "content-type": "application/json" } });
