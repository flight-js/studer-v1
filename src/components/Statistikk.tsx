"use client";

import { Analytics } from "@vercel/analytics/next";

// Teller besøk med Vercel Web Analytics, uten cookies og uten kobling til kontoen.
// Adressen sendes uten spørrestreng og # – der kan det stå engangskoder fra
// innloggingen, og vi trenger bare å vite hvilken side det var.
export function Statistikk() {
  return (
    <Analytics
      beforeSend={(hendelse) => {
        const url = new URL(hendelse.url);
        url.search = "";
        url.hash = "";
        return { ...hendelse, url: url.toString() };
      }}
    />
  );
}
