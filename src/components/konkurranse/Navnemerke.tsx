import { Book, Cards, Check, Fjaer, Flamme, Kalender, Lyn, Lyspare, Pen, Stjerne, Timer } from "@/components/icons";
import { merkenavn } from "@/lib/merker";

// Merket en elev viser ved navnet på rangeringene: et kjøpt merke (belønninger
// av typen «ting», se lib/utseende.ts) i merkepenn-gult, eller et merke eleven
// har tjent (lib/merker.ts) i blått. Ukjent eller tomt: ingenting.
const KJOPTE: Record<string, { navn: string; ikon: (s: number) => React.ReactNode }> = {
  "merke-fjaer": { navn: "Fjærpenn", ikon: (s) => <Fjaer size={s} /> },
  "merke-lyspare": { navn: "Lyspære", ikon: (s) => <Lyspare size={s} /> },
  "merke-stjerne": { navn: "Stjerne", ikon: (s) => <Stjerne size={s} fylt /> },
};

const TJENTE_IKONER: Record<string, (s: number) => React.ReactNode> = {
  "merke-uke": (s) => <Flamme size={s} fylt />,
  "merke-maaned": (s) => <Kalender size={s} />,
  "merke-kort": (s) => <Cards size={s} />,
  "merke-tusen": (s) => <Lyn size={s} />,
  "merke-rekord": (s) => <Timer size={s} />,
  "merke-feilfri": (s) => <Check size={s} />,
  "merke-temaer": (s) => <Book size={s} />,
  "merke-prove": (s) => <Pen size={s} />,
};

// Ikonet for et merke (kjøpt eller tjent), uten ramme.
export function Merkeikon({ merke, size }: { merke: string; size: number }) {
  return <>{(KJOPTE[merke]?.ikon ?? TJENTE_IKONER[merke])?.(size) ?? null}</>;
}

export function Navnemerke({ merke }: { merke?: string | null }) {
  if (!merke) return null;
  const kjopt = KJOPTE[merke];
  const navn = kjopt?.navn ?? merkenavn(merke);
  if (!navn) return null;
  return (
    <span
      role="img"
      aria-label={`merke: ${navn}`}
      title={navn}
      className={`ml-1.5 inline-flex size-6 -my-1 items-center justify-center rounded-full align-middle ${
        kjopt ? "bg-merke text-pa-merke" : "bg-primary text-white"
      }`}
    >
      <Merkeikon merke={merke} size={14} />
    </span>
  );
}
