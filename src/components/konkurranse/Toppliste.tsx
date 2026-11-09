"use client";

import Link from "next/link";
import { Pokal } from "@/components/icons";
import { formaterTid, hentToppliste, type Avslutning } from "@/lib/konkurranse";
import { useHent } from "@/lib/useHent";

// Topplista for formelmatch i et tema, på resultatskjermen. Er konkurransen
// ikke satt opp i databasen, vises ingenting i produksjon (eksempeldata bare
// under utvikling).
export function Toppliste({ temaId, avslutning, runde }: { temaId: string; avslutning: Avslutning | null; runde: number }) {
  const liste = useHent(`toppliste:${temaId}:${runde}`, () => hentToppliste(temaId));
  const demo = !!liste.data?.demo;
  if (liste.feil || (demo && process.env.NODE_ENV === "production")) return null;

  const plasser = liste.data?.data ?? [];
  const meg = plasser.find((p) => p.erMeg);

  return (
    <section aria-labelledby="toppliste-tittel" className="flex flex-col gap-3">
      <h2 id="toppliste-tittel" className="flex items-center gap-2 text-sm font-medium text-muted">
        <Pokal size={16} />
        Topplista for temaet
        {demo && <span className="rounded-md bg-sunken px-1.5 py-0.5 text-xs">Eksempeldata</span>}
      </h2>
      {liste.laster ? (
        <span className="h-24 rounded-xl bg-sunken animate-pulse" aria-hidden="true" />
      ) : plasser.length ? (
        <ol className="border-t border-border">
          {plasser.map((p) => (
            <li
              key={`${p.plass}-${p.kallenavn}`}
              className={`grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-3 py-3 border-b border-border ${
                p.erMeg ? "bg-merke/25 -mx-3 px-3 rounded-lg border-transparent" : ""
              }`}
            >
              <span className="font-display text-xl font-semibold tabular-nums text-muted">{p.plass}</span>
              <span className="min-w-0 truncate">
                <span className="font-semibold">{p.kallenavn}</span>
                {p.skole && <span className="text-sm text-muted"> · {p.skole}</span>}
              </span>
              <span className="font-display text-lg font-semibold tabular-nums">{formaterTid(p.tidMs)}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-ink-soft">Ingen har satt en tid her ennå.</p>
      )}
      <p className="text-sm text-muted">
        {avslutning && !avslutning.teller
          ? "Denne runden teller ikke på topplista: bare runder med alle formlene i temaet er med."
          : meg && meg.kallenavn === "Deg"
            ? "De andre ser ikke tiden din. "
            : "Bare runder med alle formlene i temaet teller. "}
        {meg && meg.kallenavn === "Deg" && (
          <Link href="/konto#konkurranse" className="font-semibold text-foreground underline decoration-border-strong underline-offset-4 hover:decoration-foreground">
            Velg kallenavn for å bli med
          </Link>
        )}
      </p>
    </section>
  );
}
