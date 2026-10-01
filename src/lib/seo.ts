// Felles for metadata, sitemap og strukturerte data. studer.no sender videre
// til www.studer.no, så www er adressen Google skal bruke.

import type { Metadata } from "next";

export const NETTSTED = "https://www.studer.no";
export const NAVN = "Studer";

// Profilene våre. Vises nederst på sidene og i de strukturerte dataene
// (sameAs), så Google knytter dem til Studer. null = ikke laget ennå.
export const SOSIALE_MEDIER: { navn: string; url: string | null }[] = [
  { navn: "Instagram", url: "https://www.instagram.com/studer.no/" },
  { navn: "TikTok", url: null },
];

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

export const TITTELMAL = `%s – ${NAVN}`;

// Metadata for én side. Sider som krever innlogging, eller som bare er et
// steg i en flyt (glemt passord, betaling), skal ikke inn i Google.
// googleTittel: hele tittelen i søkeresultatet for sider som skal i Google.
// Den bør si hva siden er og nevne Studer, ellers skriver Google sin egen.
export function sideMetadata({
  tittel,
  googleTittel,
  beskrivelse,
  sti,
  indekser = false,
}: {
  tittel: string;
  googleTittel?: string;
  beskrivelse?: string;
  sti: string;
  indekser?: boolean;
}): Metadata {
  const full = googleTittel ?? TITTELMAL.replace("%s", tittel);
  return {
    title: googleTittel ? { absolute: googleTittel } : tittel,
    ...(beskrivelse && { description: beskrivelse }),
    alternates: { canonical: sti },
    openGraph: { ...DELING, title: full, ...(beskrivelse && { description: beskrivelse }), url: sti },
    robots: indekser ? undefined : { index: false, follow: true },
  };
}
