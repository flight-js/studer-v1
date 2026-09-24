"use client";

import Link from "next/link";
import { useState } from "react";
import { trinnListe, temaByFag } from "@/lib/data";
import { Logo } from "@/components/Logo";

export default function FagvalgPage() {
  const [trinnId, setTrinnId] = useState("vg2");
  const [fagId, setFagId] = useState("kjemi1");

  const trinn = trinnListe.find((t) => t.id === trinnId)!;
  const fag = trinn.fag.find((f) => f.id === fagId) ?? null;
  const temaer = fagId ? temaByFag[fagId] ?? [] : [];

  return (
    <div className="flex flex-col flex-1">
      <header className="flex items-center justify-between px-6 sm:px-14 py-5 border-b border-border">
        <Link href="/" className="flex items-center gap-2.5">
          <ChevronLeft />
          <Logo className="text-xl" />
        </Link>
        <div className="text-sm text-muted hidden sm:block">
          {trinn.label}
          {fag ? ` → ${fag.name}` : ""}
        </div>
        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
          CL
        </div>
      </header>

      <div className="px-6 sm:px-14 py-9 flex flex-col gap-7 max-w-4xl w-full mx-auto">
        <div className="flex flex-col gap-3">
          <div className="text-xs font-semibold text-muted tracking-wide">
            TRINN
          </div>
          <div className="flex gap-2.5 flex-wrap">
            {trinnListe.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTrinnId(t.id);
                  setFagId(t.fag[0]?.id ?? "");
                }}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                  t.id === trinnId
                    ? "bg-primary text-white"
                    : "bg-white text-foreground border border-border"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="text-xs font-semibold text-muted tracking-wide">
            FAG · {trinn.label}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {trinn.fag.map((f) => (
              <button
                key={f.id}
                onClick={() => setFagId(f.id)}
                className={`flex flex-col gap-1 text-left rounded-2xl px-5 py-4.5 transition-colors ${
                  f.id === fagId
                    ? "bg-primary-tint border-[1.5px] border-primary"
                    : "bg-white border border-border"
                }`}
              >
                <span className="text-base font-semibold">{f.name}</span>
                <span className="text-xs text-muted">
                  {f.temaCount} temaer
                </span>
              </button>
            ))}
          </div>
        </div>

        {fag && (
          <div className="flex flex-col gap-3">
            <div className="text-xs font-semibold text-muted tracking-wide">
              TEMAER · {fag.name}
            </div>
            <div className="flex flex-col gap-2">
              {temaer.length === 0 && (
                <div className="text-sm text-muted bg-white border border-border rounded-xl px-5 py-4">
                  Temaer for dette faget kommer snart.
                </div>
              )}
              {temaer.map((th) =>
                th.live ? (
                  <Link
                    key={th.name}
                    href="/tema"
                    className="flex items-center justify-between bg-white border border-border rounded-xl px-5 py-4 hover:border-primary transition-colors"
                  >
                    <span className="text-sm font-medium">{th.name}</span>
                    <span className="flex items-center gap-3.5">
                      <span className="text-xs text-muted">
                        {th.progress}% fullført
                      </span>
                      <ChevronRight />
                    </span>
                  </Link>
                ) : (
                  <div
                    key={th.name}
                    className="flex items-center justify-between bg-white/60 border border-border rounded-xl px-5 py-4 opacity-60"
                  >
                    <span className="text-sm font-medium">{th.name}</span>
                    <span className="text-xs font-semibold text-muted">
                      Kommer snart
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
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

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#63606E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
