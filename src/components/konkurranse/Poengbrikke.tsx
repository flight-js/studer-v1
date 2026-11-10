"use client";

import Link from "next/link";
import { Stjerne } from "@/components/icons";
import { useDeltPoengstatus } from "@/lib/poengstatus";

// Poengene i menyen på startsiden, med lenke til konkurransen. Stjerna er den
// samme som ellers står ved poeng (poengvarselet, prisene på belønningene).
// Vises ikke i produksjon før konkurransen er satt opp i databasen.
export function Poengbrikke() {
  const s = useDeltPoengstatus();
  if (!s || (s.demo && process.env.NODE_ENV === "production")) return null;
  return (
    <Link
      href="/konkurranse"
      aria-label={`${s.data.saldo} poeng. Til konkurransen`}
      className="fs-menylenke inline-flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full border-[1.5px] border-natt-linje hover:border-background/40 text-sm font-semibold whitespace-nowrap tabular-nums transition-colors duration-200"
    >
      <span className="inline-flex size-5 items-center justify-center rounded-full bg-merke text-pa-merke">
        <Stjerne size={12} fylt />
      </span>
      {s.data.saldo.toLocaleString("nb-NO")}
    </Link>
  );
}
