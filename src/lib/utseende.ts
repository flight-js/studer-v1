"use client";

// Ting i appen som eleven kjøper med poeng (belønninger av typen «ting»):
// flammefarge på rekka, konfetti-stil, et merke ved navnet på rangeringene og
// premium-temaer for hele nettsiden (CSS i globals.css, settes av PremiumTema
// i layout). Eleven eier tingene i tabellen eiendeler og velger hva som
// brukes i profiles (valgt_flamme, valgt_konfetti, valgt_merke, valgt_tema).
// Databasen sjekker at eleven eier det som velges.

import { useEffect, useSyncExternalStore } from "react";
import { useAuth } from "./auth";
import { supabase } from "./supabase";

export type Tingtype = "flamme" | "konfetti" | "merke" | "tema";
export type Utseende = Record<Tingtype, string | null>;

// Alle tingene, med korte navn (vises under overskriften for typen, f.eks. på
// kontosiden). Nøklene må stemme med belønningene i migrasjonen (verdi).
export const TING: Record<string, { type: Tingtype; navn: string }> = {
  "tema-nordlys": { type: "tema", navn: "Nordlys" },
  "tema-solnedgang": { type: "tema", navn: "Solnedgang" },
  "tema-havdyp": { type: "tema", navn: "Havdyp" },
  "tema-skog": { type: "tema", navn: "Skog" },
  "tema-galakse": { type: "tema", navn: "Galakse" },
  "flamme-bla": { type: "flamme", navn: "Blå" },
  "flamme-gronn": { type: "flamme", navn: "Grønn" },
  "flamme-regnbue": { type: "flamme", navn: "Regnbue" },
  "konfetti-stjerner": { type: "konfetti", navn: "Stjerner" },
  "konfetti-fjaer": { type: "konfetti", navn: "Fjær" },
  "merke-fjaer": { type: "merke", navn: "Fjærpenn" },
  "merke-lyspare": { type: "merke", navn: "Lyspære" },
  "merke-stjerne": { type: "merke", navn: "Stjerne" },
};

// Typene i den rekkefølgen de vises, med overskrift og hva de gjør.
export const TINGTYPER: { type: Tingtype; navn: string; tekst: string }[] = [
  { type: "tema", navn: "Tema", tekst: "Farger og glød på hele Studer." },
  { type: "flamme", navn: "Flamme", tekst: "Fargen på rekka når du svarer riktig flere ganger på rad." },
  { type: "konfetti", navn: "Konfetti", tekst: "Det som spruter når du får til noe i en øving." },
  { type: "merke", navn: "Merke ved navnet", tekst: "Vises ved navnet ditt på rangeringene." },
];

export const tingtype = (ting: string): Tingtype | null => TING[ting]?.type ?? null;

// Verdien til data-premium (globals.css): «tema-nordlys» → «nordlys».
export const premiumTema = (ting: string | null) => (ting && ting.startsWith("tema-") ? ting.slice(5) : null);

const TOM: Utseende = { flamme: null, konfetti: null, merke: null, tema: null };

// Ikke satt opp (migrasjonen er ikke kjørt): da er alt standard.
const IKKE_SATT_OPP = new Set(["PGRST200", "PGRST204", "PGRST205", "42703", "42P01"]);

export type MineTing = { eier: string[]; valgt: Utseende; demo: boolean };

export async function hentMineTing(brukerId: string): Promise<MineTing> {
  const [eiendeler, profil] = await Promise.all([
    supabase.from("eiendeler").select("ting").order("kjopt"),
    supabase.from("profiles").select("valgt_flamme, valgt_konfetti, valgt_merke, valgt_tema").eq("id", brukerId).maybeSingle(),
  ]);
  const feil = eiendeler.error ?? profil.error;
  if (feil) {
    if (feil.code && IKKE_SATT_OPP.has(feil.code)) return { eier: [], valgt: TOM, demo: true };
    throw new Error(feil.message);
  }
  const p = profil.data;
  return {
    eier: (eiendeler.data ?? []).map((e) => e.ting),
    valgt: {
      flamme: p?.valgt_flamme ?? null,
      konfetti: p?.valgt_konfetti ?? null,
      merke: p?.valgt_merke ?? null,
      tema: p?.valgt_tema ?? null,
    },
    demo: false,
  };
}

