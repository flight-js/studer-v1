"use client";

import { useEffect, useRef, useState } from "react";
import { AuthRamme, Knapp, Melding } from "@/components/AuthRamme";
import { feilmelding } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

// Må stemme med «Email OTP Length» i Supabase (standard er 6).
const KODELENGDE = 6;
// Supabase tillater ny e-post til samme adresse først etter 60 sekunder.
const VENT_SEKUNDER = 60;

/**
 * Andre steg i registrering, innlogging og glemt passord: brukeren taster inn
 * koden fra e-posten. verifyOtp() logger brukeren inn direkte i nettleseren,
 * så det trengs ingen lenke eller serverside.
 */
export function Kodesteg({
  epost,
  type,
  tittel = "Sjekk e-posten din",
  onBekreftet,
  onTilbake,
}: {
  epost: string;
  type: "signup" | "recovery";
  tittel?: string;
  onBekreftet: () => void;
  onTilbake: () => void;
}) {
  const [kode, setKode] = useState("");
  const [feil, setFeil] = useState<string | null>(null);
  const [melding, setMelding] = useState<string | null>(null);
  const [sjekker, setSjekker] = useState(false);
  const [vent, setVent] = useState(VENT_SEKUNDER);
  const sendt = useRef(false);

  useEffect(() => {
    if (vent <= 0) return;
    const t = setTimeout(() => setVent((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [vent]);

  async function bekreft(verdi: string) {
    if (sendt.current || verdi.length < KODELENGDE) return;
    sendt.current = true;
    setSjekker(true);
    setFeil(null);
    setMelding(null);
    const { error } = await supabase.auth.verifyOtp({ email: epost, token: verdi, type });
    setSjekker(false);
    sendt.current = false;
    if (error) {
      setFeil(feilmelding(error));
      setKode("");
      return;
    }
    onBekreftet();
  }

  async function sendPaNytt() {
    setFeil(null);
    setMelding(null);
    const { error } =
      type === "signup"
        ? await supabase.auth.resend({ type: "signup", email: epost })
        : await supabase.auth.resetPasswordForEmail(epost);
    if (error) return setFeil(feilmelding(error));
    setMelding("Ny kode er sendt.");
    setVent(VENT_SEKUNDER);
  }

  return (
    <AuthRamme
      tittel={tittel}
      undertittel={
        <>
          Vi har sendt en kode på {KODELENGDE} sifre til{" "}
          <strong className="font-semibold text-foreground break-all">{epost}</strong>. Den er gyldig i
          10 minutter.
        </>
      }
      bunn={
        <>
          Feil adresse?{" "}
          <button onClick={onTilbake} className="font-semibold text-primary hover:text-primary-dark">
            Gå tilbake
          </button>
        </>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          bekreft(kode);
        }}
        className="flex flex-col gap-5"
      >
        {feil && <Melding type="feil">{feil}</Melding>}
        {melding && <Melding type="ok">{melding}</Melding>}
        <div className="flex flex-col gap-2">
          <label htmlFor="kode" className="text-sm font-semibold">
            Kode
          </label>
          <input
            id="kode"
            name="kode"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            maxLength={KODELENGDE}
            autoFocus
            required
            value={kode}
            onChange={(e) => {
              const verdi = e.target.value.replace(/\D/g, "").slice(0, KODELENGDE);
              setKode(verdi);
              // Send automatisk når alle sifrene er tastet inn eller limt inn.
              if (verdi.length === KODELENGDE) bekreft(verdi);
            }}
            placeholder={"·".repeat(KODELENGDE)}
            className="bg-surface border-[1.5px] border-border rounded-xl px-4 py-3.5 text-center font-display text-3xl font-semibold tracking-[0.45em] tabular-nums placeholder:text-border-strong hover:border-border-strong focus:border-primary focus:outline-none transition-colors duration-200"
          />
        </div>
        <Knapp laster={sjekker} deaktivert={kode.length < KODELENGDE}>{sjekker ? "Sjekker koden …" : "Bekreft"}</Knapp>
        <p className="text-sm text-muted text-center">
          Fikk du ingen kode? Sjekk søppelposten, eller{" "}
          {vent > 0 ? (
            <span className="tabular-nums">send en ny om {vent} s.</span>
          ) : (
            <button type="button" onClick={sendPaNytt} className="font-semibold text-primary hover:text-primary-dark">
              send en ny kode
            </button>
          )}
        </p>
      </form>
    </AuthRamme>
  );
}
