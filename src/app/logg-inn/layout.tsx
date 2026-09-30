import { sideMetadata } from "@/lib/seo";

export const metadata = sideMetadata({
  tittel: "Logg inn",
  beskrivelse:
    "Logg inn på Studer og fortsett å øve på flashcards, quiz og miniprøver.",
  sti: "/logg-inn",
  indekser: true,
});

export default function LoggInnLayout({ children }: LayoutProps<"/logg-inn">) {
  return children;
}
