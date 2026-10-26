"use client";

import Link from "next/link";
import { Fragment, useEffect, useLayoutEffect, useReducer, useRef, useState, useSyncExternalStore } from "react";
import { AltRiktig } from "@/components/AltRiktig";
import { ArrowRight, Check, ChevronRight, Repeat } from "@/components/icons";
import { Ovingstopp } from "@/components/Ovingsramme";
import { Tips } from "@/components/Tips";
import {
  MAKS_PER_RUNDE,
  erPar,
  formelNokkel,
  kanSpilles,
  lagRunde,
  lagreRekord,
  lagreUtvalg,
  lesRekord,
  lesUtvalg,
  sekunder,
  type Brett,
  type Brikke,
} from "@/lib/formelmatch";
import { type Formel } from "@/lib/pensum";
import { stokk } from "@/lib/stokk";
import { TIPS } from "@/lib/tips";

// Som «Match» i Quizlet, men med formler. Over brikkene står en likning med to
// tomme plasser: første brikke eleven trykker på, glir opp til venstre for
// likhetstegnet, den neste til høyre. Er det et par, lyser likningen grønt og
// brikkene forsvinner. Er det feil, rister den, brikkene går tilbake, og det
// koster ett sekund. Tomme plasser blir stående, så brikkene ikke flytter seg.

const STRAFF = 1000;
const VIS_RIKTIG = 420; // ms likningen står grønn før paret forsvinner
const VIS_FEIL = 560; // ms likningen står rød før brikkene går tilbake
const BORTE = 260; // ms de siste brikkene bruker på å tone ut før neste brett
const GLI = { duration: 340, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }; // --ease-out-soft

type Fase = "start" | "spiller" | "ferdig";

type Spill = {
  brettNr: number;
  borte: string[]; // brikker som er koblet riktig
  likning: string[]; // 0–2 brikker i likningen, i rekkefølgen de ble trykket
  svar: "riktig" | "feil" | null;
  nr: number; // øker for hvert svar, så et gammelt tidsavbrudd ikke rydder et nytt
  straffer: number;
  sist: number; // når siste riktige par ble trykket (event.timeStamp)
  bommet: string[]; // formlene som var med i et feil par (formelNokkel)
};

type Handling =
  | { type: "trykk"; id: string; tidspunkt: number; brett: Brett }
  | { type: "rydd"; nr: number }
  | { type: "neste" }
  | { type: "ny" };

const NY: Spill = { brettNr: 0, borte: [], likning: [], svar: null, nr: 0, straffer: 0, sist: 0, bommet: [] };

// Svaret som vises, ryddes bort: riktige brikker forsvinner, feile går tilbake.
function rydd(s: Spill): Spill {
  if (!s.svar) return s;
  return { ...s, borte: s.svar === "riktig" ? [...s.borte, ...s.likning] : s.borte, likning: [], svar: null };
}

function spill(s: Spill, h: Handling): Spill {
  switch (h.type) {
    case "ny":
      return NY;
    case "neste":
      return { ...NY, brettNr: s.brettNr + 1, nr: s.nr, straffer: s.straffer, sist: s.sist, bommet: s.bommet };
    case "rydd":
      return h.nr === s.nr ? rydd(s) : s;
    case "trykk": {
      // Trykker eleven mens et svar vises, ryddes det med en gang – ingen venting.
      const n = rydd(s);
      if (n.borte.includes(h.id)) return n;
      // Samme brikke igjen: ta den ut av likningen.
      if (n.likning.includes(h.id)) return { ...n, likning: [] };
      if (!n.likning.length) return { ...n, likning: [h.id] };
      const [a, b] = [n.likning[0], h.id].map((id) => h.brett.brikker.find((x) => x.id === id)!);
      const riktig = erPar(a, b);
      return {
        ...n,
        likning: [a.id, b.id],
        svar: riktig ? "riktig" : "feil",
        nr: n.nr + 1,
        straffer: n.straffer + (riktig ? 0 : 1),
        sist: riktig ? h.tidspunkt : n.sist,
        // Begge formlene i et feil par regnes som bommet: eleven visste ikke hva noen av dem hørte sammen med.
        bommet: riktig ? n.bommet : [...new Set([...n.bommet, formelNokkel(a.formel), formelNokkel(b.formel)])],
      };
    }
  }
}

