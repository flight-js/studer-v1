"use client";

import Link from "next/link";
import { useState } from "react";
import { trinnListe, temaByFag } from "@/lib/data";
import { AppBar } from "@/components/AppBar";
import { Logo } from "@/components/Logo";
import { ChevronRight } from "@/components/icons";

export default function FagvalgPage() {
  const [trinnId, setTrinnId] = useState("vg2");
  const [fagId, setFagId] = useState("kjemi1");

  const trinn = trinnListe.find((t) => t.id === trinnId)!;
  const fag = trinn.fag.find((f) => f.id === fagId) ?? null;
  const temaer = fagId ? temaByFag[fagId] ?? [] : [];

  return (
    <div className="flex flex-col flex-1">
      <AppBar back="/" backLabel={<Logo className="text-xl text-foreground" />} />

      <main
        id="innhold"
        className="px-5 sm:px-8 pt-10 pb-20 flex flex-col gap-10 max-w-5xl w-full mx-auto"
      >
        <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.02em]">
          Hva vil du øve på?
        </h1>

        <section aria-labelledby="trinn-label" className="flex flex-col gap-3.5">
          <h2 id="trinn-label" className="font-body text-sm font-medium text-muted">
            Trinn
          </h2>
          <div
            role="radiogroup"
            aria-labelledby="trinn-label"
            className="grid grid-cols-3 sm:flex gap-1 p-1 bg-sunken rounded-2xl w-full sm:w-fit"
          >
            {trinnListe.map((t) => {
              const active = t.id === trinnId;
              return (
                <button
                  key={t.id}
                  role="radio"
                  aria-checked={active}
                  onClick={() => {
                    setTrinnId(t.id);
                    setFagId(t.fag[0]?.id ?? "");
                  }}
                  className={`px-3 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-[background-color,color,box-shadow] duration-200 ${
                    active
                      ? "bg-surface text-foreground shadow-[0_1px_3px_rgba(60,48,30,0.12)]"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="fag-label" className="flex flex-col gap-3.5">
          <h2 id="fag-label" className="font-body text-sm font-medium text-muted">
            Fag på {trinn.label}
          </h2>
          <div
            key={trinnId}
            role="radiogroup"
            aria-labelledby="fag-label"
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 rise"
          >
            {trinn.fag.map((f) => {
              const active = f.id === fagId;
              const hasContent = (temaByFag[f.id] ?? []).some((t) => t.live);
              return (
                <button
                  key={f.id}
                  role="radio"
                  aria-checked={active}
                  onClick={() => setFagId(f.id)}
                  className={`group flex flex-col gap-3 text-left rounded-2xl p-4.5 sm:p-5 border transition-[border-color,background-color,transform] duration-200 active:scale-[0.99] ${
                    active
                      ? "bg-primary-tint border-primary"
                      : "bg-surface border-border hover:border-border-strong"
                  }`}
                >
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-base font-semibold leading-snug hyphens-manual">{f.name}</span>
                    {hasContent && (
                      <span className="shrink-0 mt-1 w-2 h-2 rounded-full bg-primary" title="Har innhold" />
                    )}
                  </span>
                  <span className={`text-sm tabular-nums ${active ? "text-primary-dark" : "text-muted"}`}>
                    {f.temaCount} temaer
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {fag && (
          <section aria-labelledby="tema-label" className="flex flex-col gap-3.5">
            <h2 id="tema-label" className="font-body text-sm font-medium text-muted">
              Temaer i {fag.name}
            </h2>
            <div key={fagId} className="flex flex-col rise">
              {temaer.length === 0 && (
                <div className="flex flex-col gap-1 bg-surface border border-dashed border-border-strong rounded-2xl px-6 py-8 text-center">
                  <span className="font-semibold">Temaene for {fag.name} er under arbeid</span>
                  <span className="text-sm text-muted">
                    Prøv Kjemi 1 på Vg2 – der er det første temaet klart.
                  </span>
                </div>
              )}
              {temaer.length > 0 && (
                <ul className="bg-surface border border-border rounded-2xl divide-y divide-border overflow-hidden">
                  {temaer.map((th) =>
                    th.live ? (
                      <li key={th.name}>
                        <Link
                          href="/tema"
                          className="group flex items-center gap-4 px-5 sm:px-6 py-5 hover:bg-primary-tint/60 transition-colors duration-200"
                        >
                          <span className="flex-1 flex flex-col gap-2">
                            <span className="font-semibold">{th.name}</span>
                            <span className="flex items-center gap-3">
                              <span className="h-1.5 w-28 bg-sunken rounded-full overflow-hidden">
                                <span
                                  className="block h-full bg-primary rounded-full"
                                  style={{ width: `${th.progress}%` }}
                                />
                              </span>
                              <span className="text-xs text-muted tabular-nums">
                                {th.progress} % gjennomgått
                              </span>
                            </span>
                          </span>
                          <ChevronRight
                            size={20}
                            className="text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
                          />
                        </Link>
                      </li>
                    ) : (
                      <li
                        key={th.name}
                        className="flex items-center justify-between px-5 sm:px-6 py-4.5"
                      >
                        <span className="text-faint">{th.name}</span>
                        <span className="text-xs font-medium text-faint">Kommer snart</span>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
