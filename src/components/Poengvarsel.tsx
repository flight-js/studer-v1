"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Stjerne } from "@/components/icons";
import { Merkeikon } from "@/components/konkurranse/Navnemerke";
import { Tall } from "@/components/Tall";
import { gnister } from "@/lib/feiring";
import { MERKE_HENDELSE, POENG_HENDELSE } from "@/lib/konkurranse";
import { merkenavn } from "@/lib/merker";

// Lite varsel nederst på skjermen når eleven får poeng («+12 poeng»): stjernen
// snurrer inn med gnister, og tallet teller opp. Flere poeng rett etter
// hverandre legges sammen og teller videre derfra. Lenker til konkurransesiden.
// Tjener eleven et merke (lib/merker.ts), kommer «Nytt merke» over, med lenke
// til samlingen.
export function Poengvarsel() {
  const [varsel, setVarsel] = useState({ poeng: 0, fra: 0, nr: 0 });
  const [merker, setMerker] = useState<{ liste: string[]; nr: number }>({ liste: [], nr: 0 });
  const skjul = useRef<number | undefined>(undefined);
  const skjulMerker = useRef<number | undefined>(undefined);
  const stjerne = useRef<HTMLSpanElement>(null);
  const medalje = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onPoeng = (e: Event) => {
      const n = (e as CustomEvent<number>).detail;
      if (!(n > 0)) return;
      setVarsel((v) => ({ poeng: v.poeng + n, fra: v.poeng, nr: v.nr + 1 }));
      window.clearTimeout(skjul.current);
      skjul.current = window.setTimeout(() => setVarsel((v) => ({ ...v, poeng: 0, fra: 0 })), 3600);
    };
    const onMerke = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (!merkenavn(id)) return;
      setMerker((m) => ({ liste: m.liste.includes(id) ? m.liste : [...m.liste, id], nr: m.nr + 1 }));
      window.clearTimeout(skjulMerker.current);
      skjulMerker.current = window.setTimeout(() => setMerker((m) => ({ ...m, liste: [] })), 5500);
    };
    window.addEventListener(POENG_HENDELSE, onPoeng);
    window.addEventListener(MERKE_HENDELSE, onMerke);
    return () => {
      window.removeEventListener(POENG_HENDELSE, onPoeng);
      window.removeEventListener(MERKE_HENDELSE, onMerke);
      window.clearTimeout(skjul.current);
      window.clearTimeout(skjulMerker.current);
    };
  }, []);

  // Gnister når stjernen (eller medaljen) har landet (varselet spretter inn etter 150 ms).
  useEffect(() => {
    if (!varsel.nr) return;
    const t = window.setTimeout(() => gnister(stjerne.current, 10), 320);
    return () => window.clearTimeout(t);
  }, [varsel.nr]);
  useEffect(() => {
    if (!merker.nr) return;
    const t = window.setTimeout(() => gnister(medalje.current, 16), 320);
    return () => window.clearTimeout(t);
  }, [merker.nr]);

  const sist = merker.liste.at(-1);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex flex-col items-center gap-2 px-5">
      {sist && (
        <Link
          key={`merke-${merker.nr}`}
          href="/konto#samling"
          className="pop pointer-events-auto inline-flex items-center gap-2.5 rounded-full bg-foreground text-background pl-1.5 pr-4 py-1.5 text-sm font-semibold shadow-lift"
        >
          <span
            ref={medalje}
            className="ikon-pop inline-flex size-7 items-center justify-center rounded-full bg-primary text-white [animation-delay:200ms]"
          >
            <Merkeikon merke={sist} size={15} />
          </span>
          {merker.liste.length === 1 ? (
            <span>
              Nytt merke: <span className="font-bold">{merkenavn(sist)}</span>
            </span>
          ) : (
            <span className="font-bold">{merker.liste.length} nye merker</span>
          )}
        </Link>
      )}
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
