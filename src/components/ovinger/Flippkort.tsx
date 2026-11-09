"use client";

import { useCallback, useEffect, useRef } from "react";
import { Ekstramerke } from "@/components/Ekstramerke";
import { Check, Close } from "@/components/icons";
import { reduserBevegelse } from "@/lib/feiring";
import type { Flashcard } from "@/lib/pensum";

// Kortet som snus, med svarknappene under. Brukes i flashcards og i repetisjonen.
// Tastene (mellomrom, piler) håndteres her. Når eleven svarer, kastes kortet
// til høyre («Kan dette») eller venstre («Kan ikke ennå»), og neste kort deles
// ut under (se kast nederst).
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
  const scene = useRef<HTMLDivElement>(null);
  const svar = useCallback(
    (kan: boolean) => {
      kast(scene.current, kan);
      onSvar(kan);
    },
    [onSvar]
  );
  useKorttaster(true, onSnu, svar);

  return (
    <>
      <div key={runde} ref={scene} className="flip-scene w-full max-w-lg kort-inn">
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
          onClick={() => svar(false)}
          aria-pressed={harValgt ? valgt === false : undefined}
          className={`trykk flex-1 flex items-center justify-center gap-2 border-[1.5px] px-5 py-4 rounded-2xl text-sm font-semibold ${
            harValgt && valgt === false
              ? "bg-danger-tint border-danger text-danger-ink kant-feil"
              : `bg-surface border-border-strong hover:border-danger hover:text-danger-ink ${harValgt ? "opacity-60 hover:opacity-100" : ""}`
          }`}
        >
          <Close size={18} />
          Kan ikke ennå
        </button>
        <button
          onClick={() => svar(true)}
          aria-pressed={harValgt ? valgt === true : undefined}
          className={`trykk trykk-gronn flex-1 flex items-center justify-center gap-2 bg-success text-white px-5 py-4 rounded-2xl text-sm font-semibold hover:brightness-110 ${
            harValgt && valgt === true
              ? "outline-2 outline-offset-2 outline-success"
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

// Kortet som er besvart, flyr ut: en kopi legges over kortet og glir av
// skjermen mens det nye kortet allerede står klart under. Eleven venter aldri
// på animasjonen. Redusert bevegelse: ingen kopi, det nye kortet toner inn.
function kast(el: HTMLElement | null, kan: boolean) {
  if (!el || reduserBevegelse()) return;
  const r = el.getBoundingClientRect();
  const kopi = el.cloneNode(true) as HTMLElement;
  kopi.classList.remove("kort-inn");
  kopi.setAttribute("aria-hidden", "true");
  kopi.inert = true;
  Object.assign(kopi.style, {
    position: "fixed",
    left: `${r.left}px`,
    top: `${r.top}px`,
    width: `${r.width}px`,
    height: `${r.height}px`,
    margin: "0",
    pointerEvents: "none",
    zIndex: "30", // under menyen øverst (z-40)
  });
  if (kan) {
    for (const flate of kopi.querySelectorAll<HTMLElement>(".flip-face")) {
      flate.style.boxShadow = "0 0 0 3px var(--success), var(--shadow-lift)";
    }
  }
  document.body.appendChild(kopi);
  const x = (kan ? 1 : -1) * Math.min(window.innerWidth * 0.7, 560);
  const animasjon = kopi.animate(
    [
      { transform: "none", opacity: 1 },
      { transform: `translate(${x}px, ${kan ? -24 : 36}px) rotate(${kan ? 14 : -11}deg)`, opacity: 0 },
    ],
    { duration: 420, easing: "cubic-bezier(0.22, 1, 0.36, 1)" } // --ease-out-soft
  );
  animasjon.onfinish = animasjon.oncancel = () => kopi.remove();
}

function Tast({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex min-w-6 items-center justify-center rounded-md border border-border-strong bg-surface px-1.5 py-0.5 font-body text-[11px] font-semibold text-ink-soft shadow-[0_1px_0_var(--border-strong)]">
      {children}
    </kbd>
  );
}
