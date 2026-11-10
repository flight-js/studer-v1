import { Book, Cards, Check, Fjaer, Flamme, Kalender, Lyn, Lyspare, Pen, Stjerne, Timer } from "@/components/icons";
import { merkenavn } from "@/lib/merker";

// Merkene en elev viser ved navnet på rangeringene (opptil tre): kjøpte
// (belønninger av typen «ting», se lib/utseende.ts) i merkepenn-gult, og tjente
// (lib/merker.ts) i blått. Ukjente hoppes over.
//
// Størrelsen følger skriften (em), og merkene står i en egen boks ved siden av
// navnet – ikke inne i teksten som kuttes med «…» – så de aldri klippes.
type Ikon = (s?: number) => React.ReactNode;
const KJOPTE: Record<string, { navn: string; ikon: Ikon }> = {
  "merke-fjaer": { navn: "Fjærpenn", ikon: (s) => <Fjaer size={s} /> },
  "merke-lyspare": { navn: "Lyspære", ikon: (s) => <Lyspare size={s} /> },
  "merke-stjerne": { navn: "Stjerne", ikon: (s) => <Stjerne size={s} fylt /> },
};

const TJENTE_IKONER: Record<string, Ikon> = {
  "merke-uke": (s) => <Flamme size={s} fylt />,
  "merke-maaned": (s) => <Kalender size={s} />,
  "merke-kort": (s) => <Cards size={s} />,
  "merke-tusen": (s) => <Lyn size={s} />,
  "merke-rekord": (s) => <Timer size={s} />,
  "merke-feilfri": (s) => <Check size={s} />,
  "merke-temaer": (s) => <Book size={s} />,
  "merke-prove": (s) => <Pen size={s} />,
};

// Ikonet for et merke (kjøpt eller tjent), uten ramme. Uten size bestemmer
// forelderen størrelsen med CSS.
export function Merkeikon({ merke, size }: { merke: string; size?: number }) {
  return <>{(KJOPTE[merke]?.ikon ?? TJENTE_IKONER[merke])?.(size) ?? null}</>;
}

const navnPaMerke = (merke: string) => KJOPTE[merke]?.navn ?? merkenavn(merke);

export function Navnemerker({ merker, className = "" }: { merker?: string[] | null; className?: string }) {
  const liste = (merker ?? []).filter((m) => navnPaMerke(m)).slice(0, 3);
  if (!liste.length) return null;
  return (
    <span className={`ml-[0.4em] inline-flex shrink-0 items-center gap-[0.2em] align-[-0.28em] ${className}`}>
      {liste.map((m) => (
        <span
          key={m}
          role="img"
          aria-label={`merke: ${navnPaMerke(m)}`}
          title={navnPaMerke(m) ?? undefined}
          className={`inline-flex size-[1.3em] items-center justify-center rounded-full [&_svg]:size-[0.74em] ${
            KJOPTE[m] ? "bg-merke text-pa-merke" : "bg-primary text-white"
          }`}
        >
          <Merkeikon merke={m} />
        </span>
      ))}
    </span>
  );
}
