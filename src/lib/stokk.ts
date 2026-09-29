// Tilfeldig rekkefølge på spørsmål og svaralternativer, så eleven ikke kan
// huske svaret ut fra plasseringen.

import type { Sporsmal } from "./pensum";

export function stokk<T>(liste: T[]): T[] {
  const ut = [...liste];
  for (let i = ut.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ut[i], ut[j]] = [ut[j], ut[i]];
  }
  return ut;
}

// Sant/usant beholder rekkefølgen, og «Ingen av dem» står fortsatt sist.
export function stokkAlternativer<T extends Sporsmal>(q: T): T {
  if (q.type !== "flervalg") return q;
  const sist = (i: number) => /^ingen av\b/i.test(q.alternativer[i].trim());
  const indekser = q.alternativer.map((_, i) => i);
  const rekkefolge = [...stokk(indekser.filter((i) => !sist(i))), ...indekser.filter(sist)];
  return { ...q, alternativer: rekkefolge.map((i) => q.alternativer[i]), riktig: rekkefolge.indexOf(q.riktig) };
}

// Ny rekkefølge på både spørsmålene og alternativene.
export const stokkRunde = <T extends Sporsmal>(sporsmal: T[]) => stokk(sporsmal).map(stokkAlternativer);
