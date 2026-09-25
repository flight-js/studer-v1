"use client";

import { Suspense } from "react";
import { Miniprove } from "@/components/ovinger/Miniprove";
import { Ovingstopp, useOvingsinnhold } from "@/components/Ovingsramme";
import { Laster } from "@/components/Tilstand";
import { hentMiniprove, hentTema } from "@/lib/pensum";

const hent = async (id: string) => {
  const [prove, tema] = await Promise.all([hentMiniprove(id), hentTema(id)]);
  return { ...prove, temaNavn: tema.navn, fagNavn: tema.fagNavn };
};

export default function MiniprovePage() {
  return (
    <div className="flex flex-col flex-1">
      <Suspense fallback={<Laster />}>
        <MiniproveInnhold />
      </Suspense>
    </div>
  );
}

function MiniproveInnhold() {
  const { id, data, tilstand, tilbake } = useOvingsinnhold("miniprove", hent);
  if (tilstand || !data) {
    return (
      <>
        <Ovingstopp tilbake={tilbake} avsluttTekst="Avslutt miniprøven" />
        {tilstand}
      </>
    );
  }
  return <Miniprove key={id} temaId={id} tilbake={tilbake} {...data} />;
}
