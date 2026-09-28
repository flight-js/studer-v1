import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Den publiserbare nøkkelen er laget for å ligge i frontenden. Hva hver bruker
// får lese og skrive styres av RLS-reglene i supabase/migrations.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://sftkyswvnrdzisqambqv.supabase.co";
export const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "sb_publishable_iSU-Jyhllkbb8zE2jvu0zQ_VmDqvcYe";

// Navnet økten lagres under i localStorage (samme som supabase-js sin standard).
// Forsiden bruker det til å se om noen er logget inn før siden tegnes.
export const oktNokkel = `sb-${new URL(supabaseUrl).hostname.split(".")[0]}-auth-token`;

// Økten lagres i localStorage (riktig for en statisk app). Vi bruker koder på
// e-post i stedet for lenker, så det finnes ingen token i adressen å lete etter.
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
});
