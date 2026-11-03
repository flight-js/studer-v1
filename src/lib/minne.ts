// Repetisjon som husker eleven: hvert kort og spørsmål eleven svarer på, får en
// plan for når det skal komme tilbake. Selve planen regnes ut i databasen
// (se husk_svar i migrasjonen 20261103120000_minne.sql).

import { REPETISJON, sjekk, type Flashcard, type Sporsmal } from "./pensum";
import { stokk, stokkAlternativer } from "./stokk";
import { supabase } from "./supabase";

export type Svar = { type: "kort" | "sporsmal"; nokkel: string; kan: boolean };

// Hvor mange kort og spørsmål som tas i én runde.
export const RUNDE = 20;

// Svarene sendes med én gang. Det siste kan være på vei når eleven er ferdig, så
// det som leser planen, venter på dem først.
let lagres: Promise<unknown> = Promise.resolve();

export function huskSvar(svar: Svar[]) {
  if (!svar.length) return;
  const kall = supabase
    .rpc("husk_svar", { p_svar: svar })
    .then(({ error }) => error && console.error("Kunne ikke lagre svaret:", error.message));
  lagres = Promise.all([lagres, kall]);
}

async function hentPlan() {
  await lagres;
  return sjekk(await supabase.rpc("repetisjon_i_dag"));
}

export async function hentRepetisjonsstatus() {
  const plan = await hentPlan();
  const kort = plan.filter((p) => p.type === "kort").length;
  return {
    antall: plan.length,
    kort,
    sporsmal: plan.length - kort,
    // Nøkkelen begynner med fagets ID.
    fag: new Set(plan.map((p) => p.nokkel.split(":")[0])).size,
  };
}

type Plassering = { temaId: string; temaNavn: string; fagNavn: string };
export type Repetisjonselement = Plassering &
  ({ type: "kort"; kort: Flashcard } | { type: "sporsmal"; sporsmal: Sporsmal });

// Samme kort kan stå i temaet og i repetisjonstemaet. Da vises det fra temaet.
function perNokkel<T extends { minne: string; temaer: { slug: string } }>(rader: T[]) {
  const ut = new Map<string, T>();
  for (const r of rader) {
    const funnet = ut.get(r.minne);
    if (!funnet || funnet.temaer.slug === REPETISJON) ut.set(r.minne, r);
  }
  return ut;
}

const plassering = (r: { tema_id: string; temaer: { navn: string; fag: { navn: string } } }): Plassering => ({
  temaId: r.tema_id,
  temaNavn: r.temaer.navn,
  fagNavn: r.temaer.fag.navn,
});

// Det svakeste velges ut først, men rekkefølgen stokkes, så fagene blandes.
export async function hentRepetisjon() {
  const plan = await hentPlan();
  const valgte = plan.slice(0, RUNDE);
  const nokler = (type: string) => valgte.filter((p) => p.type === type).map((p) => p.nokkel);
  const [kort, sporsmal] = await Promise.all([
    supabase
      .from("flashcards")
      .select("tema_id, begrep, forklaring, kjerne, kilde, minne, temaer(slug, navn, fag(navn))")
      .in("minne", nokler("kort")),
    supabase
      .from("quiz_sporsmal")
      .select("tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, kjerne, kilde, minne, temaer(slug, navn, fag(navn))")
      .in("minne", nokler("sporsmal")),
  ]);
  const elementer: Repetisjonselement[] = [
    ...[...perNokkel(sjekk(kort)).values()].map((r) => ({
      ...plassering(r),
      type: "kort" as const,
      kort: { begrep: r.begrep, forklaring: r.forklaring, kjerne: r.kjerne, kilde: r.kilde, minne: r.minne },
    })),
    ...[...perNokkel(sjekk(sporsmal)).values()].map((r) => ({
      ...plassering(r),
      type: "sporsmal" as const,
      sporsmal: stokkAlternativer({
        nokkel: r.nokkel,
        type: r.type as Sporsmal["type"],
        tekst: r.tekst,
        alternativer: r.alternativer,
        riktig: r.riktig,
        forklaring: r.forklaring,
        kjerne: r.kjerne,
        kilde: r.kilde,
        minne: r.minne,
      }),
    })),
  ];
  return { elementer: stokk(elementer), igjen: plan.length - valgte.length };
}
