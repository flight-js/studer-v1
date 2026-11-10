"use client";

import { useEffect } from "react";
import { NATT_TEMA_NOKKEL } from "@/lib/temaskript";
import { nattTema, useValgtTema } from "@/lib/utseende";

// Premium-temaet eleven har valgt (Belønninger → Til appen) settes som
// data-natt-tema på <html>, og globals.css farger natt-flatene etter det.
// Valget huskes i nettleseren, så skriptet i <head> kan sette det før siden
// tegnes neste gang. Ingen innlogget elev eller ikke noe valgt: standardfargene.
export function NattTema() {
  const { tema, klar } = useValgtTema();
  useEffect(() => {
    if (!klar) return;
    const verdi = nattTema(tema);
    const html = document.documentElement;
    if (verdi) html.dataset.nattTema = verdi;
    else delete html.dataset.nattTema;
    try {
      if (verdi) localStorage.setItem(NATT_TEMA_NOKKEL, verdi);
      else localStorage.removeItem(NATT_TEMA_NOKKEL);
    } catch {
      // Privat vindu eller blokkert lagring: temaet settes uansett når siden er lastet.
    }
  }, [tema, klar]);
  return null;
}
