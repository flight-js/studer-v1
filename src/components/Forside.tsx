"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Hjem } from "@/components/Hjem";
import { useAuth } from "@/lib/auth";
import { hentKatalog } from "@/lib/pensum";
import { useHent } from "@/lib/useHent";

// Klientdelene av forsiden: menyknapper som avhenger av innlogging, og
// fagoversikten, som hentes fra Supabase.

// Innloggede får sin egen startside i stedet for markedssiden. Et lite skript
// i forsiden skjuler markedssiden med en gang hvis det finnes en lagret økt,
// så den ikke blinker forbi; klassen fjernes igjen hvis økten ikke var gyldig.
export function Startside({ children }: { children: React.ReactNode }) {
  const { bruker, laster } = useAuth();
  useEffect(() => {
    if (!laster && !bruker) document.documentElement.classList.remove("har-okt");
  }, [bruker, laster]);
  return bruker ? <Hjem /> : children;
}

export function ForsideMeny({ lenke, knapp }: { lenke: string; knapp: string }) {
  const { bruker, laster } = useAuth();
  if (laster) return <span className="w-44 h-10" aria-hidden="true" />;
  if (bruker) {
    return (
      <Link href="/fag" className={`${knapp} ml-2 px-4.5 py-2.5 text-sm`}>
        Mine fag
      </Link>
    );
  }
  return (
    <>
      <Link href="/logg-inn" className={lenke}>
        Logg inn
      </Link>
      <Link href="/registrer" className={`${knapp} ml-2 px-4.5 py-2.5 text-sm`}>
        Prøv gratis
      </Link>
    </>
  );
}

export function FagOversikt() {
  const katalog = useHent("katalog", hentKatalog);
  if (katalog.feil) return null;
  return (
    <dl className="divide-y divide-border border-y border-border min-h-96">
      {katalog.data?.map((t) => (
        <div
          key={t.id}
          className="grid grid-cols-[5.5rem_1fr] sm:grid-cols-[9rem_1fr] gap-4 py-5 items-baseline"
        >
          <dt className="font-display text-xl font-semibold">{t.navn}</dt>
          <dd className="flex flex-wrap gap-x-5 gap-y-1.5 text-ink-soft">
            {t.fag.map((f) => (
              <Link
                key={f.id}
                href={`/fag?trinn=${t.id}&fag=${f.id}`}
                className="hover:text-primary transition-colors duration-200"
              >
                {f.navn}
              </Link>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
