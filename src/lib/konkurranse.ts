// Konkurranse: poeng, rangeringer, skoler og belønninger (UTKAST).
//
// Alt går gjennom funksjonene i supabase/migrations/20261109120000_konkurranse.sql.
// Er ikke migrasjonen kjørt ennå, svarer funksjonene med eksempeldata og
// demo: true, så sidene kan prøves – og sidene viser tydelig at tallene ikke er ekte.

import { ryddKallenavn } from "./kallenavn";
import { supabase } from "./supabase";

export type Med<T> = { data: T; demo: boolean };

export type Poengstatus = { saldo: number; denneUka: number; iDag: number; tak: number; streak: number };
// navn: fornavnet eller kallenavnet, eller «Deg» for eleven selv når hen ikke er
// synlig for andre (har skjult fornavnet uten å velge kallenavn).
export type Plassering = { plass: number; navn: string; skole: string | null; poeng: number; erMeg: boolean };
export type Skoleplass = {
  plass: number;
  skoleId: string;
  skole: string;
  kommune: string;
  elever: number;
  poeng: number;
  snitt: number;
  erMin: boolean;
};
export type Toppplass = { plass: number; navn: string; skole: string | null; tidMs: number; erMeg: boolean; antall: number };
export type Avslutning = { tidMs: number; teller: boolean; forrigeBeste: number | null; poeng: number };
export type Belonning = {
  id: string;
  partner: string;
  tittel: string;
  beskrivelse: string;
  vilkar: string;
  lenke: string | null;
  poengpris: number;
  gyldigTil: string | null;
  igjen: number;
  innlostAvMeg: boolean;
};
export type Kupong = {
  kode: string;
  partner: string;
  tittel: string;
  lenke: string | null;
  vilkar: string;
  gyldigTil: string | null;
  innlost: string;
};
export type Skole = { id: string; navn: string; kommune: string };
// skjulFornavn: «Ikke vis fornavnet mitt på rangeringene». kallenavn: vises i
// stedet; uten kallenavn vises eleven ikke for andre.
export type Konkurranseprofil = { skole: Skole | null; skjulFornavn: boolean; kallenavn: string | null };
export type Omrade = "alle" | "skole" | "trinn";

// Feilkodene PostgREST og Postgres gir når funksjonen, kolonnen eller tabellen
// ikke finnes – altså når migrasjonen ikke er kjørt.
const IKKE_SATT_OPP = new Set(["PGRST200", "PGRST202", "PGRST204", "PGRST205", "42883", "42703", "42P01"]);
const ikkeSattOpp = (e: { code?: string } | null) => !!e?.code && IKKE_SATT_OPP.has(e.code);

function svar<T>(res: { data: unknown; error: { message: string; code?: string } | null }, demo: T): Med<T> | null {
  if (res.error) {
    if (ikkeSattOpp(res.error)) return { data: demo, demo: true };
    throw new Error(res.error.message);
  }
  return null;
}

// ---------------------------------------------------------------- Poeng og lister

export async function hentPoengstatus(): Promise<Med<Poengstatus>> {
  const res = await supabase.rpc("min_poengstatus");
  const demo = svar(res, EKSEMPEL.status);
  if (demo) return demo;
  const r = res.data?.[0];
  return {
    demo: false,
    data: r
      ? { saldo: r.saldo, denneUka: r.denne_uka, iDag: r.i_dag, tak: r.tak, streak: r.streak }
      : { saldo: 0, denneUka: 0, iDag: 0, tak: 150, streak: 0 },
  };
}

export async function hentPoengliste(omrade: Omrade): Promise<Med<Plassering[]>> {
  const res = await supabase.rpc("poengliste", { p_omrade: omrade, p_antall: 50 });
  const demo = svar(res, EKSEMPEL.poengliste[omrade]);
  if (demo) return demo;
  return {
    demo: false,
    data: (res.data ?? []).map((r) => ({ plass: r.plass, navn: r.navn, skole: r.skole, poeng: r.poeng, erMeg: r.er_meg })),
  };
}

export async function hentSkoleliste(): Promise<Med<Skoleplass[]>> {
  const res = await supabase.rpc("skoleliste", { p_antall: 20 });
  const demo = svar(res, EKSEMPEL.skoleliste);
  if (demo) return demo;
  return {
    demo: false,
    data: (res.data ?? []).map((r) => ({
      plass: r.plass,
      skoleId: r.skole_id,
      skole: r.skole,
      kommune: r.kommune,
      elever: r.elever,
      poeng: r.poeng,
      snitt: r.snitt,
      erMin: r.er_min,
    })),
  };
}

// ---------------------------------------------------------------- Formelmatch

