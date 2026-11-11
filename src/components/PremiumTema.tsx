"use client";

import { useEffect } from "react";
import { Kirsebaerregn } from "@/components/Kirsebaerregn";
import { PREMIUM_NOKKEL } from "@/lib/temaskript";
import { premiumTema, useValgtTema } from "@/lib/utseende";

// Premium-temaet eleven har valgt (Belønninger → Til appen) settes som
// data-premium på <html>, og globals.css gir hele siden temaets farger.
// Valget huskes i nettleseren, så skriptet i <head> kan sette det før siden
// tegnes neste gang. Ingen innlogget elev eller ikke noe valgt: standardfargene.
export function PremiumTema() {
  const { tema, klar, lagres } = useValgtTema();
  useEffect(() => {
    if (!klar) return;
    const verdi = premiumTema(tema);
    const html = document.documentElement;
    if (verdi) html.dataset.premium = verdi;
    else delete html.dataset.premium;
    if (!lagres) return; // bare prøvd i eksempelmodus
    try {
      if (verdi) localStorage.setItem(PREMIUM_NOKKEL, verdi);
      else localStorage.removeItem(PREMIUM_NOKKEL);
    } catch {
      // Privat vindu eller blokkert lagring: temaet settes uansett når siden er lastet.
    }
  }, [tema, klar, lagres]);
  // Sakura har fallende kirsebærblomster over siden (følger data-premium selv).
  return <Kirsebaerregn />;
}
