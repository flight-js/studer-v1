"use client";

import { Suspense } from "react";
import { Flashcardbunke } from "@/components/ovinger/Flashcardbunke";
import { Ovingstopp, useOvingsinnhold } from "@/components/Ovingsramme";
import { Laster } from "@/components/Tilstand";
import { hentFlashcards } from "@/lib/pensum";

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
  const { id, data, tilstand, tilbake } = useOvingsinnhold("flashcards", hentFlashcards);
  if (tilstand || !data) {
    return (
      <>
        <Ovingstopp tilbake={tilbake} avsluttTekst="Avslutt flashcards" />
        {tilstand}
      </>
    );
  }
  return <Flashcardbunke key={id} temaId={id} kort={data} tilbake={tilbake} />;
}
