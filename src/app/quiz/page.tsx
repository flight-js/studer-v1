"use client";

import { Suspense } from "react";
import { Quizrunde } from "@/components/ovinger/Quizrunde";
import { Ovingstopp, useOvingsinnhold } from "@/components/Ovingsramme";
import { Laster } from "@/components/Tilstand";
import { hentQuiz } from "@/lib/pensum";

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
  const { id, data, tilstand, tilbake } = useOvingsinnhold("quiz", hentQuiz);
  if (tilstand || !data) {
    return (
      <>
        <Ovingstopp tilbake={tilbake} avsluttTekst="Avslutt quiz" />
        {tilstand}
      </>
    );
  }
  return <Quizrunde key={id} temaId={id} sporsmal={data} tilbake={tilbake} />;
}
