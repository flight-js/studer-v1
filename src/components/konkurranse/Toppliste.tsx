"use client";

import Link from "next/link";
import { ArrowRight, Pokal } from "@/components/icons";
import { Navnemerker } from "@/components/konkurranse/Navnemerke";
import { formaterTid, hentToppliste, type Avslutning } from "@/lib/konkurranse";
import { useHent } from "@/lib/useHent";

// Topplista for formelmatch i et tema, på resultatskjermen. Bare standardrunder
// teller (alle formlene i temaet, 12 tilfeldige når det er flere), så alle på
// lista har spilt det samme. Har færre enn tre spilt temaet, vises også lista
// for hele faget (repetisjonstemaet), der flest i faget møtes. Er konkurransen
// ikke satt opp i databasen, vises ingenting i produksjon (eksempeldata bare
// under utvikling).

const FAA = 3; // under så mange spillere vises lista for hele faget i tillegg

export function Toppliste({
  temaId,
  avslutning,
  runde,
  egetUtvalg = false,
  faget = null,
  tittel = "Topplista for temaet",
}: {
  temaId: string;
  avslutning: Avslutning | null;
  runde: number;
  // Runden var et eget utvalg (eller «øv på de du bommet på») og teller ikke.
  egetUtvalg?: boolean;
  // Lista for hele faget, når dette er et vanlig tema.
  faget?: { temaId: string; href: string } | null;
  tittel?: string;
}) {
  const liste = useHent(`toppliste:${temaId}:${runde}`, () => hentToppliste(temaId));
  const demo = !!liste.data?.demo;
  if (liste.feil || (demo && process.env.NODE_ENV === "production")) return null;

  const plasser = liste.data?.data ?? [];
  const meg = plasser.find((p) => p.erMeg);
  const spillere = plasser[0]?.antall ?? 0;
  const visFaget = !!faget && !liste.laster && spillere < FAA;

  return (
    <>
      <section aria-label={tittel} className="flex flex-col gap-3">
        <h2 className="flex items-center gap-2 text-sm font-medium text-muted">
          <Pokal size={16} />
          {tittel}
          {demo && <span className="rounded-md bg-sunken px-1.5 py-0.5 text-xs">Eksempeldata</span>}
        </h2>
        {liste.laster ? (
          <span className="h-24 rounded-xl bg-sunken animate-pulse" aria-hidden="true" />
        ) : plasser.length ? (
          <ol className="border-t border-border">
            {plasser.map((p) => (
              <li
                key={`${p.plass}-${p.navn}`}
                className={`grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-3 py-3 border-b border-border ${
                  p.erMeg ? "bg-merke/25 -mx-3 px-3 rounded-lg border-transparent" : ""
                }`}
              >
                <span className="font-display text-xl font-semibold tabular-nums text-muted">{p.plass}</span>
                {/* Navn og skole kuttes med «…», merkene gjør aldri det. */}
                <span className="min-w-0 flex items-center">
                  <span className="font-semibold truncate">{p.navn}</span>
                  <Navnemerker merker={p.merker} />
                  {p.skole && (
                    <span className="min-w-0 shrink-[4] truncate text-sm text-muted">
                      <span aria-hidden="true" className="mx-2">
                        ·
                      </span>
                      <span className="sr-only">, </span>
                      {p.skole}
                    </span>
                  )}
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
            ? egetUtvalg
              ? "Denne runden teller ikke på topplista, fordi du spilte et eget utvalg. Spill med alle formlene for å komme med. "
              : "Denne runden teller ikke på topplista: bare runder med alle formlene er med. "
            : meg && meg.navn === "Deg"
              ? "De andre ser ikke tiden din. "
              : "Bare runder med alle formlene teller (12 tilfeldige når det er flere), så alle har spilt det samme. "}
          {meg && meg.navn === "Deg" && (
            <Link
              href="/konto#konkurranse"
              className="font-semibold text-foreground underline decoration-border-strong underline-offset-4 hover:decoration-foreground"
            >
              Velg et kallenavn
            </Link>
          )}
        </p>
      </section>

      {visFaget && faget && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-ink-soft">
            {spillere === 0 ? "Ingen" : "Få"} har spilt dette temaet ennå. Her er lista for hele faget, der flest er med.
          </p>
          <Toppliste temaId={faget.temaId} avslutning={null} runde={runde} tittel="Topplista for hele faget" />
          <Link
            href={faget.href}
            className="group self-start inline-flex items-center gap-2 text-sm font-semibold text-foreground underline decoration-border-strong decoration-2 underline-offset-4 hover:decoration-foreground"
          >
            Spill formelmatch med hele faget
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      )}
    </>
  );
}
