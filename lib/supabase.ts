import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Public project values. The publishable key is designed to be shipped to browsers; row-level security
// decides what it can do. Environment variables still override these for another project or a staging copy.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hbtrjucvxotoshqjctnx.supabase.co";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_vxq2nZeL4776rvSiG5lUQQ__DbTPBRJ";

let client: SupabaseClient | null = null;

/** Browser client with the publishable key. Safe to ship: RLS limits it to inserting events and, when signed in as an admin, reading them. */
export function supabase(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  if (!client) client = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "implicit" } });
  return client;
}
