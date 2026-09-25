"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthRamme, Felt, Knapp, Melding } from "@/components/AuthRamme";
import { feilmelding } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export default function GlemtPassordPage() {
  const [feil, setFeil] = useState<string | null>(null);
  const [sender, setSender] = useState(false);
  const [sendtTil, setSendtTil] = useState<string | null>(null);

  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const epost = String(new FormData(e.currentTarget).get("epost")).trim();
    setSender(true);
    setFeil(null);
    const { error } = await supabase.auth.resetPasswordForEmail(epost, {
      redirectTo: window.location.origin + "/nytt-passord",
    });
    setSender(false);
    if (error) setFeil(feilmelding(error));
    else setSendtTil(epost);
  }

  const tilbake = (
    <Link href="/logg-inn" className="font-semibold text-primary hover:text-primary-dark">
      Tilbake til innlogging
    </Link>
  );

  if (sendtTil) {
    return (
      <AuthRamme
        tittel="Sjekk e-posten din"
        undertittel={
          <>
            Hvis det finnes en konto for{" "}
            <strong className="font-semibold text-foreground">{sendtTil}</strong>, har vi sendt en
            lenke for å lage nytt passord.
          </>
        }
        bunn={tilbake}
      />
    );
  }

  return (
    <AuthRamme
      tittel="Glemt passordet?"
      undertittel="Skriv inn e-posten du registrerte deg med, så sender vi en lenke for å lage et nytt."
      bunn={tilbake}
    >
      <form onSubmit={send} className="flex flex-col gap-5">
        {feil && <Melding type="feil">{feil}</Melding>}
        <Felt label="E-post" name="epost" type="email" autoComplete="email" required autoFocus />
        <Knapp laster={sender}>{sender ? "Sender …" : "Send lenke"}</Knapp>
      </form>
    </AuthRamme>
  );
}
