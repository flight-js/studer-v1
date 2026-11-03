"use client";

import { Suspense } from "react";
import { SporAi } from "@/components/AiHjelp";
import { Quizrunde } from "@/components/ovinger/Quizrunde";
import { Ovingstopp, useOvingsinnhold } from "@/components/Ovingsramme";
import { Temavalg, unikeKilder, useTemavalg } from "@/components/Temavalg";
import { Laster } from "@/components/Tilstand";
import { hentQuiz, hentTema, type Sporsmal } from "@/lib/pensum";
import { stokkRunde } from "@/lib/stokk";

// Spørsmålene og alternativene stokkes hver gang quizen åpnes. Temaene i
// repetisjonen tas før stokkingen, så de står i samme rekkefølge som i faget.
const hent = async (id: string) => {
  const [sporsmal, tema] = await Promise.all([hentQuiz(id), hentTema(id)]);
  return { sporsmal: stokkRunde(sporsmal), kilder: unikeKilder(sporsmal.map((q) => q.kilde)), tema };
};

export default function QuizPage() {
  return (
    <div className="flex flex-col flex-1">
      <Suspense fallback={<Laster />}>
        <QuizInnhold />
      </Suspense>
    </div>
  );
}

function QuizInnhold() {
  const { id, data, tilstand, tilbake } = useOvingsinnhold("quiz", hent);
  if (tilstand || !data) {
    return (
      <>
        <Ovingstopp tilbake={tilbake} avsluttTekst="Avslutt quiz" />
        {tilstand}
      </>
    );
  }
  return (
    <>
      <Runde id={id} sporsmal={data.sporsmal} kilder={data.kilder} tilbake={tilbake} />
      {/* Åpnes med «Forklar med AI» når et svar er feil. */}
      <SporAi temaId={id} temaNavn={data.tema.navn} fagNavn={data.tema.fagNavn} skjultTilBruk />
    </>
  );
}

// I repetisjonstemaet kan eleven velge hvilke temaer spørsmålene skal komme fra.
function Runde({ id, sporsmal, kilder, tilbake }: { id: string; sporsmal: Sporsmal[]; kilder: string[]; tilbake: string }) {
  const { valgt, alleValgt, sett } = useTemavalg(id, kilder);
  const valgte = alleValgt ? sporsmal : sporsmal.filter((q) => q.kilde && valgt.has(q.kilde));
  const meny = kilder.length > 1 && (
    <Temavalg
      temaer={kilder.map((navn) => ({ navn, antall: sporsmal.filter((q) => q.kilde === navn).length }))}
      valgt={valgt}
      onBruk={sett}
      enhet={(n) => `${n} spørsmål`}
    />
  );
  return (
    <Quizrunde
      key={`${id}:${[...valgt].join("|")}`}
      temaId={id}
      sporsmal={valgte}
      tilbake={tilbake}
      meny={meny}
      lagre={alleValgt}
    />
  );
}
