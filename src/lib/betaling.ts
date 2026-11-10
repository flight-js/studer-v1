// Kall til edge-funksjonen «betaling» (supabase/functions/betaling). Selve
// abonnementet settes bare av Stripe-webhooken – her starter vi bare kjøpet
// eller ber Stripe avslutte/fortsette abonnementet.

import type { Plan } from "./priser";
import { supabase } from "./supabase";

// melding: tekst fra serveren som kan vises som den er (for eksempel fra databasen).
export class Betalingsfeil extends Error {
  constructor(
    public kode: string,
    public melding?: string
  ) {
    super(kode);
  }
}

async function kall<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke("betaling", { body });
  if (error) {
    let kode = error.name === "FunctionsFetchError" ? "nett" : "ukjent";
    let melding: string | undefined;
    const svar = (error as { context?: unknown }).context;
    if (svar instanceof Response) {
      const body = (await svar.json().catch(() => ({}))) as { feil?: string; melding?: string };
      kode = body.feil ?? kode;
      melding = body.melding;
    }
    throw new Betalingsfeil(kode, melding);
  }
  return data as T;
}

// vennKreditt: kroner fra en vennekode som trekkes fra første betaling («13,77»).
export type Betalingsokt = { clientSecret: string; publishableKey: string; provetid: boolean; vennKreditt: string | null };

// Serveren avgjør om eleven får prøveperiode (provetid) – ikke nettsiden.
// vennekode: kode fra en venn (VENN-1A2B3C), gir én uke som kreditt.
export const startBetaling = async (plan: Plan, vennekode?: string): Promise<Betalingsokt> => {
  const okt = await kall<Betalingsokt>({ handling: "start", plan, skjema: "elements", vennekode: vennekode || undefined });
  return { ...okt, provetid: okt.provetid === true, vennKreditt: okt.vennKreditt ?? null };
};

// Gratis tid kjøpt med poeng: verdien av dagene trekkes fra neste betaling.
// belop: kroner («13,77»), saldo: poengene som er igjen.
export const losInnGratisTid = (belonning: string) =>
  kall<{ saldo: number; belop: string; dager: number }>({ handling: "kreditt", belonning });

// Lenke til abonnementssiden som sender eleven tilbake dit hen var etter kjøpet.
export const abonnementHref = (neste?: string) =>
  `/abonnement${neste ? `?neste=${encodeURIComponent(neste)}` : ""}`;

// Bare adresser inne på Studer (ikke «//annen-side.no»).
export const tryggNeste = (neste: string | null) =>
  neste && neste.startsWith("/") && !neste.startsWith("//") ? neste : null;

export const endreFornyelse = (handling: "avslutt" | "fortsett") => kall<{ ok: true }>({ handling });

export function betalingsfeiltekst(e: unknown): string {
  const kode = e instanceof Betalingsfeil ? e.kode : "ukjent";
  switch (kode) {
    case "ikke-satt-opp":
      return "Betaling er ikke slått på ennå. Prøv igjen senere.";
    case "har-abonnement":
      return "Du har allerede et aktivt abonnement.";
    case "ingen-abonnement":
      return "Fant ikke noe aktivt abonnement.";
    case "ikke-innlogget":
      return "Du må logge inn på nytt.";
    case "nett":
      return "Fikk ikke kontakt med serveren. Sjekk nettet og prøv igjen.";
    case "vennekode":
      return "Koden fra vennen din kan ikke brukes. Sjekk at den er riktig, eller fjern den. Koder gjelder bare for nye abonnenter.";
    case "kreditt":
      return (e as Betalingsfeil).melding ?? "Fikk ikke løst inn gratis tid. Prøv igjen.";
    case "kreditt-uten-abonnement":
      return "Gratis tid trekkes fra neste betaling, så du trenger et aktivt abonnement.";
    case "kreditt-avsluttes":
      return "Abonnementet ditt avsluttes. Gratis tid kan bare brukes når abonnementet fortsetter.";
    default:
      return "Noe gikk galt. Prøv igjen om litt.";
  }
}
