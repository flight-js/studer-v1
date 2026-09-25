"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Dot } from "@/components/Dot";
import { ArrowRight, Check, Close, Repeat, Timer } from "@/components/icons";
import { Ovingstopp } from "@/components/Ovingsramme";
import { lagreResultat, temaHref, type Sporsmal } from "@/lib/pensum";

const LETTERS = ["A", "B", "C", "D"];

type Fase = "start" | "pagar" | "levert";

export function Miniprove({
  temaId,
  tilbake,
  sporsmal,
  minutter,
  temaNavn,
  fagNavn,
}: {
  temaId: string;
  tilbake: string;
  sporsmal: Sporsmal[];
  minutter: number;
  temaNavn: string;
  fagNavn: string;
}) {
  const [fase, setFase] = useState<Fase>("start");
  const [svar, setSvar] = useState<(number | null)[]>(() => sporsmal.map(() => null));
  const [slutt, setSlutt] = useState(0);
  const [igjen, setIgjen] = useState(minutter * 60);
  const [bekreft, setBekreft] = useState(false);

  const total = sporsmal.length;
  const besvart = svar.filter((s) => s !== null).length;
  const poeng = svar.filter((s, i) => s === sporsmal[i].riktig).length;

  const lever = useCallback(() => {
    setFase("levert");
    setBekreft(false);
    window.scrollTo({ top: 0 });
    lagreResultat(
      temaId,
      "miniprove",
      svar.filter((s, i) => s === sporsmal[i].riktig).length,
      sporsmal.length
    );
  }, [svar, sporsmal, temaId]);

  function start() {
    setSvar(sporsmal.map(() => null));
    setSlutt(Date.now() + minutter * 60_000);
    setIgjen(minutter * 60);
    setFase("pagar");
    window.scrollTo({ top: 0 });
  }

  // Nedtelling. Når tiden er ute, leveres prøven automatisk.
  useEffect(() => {
    if (fase !== "pagar") return;
    const tikk = setInterval(() => {
      const s = Math.max(0, Math.round((slutt - Date.now()) / 1000));
      setIgjen(s);
      if (s === 0) lever();
    }, 250);
    return () => clearInterval(tikk);
  }, [fase, slutt, lever]);

  const klokke = `${Math.floor(igjen / 60)}:${String(igjen % 60).padStart(2, "0")}`;

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
                style={{ transform: `scaleX(${besvart / total})` }}
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
              <Timer size={26} />
            </span>
            <p className="text-sm font-medium text-muted">
              {fagNavn}
              <Dot />
              {temaNavn}
            </p>
            <h1 className="font-display text-5xl sm:text-6xl font-semibold tracking-[-0.025em]">Miniprøve</h1>
            <p className="text-lg text-ink-soft max-w-[38ch]">
              {total} spørsmål på {minutter} minutter, både flervalg og sant/usant. Du ser svarene
              og forklaringene når du leverer.
            </p>
            <button
              onClick={start}
              className="group mt-2 inline-flex items-center gap-2 bg-primary text-white px-6 py-4 rounded-xl text-base font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98]"
            >
              Start prøven
              <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
        </main>
      )}

      {fase === "pagar" && (
        <main id="innhold" className="flex-1 px-5 sm:px-8 py-10 sm:py-14">
          <ol className="w-full max-w-2xl mx-auto flex flex-col gap-5">
            {sporsmal.map((q, i) => (
              <li key={q.nokkel} className="bg-surface border border-border rounded-3xl p-5 sm:p-7 flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-muted">
                    {i + 1}
                    <Dot />
                    {q.type === "sant-usant" ? "Sant eller usant?" : "Velg ett svar"}
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
                    const valgt = svar[i] === j;
                    return (
                      <button
                        key={j}
                        role="radio"
                        aria-checked={valgt}
                        onClick={() => setSvar((s) => s.map((v, k) => (k === i ? j : v)))}
                        className={`group flex items-center gap-3.5 text-left rounded-xl px-3.5 py-3 border-[1.5px] transition-[border-color,background-color] duration-200 ${
                          valgt
                            ? "bg-primary-tint border-primary"
                            : "bg-background border-border hover:border-border-strong"
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
          </ol>

          <div className="w-full max-w-2xl mx-auto mt-8 flex flex-col items-end gap-3">
            {bekreft ? (
              <div role="alertdialog" aria-label="Lever prøven" className="w-full bg-surface border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 rise">
                <p className="flex-1 text-ink-soft">
                  Du har {total - besvart} {total - besvart === 1 ? "ubesvart spørsmål" : "ubesvarte spørsmål"}. Vil du levere likevel?
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
        </main>
      )}

      {fase === "levert" && (
        <main id="innhold" className="flex-1 px-5 sm:px-8 py-10 sm:py-16">
          <div className="w-full max-w-2xl mx-auto flex flex-col gap-10">
            <div className="flex flex-col items-center text-center gap-5 rise">
              <p className="text-sm font-medium text-muted">Miniprøve levert{igjen === 0 ? " – tiden var ute" : ""}</p>
              <div className="font-display text-7xl sm:text-8xl font-semibold tracking-[-0.03em] tabular-nums">
                {poeng}
                <span className="text-faint">/{total}</span>
              </div>
              <p className="text-lg text-ink-soft max-w-[36ch]">
                {poeng === total
                  ? "Full pott. Du kan dette temaet."
                  : poeng >= total * 0.7
                    ? "Sterkt. Se over det du bommet på under."
                    : poeng >= total * 0.4
                      ? "Et godt stykke på vei. Les forklaringene og prøv igjen."
                      : "Start med sammendraget og flashcardsene, og ta prøven igjen etterpå."}
              </p>
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
                {sporsmal.map((q, i) => {
                  const riktig = svar[i] === q.riktig;
                  return (
                    <li key={q.nokkel} className="bg-surface border border-border rounded-2xl p-5 flex gap-4">
                      <span
                        className={`shrink-0 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-white ${
                          riktig ? "bg-success" : "bg-danger"
                        }`}
                        aria-label={riktig ? "Riktig" : "Feil"}
                      >
                        {riktig ? <Check size={15} /> : <Close size={15} />}
                      </span>
                      <div className="flex-1 flex flex-col gap-2">
                        <p className="font-semibold leading-snug">
                          {i + 1}. {q.tekst}
                        </p>
                        <p className="text-sm">
                          {!riktig && (
                            <span className="text-danger-ink">
                              Ditt svar: {svar[i] === null ? "ikke besvart" : q.alternativer[svar[i]!]}
                              <Dot />
                            </span>
                          )}
                          <span className="text-success-ink font-semibold">Riktig: {q.alternativer[q.riktig]}</span>
                        </p>
                        <p className="text-sm text-ink-soft leading-relaxed">{q.forklaring}</p>
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
