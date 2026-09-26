"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthRamme, Felt, Knapp, Melding } from "@/components/AuthRamme";
import { Laster } from "@/components/Tilstand";
import { feilmelding, useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

// Velg nytt passord. Hit kommer man fra kontosiden, eller etter å ha bekreftet
// koden fra «glemt passord» (koden logger brukeren inn).
export default function NyttPassordPage() {
  const router = useRouter();
  const { bruker, laster } = useAuth();
  const [feil, setFeil] = useState<string | null>(null);
  const [sender, setSender] = useState(false);

  async function lagre(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const passord = String(form.get("passord"));
    if (passord.length < 8) return setFeil("Passordet må ha minst 8 tegn.");
    if (passord !== String(form.get("gjenta"))) return setFeil("Passordene er ikke like.");
    setSender(true);
    setFeil(null);
    const { error } = await supabase.auth.updateUser({ password: passord });
    setSender(false);
    if (error) setFeil(feilmelding(error));
    else router.replace("/fag");
  }

  if (laster) return <Laster tekst="Sjekker innloggingen" />;

  if (!bruker) {
    return (
      <AuthRamme
        tittel="Du er ikke logget inn"
        undertittel="Har du glemt passordet, kan du få en kode på e-post og lage et nytt."
        bunn={
          <Link href="/glemt-passord" className="font-semibold text-primary hover:text-primary-dark">
            Få en kode på e-post
          </Link>
        }
      />
    );
  }

  return (
    <AuthRamme tittel="Lag nytt passord" undertittel={`For ${bruker.email}.`}>
      <form onSubmit={lagre} className="flex flex-col gap-5">
        {feil && <Melding type="feil">{feil}</Melding>}
        <Felt
          label="Nytt passord"
          name="passord"
          type="password"
          autoComplete="new-password"
          minLength={8}
          hjelp="Minst 8 tegn."
          required
          autoFocus
        />
        <Felt label="Gjenta passordet" name="gjenta" type="password" autoComplete="new-password" required />
        <Knapp laster={sender}>{sender ? "Lagrer …" : "Lagre passord"}</Knapp>
      </form>
    </AuthRamme>
  );
}
