"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Pokal } from "@/components/icons";
import { Skolevelger } from "@/components/konkurranse/Skolevelger";
import { hentKonkurranseprofil, lagreSkole, type Skole } from "@/lib/konkurranse";
import { useHent } from "@/lib/useHent";

const SKJULT = "studer-skolekort-skjult";

const lesSkjult = () => {
  try {
    return localStorage.getItem(SKJULT) === "1";
  } catch {
    return false;
  }
};

// På startsiden for innloggede: «Hvilken skole går du på?» når eleven ikke har
// valgt skole. Skolen lagres med en gang den velges. «Ikke nå» skjuler kortet i
// denne nettleseren; skolen kan alltid velges under Konto. Vises ikke i
// produksjon før konkurransen er satt opp i databasen.
export function VelgSkoleKort({ brukerId }: { brukerId: string }) {
  const profil = useHent(`konkurranseprofil:${brukerId}`, () => hentKonkurranseprofil(brukerId));
  const [skjult, setSkjult] = useState(lesSkjult);
  const [lagret, setLagret] = useState<Skole | null>(null);
  const [lagrer, setLagrer] = useState(false);
  const [feil, setFeil] = useState<string | null>(null);

  const p = profil.data;
  if (!p || (p.demo && process.env.NODE_ENV === "production")) return null;
  if (!lagret && (p.data.skole || skjult)) return null;

  async function velg(s: Skole | null) {
    if (!s) return;
    setLagrer(true);
    setFeil(null);
    try {
      await lagreSkole(brukerId, s.id);
      setLagret(s);
    } catch (e) {
      setFeil((e as Error).message);
    } finally {
      setLagrer(false);
    }
  }

  function ikkeNa() {
    try {
      localStorage.setItem(SKJULT, "1");
    } catch {}
    setSkjult(true);
  }

  return (
    <section aria-labelledby="velg-skole" className="rise mb-12 lg:mb-16 rounded-3xl border border-border bg-surface p-6 sm:p-8 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6 lg:gap-10 items-start">
      <div className="flex flex-col gap-3">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-merke px-3 py-1 text-xs font-semibold text-foreground">
          <Pokal size={14} />
          Skolekonkurranse
        </span>
        <h2 id="velg-skole" className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.02em] leading-[1.05]">
          {lagret ? "Da er du med!" : "Hvilken skole går du på?"}
        </h2>
        <p className="text-ink-soft max-w-[44ch]">
          {lagret
            ? `Poengene dine teller nå for ${lagret.navn} i skolekonkurransen.`
            : "Velg skolen din, så teller poengene dine for skolen i konkurransen mot andre skoler."}
        </p>
        {p.demo && <p className="text-xs text-muted">Eksempel: konkurransen er ikke slått på ennå, så ingenting lagres.</p>}
      </div>

      <div className="flex flex-col gap-3 lg:pt-10">
        {lagret ? (
          <div className="rise-rask flex flex-col gap-3">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-success-ink">
              <Check size={16} /> Skolen er lagret
            </span>
            <Link
              href="/konkurranse"
              className="group w-fit inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-5 py-3 text-sm font-semibold transition-[background-color,scale] duration-200 hover:bg-black active:scale-[0.98]"
            >
              Se skolekonkurransen
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        ) : (
          <>
            <Skolevelger valgt={null} onVelg={velg} etikett="" />
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted" role="status">
                {lagrer ? "Lagrer …" : feil ?? ""}
              </span>
              <button
                type="button"
                onClick={ikkeNa}
                className="rounded-lg px-3 py-2 -mr-3 text-sm font-semibold text-ink-soft hover:text-foreground hover:bg-sunken transition-colors duration-200"
              >
                Ikke nå
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
