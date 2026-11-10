"use client";

// Poengstatusen (saldo, dager på rad, rekke-frys) delt av menyen på alle
// sidene, så den ikke hentes på nytt for hver side: hentes når eleven logger
// inn, på nytt når den er over et minutt gammel og rett etter at eleven har
// fått poeng (dager på rad kan ha endret seg).

import { useEffect, useSyncExternalStore } from "react";
import { useAuth } from "./auth";
import { POENG_HENDELSE, hentPoengstatus, type Med, type Poengstatus } from "./konkurranse";

let delt: { bruker: string; svar: Med<Poengstatus>; tid: number } | null = null;
let henter: string | null = null;
const lyttere = new Set<() => void>();
const abonner = (l: () => void) => {
  lyttere.add(l);
  return () => lyttere.delete(l);
};
const les = () => delt;
const tom = () => null;

function hent(bruker: string) {
  if (henter === bruker) return;
  henter = bruker;
  hentPoengstatus()
    .then((svar) => {
      delt = { bruker, svar, tid: Date.now() };
      lyttere.forEach((l) => l());
    })
    .catch(() => {
      // Ikke kritisk: menyen viser bare ikke rekka.
    })
    .finally(() => {
      if (henter === bruker) henter = null;
    });
}

export function useDeltPoengstatus(): Med<Poengstatus> | null {
  const { bruker } = useAuth();
  const id = bruker?.id ?? null;
  const d = useSyncExternalStore(abonner, les, tom);
  useEffect(() => {
    if (!id) return;
    if (!delt || delt.bruker !== id || Date.now() - delt.tid > 60_000) hent(id);
    const onPoeng = () => window.setTimeout(() => hent(id), 400);
    window.addEventListener(POENG_HENDELSE, onPoeng);
    return () => window.removeEventListener(POENG_HENDELSE, onPoeng);
  }, [id]);
  return d && d.bruker === id ? d.svar : null;
}
