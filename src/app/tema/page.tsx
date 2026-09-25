"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { Dot } from "@/components/Dot";
import { AppBar } from "@/components/AppBar";
import {
  Book,
  Cards,
  Chat,
  ChevronRight,
  Close,
  Lock,
  Quiz,
  Timer,
} from "@/components/icons";
import { Feil, Laster } from "@/components/Tilstand";
import { useAuth } from "@/lib/auth";
import {
  hentFremdrift,
  hentOmfang,
  hentTema,
  prosentGjennomgatt,
  sistOvd,
  temaHref,
  type Resultat,
} from "@/lib/pensum";
import { useHent } from "@/lib/useHent";
import { useTemaId } from "@/lib/useTemaId";

export default function TemaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col flex-1">
          <AppBar back="/fag" backLabel="Fag" />
          <Laster />
        </div>
      }
    >
      <Tema />
    </Suspense>
  );
}

function Tema() {
  const id = useTemaId();
  const { bruker, laster: authLaster } = useAuth();
  const tema = useHent(id, () => hentTema(id!));
  const brukerNokkel = id && bruker ? `${id}:${bruker.id}` : null;
  const omfang = useHent(brukerNokkel, () => hentOmfang(id!));
  const fremdrift = useHent(brukerNokkel, () => hentFremdrift([id!]));
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    if (!chatOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setChatOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chatOpen]);

  const t = tema.data;
  const tilbake = t ? `/fag?trinn=${t.trinnId}&fag=${t.fagId}` : "/fag";

  if (!id || tema.feil) {
    return (
      <div className="flex flex-col flex-1">
        <AppBar back="/fag" backLabel="Fag" />
        <Feil tittel="Fant ikke temaet" tekst="Lenken kan være feil, eller temaet er flyttet. Velg fag og tema på nytt." />
      </div>
    );
  }

  const f = fremdrift.data?.[id];
  const pst = prosentGjennomgatt(f);
  const o = omfang.data;
  const innlogget = !!bruker;

  return (
    <div className="flex flex-col flex-1">
      <AppBar back={tilbake} backLabel={t ? `${t.trinnNavn} / ${t.fagNavn}` : "Fag"} />

      {!t ? (
        <Laster />
      ) : (
        <main
          id="innhold"
          className="px-5 sm:px-8 pt-10 sm:pt-14 pb-32 flex flex-col gap-12 max-w-5xl w-full mx-auto"
        >
          <div className="grid sm:grid-cols-[1fr_auto] gap-8 items-end rise">
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium text-muted">
                {t.fagNavn}
                <Dot />
                Tema {t.nummer} av {t.antallTemaer}
              </p>
              <h1 className="font-display text-4xl sm:text-6xl font-semibold tracking-[-0.025em] leading-[1.02] hyphens-auto" lang="nb">
                {t.navn}
              </h1>
              <p className="text-lg text-ink-soft leading-relaxed max-w-[52ch]">{t.intro}</p>
            </div>
            {innlogget && fremdrift.data && (
              <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                <ProgressRing value={pst} />
                <div className="flex flex-col sm:items-end">
                  <span className="text-sm font-semibold tabular-nums">{pst} % gjennomgått</span>
                  <span className="text-xs text-muted">{sistOvd(f) ?? "Ikke øvd ennå"}</span>
                </div>
              </div>
            )}
          </div>

          <section aria-labelledby="ov-label" className="flex flex-col gap-4">
            <h2 id="ov-label" className="font-body text-sm font-medium text-muted">
              {innlogget || authLaster ? "Velg hvordan du vil øve" : "Logg inn for å øve på temaet"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ModeCard
                href={temaHref("/flashcards", id)}
                laast={!innlogget}
                title="Flashcards"
                text={o ? <>{o.flashcards} kort<Dot />begreper og definisjoner</> : "Begreper og definisjoner"}
                resultat={f?.flashcards}
                icon={<Cards size={22} />}
                featured
              />
              <ModeCard
                href={temaHref("/quiz", id)}
                laast={!innlogget}
                title="Quiz"
                text={o ? <>{o.quiz} spørsmål<Dot />flervalg med forklaring</> : "Flervalg med forklaring"}
                resultat={f?.quiz}
                icon={<Quiz size={22} />}
              />
              <ModeCard
                href={temaHref("/sammendrag", id)}
                laast={!innlogget}
                title="Sammendrag"
                text={<>Hele temaet kort forklart<Dot />med tankekart</>}
                icon={<Book size={22} />}
              />
              <ModeCard
                href={temaHref("/miniprove", id)}
                laast={!innlogget}
                title="Miniprøve"
                text={o ? <>{o.miniprove} spørsmål<Dot />{o.minutter} minutter</> : "Blandet format, på tid"}
                resultat={f?.miniprove}
                icon={<Timer size={22} />}
              />
            </div>
            {t.status !== "godkjent" && (
              <p className="text-sm text-muted">
                Innholdet i dette temaet er nytt og blir kvalitetssikret av lærere.
              </p>
            )}
          </section>
        </main>
      )}

      {/* AI-hjelp */}
      {t && (
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
                Hva lurer du på i {t.navn}? Jeg svarer ut fra pensumet i {t.fagNavn}.
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
      )}
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
        className="transition-[stroke-dasharray] duration-700 ease-out-soft"
      />
    </svg>
  );
}

function ModeCard({
  href,
  laast,
  title,
  text,
  resultat,
  icon,
  featured,
}: {
  href: string;
  laast: boolean;
  title: string;
  text: React.ReactNode;
  resultat?: Resultat;
  icon: React.ReactNode;
  featured?: boolean;
}) {
  const lenke = laast ? `/logg-inn?neste=${encodeURIComponent(href)}` : href;
  return (
    <Link
      href={lenke}
      className="group flex items-center gap-4 rounded-2xl p-5 sm:p-6 border bg-surface border-border hover:border-primary/50 hover:shadow-card transition-[border-color,box-shadow,transform] duration-200 active:scale-[0.99]"
    >
      <span
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
          featured && !laast ? "bg-primary text-white" : "bg-primary-tint text-primary"
        }`}
      >
        {icon}
      </span>
      <span className="flex-1 min-w-0 flex flex-col gap-0.5">
        <span className="text-lg font-semibold">{title}</span>
        <span className="text-sm text-muted">{text}</span>
        {resultat && (
          <span className="text-xs font-semibold text-success-ink tabular-nums mt-1">
            Beste: {resultat.beste} av {resultat.av}
          </span>
        )}
      </span>
      {laast ? (
        <Lock size={18} className="shrink-0 text-faint" />
      ) : (
        <ChevronRight
          size={20}
          className="shrink-0 text-faint transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
        />
      )}
    </Link>
  );
}
