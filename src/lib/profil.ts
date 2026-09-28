// Brukerens profil: navn, trinn og abonnement. Eleven kan endre navn og trinn,
// men bare lese abonnementet (det settes av betalingsløsningen).

import { supabase } from "./supabase";

export type Profil = { navn: string | null; trinn: string | null; abonnement: string };

export async function hentProfil(): Promise<Profil | null> {
  const { data, error } = await supabase.from("profiles").select("navn, trinn, abonnement").maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function lagreTrinn(brukerId: string, trinn: string | null) {
  const { error } = await supabase.from("profiles").update({ trinn }).eq("id", brukerId);
  if (error) throw new Error(error.message);
}
