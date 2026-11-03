"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { AltRiktig } from "@/components/AltRiktig";
import { ArrowRight, Repeat } from "@/components/icons";
import { Sporsmalsvisning } from "@/components/ovinger/Sporsmalsvisning";
import { Ovingstopp } from "@/components/Ovingsramme";
import { Tips } from "@/components/Tips";
import { huskSvar } from "@/lib/minne";
import { lagreResultat, temaHref, type Sporsmal } from "@/lib/pensum";
import { stokkRunde } from "@/lib/stokk";
import { TIPS } from "@/lib/tips";

// «Ekstra»-tipset bare når quizen har slike spørsmål.
const TIPS_MED_EKSTRA = [...TIPS.quiz, ...TIPS.quizEkstra];

// sporsmal kommer ferdig stokket fra siden; «Ta quizen igjen» stokker på nytt.
// meny: temavalget i repetisjonstemaet. lagre: false når bare noen temaer er
// valgt – da regnes ikke runden med i fremdriften for temaet.
export function Quizrunde({
  temaId,
  sporsmal: forste,
  tilbake,
  meny,
  lagre = true,
}: {
  temaId: string;
  sporsmal: Sporsmal[];
  tilbake: string;
  meny?: React.ReactNode;
  lagre?: boolean;
}) {
  const [sporsmal, setSporsmal] = useState(forste);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const total = sporsmal.length;
  const q = sporsmal[index];
  const answered = selected !== null;
  const progressPct = done ? 100 : ((index + (answered ? 1 : 0)) / total) * 100;

  const choose = useCallback(
    (i: number) => {
      if (answered || done) return;
      setSelected(i);
      if (i === q.riktig) setScore((s) => s + 1);
      huskSvar([{ type: "sporsmal", nokkel: q.minne, kan: i === q.riktig }]);
    },
    [answered, done, q.riktig, q.minne]
  );

  const next = useCallback(() => {
    if (index + 1 >= total) {
      setDone(true);
      if (lagre) lagreResultat(temaId, "quiz", score, total);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }, [index, total, temaId, score, lagre]);

  function restart() {
    setSporsmal(stokkRunde(sporsmal));
    setIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  }

  return (
    <>
      <Ovingstopp tilbake={tilbake} avsluttTekst="Avslutt quiz" hoyre={`${done ? total : index + 1} / ${total}`} meny={meny}>
        <div
          className="h-2 bg-sunken rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round(progressPct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Fremdrift i quizen"
        >
          <div
            className="h-full bg-primary rounded-full origin-left transition-transform duration-500 ease-out-soft"
            style={{ transform: `scaleX(${progressPct / 100})` }}
          />
        </div>
      </Ovingstopp>

      {/* pb-28: plass til AI-knappen nederst til høyre, så den ikke dekker «Neste spørsmål». */}
      <main id="innhold" className="flex-1 flex flex-col px-5 sm:px-8 pt-10 sm:pt-16 pb-28">
        {done ? (
          <Result score={score} total={total} onRestart={restart} temaId={temaId} />
        ) : (
          <Sporsmalsvisning
            key={index}
            q={q}
            temaId={temaId}
            overskrift={`Spørsmål ${index + 1}`}
            valgt={selected}
            nesteTekst={index + 1 >= total ? "Se resultat" : "Neste spørsmål"}
            onVelg={choose}
            onNeste={next}
          />
        )}
        {/* Utenfor spørsmålet (som byttes for hvert spørsmål), så tipset blir stående. */}
        {!done && (
          <div className="w-full max-w-2xl mx-auto mt-6">
            <Tips tips={sporsmal.some((s) => !s.kjerne) ? TIPS_MED_EKSTRA : TIPS.quiz} />
          </div>
        )}
      </main>
    </>
  );
}

function Result({
  score,
  total,
  onRestart,
  temaId,
}: {
  score: number;
  total: number;
  onRestart: () => void;
  temaId: string;
}) {
  const all = score === total;
  const message = all
    ? "Alt riktig. Du har dette temaet inne."
    : score >= total / 2
      ? "Godt jobbet. Ta en runde til på det du bommet på."
      : "Et godt sted å starte. Prøv flashcardsene, og ta quizen igjen etterpå.";
  return (
    <div className="w-full max-w-xl mx-auto my-auto flex flex-col items-center text-center gap-6 rise">
      {all && <AltRiktig />}
      <p className="text-sm font-medium text-muted">Quiz fullført</p>
      <div className="font-display text-7xl sm:text-8xl font-semibold tracking-[-0.03em] tabular-nums">
        {score}
        <span className="text-faint">/{total}</span>
      </div>
      <p className="text-lg text-ink-soft max-w-[34ch]">{message}</p>
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 border-[1.5px] border-border-strong px-5 py-3.5 rounded-xl text-sm font-semibold hover:border-foreground transition-[color,background-color,border-color,scale] active:scale-[0.98]"
        >
          <Repeat size={16} />
          Ta quizen igjen
        </button>
        <Link
          href={temaHref(all ? "/miniprove" : "/flashcards", temaId)}
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-[color,background-color,border-color,scale] active:scale-[0.98]"
        >
          {all ? "Ta miniprøven" : "Øv med flashcards"}
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
