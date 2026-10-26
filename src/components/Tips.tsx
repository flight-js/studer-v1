"use client";

import { useEffect, useRef, useState } from "react";
import { Close, Lyspare } from "@/components/icons";
import type { Tips as Tipset } from "@/lib/tips";

// Små tips om funksjoner som er lette å overse (innholdet står i lib/tips.tsx).
// Hvert tips vises bare én gang, høyst ett per side, og aldri tettere enn
// PAUSE – så de ikke blir mas. Tipset kommer etter et lite øyeblikk, så det
// ikke konkurrerer med siden mens den lastes.
//
// flytende: et lite kort nederst til venstre (over «Spør AI» på mobil), som
// går bort av seg selv. Ellers står kortet der komponenten er plassert –
// brukes i øvingene, så det aldri dekker knappene.

const SETT = "studer-tips-sett";
const SIST = "studer-tips-sist";
// Under utvikling er det ingen pause, og ?nye-tips i adressen viser alle på nytt,
// så tipsene er lette å teste. På studer.no gjelder pausen.
const UTVIKLING = process.env.NODE_ENV === "development";
const PAUSE = UTVIKLING ? 0 : 3 * 60_000;
const VENT = 1500;
const VARER = 12_000;

export function Tips({ tips, flytende = false }: { tips: Tipset[]; flytende?: boolean }) {
  const [vist, setVist] = useState<Tipset | null>(null);
  const [ut, setUt] = useState(false);
  const holdt = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        if (UTVIKLING && new URLSearchParams(location.search).has("nye-tips")) localStorage.removeItem(SETT);
        if (Date.now() - Number(localStorage.getItem(SIST) ?? 0) < PAUSE) return;
        const sett: string[] = JSON.parse(localStorage.getItem(SETT) ?? "[]");
        const beroring = matchMedia("(hover: none)").matches;
        const neste = tips.find((x) => !sett.includes(x.id) && (!x.bare || (x.bare === "beroring") === beroring));
        if (!neste) return;
        localStorage.setItem(SETT, JSON.stringify([...sett, neste.id]));
        localStorage.setItem(SIST, String(Date.now()));
        setVist(neste);
      } catch {
        // Blokkert lagring: da vet vi ikke hva som er vist, så ingen tips.
      }
    }, VENT);
    return () => clearTimeout(t);
  }, [tips]);

  // Det flytende kortet går bort av seg selv, med mindre eleven holder pekeren over det.
  useEffect(() => {
    if (!vist || !flytende) return;
    const t = setTimeout(() => !holdt.current && setUt(true), VARER);
    return () => clearTimeout(t);
  }, [vist, flytende]);

  if (!vist) return null;

  const kort = (
    <div
      role="status"
      onPointerEnter={() => (holdt.current = true)}
      onAnimationEnd={() => ut && setVist(null)}
      className={`${ut ? "tips-ut" : "tips"} flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 text-left ${
        flytende ? "shadow-lift" : ""
      }`}
    >
      <span
        aria-hidden="true"
        className="shrink-0 size-8 rounded-full bg-merke/35 text-foreground flex items-center justify-center"
      >
        <Lyspare size={17} />
      </span>
      <div className="flex-1 min-w-0 flex flex-col gap-0.5 pt-0.5">
        <p className="text-xs font-semibold text-muted">Tips</p>
        <p className="text-[15px] leading-snug text-ink-soft">{vist.tekst}</p>
      </div>
      <button
        type="button"
        onClick={() => setUt(true)}
        aria-label="Lukk tipset"
        className="shrink-0 -mt-1 -mr-1 p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-sunken transition-colors"
      >
        <Close size={16} />
      </button>
    </div>
  );

  return flytende ? (
    <div className="fixed z-40 inset-x-4 bottom-24 sm:inset-x-auto sm:left-6 sm:bottom-6 sm:w-[22rem]">{kort}</div>
  ) : (
    <div className="w-full max-w-lg">{kort}</div>
  );
}
