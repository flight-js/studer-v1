// Henter pensum og fremdrift fra Supabase. Innholdet ligger bare i databasen;
// fag- og temaoversikten kan leses av alle, selve innholdet krever innlogging.

import { supabase } from "./supabase";

export type FagKort = { id: string; navn: string; antallTemaer: number };
export type TrinnMedFag = { id: string; navn: string; fag: FagKort[] };

export type TemaKort = {
  id: string;
  slug: string;
  navn: string;
  intro: string;
  status: string;
};

export type TemaDetaljer = TemaKort & {
  fagId: string;
  fagNavn: string;
  trinnId: string;
  trinnNavn: string;
  nummer: number;
  antallTemaer: number;
};

export type Flashcard = { begrep: string; forklaring: string };

export type Sporsmal = {
  nokkel: string;
  type: "flervalg" | "sant-usant";
  tekst: string;
  alternativer: string[];
  riktig: number;
  forklaring: string;
};

export type Tankekart = { label: string; note?: string; children?: Tankekart[] };

export type Aktivitet = "flashcards" | "quiz" | "miniprove";
export type Resultat = { beste: number; av: number; sistOvd: string };
export type Fremdrift = Partial<Record<Aktivitet, Resultat>>;

function sjekk<R extends { data: unknown; error: { message: string } | null }>(svar: R) {
  if (svar.error) throw new Error(svar.error.message);
  if (svar.data == null) throw new Error("Fant ikke innholdet.");
  return svar.data as NonNullable<R["data"]>;
}

// Tema-ID-er er «<fag>:<slug>». I adresser brukes ?fag=…&tema=… i stedet.
export const temaId = (fagId: string, slug: string) => `${fagId}:${slug}`;
export const temaHref = (side: string, id: string) => {
  const [fag, tema] = id.split(":");
  return `${side}?fag=${encodeURIComponent(fag)}&tema=${encodeURIComponent(tema)}`;
};

export async function hentKatalog(): Promise<TrinnMedFag[]> {
  const rader = sjekk(
    await supabase
      .from("trinn")
      .select("id, navn, fag(id, navn, sortering, temaer(count))")
      .order("sortering")
      .order("sortering", { referencedTable: "fag" })
  );
  return rader.map((t) => ({
    id: t.id,
    navn: t.navn,
    fag: t.fag.map((f) => ({ id: f.id, navn: f.navn, antallTemaer: f.temaer[0]?.count ?? 0 })),
  }));
}

export async function hentTemaer(fagId: string): Promise<TemaKort[]> {
  return sjekk(
    await supabase
      .from("temaer")
      .select("id, slug, navn, intro, status")
      .eq("fag_id", fagId)
      .order("sortering")
  );
}

export async function hentTema(id: string): Promise<TemaDetaljer> {
  const t = sjekk(
    await supabase
      .from("temaer")
      .select("id, slug, navn, intro, status, sortering, fag(id, navn, trinn(id, navn))")
      .eq("id", id)
      .maybeSingle()
  );
  const alle = sjekk(
    await supabase.from("temaer").select("id").eq("fag_id", t.fag.id).order("sortering")
  );
  return {
    id: t.id,
    slug: t.slug,
    navn: t.navn,
    intro: t.intro,
    status: t.status,
    fagId: t.fag.id,
    fagNavn: t.fag.navn,
    trinnId: t.fag.trinn.id,
    trinnNavn: t.fag.trinn.navn,
    nummer: alle.findIndex((a) => a.id === t.id) + 1,
    antallTemaer: alle.length,
  };
}

export async function hentOmfang(id: string) {
  const antall = async (q: PromiseLike<{ count: number | null; error: { message: string } | null }>) => {
    const { count, error } = await q;
    if (error) throw new Error(error.message);
    return count ?? 0;
  };
  const sporsmal = () =>
    supabase.from("quiz_sporsmal").select("*", { count: "exact", head: true }).eq("tema_id", id);
  const [flashcards, quiz, miniprove, prove] = await Promise.all([
    antall(supabase.from("flashcards").select("*", { count: "exact", head: true }).eq("tema_id", id)),
    antall(sporsmal().eq("i_quiz", true)),
    antall(sporsmal().eq("i_miniprove", true)),
    supabase.from("miniprover").select("minutter").eq("tema_id", id).maybeSingle(),
  ]);
  return { flashcards, quiz, miniprove, minutter: prove.data?.minutter ?? 0 };
}

