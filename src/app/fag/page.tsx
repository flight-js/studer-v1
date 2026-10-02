"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { AppBar } from "@/components/AppBar";
import { Logo } from "@/components/Logo";
import { ArrowUp, ChevronRight, Repeat } from "@/components/icons";
import { Abonnementskort } from "@/components/Las";
import { Feil, KreverInnlogging, Laster } from "@/components/Tilstand";
import { useAuth } from "@/lib/auth";
import {
  hentFremdrift,
  hentKatalog,
  hentTemaer,
  prosentGjennomgatt,
  REPETISJON,
  temaHref,
} from "@/lib/pensum";
import { useHent } from "@/lib/useHent";

export default function FagvalgPage() {
  return (
    <div className="flex flex-col flex-1">
      <AppBar back="/" backLabel={<Logo className="text-xl text-foreground" />} />
      <Suspense fallback={<Laster />}>
        <Fagvalg />
      </Suspense>
    </div>
  );
}

function blaInn(el: HTMLElement | null) {
  el?.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start",
  });
}

function Fagvalg() {
  const router = useRouter();
  const params = useSearchParams();
  const { bruker, laster } = useAuth();
  // Antall temaer er bare synlig for innloggede, så katalogen hentes per bruker.
  const katalog = useHent(bruker ? `katalog:${bruker.id}` : null, hentKatalog);

  const alleTrinn = katalog.data ?? [];
  // Uten trinn i adressen er ingenting valgt – eleven velger selv.
  const trinn = alleTrinn.find((t) => t.id === params.get("trinn"));
  const fag =
    trinn?.fag.find((f) => f.id === params.get("fag")) ??
    trinn?.fag.find((f) => f.antallTemaer > 0) ??
    trinn?.fag[0];

  const temaer = useHent(fag ? `temaer:${fag.id}` : null, () => hentTemaer(fag!.id));
  const temaIder = temaer.data?.map((t) => t.id) ?? [];
  const fremdrift = useHent(
    bruker && temaer.data ? `fremdrift:${fag!.id}:${bruker.id}` : null,
    () => hentFremdrift(temaIder)
  );

  const velg = (trinnId: string, fagId?: string) =>
    router.replace(`/fag?trinn=${trinnId}${fagId ? `&fag=${fagId}` : ""}`, { scroll: false });

  // Når eleven velger et fag, blar siden ned til temaene. Det gjelder også når
  // man kommer hit med et fag i adressen (fra startsiden eller tilbake fra et tema).
  const temaSeksjon = useRef<HTMLElement>(null);
  const blaTil = useRef<string | null>(params.get("fag"));

  useEffect(() => {
    if (!fag || fag.id !== blaTil.current) return;
    blaTil.current = null;
    blaInn(temaSeksjon.current);
  }, [fag]);

  const velgFag = (trinnId: string, fagId: string) => {
    if (fagId === fag?.id) return blaInn(temaSeksjon.current);
    blaTil.current = fagId;
    velg(trinnId, fagId);
  };

  if (!laster && !bruker) {
    return (
      <KreverInnlogging
        tittel="Logg inn for å se fagene"
        tekst="Du trenger en konto for å se fag, temaer og øvinger. Det er gratis å lage konto."
      />
    );
  }
  if (katalog.feil) return <Feil tekst="Fikk ikke hentet fagene. Sjekk nettet og prøv igjen." href="/" lenketekst="Til forsiden" />;
  if (!katalog.data) return <Laster tekst="Henter fag" />;

  return (
    <main
      id="innhold"
      className="px-5 sm:px-8 pt-10 pb-20 flex flex-col gap-10 max-w-5xl w-full mx-auto"
    >
      <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.02em]">
        Hva vil du øve på?
      </h1>

      <Abonnementskort neste={trinn ? `/fag?trinn=${trinn.id}${fag ? `&fag=${fag.id}` : ""}` : "/fag"} />

      <section aria-labelledby="trinn-label" className="flex flex-col gap-3.5">
        <h2 id="trinn-label" className="font-body text-sm font-medium text-muted">
          Trinn
        </h2>
        <div
          role="radiogroup"
          aria-labelledby="trinn-label"
          className="grid grid-cols-4 sm:flex gap-1 p-1 bg-sunken rounded-2xl w-full sm:w-fit"
        >
          {alleTrinn.map((t) => {
            const active = t.id === trinn?.id;
            return (
              <button
                key={t.id}
                role="radio"
                aria-checked={active}
                onClick={() => velg(t.id)}
                className={`px-1.5 sm:px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-[background-color,color,box-shadow] duration-200 ${
                  active
                    ? "bg-surface text-foreground shadow-[0_1px_3px_rgba(60,48,30,0.12)]"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {t.navn}
              </button>
            );
          })}
        </div>
      </section>

      {!trinn ? (
        <section
          aria-live="polite"
          className="flex flex-col items-center text-center gap-4 rounded-3xl border border-dashed border-border-strong bg-surface/60 px-6 py-14 sm:py-20 rise"
        >
          <span className="w-11 h-11 rounded-xl bg-primary-tint text-primary flex items-center justify-center" aria-hidden="true">
            <ArrowUp size={22} />
          </span>
          <p className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.02em] leading-tight max-w-[18ch]">
            Velg et trinn for å se fagene
          </p>
          <p className="text-ink-soft max-w-[40ch]">
            Trykk på trinnet du går på, så får du opp alle fagene og temaene der.
          </p>
        </section>
      ) : (
        <>
          <section aria-labelledby="fag-label" className="flex flex-col gap-3.5">
            <h2 id="fag-label" className="font-body text-sm font-medium text-muted">
              Fag på {trinn.navn}
            </h2>
            <div
              key={trinn.id}
              role="radiogroup"
              aria-labelledby="fag-label"
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 rise"
            >
              {trinn.fag.map((f) => {
                const active = f.id === fag?.id;
                return (
                  <button
                    key={f.id}
                    role="radio"
                    aria-checked={active}
                    onClick={() => velgFag(trinn.id, f.id)}
                    className={`group flex flex-col gap-3 text-left rounded-2xl p-4.5 sm:p-5 border transition-[border-color,background-color,translate,scale] duration-200 active:scale-[0.99] ${
                      active
                        ? "bg-primary-tint border-primary"
                        : "bg-surface border-border hover:border-border-strong"
                    }`}
                  >
                    <span className="text-base font-semibold leading-snug hyphens-auto" lang="nb">
                      {f.navn}
                    </span>
                    <span
                      className={`text-sm tabular-nums ${
                        active ? "text-primary-dark" : f.antallTemaer ? "text-muted" : "text-faint"
                      }`}
                    >
                      {f.antallTemaer ? `${f.antallTemaer} temaer` : "Kommer snart"}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Minst én skjermhøyde, så siden alltid kan bla temaene helt opp – også
              mens de hentes, og når faget har få temaer. */}
          {fag && (
            <section
              ref={temaSeksjon}
              aria-labelledby="tema-label"
              className="flex flex-col gap-3.5 scroll-mt-24 min-h-[calc(100dvh-6rem)]"
            >
              <h2 id="tema-label" className="font-body text-sm font-medium text-muted">
                Temaer i {fag.navn}
              </h2>
              <div key={fag.id} className="flex flex-col rise">
                {temaer.laster ? (
                  <div className="h-40 bg-surface/60 border border-border rounded-2xl animate-pulse" />
                ) : temaer.feil ? (
                  <p className="text-danger-ink">Fikk ikke hentet temaene. Prøv igjen.</p>
                ) : !temaer.data?.length ? (
                  <div className="flex flex-col gap-1 bg-surface border border-dashed border-border-strong rounded-2xl px-6 py-8 text-center">
                    <span className="font-semibold">Temaene i {fag.navn} er under arbeid</span>
                    <span className="text-sm text-muted">De kommer hit så snart de er klare.</span>
                  </div>
                ) : (
                  <ol className="bg-surface border border-border rounded-2xl divide-y divide-border overflow-hidden">
                    {temaer.data.map((t, i) => {
                      const pst = prosentGjennomgatt(fremdrift.data?.[t.id]);
                      const repetisjon = t.slug === REPETISJON;
                      return (
                        <li key={t.id}>
                          <Link
                            href={temaHref("/tema", t.id)}
                            className={`group flex items-center gap-4 px-5 sm:px-6 py-4.5 hover:bg-primary-tint/60 transition-colors duration-200 ${
                              repetisjon ? "bg-primary-tint/35" : ""
                            }`}
                          >
                            <span className="w-6 shrink-0 text-sm font-semibold text-faint tabular-nums">
                              {repetisjon ? <Repeat size={18} className="text-primary" /> : i + 1}
                            </span>
                            <span className="flex-1 min-w-0 flex flex-col gap-1.5">
                              <span className="font-semibold">{t.navn}</span>
                              {repetisjon && (
                                <span className="text-sm text-muted">Det viktigste fra alle temaene, før tentamen og eksamen</span>
                              )}
                              {bruker && fremdrift.data && (
                                <span className="flex items-center gap-3">
                                  <span className="h-1.5 w-24 bg-sunken rounded-full overflow-hidden">
                                    <span
                                      className="block h-full bg-primary rounded-full"
                                      style={{ width: `${pst}%` }}
                                    />
                                  </span>
                                  <span className="text-xs text-muted tabular-nums">
                                    {pst ? `${pst} % gjennomgått` : "Ikke startet"}
                                  </span>
                                </span>
                              )}
                            </span>
                            <ChevronRight
                              size={20}
                              className="shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
