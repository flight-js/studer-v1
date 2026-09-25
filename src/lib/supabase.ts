import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Den publiserbare nøkkelen er laget for å ligge i frontenden. Hva hver bruker
// får lese og skrive styres av RLS-reglene i supabase/migrations.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://sftkyswvnrdzisqambqv.supabase.co";
const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_iSU-Jyhllkbb8zE2jvu0zQ_VmDqvcYe";

export const supabase = createClient<Database>(url, key);
