// Kall til edge-funksjonen «betaling» (supabase/functions/betaling). Selve
// abonnementet settes bare av Stripe-webhooken – her starter vi bare kjøpet
// eller ber Stripe avslutte/fortsette abonnementet.

import type { Plan } from "./priser";
import { supabase } from "./supabase";

export class Betalingsfeil extends Error {
  constructor(public kode: string) {
    super(kode);
  }
}

async function kall<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke("betaling", { body });
  if (error) {
    let kode = error.name === "FunctionsFetchError" ? "nett" : "ukjent";
    const svar = (error as { context?: unknown }).context;
    if (svar instanceof Response) {
      kode = ((await svar.json().catch(() => ({}))) as { feil?: string }).feil ?? kode;
    }
    throw new Betalingsfeil(kode);
  }
  return data as T;
}

export const startBetaling = (plan: Plan) =>
  kall<{ clientSecret: string; publishableKey: string }>({ handling: "start", plan, skjema: "elements" });

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
    default:
      return "Noe gikk galt. Prøv igjen om litt.";
  }
}
