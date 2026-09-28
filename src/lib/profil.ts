// Brukerens profil: navn, trinn og abonnement. Eleven kan endre navn og trinn,
// men bare lese abonnementet (det settes av Stripe-webhooken).

import { supabase } from "./supabase";

export type Profil = {
  navn: string | null;
  trinn: string | null;
  abonnement: string;
  abonnement_til: string | null;
  abonnement_avsluttes: boolean;
};

export async function hentProfil(): Promise<Profil | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("navn, trinn, abonnement, abonnement_til, abonnement_avsluttes")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function lagreTrinn(brukerId: string, trinn: string | null) {
  const { error } = await supabase.from("profiles").update({ trinn }).eq("id", brukerId);
  if (error) throw new Error(error.message);
}

export const harAbonnement = (p: Profil | null | undefined) => !!p && p.abonnement !== "gratis";

export const datoTekst = (iso: string) =>
  new Date(iso).toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" });
