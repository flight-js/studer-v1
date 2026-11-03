"use client";

import { Suspense } from "react";
import { SporAi } from "@/components/AiHjelp";
import { Flashcardbunke } from "@/components/ovinger/Flashcardbunke";
import { Ovingstopp, useOvingsinnhold } from "@/components/Ovingsramme";
import { Temavalg, unikeKilder, useTemavalg } from "@/components/Temavalg";
import { Laster } from "@/components/Tilstand";
import { hentFlashcards, hentTema, type Flashcard } from "@/lib/pensum";

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
      <Bunke id={id} kort={data.kort} tilbake={tilbake} />
      <SporAi temaId={id} temaNavn={data.tema.navn} fagNavn={data.tema.fagNavn} />
    </>
  );
}

// I repetisjonstemaet kan eleven velge hvilke temaer kortene skal komme fra
// (kilde). Et nytt valg starter bunken på nytt.
function Bunke({ id, kort, tilbake }: { id: string; kort: Flashcard[]; tilbake: string }) {
  const kilder = unikeKilder(kort.map((k) => k.kilde));
  const { valgt, alleValgt, sett } = useTemavalg(id, kilder);
  const valgte = alleValgt ? kort : kort.filter((k) => k.kilde && valgt.has(k.kilde));
  const meny = kilder.length > 1 && (
    <Temavalg
      temaer={kilder.map((navn) => ({ navn, antall: kort.filter((k) => k.kilde === navn).length }))}
      valgt={valgt}
      onBruk={sett}
      enhet={(n) => `${n} kort`}
    />
  );
  return (
    <Flashcardbunke
      key={`${id}:${[...valgt].join("|")}`}
      temaId={id}
      kort={valgte}
      tilbake={tilbake}
      meny={meny}
      lagre={alleValgt}
    />
  );
}