export async function hentFlashcards(id: string): Promise<Flashcard[]> {
  return sjekk(
    await supabase.from("flashcards").select("begrep, forklaring").eq("tema_id", id).order("sortering")
  );
}

async function hentSporsmal(id: string, filter: "i_quiz" | "i_miniprove"): Promise<Sporsmal[]> {
  const rader = sjekk(
    await supabase
      .from("quiz_sporsmal")
      .select("nokkel, type, tekst, alternativer, riktig, forklaring")
      .eq("tema_id", id)
      .eq(filter, true)
      .order("sortering")
  );
  return rader as Sporsmal[];
}

export const hentQuiz = (id: string) => hentSporsmal(id, "i_quiz");

export async function hentMiniprove(id: string) {
  const [sporsmal, prove] = await Promise.all([
    hentSporsmal(id, "i_miniprove"),
    supabase.from("miniprover").select("minutter").eq("tema_id", id).maybeSingle(),
  ]);
  return { sporsmal, minutter: sjekk(prove).minutter };
}

export async function hentSammendrag(id: string) {
  const r = sjekk(
    await supabase.from("tema_innhold").select("sammendrag, tankekart").eq("tema_id", id).maybeSingle()
  );
  return { sammendrag: r.sammendrag, tankekart: r.tankekart as unknown as Tankekart };
}

// Fremdrift ---------------------------------------------------------------------

export async function hentFremdrift(temaIder: string[]): Promise<Record<string, Fremdrift>> {
  if (!temaIder.length) return {};
  const rader = sjekk(
    await supabase
      .from("fremdrift")
      .select("tema_id, aktivitet, beste, av, sist_ovd")
      .in("tema_id", temaIder)
  );
  const ut: Record<string, Fremdrift> = {};
  for (const r of rader) {
    (ut[r.tema_id] ??= {})[r.aktivitet as Aktivitet] = { beste: r.beste, av: r.av, sistOvd: r.sist_ovd };
  }
  return ut;
}

// Andel av temaet som er gjennomgått: snittet av beste resultat i de tre
// øvingsformene (en form man ikke har prøvd, teller som 0).
export function prosentGjennomgatt(f: Fremdrift | undefined): number {
  if (!f) return 0;
  const deler = (["flashcards", "quiz", "miniprove"] as const).map((a) =>
    f[a] ? f[a].beste / f[a].av : 0
  );
  return Math.round((deler.reduce((s, x) => s + x, 0) / deler.length) * 100);
}

export function sistOvd(f: Fremdrift | undefined): string | null {
  const datoer = Object.values(f ?? {}).map((r) => r.sistOvd);
  if (!datoer.length) return null;
  const sist = new Date(datoer.sort().at(-1)!);
  const dager = Math.floor(
    (new Date().setHours(0, 0, 0, 0) - new Date(sist).setHours(0, 0, 0, 0)) / 86_400_000
  );
  if (dager <= 0) return "Sist øvd i dag";
  if (dager === 1) return "Sist øvd i går";
  if (dager < 7) return `Sist øvd for ${dager} dager siden`;
  return `Sist øvd ${sist.toLocaleDateString("nb-NO", { day: "numeric", month: "long" })}`;
}

export async function lagreResultat(id: string, aktivitet: Aktivitet, resultat: number, av: number) {
  const { error } = await supabase.rpc("lagre_resultat", {
    p_tema_id: id,
    p_aktivitet: aktivitet,
    p_resultat: resultat,
    p_av: av,
  });
  if (error) console.error("Kunne ikke lagre resultatet:", error.message);
}
