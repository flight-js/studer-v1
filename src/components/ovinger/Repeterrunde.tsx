"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { AltRiktig } from "@/components/AltRiktig";
import { SporAi } from "@/components/AiHjelp";
import { ArrowRight } from "@/components/icons";
import { Flippkort, useKorttaster } from "@/components/ovinger/Flippkort";
import { Sporsmalsvisning } from "@/components/ovinger/Sporsmalsvisning";
import { Ovingstopp } from "@/components/Ovingsramme";
import { Rapporter } from "@/components/Rapporter";
import { huskSvar, RUNDE, type Repetisjonselement } from "@/lib/minne";

// Dagens repetisjon: kort og spørsmål fra alle fagene, blandet. Kort eleven ikke
// kan, kommer igjen bakerst i runden. Alt eleven bommer på, kommer også tilbake i
// morgen. igjen: hvor mange som står igjen i dag etter denne runden.
export function Repeterrunde({
  elementer,
  igjen,
  onFlere,
}: {
  elementer: Repetisjonselement[];
  igjen: number;
  onFlere: () => void;
}) {
  const [ko, setKo] = useState(() => elementer.map((_, i) => i));
  const [snudd, setSnudd] = useState(false);
  const [valgt, setValgt] = useState<number | null>(null);
  const [bommet, setBommet] = useState<Set<number>>(new Set());
  const [forsok, setForsok] = useState(0);

  const total = elementer.length;
  const naa = ko[0];
  const element = naa === undefined ? null : elementer[naa];
  const kort = element?.type === "kort" ? element.kort : null;
  const sporsmal = element?.type === "sporsmal" ? element.sporsmal : null;

  const noter = useCallback(
    (riktig: boolean) => {
      if (!riktig) setBommet((b) => new Set(b).add(naa));
    },
    [naa]
  );

  const svarKort = useCallback(
    (kan: boolean) => {
      if (!kort) return;
      huskSvar([{ type: "kort", nokkel: kort.minne, kan }]);
      noter(kan);
      setSnudd(false);
      setForsok((f) => f + 1);
      setKo(([forste, ...resten]) => (kan ? resten : [...resten, forste]));
    },
    [kort, noter]
  );

  const velg = useCallback(
    (i: number) => {
      if (!sporsmal || valgt !== null) return;
      setValgt(i);
      noter(i === sporsmal.riktig);
      huskSvar([{ type: "sporsmal", nokkel: sporsmal.minne, kan: i === sporsmal.riktig }]);
    },
    [sporsmal, valgt, noter]
  );

  const neste = useCallback(() => {
    setValgt(null);
    setForsok((f) => f + 1);
    setKo(([, ...resten]) => resten);
  }, []);

  const snu = useCallback(() => setSnudd((v) => !v), []);
  useKorttaster(!!kort, snu, svarKort);

  const ferdige = total - ko.length;
  const andel = (ferdige + (valgt !== null ? 1 : 0)) / total;
  const overskrift = element && (
    <span className="truncate">
      {element.fagNavn} · {element.temaNavn}
    </span>
  );

  return (
    <>
      <Ovingstopp tilbake="/" avsluttTekst="Avslutt repetisjonen" hoyre={`${ferdige} / ${total}`}>
        <div
          className="h-2 bg-sunken rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round(andel * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Fremdrift i repetisjonen"
        >
          <div
            className="h-full bg-primary rounded-full origin-left transition-transform duration-500 ease-out-soft"
            style={{ transform: `scaleX(${andel})` }}
          />
        </div>
      </Ovingstopp>

      {!element ? (
        <Ferdig total={total} bommet={bommet.size} igjen={igjen} onFlere={onFlere} />
      ) : kort ? (
        <main id="innhold" className="flex-1 flex flex-col items-center justify-center gap-8 px-5 pt-10 pb-28">
          <p className="w-full max-w-lg -mb-3 text-center text-sm font-medium text-muted">{overskrift}</p>
          <Flippkort kort={kort} snudd={snudd} runde={String(forsok)} onSnu={snu} onSvar={svarKort} />
          <Rapporter key={kort.minne} temaId={element.temaId} type="flashcard" nokkel={kort.begrep} />
        </main>
      ) : (
        sporsmal && (
          <main id="innhold" className="flex-1 flex flex-col px-5 sm:px-8 pt-10 sm:pt-16 pb-28">
            <Sporsmalsvisning
              key={forsok}
              q={sporsmal}
              temaId={element.temaId}
              overskrift={overskrift}
              valgt={valgt}
              nesteTekst={ko.length > 1 ? "Neste" : "Se resultat"}
              onVelg={velg}
              onNeste={neste}
            />
            {/* Åpnes med «Forklar med AI» når et svar er feil. */}
            <SporAi key={element.temaId} temaId={element.temaId} temaNavn={element.temaNavn} fagNavn={element.fagNavn} skjultTilBruk />
          </main>
        )
      )}
    </>
  );
}

function Ferdig({
  total,
  bommet,
  igjen,
  onFlere,
}: {
  total: number;
  bommet: number;
  igjen: number;
  onFlere: () => void;
}) {
  return (
    <main id="innhold" className="flex-1 flex flex-col items-center justify-center gap-6 px-5 pt-10 pb-28 text-center">
      <div className="w-full max-w-md flex flex-col items-center gap-6 rise">
        {bommet === 0 && <AltRiktig />}
        <p className="text-sm font-medium text-muted">Runden er ferdig</p>
        <h1 className="font-display text-5xl sm:text-6xl font-semibold tracking-[-0.025em]">
          {igjen > 0 ? `${igjen} igjen i dag` : "Ferdig for i dag"}
        </h1>
        <p className="text-lg text-ink-soft">
          {bommet === 0
            ? "Du kunne alt på første forsøk. Det kommer tilbake om en stund."
            : `Du kunne ${total - bommet} av ${total} på første forsøk. Det du bommet på, kommer tilbake i morgen.`}
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          {igjen > 0 && (
            <button
              onClick={onFlere}
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-[color,background-color,border-color,scale] active:scale-[0.98]"
            >
              Ta {Math.min(igjen, RUNDE)} til
              <ArrowRight size={16} />
            </button>
          )}
          <Link
            href="/"
            className="inline-flex items-center gap-2 border-[1.5px] border-border-strong px-5 py-3.5 rounded-xl text-sm font-semibold hover:border-foreground transition-[color,background-color,border-color,scale] active:scale-[0.98]"
          >
            Til startsiden
          </Link>
        </div>
      </div>
    </main>
  );
}
