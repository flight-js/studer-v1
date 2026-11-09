"use client";

import { useEffect } from "react";
import { Ekstramerke } from "@/components/Ekstramerke";
import { Check, Close } from "@/components/icons";
import type { Flashcard } from "@/lib/pensum";

// Kortet som snus, med svarknappene under. Brukes i flashcards og i repetisjonen.
// runde: endres når et nytt kort kommer, så kortet kommer inn på nytt.
// valgt: svaret eleven ga sist på kortet, når man har gått tilbake til det.
// medForrige: vis Backspace (forrige kort) i tastaturhjelpen.
export function Flippkort({
  kort,
  snudd,
  runde,
  onSnu,
  onSvar,
  valgt,
  medForrige = false,
}: {
  kort: Flashcard;
  snudd: boolean;
  runde: string;
  onSnu: () => void;
  onSvar: (kan: boolean) => void;
  valgt?: boolean;
  medForrige?: boolean;
}) {
  const harValgt = valgt !== undefined;
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
          aria-pressed={harValgt ? valgt === false : undefined}
          className={`flex-1 flex items-center justify-center gap-2 border-[1.5px] px-5 py-4 rounded-2xl text-sm font-semibold transition-[color,background-color,border-color,opacity,scale] duration-200 active:scale-[0.98] ${
            harValgt && valgt === false
              ? "bg-danger-tint border-danger text-danger-ink"
              : `bg-surface border-border-strong hover:border-danger hover:text-danger-ink ${harValgt ? "opacity-60 hover:opacity-100" : ""}`
          }`}
        >
          <Close size={18} />
          Kan ikke ennå
        </button>
        <button
          onClick={() => onSvar(true)}
          aria-pressed={harValgt ? valgt === true : undefined}
          className={`flex-1 flex items-center justify-center gap-2 bg-success text-white px-5 py-4 rounded-2xl text-sm font-semibold hover:brightness-110 transition-[filter,opacity,box-shadow,translate,scale] duration-200 active:scale-[0.98] ${
            harValgt && valgt === true
              ? "ring-2 ring-success ring-offset-2 ring-offset-background"
              : harValgt
                ? "opacity-60 hover:opacity-100"
                : ""
          }`}
        >
          <Check size={18} />
          Kan dette
        </button>
      </div>

      {/* Tastaturhjelp (bare på store skjermer). */}
      <p className="hidden sm:flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <Tast>Mellomrom</Tast> snu
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Tast>←</Tast> kan ikke ennå
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Tast>→</Tast> kan dette
        </span>
        {medForrige && (
          <span className="rise-rask inline-flex items-center gap-1.5">
            <Tast>⌫</Tast> forrige kort
          </span>
        )}
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

function Tast({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex min-w-6 items-center justify-center rounded-md border border-border-strong bg-surface px-1.5 py-0.5 font-body text-[11px] font-semibold text-ink-soft shadow-[0_1px_0_var(--border-strong)]">
      {children}
    </kbd>
  );
}
