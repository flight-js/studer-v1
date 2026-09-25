"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dot } from "@/components/Dot";
import { ArrowRight, Check, Close, Repeat } from "@/components/icons";
import { Ovingstopp } from "@/components/Ovingsramme";
import { lagreResultat, temaHref, type Flashcard } from "@/lib/pensum";

export function Flashcardbunke({ temaId, kort, tilbake }: { temaId: string; kort: Flashcard[]; tilbake: string }) {
  const allIds = kort.map((_, i) => i);
  // Køen av kort som gjenstår. «Kan ikke ennå» legger kortet bakerst igjen.
  const [queue, setQueue] = useState<number[]>(allIds);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [retries, setRetries] = useState(0);

  const total = kort.length;
  const current = queue[0];
  const done = queue.length === 0;
  const card = done ? null : kort[current];

  // Lagre fremdriften når bunken er ferdig, eller når man går ut underveis.
  const lagret = useRef({ known: 0, done: false });
  useEffect(() => {
    lagret.current = { known: known.size, done };
    if (done) lagreResultat(temaId, "flashcards", total, total);
  }, [known, done, temaId, total]);
  useEffect(
    () => () => {
      const { known: n, done: ferdig } = lagret.current;
      if (!ferdig && n > 0) lagreResultat(temaId, "flashcards", n, total);
    },
    [temaId, total]
  );

  const answer = useCallback(
    (knowIt: boolean) => {
      if (done) return;
      setFlipped(false);
      setQueue(([head, ...rest]) => (knowIt ? rest : [...rest, head]));
      if (knowIt) setKnown((k) => new Set(k).add(current));
      else setRetries((r) => r + 1);
    },
    [current, done]
  );

  function restart() {
    setQueue(allIds);
    setKnown(new Set());
    setRetries(0);
    setFlipped(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done) return;
      if (e.key === " " && !(e.target as HTMLElement).closest("button")) {
        e.preventDefault();
        setFlipped((v) => !v);
      }
      if (e.key === "ArrowLeft" || e.key === "1") answer(false);
      if (e.key === "ArrowRight" || e.key === "2") answer(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answer, done]);

  return (
    <>
      <Ovingstopp tilbake={tilbake} avsluttTekst="Avslutt flashcards" hoyre={`${known.size} / ${total} kan`}>
        <div className="flex gap-1" aria-hidden="true">
          {allIds.map((id) => (
            <span
              key={id}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                known.has(id) ? "bg-success" : id === current ? "bg-primary" : "bg-sunken"
              }`}
            />
          ))}
        </div>
      </Ovingstopp>

      <main id="innhold" className="flex-1 flex flex-col items-center justify-center gap-8 px-5 py-10">
        {done || !card ? (
          <div className="w-full max-w-md flex flex-col items-center text-center gap-6 rise">
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
                className="inline-flex items-center gap-2 border-[1.5px] border-border-strong px-5 py-3.5 rounded-xl text-sm font-semibold hover:border-foreground transition-colors active:scale-[0.98]"
              >
                <Repeat size={16} />
                Start på nytt
              </button>
              <Link
                href={temaHref("/quiz", temaId)}
                className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98]"
              >
                Test deg med quiz
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div key={current + "-" + retries + "-" + known.size} className="flip-scene w-full max-w-lg rise">
              <button
                onClick={() => setFlipped((v) => !v)}
                data-flipped={flipped}
                aria-label={flipped ? `Forklaring: ${card.forklaring}. Trykk for å snu tilbake.` : `Begrep: ${card.begrep}. Trykk for å se forklaringen.`}
                className="flip-card relative block w-full h-80 sm:h-96"
              >
                <span className="flip-face absolute inset-0 bg-surface border border-border rounded-[28px] shadow-lift flex flex-col items-center justify-center gap-4 p-8 text-center">
                  <span className="text-sm font-medium text-faint">Begrep</span>
                  <span
                    lang="nb"
                    className={`font-display font-semibold tracking-[-0.02em] leading-tight hyphens-auto ${
                      card.begrep.length > 28 ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl"
                    }`}
                  >
                    {card.begrep}
                  </span>
                  <span className="absolute bottom-6 text-xs text-faint">Trykk for å snu</span>
                </span>
                <span className="flip-face flip-back absolute inset-0 bg-foreground text-background rounded-[28px] shadow-lift flex flex-col items-center justify-center gap-4 p-8 sm:p-10 text-center">
                  <span className="text-sm font-medium text-background/55">{card.begrep}</span>
                  <span
                    className={`font-display font-medium leading-snug ${
                      card.forklaring.length > 150 ? "text-xl sm:text-2xl" : "text-2xl sm:text-[28px]"
                    }`}
                  >
                    {card.forklaring}
                  </span>
                </span>
              </button>
            </div>

            <div className="flex gap-3 w-full max-w-lg">
              <button
                onClick={() => answer(false)}
                className="flex-1 flex items-center justify-center gap-2 bg-surface border-[1.5px] border-border-strong px-5 py-4 rounded-2xl text-sm font-semibold hover:border-danger hover:text-danger-ink transition-colors duration-200 active:scale-[0.98]"
              >
                <Close size={18} />
                Kan ikke ennå
              </button>
              <button
                onClick={() => answer(true)}
                className="flex-1 flex items-center justify-center gap-2 bg-success text-white px-5 py-4 rounded-2xl text-sm font-semibold hover:brightness-110 transition-[filter,transform] duration-200 active:scale-[0.98]"
              >
                <Check size={18} />
                Kan dette
              </button>
            </div>

            <p className="hidden sm:block text-xs text-faint">
              Mellomrom snur kortet<Dot />← kan ikke ennå<Dot />→ kan dette
            </p>
          </>
        )}
      </main>
    </>
  );
}
