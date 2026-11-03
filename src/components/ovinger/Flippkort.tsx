"use client";

import { useEffect } from "react";
import { Dot } from "@/components/Dot";
import { Ekstramerke } from "@/components/Ekstramerke";
import { Check, Close } from "@/components/icons";
import type { Flashcard } from "@/lib/pensum";

// Kortet som snus, med svarknappene under. Brukes i flashcards og i repetisjonen.
// runde: endres når et nytt kort kommer, så kortet kommer inn på nytt.
export function Flippkort({
  kort,
  snudd,
  runde,
  onSnu,
  onSvar,
}: {
  kort: Flashcard;
  snudd: boolean;
  runde: string;
  onSnu: () => void;
  onSvar: (kan: boolean) => void;
}) {
  return (
    <>
      <div key={runde} className="flip-scene w-full max-w-lg rise-rask">
        <button
          onClick={onSnu}
          data-flipped={snudd}
          aria-label={snudd ? `Forklaring: ${kort.forklaring}. Trykk for å snu tilbake.` : `Begrep: ${kort.begrep}. Trykk for å se forklaringen.`}
          className="flip-card relative block w-full h-80 sm:h-96"
        >
          <span className="flip-face absolute inset-0 bg-surface border border-border rounded-[28px] shadow-lift flex flex-col items-center justify-center gap-4 p-8 text-center">
            {!kort.kjerne && (
              <span className="absolute top-6 inset-x-6 flex justify-center">
                <Ekstramerke forklart />
              </span>
            )}
            <span className="text-sm font-medium text-faint">Begrep</span>
            <span
              lang="nb"
              className={`font-display font-semibold tracking-[-0.02em] leading-tight hyphens-auto ${
                kort.begrep.length > 28 ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl"
              }`}
            >
              {kort.begrep}
            </span>
            <span className="absolute bottom-6 text-xs text-faint">Trykk for å snu</span>
          </span>
          <span className="flip-face flip-back absolute inset-0 bg-foreground text-background rounded-[28px] shadow-lift flex flex-col items-center justify-center gap-4 p-8 sm:p-10 text-center">
            <span className="text-sm font-medium text-background/55">{kort.begrep}</span>
            <span
              className={`font-display font-medium leading-snug ${
                kort.forklaring.length > 150 ? "text-xl sm:text-2xl" : "text-2xl sm:text-[28px]"
              }`}
            >
              {kort.forklaring}
            </span>
          </span>
        </button>
      </div>

      <div className="flex gap-3 w-full max-w-lg">
        <button
          onClick={() => onSvar(false)}
          className="flex-1 flex items-center justify-center gap-2 bg-surface border-[1.5px] border-border-strong px-5 py-4 rounded-2xl text-sm font-semibold hover:border-danger hover:text-danger-ink transition-[color,background-color,border-color,scale] duration-200 active:scale-[0.98]"
        >
          <Close size={18} />
          Kan ikke ennå
        </button>
        <button
          onClick={() => onSvar(true)}
          className="flex-1 flex items-center justify-center gap-2 bg-success text-white px-5 py-4 rounded-2xl text-sm font-semibold hover:brightness-110 transition-[filter,translate,scale] duration-200 active:scale-[0.98]"
        >
          <Check size={18} />
          Kan dette
        </button>
      </div>

      <p className="hidden sm:block text-xs text-faint">
        Mellomrom snur kortet<Dot />← kan ikke ennå<Dot />→ kan dette
      </p>
    </>
  );
}

export function useKorttaster(aktiv: boolean, onSnu: () => void, onSvar: (kan: boolean) => void) {
  useEffect(() => {
    if (!aktiv) return;
    const onKey = (e: KeyboardEvent) => {
      // Ikke snu eller svar mens eleven skriver, for eksempel i AI-chatten.
      if ((e.target as HTMLElement).closest("input, textarea, select, [contenteditable], [role=dialog], [data-rapport]")) return;
      if (e.key === " " && !(e.target as HTMLElement).closest("button")) {
        e.preventDefault();
        onSnu();
      }
      if (e.key === "ArrowLeft" || e.key === "1") onSvar(false);
      if (e.key === "ArrowRight" || e.key === "2") onSvar(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aktiv, onSnu, onSvar]);
}
