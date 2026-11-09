"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { Close } from "@/components/icons";
import {
  hentKonkurranseprofil,
  lagreKonkurranseprofil,
  sokSkoler,
  type Konkurranseprofil as Profil,
  type Skole,
} from "@/lib/konkurranse";
import { useHent } from "@/lib/useHent";

// På kontosiden: kallenavn, skole og om eleven vil være synlig på rangeringene.
// Det er av som standard. Andre ser bare kallenavnet og skolen – aldri navn eller e-post.
export function Konkurranseprofil({ brukerId }: { brukerId: string }) {
  const lagret = useHent(`konkurranseprofil:${brukerId}`, () => hentKonkurranseprofil(brukerId));

  return (
    <section id="konkurranse" aria-labelledby="konkurranse-tittel" className="scroll-mt-24 border-t border-border pt-8 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 id="konkurranse-tittel" className="font-display text-xl font-semibold">
          Konkurranse
        </h2>
        <p className="text-sm text-ink-soft leading-relaxed max-w-[56ch]">
          Velg et kallenavn og skolen din for å være med på rangeringene. Andre ser bare kallenavnet og skolen, aldri
          navnet eller e-posten din.{" "}
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
  const [kallenavn, setKallenavn] = useState(start.kallenavn ?? "");
  const [skole, setSkole] = useState<Skole | null>(start.skole);
  const [vis, setVis] = useState(start.vis);
  const [status, setStatus] = useState<{ type: "ok" | "feil"; tekst: string } | null>(null);
  const [lagrer, setLagrer] = useState(false);
  const kallenavnId = useId();
  const visId = useId();
  const kanVises = kallenavn.trim().length >= 3;

  async function lagre(e: React.FormEvent) {
    e.preventDefault();
    setLagrer(true);
    setStatus(null);
    try {
      await lagreKonkurranseprofil(brukerId, { kallenavn, skoleId: skole?.id ?? null, vis });
      setStatus({ type: "ok", tekst: vis && kanVises ? "Lagret. Du er med på rangeringene." : "Lagret." });
    } catch (err) {
      setStatus({ type: "feil", tekst: (err as Error).message });
    } finally {
      setLagrer(false);
    }
  }

  return (
    <form onSubmit={lagre} className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={kallenavnId} className="text-sm font-semibold">
          Kallenavn
        </label>
        <input
          id={kallenavnId}
          value={kallenavn}
          onChange={(e) => setKallenavn(e.target.value)}
          maxLength={20}
          autoComplete="off"
          placeholder="For eksempel Formelfrid"
          className="rounded-xl border-[1.5px] border-border-strong bg-background px-4 py-3 text-[15px] focus:border-primary outline-none"
        />
        <span className="text-xs text-muted">3–20 tegn. Ikke bruk ditt fulle navn.</span>
      </div>

      <Skolevelger valgt={skole} onVelg={setSkole} />

      <label htmlFor={visId} className="flex items-start gap-3 cursor-pointer">
        <input
          id={visId}
          type="checkbox"
          checked={vis && kanVises}
          disabled={!kanVises}
          onChange={(e) => setVis(e.target.checked)}
          className="mt-1 size-4 accent-primary"
        />
        <span className="flex flex-col">
          <span className="text-sm font-semibold">Vis meg på rangeringene</span>
          <span className="text-xs text-muted">
            {kanVises ? "Du kan slå det av igjen når du vil." : "Velg et kallenavn først."}
          </span>
        </span>
      </label>

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

// Søk i skolelista (Nasjonalt skoleregister): skriv minst to bokstaver.
function Skolevelger({ valgt, onVelg }: { valgt: Skole | null; onVelg: (s: Skole | null) => void }) {
  const [sok, setSok] = useState("");
  const [treff, setTreff] = useState<Skole[]>([]);
  const sokId = useId();
  const listeId = useId();

  useEffect(() => {
    let aktiv = true;
    const t = window.setTimeout(() => {
      sokSkoler(sok).then(
        (s) => aktiv && setTreff(s),
        () => aktiv && setTreff([]),
      );
    }, 200);
    return () => {
      aktiv = false;
      window.clearTimeout(t);
    };
  }, [sok]);

  if (valgt) {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">Skole</span>
        <span className="flex items-center justify-between gap-3 rounded-xl border-[1.5px] border-border-strong bg-background px-4 py-3">
          <span className="flex flex-col min-w-0">
            <span className="text-[15px] font-semibold truncate">{valgt.navn}</span>
            <span className="text-xs text-muted">{valgt.kommune}</span>
          </span>
          <button
            type="button"
            onClick={() => onVelg(null)}
            aria-label="Fjern skolen"
            className="shrink-0 rounded-lg p-1.5 text-muted hover:text-foreground hover:bg-sunken transition-colors duration-200"
          >
            <Close size={16} />
          </button>
        </span>
      </div>
    );
  }

  const visListe = sok.trim().length >= 2;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={sokId} className="text-sm font-semibold">
        Skole <span className="font-normal text-muted">(valgfritt)</span>
      </label>
      <input
        id={sokId}
        value={sok}
        onChange={(e) => setSok(e.target.value)}
        role="combobox"
        aria-expanded={visListe}
        aria-controls={listeId}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder="Søk etter skolen din"
        className="rounded-xl border-[1.5px] border-border-strong bg-background px-4 py-3 text-[15px] focus:border-primary outline-none"
      />
      {visListe && (
        <ul id={listeId} role="listbox" className="rounded-xl border border-border bg-background max-h-64 overflow-auto">
          {treff.length ? (
            treff.map((s) => (
              <li key={s.id} role="option" aria-selected={false}>
                <button
                  type="button"
                  onClick={() => {
                    onVelg(s);
                    setSok("");
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-sunken transition-colors duration-150"
                >
                  <span className="block text-[15px] font-semibold">{s.navn}</span>
                  <span className="block text-xs text-muted">{s.kommune}</span>
                </button>
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-sm text-muted">Fant ingen skole med det navnet.</li>
          )}
        </ul>
      )}
    </div>
  );
}
