"use client";

import { useEffect, useState } from "react";

/**
 * Henter data når `nokkel` endrer seg (null = ikke hent ennå). Nøkkelen skal
 * identifisere forespørselen, f.eks. tema-ID + bruker-ID, slik at innholdet
 * hentes på nytt når man logger inn eller bytter tema.
 */
export function useHent<T>(nokkel: string | null, hent: () => Promise<T>) {
  const [svar, setSvar] = useState<{ nokkel: string; data?: T; feil?: string } | null>(null);

  useEffect(() => {
    if (nokkel == null) return;
    let aktiv = true;
    hent().then(
      (data) => aktiv && setSvar({ nokkel, data }),
      (e: Error) => aktiv && setSvar({ nokkel, feil: e.message })
    );
    return () => {
      aktiv = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- nøkkelen identifiserer forespørselen
  }, [nokkel]);

  const ferdig = nokkel != null && svar?.nokkel === nokkel;
  return {
    data: ferdig ? svar.data : undefined,
    feil: ferdig ? svar.feil : undefined,
    laster: !ferdig,
  };
}
