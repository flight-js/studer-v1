"use client";

import Link from "next/link";
import { useState } from "react";
import { KreverAbonnement } from "@/components/Las";
import { ArrowRight } from "@/components/icons";
import { Repeterrunde } from "@/components/ovinger/Repeterrunde";
import { Ovingstopp } from "@/components/Ovingsramme";
import { Feil, KreverInnlogging, Laster } from "@/components/Tilstand";
import { useAuth, useTilgang } from "@/lib/auth";
import { hentRepetisjon } from "@/lib/minne";
import { useHent } from "@/lib/useHent";

export default function RepeterPage() {
  const { bruker } = useAuth();
  const { laster, abonnement } = useTilgang();
  // Øker når eleven vil ta en runde til, så det hentes nytt.
  const [runde, setRunde] = useState(0);
  const innhold = useHent(bruker && abonnement ? `repeter:${bruker.id}:${runde}` : null, hentRepetisjon);

  let tilstand: React.ReactNode = null;
  if (laster) tilstand = <Laster />;
  else if (!bruker) tilstand = <KreverInnlogging />;
  else if (!abonnement) tilstand = <KreverAbonnement tilbake="/" />;
  else if (innhold.feil) tilstand = <Feil tekst="Fikk ikke hentet repetisjonen. Sjekk nettet og prøv igjen." href="/" lenketekst="Til startsiden" />;
  else if (innhold.laster) tilstand = <Laster tekst="Henter det du skal repetere" />;

  return (
    <div className="flex flex-col flex-1">
      {tilstand || !innhold.data ? (
        <>
          <Ovingstopp tilbake="/" avsluttTekst="Avslutt repetisjonen" />
          {tilstand}
        </>
      ) : innhold.data.elementer.length ? (
        <Repeterrunde
          key={runde}
          elementer={innhold.data.elementer}
          igjen={innhold.data.igjen}
          onFlere={() => setRunde((r) => r + 1)}
        />
      ) : (
        <>
          <Ovingstopp tilbake="/" avsluttTekst="Avslutt repetisjonen" />
          <main id="innhold" className="flex-1 flex flex-col items-center justify-center gap-6 px-5 py-16 text-center">
            <div className="w-full max-w-md flex flex-col items-center gap-5 rise">
              <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.025em]">
                Ingenting å repetere nå
              </h1>
              <p className="text-lg text-ink-soft">
                Når du øver med flashcards, quiz og miniprøver, husker Studer hva du kan og hva du bommer på. Det dukker
                opp her når det er på tide å ta det igjen.
              </p>
              <Link
                href="/fag"
                className="mt-2 inline-flex items-center gap-2 bg-primary text-white px-5 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-[color,background-color,border-color,scale] active:scale-[0.98]"
              >
                Velg noe å øve på
                <ArrowRight size={16} />
              </Link>
            </div>
          </main>
        </>
      )}
    </div>
  );
}
