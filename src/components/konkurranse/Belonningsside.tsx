"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AppBar } from "@/components/AppBar";
import { Bunnlenker } from "@/components/Bunnlenker";
import { Demomerke } from "@/components/konkurranse/Demomerke";
import { Navnemerke } from "@/components/konkurranse/Navnemerke";
import { Check, Flamme, Gave, Lock, Stjerne } from "@/components/icons";
import { Feil, Laster } from "@/components/Tilstand";
import { betalingsfeiltekst, losInnGratisTid } from "@/lib/betaling";
import { konfetti } from "@/lib/feiring";
import {
  hentBelonninger,
  hentMineKuponger,
  hentMineVennekoder,
  hentPoengstatus,
  losInn,
  vennelenke,
  type Belonning,
} from "@/lib/konkurranse";
import { hentMineTing, tingtype, useUtseende, velgTing, type MineTing } from "@/lib/utseende";
import { useHent } from "@/lib/useHent";

// Innholdet på /belonninger (siden sjekker innloggingen). Poeng løses inn i:
//   Fra Studer:   gratis tid (trekkes fra neste betaling) og koder til venner
//   Til appen:    flammefarger, konfetti og merker ved navnet – kan prøves først
//   Fra partnere: koder fra ekte partnere (se nederst i migrasjonen); finnes
//                 ingen, står det at de kommer snart.

const tall = (n: number) => n.toLocaleString("nb-NO");
const IKKE_PA = "Innløsning er ikke slått på ennå. Dette er bare et eksempel.";