export function Formelmatch({ temaId, formler, tilbake }: { temaId: string; formler: Formel[]; tilbake: string }) {
  const [fase, setFase] = useState<Fase>("start");
  const [runde, setRunde] = useState<Brett[]>([]);
  const [s, send] = useReducer(spill, NY);
  // Utvalget: det eleven har valgt i denne økten, ellers det som ble lagret sist,
  // ellers alle formlene. undefined: ikke endret ennå, null: alle.
  const lagret = useSyncExternalStore(ingen, () => lesUtvalg(temaId), () => null);
  const [endret, setEndret] = useState<Set<string> | null | undefined>(undefined);
  const alle = formler.map(formelNokkel);
  const valgt = endret !== undefined ? (endret ?? new Set(alle)) : tolkUtvalg(lagret, alle);
  const valgte = formler.filter((f) => valgt.has(formelNokkel(f)));
  const [start, setStart] = useState(0);
  const [na, setNa] = useState(0);
  const [tid, setTid] = useState(0);
  const [rekord, setRekord] = useState<{ forrige: number | null; ny: boolean }>({ forrige: null, ny: false });
  const fra = useRef<{ id: string; rect: DOMRect } | null>(null);
  const plasser = useRef<(HTMLSpanElement | null)[]>([]);

  const brett = runde[s.brettNr];
  const finn = (id: string) => brett?.brikker.find((b) => b.id === id);
  const antallPar = runde.reduce((sum, b) => sum + b.formler.length, 0);
  const koblet = s.borte.length + (s.svar === "riktig" ? 2 : 0);
  const ferdigePar = runde.slice(0, s.brettNr).reduce((sum, b) => sum + b.formler.length, 0) + koblet / 2;
  const tomt = !!brett && s.borte.length === brett.brikker.length;
  // Klokka stopper ved det siste riktige trykket, ikke når resultatet vises.
  const stoppet = !!brett && s.brettNr === runde.length - 1 && koblet === brett.brikker.length;
  const brukt = fase === "spiller" ? (stoppet ? s.sist : na) - start + s.straffer * STRAFF : tid;
  const [a, b] = s.likning.map(finn);

  // Klokka: oppdateres ti ganger i sekundet mens eleven spiller.
  useEffect(() => {
    if (fase !== "spiller") return;
    const t = setInterval(() => setNa(performance.now()), 100);
    return () => clearInterval(t);
  }, [fase]);

  // Svaret vises en liten stund, så ryddes likningen.
  useEffect(() => {
    if (!s.svar) return;
    const t = setTimeout(() => send({ type: "rydd", nr: s.nr }), s.svar === "riktig" ? VIS_RIKTIG : VIS_FEIL);
    return () => clearTimeout(t);
  }, [s.svar, s.nr]);

  // Brettet er tomt: neste brett, eller resultatet når det var det siste.
  useEffect(() => {
    if (fase !== "spiller" || !tomt) return;
    const t = setTimeout(() => {
      if (s.brettNr + 1 < runde.length) return send({ type: "neste" });
      const ms = s.sist - start + s.straffer * STRAFF;
      const forrige = lesRekord(temaId);
      const ny = forrige === null || ms < forrige;
      if (ny) lagreRekord(temaId, ms);
      setTid(ms);
      setRekord({ forrige, ny });
      setFase("ferdig");
    }, BORTE);
    return () => clearTimeout(t);
  }, [fase, tomt, s.brettNr, s.sist, s.straffer, runde.length, start, temaId]);

  // Brikken glir opp i likningen: innholdet i plassen begynner der brikken står,
  // og glir på plass (FLIP).
  useLayoutEffect(() => {
    const f = fra.current;
    fra.current = null;
    const i = f ? s.likning.indexOf(f.id) : -1;
    const el = plasser.current[i];
    if (!f || !el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const til = el.getBoundingClientRect();
    const dx = f.rect.left + f.rect.width / 2 - (til.left + til.width / 2);
    const dy = f.rect.top + f.rect.height / 2 - (til.top + til.height / 2);
    el.animate([{ translate: `${dx}px ${dy}px`, opacity: 0.5 }, { translate: "0 0", opacity: 1 }], GLI);
  }, [s.likning]);

  function begynn(ny: Brett[]) {
    setRunde(ny);
    send({ type: "ny" });
    const no = performance.now();
    setStart(no);
    setNa(no);
    setFase("spiller");
  }

  function trykk(brikke: Brikke, el: HTMLElement, tidspunkt: number) {
    fra.current = { id: brikke.id, rect: el.getBoundingClientRect() };
    send({ type: "trykk", id: brikke.id, tidspunkt, brett });
  }

  const melding =
    s.svar === "riktig" && a && b
      ? `Riktig: ${a.tekst} = ${b.tekst}`
      : s.svar === "feil" && a && b
        ? `Ikke et par: ${a.tekst} = ${b.tekst}. Ett sekund ekstra.`
        : a
          ? `${a.tekst} =`
          : "";
  const fremdrift = fase === "ferdig" ? 100 : (ferdigePar / antallPar) * 100;

  return (
    <>
      <Ovingstopp
        tilbake={tilbake}
        avsluttTekst="Avslutt formelmatch"
        bred
        hoyre={fase === "start" ? undefined : sekunder(brukt)}
      >
        {fase !== "start" && (
          <div
            className="h-2 bg-sunken rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={Math.round(fremdrift)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Formler koblet sammen"
          >
            <div
              className="h-full bg-primary rounded-full origin-left transition-transform duration-500 ease-out-soft"
              style={{ transform: `scaleX(${fremdrift / 100})` }}
            />
          </div>
        )}
      </Ovingstopp>

      <main id="innhold" className="flex-1 flex flex-col px-5 sm:px-8 pt-6 sm:pt-10 pb-16">
        {fase === "start" && (
          <Startskjerm
            formler={formler}
            valgt={valgt}
            onEndre={(ny) => {
              const allevalgt = ny.size === alle.length;
              setEndret(allevalgt ? null : ny);
              lagreUtvalg(temaId, allevalgt ? null : ny);
            }}
            kan={kanSpilles(valgte)}
            temaId={temaId}
            onStart={() => begynn(lagRunde(valgte))}
          />
        )}

        {fase === "spiller" && brett && (
          <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 sm:gap-5">
            <p className="text-sm font-medium text-muted">
              {runde.length > 1 ? `Brett ${s.brettNr + 1} av ${runde.length}` : "Koble sammen formlene"}
              <span className="sr-only">. Trykk på en brikke, og så på den som står på den andre siden av likhetstegnet.</span>
            </p>

            {/* Likningen eleven bygger: venstre = høyre. */}
            <div
              key={s.svar === "feil" ? s.nr : "likning"}
              className={`relative flex items-center gap-2 sm:gap-3 rounded-2xl border-[1.5px] p-2.5 sm:p-3 transition-[border-color,background-color] duration-200 ${
                s.svar === "riktig"
                  ? "border-success bg-success-tint"
                  : s.svar === "feil"
                    ? "rist border-danger bg-danger-tint"
                    : "border-border bg-surface"
              }`}
            >
              <Plass brikke={a} svar={s.svar} settRef={(el) => (plasser.current[0] = el)} />
              <span
                key={s.svar === "riktig" ? s.nr : "lik"}
                aria-hidden="true"
                className={`font-display text-2xl sm:text-3xl font-semibold ${
                  s.svar === "riktig" ? "likhet text-success" : s.svar === "feil" ? "text-danger" : "text-muted"
                }`}
              >
                =
              </span>
              <Plass brikke={b} svar={s.svar} settRef={(el) => (plasser.current[1] = el)} />
              {s.straffer > 0 && (
                <span
                  key={s.straffer}
                  aria-hidden="true"
                  className="straff absolute -top-3 right-3 rounded-full bg-danger px-2.5 py-0.5 text-xs font-semibold text-white tabular-nums"
                >
                  +1 s
                </span>
              )}
            </div>

            <div
              key={s.brettNr}
              role="group"
              aria-label="Brikker"
              className={`rise-rask grid grid-cols-2 sm:grid-cols-3 ${brett.brikker.length > 6 ? "lg:grid-cols-4" : ""} gap-2.5 sm:gap-3`}
            >
              {brett.brikker.map((brikke) => (
                <Brikkeknapp
                  key={brikke.id}
                  brikke={brikke}
                  iLikning={s.likning.includes(brikke.id)}
                  borte={s.borte.includes(brikke.id)}
                  onTrykk={(el, t) => trykk(brikke, el, t)}
                />
              ))}
            </div>
            <p role="status" className="sr-only">
              {melding}
            </p>
          </div>
        )}

        {fase === "ferdig" && (
          <Resultat
            tid={tid}
            rekord={rekord}
            straffer={s.straffer}
            formler={runde.flatMap((r) => r.formler)}
            bommet={s.bommet}
            flere={valgte.length > MAKS_PER_RUNDE}
            tilbake={tilbake}
            onIgjen={() => begynn(lagRunde(valgte))}
            onBommet={() => begynn(lagRunde(medBommet(runde.flatMap((r) => r.formler), s.bommet, valgte)))}
            onVelg={() => setFase("start")}
          />
        )}
      </main>
    </>
  );
}

// En plass i likningen: stiplet når den er tom, ellers brikken som står der.
function Plass({
  brikke,
  svar,
  settRef,
}: {
  brikke?: Brikke;
  svar: Spill["svar"];
  settRef: (el: HTMLSpanElement | null) => void;
}) {
  return (
    <span
      className={`flex-1 min-w-0 min-h-14 sm:min-h-16 flex items-center justify-center rounded-xl border-[1.5px] px-3 py-2 text-center font-display text-lg sm:text-2xl leading-snug break-words transition-[border-color,background-color,color] duration-200 ${
        !brikke
          ? "border-dashed border-border-strong"
          : svar === "riktig"
            ? "border-success bg-surface text-success-ink"
            : svar === "feil"
              ? "border-danger bg-surface text-danger-ink"
              : "border-primary bg-primary-tint"
      }`}
    >
      {brikke && (
        <span key={brikke.id} ref={settRef} className="block min-w-0">
          <Formeltekst tekst={brikke.tekst} />
        </span>
      )}
    </span>
  );
}

function Brikkeknapp({
  brikke,
  iLikning,
  borte,
  onTrykk,
}: {
  brikke: Brikke;
  iLikning: boolean;
  borte: boolean;
  onTrykk: (el: HTMLElement, tidspunkt: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => onTrykk(e.currentTarget, e.timeStamp)}
      disabled={borte}
      aria-pressed={iLikning}
      aria-label={borte ? `${brikke.tekst}, koblet` : brikke.tekst}
      className={`min-h-[76px] sm:min-h-24 flex items-center justify-center px-3 py-3 rounded-2xl border-[1.5px] text-center font-display text-[17px] sm:text-xl leading-snug break-words transition-[border-color,background-color,color,opacity,scale,visibility] duration-200 ease-out-soft ${
        borte
          ? "invisible opacity-0 scale-95"
          : iLikning
            ? "border-dashed border-border-strong text-faint"
            : "bg-surface border-border hover:border-border-strong active:scale-[0.97]"
      }`}
    >
      <span className="min-w-0">
        <Formeltekst tekst={brikke.tekst} />
      </span>
    </button>
  );
}

// «N_A» og «E_{kin}» får senket skrift, «a^(m+n)» og «a^n» hevet skrift (én
// parentes inni parentesen er greit, som e^(−(x − μ)²/(2σ²))). Resten står som det er.
const MERKE = /([_^])(?:\{([^}]*)\}|\(((?:[^()]|\([^()]*\))*)\)|([A-Za-z0-9α-ωΑ-Ω]+))/g;

