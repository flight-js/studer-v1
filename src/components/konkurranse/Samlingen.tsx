"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Navnemerke } from "@/components/konkurranse/Navnemerke";
import { flammefarge } from "@/components/Rekke";
import { Check, Fjaer, Flamme, Gave, Plus, Stjerne } from "@/components/icons";
import { konfetti } from "@/lib/feiring";
import { useHent } from "@/lib/useHent";
import {
  TING,
  TINGTYPER,
  hentMineTing,
  premiumTema,
  provTing,
  useUtseendeStatus,
  velgTing,
  type Tingtype,
} from "@/lib/utseende";

// «Samlingen din» på kontosiden: det eleven har kjøpt med poeng, gruppert etter type. Hver
// type er et radiovalg – Standard og det eleven eier – og et trykk tar tingen i
// bruk med en gang: temaet på hele siden, flammen på rekka, konfettien og
// merket ved navnet. Typer eleven ikke eier noe av, vises ikke. Uten
// migrasjonen vises merkede eksempelting som kan prøves, men ikke lagres.

const EKSEMPEL = ["tema-nordlys", "tema-galakse", "flamme-bla", "flamme-regnbue", "konfetti-stjerner", "merke-stjerne"];
const BUTIKK = "/belonninger#seksjon-til-appen";

export function Samlingen({ brukerId, fornavn }: { brukerId: string; fornavn: string | null }) {
  const ting = useHent(`mine-ting:${brukerId}`, () => hentMineTing(brukerId));
  const { valgt, klar } = useUtseendeStatus();
  // Valget som lagres nå, så det vises med en gang (og rulles tilbake ved feil).
  const [venter, setVenter] = useState<{ type: Tingtype; ting: string | null } | null>(null);
  const [feil, setFeil] = useState<{ type: Tingtype; tekst: string } | null>(null);
  const [melding, setMelding] = useState("");

  const demo = !!ting.data?.demo;
  const eier = demo ? EKSEMPEL : (ting.data?.eier ?? []).filter((t) => TING[t]);
  const typer = TINGTYPER.filter((t) => eier.some((e) => TING[e].type === t.type));

  async function velg(type: Tingtype, ny: string | null, kilde: HTMLElement | null) {
    if (venter) return;
    setFeil(null);
    const navn = ny ? TING[ny].navn : "Standard";
    if (type === "konfetti") konfetti(kilde, "liten", ny);
    if (demo) {
      provTing(brukerId, type, ny);
      setMelding(`${navn} er i bruk.`);
      return;
    }
    setVenter({ type, ting: ny });
    try {
      await velgTing(brukerId, type, ny);
      setMelding(`${navn} er i bruk.`);
    } catch (e) {
      setFeil({ type, tekst: (e as Error).message });
    } finally {
      setVenter(null);
    }
  }

  return (
    <section id="samling" aria-labelledby="samling-tittel" className="scroll-mt-24 border-t border-border pt-8 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 id="samling-tittel" className="font-display text-xl font-semibold">
          Samlingen din
        </h2>
        <p className="text-sm text-ink-soft leading-relaxed max-w-[56ch]">
          Temaer, flammer, konfetti og merker du har kjøpt med poeng. Trykk på det du vil bruke – du kan bytte så
          ofte du vil.
        </p>
      </div>

      {ting.laster || !klar ? (
        <span className="h-48 rounded-2xl bg-sunken animate-pulse" aria-hidden="true" />
      ) : ting.feil ? (
        <p className="text-sm text-danger-ink">Fikk ikke hentet samlingen din. Last siden på nytt for å prøve igjen.</p>
      ) : !typer.length ? (
        <div className="rounded-2xl border border-dashed border-border-strong px-5 py-8 flex flex-col items-center text-center gap-3">
          <Gave size={26} className="text-muted" />
          <p className="font-semibold">Samlingen din er tom</p>
          <p className="text-sm text-ink-soft max-w-[44ch]">
            Bytt poengene dine i temaer for hele Studer, flammefarger, konfetti og merker ved navnet.
          </p>
          <Link
            href={BUTIKK}
            className="trykk trykk-blekk mt-1 rounded-xl bg-foreground text-background px-4 py-2.5 text-sm font-semibold"
          >
            Se belønningene
          </Link>
        </div>
      ) : (
        <>
          {demo && (
            <p role="note" className="rounded-xl border border-dashed border-border-strong bg-sunken px-4 py-3 text-sm text-ink-soft">
              <span className="font-semibold text-foreground">Eksempel.</span> Belønningene er ikke slått på ennå, så dette er
              ting du kunne eid. Du kan prøve dem, men valget lagres ikke og er borte når du laster siden på nytt.
            </p>
          )}
          {typer.map((t) => {
            const mine = eier.filter((e) => TING[e].type === t.type);
            const valgtNa = venter?.type === t.type ? venter.ting : valgt[t.type];
            return (
              <Gruppe
                key={t.type}
                type={t.type}
                navn={t.navn}
                tekst={t.tekst}
                valg={[null, ...mine]}
                valgt={valgtNa && mine.includes(valgtNa) ? valgtNa : null}
                flere={Object.values(TING).filter((v) => v.type === t.type).length - mine.length}
                fornavn={fornavn}
                lagrer={!!venter}
                feil={feil?.type === t.type ? feil.tekst : null}
                onVelg={(ny, kilde) => velg(t.type, ny, kilde)}
              />
            );
          })}
          <p aria-live="polite" className="sr-only">
            {melding}
          </p>
        </>
      )}
    </section>
  );
}

