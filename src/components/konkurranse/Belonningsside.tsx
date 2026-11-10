"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AppBar } from "@/components/AppBar";
import { Bunnlenker } from "@/components/Bunnlenker";
import { Demomerke } from "@/components/konkurranse/Demomerke";
import { Navnemerker } from "@/components/konkurranse/Navnemerke";
import { Check, Flamme, Gave, Lock, Snofnugg, Stjerne } from "@/components/icons";
import { Feil, Laster } from "@/components/Tilstand";
import { betalingsfeiltekst, losInnGratisTid } from "@/lib/betaling";
import { konfetti } from "@/lib/feiring";
import {
  hentBelonninger,
  hentMineKuponger,
  hentMineVennegaver,
  hentPoengstatus,
  losInn,
  sendVennegave,
  type Belonning,
  type Vennegave,
} from "@/lib/konkurranse";
import {
  MAKS_MERKER,
  erIBruk,
  gjeldendeTema,
  hentMineTing,
  premiumTema,
  tingtype,
  useUtseende,
  useUtseendeStatus,
  velgMerker,
  velgTing,
  type MineTing,
} from "@/lib/utseende";
import { useHent } from "@/lib/useHent";

// Innholdet på /belonninger (siden sjekker innloggingen). Poeng løses inn i:
//   Fra Studer:   gratis tid (neste betaling flyttes frem) og gaver til venner
//                 (eleven skriver vennens e-post, Studer sender e-posten)
//   Til appen:    flammefarger, konfetti, merker ved navnet og premium-temaer – kan prøves først
//   Fra partnere: koder fra ekte partnere (se nederst i migrasjonen); finnes
//                 ingen, står det at de kommer snart.

const tall = (n: number) => n.toLocaleString("nb-NO");
const dato = (iso: string) => new Date(iso).toLocaleDateString("nb-NO", { day: "numeric", month: "long" });
// Gratis tid: verdi er antall dager.
const dagerTekst = (verdi: string | null) => (verdi === "7" ? "en uke" : `${verdi} dager`);
const IKKE_PA = "Innløsning er ikke slått på ennå. Dette er bare et eksempel.";

