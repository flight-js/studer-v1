"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AppBar } from "@/components/AppBar";
import { Logo } from "@/components/Logo";
import { ChevronRight } from "@/components/icons";
import { Feil, Laster } from "@/components/Tilstand";
import { useAuth } from "@/lib/auth";
import {
  hentFremdrift,
  hentKatalog,
  hentTemaer,
  prosentGjennomgatt,
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

function Fagvalg() {
  const router = useRouter();
  const params = useSearchParams();
  const { bruker } = useAuth();
  const katalog = useHent("katalog", hentKatalog);

  const alleTrinn = katalog.data ?? [];
  const trinn = alleTrinn.find((t) => t.id === (params.get("trinn") ?? "vg2")) ?? alleTrinn[0];
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

  if (katalog.feil) return <Feil tekst="Fikk ikke hentet fagene. Sjekk nettet og prøv igjen." href="/" lenketekst="Til forsiden" />;
  if (!trinn) return <Laster tekst="Henter fag" />;

  return (
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
          {alleTrinn.map((t) => {
            const active = t.id === trinn.id;
            return (
              <button
                key={t.id}
                role="radio"
                aria-checked={active}
                onClick={() => velg(t.id)}
                className={`px-3 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-[background-color,color,box-shadow] duration-200 ${
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
                onClick={() => velg(trinn.id, f.id)}
                className={`group flex flex-col gap-3 text-left rounded-2xl p-4.5 sm:p-5 border transition-[border-color,background-color,transform] duration-200 active:scale-[0.99] ${
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

      {fag && (
        <section aria-labelledby="tema-label" className="flex flex-col gap-3.5">
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
                  return (
                    <li key={t.id}>
                      <Link
                        href={temaHref("/tema", t.id)}
                        className="group flex items-center gap-4 px-5 sm:px-6 py-4.5 hover:bg-primary-tint/60 transition-colors duration-200"
                      >
                        <span className="w-6 shrink-0 text-sm font-semibold text-faint tabular-nums">
                          {i + 1}
                        </span>
                        <span className="flex-1 min-w-0 flex flex-col gap-1.5">
                          <span className="font-semibold">{t.navn}</span>
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
    </main>
  );
}
