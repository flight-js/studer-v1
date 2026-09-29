// Miniprøven: skriveoppgaver som KI retter (edge-funksjonen «vurder») og noen
// raske flervalgs- og sant/usant-spørsmål. Riktig svar gir 1 poeng, delvis
// riktig på en skriveoppgave gir ½.

import type { ProveSporsmal, Skriveoppgave } from "./pensum";
import { supabase } from "./supabase";

export const ANTALL_SKRIV = 5;
export const ANTALL_RASKE = 5;
export const MAKS_SVAR = 1500; // tegn, samme grense som i «vurder»

export type Vurdering = {
  vurdering: "riktig" | "delvis" | "feil";
  poeng: number;
  tilbakemelding: string;
  fasit: string;
};

function stokk<T>(liste: T[]): T[] {
  const ut = [...liste];
  for (let i = ut.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ut[i], ut[j]] = [ut[j], ut[i]];
  }
  return ut;
}

// Trekker oppgavene til én prøve, så den blir litt annerledes hver gang.
// Raske spørsmål hentes helst fra dem som ikke også er i quizen. Mangler
// temaet skriveoppgaver, fylles prøven opp med raske spørsmål.
export function settSammen(raske: ProveSporsmal[], skriv: Skriveoppgave[]) {
  const valgteSkriv = stokk(skriv).slice(0, ANTALL_SKRIV);
  const antallRaske = ANTALL_RASKE + ANTALL_SKRIV - valgteSkriv.length;
  const valgteRaske = [
    ...stokk(raske.filter((q) => q.kunProve)),
    ...stokk(raske.filter((q) => !q.kunProve)),
  ].slice(0, antallRaske);
  return { raske: valgteRaske, skriv: valgteSkriv };
}

export class Vurderingsfeil extends Error {
  constructor(
    public kode: string,
    public grunn?: string
  ) {
    super(kode);
  }
}

export async function vurderSvar(temaId: string, nokkel: string, svar: string): Promise<Vurdering> {
  const { data, error } = await supabase.functions.invoke("vurder", { body: { temaId, nokkel, svar } });
  if (error) {
    let kode = error.name === "FunctionsFetchError" ? "nett" : "ukjent";
    let grunn: string | undefined;
    const res = (error as { context?: unknown }).context;
    if (res instanceof Response) {
      const body = (await res.json().catch(() => ({}))) as { feil?: string; grunn?: string };
      kode = body.feil ?? kode;
      grunn = body.grunn;
    }
    throw new Vurderingsfeil(kode, grunn);
  }
  return data as Vurdering;
}

export function vurderingsfeiltekst(e: unknown): string {
  const f = e instanceof Vurderingsfeil ? e : new Vurderingsfeil("ukjent");
  switch (f.kode) {
    case "grense":
      return f.grunn === "global"
        ? "Rettingen har mye pågang akkurat nå. Prøv igjen litt senere."
        : "Du har tatt mange prøver i dag. Prøv igjen i morgen.";
    case "abonnement":
      return "Rettingen er med i abonnementet.";
    case "ikke-innlogget":
      return "Du må logge inn på nytt.";
    case "nett":
      return "Fikk ikke kontakt med serveren. Sjekk nettet.";
    case "ikke-satt-opp":
      return "Rettingen er ikke slått på ennå.";
    default:
      return "Rettingen feilet. Prøv igjen.";
  }
}

// 7.5 → «7,5»
export const poengTekst = (n: number) => n.toLocaleString("nb-NO", { maximumFractionDigits: 1 });