export function Formeltekst({ tekst }: { tekst: string }) {
  const deler: React.ReactNode[] = [];
  let fra = 0;
  for (const m of tekst.matchAll(MERKE)) {
    if (m.index > fra) deler.push(<Fragment key={fra}>{tekst.slice(fra, m.index)}</Fragment>);
    const Merke = m[1] === "_" ? "sub" : "sup";
    deler.push(
      <Merke key={m.index} className="text-[0.7em]">
        {m[2] ?? m[3] ?? m[4]}
      </Merke>
    );
    fra = m.index + m[0].length;
  }
  if (fra < tekst.length) deler.push(<Fragment key={fra}>{tekst.slice(fra)}</Fragment>);
  return <>{deler}</>;
}

// Rekorden ligger i nettleseren, så den leses først etter at siden er tegnet.
const ingen = () => () => {};

// Lagret utvalg: bare formler som fortsatt finnes. Tomt eller ødelagt: alle.
function tolkUtvalg(lagret: string | null, alle: string[]): Set<string> {
  try {
    const finnes = new Set(alle);
    const valgt = (JSON.parse(lagret ?? "[]") as string[]).filter((k) => finnes.has(k));
    return new Set(valgt.length ? valgt : alle);
  } catch {
    return new Set(alle);
  }
}

