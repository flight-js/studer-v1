"use client";

import Link from "next/link";
import { useState } from "react";
import { AppBar } from "@/components/AppBar";
import { ArrowRight, Check } from "@/components/icons";
import { KreverInnlogging, Laster } from "@/components/Tilstand";
import { useAuth } from "@/lib/auth";
import { FORSLAG_MAKS, FORSLAG_MIN, FORSLAGSTYPER, Forslagsfeil, sendForslag, type Forslagstype } from "@/lib/forslag";

export default function ForslagPage() {
  const { bruker, laster } = useAuth();
  return (
    <div className="flex flex-col flex-1">
      <AppBar back="/" backLabel="Hjem" />
      {laster ? (
        <Laster />
      ) : !bruker ? (
        <KreverInnlogging tittel="Logg inn for å sende forslag" tekst="Du trenger en konto for å sende oss forslag." />
      ) : (
        <Skjema />
      )}
    </div>
  );
}

function Skjema() {
  const [type, setType] = useState<Forslagstype>("innhold");
  const [tekst, setTekst] = useState("");
  const [sender, setSender] = useState(false);
  const [feil, setFeil] = useState<string | null>(null);
  const [sendt, setSendt] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (tekst.trim().length < FORSLAG_MIN) {
      setFeil("Skriv litt mer, så vi forstår hva du mener.");
      return;
    }
    setSender(true);
    setFeil(null);
    try {
      await sendForslag(type, tekst);
      setSendt(true);
      setTekst("");
    } catch (e) {
      setFeil(e instanceof Forslagsfeil ? e.message : "Fikk ikke sendt forslaget. Prøv igjen.");
    } finally {
      setSender(false);
    }
  }

  if (sendt) {
    return (
      <main id="innhold" className="flex-1 flex flex-col items-center justify-center gap-5 px-5 py-24 text-center rise">
        <span className="w-12 h-12 rounded-full bg-success text-white flex items-center justify-center">
          <Check size={22} />
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.02em]">Takk for forslaget!</h1>
        <p className="text-lg text-ink-soft max-w-[40ch]">Vi leser alle forslag, og bruker dem når vi bestemmer hva vi skal lage.</p>
        <div className="flex flex-wrap justify-center gap-3 mt-1">
          <button
            onClick={() => setSendt(false)}
            className="inline-flex items-center border-[1.5px] border-border-strong px-5 py-3.5 rounded-xl text-sm font-semibold hover:border-foreground transition-colors active:scale-[0.98]"
          >
            Send et nytt forslag
          </button>
          <Link
            href="/"
            className="group inline-flex items-center gap-2 bg-primary text-white px-5 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98]"
          >
            Fortsett å øve
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main id="innhold" className="px-5 sm:px-8 pt-10 sm:pt-14 pb-20 w-full max-w-2xl mx-auto flex flex-col gap-8 rise">
      <div className="flex flex-col gap-3">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.02em]">Send et forslag</h1>
        <p className="text-lg text-ink-soft max-w-[48ch]">
          Savner du et fag, et tema eller en funksjon? Eller er det noe som kan bli bedre? Vi leser alt.
        </p>
      </div>

      <form onSubmit={send} className="flex flex-col gap-6">
        <fieldset className="flex flex-col gap-3">
          <legend className="text-sm font-semibold mb-3">Hva gjelder det?</legend>
          <div className="flex flex-wrap gap-2">
            {FORSLAGSTYPER.map((t) => (
              <label
                key={t.id}
                className={`cursor-pointer px-4 py-2.5 rounded-xl border-[1.5px] text-sm font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary ${
                  type === t.id
                    ? "bg-primary-tint border-primary text-primary-dark"
                    : "bg-surface border-border hover:border-border-strong"
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value={t.id}
                  checked={type === t.id}
                  onChange={() => setType(t.id)}
                  className="sr-only"
                />
                {t.tekst}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-2">
          <label htmlFor="forslag" className="text-sm font-semibold">
            Forslaget ditt
          </label>
          <textarea
            id="forslag"
            value={tekst}
            onChange={(e) => setTekst(e.target.value)}
            maxLength={FORSLAG_MAKS}
            rows={6}
            required
            placeholder={
              type === "innhold"
                ? "For eksempel: «Kan dere lage tysk for Vg3?» eller «Temaet om fotosyntese mangler celleånding.»"
                : "Skriv så konkret du kan."
            }
            className="w-full min-h-40 resize-y field-sizing-content bg-surface border-[1.5px] border-border rounded-xl px-4 py-3 text-base leading-relaxed placeholder:text-faint focus:border-primary transition-colors"
          />
          <p className="text-xs text-muted">Ikke skriv personopplysninger om deg selv eller andre.</p>
        </div>

        {feil && (
          <p role="alert" className="text-sm font-medium text-danger-ink bg-danger-tint rounded-xl px-4 py-3">
            {feil}
          </p>
        )}

        <button
          type="submit"
          disabled={sender}
          className="self-start inline-flex items-center gap-2 bg-primary text-white px-6 py-4 rounded-xl text-base font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98] disabled:opacity-60"
        >
          {sender ? "Sender …" : "Send forslaget"}
        </button>
      </form>
    </main>
  );
}
