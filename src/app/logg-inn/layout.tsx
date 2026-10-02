import { sideMetadata } from "@/lib/seo";

export const metadata = sideMetadata({
  tittel: "Logg inn",
  googleTittel: "Logg inn på Studer – fortsett der du slapp",
  beskrivelse:
    "Logg inn og fortsett å øve med flashcards, quiz og miniprøver for hele pensum, fra 8. trinn til Vg3 og påbygg.",
  sti: "/logg-inn",
  indekser: true,
});

export default function LoggInnLayout({ children }: LayoutProps<"/logg-inn">) {
  return children;
}