export async function hentToppliste(temaId: string): Promise<Med<Toppplass[]>> {
  const res = await supabase.rpc("formelmatch_toppliste", { p_tema_id: temaId, p_antall: 10 });
  const demo = svar(res, EKSEMPEL.toppliste);
  if (demo) return demo;
  return {
    demo: false,
    data: (res.data ?? []).map((r) => ({
      plass: r.plass,
      navn: r.navn,
      skole: r.skole,
      tidMs: r.tid_ms,
      erMeg: r.er_meg,
      antall: r.antall,
    })),
  };
}

// Spillet skal virke også uten rangering: feil gir null, aldri et unntak.
export async function startFormelmatch(temaId: string): Promise<string | null> {
  const { data, error } = await supabase.rpc("start_formelmatch", { p_tema_id: temaId });
  if (error) {
    if (!ikkeSattOpp(error)) console.error("Kunne ikke starte runden på serveren:", error.message);
    return null;
  }
  return data;
}

export async function avsluttFormelmatch(runde: string, tidMs: number, par: number, straffer: number): Promise<Avslutning | null> {
  const { data, error } = await supabase.rpc("avslutt_formelmatch", {
    p_runde: runde,
    p_tid_ms: Math.round(tidMs),
    p_par: par,
    p_straffer: straffer,
  });
  if (error) {
    console.error("Kunne ikke lagre tiden:", error.message);
    return null;
  }
  const r = data?.[0];
  if (!r) return null;
  if (r.poeng > 0) varsleOmPoeng(r.poeng);
  return { tidMs: r.tid_ms, teller: r.teller, forrigeBeste: r.forrige_beste, poeng: r.poeng };
}

// ---------------------------------------------------------------- Belønninger

export async function hentBelonninger(): Promise<Med<Belonning[]>> {
  const res = await supabase.rpc("belonninger_med_lager");
  const demo = svar(res, EKSEMPEL.belonninger);
  if (demo) return demo;
  return {
    demo: false,
    data: (res.data ?? []).map((r) => ({
      id: r.id,
      partner: r.partner,
      tittel: r.tittel,
      beskrivelse: r.beskrivelse,
      vilkar: r.vilkar,
      lenke: r.lenke,
      poengpris: r.poengpris,
      gyldigTil: r.gyldig_til,
      igjen: r.igjen,
      innlostAvMeg: r.innlost_av_meg,
    })),
  };
}

// Kaster med en melding som kan vises til eleven (fra databasen, på norsk).
export async function losInn(belonningId: string) {
  const { data, error } = await supabase.rpc("los_inn", { p_belonning: belonningId });
  if (error) {
    if (ikkeSattOpp(error)) throw new Error("Innløsning er ikke slått på ennå. Dette er bare et eksempel.");
    throw new Error(error.message);
  }
  const r = data?.[0];
  if (!r) throw new Error("Fikk ikke noen kode tilbake. Prøv igjen.");
  return r;
}

export async function hentMineKuponger(): Promise<Med<Kupong[]>> {
  const res = await supabase.rpc("mine_kuponger");
  const demo = svar(res, [] as Kupong[]);
  if (demo) return demo;
  return {
    demo: false,
    data: (res.data ?? []).map((r) => ({
      kode: r.kode,
      partner: r.partner,
      tittel: r.tittel,
      lenke: r.lenke,
      vilkar: r.vilkar,
      gyldigTil: r.gyldig_til,
      innlost: r.innlost,
    })),
  };
}

// ---------------------------------------------------------------- Profil og skoler

// Alle skoler med ungdomstrinn og alle videregående skoler i Norge, fra
// Nasjonalt skoleregister (public/skoler.json, lages av `npm run skoler`).
// Søket skjer i nettleseren: lista lastes ned én gang (ca. 30 kB komprimert)
// og fungerer også før konkurransen er slått på i databasen.
type Skoleindeks = { skole: Skole; navn: string; tekst: string };
let skoleindeks: Promise<Skoleindeks[]> | null = null;

// Små bokstaver, uten aksenter (é, á, š …) men med æ, ø og å, og bare bokstaver,
// tall og mellomrom.
const normaliser = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-̉̋-ͯ]/g, "")
    .normalize("NFC")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

// Registeret skriver «Amalie Skram videregående skole», elevene skriver «vgs».
const FORKORTELSER: Record<string, string[]> = {
  vgs: ["vgs", "videregående", "vidaregåande"],
  vg: ["vg", "videregående", "vidaregåande"],
};

export function lastSkoler(): Promise<Skoleindeks[]> {
  skoleindeks ??= fetch("/skoler.json")
    .then((r) => {
      if (!r.ok) throw new Error("Fikk ikke hentet skolelista.");
      return r.json() as Promise<Skole[]>;
    })
    .then((liste) =>
      liste.map((skole) => {
        const navn = normaliser(skole.navn);
        return { skole, navn, tekst: ` ${navn} ${normaliser(skole.kommune)}` };
      }),
    )
    .catch((e) => {
      skoleindeks = null; // prøv igjen ved neste søk
      throw e;
    });
  return skoleindeks;
}

