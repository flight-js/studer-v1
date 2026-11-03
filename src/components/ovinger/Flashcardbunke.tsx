"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AltRiktig } from "@/components/AltRiktig";
import { ArrowRight, Repeat } from "@/components/icons";
import { Flippkort, useKorttaster } from "@/components/ovinger/Flippkort";
import { Ovingstopp } from "@/components/Ovingsramme";
import { Rapporter } from "@/components/Rapporter";
import { Tips } from "@/components/Tips";
import { huskSvar } from "@/lib/minne";
import { lagreResultat, temaHref, type Flashcard } from "@/lib/pensum";
import { TIPS } from "@/lib/tips";

// meny: temavalget i repetisjonstemaet. lagre: false når bare noen temaer er
// valgt – da regnes ikke runden med i fremdriften for temaet.
export function Flashcardbunke({
  temaId,
  kort,
  tilbake,
  meny,
  lagre = true,
}: {
  temaId: string;
  kort: Flashcard[];
  tilbake: string;
  meny?: React.ReactNode;
  lagre?: boolean;
}) {
  const allIds = kort.map((_, i) => i);
  // Køen av kort som gjenstår. «Kan ikke ennå» legger kortet bakerst igjen.
  const [queue, setQueue] = useState<number[]>(allIds);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [retries, setRetries] = useState(0);

  const total = kort.length;
  const current = queue[0];
  const done = queue.length === 0;
  const card = done ? null : kort[current];
  const minne = card?.minne;

  // Lagre fremdriften når bunken er ferdig, eller når man går ut underveis.
  const lagret = useRef({ known: 0, done: false });
  useEffect(() => {
    lagret.current = { known: known.size, done };
    if (done && lagre) lagreResultat(temaId, "flashcards", total, total);
  }, [known, done, temaId, total, lagre]);
  useEffect(
    () => () => {
      const { known: n, done: ferdig } = lagret.current;
      if (!ferdig && n > 0 && lagre) lagreResultat(temaId, "flashcards", n, total);
    },
    [temaId, total, lagre]
  );

  const answer = useCallback(
    (knowIt: boolean) => {
      if (done || !minne) return;
      setFlipped(false);
      setQueue(([head, ...rest]) => (knowIt ? rest : [...rest, head]));
      if (knowIt) setKnown((k) => new Set(k).add(current));
      else setRetries((r) => r + 1);
      huskSvar([{ type: "kort", nokkel: minne, kan: knowIt }]);
    },
    [current, done, minne]
  );

  const snu = useCallback(() => setFlipped((v) => !v), []);
  useKorttaster(!done, snu, answer);

  function restart() {
    setQueue(allIds);
    setKnown(new Set());
    setRetries(0);
    setFlipped(false);
  }

  return (
    <>
      <Ovingstopp tilbake={tilbake} avsluttTekst="Avslutt flashcards" hoyre={`${known.size} / ${total} kan`} meny={meny}>
        <div className="flex gap-1" aria-hidden="true">
          {allIds.map((id) => (
            <span
              key={id}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                known.has(id) ? "bg-success" : id === current ? "bg-primary" : "bg-sunken"
              }`}
            />
          ))}
        </div>
      </Ovingstopp>

      <main id="innhold" className="flex-1 flex flex-col items-center justify-center gap-8 px-5 pt-10 pb-28">
        {done || !card ? (
          <div className="w-full max-w-md flex flex-col items-center text-center gap-6 rise">
            {retries === 0 && <AltRiktig />}
            <p className="text-sm font-medium text-muted">Bunken er ferdig</p>
            <h1 className="font-display text-5xl sm:text-6xl font-semibold tracking-[-0.025em]">
              Alle {total} kort sitter
            </h1>
            <p className="text-lg text-ink-soft">
              {retries === 0
                ? "Du kunne alle på første forsøk."
                : `Du tok ${retries} ${retries === 1 ? "ekstra runde" : "ekstra runder"} på kortene som var vanskelige.`}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              <button
                onClick={restart}
                className="inline-flex items-center gap-2 border-[1.5px] border-border-strong px-5 py-3.5 rounded-xl text-sm font-semibold hover:border-foreground transition-[color,background-color,border-color,scale] active:scale-[0.98]"
              >
                <Repeat size={16} />
                Start på nytt
              </button>
              <Link
                href={temaHref("/quiz", temaId)}
                className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-[color,background-color,border-color,scale] active:scale-[0.98]"
              >
                Test deg med quiz
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ) : (
          <>
            <Flippkort
              kort={card}
              snudd={flipped}
              runde={`${current}-${retries}-${known.size}`}
              onSnu={snu}
              onSvar={answer}
            />

            <Rapporter key={card.begrep} temaId={temaId} type="flashcard" nokkel={card.begrep} />

            {/* Står i flyten under kortet, så det aldri dekker knappene. */}
            <Tips tips={TIPS.flashcards} />
          </>
        )}
      </main>
    </>
  );
}
