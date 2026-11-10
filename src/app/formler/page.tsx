"use client";

import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Formel as FormelIkon } from "@/components/icons";
import { Formelmatch } from "@/components/ovinger/Formelmatch";
import { Ovingstopp, useOvingsinnhold } from "@/components/Ovingsramme";
import { Laster } from "@/components/Tilstand";
import { MINST, kanSpilles } from "@/lib/formelmatch";
import { REPETISJON, hentFormler, temaHref, temaId as lagTemaId, type Formel } from "@/lib/pensum";
import { useHent } from "@/lib/useHent";

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
  if (tilstand || !data || !kanSpilles(data)) {
    return (
      <>
        <Ovingstopp tilbake={tilbake} avsluttTekst="Avslutt formelmatch" />
        {tilstand ?? (data ? <ForFaFormler temaId={id} formler={data} tilbake={tilbake} /> : <Laster />)}
      </>
    );
  }
  return <Formelmatch key={id} temaId={id} formler={data} tilbake={tilbake} />;
}

// Formelmatch-knappen står på alle temaer. Har temaet for få formler til en
// runde alene, kan det spilles sammen med resten av faget i repetisjonstemaet
// (som har formlene fra alle temaene) – hvis faget har nok formler til sammen.
function ForFaFormler({ temaId, formler, tilbake }: { temaId: string; formler: Formel[]; tilbake: string }) {
  const [fag, slug] = temaId.split(":");
  const repetisjon = lagTemaId(fag, REPETISJON);
  const erRepetisjon = slug === REPETISJON;
  const faget = useHent(erRepetisjon ? null : `formler:${repetisjon}`, () => hentFormler(repetisjon).catch(() => []));
  if (!erRepetisjon && faget.laster) return <Laster />;
  const medFaget = !erRepetisjon && kanSpilles(faget.data ?? []);

  const n = formler.length;
  const tittel = n === 0 ? "Ingen formler i dette temaet" : "For få formler til en runde alene";
  const tekst = erRepetisjon
    ? n === 0
      ? "Faget har ingen formler å koble. Prøv flashcards eller quiz i stedet."
      : `Faget har bare ${n === 1 ? "én formel" : `${n} formler`} til sammen, og en runde trenger minst ${MINST}. Prøv flashcards eller quiz i stedet.`
    : n === 0
      ? medFaget
        ? "Det er ingen formler å koble i dette temaet. Formelmatch med formlene fra hele faget finner du her."
        : "Det er ingen formler å koble i dette temaet eller i resten av faget. Prøv flashcards eller quiz i stedet."
      : `Temaet har bare ${n === 1 ? "én formel" : `${n} formler`}, og en runde trenger minst ${MINST}. ${
          medFaget
            ? "Spill dem sammen med formlene fra de andre temaene i faget."
            : "Resten av faget har heller ikke nok formler. Prøv flashcards eller quiz i stedet."
        }`;

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-5 py-24 text-center rise">
      <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-sunken text-muted" aria-hidden="true">
        <FormelIkon size={26} />
      </span>
      <h1 className="font-display text-3xl font-semibold tracking-[-0.02em]">{tittel}</h1>
      <p className="text-ink-soft max-w-[44ch]">{tekst}</p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        {medFaget && (
          <Link
            href={temaHref("/formler", repetisjon)}
            className="group trykk trykk-blaa inline-flex items-center gap-2 rounded-xl bg-primary text-white px-5 py-3 text-sm font-semibold hover:bg-primary-dark"
          >
            Formelmatch med hele faget
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        )}
        <Link
          href={tilbake}
          className="inline-flex items-center gap-2 border-[1.5px] border-border-strong px-5 py-3 rounded-xl text-sm font-semibold hover:border-foreground transition-[color,background-color,border-color,scale] active:scale-[0.98]"
        >
          Tilbake til temaet
        </Link>
      </div>
    </div>
  );
}
