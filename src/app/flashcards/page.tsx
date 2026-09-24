"use client";

import Link from "next/link";
import { useState } from "react";
import { kjemiskeReaksjonerCards } from "@/lib/data";

export default function FlashcardsPage() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const total = kjemiskeReaksjonerCards.length;
  const card = kjemiskeReaksjonerCards[index];

  function advance() {
    setIndex((i) => (i + 1) % total);
    setFlipped(false);
  }

  return (
    <div className="flex flex-col flex-1">
      <header className="flex items-center gap-6 px-6 sm:px-14 py-5 border-b border-border">
        <Link href="/tema" aria-label="Avslutt flashcards" className="flex">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </Link>
        <div className="text-sm font-semibold text-muted">
          Kort {index + 1} av {total}
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center gap-7 px-6 py-10">
        <button
          onClick={() => setFlipped((v) => !v)}
          className="w-full max-w-lg h-72 sm:h-80 bg-white border border-border rounded-3xl shadow-[0_24px_48px_-24px_rgba(27,26,46,0.18)] flex flex-col items-center justify-center gap-4 p-8 text-center"
        >
          <div className="text-xs font-bold text-[#8a8694] tracking-wider">
            {flipped ? "DEFINISJON" : "BEGREP"}
          </div>
          <div
            className={`font-display font-semibold leading-snug ${
              flipped ? "text-xl" : "text-3xl"
            }`}
          >
            {flipped ? card.def : card.term}
          </div>
          <div className="text-xs text-[#8a8694]">Klikk kortet for å snu</div>
        </button>

        <div className="flex gap-4">
          <button
            onClick={advance}
            className="flex items-center gap-2 bg-white border-[1.5px] border-danger text-danger px-6.5 py-3.5 rounded-xl text-sm font-semibold"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
            Kan ikke ennå
          </button>
          <button
            onClick={advance}
            className="flex items-center gap-2 bg-success text-white px-6.5 py-3.5 rounded-xl text-sm font-semibold"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Kan dette
          </button>
        </div>

        <div className="flex gap-1.5">
          {kjemiskeReaksjonerCards.map((c, i) => (
            <div
              key={c.term}
              className={`w-2 h-2 rounded-full ${
                i === index ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
