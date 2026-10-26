// Formelmatch: formlene i et tema deles på brett med høyst seks formler. Hvert
// brett er venstre og høyre side av formlene som løse brikker i tilfeldig orden.

import type { Formel } from "./pensum";
import { stokk } from "./stokk";

export const PER_BRETT = 6;
// Repetisjonstemaet kan ha mange formler – én runde tar et tilfeldig utvalg.
export const MAKS_PER_RUNDE = 12;
export const MINST = 3;

export type Side = "venstre" | "hoyre";
export type Brikke = { id: string; side: Side; tekst: string; formel: Formel };
export type Brett = { formler: Formel[]; brikker: Brikke[] };

// Samme tekst skrevet med litt ulike mellomrom regnes som lik.
const lik = (s: string) => s.replace(/\s/g, "");

// Riktig par: venstre-brikken har samme tekst som venstresiden i formelen til
// høyre-brikken. Hver tekst står bare én gang på et brett (se passer), så det
// finnes alltid nøyaktig ett riktig par for hver brikke.
export const erPar = (a: Brikke, b: Brikke) => {
  if (a.side === b.side) return false;
  const [v, h] = a.side === "venstre" ? [a, b] : [b, a];
  return lik(v.tekst) === lik(h.formel.venstre);
};

// Kan formelen stå på brettet? Ingen tekst kan stå to ganger. Like venstresider
// (som f(x) = ax + b og f(x) = ax² + bx + c) ville gjort at alle f(x)-brikkene
// passet med alle uttrykkene, og like høyresider kunne latt eleven bli stående
// fast med brikker som ikke passer.
function passer(f: Formel, brett: Formel[]) {
  const tekster = new Set(brett.flatMap((g) => [lik(g.venstre), lik(g.hoyre)]));
  return !tekster.has(lik(f.venstre)) && !tekster.has(lik(f.hoyre)) && lik(f.venstre) !== lik(f.hoyre);
}

export function lagRunde(alle: Formel[]): Brett[] {
  const maal = Math.min(alle.length, MAKS_PER_RUNDE);
  // Like store brett: 8 formler blir 4 + 4, ikke 6 + 2.
  const antall = Math.ceil(maal / PER_BRETT);
  const storrelse = Math.ceil(maal / antall);
  const brett: Formel[][] = Array.from({ length: antall }, () => []);
  let plassert = 0;
  for (const f of stokk(alle)) {
    if (plassert === maal) break;
    const plass = brett.find((b) => b.length < storrelse && passer(f, b));
    if (plass) {
      plass.push(f);
      plassert++;
    }
  }
  // Et brett med bare ett par er ikke noe å koble – det tas bort når det finnes flere.
  const brukbare = brett.filter((b) => b.length >= 2);
  return (brukbare.length ? brukbare : brett.filter((b) => b.length))
    .map((formler, b) => ({
      formler,
      brikker: stokk(
        formler.flatMap((formel, i) => [
          { id: `${b}-${i}-v`, side: "venstre" as const, tekst: formel.venstre, formel },
          { id: `${b}-${i}-h`, side: "hoyre" as const, tekst: formel.hoyre, formel },
        ])
      ),
    }));
}

// Utvalget eleven har valgt før runden. Nøkkelen er formelen uten mellomrom.
export const formelNokkel = (f: Formel) => lik(`${f.venstre}=${f.hoyre}`);

// Et utvalg kan spilles når minst tre formler har ulik venstreside – ellers blir
// brettene for små (samme regel som temasiden, se scripts/lib/pensum-rader.mjs).
export const kanSpilles = (liste: Formel[]) => new Set(liste.map((f) => lik(f.venstre))).size >= MINST;

// Utvalget huskes i denne nettleseren til neste gang. null: alle formlene.
const utvalgNokkel = (temaId: string) => `studer-formelutvalg:${temaId}`;

export function lesUtvalg(temaId: string): string | null {
  try {
    return localStorage.getItem(utvalgNokkel(temaId));
  } catch {
    return null;
  }
}

export function lagreUtvalg(temaId: string, valgt: Set<string> | null) {
  try {
    if (valgt) localStorage.setItem(utvalgNokkel(temaId), JSON.stringify([...valgt]));
    else localStorage.removeItem(utvalgNokkel(temaId));
  } catch {
    // Blokkert lagring: valget gjelder bare denne gangen.
  }
}

// Beste tid lagres bare i denne nettleseren.
const rekordNokkel = (temaId: string) => `studer-formelmatch:${temaId}`;

export function lesRekord(temaId: string): number | null {
  try {
    const v = Number(localStorage.getItem(rekordNokkel(temaId)));
    return v > 0 ? v : null;
  } catch {
    return null;
  }
}

export function lagreRekord(temaId: string, ms: number) {
  try {
    localStorage.setItem(rekordNokkel(temaId), String(Math.round(ms)));
  } catch {
    // Privat modus eller blokkert lagring: rekorden huskes ikke, men spillet virker.
  }
}

export const sekunder = (ms: number) => `${(ms / 1000).toFixed(1).replace(".", ",")} s`;
