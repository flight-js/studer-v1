"use client";

import { Suspense } from "react";
import { Formelmatch } from "@/components/ovinger/Formelmatch";
import { Ovingstopp, useOvingsinnhold } from "@/components/Ovingsramme";
import { Feil, Laster } from "@/components/Tilstand";
import { MINST } from "@/lib/formelmatch";
import { hentFormler } from "@/lib/pensum";

export default function FormlerPage() {
  return (
    <div className="flex flex-col flex-1">
      <Suspense fallback={<Laster />}>
        <FormlerInnhold />
      </Suspense>
    </div>
  );
}

function FormlerInnhold() {
  const { id, data, tilstand, tilbake } = useOvingsinnhold("formler", hentFormler);
  if (tilstand || !data || data.length < MINST) {
    return (
      <>
        <Ovingstopp tilbake={tilbake} avsluttTekst="Avslutt formelmatch" />
        {tilstand ?? (
          <Feil
            tittel="Ingen formelmatch her"
            tekst="Dette temaet har for få formler til formelmatch. Prøv flashcards eller quiz i stedet."
            href={tilbake}
            lenketekst="Tilbake til temaet"
          />
        )}
      </>
    );
  }
  return <Formelmatch key={id} temaId={id} formler={data} tilbake={tilbake} />;
}
