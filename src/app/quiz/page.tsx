"use client";

import { Suspense } from "react";
import { SporAi } from "@/components/AiHjelp";
import { Quizrunde } from "@/components/ovinger/Quizrunde";
import { Ovingstopp, useOvingsinnhold } from "@/components/Ovingsramme";
import { Laster } from "@/components/Tilstand";
import { hentQuiz, hentTema } from "@/lib/pensum";
import { stokkRunde } from "@/lib/stokk";

// Spørsmålene og alternativene stokkes hver gang quizen åpnes.
const hent = async (id: string) => {
  const [sporsmal, tema] = await Promise.all([hentQuiz(id), hentTema(id)]);
  return { sporsmal: stokkRunde(sporsmal), tema };
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
      <Quizrunde key={id} temaId={id} sporsmal={data.sporsmal} tilbake={tilbake} />
      {/* Åpnes med «Forklar med AI» når et svar er feil. */}
      <SporAi temaId={id} temaNavn={data.tema.navn} fagNavn={data.tema.fagNavn} skjultTilBruk />
    </>
  );
}
