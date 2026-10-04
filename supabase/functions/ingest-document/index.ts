// Turns an uploaded Godseye document (PDF, text or markdown) into plain text stored on its row.
// Called by the admin UI right after upload. Requires an admin's session token.
import { createClient } from "jsr:@supabase/supabase-js@2";
import { extractText, getDocumentProxy } from "npm:unpdf@0.12.1";
import { allowedOrigin, cors, json } from "../_shared/llm.ts";

const MAX_CHARS = 60000;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (!allowedOrigin(req)) return json({ error: "forbidden" }, 403);
  try {
    const { document_id } = await req.json();
    if (typeof document_id !== "string" || !/^[0-9a-f-]{36}$/.test(document_id)) return json({ error: "document_id required" }, 400);

    // Only an admin may trigger ingestion: verify the caller's JWT via the user-scoped client.
    const auth = req.headers.get("Authorization") ?? "";
    const user = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: auth } } });
    const { data: isAdmin } = await user.rpc("is_admin");
    if (!isAdmin) return json({ error: "admins only" }, 403);

    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: doc } = await sb.from("godseye_documents").select("*").eq("id", document_id).single();
    if (!doc) return json({ error: "not found" }, 404);
    try {
      const { data: file, error } = await sb.storage.from("godseye-docs").download(doc.storage_path);
      if (error || !file) throw new Error(`download failed: ${error?.message}`);
      let text = "";
      if (doc.kind === "pdf") {
        const pdf = await getDocumentProxy(new Uint8Array(await file.arrayBuffer()));
        text = (await extractText(pdf, { mergePages: true })).text;
      } else text = await file.text();
      text = text.replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim().slice(0, MAX_CHARS);
      if (!text) throw new Error("no readable text found (scanned PDF?)");
      await sb.from("godseye_documents").update({ content: text, chars: text.length, status: "ready", error: null }).eq("id", doc.id);
      return json({ ok: true, chars: text.length });
    } catch (e) {
      await sb.from("godseye_documents").update({ status: "failed", error: String((e as Error).message).slice(0, 300) }).eq("id", doc.id);
      return json({ error: String((e as Error).message) }, 500);
    }
  } catch (e) {
    return json({ error: String((e as Error).message) }, 500);
  }
});