function Startskjerm({
  formler,
  valgt,
  onEndre,
  kan,
  temaId,
  onStart,
}: {
  formler: Formel[];
  valgt: Set<string>;
  onEndre: (ny: Set<string>) => void;
  kan: boolean;
  temaId: string;
  onStart: () => void;
}) {
  const rekord = useSyncExternalStore(ingen, () => lesRekord(temaId), () => null);
  const [apen, setApen] = useState(false);
  const n = formler.length;
  const m = formler.filter((f) => valgt.has(formelNokkel(f))).length;
  const omfang =
    m === n
      ? n > MAKS_PER_RUNDE
        ? `${MAKS_PER_RUNDE} tilfeldige av ${n} formler`
        : `${n} formler`
      : `${m} av ${n} formler${m > MAKS_PER_RUNDE ? ` · ${MAKS_PER_RUNDE} tilfeldige per runde` : ""}`;
  return (
    <div className="w-full max-w-xl mx-auto my-auto flex flex-col items-center text-center gap-6 rise">
      <p className="text-sm font-medium text-muted">
        {omfang}
        {rekord !== null && ` · rekord ${sekunder(rekord)}`}
      </p>
      <h1 className="font-display text-5xl sm:text-6xl font-semibold tracking-[-0.025em]">Formelmatch</h1>
      <p className="text-lg text-ink-soft leading-relaxed max-w-[38ch]">
        Trykk på en brikke, så havner den foran likhetstegnet. Trykk så på det som står på den andre siden. Feil koster
        ett sekund.
      </p>
      {!apen && (
        <div
          aria-hidden="true"
          className="w-full max-w-xs flex items-center gap-2 rounded-2xl border-[1.5px] border-border bg-surface p-2.5 font-display text-xl"
        >
          <span className="flex-1 py-2.5 rounded-xl border-[1.5px] border-primary bg-primary-tint">n</span>
          <span className="font-semibold text-muted">=</span>
          <span className="flex-1 self-stretch rounded-xl border-[1.5px] border-dashed border-border-strong" />
        </div>
      )}
      <Utvalg formler={formler} valgt={valgt} onEndre={onEndre} apen={apen} onApne={() => setApen(!apen)} />
      <div className="flex flex-col items-center gap-2.5">
        <button
          type="button"
          onClick={onStart}
          disabled={!kan}
          autoFocus
          className="group inline-flex items-center gap-2 bg-primary text-white px-7 py-4 rounded-xl text-base font-semibold hover:bg-primary-dark transition-[color,background-color,scale,opacity] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
        >
          Start
          <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
        {!kan && <p className="text-sm text-muted">Velg minst tre formler med ulik venstreside.</p>}
      </div>
      {/* Under knappen, så det ikke dekker den på mobil. */}
      <Tips tips={TIPS.formelmatch} />
    </div>
  );
}

