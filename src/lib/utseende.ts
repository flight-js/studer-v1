"use client";

// Ting i appen som eleven kjøper med poeng (belønninger av typen «ting»):
// flammefarge på rekka, konfetti-stil, et merke ved navnet på rangeringene og
// premium-temaer som farger natt-flatene i appen (CSS i globals.css, settes av
// NattTema i layout). Eleven eier tingene i tabellen eiendeler og velger hva som
// brukes i profiles (valgt_flamme, valgt_konfetti, valgt_merke, valgt_tema).
// Databasen sjekker at eleven eier det som velges.

import { useEffect, useSyncExternalStore } from "react";
import { useAuth } from "./auth";
import { supabase } from "./supabase";

export type Tingtype = "flamme" | "konfetti" | "merke" | "tema";
export type Utseende = Record<Tingtype, string | null>;

// Alle tingene. Navnene må stemme med belønningene i migrasjonen (verdi).
export const TING: Record<string, { type: Tingtype; navn: string }> = {
  "flamme-bla": { type: "flamme", navn: "Blå flamme" },
  "flamme-gronn": { type: "flamme", navn: "Grønn flamme" },
  "flamme-regnbue": { type: "flamme", navn: "Regnbueflamme" },
  "konfetti-stjerner": { type: "konfetti", navn: "Stjernekonfetti" },
  "konfetti-fjaer": { type: "konfetti", navn: "Fjærkonfetti" },
  "merke-fjaer": { type: "merke", navn: "Fjærpenn ved navnet" },
  "merke-lyspare": { type: "merke", navn: "Lyspære ved navnet" },
  "merke-stjerne": { type: "merke", navn: "Stjerne ved navnet" },
  "tema-nordlys": { type: "tema", navn: "Tema: Nordlys" },
  "tema-solnedgang": { type: "tema", navn: "Tema: Solnedgang" },
  "tema-havdyp": { type: "tema", navn: "Tema: Havdyp" },
  "tema-skog": { type: "tema", navn: "Tema: Skog" },
  "tema-galakse": { type: "tema", navn: "Tema: Galakse" },
};

export const tingtype = (ting: string): Tingtype | null => TING[ting]?.type ?? null;

// Verdien til data-natt-tema (globals.css): «tema-nordlys» → «nordlys».
export const nattTema = (ting: string | null) => (ting && ting.startsWith("tema-") ? ting.slice(5) : null);

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

let tilstand: { bruker: string | null; valgt: Utseende | null } = { bruker: null, valgt: null };
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

// Premium-temaet og om svaret er kjent: klar = innloggingen er avklart og
// valget er hentet (eller ingen er logget inn). NattTema venter på klar, så det
// ikke fjerner temaet som skriptet i <head> satte, før det vet.
export function useValgtTema(): { tema: string | null; klar: boolean } {
  const { bruker, laster } = useAuth();
  const valgt = useUtseende();
  const t = useSyncExternalStore(abonner, les, les);
  const id = bruker?.id ?? null;
  if (laster) return { tema: null, klar: false };
  if (!id) return { tema: null, klar: true };
  return { tema: valgt.tema, klar: t.bruker === id && !!t.valgt };
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
