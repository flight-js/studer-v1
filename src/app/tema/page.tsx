"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppBar } from "@/components/AppBar";
import {
  Book,
  Cards,
  Chat,
  ChevronRight,
  Close,
  Quiz,
  Timer,
} from "@/components/icons";
import { kjemiskeReaksjonerCards, kjemiskeReaksjonerQuiz } from "@/lib/data";

const PROGRESS = 60;

export default function TemaPage() {
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    if (!chatOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setChatOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chatOpen]);

  return (
    <div className="flex flex-col flex-1">
      <AppBar back="/fag" backLabel="Vg2 / Kjemi 1" />

      <main
        id="innhold"
        className="px-5 sm:px-8 pt-10 sm:pt-14 pb-32 flex flex-col gap-12 max-w-5xl w-full mx-auto"
      >
        <div className="grid sm:grid-cols-[1fr_auto] gap-8 items-end rise">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium text-muted">Kjemi 1 · Tema 1 av 9</p>
            <h1 className="font-display text-4xl sm:text-6xl font-semibold tracking-[-0.025em] leading-[1.02]">
              Kjemiske reaksjoner
            </h1>
            <p className="text-lg text-ink-soft leading-relaxed max-w-[48ch]">
              Eksoterme og endoterme reaksjoner, reaksjonsfart og likevekt.
            </p>
          </div>
          <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
            <ProgressRing value={PROGRESS} />
            <div className="flex flex-col sm:items-end">
              <span className="text-sm font-semibold tabular-nums">{PROGRESS} % gjennomgått</span>
              <span className="text-xs text-muted">Sist øvd i går</span>
            </div>
          </div>
        </div>

        <section aria-labelledby="ov-label" className="flex flex-col gap-4">
          <h2 id="ov-label" className="font-body text-sm font-medium text-muted">
            Velg hvordan du vil øve
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ModeCard
              href="/flashcards"
              title="Flashcards"
              text={`${kjemiskeReaksjonerCards.length} kort · begreper og definisjoner`}
              icon={<Cards size={22} />}
              featured
            />
            <ModeCard
              href="/quiz"
              title="Quiz"
              text={`${kjemiskeReaksjonerQuiz.length} spørsmål · flervalg med forklaring`}
              icon={<Quiz size={22} />}
            />
            <ModeCard
              title="Sammendrag"
              text="Begreper og notater for temaet"
              icon={<Book size={22} />}
            />
            <ModeCard
              title="Miniprøve"
              text="15 minutter, blandet format"
              icon={<Timer size={22} />}
            />
          </div>
        </section>
      </main>

      {/* AI-hjelp */}
      <div className="fixed bottom-6 right-5 sm:right-8 z-50 flex flex-col items-end gap-3">
        {chatOpen && (
          <div
            id="ai-panel"
            role="dialog"
            aria-label="AI-hjelp"
            className="w-[min(22rem,calc(100vw-2.5rem))] bg-surface border border-border rounded-3xl p-5 shadow-lift flex flex-col gap-4 rise"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">AI-hjelp</span>
              <button
                onClick={() => setChatOpen(false)}
                aria-label="Lukk AI-hjelp"
                className="p-1.5 -m-1.5 rounded-lg text-muted hover:text-foreground hover:bg-sunken transition-colors"
              >
                <Close size={18} />
              </button>
            </div>
            <div className="self-start bg-sunken rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed text-ink-soft">
              Hva lurer du på i Kjemiske reaksjoner? Jeg svarer ut fra pensumet
              i Kjemi 1.
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <label htmlFor="ai-input" className="sr-only">
                Skriv et spørsmål
              </label>
              <input
                id="ai-input"
                disabled
                placeholder="Chat kommer snart"
                className="flex-1 min-w-0 bg-background border border-border rounded-xl px-3.5 py-2.5 text-base sm:text-sm placeholder:text-faint disabled:cursor-not-allowed"
              />
            </form>
          </div>
        )}
        <button
          onClick={() => setChatOpen((v) => !v)}
          aria-expanded={chatOpen}
          aria-controls="ai-panel"
          className="flex items-center gap-2.5 h-13 pl-4 pr-5 rounded-2xl bg-foreground text-background font-semibold text-sm shadow-lift transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
        >
          {chatOpen ? <Close size={20} /> : <Chat size={20} />}
          {chatOpen ? "Lukk" : "Spør AI"}
        </button>
      </div>
    </div>
  );
}

function ProgressRing({ value }: { value: number }) {
  const r = 15.5;
  const c = 2 * Math.PI * r;
  return (
    <svg width="64" height="64" viewBox="0 0 36 36" aria-hidden="true">
      <circle cx="18" cy="18" r={r} fill="none" stroke="var(--sunken)" strokeWidth="3" />
      <circle
        cx="18"
        cy="18"
        r={r}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${(value / 100) * c} ${c}`}
        transform="rotate(-90 18 18)"
      />
    </svg>
  );
}

function ModeCard({
  href,
  title,
  text,
  icon,
  featured,
}: {
  href?: string;
  title: string;
  text: string;
  icon: React.ReactNode;
  featured?: boolean;
}) {
  const inner = (
    <>
      <span
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
          !href
            ? "bg-sunken text-faint"
            : featured
              ? "bg-primary text-white"
              : "bg-primary-tint text-primary"
        }`}
      >
        {icon}
      </span>
      <span className="flex-1 flex flex-col gap-0.5">
        <span className={`text-lg font-semibold ${href ? "" : "text-muted"}`}>{title}</span>
        <span className="text-sm text-muted">{text}</span>
      </span>
      {href ? (
        <ChevronRight
          size={20}
          className="text-faint transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
        />
      ) : (
        <span className="text-xs font-medium text-faint">Kommer snart</span>
      )}
    </>
  );

  const base = "flex items-center gap-4 rounded-2xl p-5 sm:p-6 border";
  if (!href) {
    return (
      <div className={`${base} bg-transparent border-dashed border-border-strong`} aria-disabled="true">
        {inner}
      </div>
    );
  }
  return (
    <Link
      href={href}
      className={`group ${base} bg-surface border-border hover:border-primary/50 hover:shadow-card transition-[border-color,box-shadow,transform] duration-200 active:scale-[0.99]`}
    >
      {inner}
    </Link>
  );
}
