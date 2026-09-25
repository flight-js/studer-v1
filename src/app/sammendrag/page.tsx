"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { AppBar } from "@/components/AppBar";
import { ArrowRight, Book, Mindmap } from "@/components/icons";
import { Sammendragtekst } from "@/components/ovinger/Sammendragtekst";
import { useOvingsinnhold } from "@/components/Ovingsramme";
import { Tankekart } from "@/components/Tankekart";
import { Laster } from "@/components/Tilstand";
import { hentSammendrag, hentTema, temaHref } from "@/lib/pensum";

const hent = async (id: string) => {
  const [innhold, tema] = await Promise.all([hentSammendrag(id), hentTema(id)]);
  return { ...innhold, tema };
};

export default function SammendragPage() {
  return (
    <div className="flex flex-col flex-1">
      <Suspense fallback={<Laster />}>
        <Sammendrag />
      </Suspense>
    </div>
  );
}

function Sammendrag() {
  const { id, data, tilstand, tilbake } = useOvingsinnhold("sammendrag", hent);
  const [visning, setVisning] = useState<"tekst" | "kart">("tekst");

  return (
    <>
      <AppBar back={tilbake} backLabel={data ? data.tema.navn : "Tilbake"} />
      {tilstand ??
        (data && (
          <main id="innhold" className="px-5 sm:px-8 pt-10 pb-24 flex flex-col gap-10 max-w-5xl w-full mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 rise">
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-muted">{data.tema.fagNavn}</p>
                <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.025em] leading-[1.05] hyphens-auto" lang="nb">
                  {data.tema.navn}
                </h1>
              </div>
              <div
                role="tablist"
                aria-label="Visning"
                className="flex gap-1 p-1 bg-sunken rounded-2xl w-fit shrink-0"
              >
                {(
                  [
                    ["tekst", "Sammendrag", <Book key="b" size={16} />],
                    ["kart", "Tankekart", <Mindmap key="m" size={16} />],
                  ] as const
                ).map(([verdi, navn, ikon]) => (
                  <button
                    key={verdi}
                    role="tab"
                    aria-selected={visning === verdi}
                    aria-controls={`panel-${verdi}`}
                    onClick={() => setVisning(verdi)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-[background-color,color,box-shadow] duration-200 ${
                      visning === verdi
                        ? "bg-surface text-foreground shadow-[0_1px_3px_rgba(60,48,30,0.12)]"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {ikon}
                    {navn}
                  </button>
                ))}
              </div>
            </div>

            {visning === "tekst" ? (
              <article id="panel-tekst" role="tabpanel" className="max-w-[68ch] rise">
                <Sammendragtekst kilde={data.sammendrag} />
              </article>
            ) : (
              <section id="panel-kart" role="tabpanel" aria-label="Tankekart" className="rise">
                <Tankekart rot={data.tankekart} />
              </section>
            )}

            <div className="flex flex-wrap gap-3 pt-6 border-t border-border">
              <Link
                href={temaHref("/flashcards", id)}
                className="group inline-flex items-center gap-2 bg-primary text-white px-5 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98]"
              >
                Øv med flashcards
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={temaHref("/quiz", id)}
                className="inline-flex items-center border-[1.5px] border-border-strong px-5 py-3.5 rounded-xl text-sm font-semibold hover:border-foreground transition-colors active:scale-[0.98]"
              >
                Ta quizen
              </Link>
            </div>
          </main>
        ))}
    </>
  );
}
