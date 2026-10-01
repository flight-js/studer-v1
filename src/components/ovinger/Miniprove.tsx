"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dot } from "@/components/Dot";
import { Ekstramerke } from "@/components/Ekstramerke";
import { ArrowRight, Check, Close, Pen, Repeat, Timer } from "@/components/icons";
import { Ovingstopp } from "@/components/Ovingsramme";
import { Rapporter } from "@/components/Rapporter";
import { Laster } from "@/components/Tilstand";
import {
  antallOppgaver,
  MAKS_SVAR,
  poengTekst,
  settSammen,
  vurderingsfeiltekst,
  vurderSvar,
  type Vurdering,
} from "@/lib/miniprove";
import { lagreResultat, temaHref, type ProveSporsmal, type Skriveoppgave } from "@/lib/pensum";

const LETTERS = ["A", "B", "C", "D"];

type Fase = "start" | "pagar" | "levert";

// Rettingen av ett skrivesvar. svar er teksten som ble sendt – endrer eleven
// svaret etterpå, sendes det til retting på nytt.
type Retting =
  | { svar: string; status: "venter" }
  | { svar: string; status: "ferdig"; resultat: Vurdering }
  | { svar: string; status: "feil"; melding: string };

export function Miniprove({
  temaId,
  tilbake,
  raske,
  skriv,
  minutter,
  temaNavn,
  fagNavn,
}: {
  temaId: string;
  tilbake: string;
  raske: ProveSporsmal[];
  skriv: Skriveoppgave[];
  minutter: number;
  temaNavn: string;
  fagNavn: string;
}) {
  const [fase, setFase] = useState<Fase>("start");
  const [utvalg, setUtvalg] = useState<ReturnType<typeof settSammen> | null>(null);
  const [valg, setValg] = useState<Record<string, number>>({});
  const [tekster, setTekster] = useState<Record<string, string>>({});
  const [rettinger, setRettinger] = useState<Record<string, Retting>>({});
  const [slutt, setSlutt] = useState(0);
  const [igjen, setIgjen] = useState(minutter * 60);
  const [tidenUte, setTidenUte] = useState(false);
  const [bekreft, setBekreft] = useState(false);
  // Rettingene leses også i tilbakekall, der state kan være utdatert.
  const rettingerRef = useRef<Record<string, Retting>>({});
  const forsok = useRef(0);
  const lagretForsok = useRef(0);

  const antall = antallOppgaver(temaId);
  const antallSkriv = Math.min(antall.skriv, skriv.length);
  const antallRaske = Math.min(raske.length, antall.raske + antall.skriv - antallSkriv);

  const settRetting = useCallback((nokkel: string, r: Retting) => {
    rettingerRef.current = { ...rettingerRef.current, [nokkel]: r };
    setRettinger(rettingerRef.current);
  }, []);

  // Sender et svar til retting, med mindre akkurat det svaret er rettet eller
  // er under retting allerede.
  const rett = useCallback(
    (nokkel: string, svar: string) => {
      const na = rettingerRef.current[nokkel];
      if (na && na.svar === svar && na.status !== "feil") return;
      settRetting(nokkel, { svar, status: "venter" });
      vurderSvar(temaId, nokkel, svar).then(
        (resultat) => {
          if (rettingerRef.current[nokkel]?.svar === svar) settRetting(nokkel, { svar, status: "ferdig", resultat });
        },
        (e) => {
          if (rettingerRef.current[nokkel]?.svar === svar)
            settRetting(nokkel, { svar, status: "feil", melding: vurderingsfeiltekst(e) });
        }
      );
    },
    [temaId, settRetting]
  );

  const lever = useCallback(() => {
    if (!utvalg) return;
    setBekreft(false);
    setFase("levert");
    window.scrollTo({ top: 0 });
    // Svar som ikke er rettet ennå (eller er endret siden), sendes nå. Tomme svar
    // rettes også – da får eleven se fasiten.
    for (const s of utvalg.skriv) rett(s.nokkel, (tekster[s.nokkel] ?? "").trim());
  }, [utvalg, tekster, rett]);

  function start() {
    forsok.current += 1;
    rettingerRef.current = {};
    setRettinger({});
    setUtvalg(settSammen(raske, skriv, antall));
    setValg({});
    setTekster({});
    setSlutt(Date.now() + minutter * 60_000);
    setIgjen(minutter * 60);
    setTidenUte(false);
    setFase("pagar");
    window.scrollTo({ top: 0 });
  }

  // Nedtelling. Når tiden er ute, leveres prøven automatisk.
  useEffect(() => {
    if (fase !== "pagar") return;
    const tikk = setInterval(() => {
      const s = Math.max(0, Math.round((slutt - Date.now()) / 1000));
      setIgjen(s);
      if (s === 0) {
        setTidenUte(true);
        lever();
      }
    }, 250);
    return () => clearInterval(tikk);
  }, [fase, slutt, lever]);

  const skrivRettinger = utvalg?.skriv.map((s) => rettinger[s.nokkel]) ?? [];
  const retter = fase === "levert" && skrivRettinger.some((r) => !r || r.status === "venter");
  const feilet = skrivRettinger.filter((r) => r?.status === "feil");
  const total = (utvalg?.raske.length ?? 0) + (utvalg?.skriv.length ?? 0);
  const besvart =
    (utvalg?.raske.filter((q) => valg[q.nokkel] !== undefined).length ?? 0) +
    (utvalg?.skriv.filter((s) => tekster[s.nokkel]?.trim()).length ?? 0);
  const poeng =
    (utvalg?.raske.filter((q) => valg[q.nokkel] === q.riktig).length ?? 0) +
    skrivRettinger.reduce((sum, r) => sum + (r?.status === "ferdig" ? r.resultat.poeng : 0), 0);

  // Resultatet lagres når alt er rettet – ikke hvis noe feilet, for da ville
  // eleven fått for lav score.
  useEffect(() => {
    if (fase !== "levert" || retter || feilet.length || lagretForsok.current === forsok.current) return;
    lagretForsok.current = forsok.current;
    lagreResultat(temaId, "miniprove", poeng, total);
  }, [fase, retter, feilet.length, poeng, total, temaId]);

  const klokke = `${Math.floor(igjen / 60)}:${String(igjen % 60).padStart(2, "0")}`;
  const antallRettet = skrivRettinger.filter((r) => r && r.status !== "venter").length;

  return (
    <>
      <Ovingstopp
        tilbake={tilbake}
        avsluttTekst="Avslutt miniprøven"
        hoyre={
          fase === "pagar" ? (
            <span className={`inline-flex items-center gap-1.5 ${igjen <= 60 ? "text-danger-ink" : ""}`}>
              <Timer size={16} />
              {klokke}
            </span>
          ) : undefined
        }
      >
        {fase === "pagar" && (
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-sunken rounded-full overflow-hidden" aria-hidden="true">
              <div
                className="h-full bg-primary rounded-full origin-left transition-transform duration-300 ease-out-soft"
                style={{ transform: `scaleX(${total ? besvart / total : 0})` }}
              />
            </div>
            <span className="text-xs text-muted tabular-nums whitespace-nowrap">
              {besvart} av {total} besvart
            </span>
          </div>
        )}
      </Ovingstopp>

      {fase === "start" && (
        <main id="innhold" className="flex-1 flex flex-col items-center justify-center px-5 py-16">
          <div className="w-full max-w-lg flex flex-col items-center text-center gap-6 rise">
            <span className="w-14 h-14 rounded-2xl bg-primary-tint text-primary flex items-center justify-center">
              {antallSkriv ? <Pen size={26} /> : <Timer size={26} />}
            </span>
            <p className="text-sm font-medium text-muted">
              {fagNavn}
              <Dot />
              {temaNavn}
            </p>
            <h1 className="font-display text-5xl sm:text-6xl font-semibold tracking-[-0.025em]">Miniprøve</h1>
            {antallSkriv ? (
              <p className="text-lg text-ink-soft max-w-[40ch]">
                {antallRaske} raske spørsmål og {antallSkriv} skriveoppgaver på {minutter} minutter. Skriveoppgavene
                rettes av KI: helt riktig gir 1 poeng, delvis riktig ½. Du får poeng, tilbakemelding og fasit når du
                leverer.
              </p>
            ) : (
              <p className="text-lg text-ink-soft max-w-[38ch]">
                {antallRaske} spørsmål på {minutter} minutter, både flervalg og sant/usant. Du ser svarene og
                forklaringene når du leverer.
              </p>
            )}
            <button
              onClick={start}
              className="group mt-2 inline-flex items-center gap-2 bg-primary text-white px-6 py-4 rounded-xl text-base font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98]"
            >
              Start prøven
              <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
            {antallSkriv > 0 && (
              <p className="text-xs text-faint max-w-[44ch]">
                Svarene sendes til en KI-tjeneste for retting og lagres ikke. Ikke skriv personlige opplysninger.
              </p>
            )}
          </div>
        </main>
      )}

      {fase === "pagar" && utvalg && (
        <main id="innhold" className="flex-1 px-5 sm:px-8 py-10 sm:py-14">
          <div className="w-full max-w-2xl mx-auto flex flex-col gap-12">
            {utvalg.raske.length > 0 && (
              <Del tittel="Raske spørsmål" tekst="Velg ett svar. Riktig gir 1 poeng.">
                {utvalg.raske.map((q, i) => (
                  <li key={q.nokkel} className="bg-surface border border-border rounded-3xl p-5 sm:p-7 flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm font-medium text-muted">
                        <span>
                          {i + 1}
                          <Dot />
                          {q.type === "sant-usant" ? "Sant eller usant?" : "Velg ett svar"}
                        </span>
                        {!q.kjerne && <Ekstramerke />}
                      </span>
                      <h2 className="font-display text-xl sm:text-2xl font-semibold leading-snug tracking-[-0.01em]">
                        {q.tekst}
                      </h2>
                    </div>
                    <div
                      role="radiogroup"
                      aria-label={`Svar på spørsmål ${i + 1}`}
                      className={q.type === "sant-usant" ? "grid grid-cols-2 gap-2.5" : "flex flex-col gap-2"}
                    >
                      {q.alternativer.map((alt, j) => {
                        const valgt = valg[q.nokkel] === j;
                        return (
                          <button
                            key={j}
                            role="radio"
                            aria-checked={valgt}
                            onClick={() => setValg((v) => ({ ...v, [q.nokkel]: j }))}
                            className={`group flex items-center gap-3.5 text-left rounded-xl px-3.5 py-3 border-[1.5px] transition-[border-color,background-color] duration-200 ${
                              valgt ? "bg-primary-tint border-primary" : "bg-background border-border hover:border-border-strong"
                            }`}
                          >
                            {q.type === "flervalg" && (
                              <span
                                className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors duration-200 ${
                                  valgt ? "bg-primary text-white" : "bg-sunken text-muted"
                                }`}
                              >
                                {LETTERS[j]}
                              </span>
                            )}
                            <span className={`flex-1 text-[15px] ${q.type === "sant-usant" ? "text-center font-semibold" : ""}`}>
                              {alt}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </li>
                ))}
              </Del>
            )}

            {utvalg.skriv.length > 0 && (
              <Del
                tittel="Skriveoppgaver"
                tekst="Svar med egne ord, gjerne 1–4 setninger. Helt riktig gir 1 poeng, delvis riktig ½."
              >
                {utvalg.skriv.map((s, i) => {
                  const nr = utvalg.raske.length + i + 1;
                  return (
                    <li key={s.nokkel} className="bg-surface border border-border rounded-3xl p-5 sm:p-7 flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm font-medium text-muted">
                          <span>
                            {nr}
                            <Dot />
                            Skriv svaret
                          </span>
                          {!s.kjerne && <Ekstramerke />}
                        </span>
                        <h2
                          id={`oppgave-${s.nokkel}`}
                          className="font-display text-xl sm:text-2xl font-semibold leading-snug tracking-[-0.01em]"
                        >
                          {s.tekst}
                        </h2>
                      </div>
                      <textarea
                        aria-labelledby={`oppgave-${s.nokkel}`}
                        value={tekster[s.nokkel] ?? ""}
                        maxLength={MAKS_SVAR}
                        rows={3}
                        onChange={(e) => setTekster((t) => ({ ...t, [s.nokkel]: e.target.value }))}
                        // Rettes i bakgrunnen når eleven går videre, så resultatet er klart ved levering.
                        onBlur={(e) => {
                          const svar = e.target.value.trim();
                          if (svar) rett(s.nokkel, svar);
                        }}
                        placeholder="Skriv svaret ditt her"
                        className="w-full min-h-28 resize-y field-sizing-content bg-background border-[1.5px] border-border rounded-xl px-4 py-3 text-base leading-relaxed placeholder:text-faint focus:border-primary transition-colors"
                      />
                    </li>
                  );
                })}
              </Del>
            )}

            <div className="flex flex-col items-end gap-3">
              {bekreft ? (
                <div
                  role="alertdialog"
                  aria-label="Lever prøven"
                  className="w-full bg-surface border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 rise"
                >
                  <p className="flex-1 text-ink-soft">
                    Du har {total - besvart} {total - besvart === 1 ? "ubesvart oppgave" : "ubesvarte oppgaver"}. Vil du
                    levere likevel?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBekreft(false)}
                      className="px-4 py-3 rounded-xl text-sm font-semibold border-[1.5px] border-border-strong hover:border-foreground transition-colors"
                    >
                      Fortsett
                    </button>
                    <button
                      onClick={lever}
                      autoFocus
                      className="px-4 py-3 rounded-xl text-sm font-semibold bg-foreground text-background active:scale-[0.98] transition-transform"
                    >
                      Lever
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => (besvart < total ? setBekreft(true) : lever())}
                  className="group inline-flex items-center gap-2 bg-foreground text-background px-6 py-4 rounded-xl text-base font-semibold transition-transform duration-200 active:scale-[0.98]"
                >
                  Lever prøven
                  <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              )}
            </div>
          </div>
        </main>
      )}

      {fase === "levert" && utvalg && retter && (
        <Laster tekst={`Retter skriveoppgavene (${antallRettet} av ${utvalg.skriv.length})`} />
      )}

      {fase === "levert" && utvalg && !retter && (
        <main id="innhold" className="flex-1 px-5 sm:px-8 py-10 sm:py-16">
          <div className="w-full max-w-2xl mx-auto flex flex-col gap-10">
            <div className="flex flex-col items-center text-center gap-5 rise">
              <p className="text-sm font-medium text-muted">Miniprøve levert{tidenUte ? " – tiden var ute" : ""}</p>
              <div className="font-display text-7xl sm:text-8xl font-semibold tracking-[-0.03em] tabular-nums">
                {poengTekst(poeng)}
                <span className="text-faint">/{total}</span>
              </div>
              <p className="text-lg text-ink-soft max-w-[36ch]">
                {poeng === total
                  ? "Full pott. Du kan dette temaet."
                  : poeng >= total * 0.7
                    ? "Sterkt. Se over det du bommet på under."
                    : poeng >= total * 0.4
                      ? "Et godt stykke på vei. Les tilbakemeldingene og prøv igjen."
                      : "Start med sammendraget og flashcardsene, og ta prøven igjen etterpå."}
              </p>
              {feilet.length > 0 && (
                <div role="alert" className="w-full flex flex-col sm:flex-row sm:items-center gap-3 bg-danger-tint rounded-2xl px-5 py-4 text-left">
                  <p className="flex-1 text-sm font-medium text-danger-ink">
                    {feilet.length === 1 ? "Én skriveoppgave" : `${feilet.length} skriveoppgaver`} ble ikke rettet, så
                    resultatet er ikke lagret ennå. {feilet[0]?.status === "feil" ? feilet[0].melding : ""}
                  </p>
                  <button
                    onClick={() => utvalg.skriv.forEach((s) => rettinger[s.nokkel]?.status === "feil" && rett(s.nokkel, rettinger[s.nokkel].svar))}
                    className="shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold bg-foreground text-background active:scale-[0.98] transition-transform"
                  >
                    Prøv å rette igjen
                  </button>
                </div>
              )}
              <div className="flex flex-wrap justify-center gap-3 mt-1">
                <button
                  onClick={start}
                  className="inline-flex items-center gap-2 border-[1.5px] border-border-strong px-5 py-3.5 rounded-xl text-sm font-semibold hover:border-foreground transition-colors active:scale-[0.98]"
                >
                  <Repeat size={16} />
                  Ta prøven igjen
                </button>
                <Link
                  href={poeng === total ? tilbake : temaHref("/sammendrag", temaId)}
                  className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98]"
                >
                  {poeng === total ? "Tilbake til temaet" : "Les sammendraget"}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <section aria-labelledby="gjennomgang" className="flex flex-col gap-4">
              <h2 id="gjennomgang" className="font-body text-sm font-medium text-muted">
                Gjennomgang
              </h2>
              <ol className="flex flex-col gap-3">
                {utvalg.raske.map((q, i) => {
                  const svar = valg[q.nokkel];
                  const riktig = svar === q.riktig;
                  return (
                    <li key={q.nokkel} className="bg-surface border border-border rounded-2xl p-5 flex gap-4">
                      <Merke vurdering={riktig ? "riktig" : "feil"} />
                      <div className="flex-1 flex flex-col gap-2">
                        <p className="font-semibold leading-snug">
                          {i + 1}. {q.tekst}
                        </p>
                        <p className="text-sm">
                          {!riktig && (
                            <span className="text-danger-ink">
                              Ditt svar: {svar === undefined ? "ikke besvart" : q.alternativer[svar]}
                              <Dot />
                            </span>
                          )}
                          <span className="text-success-ink font-semibold">Riktig: {q.alternativer[q.riktig]}</span>
                        </p>
                        <p className="text-sm text-ink-soft leading-relaxed">{q.forklaring}</p>
                        <Rapporter temaId={temaId} type="sporsmal" nokkel={q.nokkel} plassering="venstre" />
                      </div>
                    </li>
                  );
                })}
                {utvalg.skriv.map((s, i) => {
                  const r = rettinger[s.nokkel];
                  const ferdig = r?.status === "ferdig" ? r.resultat : null;
                  return (
                    <li key={s.nokkel} className="bg-surface border border-border rounded-2xl p-5 flex gap-4">
                      <Merke vurdering={ferdig?.vurdering ?? null} />
                      <div className="flex-1 min-w-0 flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-semibold leading-snug">
                            {utvalg.raske.length + i + 1}. {s.tekst}
                          </p>
                          {ferdig && (
                            <span className="shrink-0 text-sm font-semibold text-muted tabular-nums">
                              {poengTekst(ferdig.poeng)} p
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium text-muted">Ditt svar</span>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words bg-sunken rounded-xl px-3.5 py-2.5">
                            {r?.svar || <span className="text-faint">Ikke besvart</span>}
                          </p>
                        </div>
                        {ferdig ? (
                          <>
                            {ferdig.tilbakemelding && (
                              <p className="text-sm text-ink-soft leading-relaxed">{ferdig.tilbakemelding}</p>
                            )}
                            <p className="text-sm leading-relaxed">
                              <span className="font-semibold text-success-ink">Fasit: </span>
                              {ferdig.fasit}
                            </p>
                          </>
                        ) : (
                          r?.status === "feil" && <p className="text-sm text-danger-ink">{r.melding}</p>
                        )}
                        <Rapporter temaId={temaId} type="skriv" nokkel={s.nokkel} plassering="venstre" />
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          </div>
        </main>
      )}
    </>
  );
}

function Del({ tittel, tekst, children }: { tittel: string; tekst: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl font-semibold tracking-[-0.015em]">{tittel}</h2>
        <p className="text-sm text-muted">{tekst}</p>
      </div>
      <ol className="flex flex-col gap-5">{children}</ol>
    </section>
  );
}

// Riktig, delvis (½), feil – eller ikke rettet.
function Merke({ vurdering }: { vurdering: Vurdering["vurdering"] | null }) {
  const stil =
    vurdering === "riktig"
      ? "bg-success text-white"
      : vurdering === "delvis"
        ? "bg-primary text-white"
        : vurdering === "feil"
          ? "bg-danger text-white"
          : "bg-sunken text-muted";
  const navn = { riktig: "Riktig", delvis: "Delvis riktig", feil: "Feil" }[vurdering ?? "feil"];
  return (
    <span
      className={`shrink-0 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${stil}`}
      aria-label={vurdering ? navn : "Ikke rettet"}
    >
      {vurdering === "riktig" ? (
        <Check size={15} />
      ) : vurdering === "delvis" ? (
        "½"
      ) : vurdering === "feil" ? (
        <Close size={15} />
      ) : (
        "?"
      )}
    </span>
  );
}
