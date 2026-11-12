"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { Skolevelger } from "@/components/konkurranse/Skolevelger";
import { useAuth } from "@/lib/auth";
import { KALLENAVN_MAKS, kallenavnFeil, ryddKallenavn } from "@/lib/kallenavn";
import {
  hentKonkurranseprofil,
  lagreKonkurranseprofil,
  type Konkurranseprofil as Profil,
  type Skole,
} from "@/lib/konkurranse";
import { useHent } from "@/lib/useHent";

// På kontosiden: skolen din, og hvilket navn andre ser på rangeringene
// (fornavnet, et kallenavn, eller ingenting). Skolelista teller deg uansett,
// men viser bare tall per skole. Vises ikke i produksjon før konkurransen er
// satt opp i databasen (som resten av konkurransen).
export function Konkurranseprofil({ brukerId }: { brukerId: string }) {
  const lagret = useHent(`konkurranseprofil:${brukerId}`, () => hentKonkurranseprofil(brukerId));
  if (lagret.data?.demo && process.env.NODE_ENV === "production") return null;

  return (
    <section id="konkurranse" aria-labelledby="konkurranse-tittel" className="scroll-mt-24 border-t border-border pt-8 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 id="konkurranse-tittel" className="font-display text-xl font-semibold">
          Skole og konkurranse
        </h2>
        <p className="text-sm text-ink-soft leading-relaxed max-w-[56ch]">
          Velg skolen din for å være med i skolekonkurransen.{" "}
          <Link href="/konkurranse" className="font-semibold text-foreground underline decoration-border-strong decoration-2 underline-offset-4 hover:decoration-foreground">
            Se rangeringene
          </Link>
        </p>
      </div>
      {lagret.laster ? (
        <span className="h-40 rounded-2xl bg-sunken animate-pulse" aria-hidden="true" />
      ) : lagret.feil || !lagret.data ? (
        <p className="text-sm text-danger-ink">Fikk ikke hentet innstillingene for konkurranse.</p>
      ) : (
        <Skjema brukerId={brukerId} start={lagret.data.data} demo={lagret.data.demo} />
      )}
    </section>
  );
}

function Skjema({ brukerId, start, demo }: { brukerId: string; start: Profil; demo: boolean }) {
  const { profil } = useAuth();
  const [skole, setSkole] = useState<Skole | null>(start.skole);
  const [skjul, setSkjul] = useState(start.skjulFornavn);
  const [kallenavn, setKallenavn] = useState(start.kallenavn ?? "");
  const [status, setStatus] = useState<{ type: "ok" | "feil"; tekst: string } | null>(null);
  // Kallenavnet slik det er lagret nå, så et uendret navn ikke sjekkes på nytt.
  const [lagretKallenavn, setLagretKallenavn] = useState(start.kallenavn);
  const [lagrer, setLagrer] = useState(false);
  const valgId = useId();
  const ugyldig = skjul && !!kallenavn.trim() && !!kallenavnFeil(kallenavn);

  async function lagre(e: React.FormEvent) {
    e.preventDefault();
    if (ugyldig) return;
    setLagrer(true);
    setStatus(null);
    try {
      const lagret = await lagreKonkurranseprofil(brukerId, {
        skoleId: skole?.id ?? null,
        skjulFornavn: skjul,
        kallenavn,
        forrige: lagretKallenavn,
      });
      setLagretKallenavn(lagret);
      setStatus({ type: "ok", tekst: "Lagret." });
    } catch (err) {
      setStatus({ type: "feil", tekst: (err as Error).message });
    } finally {
      setLagrer(false);
    }
  }

  return (
    <form onSubmit={lagre} className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-5">
      <Skolevelger valgt={skole} onVelg={setSkole} />
      <Rangeringsvalg
        id={valgId}
        skjul={skjul}
        onSkjul={setSkjul}
        kallenavn={kallenavn}
        onKallenavn={setKallenavn}
        fornavn={fornavnFra(profil?.navn)}
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={lagrer || ugyldig}
          className="trykk trykk-blekk rounded-xl bg-foreground text-background px-5 py-3 text-sm font-semibold disabled:opacity-60"
        >
          {lagrer
            ? skjul && (ryddKallenavn(kallenavn) || null) !== lagretKallenavn && kallenavn.trim()
              ? "Sjekker kallenavnet …"
              : "Lagrer …"
            : "Lagre"}
        </button>
        {status && (
          <p role="status" className={`text-sm ${status.type === "ok" ? "text-success-ink" : "text-danger-ink"}`}>
            {status.tekst}
          </p>
        )}
      </div>
      {demo && <p className="text-xs text-muted">Konkurransen er ikke slått på ennå, så ingenting blir lagret.</p>}
    </form>
  );
}

export const fornavnFra = (navn?: string | null) => (navn ?? "").trim().split(/\s+/)[0] || null;

// Hva andre ser på rangeringene: fornavnet, et kallenavn eller ingenting.
// Ingenting er standard – navnet vises bare når eleven velger det selv
// (personvernforordningen art. 25 nr. 2, personvern som standard, og samtykke
// etter art. 6 nr. 1 a; elever fra 13 år kan samtykke selv). Velger eleven
// kallenavn, glir et felt fram; det sjekkes mens eleven skriver (og i
// databasen når det lagres). Tomt kallenavn: eleven vises ikke for andre.
// Brukes også i velkomststegene, med aktivtValg: står eleven på standarden
// (ikke vist, uten kallenavn), er ingen av valgene krysset av på forhånd, så
// eleven velger selv – fornavnet står øverst. Uten valg forblir eleven skjult.
//   skjul = false: fornavnet vises   skjul = true: kallenavnet, eller ingenting
type Synlighet = "fornavn" | "kallenavn" | "skjult";

