"use client";

import { Suspense } from "react";
import { Miniprove } from "@/components/ovinger/Miniprove";
import { Ovingstopp, useOvingsinnhold } from "@/components/Ovingsramme";
import { Temavalg, unikeKilder, useTemavalg } from "@/components/Temavalg";
import { Laster } from "@/components/Tilstand";
import { antallOppgaver } from "@/lib/miniprove";
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
  return <Prove id={id} data={data} tilbake={tilbake} />;
}

type Data = Awaited<ReturnType<typeof hent>>;

// I repetisjonstemaet kan eleven velge temaer før prøven: de raske spørsmålene
// har ett tema (kilde), skriveoppgavene ett eller flere (kilder). Med færre
// oppgaver blir tiden kortere i samme forhold, men aldri under 10 minutter.
function Prove({ id, data, tilbake }: { id: string; data: Data; tilbake: string }) {
  const kilder = unikeKilder([...data.raske.map((q) => q.kilde), ...data.skriv.flatMap((s) => s.kilder ?? [])]);
  const { valgt, alleValgt, sett } = useTemavalg(id, kilder);
  const raske = alleValgt ? data.raske : data.raske.filter((q) => q.kilde && valgt.has(q.kilde));
  const skriv = alleValgt ? data.skriv : data.skriv.filter((s) => s.kilder?.some((k) => valgt.has(k)));

  const antall = antallOppgaver(id);
  const iProven = (r: number, sk: number) => Math.min(sk, antall.skriv) + Math.min(r, antall.raske + antall.skriv - Math.min(sk, antall.skriv));
  const andel = iProven(raske.length, skriv.length) / iProven(data.raske.length, data.skriv.length);
  const minutter = alleValgt ? data.minutter : Math.max(10, Math.ceil((data.minutter * andel) / 5) * 5);

  const meny = kilder.length > 1 && (
    <Temavalg
      temaer={kilder.map((navn) => ({
        navn,
        antall: data.raske.filter((q) => q.kilde === navn).length + data.skriv.filter((s) => s.kilder?.includes(navn)).length,
      }))}
      valgt={valgt}
      onBruk={sett}
      enhet={(n) => `${n} oppgaver å trekke fra`}
    />
  );
  return (
    <Miniprove
      key={`${id}:${[...valgt].join("|")}`}
      temaId={id}
      tilbake={tilbake}
      {...data}
      raske={raske}
      skriv={skriv}
      minutter={minutter}
      meny={meny}
      lagre={alleValgt}
    />
  );
}
