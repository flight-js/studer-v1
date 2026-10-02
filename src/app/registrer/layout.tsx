import { sideMetadata } from "@/lib/seo";

export const metadata = sideMetadata({
  tittel: "Lag konto",
  googleTittel: "Lag konto på Studer – prøv gratis i 14 dager",
  beskrivelse:
    "Lag en konto på Studer og prøv alt gratis i 14 dager. Flashcards, quiz og miniprøver for hele pensum, fra 8. trinn til Vg3 og påbygg.",
  sti: "/registrer",
  indekser: true,
});

export default function RegistrerLayout({ children }: LayoutProps<"/registrer">) {
  return children;
}