export function Rangeringsvalg({
  id,
  skjul,
  onSkjul,
  kallenavn,
  onKallenavn,
  fornavn,
  mork = false,
  aktivtValg = false,
}: {
  id: string;
  skjul: boolean;
  onSkjul: (v: boolean) => void;
  kallenavn: string;
  onKallenavn: (v: string) => void;
  fornavn?: string | null;
  mork?: boolean;
  aktivtValg?: boolean;
}) {
  // Valget huskes her, så «Bruk et kallenavn» blir stående mens feltet er tomt.
  const [synlighet, setSynlighet] = useState<Synlighet | null>(() =>
    !skjul ? "fornavn" : kallenavn.trim() ? "kallenavn" : aktivtValg ? null : "skjult"
  );
  // Fokus i feltet bare når eleven selv velger kallenavn – ikke når siden åpnes.
  const [krysset, setKrysset] = useState(false);
  // Feil vises når eleven tar en pause, ikke for hver bokstav («M» er for kort,
  // «Ass» er på vei til «Assistent»). Lagre-knappen sjekker med en gang.
  const [sjekket, setSjekket] = useState(kallenavn);
  useEffect(() => {
    const t = window.setTimeout(() => setSjekket(kallenavn), 500);
    return () => window.clearTimeout(t);
  }, [kallenavn]);
  const feil = sjekket.trim() && sjekket === kallenavn ? kallenavnFeil(sjekket) : null;
  const dempet = mork ? "text-background/60" : "text-muted";
  // Én rammefarge om gangen, så feilfargen ikke taper mot den vanlige.
  const ramme = feil
    ? mork
      ? "border-[#ffb4a8]"
      : "border-danger"
    : mork
      ? "border-natt-linje focus:border-merke"
      : "border-border-strong focus:border-primary";
  const felt = mork
    ? `${ramme} bg-natt-hevet text-background placeholder:text-background/40`
    : `${ramme} bg-background placeholder:text-faint`;

  const velg = (ny: Synlighet) => {
    setSynlighet(ny);
    setKrysset(ny === "kallenavn");
    onSkjul(ny !== "fornavn");
    if (ny === "skjult") onKallenavn("");
  };
  const valg: { verdi: Synlighet; tittel: string; tekst: string }[] = [
    {
      verdi: "fornavn",
      tittel: `Vis fornavnet mitt${fornavn ? ` (${fornavn})` : ""}`,
      tekst: "Andre elever ser fornavnet, skolen og merkene dine – aldri e-posten.",
    },
    {
      verdi: "kallenavn",
      tittel: "Bruk et kallenavn",
      tekst: "Andre ser kallenavnet, skolen og merkene dine i stedet for navnet.",
    },
    {
      verdi: "skjult",
      tittel: "Ikke vis meg",
      tekst: "Du ser din egen plass, men ingen andre ser deg. Skolelista teller deg likevel, men viser bare tall per skole.",
    },
  ];

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-semibold">Hva andre ser på rangeringene</legend>
      <p className={`-mt-1 text-xs ${dempet}`}>Ingenting vises før du velger det selv. Du kan endre det når som helst.</p>
      <div className="flex flex-col gap-2.5">
        {valg.map((v) => (
          <label key={v.verdi} htmlFor={`${id}-${v.verdi}`} className="flex items-start gap-3 cursor-pointer">
            <input
              id={`${id}-${v.verdi}`}
              type="radio"
              name={`${id}-synlighet`}
              checked={synlighet === v.verdi}
              onChange={() => velg(v.verdi)}
              className="mt-1 size-4 accent-primary"
            />
            <span className="flex flex-col">
              <span className="text-sm font-semibold">{v.tittel}</span>
              <span className={`text-xs ${dempet}`}>{v.tekst}</span>
            </span>
          </label>
        ))}
      </div>

      {synlighet === "kallenavn" && (
        <div className="rise-rask ml-7 flex flex-col gap-1.5">
          <span className="flex items-baseline justify-between gap-3">
            <label htmlFor={`${id}-kallenavn`} className="text-sm font-semibold">
              Kallenavn
            </label>
            <span className={`text-xs tabular-nums ${dempet}`} aria-hidden="true">
              {kallenavn.trim().length}/{KALLENAVN_MAKS}
            </span>
          </span>
          <input
            id={`${id}-kallenavn`}
            value={kallenavn}
            onChange={(e) => onKallenavn(e.target.value)}
            maxLength={KALLENAVN_MAKS + 10} // plass til mellomrom som ryddes bort; lengden sjekkes under
            autoFocus={krysset}
            autoComplete="off"
            spellCheck={false}
            placeholder="For eksempel Matteløven"
            aria-invalid={!!feil}
            aria-describedby={`${id}-hjelp`}
            className={`rounded-xl border-[1.5px] px-4 py-3 text-[15px] outline-none transition-colors duration-200 ${felt}`}
          />
          <p
            id={`${id}-hjelp`}
            aria-live="polite"
            className={`text-xs ${feil ? (mork ? "text-[#ffb4a8] font-medium" : "text-danger-ink font-medium") : dempet}`}
          >
            {feil ??
              "Bokstaver, tall, mellomrom, - og _. Det sjekkes før det lagres, og du kan bytte tre ganger i uka. Tomt felt: du vises ikke for andre."}
          </p>
        </div>
      )}
    </fieldset>
  );
}
