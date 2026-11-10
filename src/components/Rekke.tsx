"use client";

import { useEffect, useRef, useState } from "react";
import { Flamme } from "@/components/icons";
import { gnister } from "@/lib/feiring";
import { useUtseende } from "@/lib/utseende";

// Riktige svar på rad, som et lite flammemerke ved siden av telleren øverst.
// Vises fra to på rad, tallet hopper for hvert nytt riktig svar, og hver femte
// gir gnister. Fra fem blir flammen rød, fra ti blafrer den. Ryker rekka,
// blekner merket bort med tallet eleven nådde.
//
// Bare der svaret faktisk sjekkes (quiz, formelmatch) – ikke i flashcards,
// der eleven svarer selv.
export function Rekke({ antall, enhet = "på rad" }: { antall: number; enhet?: string }) {
  // Forrige verdi, for å se når rekka ryker (justeres under rendering, ikke i en effekt).
  const [forrige, setForrige] = useState(antall);
  const [brutt, setBrutt] = useState<number | null>(null);
  if (antall !== forrige) {
    setForrige(antall);
    setBrutt(antall < 2 && forrige >= 2 ? forrige : null);
  }

  const merke = useRef<HTMLSpanElement>(null);
  // Flammefargen eleven har kjøpt med poeng (standard: mørk, rød fra fem på rad).
  const { flamme } = useUtseende();
  useEffect(() => {
    if (antall >= 5 && antall % 5 === 0) gnister(merke.current, 14);
  }, [antall]);

  const n = antall >= 2 ? antall : brutt;
  if (n === null) return null;
  const varm = n >= 5;

  return (
    <span
      ref={merke}
      // Ny nøkkel når merket kommer tilbake etter at rekka røk, så det spretter inn igjen.
      key={antall >= 2 ? "aktiv" : `brutt-${brutt}`}
      aria-label={antall >= 2 ? `${n} riktige ${enhet}` : undefined}
      aria-hidden={antall >= 2 ? undefined : true}
      className={`rekke inline-flex items-center gap-1 rounded-full bg-merke pl-1.5 pr-2.5 py-0.5 text-xs font-bold text-pa-merke tabular-nums ${
        antall < 2 ? "rekke-brutt" : ""
      } ${varm ? "shadow-[0_0_0_3px_color-mix(in_oklab,var(--merke)_38%,transparent)]" : ""}`}
    >
      <Flamme
        size={14}
        fylt
        className={`${
          flamme === "flamme-bla"
            ? "text-primary"
            : flamme === "flamme-gronn"
              ? "text-success"
              : flamme === "flamme-regnbue"
                ? "flamme-regnbue text-danger"
                : varm
                  ? "text-danger"
                  : "text-pa-merke"
        } ${n >= 10 && antall >= 2 ? "flakk" : ""}`}
      />
      <span key={n} className={antall >= 2 ? "rekke-hopp" : ""}>
        {n}
      </span>
      <span className="hidden sm:inline font-semibold">{enhet}</span>
    </span>
  );
}
