"use client";

import Link from "next/link";
import { Close } from "@/components/icons";
import { Feil, KreverInnlogging, Laster } from "@/components/Tilstand";
import { useAuth } from "@/lib/auth";
import { temaHref } from "@/lib/pensum";
import { useHent } from "@/lib/useHent";
import { useTemaId } from "@/lib/useTemaId";

// Felles for flashcards, quiz, miniprøve og sammendrag: henter innholdet for
// temaet i adressen, og viser innlogging, lasting og feil på samme måte.
export function useOvingsinnhold<T>(navn: string, hent: (temaId: string) => Promise<T>) {
  const id = useTemaId();
  const { bruker, laster: authLaster } = useAuth();
  const innhold = useHent(id && bruker ? `${navn}:${id}:${bruker.id}` : null, () => hent(id!));
  const tilbake = id ? temaHref("/tema", id) : "/fag";

  let tilstand: React.ReactNode = null;
  if (!id) tilstand = <Feil tittel="Fant ikke temaet" tekst="Lenken mangler fag eller tema." />;
  else if (authLaster) tilstand = <Laster />;
  else if (!bruker) tilstand = <KreverInnlogging />;
  else if (innhold.feil) tilstand = <Feil tekst="Fikk ikke hentet innholdet. Sjekk nettet og prøv igjen." href={tilbake} lenketekst="Tilbake til temaet" />;
  else if (innhold.laster) tilstand = <Laster />;

  return { id: id!, data: innhold.data, tilstand, tilbake };
}

export function Ovingstopp({
  tilbake,
  avsluttTekst,
  children,
  hoyre,
  bred,
}: {
  tilbake: string;
  avsluttTekst: string;
  children?: React.ReactNode;
  hoyre?: React.ReactNode;
  bred?: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
      <div className={`${bred ? "max-w-5xl" : "max-w-3xl"} mx-auto flex items-center gap-5 px-5 sm:px-8 h-16`}>
        <Link
          href={tilbake}
          aria-label={avsluttTekst}
          className="p-2 -ml-2 rounded-lg text-muted hover:text-foreground hover:bg-sunken transition-colors"
        >
          <Close size={20} />
        </Link>
        <div className="flex-1 min-w-0">{children}</div>
        {hoyre && (
          <div className="text-sm font-semibold text-muted tabular-nums whitespace-nowrap">{hoyre}</div>
        )}
      </div>
    </header>
  );
}
