"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Check, Close, Repeat } from "@/components/icons";
import { Ovingstopp } from "@/components/Ovingsramme";
import { lagreResultat, temaHref, type Sporsmal } from "@/lib/pensum";

const LETTERS = ["A", "B", "C", "D", "E"];

export function Quizrunde({ temaId, sporsmal, tilbake }: { temaId: string; sporsmal: Sporsmal[]; tilbake: string }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const total = sporsmal.length;
  const q = sporsmal[index];
  const answered = selected !== null;
  const isCorrect = answered && selected === q.riktig;
  const progressPct = done ? 100 : ((index + (answered ? 1 : 0)) / total) * 100;

  const choose = useCallback(
    (i: number) => {
      if (answered || done) return;
      setSelected(i);
      if (i === q.riktig) setScore((s) => s + 1);
    },
    [answered, done, q.riktig]
  );

  const next = useCallback(() => {
    if (index + 1 >= total) {
      setDone(true);
      lagreResultat(temaId, "quiz", score, total);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }, [index, total, temaId, score]);

  function restart() {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done) return;
      const n = Number(e.key);
      if (n >= 1 && n <= q.alternativer.length) choose(n - 1);
      const onButton = (e.target as HTMLElement).closest("button");
      if (e.key === "Enter" && answered && !onButton) next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answered, choose, done, next, q.alternativer.length]);

  return (
    <>
      <Ovingstopp tilbake={tilbake} avsluttTekst="Avslutt quiz" hoyre={`${done ? total : index + 1} / ${total}`}>
        <div
          className="h-2 bg-sunken rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round(progressPct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Fremdrift i quizen"
        >
          <div
            className="h-full bg-primary rounded-full origin-left transition-transform duration-500 ease-out-soft"
            style={{ transform: `scaleX(${progressPct / 100})` }}
          />
        </div>
      </Ovingstopp>

      <main id="innhold" className="flex-1 flex flex-col px-5 sm:px-8 py-10 sm:py-16">
        {done ? (
          <Result score={score} total={total} onRestart={restart} temaId={temaId} />
        ) : (
          <div key={index} className="w-full max-w-2xl mx-auto flex flex-col gap-7 rise">
            <p className="text-sm font-medium text-muted">Spørsmål {index + 1}</p>
            <h1 className="font-display text-[26px] sm:text-4xl font-semibold leading-[1.15] tracking-[-0.015em]">
              {q.tekst}
            </h1>

            <div className="flex flex-col gap-2.5" role="group" aria-label="Svaralternativer">
              {q.alternativer.map((text, i) => {
                const right = answered && i === q.riktig;
                const wrong = answered && i === selected && i !== q.riktig;
                const dim = answered && !right && !wrong;
                return (
                  <button
                    key={i}
                    onClick={() => choose(i)}
                    disabled={answered}
                    className={`group flex items-center gap-4 text-left rounded-2xl px-4 py-3.5 sm:py-4 border-[1.5px] transition-[border-color,background-color,opacity,transform] duration-200 ${
                      right
                        ? "bg-success-tint border-success text-success-ink"
                        : wrong
                          ? "bg-danger-tint border-danger text-danger-ink"
                          : dim
                            ? "bg-surface border-border opacity-55"
                            : "bg-surface border-border hover:border-primary hover:bg-primary-tint/40 active:scale-[0.99]"
                    }`}
                  >
                    <span
                      className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold transition-colors duration-200 ${
                        right
                          ? "bg-success text-white"
                          : wrong
                            ? "bg-danger text-white"
                            : "bg-sunken text-muted group-hover:bg-primary group-hover:text-white"
                      }`}
                    >
                      {right ? <Check size={16} /> : wrong ? <Close size={16} /> : LETTERS[i]}
                    </span>
                    <span className="flex-1 text-base">{text}</span>
                  </button>
                );
              })}
            </div>

            {answered && (
              <div
                role="status"
                className={`rise rounded-2xl px-5 py-4 flex gap-3.5 ${
                  isCorrect ? "bg-success-tint" : "bg-danger-tint"
                }`}
              >
                <span
                  className={`shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-white ${
                    isCorrect ? "bg-success" : "bg-danger"
                  }`}
                >
                  {isCorrect ? <Check size={14} /> : <Close size={14} />}
                </span>
                <span className="flex flex-col gap-1">
                  <span className={`font-semibold ${isCorrect ? "text-success-ink" : "text-danger-ink"}`}>
                    {isCorrect ? "Riktig" : "Ikke helt"}
                  </span>
                  <span className="text-sm leading-relaxed text-ink-soft">{q.forklaring}</span>
                </span>
              </div>
            )}

            <div className="flex items-center justify-between gap-4 min-h-14">
              <span className="hidden sm:block text-xs text-faint">
                {answered ? "Trykk Enter for å gå videre" : `Tast 1–${q.alternativer.length} for å svare`}
              </span>
              {answered && (
                <button
                  onClick={next}
                  autoFocus
                  className="group ml-auto inline-flex items-center gap-2 bg-foreground text-background px-6 py-3.5 rounded-xl text-sm font-semibold transition-transform duration-200 active:scale-[0.98] rise"
                >
                  {index + 1 >= total ? "Se resultat" : "Neste spørsmål"}
                  <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

function Result({
  score,
  total,
  onRestart,
  temaId,
}: {
  score: number;
  total: number;
  onRestart: () => void;
  temaId: string;
}) {
  const all = score === total;
  const message = all
    ? "Alt riktig. Du har dette temaet inne."
    : score >= total / 2
      ? "Godt jobbet. Ta en runde til på det du bommet på."
      : "Et godt sted å starte. Prøv flashcardsene, og ta quizen igjen etterpå.";
  return (
    <div className="w-full max-w-xl mx-auto my-auto flex flex-col items-center text-center gap-6 rise">
      <p className="text-sm font-medium text-muted">Quiz fullført</p>
      <div className="font-display text-7xl sm:text-8xl font-semibold tracking-[-0.03em] tabular-nums">
        {score}
        <span className="text-faint">/{total}</span>
      </div>
      <p className="text-lg text-ink-soft max-w-[34ch]">{message}</p>
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 border-[1.5px] border-border-strong px-5 py-3.5 rounded-xl text-sm font-semibold hover:border-foreground transition-colors active:scale-[0.98]"
        >
          <Repeat size={16} />
          Ta quizen igjen
        </button>
        <Link
          href={temaHref(all ? "/miniprove" : "/flashcards", temaId)}
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98]"
        >
          {all ? "Ta miniprøven" : "Øv med flashcards"}
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
