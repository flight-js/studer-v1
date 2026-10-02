"use client";

import Link from "next/link";
import { ArrowRight, Lock } from "@/components/icons";
import { useTilgang } from "@/lib/auth";
import { abonnementHref } from "@/lib/betaling";
import { PRIS, PROVEDAGER } from "@/lib/priser";

// Det eleven ser når noe krever abonnement: en hel side når en øving åpnes
// direkte, og et kort på startsiden, i fagoversikten og i temaet. Selve låsen
// sitter i databasen (public.har_tilgang) – dette er bare det eleven ser.

const INNHOLD = "Flashcards, quiz, miniprøver, sammendrag og AI-hjelp i alle fag";

export function KreverAbonnement({ tilbake }: { tilbake?: string }) {
  const { kanProve } = useTilgang();
  const neste = typeof window === "undefined" ? undefined : window.location.pathname + window.location.search;
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 px-5 py-24 text-center rise">
      <span className="w-12 h-12 rounded-2xl bg-primary-tint text-primary flex items-center justify-center" aria-hidden="true">
        <Lock size={22} />
      </span>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.02em]">Dette krever abonnement</h1>
      <p className="text-lg text-ink-soft max-w-[42ch]">
        {INNHOLD} er med i abonnementet.
        {kanProve && ` Prøv alt gratis i ${PROVEDAGER} dager.`}
      </p>
      <div className="flex flex-wrap justify-center gap-3 mt-1">
        <Link
          href={abonnementHref(neste)}
          className="group inline-flex items-center gap-2 bg-primary text-white px-5 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-[color,background-color,border-color,scale] active:scale-[0.98]"
        >
          {kanProve ? `Prøv gratis i ${PROVEDAGER} dager` : "Se abonnement"}
          <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
        {tilbake && (
          <Link
            href={tilbake}
            className="inline-flex items-center border-[1.5px] border-border-strong px-5 py-3.5 rounded-xl text-sm font-semibold hover:border-foreground transition-[color,background-color,border-color,scale] active:scale-[0.98]"
          >
            Tilbake til temaet
          </Link>
        )}
      </div>
    </div>
  );
}

// Vises bare for innloggede uten abonnement.
export function Abonnementskort({ neste }: { neste?: string }) {
  const { laster, innlogget, abonnement, kanProve } = useTilgang();
  if (laster || !innlogget || abonnement) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-2xl bg-foreground text-background px-5 sm:px-6 py-5 rise">
      <span className="flex items-start gap-4">
        <span className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center shrink-0" aria-hidden="true">
          <Lock size={18} />
        </span>
        <span className="flex flex-col gap-1">
          <span className="font-semibold">
            {kanProve ? `Prøv alt gratis i ${PROVEDAGER} dager` : "Lås opp alle øvingene"}
          </span>
          <span className="text-sm text-background/70 max-w-[52ch]">
            {INNHOLD}.{" "}
            {kanProve
              ? "Avslutter du før prøveperioden er over, betaler du ingenting."
              : `Fra ${PRIS.maned} kr i måneden.`}
          </span>
        </span>
      </span>
      <Link
        href={abonnementHref(neste)}
        className="group shrink-0 w-fit inline-flex items-center gap-2 bg-background text-foreground px-5 py-3 rounded-xl text-sm font-semibold hover:bg-white transition-[color,background-color,border-color,scale] active:scale-[0.98]"
      >
        {kanProve ? "Start prøveperioden" : "Se abonnement"}
        <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
