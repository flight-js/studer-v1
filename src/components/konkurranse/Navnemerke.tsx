import { Fjaer, Lyspare, Stjerne } from "@/components/icons";

// Merket en elev har kjøpt med poeng og viser ved navnet på rangeringene
// (belønninger av typen «ting», se lib/utseende.ts). Ukjent eller tomt: ingenting.
const MERKER: Record<string, { navn: string; ikon: React.ReactNode }> = {
  "merke-fjaer": { navn: "Fjærpenn", ikon: <Fjaer size={15} /> },
  "merke-lyspare": { navn: "Lyspære", ikon: <Lyspare size={15} /> },
  "merke-stjerne": { navn: "Stjerne", ikon: <Stjerne size={15} fylt /> },
};

export function Navnemerke({ merke }: { merke?: string | null }) {
  const m = merke ? MERKER[merke] : undefined;
  if (!m) return null;
  return (
    <span
      role="img"
      aria-label={`merke: ${m.navn}`}
      title={m.navn}
      className="ml-1.5 inline-flex size-6 -my-1 items-center justify-center rounded-full bg-merke align-middle text-pa-merke"
    >
      {m.ikon}
    </span>
  );
}