function Gruppe({
  type,
  navn,
  tekst,
  valg,
  valgt,
  flere,
  fornavn,
  lagrer,
  feil,
  onVelg,
}: {
  type: Tingtype;
  navn: string;
  tekst: string;
  valg: (string | null)[];
  valgt: string | null;
  flere: number;
  fornavn: string | null;
  lagrer: boolean;
  feil: string | null;
  onVelg: (ting: string | null, kilde: HTMLElement | null) => void;
}) {
  const id = useId();
  const stor = type === "tema";
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        <h3 id={`${id}-navn`} className="text-sm font-semibold">
          {navn}
        </h3>
        <p id={`${id}-tekst`} className="text-sm text-muted">
          {tekst}
        </p>
      </div>
      <div
        role="radiogroup"
        aria-labelledby={`${id}-navn`}
        aria-describedby={`${id}-tekst`}
        aria-busy={lagrer}
        className={`grid gap-3 ${stor ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-4"}`}
      >
        {valg.map((ting) => {
          const pa = ting === valgt;
          const tingnavn = ting ? TING[ting].navn : "Standard";
          return (
            <label
              key={ting ?? "standard"}
              className={`trykk relative flex flex-col gap-2 rounded-2xl border-[1.5px] bg-surface p-2 cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${
                pa ? "trykk-blaa border-primary" : "border-border hover:border-border-strong"
              }`}
            >
              <input
                type="radio"
                name={`ting-${type}`}
                value={ting ?? "standard"}
                aria-label={tingnavn}
                checked={pa}
                onChange={(e) => onVelg(ting, e.currentTarget.parentElement)}
                className="sr-only"
              />
              <Bilde type={type} ting={ting} fornavn={fornavn} />
              <span className="flex items-center justify-between gap-2 px-1 pb-0.5 text-sm font-semibold">
                <span aria-hidden="true">{tingnavn}</span>
                {pa && (
                  <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <Check size={12} />
                  </span>
                )}
              </span>
            </label>
          );
        })}
        {flere > 0 && (
          <Link
            href={BUTIKK}
            className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border-[1.5px] border-dashed border-border-strong p-3 text-center text-sm font-semibold text-ink-soft transition-colors duration-200 hover:border-foreground hover:text-foreground"
          >
            <Plus size={18} />
            {flere === 1 ? "1 til" : `${flere} til`} i Belønninger
          </Link>
        )}
      </div>
      {feil && (
        <p role="alert" className="text-sm text-danger-ink">
          {feil}
        </p>
      )}
    </div>
  );
}

