"use client";

import { Suspense } from "react";
import { SporAi } from "@/components/AiHjelp";
import { Flashcardbunke } from "@/components/ovinger/Flashcardbunke";
import { Ovingstopp, useOvingsinnhold } from "@/components/Ovingsramme";
import { Laster } from "@/components/Tilstand";
import { hentFlashcards, hentTema } from "@/lib/pensum";

const hent = async (id: string) => {
  const [kort, tema] = await Promise.all([hentFlashcards(id), hentTema(id)]);
  return { kort, tema };
};

export default function FlashcardsPage() {
  return (
    <div className="flex flex-col flex-1">
      <Suspense fallback={<Laster />}>
        <Flashcards />
      </Suspense>
    </div>
  );
}

function Flashcards() {
  const { id, data, tilstand, tilbake } = useOvingsinnhold("flashcards", hent);
  if (tilstand || !data) {
    return (
      <>
        <Ovingstopp tilbake={tilbake} avsluttTekst="Avslutt flashcards" />
        {tilstand}
      </>
    );
  }
  return (
    <>
      <Flashcardbunke key={id} temaId={id} kort={data.kort} tilbake={tilbake} />
      <SporAi temaId={id} temaNavn={data.tema.navn} fagNavn={data.tema.fagNavn} />
    </>
  );
}
