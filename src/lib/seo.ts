// Felles for metadata, sitemap og strukturerte data. studer.no sender videre
// til www.studer.no, så www er adressen Google skal bruke.

import type { Metadata } from "next";

export const NETTSTED = "https://www.studer.no";
export const NAVN = "Studer";

export const TITTEL = "Studer – øv på hele pensum med flashcards, quiz og prøver";
export const BESKRIVELSE =
  "Flashcards, quiz og miniprøver for hvert tema i hvert fag etter LK20, fra 8. trinn til Vg3. Med AI-hjelp og skriveoppgaver rettet av KI. Prøv gratis i 14 dager.";

// Felles for delingskortet (Facebook, Snapchat, iMessage, X …). Bildet ligger i
// public/ og settes på hver side: Next arver ikke et opengraph-image.png til
// sider som har sin egen openGraph.
export const DELING = {
  siteName: NAVN,
  locale: "nb_NO",
  type: "website" as const,
  images: [
    {
      url: "/delingsbilde.png",
      width: 1200,
      height: 630,
      alt: "Studer – alt pensum, ett sted å øve. Flashcards, quiz og miniprøver for hvert tema i hvert fag, fra 8. trinn til Vg3.",
    },
  ],
};

// Metadata for én side. Sider som krever innlogging, eller som bare er et
// steg i en flyt (glemt passord, betaling), skal ikke inn i Google.
export function sideMetadata({
  tittel,
  beskrivelse,
  sti,
  indekser = false,
}: {
  tittel: string;
  beskrivelse?: string;
  sti: string;
  indekser?: boolean;
}): Metadata {
  return {
    title: tittel,
    ...(beskrivelse && { description: beskrivelse }),
    alternates: { canonical: sti },
    openGraph: { ...DELING, title: `${tittel} · ${NAVN}`, ...(beskrivelse && { description: beskrivelse }), url: sti },
    robots: indekser ? undefined : { index: false, follow: true },
  };
}
