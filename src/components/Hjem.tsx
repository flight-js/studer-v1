"use client";

import Link from "next/link";
import { useState } from "react";
import { ProfilKnapp } from "@/components/AppBar";
import { Dot } from "@/components/Dot";
import { Logo } from "@/components/Logo";
import { ArrowRight, ChevronRight } from "@/components/icons";
import { useAuth } from "@/lib/auth";
import { hentKatalog, hentSisteTemaer, prosentGjennomgatt, sistOvd, temaHref } from "@/lib/pensum";
import { hentProfil, lagreTrinn } from "@/lib/profil";
import { useHent } from "@/lib/useHent";

// Startsiden for innloggede: fortsett der du slapp, og fagene på trinnet ditt.
export function Hjem() {
  const { bruker } = useAuth();
  const brukerId = bruker?.id ?? "";
  const profil = useHent(`profil:${brukerId}`, hentProfil);
  const katalog = useHent("katalog", hentKatalog);
  const siste = useHent(`siste:${brukerId}`, () => hentSisteTemaer(4));
  const [valgtTrinn, setValgtTrinn] = useState<string | null>(null);
  const [bytterTrinn, setBytterTrinn] = useState(false);

  const trinnId = valgtTrinn ?? profil.data?.trinn ?? null;
  const trinn = katalog.data?.find((t) => t.id === trinnId);
  const navn = (profil.data?.navn || (bruker?.user_metadata?.navn as string | undefined) || "")
    .trim()
    .split(/\s+/)[0];
  const dato = new Date().toLocaleDateString("nb-NO", { weekday: "long", day: "numeric", month: "long" });

  async function velgTrinn(id: string) {
    setValgtTrinn(id);
    setBytterTrinn(false);
    try {
      await lagreTrinn(brukerId, id);
    } catch (e) {
      console.error("Kunne ikke lagre trinnet:", (e as Error).message);
    }
  }

  const visTrinnvalg = !profil.laster && !!katalog.data && (!trinn || bytterTrinn);

  return (
    <div className="flex flex-col flex-1">
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-5 sm:px-8 h-16">
          <Link href="/" aria-label="Studer – hjem" className="rounded-md">
            <Logo className="text-2xl" />
          </Link>
          <nav aria-label="Hovedmeny" className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/fag"
              className="px-3 py-2 rounded-lg text-sm font-medium text-ink-soft hover:text-foreground hover:bg-sunken transition-colors duration-200"
            >
              Alle fag
            </Link>
            <ProfilKnapp />
          </nav>
        </div>
      </header>

      <main id="innhold" className="px-5 sm:px-8 pt-10 sm:pt-14 pb-20 flex flex-col gap-12 max-w-5xl w-full mx-auto">
        <div className="flex flex-col gap-3 rise">
          <p className="text-sm font-medium text-muted first-letter:uppercase">{dato}</p>
          <h1 className="font-display text-4xl sm:text-6xl font-semibold tracking-[-0.025em] leading-[1.02]">
            Hei{navn ? `, ${navn}` : ""}
          </h1>
          <p className="text-lg text-ink-soft">Hva vil du øve på i dag?</p>
        </div>

        <section aria-labelledby="fortsett-label" className="flex flex-col gap-4">
          <h2 id="fortsett-label" className="font-body text-sm font-medium text-muted">
            Fortsett der du slapp
          </h2>
          {siste.laster ? (
            <div className="grid sm:grid-cols-2 gap-3" aria-hidden="true">
              {[0, 1].map((i) => (
                <div key={i} className="h-36 bg-surface/60 border border-border rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : siste.feil ? (
            <p className="text-sm text-muted">Fikk ikke hentet det du har øvd på. Last inn siden på nytt.</p>
          ) : siste.data?.length ? (
            <div className="grid sm:grid-cols-2 gap-3 rise">
              {siste.data.map((t) => {
                const pst = prosentGjennomgatt(t.fremdrift);
                return (
                  <Link
                    key={t.id}
                    href={temaHref("/tema", t.id)}
                    className="group flex flex-col gap-3 rounded-2xl p-5 sm:p-6 bg-surface border border-border hover:border-primary/50 hover:shadow-card transition-[border-color,box-shadow,transform] duration-200 active:scale-[0.99]"
                  >
                    <span className="text-xs font-medium text-muted">
                      {t.trinnNavn}
                      <Dot />
                      {t.fagNavn}
                    </span>
                    <span className="flex items-start justify-between gap-3">
                      <span className="text-lg font-semibold leading-snug hyphens-auto" lang="nb">
                        {t.navn}
                      </span>
                      <ChevronRight
                        size={20}
                        className="shrink-0 mt-1 text-faint transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
                      />
                    </span>
                    <span className="mt-auto flex items-center gap-3">
                      <span className="h-1.5 flex-1 bg-sunken rounded-full overflow-hidden">
                        <span className="block h-full bg-primary rounded-full" style={{ width: `${pst}%` }} />
                      </span>
                      <span className="text-xs font-semibold tabular-nums text-ink-soft">{pst} %</span>
                    </span>
                    <span className="text-xs text-faint">{sistOvd(t.fremdrift)}</span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface border border-dashed border-border-strong rounded-2xl px-6 py-6">
              <span className="flex flex-col gap-1">
                <span className="font-semibold">Du har ikke øvd på noe ennå</span>
                <span className="text-sm text-muted">Velg et fag, så dukker temaene du øver på opp her.</span>
              </span>
              <Link
                href="/fag"
                className="group inline-flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98] shrink-0 w-fit"
              >
                Finn et tema
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          )}
        </section>

        <section aria-labelledby="fag-label" className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 min-h-8">
            <h2 id="fag-label" className="font-body text-sm font-medium text-muted">
              {visTrinnvalg ? "Hvilket trinn går du på?" : trinn ? `Fagene dine på ${trinn.navn}` : "Fagene dine"}
            </h2>
            {trinn && !bytterTrinn && (
              <button
                onClick={() => setBytterTrinn(true)}
                className="px-3 py-1.5 -my-1.5 rounded-lg text-sm font-medium text-ink-soft hover:text-foreground hover:bg-sunken transition-colors duration-200"
              >
                Bytt trinn
              </button>
            )}
          </div>

          {profil.laster || katalog.laster ? (
            <div className="h-40 bg-surface/60 border border-border rounded-2xl animate-pulse" aria-hidden="true" />
          ) : katalog.feil ? (
            <p className="text-danger-ink">Fikk ikke hentet fagene. Sjekk nettet og prøv igjen.</p>
          ) : visTrinnvalg ? (
            <div
              role="radiogroup"
              aria-labelledby="fag-label"
              className="grid grid-cols-3 sm:flex gap-1 p-1 bg-sunken rounded-2xl w-full sm:w-fit rise"
            >
              {katalog.data?.map((t) => (
                <button
                  key={t.id}
                  role="radio"
                  aria-checked={t.id === trinnId}
                  onClick={() => velgTrinn(t.id)}
                  className={`px-3 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-[background-color,color,box-shadow] duration-200 ${
                    t.id === trinnId
                      ? "bg-surface text-foreground shadow-[0_1px_3px_rgba(60,48,30,0.12)]"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {t.navn}
                </button>
              ))}
            </div>
          ) : (
            trinn && (
              <div key={trinn.id} className="grid grid-cols-2 sm:grid-cols-3 gap-3 rise">
                {trinn.fag.map((f) => (
                  <Link
                    key={f.id}
                    href={`/fag?trinn=${trinn.id}&fag=${f.id}`}
                    className="group flex flex-col gap-3 rounded-2xl p-4.5 sm:p-5 bg-surface border border-border hover:border-primary/50 hover:shadow-card transition-[border-color,box-shadow,transform] duration-200 active:scale-[0.99]"
                  >
                    <span className="text-base font-semibold leading-snug hyphens-auto" lang="nb">
                      {f.navn}
                    </span>
                    <span className="text-sm text-muted tabular-nums">
                      {f.antallTemaer ? `${f.antallTemaer} temaer` : "Kommer snart"}
                    </span>
                  </Link>
                ))}
              </div>
            )
          )}
        </section>

        <Link
          href="/fag"
          className="group self-start inline-flex items-center gap-2 text-sm font-semibold text-foreground underline decoration-border-strong decoration-2 underline-offset-[6px] hover:decoration-primary transition-colors duration-200"
        >
          Se alle fag og trinn
          <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </main>
    </div>
  );
}
