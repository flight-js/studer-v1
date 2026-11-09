"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AltRiktig } from "@/components/AltRiktig";
import { ArrowRight, ChevronLeft, ChevronRight, Repeat } from "@/components/icons";
import { Flippkort, useKorttaster } from "@/components/ovinger/Flippkort";
import { Ovingstopp } from "@/components/Ovingsramme";
import { Rapporter } from "@/components/Rapporter";
import { Tips } from "@/components/Tips";
import { huskSvar } from "@/lib/minne";
import { lagreResultat, temaHref, type Flashcard } from "@/lib/pensum";
import { TIPS } from "@/lib/tips";

// Ett svar i bunken: hvilket kort, og om eleven kunne det.
type Steg = { id: number; kan: boolean };

// meny: temavalget i repetisjonstemaet. lagre: false når bare noen temaer er
// valgt – da regnes ikke runden med i fremdriften for temaet.
//
// Eleven kan gå tilbake til kort som allerede er besvart («Forrige kort» eller
// Backspace). Svaret som ble gitt, vises på kortet. Samme svar igjen går bare
// videre; det andre svaret retter bunken (kortet tas ut av eller inn i køen) og
// sender det rettede svaret til repetisjonen.
export function Flashcardbunke({
  temaId,
  kort,
  tilbake,
  meny,
  lagre = true,
}: {
  temaId: string;
  kort: Flashcard[];
  tilbake: string;
  meny?: React.ReactNode;
  lagre?: boolean;
}) {
  const allIds = kort.map((_, i) => i);
  // Køen av kort som gjenstår. «Kan ikke ennå» legger kortet bakerst igjen.
  const [queue, setQueue] = useState<number[]>(allIds);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [retries, setRetries] = useState(0);
  // Alle svarene i rekkefølge, og hvor langt tilbake eleven har gått (0 = nå).
  const [historikk, setHistorikk] = useState<Steg[]>([]);
  const [bakover, setBakover] = useState(0);

  const total = kort.length;
  const ser = bakover > 0 ? historikk[historikk.length - bakover] : null;
  const current = ser ? ser.id : queue[0];
  const done = queue.length === 0;
  const visFerdig = done && !ser;
  const card = visFerdig ? null : kort[current];
  const minne = card?.minne;

  // Lagre fremdriften når bunken er ferdig, eller når man går ut underveis.
  const lagret = useRef({ known: 0, done: false });
  useEffect(() => {
    lagret.current = { known: known.size, done };
    if (done && lagre) lagreResultat(temaId, "flashcards", total, total);
  }, [known, done, temaId, total, lagre]);
  useEffect(
    () => () => {
      const { known: n, done: ferdig } = lagret.current;
      if (!ferdig && n > 0 && lagre) lagreResultat(temaId, "flashcards", n, total);
    },
    [temaId, total, lagre]
  );

  const answer = useCallback(
    (knowIt: boolean) => {
      if (!minne) return;
      setFlipped(false);

      // Et kort eleven har gått tilbake til.
      if (ser) {
        const nr = historikk.length - bakover;
        if (ser.kan !== knowIt) {
          setHistorikk((h) => h.map((s, i) => (i === nr ? { ...s, kan: knowIt } : s)));
          if (knowIt) {
            // Var «kan ikke»: ta den ventende kopien ut av køen.
            setQueue((q) => {
              const i = q.lastIndexOf(ser.id);
              return i < 0 ? q : [...q.slice(0, i), ...q.slice(i + 1)];
            });
            setKnown((k) => new Set(k).add(ser.id));
            setRetries((r) => Math.max(0, r - 1));
          } else {
            // Var «kan»: kortet må tas igjen.
            setQueue((q) => [...q, ser.id]);
            setKnown((k) => {
              const n = new Set(k);
              n.delete(ser.id);
              return n;
            });
            setRetries((r) => r + 1);
          }
          huskSvar([{ type: "kort", nokkel: minne, kan: knowIt }]);
        }
        setBakover((b) => b - 1);
        return;
      }

      if (done) return;
      setQueue(([head, ...rest]) => (knowIt ? rest : [...rest, head]));
      if (knowIt) setKnown((k) => new Set(k).add(current));
      else setRetries((r) => r + 1);
      setHistorikk((h) => [...h, { id: current, kan: knowIt }]);
      huskSvar([{ type: "kort", nokkel: minne, kan: knowIt }]);
    },
    [current, done, minne, ser, historikk.length, bakover]
  );

  const forrige = useCallback(() => {
    setBakover((b) => Math.min(b + 1, historikk.length));
    setFlipped(false);
  }, [historikk.length]);
  const tilNa = () => {
    setBakover(0);
    setFlipped(false);
  };

  const snu = useCallback(() => setFlipped((v) => !v), []);
  useKorttaster(!visFerdig, snu, answer);

  // Backspace: forrige kort (ikke mens eleven skriver, f.eks. i AI-chatten).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Backspace" || bakover >= historikk.length) return;
      if ((e.target as HTMLElement).closest("input, textarea, select, [contenteditable], [role=dialog], [data-rapport]")) return;
      e.preventDefault();
      forrige();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [forrige, bakover, historikk.length]);

  function restart() {
    setQueue(allIds);
    setKnown(new Set());
    setRetries(0);
    setFlipped(false);
    setHistorikk([]);
    setBakover(0);
  }

  const kanGaTilbake = bakover < historikk.length;
  const navKnapp =
    "inline-flex items-center gap-1.5 -mx-2 px-2 py-1.5 rounded-lg text-sm font-semibold text-ink-soft hover:text-foreground hover:bg-sunken transition-colors duration-200 disabled:opacity-0 disabled:pointer-events-none";

  return (
    <>
      <Ovingstopp tilbake={tilbake} avsluttTekst="Avslutt flashcards" hoyre={`${known.size} / ${total} kan`} meny={meny}>
        <div className="flex gap-1" aria-hidden="true">
          {allIds.map((id) => (
            <span
              key={id}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                id === current && ser
                  ? "bg-foreground"
                  : known.has(id)
                    ? "bg-success"
                    : id === current
                      ? "bg-primary"
                      : "bg-sunken"
              }`}
            />
          ))}
        </div>
      </Ovingstopp>

      <main id="innhold" className="flex-1 flex flex-col items-center justify-center gap-8 px-5 pt-10 pb-28">
        {visFerdig || !card ? (
          <div className="w-full max-w-md flex flex-col items-center text-center gap-6 rise">
            {retries === 0 && <AltRiktig />}
            <p className="text-sm font-medium text-muted">Bunken er ferdig</p>
            <h1 className="font-display text-5xl sm:text-6xl font-semibold tracking-[-0.025em]">
              Alle {total} kort sitter
            </h1>
            <p className="text-lg text-ink-soft">
              {retries === 0
                ? "Du kunne alle på første forsøk."
                : `Du tok ${retries} ${retries === 1 ? "ekstra runde" : "ekstra runder"} på kortene som var vanskelige.`}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              <button
                onClick={restart}
                className="inline-flex items-center gap-2 border-[1.5px] border-border-strong px-5 py-3.5 rounded-xl text-sm font-semibold hover:border-foreground transition-[color,background-color,border-color,scale] active:scale-[0.98]"
              >
                <Repeat size={16} />
                Start på nytt
              </button>
              <Link
                href={temaHref("/quiz", temaId)}
                className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-[color,background-color,border-color,scale] active:scale-[0.98]"
              >
                Test deg med quiz
                <ArrowRight size={16} />
              </Link>
            </div>
            {kanGaTilbake && (
              <button type="button" onClick={forrige} className={navKnapp}>
                <ChevronLeft size={16} />
                Gå tilbake til siste kort
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Tilbake til besvarte kort, og hva eleven svarte der. */}
            <div className="w-full max-w-lg -mb-4 flex items-center justify-between gap-3 min-h-9">
              <button type="button" onClick={forrige} disabled={!kanGaTilbake} className={navKnapp}>
                <ChevronLeft size={16} />
                Forrige kort
              </button>
              {ser ? (
                <span className="rise-rask flex items-center gap-3">
                  <span
                    className={`rounded-md px-2 py-1 text-xs font-semibold ${
                      ser.kan ? "bg-success-tint text-success-ink" : "bg-danger-tint text-danger-ink"
                    }`}
                  >
                    Du svarte: {ser.kan ? "Kan dette" : "Kan ikke ennå"}
                  </span>
                  <button type="button" onClick={tilNa} className={navKnapp}>
                    <span className="hidden sm:inline">Til kortet du var på</span>
                    <span className="sm:hidden">Til nå</span>
                    <ChevronRight size={16} />
                  </button>
                </span>
              ) : (
                <span className="hidden sm:block text-xs text-faint">⌫ forrige kort</span>
              )}
            </div>

            <Flippkort
              kort={card}
              snudd={flipped}
              runde={`${current}-${retries}-${known.size}-${bakover}`}
              onSnu={snu}
              onSvar={answer}
              valgt={ser?.kan}
            />

            <Rapporter key={card.begrep} temaId={temaId} type="flashcard" nokkel={card.begrep} />

            {/* Står i flyten under kortet, så det aldri dekker knappene. */}
            <Tips tips={TIPS.flashcards} />
          </>
        )}
      </main>
    </>
  );
}
