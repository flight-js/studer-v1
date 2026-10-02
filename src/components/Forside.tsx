"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Hjem } from "@/components/Hjem";
import { useAuth } from "@/lib/auth";

// Klientdelene av forsiden: startsiden for innloggede og menyknappene, som
// avhenger av innlogging.

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