// ---------------------------------------------------------------- Delt tilstand
// Det eleven har valgt, delt av alle komponentene (rekka, konfettien, lista
// over ting), så et nytt valg vises overalt med en gang.

// lokalt: valget er bare prøvd i eksempelmodus (provTing) og lagres ingen steder.
let tilstand: { bruker: string | null; valgt: Utseende | null; lokalt?: boolean } = { bruker: null, valgt: null };
const lyttere = new Set<() => void>();
let henter: string | null = null;

function sett(ny: typeof tilstand) {
  tilstand = ny;
  lyttere.forEach((l) => l());
}
const abonner = (l: () => void) => {
  lyttere.add(l);
  return () => lyttere.delete(l);
};
const les = () => tilstand;

// Det innlogget elev har valgt (standard når ingenting er valgt eller ingen er innlogget).
export function useUtseende(): Utseende {
  const { bruker } = useAuth();
  const id = bruker?.id ?? null;
  const t = useSyncExternalStore(abonner, les, les);
  useEffect(() => {
    if (!id || (t.bruker === id && t.valgt) || henter === id) return;
    henter = id;
    hentMineTing(id)
      .then(
        (m) => sett({ bruker: id, valgt: m.valgt }),
        () => sett({ bruker: id, valgt: TOM })
      )
      .finally(() => {
        if (henter === id) henter = null;
      });
  }, [id, t]);
  return t.bruker === id && t.valgt ? t.valgt : TOM;
}

// Temaet den innloggede eleven har valgt akkurat nå (utenfor React, for å
// gå tilbake til det etter at et tema er prøvd på belønningssiden).
export const gjeldendeTema = () => tilstand.valgt?.tema ?? null;

// Det eleven har valgt, og om det er hentet ennå (så «Standard» ikke ser valgt
// ut et øyeblikk før valget er kjent).
export function useUtseendeStatus(): { valgt: Utseende; klar: boolean } {
  const { bruker } = useAuth();
  const valgt = useUtseende();
  const t = useSyncExternalStore(abonner, les, les);
  return { valgt, klar: !!bruker && t.bruker === bruker.id && !!t.valgt };
}

// Premium-temaet og om svaret er kjent: klar = innloggingen er avklart og
// valget er hentet (eller ingen er logget inn). PremiumTema venter på klar, så det
// ikke fjerner temaet som skriptet i <head> satte, før det vet. lagres = false
// når temaet bare er prøvd i eksempelmodus.
export function useValgtTema(): { tema: string | null; klar: boolean; lagres: boolean } {
  const { bruker, laster } = useAuth();
  const valgt = useUtseende();
  const t = useSyncExternalStore(abonner, les, les);
  const id = bruker?.id ?? null;
  if (laster) return { tema: null, klar: false, lagres: true };
  if (!id) return { tema: null, klar: true, lagres: true };
  return { tema: valgt.tema, klar: t.bruker === id && !!t.valgt, lagres: !t.lokalt };
}

// Tar i bruk en ting (eller fjerner valget med null). Kaster med en melding
// som kan vises til eleven.
export async function velgTing(brukerId: string, type: Tingtype, ting: string | null) {
  const endring =
    type === "flamme"
      ? { valgt_flamme: ting }
      : type === "konfetti"
        ? { valgt_konfetti: ting }
        : type === "merke"
          ? { valgt_merke: ting }
          : { valgt_tema: ting };
  const { error } = await supabase.from("profiles").update(endring).eq("id", brukerId);
  if (error) {
    if (error.code && IKKE_SATT_OPP.has(error.code)) throw new Error("Belønningene er ikke slått på ennå.");
    throw new Error(error.message);
  }
  const forrige = tilstand.bruker === brukerId && tilstand.valgt ? tilstand.valgt : TOM;
  sett({ bruker: brukerId, valgt: { ...forrige, [type]: ting } });
}

// Eksempelmodus (belønningene er ikke slått på): valget vises overalt, men
// lagres ikke og er borte når siden lastes på nytt.
export function provTing(brukerId: string, type: Tingtype, ting: string | null) {
  const forrige = tilstand.bruker === brukerId && tilstand.valgt ? tilstand.valgt : TOM;
  sett({ bruker: brukerId, valgt: { ...forrige, [type]: ting }, lokalt: true });
}
