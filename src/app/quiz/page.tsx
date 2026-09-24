"use client";

import Link from "next/link";
import { useState } from "react";
import { kjemiskeReaksjonerQuiz } from "@/lib/data";

export default function QuizPage() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const total = kjemiskeReaksjonerQuiz.length;
  const q = kjemiskeReaksjonerQuiz[index];
  const answered = selected !== null;
  const progressPct = Math.round((index / total) * 100);

  function next() {
    setIndex((i) => (i + 1) % total);
    setSelected(null);
  }

  return (
    <div className="flex flex-col flex-1">
      <header className="flex items-center gap-6 px-6 sm:px-14 py-5 border-b border-border">
        <Link href="/tema" aria-label="Avslutt quiz" className="flex">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </Link>
        <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="text-sm font-semibold text-muted whitespace-nowrap">
          Spørsmål {index + 1} av {total}
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-14 py-8 gap-7">
        <div className="w-full max-w-2xl flex flex-col gap-6">
          <div className="text-xs font-semibold text-muted tracking-wide">
            KJEMI 1 · KJEMISKE REAKSJONER
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold leading-snug">
            {q.text}
          </h2>
          <div className="flex flex-col gap-3">
            {q.options.map((text, i) => {
              let cls =
                "flex items-center justify-between text-left bg-white border-[1.5px] border-border rounded-xl px-5 py-4 text-sm";
              let mark = "";
              let markCls = "text-xs font-bold";
              if (answered) {
                if (i === q.correct) {
                  cls =
                    "flex items-center justify-between text-left bg-success-tint border-[1.5px] border-success rounded-xl px-5 py-4 text-sm text-[#12633f]";
                  mark = "Riktig";
                  markCls = "text-xs font-bold text-success";
                } else if (i === selected) {
                  cls =
                    "flex items-center justify-between text-left bg-danger-tint border-[1.5px] border-danger rounded-xl px-5 py-4 text-sm text-[#8c2626]";
                  mark = "Feil";
                  markCls = "text-xs font-bold text-danger";
                }
              }
              return (
                <button
                  key={text}
                  onClick={() => !answered && setSelected(i)}
                  className={cls}
                >
                  <span>{text}</span>
                  <span className={markCls}>{mark}</span>
                </button>
              );
            })}
          </div>
          {answered && (
            <div className="bg-primary-tint rounded-xl px-5 py-4 text-sm leading-relaxed">
              {q.explain}
            </div>
          )}
        </div>
        {answered && (
          <button
            onClick={next}
            className="max-w-2xl w-full bg-foreground text-white py-4 rounded-xl text-sm font-semibold"
          >
            Neste spørsmål
          </button>
        )}
      </div>
    </div>
  );
}
