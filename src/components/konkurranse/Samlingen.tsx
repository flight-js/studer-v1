"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Merkeikon, Navnemerker } from "@/components/konkurranse/Navnemerke";
import { flammefarge } from "@/components/Rekke";
import { Check, Fjaer, Flamme, Gave, Plus, Snofnugg, Stjerne } from "@/components/icons";
import { konfetti } from "@/lib/feiring";
import { hentMineMerker, hentPoengstatus, iGar, type Merkefremgang, type Poengstatus } from "@/lib/konkurranse";
import { MERKER, TJENTE, merkenavn } from "@/lib/merker";
import { useHent } from "@/lib/useHent";
import {
  MAKS_MERKER,
  TING,
  TINGTYPER,
  hentMineTing,
  premiumTema,
  provMerker,
  provTing,
  useUtseendeStatus,
  velgMerker,
  velgTing,
  type Tingtype,
} from "@/lib/utseende";

type Enkelttype = Exclude<Tingtype, "merke">;

// «Samlingen din» på kontosiden:
//   - det eleven har kjøpt med poeng og merkene eleven har tjent, gruppert
//     etter type. Hver type er et radiovalg – Standard og det eleven eier – og
//     et trykk tar tingen i bruk med en gang: temaet på hele siden, flammen på
//     rekka, konfettien og merket ved navnet. Typer eleven ikke eier noe av,
//     vises ikke.
//   - rekke-frysene eleven har (brukes av seg selv, kan ikke velges)
//   - alle merkene som kan tjenes, med fremgang (lib/merker.ts)
// Uten migrasjonen vises merkede eksempler som kan prøves, men ikke lagres.

const EKSEMPEL = ["tema-nordlys", "tema-galakse", "flamme-bla", "flamme-regnbue", "konfetti-stjerner", "merke-stjerne"];
const BUTIKK = "/belonninger#seksjon-til-appen";
const navnPa = (ting: string | null) => (ting ? (TING[ting]?.navn ?? merkenavn(ting) ?? ting) : "Standard");
const dato = (iso: string) => new Date(iso).toLocaleDateString("nb-NO", { day: "numeric", month: "short" });