export function Belonningsside({ brukerId }: { brukerId: string }) {
  const id = brukerId;
  // Øker etter innløsning, så saldo, lager, ting og koder hentes på nytt.
  const [runde, setRunde] = useState(0);
  const status = useHent(id && `poeng:${id}:${runde}`, hentPoengstatus);
  const belonninger = useHent(id && `belonninger:${id}:${runde}`, hentBelonninger);
  const kuponger = useHent(id && `kuponger:${id}:${runde}`, hentMineKuponger);
  const gaver = useHent(id && `vennegaver:${id}:${runde}`, hentMineVennegaver);
  const ting = useHent(id && `ting:${id}:${runde}`, () => hentMineTing(id));

  if (belonninger.feil) return <Ramme><Feil tekst="Fikk ikke hentet belønningene. Sjekk nettet og prøv igjen." href="/konkurranse" lenketekst="Tilbake" /></Ramme>;

  const saldo = status.data?.data.saldo ?? 0;
  const demo = !!belonninger.data?.demo;
  const liste = belonninger.data?.data ?? [];
  const fraStuder = liste.filter((b) => b.type === "kreditt" || b.type === "venn");
  const tilAppen = liste.filter((b) => b.type === "ting" || b.type === "frys");
  const partnere = liste.filter((b) => b.type === "kode");
  const s = status.data?.data;
  const kort = (b: Belonning) => (
    <Kort
      key={b.id}
      b={b}
      saldo={saldo}
      demo={demo}
      brukerId={id}
      ting={ting.data}
      frys={s ? { antall: s.frys, maks: s.frysMaks } : undefined}
      onInnlost={() => setRunde((r) => r + 1)}
    />
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
                <Seksjon tittel="Fra Studer" tekst="Med gratis tid varer abonnementet ditt lenger før neste betaling.">
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

          {!!gaver.data?.length && (
            <section aria-labelledby="gaver-tittel" className="flex flex-col gap-4">
              <h2 id="gaver-tittel" className="text-3xl font-semibold tracking-[-0.02em]">Gaver du har sendt</h2>
              <ul className="border-t border-border-strong">
                {gaver.data.map((g) => (
                  <li key={g.id} className="border-b border-border py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3">
                    <span className="font-semibold break-all">{g.epost}</span>
                    <Gavestatus gave={g} />
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
        {/* scroll-mt: «Samlingen din» på kontosiden lenker hit (#seksjon-til-appen). */}
        <h2 id={id} className="scroll-mt-24 text-3xl font-semibold tracking-[-0.02em]">
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
  | { type: "venn"; epost: string }
  | { type: "kreditt"; til: string }
  | { type: "ting" }
  | { type: "frys" };

function Gavestatus({ gave }: { gave: Vennegave }) {
  if (gave.status === "brukt") return <span className="text-sm text-success-ink">Brukt – vennen din fikk en gratis uke</span>;
  if (gave.status === "utlopt") return <span className="text-sm text-muted">Ikke brukt – du får poengene tilbake</span>;
  return (
    <span className="text-sm text-muted">
      Sendt {dato(gave.laget)} · gjelder til {dato(gave.gyldigTil)}
    </span>
  );
}

// Ett kort per belønning: pris, forhåndsvisning for ting, så bekreftelse før
// poengene trekkes (for gaver til venner: vennens e-post). Konfetti når den er
// løst inn.
function Kort({
  b,
  saldo,
  demo,
  brukerId,
  ting,
  frys,
  onInnlost,
}: {
  b: Belonning;
  saldo: number;
  demo: boolean;
  brukerId: string;
  ting?: MineTing;
  frys?: { antall: number; maks: number };
  onInnlost: () => void;
}) {
  const [steg, setSteg] = useState<"start" | "bekreft" | "sender">("start");
  const [feil, setFeil] = useState<string | null>(null);
  const [resultat, setResultat] = useState<Resultat | null>(null);
  const [epost, setEpost] = useState("");
  const venn = b.type === "venn";
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
        setResultat({ type: "kreditt", til: r.til });
      } else if (b.type === "venn") {
        const r = await sendVennegave(b.id, epost.trim());
        setResultat({ type: "venn", epost: r.epost });
        setEpost("");
      } else {
        const r = await losInn(b.id);
        if (b.type === "kode") setResultat({ type: "kode", kode: r.kode ?? "", lenke: r.lenke });
        else setResultat({ type: b.type === "frys" ? "frys" : "ting" });
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
    kreditt: <>Bruke <strong>{tall(b.poengpris)} poeng</strong> på {b.tittel.toLowerCase()}? Neste betaling kommer {dagerTekst(b.verdi)} senere.</>,
    venn: <>Bruke <strong>{tall(b.poengpris)} poeng</strong> på en gratis uke til en venn?</>,
    ting: <>Bruke <strong>{tall(b.poengpris)} poeng</strong> på {b.tittel.toLowerCase()}?</>,
    frys: <>Bruke <strong>{tall(b.poengpris)} poeng</strong> på en rekke-frys?</>,
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
      {b.type === "frys" && <Frysvisning />}
      {b.vilkar && (
        <p className="text-sm text-muted">
          {b.vilkar}
          {b.type === "frys" && frys && ` Du har ${frys.antall}.`}
        </p>
      )}

      <div className="mt-auto flex flex-col gap-2">
        {resultat?.type === "kode" ? (
          <Ferdig tekst="Innløst – her er koden din">
            <Kode kode={resultat.kode} lenke={resultat.lenke} />
          </Ferdig>
        ) : resultat?.type === "venn" ? (
          <Ferdig tekst={`Gaven er sendt til ${resultat.epost}`}>
            <span className="text-sm text-ink-soft">Vennen får uka når hen starter abonnement med den adressen.</span>
            {!b.sperret && saldo >= b.poengpris && (
              <button
                type="button"
                onClick={() => setResultat(null)}
                className="self-start text-sm font-semibold text-ink-soft underline decoration-border-strong decoration-2 underline-offset-4 hover:text-foreground hover:decoration-foreground transition-colors"
              >
                Send til en venn til
              </button>
            )}
          </Ferdig>
        ) : resultat?.type === "kreditt" ? (
          <Ferdig tekst={`Ferdig! Neste betaling er flyttet til ${dato(resultat.til)}.`} />
        ) : resultat?.type === "frys" ? (
          <Ferdig tekst="Lagt i samlingen din. Den brukes av seg selv hvis du glemmer en dag.">
            {!b.sperret && saldo >= b.poengpris && (
              <button
                type="button"
                onClick={() => setResultat(null)}
                className="self-start text-sm font-semibold text-ink-soft underline decoration-border-strong decoration-2 underline-offset-4 hover:text-foreground hover:decoration-foreground transition-colors"
              >
                Kjøp en til
              </button>
            )}
          </Ferdig>
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              losInnNa();
            }}
            className="rise-rask flex flex-col gap-3"
          >
            {venn && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`epost-${b.id}`} className="text-sm font-semibold">
                  Vennens e-postadresse
                </label>
                <input
                  id={`epost-${b.id}`}
                  type="email"
                  inputMode="email"
                  required
                  autoFocus
                  maxLength={254}
                  autoComplete="off"
                  spellCheck={false}
                  value={epost}
                  onChange={(e) => setEpost(e.target.value)}
                  disabled={steg === "sender"}
                  aria-describedby={`epost-hjelp-${b.id}`}
                  className="rounded-xl border-[1.5px] border-border-strong bg-background px-4 py-3 text-[15px] outline-none transition-colors duration-200 focus:border-primary disabled:opacity-60"
                />
                <span id={`epost-hjelp-${b.id}`} className="text-xs text-muted">
                  Vennen får én e-post fra Studer med fornavnet ditt.
                </span>
              </div>
            )}
            <p className="text-sm">
              {sporsmal} Du har {tall(saldo)} poeng{venn ? "." : ", og det kan ikke angres."}
            </p>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={steg === "sender"}
                className="trykk trykk-blekk inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
              >
                {steg === "sender" ? (venn ? "Sender …" : "Løser inn …") : venn ? "Send gaven" : "Ja, løs inn"}
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
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setSteg("bekreft")}
            disabled={tomt || forLite}
            className="trykk trykk-blekk w-full rounded-xl bg-foreground text-background px-4 py-3 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {tomt ? "Utsolgt" : forLite ? `Mangler ${tall(b.poengpris - saldo)} poeng` : venn ? "Velg en venn" : "Løs inn"}
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

// Slik ser tingen ut: flammen på rekka, merket ved navnet, en liten Studer-side
// med temaet, eller konfetti man kan prøve.
function Forhandsvisning({ ting }: { ting: string }) {
  const knapp = useRef<HTMLButtonElement>(null);
  const type = tingtype(ting);
  if (type === "tema") return <Temaforhandsvisning ting={ting} />;
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
      <span aria-hidden="true" className="self-start inline-flex items-center gap-2 rounded-xl bg-sunken px-3 py-2 text-sm">
        <span className="inline-flex items-center font-semibold">
          Ingrid
          <Navnemerker merker={[ting]} />
        </span>
        <span className="text-muted">·</span>
        <span className="text-muted">Fjordbyen vgs</span>
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

// Rekke-frys: fire dager på rad der den tredje er reddet av en frys.
function Frysvisning() {
  const dager = ["man", "tir", "ons", "tor"];
  return (
    <span aria-hidden="true" className="self-start inline-flex items-end gap-2 rounded-xl bg-sunken px-3 py-2">
      {dager.map((d, i) => (
        <span key={d} className="flex flex-col items-center gap-1 text-xs font-medium text-muted">
          <span
            className={`size-8 rounded-full inline-flex items-center justify-center ${
              i === 2 ? "bg-primary-tint text-primary ring-[1.5px] ring-primary/40" : "bg-merke text-pa-merke"
            }`}
          >
            {i === 2 ? <Snofnugg size={16} /> : <Flamme size={15} fylt />}
          </span>
          {d}
        </span>
      ))}
    </span>
  );
}

// Premium-tema: en liten Studer-side i temaet (samme CSS som appen, med eget
// data-premium) og en knapp som prøver temaet på hele siden – til eleven
// trykker igjen, prøver et annet tema eller går fra siden.
const PROV_TEMA = "studer-prov-tema";

function Temaforhandsvisning({ ting }: { ting: string }) {
  const verdi = premiumTema(ting) ?? "";
  const [prover, setProver] = useState(false);

  useEffect(() => {
    if (!prover) return;
    const html = document.documentElement;
    html.dataset.premium = verdi;
    window.dispatchEvent(new CustomEvent(PROV_TEMA, { detail: verdi }));
    const annet = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== verdi) setProver(false);
    };
    window.addEventListener(PROV_TEMA, annet);
    return () => {
      window.removeEventListener(PROV_TEMA, annet);
      // Tilbake til temaet eleven har valgt – men ikke over et annet tema som prøves nå.
      if (html.dataset.premium !== verdi) return;
      const valgt = premiumTema(gjeldendeTema());
      if (valgt) html.dataset.premium = valgt;
      else delete html.dataset.premium;
    };
  }, [prover, verdi]);

  return (
    <div className="flex flex-col gap-2">
      <div
        aria-hidden="true"
        data-premium={verdi}
        className="premium-flate bg-background text-foreground rounded-2xl border border-border overflow-hidden"
      >
        <div className="bg-natt premium-natt px-4 pt-4 pb-5 flex flex-col gap-2">
          <span className="text-xs font-medium opacity-65">For Vg1 · Kjemi</span>
          <span className="font-display text-xl font-semibold leading-none tracking-[-0.02em]">Hei, Ingrid</span>
          <span className="self-start inline-flex items-center gap-1 rounded-full bg-merke pl-1.5 pr-2 py-0.5 text-xs font-bold text-pa-merke tabular-nums">
            <Flamme size={12} fylt />7 på rad
          </span>
        </div>
        <div className="p-3 flex flex-col gap-2.5">
          <div className="rounded-xl bg-surface border border-border px-3 py-2.5 flex items-center justify-between gap-3">
            <span className="flex flex-col min-w-0">
              <span className="text-sm font-semibold truncate">Kjemisk binding</span>
              <span className="text-xs text-muted">12 begreper · 8 spørsmål</span>
            </span>
            <span className="shrink-0 rounded-lg bg-primary text-white px-2.5 py-1 text-xs font-semibold">Øv</span>
          </div>
          <span className="h-1.5 rounded-full bg-sunken overflow-hidden">
            <span className="block h-full w-2/3 rounded-full bg-primary" />
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setProver((p) => !p)}
        aria-pressed={prover}
        className="trykk self-start rounded-xl border-[1.5px] border-border-strong bg-surface px-4 py-2 text-sm font-semibold hover:border-foreground"
      >
        {prover ? "Slutt å prøve" : "Prøv på hele siden"}
      </button>
    </div>
  );
}

// For ting eleven eier: ta i bruk eller ta av. Valget lagres i profilen og
// vises med en gang (lib/utseende.ts).
function BrukTing({ ting, brukerId, nyKjopt, start }: { ting: string; brukerId: string; nyKjopt: boolean; start?: MineTing }) {
  // Før det delte valget er hentet, gjelder det belønningssiden hentet selv.
  const { valgt: delt, klar } = useUtseendeStatus();
  const valgt = klar ? delt : (start?.valgt ?? delt);
  const type = tingtype(ting)!;
  const iBruk = erIBruk(valgt, ting);
  const [jobber, setJobber] = useState(false);
  const [feil, setFeil] = useState<string | null>(null);

  async function veksle() {
    setJobber(true);
    setFeil(null);
    try {
      if (type !== "merke") await velgTing(brukerId, type, iBruk ? null : ting);
      else if (iBruk) await velgMerker(brukerId, valgt.merker.filter((m) => m !== ting));
      else if (valgt.merker.length >= MAKS_MERKER)
        throw new Error("Du har allerede tre merker ved navnet. Ta av ett i samlingen din først.");
      else await velgMerker(brukerId, [...valgt.merker, ting]);
    } catch (e) {
      setFeil((e as Error).message);
    } finally {
      setJobber(false);
    }
  }

  return (
    <div className={`flex flex-col gap-2 ${nyKjopt ? "rise-rask" : ""}`}>
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-success-ink">
        <Check size={16} />
        <Link href="/konto#samling" className="underline decoration-2 underline-offset-4 decoration-current/30 hover:decoration-current">
          {nyKjopt ? "Lagt i samlingen din!" : "I samlingen din"}
        </Link>
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

// En partnerkode med «Kopier» og lenke til partnerens nettside.
function Kode({ kode, lenke }: { kode: string; lenke: string | null }) {
  const [kopiert, setKopiert] = useState(false);
  const lenkeknapp = "rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-200";
  return (
    <span className="flex flex-wrap items-center gap-2">
      <code className="rounded-lg bg-sunken px-3 py-2 font-mono text-sm font-semibold tracking-wide">{kode}</code>
      <button
        type="button"
        onClick={() => navigator.clipboard?.writeText(kode).then(() => setKopiert(true))}
        className={`${lenkeknapp} text-ink-soft hover:text-foreground hover:bg-sunken`}
      >
        {kopiert ? "Kopiert" : "Kopier"}
      </button>
      {lenke && (
        <a href={lenke} target="_blank" rel="noopener noreferrer" className={`${lenkeknapp} text-primary hover:bg-primary-tint`}>
          Bruk koden
        </a>
      )}
    </span>
  );
}