// Standardfargene (lys og mørk modus fra globals.css), satt direkte på
// forhåndsvisningen så den ikke arver et premium-tema fra siden.
const LYS = {
  "--background": "#f7f4ee",
  "--surface": "#fffdf9",
  "--foreground": "#1b1a2e",
  "--muted": "#6b6760",
  "--border": "#e4ded2",
  "--primary": "#2c4bd4",
  "--natt": "#0f1014",
  "--natt-bilde": "none",
  "--premium-bilde": "none",
} as React.CSSProperties;
const MORK = {
  ...LYS,
  "--background": "#131418",
  "--surface": "#1b1d23",
  "--foreground": "#f3efe7",
  "--muted": "#a39d92",
  "--border": "#2a2c33",
  "--primary": "#5571f3",
} as React.CSSProperties;

// Hvordan tingen ser ut, i det lille feltet øverst i hver rute.
function Bilde({ type, ting, fornavn }: { type: Tingtype; ting: string | null; fornavn: string | null }) {
  if (type === "tema") {
    return (
      <span aria-hidden="true" className="h-20 rounded-xl overflow-hidden flex border border-border">
        {ting ? (
          <span data-premium={premiumTema(ting) ?? undefined} className="flex flex-1">
            <Miniside className="premium-flate" />
          </span>
        ) : (
          <>
            <Miniside stil={LYS} />
            <Miniside stil={MORK} />
          </>
        )}
      </span>
    );
  }
  const flate = "h-16 rounded-xl overflow-hidden flex items-center justify-center bg-sunken";
  if (type === "flamme") {
    return (
      <span aria-hidden="true" className={flate}>
        <span className="inline-flex items-center gap-1 rounded-full bg-merke pl-2 pr-3 py-1 text-sm font-bold text-pa-merke tabular-nums">
          <Flamme size={16} fylt className={flammefarge(ting, true)} />7
        </span>
      </span>
    );
  }
  if (type === "konfetti") {
    const ikon =
      ting === "konfetti-stjerner" ? (
        <Stjerne size={18} fylt />
      ) : ting === "konfetti-fjaer" ? (
        <Fjaer size={18} />
      ) : (
        <span className="block w-2 h-3.5 rotate-12 rounded-[2px] bg-current" />
      );
    return (
      <span aria-hidden="true" className={`${flate} gap-2`}>
        <span className="-translate-y-2 -rotate-12 text-primary">{ikon}</span>
        <span className="translate-y-1.5 text-merke-dark">{ikon}</span>
        <span className="-translate-y-1 rotate-12 text-danger">{ikon}</span>
      </span>
    );
  }
  return (
    <span aria-hidden="true" className={flate}>
      <span className="max-w-full truncate px-2 text-sm font-semibold">
        {fornavn ?? "Navnet ditt"}
        <Navnemerke merke={ting} />
      </span>
    </span>
  );
}

// En liten Studer-side: natt-stripe øverst, en linje tekst og en knapp.
function Miniside({ stil, className = "" }: { stil?: React.CSSProperties; className?: string }) {
  return (
    <span style={stil} className={`flex-1 min-w-0 flex flex-col bg-background ${className}`}>
      <span className="h-5 shrink-0 bg-natt" />
      <span className="flex-1 flex flex-col justify-center gap-1.5 px-2">
        <span className="h-1.5 w-3/4 rounded-full bg-foreground/70" />
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1/3 rounded-full bg-muted/50" />
          <span className="ml-auto h-3.5 w-7 rounded bg-primary" />
        </span>
      </span>
    </span>
  );
}
