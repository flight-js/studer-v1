"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Stjerne } from "@/components/icons";
import { Tall } from "@/components/Tall";
import { gnister } from "@/lib/feiring";
import { POENG_HENDELSE } from "@/lib/konkurranse";

// Lite varsel nederst på skjermen når eleven får poeng («+12 poeng»): stjernen
// snurrer inn med gnister, og tallet teller opp. Flere poeng rett etter
// hverandre legges sammen og teller videre derfra. Lenker til konkurransesiden.
export function Poengvarsel() {
  const [varsel, setVarsel] = useState({ poeng: 0, fra: 0, nr: 0 });
  const skjul = useRef<number | undefined>(undefined);
  const stjerne = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onPoeng = (e: Event) => {
      const n = (e as CustomEvent<number>).detail;
      if (!(n > 0)) return;
      setVarsel((v) => ({ poeng: v.poeng + n, fra: v.poeng, nr: v.nr + 1 }));
      window.clearTimeout(skjul.current);
      skjul.current = window.setTimeout(() => setVarsel((v) => ({ ...v, poeng: 0, fra: 0 })), 3600);
    };
    window.addEventListener(POENG_HENDELSE, onPoeng);
    return () => {
      window.removeEventListener(POENG_HENDELSE, onPoeng);
      window.clearTimeout(skjul.current);
    };
  }, []);

  // Gnister når stjernen har landet (varselet spretter inn etter 150 ms).
  useEffect(() => {
    if (!varsel.nr) return;
    const t = window.setTimeout(() => gnister(stjerne.current, 10), 320);
    return () => window.clearTimeout(t);
  }, [varsel.nr]);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-5">
      {varsel.poeng > 0 && (
        <Link
          key={varsel.nr}
          href="/konkurranse"
          className="pop pointer-events-auto inline-flex items-center gap-2.5 rounded-full bg-foreground text-background pl-1.5 pr-4 py-1.5 text-sm font-semibold shadow-lift"
        >
          <span
            ref={stjerne}
            className="ikon-pop inline-flex size-7 items-center justify-center rounded-full bg-merke text-pa-merke [animation-delay:200ms]"
          >
            <Stjerne size={16} fylt />
          </span>
          <span className="font-bold tabular-nums">
            +<Tall verdi={varsel.poeng} fra={varsel.fra} varighet={650} forsinkelse={250} />
          </span>
          poeng
        </Link>
      )}
    </div>
  );
}
