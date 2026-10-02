"use client";

import { useEffect, useRef, useState } from "react";
import { Flag } from "@/components/icons";
import { GRUNNER, sendRapport, type Rapportgrunn, type Rapporttype } from "@/lib/rapporter";

const JUSTER = { midt: "items-center justify-center", venstre: "items-start justify-start", hoyre: "items-end justify-end" };

// «Rapporter»: eleven sier fra om et kort eller spørsmål. Valgene vises rett
// under knappen i stedet for i en meny som svever, så det virker likt på mobil.
// Gi komponenten key={nokkel}, så den nullstilles for hvert nye kort.
export function Rapporter({
  temaId,
  type,
  nokkel,
  plassering = "midt",
}: {
  temaId: string;
  type: Rapporttype;
  nokkel: string;
  plassering?: keyof typeof JUSTER;
}) {
  const [apen, setApen] = useState(false);
  const [status, setStatus] = useState<"klar" | "sender" | "sendt" | "feil">("klar");
  const rot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!apen) return;
    const utenfor = (e: PointerEvent) => {
      if (!rot.current?.contains(e.target as Node)) setApen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setApen(false);
    };
    document.addEventListener("pointerdown", utenfor);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", utenfor);
      document.removeEventListener("keydown", esc);
    };
  }, [apen]);

  async function send(grunn: Rapportgrunn) {
    setStatus("sender");
    try {
      await sendRapport(temaId, type, nokkel, grunn);
      setStatus("sendt");
      setApen(false);
    } catch {
      setStatus("feil");
    }
  }

  if (status === "sendt") {
    return (
      <p role="status" className="text-xs font-medium text-muted py-1">
        Takk! Vi ser på det.
      </p>
    );
  }

  return (
    // data-rapport: øvingenes hurtigtaster (1, 2, Enter …) gjelder ikke her.
    <div ref={rot} data-rapport className={`min-w-0 flex flex-col gap-2 ${JUSTER[plassering]}`}>
      <button
        type="button"
        aria-expanded={apen}
        onClick={() => setApen((v) => !v)}
        className="inline-flex items-center gap-1.5 px-2 py-1 -mx-2 rounded-lg text-xs font-medium text-faint hover:text-foreground transition-colors"
      >
        <Flag size={14} />
        Rapporter
      </button>
      {apen && (
        <div role="group" aria-label="Hva er galt?" className={`flex flex-wrap gap-2 rise-rask ${JUSTER[plassering]}`}>
          {GRUNNER.map((g) => (
            <button
              key={g.id}
              type="button"
              disabled={status === "sender"}
              onClick={() => send(g.id)}
              className="px-3 py-2 rounded-lg border border-border bg-surface text-xs font-semibold hover:border-border-strong transition-[color,background-color,border-color,scale] active:scale-[0.98] disabled:opacity-50"
            >
              {g.tekst}
            </button>
          ))}
        </div>
      )}
      {status === "feil" && (
        <p role="alert" className="text-xs text-danger-ink">
          Fikk ikke sendt rapporten. Prøv igjen.
        </p>
      )}
    </div>
  );
}
