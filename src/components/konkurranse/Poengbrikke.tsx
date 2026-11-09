"use client";

import Link from "next/link";
import { Pokal } from "@/components/icons";
import { hentPoengstatus } from "@/lib/konkurranse";
import { useHent } from "@/lib/useHent";

// Poengene i menyen på startsiden, med lenke til konkurransen. Vises ikke i
// produksjon før konkurransen er satt opp i databasen.
export function Poengbrikke({ brukerId }: { brukerId: string }) {
  const status = useHent(`poeng:${brukerId}`, hentPoengstatus);
  const s = status.data;
  if (!s || (s.demo && process.env.NODE_ENV === "production")) return null;
  return (
    <Link
      href="/konkurranse"
      aria-label={`${s.data.saldo} poeng. Til konkurransen`}
      className="fs-menylenke inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap tabular-nums transition-colors duration-200"
    >
      <Pokal size={16} />
      {s.data.saldo.toLocaleString("nb-NO")}
    </Link>
  );
}
