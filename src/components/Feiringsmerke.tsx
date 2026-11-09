"use client";

import { useEffect, useRef } from "react";
import { Check, Pokal, Stjerne } from "@/components/icons";
import { konfetti } from "@/lib/feiring";

// Merket øverst på resultatet når eleven har fått til noe. Det stemples inn,
// en ring slår ut fra det, og konfetti skytes fra det:
//   alt-riktig: grønn hake, mye konfetti
//   rekord:     pokal i merkepenn-gult, mye konfetti (ny rekord i formelmatch)
//   bra:        stjerne, litt konfetti (godt resultat, eller bunken er ferdig)
// Teksten under sier det samme, så merket er skjult for skjermlesere.
export type Feiring = "alt-riktig" | "rekord" | "bra";

export function Feiringsmerke({ type }: { type: Feiring }) {
  const el = useRef<HTMLSpanElement>(null);
  const skutt = useRef(false);

  useEffect(() => {
    // Når stempelet treffer (se .stempel i globals.css). Settes først når det
    // faktisk skytes, så React sin dobbeltkjøring i utvikling ikke stopper det.
    const t = window.setTimeout(() => {
      if (skutt.current) return;
      skutt.current = true;
      konfetti(el.current, type === "bra" ? "liten" : "stor");
    }, 380);
    return () => window.clearTimeout(t);
  }, [type]);

  // ring: fargen på ringen som slår ut (currentColor på den ytre span-en).
  const { flate, ring } = {
    "alt-riktig": { flate: "bg-success text-white", ring: "text-success" },
    rekord: { flate: "bg-merke text-pa-merke", ring: "text-merke-dark" },
    bra: { flate: "bg-merke text-pa-merke", ring: "text-merke-dark" },
  }[type];
  return (
    <span aria-hidden="true" className={`stempel feiringsring relative inline-flex rounded-full ${ring}`}>
      <span ref={el} className={`inline-flex items-center justify-center w-16 h-16 rounded-full shadow-lift ${flate}`}>
        {type === "alt-riktig" ? <Check size={32} /> : type === "rekord" ? <Pokal size={32} /> : <Stjerne size={30} fylt />}
      </span>
    </span>
  );
}

// Hvilken feiring et resultat gir (andel riktige, 0–1).
export const feiringFor = (andel: number): Feiring | null => (andel >= 1 ? "alt-riktig" : andel >= 0.7 ? "bra" : null);
