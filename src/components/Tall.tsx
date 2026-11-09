"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { reduserBevegelse } from "@/lib/feiring";

// Et tall som teller opp til verdien (resultatet etter en øving, poeng).
// Skjermlesere får bare sluttverdien. Redusert bevegelse: sluttverdien med en gang.
// format: hvordan tallet skrives underveis og til slutt.
export function Tall({
  verdi,
  fra = 0,
  varighet = 900,
  forsinkelse = 250,
  format = (n) => String(Math.round(n)),
}: {
  verdi: number;
  fra?: number;
  varighet?: number;
  forsinkelse?: number;
  format?: (n: number) => string;
}) {
  const el = useRef<HTMLSpanElement>(null);
  // format er ofte en ny funksjon hver gang; den nyeste brukes uten å starte på nytt.
  const fmt = useRef(format);
  useEffect(() => {
    fmt.current = format;
  });

  // Før tegning, så sluttverdien aldri blinker forbi før tellingen starter.
  useLayoutEffect(() => {
    const span = el.current;
    if (!span) return;
    // Skjult fane: rAF står stille, så vis sluttverdien med en gang.
    if (reduserBevegelse() || verdi === fra || document.hidden) {
      span.textContent = fmt.current(verdi);
      return;
    }
    span.textContent = fmt.current(fra);
    let raf = 0;
    let t0 = 0;
    const steg = (na: number) => {
      t0 ||= na;
      const t = Math.min(Math.max(na - t0 - forsinkelse, 0) / varighet, 1);
      const e = 1 - Math.pow(1 - t, 4); // easeOutQuart: fort først, roer seg mot slutten
      span.textContent = fmt.current(fra + (verdi - fra) * e);
      if (t < 1) raf = requestAnimationFrame(steg);
    };
    raf = requestAnimationFrame(steg);
    return () => {
      cancelAnimationFrame(raf);
      span.textContent = fmt.current(verdi);
    };
  }, [verdi, fra, varighet, forsinkelse]);

  return (
    <>
      <span ref={el} aria-hidden="true">
        {format(verdi)}
      </span>
      <span className="sr-only">{format(verdi)}</span>
    </>
  );
}
