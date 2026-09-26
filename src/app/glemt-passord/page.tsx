"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthRamme, Felt, Knapp, Melding } from "@/components/AuthRamme";
import { Kodesteg } from "@/components/Kodesteg";
import { feilmelding } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

// Glemt passord: e-post → kode på e-post → innlogget → velg nytt passord.
export default function GlemtPassordPage() {
  const router = useRouter();
  const [feil, setFeil] = useState<string | null>(null);
  const [sender, setSender] = useState(false);
  const [epost, setEpost] = useState("");
  const [kodeTil, setKodeTil] = useState<string | null>(null);

  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const adresse = String(new FormData(e.currentTarget).get("epost")).trim();
    setEpost(adresse);
    setSender(true);
    setFeil(null);
    const { error } = await supabase.auth.resetPasswordForEmail(adresse);
    setSender(false);
    if (error) setFeil(feilmelding(error));
    else setKodeTil(adresse);
  }

  if (kodeTil) {
    return (
      <Kodesteg
        epost={kodeTil}
        type="recovery"
        onBekreftet={() => router.replace("/nytt-passord")}
        onTilbake={() => setKodeTil(null)}
      />
    );
  }

  return (
    <AuthRamme
      tittel="Glemt passordet?"
      undertittel="Skriv inn e-posten du registrerte deg med, så sender vi en kode du kan bruke til å lage et nytt."
      bunn={
        <Link href="/logg-inn" className="font-semibold text-primary hover:text-primary-dark">
          Tilbake til innlogging
        </Link>
      }
    >
      <form onSubmit={send} className="flex flex-col gap-5">
        {feil && <Melding type="feil">{feil}</Melding>}
        <Felt label="E-post" name="epost" type="email" autoComplete="email" defaultValue={epost} required autoFocus />
        <Knapp laster={sender}>{sender ? "Sender …" : "Send kode"}</Knapp>
      </form>
    </AuthRamme>
  );
}
