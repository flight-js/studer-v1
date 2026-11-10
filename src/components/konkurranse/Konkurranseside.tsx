"use client";

import Link from "next/link";
import { useState } from "react";
import { AppBar } from "@/components/AppBar";
import { Bunnlenker } from "@/components/Bunnlenker";
import { Navnemerke } from "@/components/konkurranse/Navnemerke";
import { Demomerke } from "@/components/konkurranse/Demomerke";
import { ArrowRight, Gave, Snofnugg } from "@/components/icons";
import { Feil } from "@/components/Tilstand";
import { hentPoengliste, hentPoengstatus, hentSkoleliste, iGar, type Omrade } from "@/lib/konkurranse";
import { useHent } from "@/lib/useHent";

// Innholdet på /konkurranse (siden sjekker innloggingen). Poengene dine, ukas rangering (alle, skolen din, trinnet ditt)
// og skolene. Uka går fra mandag til søndag.

const OMRADER: { id: Omrade; navn: string }[] = [
  { id: "alle", navn: "Alle" },
  { id: "skole", navn: "Skolen din" },
  { id: "trinn", navn: "Trinnet ditt" },
];

const tall = (n: number) => n.toLocaleString("nb-NO");

export function Konkurranseside({ brukerId }: { brukerId: string }) {
  const id = brukerId;
  const [omrade, setOmrade] = useState<Omrade>("alle");
  const status = useHent(id && `poeng:${id}`, hentPoengstatus);
  const liste = useHent(id && `poengliste:${id}:${omrade}`, () => hentPoengliste(omrade));
  const skoler = useHent(id && `skoleliste:${id}`, hentSkoleliste);

  if (status.feil) return <Ramme><Feil tekst="Fikk ikke hentet poengene. Sjekk nettet og prøv igjen." href="/" lenketekst="Til startsiden" /></Ramme>;

  const s = status.data?.data;
  const demo = !!status.data?.demo;
  const meg = liste.data?.data.find((p) => p.erMeg);

  return (
    <Ramme>
      <main id="innhold" className="flex-1">
        {/* Poengene dine */}
        <section aria-labelledby="poeng-tittel" className="fs-natt bg-natt text-background">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-12 pb-14 sm:pt-16 sm:pb-20 flex flex-col gap-8">
            <div className="flex flex-col gap-2 rise">
              <h1 id="poeng-tittel" className="font-body text-sm font-medium text-background/65">
                Poengene dine
              </h1>
              <p className="font-display font-semibold text-7xl sm:text-8xl tracking-[-0.04em] tabular-nums leading-none text-merke">
                {s ? tall(s.saldo) : "–"}
              </p>
            </div>
            {s && (
              <dl className="grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl rise [animation-delay:80ms]">
                <Nokkeltall navn="Denne uka" verdi={tall(s.denneUka)} />
                <div className="flex flex-col gap-2">
                  <dt className="text-xs sm:text-sm text-background/65">Dager på rad</dt>
                  <dd className="font-display text-2xl sm:text-3xl font-semibold tabular-nums">{tall(s.streak)}</dd>
                  {/* Rekke-frys: hvor mange eleven har, og om en reddet rekka i går. */}
                  <Link
                    href={s.frys ? "/konto#samling" : "/belonninger#seksjon-til-appen"}
                    className="w-fit inline-flex items-center gap-1 text-xs text-background/65 underline decoration-background/25 underline-offset-4 hover:text-background hover:decoration-background/60"
                  >
                    <Snofnugg size={13} className="shrink-0" />
                    {s.frossetDag === iGar()
                      ? "Frys reddet rekka i går"
                      : s.frys
                        ? `${s.frys} rekke-frys`
                        : "Ingen rekke-frys"}
                  </Link>
                </div>
                <div className="flex flex-col gap-2">
                  <dt className="text-xs sm:text-sm text-background/65">I dag</dt>
                  <dd className="font-display text-2xl sm:text-3xl font-semibold tabular-nums">
                    {tall(s.iDag)}
                    <span className="text-base text-background/55"> / {s.tak}</span>
                  </dd>
                  <span aria-hidden="true" className="h-1 rounded-full bg-background/15 overflow-hidden">
                    <span className="block h-full bg-merke" style={{ width: `${Math.min(100, (s.iDag / s.tak) * 100)}%` }} />
                  </span>
                  {s.iDag >= s.tak && (
                    <span className="text-xs text-background/65">
                      {s.rekorderIDag < s.rekordtak
                        ? `Taket er nådd. Ny rekord i formelmatch gir fortsatt +15 (${s.rekordtak - s.rekorderIDag} igjen i dag).`
                        : "Taket er nådd, og du har tatt alle rekordpoengene i dag."}
                    </span>
                  )}
                </div>
              </dl>
            )}
            <Link
              href="/belonninger"
              className="group w-fit inline-flex items-center gap-2 rounded-xl bg-merke text-pa-merke px-5 py-3.5 text-sm font-semibold transition-[background-color,scale] duration-200 hover:bg-merke-dark active:scale-[0.98]"
            >
              <Gave size={18} />
              Løs inn poeng
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-16 flex flex-col gap-16">
          {demo && <Demomerke />}

          {/* Ukas rangering */}
          <section aria-labelledby="uka-tittel" className="flex flex-col gap-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h2 id="uka-tittel" className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em]">
                  Denne uka
                </h2>
                <p className="text-sm text-muted">Poeng tjent siden mandag. Lista starter på nytt hver mandag.</p>
              </div>
              <div role="group" aria-label="Hvem du sammenligner deg med" className="flex gap-1 p-1 bg-sunken rounded-2xl">
                {OMRADER.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    aria-pressed={omrade === o.id}
                    onClick={() => setOmrade(o.id)}
                    className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-[background-color,color,box-shadow] duration-200 ${
                      omrade === o.id ? "bg-surface text-foreground shadow-[0_1px_3px_rgba(60,48,30,0.12)]" : "text-muted hover:text-foreground"
                    }`}
                  >
                    {o.navn}
                  </button>
                ))}
              </div>
            </div>

            {liste.laster ? (
              <Skjelett rader={5} />
            ) : liste.feil ? (
              <p className="text-danger-ink">Fikk ikke hentet rangeringen.</p>
            ) : liste.data?.data.length ? (
              <ol className="border-t border-border-strong">
                {liste.data.data.map((p) => (
                  <li
                    key={`${p.plass}-${p.navn}`}
                    className={`grid grid-cols-[3rem_minmax(0,1fr)_auto] items-baseline gap-3 border-b border-border py-4 ${
                      p.erMeg ? "bg-merke/25 -mx-3 px-3 rounded-lg border-transparent" : ""
                    }`}
                  >
                    <span className="font-display text-2xl font-semibold tabular-nums text-muted">{p.plass}</span>
                    <span className="flex flex-col min-w-0">
                      <span className="font-semibold truncate">
                        {p.navn}
                        <Navnemerke merke={p.merke} />
                        {p.erMeg && <span className="sr-only"> (deg)</span>}
                      </span>
                      {p.skole && <span className="text-sm text-muted truncate">{p.skole}</span>}
                    </span>
                    <span className="font-display text-xl font-semibold tabular-nums">{tall(p.poeng)}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-ink-soft">
                {omrade === "skole"
                  ? "Velg skolen din under Konto, så ser du hvordan du ligger an mot de andre på skolen."
                  : omrade === "trinn"
                    ? "Velg trinnet ditt på startsiden for å sammenligne deg med andre på samme trinn."
                    : "Ingen har tjent poeng denne uka ennå. Bli den første!"}
              </p>
            )}

            {meg && !demo && meg.navn === "Deg" && (
              <p className="text-sm text-ink-soft">
                Du ser deg selv i lista, men de andre ser deg ikke, fordi du har skjult fornavnet uten å velge kallenavn.{" "}
                <Link href="/konto#konkurranse" className="font-semibold text-foreground underline decoration-border-strong decoration-2 underline-offset-4 hover:decoration-foreground">
                  Velg et kallenavn
                </Link>
                .
              </p>
            )}
          </section>

          {/* Skolene */}
          <section aria-labelledby="skoler-tittel" className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h2 id="skoler-tittel" className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em]">
                Skolene
              </h2>
              <p className="text-sm text-muted">
                Snitt per elev som har tjent poeng denne uka, så små skoler kan slå de store. Skoler med minst tre elever er med.
              </p>
            </div>
            {skoler.laster ? (
              <Skjelett rader={3} />
            ) : skoler.feil ? (
              <p className="text-danger-ink">Fikk ikke hentet skolene.</p>
            ) : skoler.data?.data.length ? (
              <ol className="border-t border-border-strong">
                {skoler.data.data.map((sk) => (
                  <li
                    key={sk.skoleId}
                    className={`grid grid-cols-[3rem_minmax(0,1fr)_auto] items-baseline gap-3 border-b border-border py-4 ${
                      sk.erMin ? "bg-merke/25 -mx-3 px-3 rounded-lg border-transparent" : ""
                    }`}
                  >
                    <span className="font-display text-2xl font-semibold tabular-nums text-muted">{sk.plass}</span>
                    <span className="flex flex-col min-w-0">
                      <span className="font-semibold truncate">
                        {sk.skole}
                        {sk.erMin && <span className="sr-only"> (skolen din)</span>}
                      </span>
                      <span className="text-sm text-muted truncate">
                        {sk.kommune} · {sk.elever} elever
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="block font-display text-xl font-semibold tabular-nums">{tall(sk.snitt)}</span>
                      <span className="block text-xs text-muted">per elev</span>
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-ink-soft">Ingen skoler har tre elever med poeng denne uka ennå.</p>
            )}
          </section>

          {/* Reglene */}
          <section aria-labelledby="regler-tittel" className="flex flex-col gap-5">
            <h2 id="regler-tittel" className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em]">
              Slik tjener du poeng
            </h2>
            <ul className="grid sm:grid-cols-2 gap-x-10 border-t border-border-strong">
              <Regel navn="Quizrunde" poeng="10–15" forklaring="Flere poeng jo flere du har riktig." />
              <Regel navn="Miniprøve" poeng="15–25" forklaring="Flere poeng jo bedre resultat." />
              <Regel navn="Formelmatch" poeng="10" forklaring="Raskeste tider havner på topplista for temaet." />
              <Regel
                navn="Dagens første øving"
                poeng="5–15"
                forklaring="Ett ekstra poeng for hver dag på rad. En rekke-frys holder rekka hvis du glemmer en dag."
              />
              <Regel navn="Flashcards" poeng="0" forklaring="Gir ikke poeng, fordi du selv svarer om du kan kortet." />
              <Regel navn="Tak per dag" poeng="150" forklaring="Hver øving gir poeng én gang per døgn." />
              <Regel
                navn="Ny rekord i formelmatch"
                poeng="+15"
                forklaring="Slå din egen beste tid i et tema. Teller ikke mot taket – høyst tre om dagen, én per tema."
              />
            </ul>
            <p className="text-sm text-muted max-w-[70ch]">
              Poengene kan løses inn i belønninger. De har ingen pengeverdi, kan ikke kjøpes eller overføres, og juks
              (for eksempel automatiske svar) kan gi tap av poeng. Les mer i{" "}
              <Link href="/vilkar#poeng" className="underline decoration-border-strong underline-offset-4 hover:decoration-foreground">
                vilkårene
              </Link>
              .
            </p>
          </section>
        </div>

        <footer className="max-w-5xl mx-auto px-5 sm:px-8 pb-12">
          <Bunnlenker className="pt-8 border-t border-border" />
        </footer>
      </main>
    </Ramme>
  );
}

export function Ramme({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col flex-1">
      <AppBar back="/" backLabel="Hjem">
        <Link href="/konto#konkurranse" className="hidden sm:inline-flex px-3 py-2 rounded-lg text-sm font-medium text-ink-soft hover:text-foreground hover:bg-sunken transition-colors duration-200">
          Skole og rangering
        </Link>
      </AppBar>
      {children}
    </div>
  );
}

function Nokkeltall({ navn, verdi }: { navn: string; verdi: string }) {
  return (
    <div className="flex flex-col gap-2">
      <dt className="text-xs sm:text-sm text-background/65">{navn}</dt>
      <dd className="font-display text-2xl sm:text-3xl font-semibold tabular-nums">{verdi}</dd>
    </div>
  );
}

function Regel({ navn, poeng, forklaring }: { navn: string; poeng: string; forklaring?: string }) {
  return (
    <li className="flex items-baseline justify-between gap-4 border-b border-border py-4">
      <span className="flex flex-col">
        <span className="font-semibold">{navn}</span>
        {forklaring && <span className="text-sm text-muted">{forklaring}</span>}
      </span>
      <span className="shrink-0 font-display text-xl font-semibold tabular-nums">{poeng}</span>
    </li>
  );
}

function Skjelett({ rader }: { rader: number }) {
  return (
    <div className="border-t border-border-strong" aria-hidden="true">
      {Array.from({ length: rader }, (_, i) => (
        <div key={i} className="border-b border-border py-5">
          <span className="block h-5 w-1/2 rounded bg-sunken animate-pulse" />
        </div>
      ))}
    </div>
  );
}