export function Belonningsside({ brukerId }: { brukerId: string }) {
  const id = brukerId;
  // Øker etter innløsning, så saldo, lager, ting og koder hentes på nytt.
  const [runde, setRunde] = useState(0);
  const status = useHent(id && `poeng:${id}:${runde}`, hentPoengstatus);
  const belonninger = useHent(id && `belonninger:${id}:${runde}`, hentBelonninger);
  const kuponger = useHent(id && `kuponger:${id}:${runde}`, hentMineKuponger);
  const vennekoder = useHent(id && `vennekoder:${id}:${runde}`, hentMineVennekoder);
  const ting = useHent(id && `ting:${id}:${runde}`, () => hentMineTing(id));

  if (belonninger.feil) return <Ramme><Feil tekst="Fikk ikke hentet belønningene. Sjekk nettet og prøv igjen." href="/konkurranse" lenketekst="Tilbake" /></Ramme>;

  const saldo = status.data?.data.saldo ?? 0;
  const demo = !!belonninger.data?.demo;
  const liste = belonninger.data?.data ?? [];
  const fraStuder = liste.filter((b) => b.type === "kreditt" || b.type === "venn");
  const tilAppen = liste.filter((b) => b.type === "ting");
  const partnere = liste.filter((b) => b.type === "kode");
  const kort = (b: Belonning) => (
    <Kort key={b.id} b={b} saldo={saldo} demo={demo} brukerId={id} ting={ting.data} onInnlost={() => setRunde((r) => r + 1)} />
  );

  return (
    <Ramme>
      <main id="innhold" className="flex-1">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-16 flex flex-col gap-14">
          <div className="flex flex-wrap items-end justify-between gap-6 rise">
            <div className="flex flex-col gap-2">
              <h1 className="font-display text-5xl sm:text-6xl font-semibold tracking-[-0.03em]">Belønninger</h1>
              <p className="text-lg text-ink-soft max-w-[48ch]">Bytt poengene dine i gratis tid, ting i appen og tilbud fra partnere.</p>
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
          ) : (
            <>
              {!!fraStuder.length && (
                <Seksjon tittel="Fra Studer" tekst="Gratis tid trekkes fra neste betaling av abonnementet ditt.">
                  {fraStuder.map(kort)}
                </Seksjon>
              )}
              {!!tilAppen.length && (
                <Seksjon tittel="Til appen" tekst="Gjør Studer til ditt eget. Prøv før du kjøper, og bytt når du vil.">
                  {tilAppen.map(kort)}
                </Seksjon>
              )}
              <Seksjon tittel="Fra partnere" tekst="Tilbud fra bedrifter vi samarbeider med.">
                {partnere.length ? (
                  partnere.map(kort)
                ) : (
                  <li className="sm:col-span-2 rounded-3xl border border-dashed border-border-strong px-6 py-10 flex flex-col items-center text-center gap-3">
                    <Gave size={28} className="text-muted" />
                    <h3 className="font-display text-2xl font-semibold">Partnertilbudene kommer snart</h3>
                    <p className="text-ink-soft max-w-[46ch]">
                      Vi jobber med de første samarbeidspartnerne. Poengene du tjener nå, kan du bruke når de er klare.
                    </p>
                  </li>
                )}
              </Seksjon>
            </>
          )}

          {!!vennekoder.data?.length && (
            <section aria-labelledby="venner-tittel" className="flex flex-col gap-4">
              <h2 id="venner-tittel" className="text-3xl font-semibold tracking-[-0.02em]">Kodene til venner</h2>
              <ul className="border-t border-border-strong">
                {vennekoder.data.map((v) => (
                  <li key={v.kode} className="border-b border-border py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="flex flex-col">
                      <span className="font-semibold">{v.dager} dager gratis til en venn</span>
                      <span className={`text-sm ${v.brukt ? "text-success-ink" : "text-muted"}`}>
                        {v.brukt ? "Brukt – takk for at du delte!" : "Ikke brukt ennå"}
                      </span>
                    </span>
                    {!v.brukt && <Kode kode={v.kode} lenke={null} deling />}
                  </li>
                ))}
              </ul>
            </section>
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
            Kontoen må være minst en uke gammel før du kan løse inn. Gratis tid kan løses inn én gang i måneden, og
            partnertilbud én gang per person. Poengene har ingen pengeverdi og kan ikke veksles inn i penger. Se{" "}
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

function Seksjon({ tittel, tekst, children }: { tittel: string; tekst: string; children: React.ReactNode }) {
  const id = `seksjon-${tittel.toLowerCase().replace(/[^a-zæøå]+/g, "-")}`;
  return (
    <section aria-labelledby={id} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 id={id} className="text-3xl font-semibold tracking-[-0.02em]">
          {tittel}
        </h2>
        <p className="text-ink-soft">{tekst}</p>
      </div>
      <ul className="grid sm:grid-cols-2 gap-4">{children}</ul>
    </section>
  );
}

type Resultat =
  | { type: "kode"; kode: string; lenke: string | null }
  | { type: "venn"; kode: string }
  | { type: "kreditt"; belop: string }
  | { type: "ting" };

// Ett kort per belønning: pris, forhåndsvisning for ting, så bekreftelse før
// poengene trekkes. Konfetti når den er løst inn.
function Kort({
  b,
  saldo,
  demo,
  brukerId,
  ting,
  onInnlost,
}: {
  b: Belonning;
  saldo: number;
  demo: boolean;
  brukerId: string;
  ting?: MineTing;
  onInnlost: () => void;
}) {
  const [steg, setSteg] = useState<"start" | "bekreft" | "sender">("start");
  const [feil, setFeil] = useState<string | null>(null);
  const [resultat, setResultat] = useState<Resultat | null>(null);
  const el = useRef<HTMLLIElement>(null);
  const { konfetti: stil } = useUtseende();
  const forLite = saldo < b.poengpris;
  const tomt = b.igjen !== null && b.igjen <= 0;
  const eier = b.type === "ting" && (b.innlostAvMeg || resultat?.type === "ting");

  async function losInnNa() {
    if (demo) {
      setFeil(IKKE_PA);
      setSteg("start");
      return;
    }
    setSteg("sender");
    setFeil(null);
    try {
      if (b.type === "kreditt") {
        const r = await losInnGratisTid(b.id);
        setResultat({ type: "kreditt", belop: r.belop });
      } else {
        const r = await losInn(b.id);
        if (b.type === "kode") setResultat({ type: "kode", kode: r.kode ?? "", lenke: r.lenke });
        else if (b.type === "venn") setResultat({ type: "venn", kode: r.kode ?? "" });
        else setResultat({ type: "ting" });
      }
      setSteg("start");
      konfetti(el.current, "liten", stil);
      onInnlost();
    } catch (e) {
      setFeil(b.type === "kreditt" ? betalingsfeiltekst(e) : (e as Error).message);
      setSteg("start");
    }
  }

  const sporsmal = {
    kreditt: <>Bruke <strong>{tall(b.poengpris)} poeng</strong> på {b.tittel.toLowerCase()}? Prisen trekkes fra neste betaling.</>,
    venn: <>Bruke <strong>{tall(b.poengpris)} poeng</strong> på en kode til en venn?</>,
    ting: <>Bruke <strong>{tall(b.poengpris)} poeng</strong> på {b.tittel.toLowerCase()}?</>,
    kode: <>Bruke <strong>{tall(b.poengpris)} poeng</strong> på dette?</>,
  }[b.type];

  return (
    <li ref={el} className="rounded-3xl bg-surface border border-border p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <span className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted">{b.partner}</span>
          <span className="font-display text-2xl font-semibold leading-tight">{b.tittel}</span>
        </span>
        <span className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-merke px-2.5 py-1 font-semibold tabular-nums text-pa-merke">
          <Stjerne size={14} fylt />
          {tall(b.poengpris)}
        </span>
      </div>
      {b.beskrivelse && <p className="text-[15px] text-ink-soft">{b.beskrivelse}</p>}
      {b.type === "ting" && b.verdi && <Forhandsvisning ting={b.verdi} />}
      {b.vilkar && <p className="text-sm text-muted">{b.vilkar}</p>}

      <div className="mt-auto flex flex-col gap-2">
        {resultat?.type === "kode" ? (
          <Ferdig tekst="Innløst – her er koden din">
            <Kode kode={resultat.kode} lenke={resultat.lenke} />
          </Ferdig>
        ) : resultat?.type === "venn" ? (
          <Ferdig tekst="Her er koden – del den med en venn">
            <Kode kode={resultat.kode} lenke={null} deling />
          </Ferdig>
        ) : resultat?.type === "kreditt" ? (
          <Ferdig tekst={`Ferdig! ${resultat.belop} kr trekkes fra neste betaling.`} />
        ) : eier && b.verdi ? (
          <BrukTing ting={b.verdi} brukerId={brukerId} nyKjopt={resultat?.type === "ting"} start={ting} />
        ) : b.type === "kode" && b.innlostAvMeg ? (
          <span className="text-sm font-semibold text-muted">Du har løst inn denne. Koden står under «Kodene dine».</span>
        ) : b.sperret ? (
          <span className="inline-flex items-start gap-2 text-sm text-muted">
            <Lock size={16} className="shrink-0 mt-0.5" />
            {b.sperret}
          </span>
        ) : steg === "bekreft" || steg === "sender" ? (
          <div className="rise-rask flex flex-col gap-3">
            <p className="text-sm">
              {sporsmal} Du har {tall(saldo)} poeng, og det kan ikke angres.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={losInnNa}
                disabled={steg === "sender"}
                className="trykk trykk-blekk inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
              >
                {steg === "sender" ? "Løser inn …" : "Ja, løs inn"}
              </button>
              <button
                type="button"
                onClick={() => setSteg("start")}
                disabled={steg === "sender"}
                className="trykk rounded-xl border-[1.5px] border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold hover:border-foreground"
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
            className="trykk trykk-blekk w-full rounded-xl bg-foreground text-background px-4 py-3 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {tomt ? "Utsolgt" : forLite ? `Mangler ${tall(b.poengpris - saldo)} poeng` : "Løs inn"}
          </button>
        )}
        {feil && (
          <p role="alert" className="text-sm text-danger-ink">
            {feil}
          </p>
        )}
      </div>
    </li>
  );
}

function Ferdig({ tekst, children }: { tekst: string; children?: React.ReactNode }) {
  return (
    <div role="status" className="rise-rask flex flex-col gap-2">
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-success-ink">
        <Check size={16} /> {tekst}
      </span>
      {children}
    </div>
  );
}

// Slik ser tingen ut: flammen på rekka, merket ved navnet, eller konfetti man
// kan prøve.
function Forhandsvisning({ ting }: { ting: string }) {
  const knapp = useRef<HTMLButtonElement>(null);
  const type = tingtype(ting);
  if (type === "flamme") {
    const farge = ting === "flamme-bla" ? "text-primary" : ting === "flamme-gronn" ? "text-success" : "flamme-regnbue text-danger";
    return (
      <span aria-hidden="true" className="self-start inline-flex items-center gap-1 rounded-full bg-merke pl-1.5 pr-2.5 py-0.5 text-xs font-bold text-pa-merke tabular-nums">
        <Flamme size={14} fylt className={farge} />7 på rad
      </span>
    );
  }
  if (type === "merke") {
    return (
      <span aria-hidden="true" className="self-start inline-flex items-center rounded-xl bg-sunken px-3 py-2 text-sm">
        <span className="font-semibold">Ingrid</span>
        <Navnemerke merke={ting} />
        <span className="text-muted"> · Fjordbyen vgs</span>
      </span>
    );
  }
  return (
    <button
      ref={knapp}
      type="button"
      onClick={() => konfetti(knapp.current, "liten", ting)}
      className="trykk self-start rounded-xl border-[1.5px] border-border-strong bg-surface px-4 py-2 text-sm font-semibold hover:border-foreground"
    >
      Prøv konfettien
    </button>
  );
}

// For ting eleven eier: ta i bruk eller ta av. Valget lagres i profilen og
// vises med en gang (lib/utseende.ts).
function BrukTing({ ting, brukerId, nyKjopt, start }: { ting: string; brukerId: string; nyKjopt: boolean; start?: MineTing }) {
  const valgt = useUtseende();
  const type = tingtype(ting)!;
  const iBruk = valgt[type] === ting || (!valgt[type] && start?.valgt[type] === ting);
  const [jobber, setJobber] = useState(false);
  const [feil, setFeil] = useState<string | null>(null);

  async function veksle() {
    setJobber(true);
    setFeil(null);
    try {
      await velgTing(brukerId, type, iBruk ? null : ting);
    } catch (e) {
      setFeil((e as Error).message);
    } finally {
      setJobber(false);
    }
  }

  return (
    <div className={`flex flex-col gap-2 ${nyKjopt ? "rise-rask" : ""}`}>
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-success-ink">
        <Check size={16} /> {nyKjopt ? "Den er din!" : "Du har denne"}
        {iBruk && <span className="font-medium text-muted">· i bruk</span>}
      </span>
      <button
        type="button"
        onClick={veksle}
        disabled={jobber}
        aria-pressed={iBruk}
        className={`trykk w-full rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-60 ${
          iBruk ? "border-[1.5px] border-border-strong bg-surface hover:border-foreground" : "trykk-blaa bg-primary text-white hover:bg-primary-dark"
        }`}
      >
        {jobber ? "Lagrer …" : iBruk ? "Ta av" : "Ta i bruk"}
      </button>
      {feil && (
        <p role="alert" className="text-sm text-danger-ink">
          {feil}
        </p>
      )}
    </div>
  );
}

// En kode med «Kopier». lenke: partnerens nettside. deling: vennekode – kopier
// eller del lenken vennen kan åpne.
function Kode({ kode, lenke, deling = false }: { kode: string; lenke: string | null; deling?: boolean }) {
  const [kopiert, setKopiert] = useState<"kode" | "lenke" | null>(null);
  const kopier = (tekst: string, hva: "kode" | "lenke") => navigator.clipboard?.writeText(tekst).then(() => setKopiert(hva));
  const del = () => {
    const url = vennelenke(kode);
    if (navigator.share) navigator.share({ title: "En gratis uke på Studer", text: `Bruk koden ${kode} på Studer`, url }).catch(() => {});
    else kopier(url, "lenke");
  };
  const lenkeknapp = "rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-200";
  return (
    <span className="flex flex-wrap items-center gap-2">
      <code className="rounded-lg bg-sunken px-3 py-2 font-mono text-sm font-semibold tracking-wide">{kode}</code>
      <button type="button" onClick={() => kopier(kode, "kode")} className={`${lenkeknapp} text-ink-soft hover:text-foreground hover:bg-sunken`}>
        {kopiert === "kode" ? "Kopiert" : "Kopier"}
      </button>
      {deling && (
        <button type="button" onClick={del} className={`${lenkeknapp} text-primary hover:bg-primary-tint`}>
          {kopiert === "lenke" ? "Lenken er kopiert" : "Del lenke"}
        </button>
      )}
      {lenke && (
        <a href={lenke} target="_blank" rel="noopener noreferrer" className={`${lenkeknapp} text-primary hover:bg-primary-tint`}>
          Bruk koden
        </a>
      )}
    </span>
  );
}