// Runden med det eleven bommet på. Er det for få til et brett, fylles den opp
// med tilfeldige andre formler fra utvalget.
function medBommet(forrige: Formel[], bommet: string[], valgte: Formel[]): Formel[] {
  const ut = forrige.filter((f) => bommet.includes(formelNokkel(f)));
  for (const f of stokk(valgte)) {
    if (kanSpilles(ut)) break;
    if (!ut.some((g) => formelNokkel(g) === formelNokkel(f))) ut.push(f);
  }
  return ut;
}

// «Velg formler»: en liste med avkrysning, og i repetisjonstemaet knapper for
// hvert tema som velger eller fjerner alle formlene derfra.
function Utvalg({
  formler,
  valgt,
  onEndre,
  apen,
  onApne,
}: {
  formler: Formel[];
  valgt: Set<string>;
  onEndre: (ny: Set<string>) => void;
  apen: boolean;
  onApne: () => void;
}) {
  const grupper: { tema: string | null; formler: Formel[] }[] = [];
  for (const f of formler) {
    const g = grupper.find((x) => x.tema === (f.tema ?? null));
    if (g) g.formler.push(f);
    else grupper.push({ tema: f.tema ?? null, formler: [f] });
  }
  const antallValgt = formler.filter((f) => valgt.has(formelNokkel(f))).length;
  const [utvidet, setUtvidet] = useState<string | null>(null);
  const veksle = (liste: Formel[]) => {
    const nokler = liste.map(formelNokkel);
    const fjern = nokler.every((k) => valgt.has(k));
    const ny = new Set(valgt);
    for (const k of nokler) {
      if (fjern) ny.delete(k);
      else ny.add(k);
    }
    onEndre(ny);
  };

  return (
    <div className="w-full max-w-md text-left">
      <button
        type="button"
        onClick={onApne}
        aria-expanded={apen}
        aria-controls="formelutvalg"
        className="w-full flex items-center justify-between gap-3 rounded-2xl border-[1.5px] border-border bg-surface px-4 py-3.5 hover:border-border-strong transition-[border-color,scale] duration-200 active:scale-[0.99]"
      >
        <span className="font-semibold">Velg formler</span>
        <span className="flex items-center gap-2 text-sm text-muted tabular-nums">
          {antallValgt === formler.length ? "Alle" : `${antallValgt} av ${formler.length}`}
          <ChevronRight
            size={18}
            className={`transition-transform duration-200 ease-out-soft ${apen ? "-rotate-90" : "rotate-90"}`}
          />
        </span>
      </button>

      {apen && (
        <div
          id="formelutvalg"
          className="rise-rask mt-2 rounded-2xl border-[1.5px] border-border bg-surface p-3 sm:p-4 flex flex-col gap-4"
        >
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-muted tabular-nums">{antallValgt} valgt</span>
            <span className="flex gap-4 font-semibold">
              <button
                type="button"
                onClick={() => onEndre(new Set(formler.map(formelNokkel)))}
                className="text-primary hover:text-primary-dark transition-colors"
              >
                Velg alle
              </button>
              <button
                type="button"
                onClick={() => onEndre(new Set())}
                className="text-primary hover:text-primary-dark transition-colors"
              >
                Fjern alle
              </button>
            </span>
          </div>

          <div className="max-h-[50svh] overflow-y-auto overscroll-contain -mx-1 px-1">
            {grupper.length > 1 ? (
              // Repetisjonstemaet: ett tema per rad, og pila viser formlene i temaet.
              <ul className="flex flex-col">
                {grupper.map((g) => {
                  const antall = g.formler.filter((f) => valgt.has(formelNokkel(f))).length;
                  const tilstand = antall === g.formler.length ? true : antall > 0 ? "mixed" : false;
                  const vist = utvidet === g.tema;
                  return (
                    <li key={g.tema}>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={tilstand}
                          onClick={() => veksle(g.formler)}
                          className="flex-1 min-w-0 flex items-center gap-3 rounded-xl px-2 py-2.5 text-left hover:bg-sunken transition-colors"
                        >
                          <Avkrysning tilstand={tilstand} />
                          <span className="flex-1 min-w-0 text-[15px] font-medium leading-snug">{g.tema}</span>
                          <span className="text-xs text-muted tabular-nums">
                            {antall}/{g.formler.length}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setUtvidet(vist ? null : g.tema)}
                          aria-expanded={vist}
                          aria-label={`${vist ? "Skjul" : "Vis"} formlene i ${g.tema}`}
                          className="shrink-0 p-2 rounded-lg text-muted hover:text-foreground hover:bg-sunken transition-colors"
                        >
                          <ChevronRight
                            size={18}
                            className={`transition-transform duration-200 ease-out-soft ${vist ? "-rotate-90" : "rotate-90"}`}
                          />
                        </button>
                      </div>
                      {vist && (
                        <ul className="rise-rask pl-6 pb-2">
                          {g.formler.map((f) => (
                            <Formelrad key={formelNokkel(f)} formel={f} pa={valgt.has(formelNokkel(f))} onVeksle={() => veksle([f])} />
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <ul className="flex flex-col">
                {formler.map((f) => (
                  <Formelrad key={formelNokkel(f)} formel={f} pa={valgt.has(formelNokkel(f))} onVeksle={() => veksle([f])} />
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Avkrysningsboks: hake når alt er valgt, strek når bare noe er valgt (et tema
// der eleven har tatt bort noen formler).
function Avkrysning({ tilstand }: { tilstand: boolean | "mixed" }) {
  return (
    <span
      aria-hidden="true"
      className={`shrink-0 size-5 rounded-md border-[1.5px] flex items-center justify-center transition-colors duration-150 ${
        tilstand ? "bg-primary border-primary text-white" : "border-border-strong"
      }`}
    >
      {tilstand === true && <Check size={14} />}
      {tilstand === "mixed" && <span className="w-2.5 h-0.5 rounded-full bg-current" />}
    </span>
  );
}

function Formelrad({ formel, pa, onVeksle }: { formel: Formel; pa: boolean; onVeksle: () => void }) {
  return (
    <li>
      <button
        type="button"
        role="checkbox"
        aria-checked={pa}
        onClick={onVeksle}
        className="w-full flex items-center gap-3 rounded-xl px-2 py-2.5 text-left hover:bg-sunken transition-colors"
      >
        <Avkrysning tilstand={pa} />
        <span className="flex-1 min-w-0 flex flex-col">
          <span className="font-display text-lg leading-snug">
            <Formeltekst tekst={formel.venstre} /> = <Formeltekst tekst={formel.hoyre} />
          </span>
          <span className="text-xs text-muted">{formel.navn}</span>
        </span>
      </button>
    </li>
  );
}

function Resultat({
  tid,
  rekord,
  straffer,
  formler,
  bommet,
  flere,
  tilbake,
  onIgjen,
  onBommet,
  onVelg,
}: {
  tid: number;
  rekord: { forrige: number | null; ny: boolean };
  straffer: number;
  formler: Formel[];
  bommet: string[];
  flere: boolean;
  tilbake: string;
  onIgjen: () => void;
  onBommet: () => void;
  onVelg: () => void;
}) {
  const melding =
    rekord.ny && rekord.forrige !== null
      ? `Ny rekord! ${sekunder(rekord.forrige - tid).replace(" s", "")} sekunder raskere enn sist.`
      : rekord.ny
        ? "Første runde er unnagjort. Prøv igjen og slå tiden din."
        : `Rekorden din er ${sekunder(rekord.forrige!)}.`;
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-12 rise">
      <div className="flex flex-col items-center text-center gap-5">
        {straffer === 0 && <AltRiktig />}
        <p className="text-sm font-medium text-muted">
          Formelmatch fullført{straffer > 0 && ` · ${straffer} feil`}
        </p>
        <div className="font-display text-7xl sm:text-8xl font-semibold tracking-[-0.03em] tabular-nums">
          {sekunder(tid).replace(" s", "")}
          <span className="text-faint text-5xl sm:text-6xl"> s</span>
        </div>
        <p className="text-lg text-ink-soft max-w-[36ch]">{melding}</p>
        <div className="flex flex-wrap justify-center gap-3 mt-1">
          {bommet.length > 0 && (
            <button
              type="button"
              onClick={onBommet}
              autoFocus
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold transition-[color,background-color,border-color,scale] active:scale-[0.98] bg-primary text-white hover:bg-primary-dark"
            >
              <Repeat size={16} />
              Øv på {bommet.length === 1 ? "den" : `de ${bommet.length}`} du bommet på
            </button>
          )}
          <button
            type="button"
            onClick={onIgjen}
            autoFocus={!bommet.length}
            className={`inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold transition-[color,background-color,border-color,scale] active:scale-[0.98] ${
              bommet.length
                ? "border-[1.5px] border-border-strong hover:border-foreground"
                : "bg-primary text-white hover:bg-primary-dark"
            }`}
          >
            {!bommet.length && <Repeat size={16} />}
            {flere ? "Ny runde med andre formler" : "Spill igjen"}
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold text-ink-soft">
          <button
            type="button"
            onClick={onVelg}
            className="underline decoration-border-strong decoration-2 underline-offset-4 hover:text-foreground hover:decoration-foreground transition-colors"
          >
            Velg andre formler
          </button>
          <Link
            href={tilbake}
            className="underline decoration-border-strong decoration-2 underline-offset-4 hover:text-foreground hover:decoration-foreground transition-colors"
          >
            Tilbake til temaet
          </Link>
        </div>
      </div>

      <section aria-labelledby="formler-tittel" className="flex flex-col gap-3">
        <h2 id="formler-tittel" className="text-sm font-medium text-muted">
          Formlene du koblet
        </h2>
        <ul className="border-t border-border">
          {formler.map((f) => (
            <li
              key={formelNokkel(f)}
              className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-6 gap-y-1 py-3.5 border-b border-border"
            >
              <span className="font-display text-xl">
                <Formeltekst tekst={f.venstre} /> = <Formeltekst tekst={f.hoyre} />
              </span>
              <span className="flex items-center gap-2 text-sm text-muted sm:text-right">
                {bommet.includes(formelNokkel(f)) && (
                  <span className="rounded-full bg-danger-tint px-2 py-0.5 text-xs font-semibold text-danger-ink">
                    Bommet
                  </span>
                )}
                {f.navn}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