// Hvert ord i søket må finnes i navnet eller kommunen. Skoler der navnet
// begynner med søket, kommer først, så skoler der et ord i navnet begynner med
// det første søkeordet, så treff bare på kommunen.
export async function sokSkoler(tekst: string, maks = 12): Promise<{ treff: Skole[]; antall: number }> {
  const sok = normaliser(tekst);
  if (sok.length < 2) return { treff: [], antall: 0 };
  const ord = sok.split(" ");
  const varianter = ord.map((o) => FORKORTELSER[o] ?? [o]);
  const liste = await lastSkoler();

  const treff: { skole: Skole; rang: number }[] = [];
  for (const s of liste) {
    if (!varianter.every((v) => v.some((o) => s.tekst.includes(o)))) continue;
    const rang = s.navn.startsWith(sok) ? 0 : varianter[0].some((o) => ` ${s.navn}`.includes(` ${o}`)) ? 1 : 2;
    treff.push({ skole: s.skole, rang });
  }
  treff.sort((a, b) => a.rang - b.rang || a.skole.navn.localeCompare(b.skole.navn, "nb"));
  return { treff: treff.slice(0, maks).map((t) => t.skole), antall: treff.length };
}

export async function hentKonkurranseprofil(brukerId: string): Promise<Med<Konkurranseprofil>> {
  const { data, error } = await supabase
    .from("profiles")
    .select("skjul_fornavn, kallenavn, skole:skoler(id, navn, kommune)")
    .eq("id", brukerId)
    .maybeSingle();
  if (error) {
    if (ikkeSattOpp(error)) return { demo: true, data: { skole: null, skjulFornavn: false, kallenavn: null } };
    throw new Error(error.message);
  }
  return {
    demo: false,
    data: { skole: data?.skole ?? null, skjulFornavn: !!data?.skjul_fornavn, kallenavn: data?.kallenavn ?? null },
  };
}

async function oppdaterProfil(brukerId: string, endring: { skole_id?: string | null; skjul_fornavn?: boolean }) {
  const { error } = await supabase.from("profiles").update(endring).eq("id", brukerId);
  if (!error) return;
  if (ikkeSattOpp(error)) throw new Error("Konkurransen er ikke slått på ennå, så ingenting ble lagret.");
  throw new Error(error.message);
}

export const lagreSkole = (brukerId: string, skoleId: string | null) => oppdaterProfil(brukerId, { skole_id: skoleId });

// Kallenavnet lagres av serverfunksjonen «kallenavn» (ordlister + språkmodell);
// eleven kan ikke skrive det direkte. Gir en feil med teksten eleven skal se.
export async function lagreKallenavn(kallenavn: string | null): Promise<string | null> {
  const { data, error } = await supabase.functions.invoke("kallenavn", { body: { kallenavn } });
  if (!error) return (data as { kallenavn: string | null }).kallenavn;
  if (error.name === "FunctionsFetchError") throw new Error("Fikk ikke kontakt med serveren. Sjekk nettet.");
  const res = (error as { context?: unknown }).context;
  const body = res instanceof Response ? ((await res.json().catch(() => ({}))) as { feil?: string; melding?: string; grunn?: string }) : {};
  if (res instanceof Response && res.status === 404) throw new Error("Konkurransen er ikke slått på ennå, så ingenting ble lagret.");
  switch (body.feil) {
    case "kallenavn":
      throw new Error(body.melding ?? "Det kallenavnet kan ikke brukes. Velg et annet.");
    case "grense":
      throw new Error(
        body.grunn === "global"
          ? "Mange velger kallenavn akkurat nå. Prøv igjen i morgen."
          : "Du har prøvd mange kallenavn i dag. Prøv igjen i morgen."
      );
    case "ikke-innlogget":
      throw new Error("Du må logge inn på nytt.");
    default:
      // ai, ikke-satt-opp, server: kallenavnet er ikke sjekket, så det lagres ikke.
      throw new Error("Fikk ikke sjekket kallenavnet akkurat nå. Prøv igjen om litt.");
  }
}

// Skole og om fornavnet skal skjules. Kallenavnet sendes til sjekk bare når
// fornavnet er skjult og navnet er endret (forrige: det som er lagret), så et
// uendret navn ikke sjekkes på nytt. Kallenavnet lagres først – blir det
// avvist, lagres ingenting. Tomt kallenavn: eleven vises ikke for andre.
// Gir tilbake kallenavnet slik det er lagret nå.
export async function lagreKonkurranseprofil(
  brukerId: string,
  p: { skoleId: string | null; skjulFornavn: boolean; kallenavn: string | null; forrige: string | null }
): Promise<string | null> {
  let lagret = p.forrige;
  const nytt = ryddKallenavn(p.kallenavn ?? "") || null;
  if (p.skjulFornavn && nytt !== p.forrige) lagret = await lagreKallenavn(nytt);
  await oppdaterProfil(brukerId, { skole_id: p.skoleId, skjul_fornavn: p.skjulFornavn });
  return lagret;
}

