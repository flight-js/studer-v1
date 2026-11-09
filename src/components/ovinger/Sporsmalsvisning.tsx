"use client";

import { useEffect, useRef } from "react";
import { sporAi } from "@/components/AiHjelp";
import { Ekstramerke } from "@/components/Ekstramerke";
import { ArrowRight, Chat, Check, Close } from "@/components/icons";
import { Rapporter } from "@/components/Rapporter";
import { gnister } from "@/lib/feiring";
import type { Sporsmal } from "@/lib/pensum";

const LETTERS = ["A", "B", "C", "D", "E"];

const forklarTekst = (q: Sporsmal, valgt: number) =>
  `Jeg svarte feil på et quizspørsmål og vil forstå det.\n\nSpørsmål: ${q.tekst}\nMitt svar: ${q.alternativer[valgt]}\nRiktig svar: ${q.alternativer[q.riktig]}\n\nKan du forklare hvorfor?`;

// Ett spørsmål med svaralternativer og tilbakemelding. Brukes i quizen og i
// repetisjonen. Forelderen holder styr på hva eleven har valgt.
export function Sporsmalsvisning({
  q,
  temaId,
  overskrift,
  valgt,
  nesteTekst,
  onVelg,
  onNeste,
}: {
  q: Sporsmal;
  temaId: string;
  overskrift: React.ReactNode;
  valgt: number | null;
  nesteTekst: string;
  onVelg: (i: number) => void;
  onNeste: () => void;
}) {
  const answered = valgt !== null;
  const isCorrect = answered && valgt === q.riktig;

  // Riktig svar: gnister fra bokstaven (haken) på alternativet.
  const merker = useRef<(HTMLSpanElement | null)[]>([]);
  useEffect(() => {
    if (valgt !== null && valgt === q.riktig) gnister(merker.current[valgt]);
  }, [valgt, q.riktig]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ikke svar eller gå videre mens eleven skriver i AI-hjelpen.
      if ((e.target as HTMLElement).closest("input, textarea, select, [contenteditable], [role=dialog], [data-rapport]")) return;
      const n = Number(e.key);
      if (n >= 1 && n <= q.alternativer.length) onVelg(n - 1);
      const onButton = (e.target as HTMLElement).closest("button");
      if (e.key === "Enter" && answered && !onButton) onNeste();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answered, onVelg, onNeste, q.alternativer.length]);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-7 rise-rask">
      <div className="flex items-start justify-between gap-4">
        <p className="min-w-0 flex items-center gap-2.5 whitespace-nowrap text-sm font-medium text-muted">
          {overskrift}
          {!q.kjerne && <Ekstramerke />}
        </p>
        <Rapporter key={q.nokkel} temaId={temaId} type="sporsmal" nokkel={q.nokkel} plassering="hoyre" />
      </div>
      <h1 className="font-display text-[26px] sm:text-4xl font-semibold leading-[1.15] tracking-[-0.015em]">
        {q.tekst}
      </h1>

      <div className="flex flex-col gap-2.5" role="group" aria-label="Svaralternativer">
        {q.alternativer.map((text, i) => {
          const right = answered && i === q.riktig;
          const wrong = answered && i === valgt && i !== q.riktig;
          const dim = answered && !right && !wrong;
          return (
            <button
              key={i}
              onClick={() => onVelg(i)}
              disabled={answered}
              className={`trykk group flex items-center gap-4 text-left rounded-2xl px-4 py-3.5 sm:py-4 border-[1.5px] ${
                right
                  ? `bg-success-tint border-success text-success-ink kant-riktig ${isCorrect ? "riktig-sprett" : ""}`
                  : wrong
                    ? "rist bg-danger-tint border-danger text-danger-ink kant-feil"
                    : dim
                      ? "bg-surface border-border opacity-55"
                      : "bg-surface border-border hover:border-primary hover:bg-primary-tint/40 kant-hover"
              }`}
            >
              <span
                ref={(el) => {
                  merker.current[i] = el;
                }}
                className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold transition-colors duration-200 ${
                  right
                    ? "bg-success text-white"
                    : wrong
                      ? "bg-danger text-white"
                      : "bg-sunken text-muted group-hover:bg-primary group-hover:text-white"
                }`}
              >
                {right ? (
                  <Check size={16} className={isCorrect ? "ikon-pop" : undefined} />
                ) : wrong ? (
                  <Close size={16} />
                ) : (
                  LETTERS[i]
                )}
              </span>
              <span className="flex-1 text-base">{text}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          role="status"
          className={`rise-rask rounded-2xl px-5 py-4 flex gap-3.5 ${
            isCorrect ? "bg-success-tint" : "bg-danger-tint"
          }`}
        >
          <span
            className={`ikon-pop shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-white ${
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
            {!isCorrect && (
              <button
                onClick={() => sporAi(forklarTekst(q, valgt!))}
                className="mt-2 self-start inline-flex items-center gap-2 bg-surface border border-border px-3.5 py-2 rounded-lg text-sm font-semibold text-foreground hover:border-border-strong transition-[color,background-color,border-color,scale] active:scale-[0.98]"
              >
                <Chat size={16} />
                Forklar med AI
              </button>
            )}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 min-h-14">
        <span className="hidden sm:block text-xs text-faint">
          {answered ? "Trykk Enter for å gå videre" : `Tast 1–${q.alternativer.length} for å svare`}
        </span>
        {answered && (
          <button
            onClick={onNeste}
            autoFocus
            className="trykk trykk-blekk group ml-auto inline-flex items-center gap-2 bg-foreground text-background px-6 py-3.5 rounded-xl text-sm font-semibold rise-rask"
          >
            {nesteTekst}
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        )}
      </div>
    </div>
  );
}
