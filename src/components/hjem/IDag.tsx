"use client";

import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { temaHref, type SvakestTema } from "@/lib/pensum";

// «I dag» på startsiden for innloggede: det eleven skal repetere, og temaet eleven
// er svakest på. Vises bare når det er noe å vise.

const NAVN = { quiz: "quiz", miniprove: "miniprøve" };

const flertall = (n: number, en: string, flere: string) => `${n} ${n === 1 ? en : flere}`;

function hvaSomSkalRepeteres({ kort, sporsmal, fag }: { kort: number; sporsmal: number; fag: number }) {
  const deler = [kort && flertall(kort, "kort", "kort"), sporsmal && flertall(sporsmal, "spørsmål", "spørsmål")].filter(Boolean);
  return `${deler.join(" og ")}${fag > 1 ? ` fra ${fag} fag` : ""}`;
}

export function IDag({
  repetisjon,
  svakest,
}: {
  repetisjon?: { antall: number; kort: number; sporsmal: number; fag: number };
  svakest?: SvakestTema | null;
}) {
  if (!repetisjon?.antall && !svakest) return null;
  return (
    <section aria-labelledby="i-dag" className="rise mt-14 lg:mt-20 flex flex-col gap-5">
      <h2 id="i-dag" className="text-sm font-medium text-background/65">
        I dag
      </h2>
      <ul className="border-t border-natt-linje">
        {!!repetisjon?.antall && (
          <li className="border-b border-natt-linje">
            <Link href="/repeter" className="trykk-forelder group flex items-center justify-between gap-6 py-6 sm:py-7 rounded-lg">
              <span className="flex flex-col gap-2 min-w-0">
                <span className="font-display font-semibold text-[26px] leading-[1.08] sm:text-4xl tracking-[-0.025em]">
                  {repetisjon.antall} å repetere
                </span>
                <span className="text-xs sm:text-sm text-background/70">{hvaSomSkalRepeteres(repetisjon)}</span>
              </span>
              <span className="trykk trykk-gul shrink-0 inline-flex items-center gap-2 rounded-xl bg-merke text-pa-merke px-5 py-3 text-sm font-semibold group-hover:bg-merke-dark">
                Start
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </li>
        )}
        {svakest && (
          <li className="border-b border-natt-linje">
            <Link href={temaHref("/tema", svakest.id)} className="group flex items-center justify-between gap-6 py-6 sm:py-7 rounded-lg">
              <span className="flex flex-col gap-2 min-w-0">
                <span lang="nb" className="font-display font-semibold text-[26px] leading-[1.08] sm:text-4xl tracking-[-0.025em] hyphens-auto">
                  Du er svakest på {svakest.navn}
                </span>
                <span className="text-xs sm:text-sm text-background/70">
                  {svakest.fagNavn} · beste {NAVN[svakest.aktivitet]}: {svakest.prosent} %
                </span>
              </span>
              <span className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-merke">
                <span className="hidden sm:inline">Øv på det</span>
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </li>
        )}
      </ul>
    </section>
  );
}
