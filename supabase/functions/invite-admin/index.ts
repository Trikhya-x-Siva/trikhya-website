// Invites a new admin. Only a signed-in admin may call it. Adds the email to the allow-list and returns a
// one-time invite link the admin hands to the teammate; opening it signs them in so they can set a password.
// No public sign-up exists, so an email on the allow-list can never be claimed by someone else.
import { createClient } from "jsr:@supabase/supabase-js@2";
import { allowedOrigin, cors, json } from "../_shared/llm.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (!allowedOrigin(req)) return json({ error: "forbidden" }, 403);
  try {
    const { email, redirect_to } = await req.json();
    const addr = String(email ?? "").trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(addr)) return json({ error: "valid email required" }, 400);
    // Only redirect back to one of our own origins.
    let redirectTo: string | undefined;
    try { const u = new URL(String(redirect_to ?? "")); if (allowedOrigin(new Request(u.origin, { headers: { Origin: u.origin } }))) redirectTo = u.origin + u.pathname; } catch { /* none */ }

    const auth = req.headers.get("Authorization") ?? "";
    const user = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: auth } } });
    const { data: isAdmin } = await user.rpc("is_admin");
    if (!isAdmin) return json({ error: "admins only" }, 403);

    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    await sb.from("admins").upsert({ email: addr }, { onConflict: "email" });

    // Existing auth user gets a magic link; a new one gets an invite. Both land signed in.
    const { data: existing } = await sb.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const has = (existing?.users ?? []).some((u) => (u.email ?? "").toLowerCase() === addr);
    const { data, error } = await sb.auth.admin.generateLink({ type: has ? "magiclink" : "invite", email: addr, options: { redirectTo } });
    if (error || !data?.properties?.action_link) return json({ error: error?.message ?? "could not create link" }, 500);
    return json({ ok: true, link: data.properties.action_link, existing: has });
  } catch (e) {
    return json({ error: String((e as Error).message) }, 500);
  }
});
