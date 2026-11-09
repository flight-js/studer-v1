"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Skolevelger } from "@/components/konkurranse/Skolevelger";
import {
  hentKonkurranseprofil,
  lagreKonkurranseprofil,
  type Konkurranseprofil as Profil,
  type Skole,
} from "@/lib/konkurranse";
import { useHent } from "@/lib/useHent";

// På kontosiden: skolen din, og om fornavnet ditt skal vises på rangeringene.
// Det er av som standard; skolelista teller deg uansett, men viser bare tall per skole.
export function Konkurranseprofil({ brukerId }: { brukerId: string }) {
  const lagret = useHent(`konkurranseprofil:${brukerId}`, () => hentKonkurranseprofil(brukerId));

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
  const [skole, setSkole] = useState<Skole | null>(start.skole);
  const [vis, setVis] = useState(start.vis);
  const [status, setStatus] = useState<{ type: "ok" | "feil"; tekst: string } | null>(null);
  const [lagrer, setLagrer] = useState(false);
  const visId = useId();

  async function lagre(e: React.FormEvent) {
    e.preventDefault();
    setLagrer(true);
    setStatus(null);
    try {
      await lagreKonkurranseprofil(brukerId, { skoleId: skole?.id ?? null, vis });
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
      <Rangeringsvalg id={visId} vis={vis} onEndre={setVis} />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={lagrer}
          className="rounded-xl bg-foreground text-background px-5 py-3 text-sm font-semibold transition-[background-color,scale,opacity] duration-200 hover:bg-black active:scale-[0.98] disabled:opacity-60"
        >
          {lagrer ? "Lagrer …" : "Lagre"}
        </button>
        {status && (
          <p role="status" className={`text-sm ${status.type === "ok" ? "text-success-ink" : "text-danger-ink"}`}>
            {status.tekst}
          </p>
        )}
      </div>
      {demo && <p className="text-xs text-muted">Konkurransen er ikke slått på ennå, så ingenting blir lagret, og skolelista viser bare eksempler.</p>}
    </form>
  );
}

// Brukes også i velkomststegene.
export function Rangeringsvalg({ id, vis, onEndre, mork = false }: { id: string; vis: boolean; onEndre: (v: boolean) => void; mork?: boolean }) {
  return (
    <label htmlFor={id} className="flex items-start gap-3 cursor-pointer">
      <input id={id} type="checkbox" checked={vis} onChange={(e) => onEndre(e.target.checked)} className="mt-1 size-4 accent-primary" />
      <span className="flex flex-col">
        <span className="text-sm font-semibold">Vis fornavnet mitt på rangeringene</span>
        <span className={`text-xs ${mork ? "text-background/60" : "text-muted"}`}>
          Andre elever ser fornavnet og skolen din, aldri e-posten. Du kan slå det av når du vil.
        </span>
      </span>
    </label>
  );
}
