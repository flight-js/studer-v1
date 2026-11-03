"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Avkrysning } from "@/components/Avkrysning";
import { Utvalg } from "@/components/icons";

// Temavalg i repetisjonstemaet: en knapp i hjørnet av flashcards, quiz og
// miniprøve som åpner en liste over temaene i faget. Eleven velger hvilke
// temaer kortene, spørsmålene eller oppgavene skal komme fra, og øvingen
// starter på nytt med dem. Valget er det samme i alle tre øvingene og huskes
// i nettleseren til neste gang.

const nokkel = (temaId: string) => `studer-temavalg:${temaId}`;
const ingen = () => () => {};

function les(temaId: string): string | null {
  try {
    return localStorage.getItem(nokkel(temaId));
  } catch {
    return null;
  }
}

// Temaene i rekkefølgen de først dukker opp (lista er sortert slik temaene står i faget).
export const unikeKilder = (kilder: (string | null)[]) => [...new Set(kilder.filter((k): k is string => !!k))];

export function useTemavalg(temaId: string, alle: string[]) {
  const lagret = useSyncExternalStore(ingen, () => les(temaId), () => null);
  const [endret, setEndret] = useState<Set<string> | null>(null);
  let valgt = endret;
  if (!valgt) {
    try {
      const finnes = new Set(alle);
      const fraFor = (JSON.parse(lagret ?? "[]") as string[]).filter((k) => finnes.has(k));
      valgt = new Set(fraFor.length ? fraFor : alle);
    } catch {
      valgt = new Set(alle);
    }
  }
  const alleValgt = alle.every((k) => valgt.has(k));
  const sett = (ny: Set<string>) => {
    setEndret(ny);
    try {
      if (alle.every((k) => ny.has(k))) localStorage.removeItem(nokkel(temaId));
      else localStorage.setItem(nokkel(temaId), JSON.stringify([...ny]));
    } catch {
      // Blokkert lagring: valget gjelder bare denne gangen.
    }
  };
  return { valgt, alleValgt, sett };
}

export function Temavalg({
  temaer,
  valgt,
  onBruk,
  enhet,
}: {
  temaer: { navn: string; antall: number }[];
  valgt: Set<string>;
  onBruk: (ny: Set<string>) => void;
  // Hvordan antallet skrives, for eksempel n => `${n} kort`.
  enhet: (n: number) => string;
}) {
  const [apen, setApen] = useState(false);
  const [utkast, setUtkast] = useState<Set<string>>(valgt);
  const boks = useRef<HTMLDivElement>(null);
  const alleValgt = temaer.every((t) => valgt.has(t.navn));
  const antall = temaer.filter((t) => utkast.has(t.navn)).reduce((s, t) => s + t.antall, 0);

  useEffect(() => {
    if (!apen) return;
    const utenfor = (e: PointerEvent) => !boks.current?.contains(e.target as Node) && setApen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setApen(false);
    document.addEventListener("pointerdown", utenfor);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", utenfor);
      document.removeEventListener("keydown", esc);
    };
  }, [apen]);

  const veksle = (navn: string) => {
    const ny = new Set(utkast);
    if (ny.has(navn)) ny.delete(navn);
    else ny.add(navn);
    setUtkast(ny);
  };

  return (
    <div ref={boks} className="sm:relative">
      <button
        type="button"
        onClick={() => {
          setUtkast(new Set(valgt));
          setApen(!apen);
        }}
        aria-expanded={apen}
        aria-haspopup="dialog"
        aria-label={alleValgt ? "Velg temaer" : `Velg temaer, ${valgt.size} av ${temaer.length} valgt`}
        className={`flex items-center gap-1.5 h-9 px-2.5 rounded-lg text-sm font-semibold transition-colors ${
          apen ? "bg-sunken text-foreground" : "text-muted hover:text-foreground hover:bg-sunken"
        }`}
      >
        <Utvalg size={18} />
        <span className="hidden sm:inline">Temaer</span>
        {!alleValgt && (
          <span className="rounded-md bg-primary-tint px-1.5 text-xs text-primary-dark tabular-nums">
            {valgt.size}/{temaer.length}
          </span>
        )}
      </button>

      {apen && (
        <div
          role="dialog"
          aria-label="Velg temaer"
          className="rise-rask fixed inset-x-4 top-[4.5rem] sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[22rem] z-50 rounded-2xl border border-border bg-surface shadow-lift p-3 flex flex-col gap-3 text-left"
        >
          <div className="flex items-center justify-between gap-4 px-1 pt-1">
            <p className="font-semibold">Velg temaer</p>
            <span className="flex gap-3 text-sm font-semibold">
              <button
                type="button"
                onClick={() => setUtkast(new Set(temaer.map((t) => t.navn)))}
                className="text-primary hover:text-primary-dark transition-colors"
              >
                Alle
              </button>
              <button
                type="button"
                onClick={() => setUtkast(new Set())}
                className="text-primary hover:text-primary-dark transition-colors"
              >
                Ingen
              </button>
            </span>
          </div>
          <ul className="max-h-[50svh] overflow-y-auto overscroll-contain -mx-1 px-1">
            {temaer.map((t) => (
              <li key={t.navn}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={utkast.has(t.navn)}
                  onClick={() => veksle(t.navn)}
                  className="w-full flex items-center gap-3 rounded-xl px-2 py-2.5 text-left hover:bg-sunken transition-colors"
                >
                  <Avkrysning tilstand={utkast.has(t.navn)} />
                  <span className="flex-1 min-w-0 text-[15px] font-medium leading-snug">{t.navn}</span>
                  <span className="text-xs text-muted tabular-nums">{t.antall}</span>
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            disabled={antall === 0}
            onClick={() => {
              onBruk(utkast);
              setApen(false);
            }}
            className="w-full bg-primary text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-[color,background-color,scale,opacity] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {antall === 0 ? "Velg minst ett tema" : `Start på nytt med ${enhet(antall)}`}
          </button>
        </div>
      )}
    </div>
  );
}
