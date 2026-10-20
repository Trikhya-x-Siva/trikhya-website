import { supabase } from "./supabase";

/** The one address for everything: enquiries, careers, privacy. */
export const CONTACT_EMAIL = "connect@trikhya.ai";
export const MAILTO = `mailto:${CONTACT_EMAIL}?subject=Project%20enquiry%20for%20Trikhya`;

export type MessageInput = { name: string; email: string; company: string; message: string };

/** Stores a Contact-page message in Supabase. Admins read them on the dashboard's Messages tab. */
export async function sendMessage(m: MessageInput): Promise<void> {
  const sb = supabase(); if (!sb) throw new Error(`The form is not available right now. Please email ${CONTACT_EMAIL}.`);
  let session_id: string | null = null; try { session_id = sessionStorage.getItem("trikhya-session"); } catch { /* ignore */ }
  const { error } = await sb.from("messages").insert({ name: m.name.trim(), email: m.email.trim(), company: m.company.trim() || null, message: m.message.trim(), session_id });
  if (error) throw new Error(error.message.includes("row-level security") ? `Please check the fields: a name, a valid email and a message of at least a few words.` : `${error.message}. You can also email ${CONTACT_EMAIL}.`);
}
