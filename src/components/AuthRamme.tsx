"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/Logo";

// Felles ramme og skjemafelt for innlogging, registrering og passord.

export function AuthRamme({
  tittel,
  undertittel,
  children,
  bunn,
}: {
  tittel: string;
  undertittel?: React.ReactNode;
  children?: React.ReactNode;
  bunn?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1">
      <header className="max-w-5xl w-full mx-auto px-5 sm:px-8 h-16 flex items-center">
        <Link href="/" aria-label="Studer – forsiden" className="rounded-md">
          <Logo className="text-2xl" />
        </Link>
      </header>
      <main id="innhold" className="flex-1 flex flex-col items-center px-5 pt-8 sm:pt-16 pb-20">
        <div className="w-full max-w-[26rem] flex flex-col gap-8 rise">
          <div className="flex flex-col gap-2.5">
            <h1 className="font-display text-4xl font-semibold tracking-[-0.02em]">{tittel}</h1>
            {undertittel && <p className="text-ink-soft leading-relaxed">{undertittel}</p>}
          </div>
          {children}
          {bunn && <p className="text-sm text-muted text-center">{bunn}</p>}
        </div>
      </main>
    </div>
  );
}

export function Felt({
  label,
  hjelp,
  ...input
}: { label: string; hjelp?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = input.id ?? input.name;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        {...input}
        className="bg-surface border-[1.5px] border-border rounded-xl px-4 py-3 text-base placeholder:text-faint hover:border-border-strong focus:border-primary focus:outline-none transition-colors duration-200"
      />
      {hjelp && <span className="text-xs text-muted">{hjelp}</span>}
    </div>
  );
}

export function Knapp({
  laster,
  deaktivert,
  children,
}: {
  laster?: boolean;
  deaktivert?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={laster || deaktivert}
      className={`mt-1 inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-3.5 rounded-xl text-base font-semibold hover:bg-primary-dark transition-[background-color,transform,opacity] duration-200 active:scale-[0.98] disabled:opacity-60 disabled:hover:bg-primary ${laster ? "cursor-wait" : "disabled:cursor-not-allowed"}`}
    >
      {children}
    </button>
  );
}

export function Melding({ type, children }: { type: "feil" | "ok"; children: React.ReactNode }) {
  return (
    <div
      role={type === "feil" ? "alert" : "status"}
      className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
        type === "feil" ? "bg-danger-tint text-danger-ink" : "bg-success-tint text-success-ink"
      }`}
    >
      {children}
    </div>
  );
}

// Hvor man sendes etter innlogging. Bare lokale stier godtas.
export function useNeste(standard = "/fag") {
  const neste = useSearchParams().get("neste");
  return neste && neste.startsWith("/") && !neste.startsWith("//") ? neste : standard;
}
