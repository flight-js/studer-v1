"use client";

import Link from "next/link";
import { flammefarge } from "@/components/Rekke";
import { Flamme, Snofnugg } from "@/components/icons";
import { iGar } from "@/lib/konkurranse";
import { useDeltPoengstatus } from "@/lib/poengstatus";
import { useUtseende } from "@/lib/utseende";

// Dager på rad i menyen, ved profilknappen på alle sidene: flammen (i fargen
// eleven har valgt) og antallet. Grå flamme uten rekke, og et lite snøfnugg
// dagen etter at en rekke-frys reddet den. Lenker til konkurransen. Vises ikke
// i produksjon før konkurransen er satt opp i databasen.
// natt: på startsiden, der menyen ligger på den mørke flaten.
export function Rekkebrikke({ natt = false }: { natt?: boolean }) {
  const status = useDeltPoengstatus();
  const { flamme } = useUtseende();
  if (!status || (status.demo && process.env.NODE_ENV === "production")) return null;
  const s = status.data;
  const reddet = s.frossetDag === iGar();
  const tekst = `${s.streak} ${s.streak === 1 ? "dag" : "dager"} på rad${reddet ? ", reddet av en rekke-frys i går" : ""}`;
  return (
    <Link
      href="/konkurranse"
      aria-label={`${tekst}. Til konkurransen`}
      title={tekst}
      className={`inline-flex items-center gap-1 pl-2 pr-2.5 py-1 rounded-full border-[1.5px] text-sm font-bold whitespace-nowrap tabular-nums transition-colors duration-200 ${
        natt
          ? "fs-menylenke border-natt-linje hover:border-background/40"
          : "border-border-strong text-foreground hover:border-foreground"
      }`}
    >
      <Flamme
        size={18}
        fylt
        className={s.streak > 0 ? flammefarge(flamme, true) : natt ? "text-background/35" : "text-faint"}
      />
      {s.streak}
      {reddet && <Snofnugg size={13} className={natt ? "text-background/70" : "text-primary"} />}
    </Link>
  );
}
