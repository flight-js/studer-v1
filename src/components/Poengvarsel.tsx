"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { POENG_HENDELSE } from "@/lib/konkurranse";

// Lite varsel nederst på skjermen når eleven får poeng («+12 poeng»). Flere
// poeng rett etter hverandre legges sammen. Lenker til konkurransesiden.
export function Poengvarsel() {
  const [poeng, setPoeng] = useState(0);
  const [nr, setNr] = useState(0);
  const skjul = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onPoeng = (e: Event) => {
      const n = (e as CustomEvent<number>).detail;
      if (!(n > 0)) return;
      setPoeng((p) => p + n);
      setNr((x) => x + 1);
      window.clearTimeout(skjul.current);
      skjul.current = window.setTimeout(() => setPoeng(0), 3200);
    };
    window.addEventListener(POENG_HENDELSE, onPoeng);
    return () => {
      window.removeEventListener(POENG_HENDELSE, onPoeng);
      window.clearTimeout(skjul.current);
    };
  }, []);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-5">
      {poeng > 0 && (
        <Link
          key={nr}
          href="/konkurranse"
          className="pop pointer-events-auto inline-flex items-center gap-2.5 rounded-full bg-foreground text-background pl-2 pr-4 py-2 text-sm font-semibold shadow-lift"
        >
          <span className="rounded-full bg-merke px-2.5 py-0.5 text-foreground tabular-nums">+{poeng}</span>
          poeng
        </Link>
      )}
    </div>
  );
}
