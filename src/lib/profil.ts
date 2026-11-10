// Brukerens profil: navn, trinn og abonnement. Eleven kan endre navn og trinn,
// men bare lese abonnementet og prøveperioden (de settes av Stripe-webhooken)
// og gaven fra en venn (settes av databasen når gaven løses inn).

import { supabase } from "./supabase";

export type Profil = {
  navn: string | null;
  trinn: string | null;
  abonnement: string;
  abonnement_til: string | null;
  abonnement_avsluttes: boolean;
  provetid_til: string | null; // satt mens prøveperioden varer
  provetid_brukt: boolean; // har hatt prøveperiode eller abonnement før
  gave_til: string | null; // gratis tilgang fra en venn til dette tidspunktet
};

export async function hentProfil(): Promise<Profil | null> {
  // «*» i stedet for kolonnenavn: da virker siden også før kolonnen gave_til
  // finnes i databasen (migrasjonen for konkurransen).
  const { data, error } = await supabase.from("profiles").select("*").maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return {
    navn: data.navn,
    trinn: data.trinn,
    abonnement: data.abonnement,
    abonnement_til: data.abonnement_til,
    abonnement_avsluttes: data.abonnement_avsluttes,
    provetid_til: data.provetid_til,
    provetid_brukt: data.provetid_brukt,
    gave_til: data.gave_til ?? null,
  };
}

export async function lagreTrinn(brukerId: string, trinn: string | null) {
  const { error } = await supabase.from("profiles").update({ trinn }).eq("id", brukerId);
  if (error) throw new Error(error.message);
}

// Abonnement eller prøveperiode i Stripe.
export const harAbonnement = (p: Profil | null | undefined) => !!p && p.abonnement !== "gratis";

// Gratis tilgang fra en venn som ikke har gått ut ennå.
export const harGave = (p: Profil | null | undefined) => !!p?.gave_til && Date.parse(p.gave_til) > Date.now();

// Samme regel som public.har_tilgang() i databasen, som er den som faktisk låser innholdet.
export const harTilgang = (p: Profil | null | undefined) => harAbonnement(p) || harGave(p);

// Kan starte prøveperiode. Serveren sjekker også e-post og kort, så dette er bare et første svar.
export const kanProve = (p: Profil | null | undefined) => !!p && !p.provetid_brukt && !harAbonnement(p);

export const datoTekst = (iso: string) =>
  new Date(iso).toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" });
