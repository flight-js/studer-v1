"use client";

import Link from "next/link";
import { useState } from "react";
import { AppBar } from "@/components/AppBar";
import { Bunnlenker } from "@/components/Bunnlenker";
import { Demomerke } from "@/components/konkurranse/Demomerke";
import { Check, Gave } from "@/components/icons";
import { Feil, Laster } from "@/components/Tilstand";
import { hentBelonninger, hentMineKuponger, hentPoengstatus, losInn, type Belonning } from "@/lib/konkurranse";
import { useHent } from "@/lib/useHent";

// Innholdet på /belonninger (siden sjekker innloggingen). Poeng løses inn i rabattkoder og tilbud fra partnere. Bare ekte
// avtaler legges inn (se nederst i migrasjonen); finnes ingen, står det at de
// kommer snart.

const tall = (n: number) => n.toLocaleString("nb-NO");

export function Belonningsside({ brukerId }: { brukerId: string }) {
  const id = brukerId;
  // Øker etter innløsning, så saldo, lager og kuponger hentes på nytt.
  const [runde, setRunde] = useState(0);
  const status = useHent(id && `poeng:${id}:${runde}`, hentPoengstatus);
  const belonninger = useHent(id && `belonninger:${id}:${runde}`, hentBelonninger);
  const kuponger = useHent(id && `kuponger:${id}:${runde}`, hentMineKuponger);

  if (belonninger.feil) return <Ramme><Feil tekst="Fikk ikke hentet belønningene. Sjekk nettet og prøv igjen." href="/konkurranse" lenketekst="Tilbake" /></Ramme>;

  const saldo = status.data?.data.saldo ?? 0;
  const demo = !!belonninger.data?.demo;
  const liste = belonninger.data?.data ?? [];

  return (
    <Ramme>
      <main id="innhold" className="flex-1">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-16 flex flex-col gap-12">
          <div className="flex flex-wrap items-end justify-between gap-6 rise">
            <div className="flex flex-col gap-2">
              <h1 className="font-display text-5xl sm:text-6xl font-semibold tracking-[-0.03em]">Belønninger</h1>
              <p className="text-lg text-ink-soft max-w-[48ch]">Bytt poengene dine i rabatter og tilbud fra butikker og tjenester vi samarbeider med.</p>
            </div>
            <div className="flex flex-col items-start sm:items-end">
              <span className="text-sm text-muted">Du har</span>
              <span className="font-display text-4xl font-semibold tabular-nums">
                {status.laster ? "–" : tall(saldo)} <span className="text-lg text-muted">poeng</span>
              </span>
            </div>
          </div>

          {demo && <Demomerke />}

          {belonninger.laster ? (
            <Laster tekst="Henter belønningene" />
          ) : liste.length ? (
            <ul className="grid sm:grid-cols-2 gap-4">
              {liste.map((b) => (
                <Kort key={b.id} b={b} saldo={saldo} demo={demo} onInnlost={() => setRunde((r) => r + 1)} />
              ))}
            </ul>
          ) : (
            <div className="rounded-3xl border border-dashed border-border-strong px-6 py-10 flex flex-col items-center text-center gap-3">
              <Gave size={28} className="text-muted" />
              <h2 className="font-display text-2xl font-semibold">Belønningene kommer snart</h2>
              <p className="text-ink-soft max-w-[46ch]">
                Vi jobber med de første samarbeidspartnerne. Poengene du tjener nå, kan du bruke når de er klare.
              </p>
            </div>
          )}

          {!!kuponger.data?.data.length && (
            <section aria-labelledby="mine-tittel" className="flex flex-col gap-4">
              <h2 id="mine-tittel" className="text-3xl font-semibold tracking-[-0.02em]">Kodene dine</h2>
              <ul className="border-t border-border-strong">
                {kuponger.data.data.map((k) => (
                  <li key={k.kode} className="border-b border-border py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="flex flex-col">
                      <span className="font-semibold">{k.tittel}</span>
                      <span className="text-sm text-muted">
                        {k.partner}
                        {k.gyldigTil && ` · gyldig til ${new Date(k.gyldigTil).toLocaleDateString("nb-NO")}`}
                      </span>
                    </span>
                    <Kode kode={k.kode} lenke={k.lenke} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className="text-sm text-muted max-w-[70ch]">
            En belønning kan løses inn én gang per person, og kontoen må være minst en uke gammel. Poengene har ingen
            pengeverdi. Se{" "}
            <Link href="/vilkar#poeng" className="underline decoration-border-strong underline-offset-4 hover:decoration-foreground">
              vilkårene
            </Link>
            .
          </p>
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
      <AppBar back="/konkurranse" backLabel="Konkurranse" />
      {children}
    </div>
  );
}

// Ett kort per belønning: pris og lager, så bekreftelse før poengene trekkes.
function Kort({ b, saldo, demo, onInnlost }: { b: Belonning; saldo: number; demo: boolean; onInnlost: () => void }) {
  const [steg, setSteg] = useState<"start" | "bekreft" | "sender" | "ferdig">("start");
  const [feil, setFeil] = useState<string | null>(null);
  const [kode, setKode] = useState<{ kode: string; lenke: string | null } | null>(null);
  const forLite = saldo < b.poengpris;
  const tomt = b.igjen <= 0;

  async function losInnNa() {
    setSteg("sender");
    setFeil(null);
    try {
      const r = await losInn(b.id);
      setKode({ kode: r.kode, lenke: r.lenke });
      setSteg("ferdig");
      onInnlost();
    } catch (e) {
      setFeil((e as Error).message);
      setSteg("start");
    }
  }

  return (
    <li className="rounded-3xl bg-surface border border-border p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <span className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted">{b.partner}</span>
          <span className="font-display text-2xl font-semibold leading-tight">{b.tittel}</span>
        </span>
        <span className="shrink-0 rounded-lg bg-merke px-2.5 py-1 font-semibold tabular-nums text-pa-merke">{tall(b.poengpris)}</span>
      </div>
      {b.beskrivelse && <p className="text-[15px] text-ink-soft">{b.beskrivelse}</p>}
      {b.vilkar && <p className="text-sm text-muted">{b.vilkar}</p>}

      <div className="mt-auto flex flex-col gap-2">
        {steg === "ferdig" && kode ? (
          <div className="rise-rask flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-success-ink">
              <Check size={16} /> Innløst – her er koden din
            </span>
            <Kode kode={kode.kode} lenke={kode.lenke} />
          </div>
        ) : b.innlostAvMeg ? (
          <span className="text-sm font-semibold text-muted">Du har løst inn denne. Koden står under «Kodene dine».</span>
        ) : steg === "bekreft" || steg === "sender" ? (
          <div className="rise-rask flex flex-col gap-3">
            <p className="text-sm">
              Bruke <strong>{tall(b.poengpris)} poeng</strong> på dette? Du har {tall(saldo)} poeng, og det kan ikke angres.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={losInnNa}
                disabled={steg === "sender"}
                className="inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-4 py-2.5 text-sm font-semibold transition-[background-color,scale,opacity] duration-200 hover:bg-black active:scale-[0.98] disabled:opacity-60"
              >
                {steg === "sender" ? "Løser inn …" : "Ja, løs inn"}
              </button>
              <button
                type="button"
                onClick={() => setSteg("start")}
                disabled={steg === "sender"}
                className="rounded-xl border-[1.5px] border-border-strong px-4 py-2.5 text-sm font-semibold hover:border-foreground transition-colors duration-200"
              >
                Avbryt
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setSteg("bekreft")}
            disabled={tomt || forLite}
            className="w-full rounded-xl bg-foreground text-background px-4 py-3 text-sm font-semibold transition-[background-color,scale,opacity] duration-200 hover:bg-black active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {tomt ? "Utsolgt" : forLite ? `Mangler ${tall(b.poengpris - saldo)} poeng` : "Løs inn"}
          </button>
        )}
        {feil && (
          <p role="alert" className="text-sm text-danger-ink">
            {feil}
          </p>
        )}
        {demo && steg === "start" && !tomt && !forLite && <p className="text-xs text-muted">Eksempel – ingen ekte kode deles ut.</p>}
      </div>
    </li>
  );
}

function Kode({ kode, lenke }: { kode: string; lenke: string | null }) {
  const [kopiert, setKopiert] = useState(false);
  return (
    <span className="flex flex-wrap items-center gap-2">
      <code className="rounded-lg bg-sunken px-3 py-2 font-mono text-sm font-semibold tracking-wide">{kode}</code>
      <button
        type="button"
        onClick={() => navigator.clipboard?.writeText(kode).then(() => setKopiert(true))}
        className="rounded-lg px-3 py-2 text-sm font-semibold text-ink-soft hover:text-foreground hover:bg-sunken transition-colors duration-200"
      >
        {kopiert ? "Kopiert" : "Kopier"}
      </button>
      {lenke && (
        <a
          href={lenke}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-primary-tint transition-colors duration-200"
        >
          Bruk koden
        </a>
      )}
    </span>
  );
}