// ---------------------------------------------------------------- Poengvarsel

// Øvingene sier fra her når eleven har fått poeng; Poengvarsel.tsx viser det.
export const POENG_HENDELSE = "studer:poeng";
export function varsleOmPoeng(poeng: number) {
  if (typeof window !== "undefined" && poeng > 0) window.dispatchEvent(new CustomEvent(POENG_HENDELSE, { detail: poeng }));
}

export const formaterTid = (ms: number) =>
  `${(ms / 1000).toLocaleString("nb-NO", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} s`;

// ---------------------------------------------------------------- Eksempeldata

// Bare for å vise sidene før migrasjonen er kjørt. Navn, skoler og partnere
// er oppdiktet, og sidene merker dem som eksempler.
const EKSEMPEL = {
  status: { saldo: 1240, denneUka: 310, iDag: 45, tak: 150, streak: 4 } satisfies Poengstatus,
  poengliste: {
    alle: [
      { plass: 1, navn: "Ingrid", skole: "Fjordbyen vgs (eksempel)", poeng: 980, erMeg: false },
      { plass: 2, navn: "Jonas", skole: "Bakkely ungdomsskole (eksempel)", poeng: 925, erMeg: false },
      { plass: 3, navn: "Mia", skole: "Elvedalen skole (eksempel)", poeng: 870, erMeg: false },
      { plass: 4, navn: "Aksel", skole: "Fjordbyen vgs (eksempel)", poeng: 640, erMeg: false },
      { plass: 5, navn: "Deg", skole: null, poeng: 310, erMeg: true },
    ],
    skole: [
      { plass: 1, navn: "Ingrid", skole: "Fjordbyen vgs (eksempel)", poeng: 980, erMeg: false },
      { plass: 2, navn: "Aksel", skole: "Fjordbyen vgs (eksempel)", poeng: 640, erMeg: false },
      { plass: 3, navn: "Deg", skole: "Fjordbyen vgs (eksempel)", poeng: 310, erMeg: true },
    ],
    trinn: [
      { plass: 1, navn: "Jonas", skole: "Bakkely ungdomsskole (eksempel)", poeng: 925, erMeg: false },
      { plass: 2, navn: "Deg", skole: null, poeng: 310, erMeg: true },
    ],
  } satisfies Record<Omrade, Plassering[]>,
  skoleliste: [
    { plass: 1, skoleId: "e1", skole: "Fjordbyen vgs (eksempel)", kommune: "Eksempelvik", elever: 14, poeng: 5320, snitt: 380, erMin: true },
    { plass: 2, skoleId: "e2", skole: "Elvedalen skole (eksempel)", kommune: "Eksempelvik", elever: 6, poeng: 2070, snitt: 345, erMin: false },
    { plass: 3, skoleId: "e3", skole: "Bakkely ungdomsskole (eksempel)", kommune: "Eksempeldal", elever: 3, poeng: 810, snitt: 270, erMin: false },
  ] satisfies Skoleplass[],
  toppliste: [
    { plass: 1, navn: "Ingrid", skole: "Fjordbyen vgs (eksempel)", tidMs: 14800, erMeg: false, antall: 4 },
    { plass: 2, navn: "Mia", skole: "Elvedalen skole (eksempel)", tidMs: 17300, erMeg: false, antall: 4 },
    { plass: 3, navn: "Deg", skole: null, tidMs: 21900, erMeg: true, antall: 4 },
    { plass: 4, navn: "Jonas", skole: "Bakkely ungdomsskole (eksempel)", tidMs: 26400, erMeg: false, antall: 4 },
  ] satisfies Toppplass[],
  belonninger: [
    {
      id: "eksempel-1",
      partner: "Eksempelbutikken",
      tittel: "15 % rabatt på skolesaker",
      beskrivelse: "Oppdiktet eksempel på hvordan en belønning vil se ut.",
      vilkar: "Gjelder én handel.",
      lenke: null,
      poengpris: 800,
      gyldigTil: null,
      igjen: 40,
      innlostAvMeg: false,
    },
    {
      id: "eksempel-2",
      partner: "Eksempelkafeen",
      tittel: "Gratis kakao",
      beskrivelse: "Oppdiktet eksempel på en belønning i nærmiljøet.",
      vilkar: "Vis koden i kassa.",
      lenke: null,
      poengpris: 1500,
      gyldigTil: null,
      igjen: 0,
      innlostAvMeg: false,
    },
  ] satisfies Belonning[],
};
