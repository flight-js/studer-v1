"use client";

import { Monitor, Moon, Sun } from "@/components/icons";
import { useTema, type Tema } from "@/lib/tema";

const VALG: { verdi: Tema; navn: string; Ikon: typeof Sun }[] = [
  { verdi: "system", navn: "System", Ikon: Monitor },
  { verdi: "lys", navn: "Lys", Ikon: Sun },
  { verdi: "mork", navn: "Mørk", Ikon: Moon },
];

// Lys, mørk eller som systemet. medTekst: med navn på knappene (kontosiden);
// ellers bare ikoner (bunnlenkene). mork: på natt-flate.
export function Temavelger({ medTekst = false, mork = false }: { medTekst?: boolean; mork?: boolean }) {
  const [tema, settTema] = useTema();
  return (
    <div
      role="group"
      aria-label="Utseende"
      className={`inline-flex gap-0.5 p-0.5 rounded-full border ${mork ? "border-natt-linje" : "border-border"}`}
    >
      {VALG.map(({ verdi, navn, Ikon }) => {
        const valgt = tema === verdi;
        return (
          <button
            key={verdi}
            type="button"
            aria-pressed={valgt}
            aria-label={medTekst ? undefined : navn}
            title={navn}
            onClick={() => settTema(verdi)}
            className={`inline-flex items-center gap-1.5 rounded-full transition-[color,background-color,scale] duration-200 active:scale-[0.96] ${
              medTekst ? "px-3.5 py-2 text-sm font-semibold" : "p-1.5"
            } ${
              valgt
                ? mork
                  ? "bg-natt-hevet text-background"
                  : "bg-surface text-foreground shadow-card"
                : mork
                  ? "text-background/55 hover:text-background"
                  : "text-muted hover:text-foreground"
            }`}
          >
            <Ikon size={16} />
            {medTekst && navn}
          </button>
        );
      })}
    </div>
  );
}
