"use client";

import Link from "next/link";
import { useState } from "react";

export default function TemaPage() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="flex flex-col flex-1 relative">
      <header className="flex items-center justify-between px-6 sm:px-14 py-5 border-b border-border">
        <Link href="/fag" className="flex items-center gap-2.5 text-muted">
          <ChevronLeft />
          <span className="text-sm">Vg2 → Kjemi 1</span>
        </Link>
        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
          CL
        </div>
      </header>

      <div className="px-6 sm:px-14 py-11 flex flex-col gap-10 max-w-4xl w-full mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col gap-2.5 max-w-xl">
            <h1 className="font-display text-3xl sm:text-4xl font-semibold">
              Kjemiske reaksjoner
            </h1>
            <p className="text-muted">
              Eksoterme og endoterme reaksjoner, reaksjonsfart og likevekt.
              Sist øvd i går.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 shrink-0">
            <svg width="76" height="76" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#E7E2D8" strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="#2C4BD4"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="58.4 97.4"
                transform="rotate(-90 18 18)"
              />
            </svg>
            <span className="text-xs font-semibold text-muted">
              60% fullført
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ModeCard
            href="/tema"
            color="success"
            title="Sammendrag"
            text="Begreper og notater for temaet"
            icon="book"
          />
          <ModeCard
            href="/flashcards"
            color="primary"
            title="Flashcards"
            text="6 kort"
            icon="cards"
          />
          <ModeCard
            href="/quiz"
            color="accent"
            title="Quiz"
            text="4 spørsmål"
            icon="check"
          />
          <ModeCard
            href="/tema"
            color="purple"
            title="Miniprøve"
            text="15 minutter, blandet format"
            icon="spark"
          />
        </div>
      </div>

      {chatOpen && (
        <div className="absolute bottom-24 right-6 sm:right-14 w-80 bg-white border border-border rounded-2xl p-5 shadow-[0_24px_48px_-24px_rgba(27,26,46,0.25)] flex flex-col gap-3">
          <div className="text-xs font-semibold text-muted">
            AI-HJELP · KJEMISKE REAKSJONER
          </div>
          <div className="bg-background rounded-xl px-3.5 py-3 text-sm leading-relaxed">
            Hva lurer du på i dette temaet? Jeg svarer ut fra pensumet i Kjemi
            1.
          </div>
          <div className="border border-border rounded-lg px-3 py-2.5 text-sm text-[#8a8694]">
            Skriv et spørsmål …
          </div>
        </div>
      )}

      <button
        onClick={() => setChatOpen((v) => !v)}
        aria-label="Åpne AI-hjelp"
        className="absolute bottom-10 right-6 sm:right-14 w-15 h-15 rounded-full bg-foreground text-white flex items-center justify-center shadow-[0_16px_32px_-12px_rgba(27,26,46,0.4)]"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 5h16v11H8l-4 4V5z" />
        </svg>
      </button>
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ModeCard({
  href,
  color,
  title,
  text,
  icon,
}: {
  href: string;
  color: "success" | "primary" | "accent" | "purple";
  title: string;
  text: string;
  icon: "book" | "cards" | "check" | "spark";
}) {
  const bg =
    color === "success"
      ? "bg-success-tint text-success"
      : color === "primary"
        ? "bg-primary-tint text-primary"
        : color === "accent"
          ? "bg-accent-tint text-accent"
          : "bg-[#f3eefc] text-[#7c4dd4]";
  return (
    <Link
      href={href}
      className="flex items-center gap-4.5 bg-white border border-border rounded-2xl p-6 hover:border-primary transition-colors"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
        <ModeIcon name={icon} />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-base font-semibold">{title}</span>
        <span className="text-sm text-muted">{text}</span>
      </div>
    </Link>
  );
}

function ModeIcon({ name }: { name: string }) {
  if (name === "book") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
        <path d="M4 5.5v15" />
      </svg>
    );
  }
  if (name === "cards") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="7" width="14" height="11" rx="2" />
        <rect x="7" y="3" width="14" height="11" rx="2" fill="white" />
      </svg>
    );
  }
  if (name === "check") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12.5l2.5 2.5L16 9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4M12 17v4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M3 12h4M17 12h4M4.2 19.8L7 17M17 7l2.8-2.8" />
    </svg>
  );
}