export function Samlingen({ brukerId, fornavn }: { brukerId: string; fornavn: string | null }) {
  const ting = useHent(`mine-ting:${brukerId}`, () => hentMineTing(brukerId));
  const merker = useHent(`mine-merker:${brukerId}`, hentMineMerker);
  const status = useHent(`poeng:${brukerId}:samling`, hentPoengstatus);
  const { valgt, klar } = useUtseendeStatus();
  // Valget som lagres nå, så det vises med en gang (og rulles tilbake ved feil).
  const [venter, setVenter] = useState<{ type: Enkelttype; ting: string | null } | null>(null);
  const [venterMerker, setVenterMerker] = useState<string[] | null>(null);
  const [feil, setFeil] = useState<{ type: Tingtype; tekst: string } | null>(null);
  const [melding, setMelding] = useState("");

  const demo = !!ting.data?.demo;
  const kjopte = demo ? EKSEMPEL : (ting.data?.eier ?? []).filter((t) => TING[t]);
  const tjente = (merker.data?.data ?? []).filter((m) => m.tjent && TJENTE.has(m.merke)).map((m) => m.merke);
  const kjopteAv = (type: Tingtype) => kjopte.filter((e) => TING[e].type === type);
  const mineAv = (type: Tingtype) => [...kjopteAv(type), ...(type === "merke" ? tjente : [])];
  const typer = TINGTYPER.filter((t) => mineAv(t.type).length);
  const lagrer = !!venter || !!venterMerker;

  async function velg(type: Enkelttype, ny: string | null, kilde: HTMLElement | null) {
    if (lagrer) return;
    setFeil(null);
    const navn = navnPa(ny);
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

  // Merkene ved navnet: hele lista lagres på en gang.
  async function velgMerkene(nye: string[]) {
    if (lagrer) return;
    setFeil(null);
    const tekst = nye.length ? `Ved navnet: ${nye.map(navnPa).join(", ")}.` : "Ingen merker ved navnet.";
    if (demo) {
      provMerker(brukerId, nye);
      setMelding(tekst);
      return;
    }
    setVenterMerker(nye);
    try {
      await velgMerker(brukerId, nye);
      setMelding(tekst);
    } catch (e) {
      setFeil({ type: "merke", tekst: (e as Error).message });
    } finally {
      setVenterMerker(null);
    }
  }

  return (
    <section id="samling" aria-labelledby="samling-tittel" className="scroll-mt-24 border-t border-border pt-8 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 id="samling-tittel" className="font-display text-xl font-semibold">
          Samlingen din
        </h2>
        <p className="text-sm text-ink-soft leading-relaxed max-w-[56ch]">
          Det du har kjøpt med poeng, og merkene du har tjent. Trykk på det du vil bruke – du kan bytte så ofte du vil.
        </p>
      </div>

      {ting.laster || merker.laster || !klar ? (
        <span className="h-48 rounded-2xl bg-sunken animate-pulse" aria-hidden="true" />
      ) : ting.feil ? (
        <p className="text-sm text-danger-ink">Fikk ikke hentet samlingen din. Last siden på nytt for å prøve igjen.</p>
      ) : (
        <>
          {demo && (
            <p role="note" className="rounded-xl border border-dashed border-border-strong bg-sunken px-4 py-3 text-sm text-ink-soft">
              <span className="font-semibold text-foreground">Eksempel.</span> Belønningene er ikke slått på ennå, så dette er
              ting og merker du kunne hatt. Du kan prøve dem, men valget lagres ikke og er borte når du laster siden på nytt.
            </p>
          )}
          {typer.length ? (
            typer.map((t) => {
              const mine = mineAv(t.type);
              const flere = Object.values(TING).filter((v) => v.type === t.type).length - kjopteAv(t.type).length;
              const tFeil = feil?.type === t.type ? feil.tekst : null;
              if (t.type === "merke") {
                return (
                  <Merkegruppe
                    key={t.type}
                    navn={t.navn}
                    valg={mine}
                    valgte={(venterMerker ?? valgt.merker).filter((m) => mine.includes(m))}
                    flere={flere}
                    fornavn={fornavn}
                    lagrer={lagrer}
                    feil={tFeil}
                    onEndre={velgMerkene}
                  />
                );
              }
              const type = t.type;
              const valgtNa = venter?.type === type ? venter.ting : valgt[type];
              return (
                <Gruppe
                  key={type}
                  type={type}
                  navn={t.navn}
                  tekst={t.tekst}
                  valg={[null, ...mine]}
                  valgt={valgtNa && mine.includes(valgtNa) ? valgtNa : null}
                  flere={flere}
                  fornavn={fornavn}
                  lagrer={lagrer}
                  feil={tFeil}
                  onVelg={(ny, kilde) => velg(type, ny, kilde)}
                />
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-border-strong px-5 py-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <Gave size={26} className="shrink-0 text-muted" />
              <p className="flex-1 text-sm text-ink-soft">
                <span className="block font-semibold text-foreground">Du har ikke kjøpt noe ennå</span>
                Bytt poengene dine i temaer for hele Studer, flammefarger, konfetti og merker ved navnet.
              </p>
              <Link
                href={BUTIKK}
                className="trykk trykk-blekk self-start sm:self-auto rounded-xl bg-foreground text-background px-4 py-2.5 text-sm font-semibold"
              >
                Se belønningene
              </Link>
            </div>
          )}
          {status.data && <Rekkefrys s={status.data.data} />}
          {merker.data ? (
            <Tjentemerker liste={merker.data.data} />
          ) : (
            <p className="text-sm text-danger-ink">Fikk ikke hentet merkene dine.</p>
          )}
          <p aria-live="polite" className="sr-only">
            {melding}
          </p>
        </>
      )}
    </section>
  );
}

// Rekke-frysene eleven har: brukes av seg selv en dag eleven ikke øver, så de
// kan ikke velges – bare vises, med lenke for å kjøpe flere.
function Rekkefrys({ s }: { s: Poengstatus }) {
  const reddet = s.frossetDag === iGar();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold">Rekke-frys</h3>
        <p className="text-sm text-muted">
          Glemmer du å øve en dag, brukes en frys av seg selv, så dagene på rad ikke ryker.
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-3 flex flex-wrap items-center gap-x-4 gap-y-3">
        <span className="flex gap-2" aria-hidden="true">
          {Array.from({ length: s.frysMaks }, (_, i) => (
            <span
              key={i}
              className={`size-11 rounded-xl inline-flex items-center justify-center ${
                i < s.frys ? "bg-primary-tint text-primary" : "border-[1.5px] border-dashed border-border-strong text-faint"
              }`}
            >
              <Snofnugg size={20} />
            </span>
          ))}
        </span>
        <span className="flex-1 min-w-48 flex flex-col">
          <span className="font-semibold">{s.frys ? `${s.frys} av ${s.frysMaks}` : "Ingen rekke-frys"}</span>
          <span className="text-sm text-muted">
            {reddet ? "En frys reddet rekka di i går." : s.frys ? "Klar til bruk." : "Du kan ha to om gangen."}
          </span>
        </span>
        {s.frys < s.frysMaks && (
          <Link
            href={BUTIKK}
            className="trykk rounded-xl border-[1.5px] border-border-strong bg-surface px-4 py-2 text-sm font-semibold hover:border-foreground"
          >
            {s.frys ? "Kjøp en til" : "Kjøp rekke-frys"}
          </Link>
        )}
      </div>
    </div>
  );
}

// Alle merkene som kan tjenes: de eleven har i blått med datoen, de andre med
// hva som skal til og hvor langt eleven er kommet.
function Tjentemerker({ liste }: { liste: Merkefremgang[] }) {
  const etter = new Map(liste.map((m) => [m.merke, m]));
  const antall = MERKER.filter((m) => etter.get(m.id)?.tjent).length;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold">Merker du tjener</h3>
        <p className="text-sm text-muted">
          Kan ikke kjøpes – bare øves fram. Du har {antall} av {MERKER.length}, og dem du har kan vises ved navnet.
        </p>
      </div>
      <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {MERKER.map((m) => {
          const f = etter.get(m.id);
          const tjent = f?.tjent ?? null;
          return (
            <li
              key={m.id}
              className={`rounded-2xl border-[1.5px] p-3 flex flex-col items-center text-center gap-2 ${
                tjent ? "border-border bg-surface" : "border-dashed border-border-strong"
              }`}
            >
              <span
                aria-hidden="true"
                className={`size-12 rounded-full inline-flex items-center justify-center ${
                  tjent ? "bg-primary text-white shadow-[0_8px_18px_-8px_var(--primary)]" : "bg-sunken text-faint"
                } ${f?.ny ? "ikon-pop" : ""}`}
              >
                <Merkeikon merke={m.id} size={22} />
              </span>
              <span className="text-sm font-semibold leading-tight">{m.navn}</span>
              {tjent ? (
                <span className="text-xs text-muted">{f?.ny ? "Nytt!" : `Tjent ${dato(tjent)}`}</span>
              ) : (
                <>
                  <span className="sr-only">Ikke tjent ennå.</span>
                  <span className="text-xs text-muted">{m.krav}</span>
                  {f && f.mal > 1 && (
                    <span className="mt-auto w-full flex flex-col gap-1">
                      <span aria-hidden="true" className="h-1.5 rounded-full bg-sunken overflow-hidden">
                        <span
                          className="block h-full rounded-full bg-primary"
                          style={{ width: `${Math.min(100, (f.verdi / f.mal) * 100)}%` }}
                        />
                      </span>
                      <span className="text-xs text-muted tabular-nums">
                        {f.verdi.toLocaleString("nb-NO")} av {f.mal.toLocaleString("nb-NO")} {m.enhet}
                      </span>
                    </span>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
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
  type: Enkelttype;
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
          const tingnavn = navnPa(ting);
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

// Merkene ved navnet: flervalg med opptil tre. Nummeret i hjørnet er
// rekkefølgen ved navnet; øverst står hvordan navnet ser ut nå. Når tre er
// valgt, er resten låst til eleven tar bort ett.
function Merkegruppe({
  navn,
  valg,
  valgte,
  flere,
  fornavn,
  lagrer,
  feil,
  onEndre,
}: {
  navn: string;
  valg: string[];
  valgte: string[];
  flere: number;
  fornavn: string | null;
  lagrer: boolean;
  feil: string | null;
  onEndre: (merker: string[]) => void;
}) {
  const id = useId();
  const fullt = valgte.length >= MAKS_MERKER;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="flex flex-col">
          <h3 id={`${id}-navn`} className="text-sm font-semibold">
            {navn}
          </h3>
          <p id={`${id}-tekst`} className="text-sm text-muted max-w-[44ch]">
            Velg opptil tre. De vises ved navnet ditt på rangeringene, i den rekkefølgen du velger dem.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 text-sm">
          <span className="text-muted">Nå:</span>
          <span className="inline-flex items-center rounded-full bg-sunken px-3 py-1.5 font-semibold">
            {fornavn ?? "Navnet ditt"}
            <Navnemerker merker={valgte} />
          </span>
        </span>
      </div>
      <div
        role="group"
        aria-labelledby={`${id}-navn`}
        aria-describedby={`${id}-tekst ${id}-status`}
        aria-busy={lagrer}
        className="grid gap-3 grid-cols-2 sm:grid-cols-4"
      >
        {valg.map((ting) => {
          const nr = valgte.indexOf(ting) + 1;
          const pa = nr > 0;
          const last = !pa && fullt;
          return (
            <label
              key={ting}
              className={`relative flex flex-col gap-2 rounded-2xl border-[1.5px] bg-surface p-2 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${
                last
                  ? "border-border opacity-50 cursor-not-allowed"
                  : pa
                    ? "trykk trykk-blaa border-primary cursor-pointer"
                    : "trykk border-border hover:border-border-strong cursor-pointer"
              }`}
            >
              <input
                type="checkbox"
                value={ting}
                aria-label={navnPa(ting)}
                checked={pa}
                disabled={last}
                onChange={() => onEndre(pa ? valgte.filter((m) => m !== ting) : [...valgte, ting])}
                className="sr-only"
              />
              <Bilde type="merke" ting={ting} fornavn={fornavn} />
              <span className="flex items-center justify-between gap-2 px-1 pb-0.5 text-sm font-semibold">
                <span aria-hidden="true">{navnPa(ting)}</span>
                {pa && (
                  <span
                    aria-hidden="true"
                    className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold tabular-nums text-white"
                  >
                    {nr}
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
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <p id={`${id}-status`} className="text-sm text-muted">
          {fullt
            ? "Du har valgt tre. Ta bort ett for å velge et annet."
            : valgte.length
              ? `${valgte.length} av ${MAKS_MERKER} valgt.`
              : "Ingen merker ved navnet nå."}
        </p>
        {valgte.length > 0 && (
          <button
            type="button"
            onClick={() => onEndre([])}
            disabled={lagrer}
            className="text-sm font-semibold text-ink-soft underline decoration-border-strong decoration-2 underline-offset-4 hover:text-foreground hover:decoration-foreground transition-colors disabled:opacity-60"
          >
            Ta av alle
          </button>
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
      <span className="inline-flex max-w-full items-center px-2 text-sm font-semibold">
        <span className="truncate">{fornavn ?? "Navnet ditt"}</span>
        {ting && <Navnemerker merker={[ting]} />}
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
