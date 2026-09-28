// Brukerens profil: navn, trinn og abonnement. Eleven kan endre navn og trinn,
// men bare lese abonnementet og prøveperioden (de settes av Stripe-webhooken).

import { supabase } from "./supabase";

export type Profil = {
  navn: string | null;
  trinn: string | null;
  abonnement: string;
  abonnement_til: string | null;
  abonnement_avsluttes: boolean;
  provetid_til: string | null; // satt mens prøveperioden varer
  provetid_brukt: boolean; // har hatt prøveperiode eller abonnement før
};

export async function hentProfil(): Promise<Profil | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("navn, trinn, abonnement, abonnement_til, abonnement_avsluttes, provetid_til, provetid_brukt")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function lagreTrinn(brukerId: string, trinn: string | null) {
  const { error } = await supabase.from("profiles").update({ trinn }).eq("id", brukerId);
  if (error) throw new Error(error.message);
}

// Samme regel som public.har_tilgang() i databasen, som er den som faktisk låser innholdet.
export const harAbonnement = (p: Profil | null | undefined) => !!p && p.abonnement !== "gratis";

// Kan starte prøveperiode. Serveren sjekker også e-post og kort, så dette er bare et første svar.
export const kanProve = (p: Profil | null | undefined) => !!p && !p.provetid_brukt && !harAbonnement(p);

export const datoTekst = (iso: string) =>
  new Date(iso).toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" });
