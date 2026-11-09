"use client";

import { useEffect, useId, useState } from "react";
import { Close } from "@/components/icons";
import { sokSkoler, type Skole } from "@/lib/konkurranse";

// Søk i skolelista (Nasjonalt skoleregister): skriv minst to bokstaver, velg
// fra lista. Brukes på kontosiden, på startsiden og i velkomststegene.
// mork: på mørk bakgrunn.
export function Skolevelger({
  valgt,
  onVelg,
  etikett = "Skole",
  mork = false,
}: {
  valgt: Skole | null;
  onVelg: (s: Skole | null) => void;
  etikett?: string;
  mork?: boolean;
}) {
  const [sok, setSok] = useState("");
  const [treff, setTreff] = useState<Skole[]>([]);
  const [leter, setLeter] = useState(false);
  const sokId = useId();
  const listeId = useId();

  useEffect(() => {
    let aktiv = true;
    const t = window.setTimeout(() => {
      if (sok.trim().length < 2) return setTreff([]);
      setLeter(true);
      sokSkoler(sok)
        .then(
          (s) => aktiv && setTreff(s),
          () => aktiv && setTreff([]),
        )
        .finally(() => aktiv && setLeter(false));
    }, 200);
    return () => {
      aktiv = false;
      window.clearTimeout(t);
    };
  }, [sok]);

  const felt = mork
    ? "border-natt-linje bg-natt-hevet text-background placeholder:text-background/45 focus:border-merke"
    : "border-border-strong bg-background placeholder:text-faint focus:border-primary";
  const dempet = mork ? "text-background/60" : "text-muted";

  if (valgt) {
    return (
      <div className="flex flex-col gap-1.5">
        {etikett && <span className="text-sm font-semibold">{etikett}</span>}
        <span className={`rise-rask flex items-center justify-between gap-3 rounded-xl border-[1.5px] px-4 py-3 ${felt}`}>
          <span className="flex flex-col min-w-0">
            <span className="text-[15px] font-semibold truncate">{valgt.navn}</span>
            <span className={`text-xs ${dempet}`}>{valgt.kommune}</span>
          </span>
          <button
            type="button"
            onClick={() => onVelg(null)}
            aria-label="Velg en annen skole"
            className={`shrink-0 rounded-lg p-1.5 transition-colors duration-200 ${mork ? "text-background/60 hover:text-background hover:bg-natt" : "text-muted hover:text-foreground hover:bg-sunken"}`}
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
      {etikett && (
        <label htmlFor={sokId} className="text-sm font-semibold">
          {etikett}
        </label>
      )}
      <input
        id={sokId}
        value={sok}
        onChange={(e) => setSok(e.target.value)}
        role="combobox"
        aria-label={etikett ? undefined : "Søk etter skolen din"}
        aria-expanded={visListe}
        aria-controls={listeId}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder="Søk etter skolen din"
        className={`rounded-xl border-[1.5px] px-4 py-3 text-[15px] outline-none transition-colors duration-200 ${felt}`}
      />
      {visListe && (
        <ul
          id={listeId}
          role="listbox"
          className={`rise-rask rounded-xl border max-h-64 overflow-auto ${mork ? "border-natt-linje bg-natt-hevet" : "border-border bg-background"}`}
        >
          {treff.length ? (
            treff.map((s) => (
              <li key={s.id} role="option" aria-selected={false}>
                <button
                  type="button"
                  onClick={() => {
                    onVelg(s);
                    setSok("");
                  }}
                  className={`w-full text-left px-4 py-2.5 transition-colors duration-150 ${mork ? "hover:bg-natt" : "hover:bg-sunken"}`}
                >
                  <span className="block text-[15px] font-semibold">{s.navn}</span>
                  <span className={`block text-xs ${dempet}`}>{s.kommune}</span>
                </button>
              </li>
            ))
          ) : (
            <li className={`px-4 py-3 text-sm ${dempet}`}>{leter ? "Søker …" : "Fant ingen skole med det navnet."}</li>
          )}
        </ul>
      )}
    </div>
  );
}
