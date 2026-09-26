"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AuthRamme, Felt, Knapp, Melding, useNeste } from "@/components/AuthRamme";
import { Kodesteg } from "@/components/Kodesteg";
import { feilmelding, useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export default function LoggInnPage() {
  return (
    <Suspense>
      <LoggInn />
    </Suspense>
  );
}

function LoggInn() {
  const router = useRouter();
  const neste = useNeste();
  const { bruker } = useAuth();
  const [feil, setFeil] = useState<string | null>(null);
  const [sender, setSender] = useState(false);
  const [epost, setEpost] = useState("");
  const [kodeTil, setKodeTil] = useState<string | null>(null);

  // Allerede innlogget (eller nettopp logget inn): videre dit man skulle.
  useEffect(() => {
    if (bruker) router.replace(neste);
  }, [bruker, neste, router]);

  async function loggInn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const adresse = String(form.get("epost")).trim();
    setEpost(adresse);
    setSender(true);
    setFeil(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: adresse,
      password: String(form.get("passord")),
    });
    if (error?.code === "email_not_confirmed") {
      // Kontoen finnes, men er ikke bekreftet: send en ny kode og la brukeren taste den inn her.
      const { error: sendFeil } = await supabase.auth.resend({ type: "signup", email: adresse });
      setSender(false);
      if (sendFeil) return setFeil(feilmelding(sendFeil));
      return setKodeTil(adresse);
    }
    setSender(false);
    if (error) setFeil(feilmelding(error));
  }

  if (kodeTil) {
    return (
      <Kodesteg
        epost={kodeTil}
        type="signup"
        tittel="Bekreft e-posten din først"
        onBekreftet={() => router.replace(neste)}
        onTilbake={() => setKodeTil(null)}
      />
    );
  }

  const q = neste !== "/fag" ? `?neste=${encodeURIComponent(neste)}` : "";

  return (
    <AuthRamme
      tittel="Logg inn"
      undertittel="Fortsett der du slapp."
      bunn={
        <>
          Har du ikke konto?{" "}
          <Link href={`/registrer${q}`} className="font-semibold text-primary hover:text-primary-dark">
            Lag en her
          </Link>
        </>
      }
    >
      <form onSubmit={loggInn} className="flex flex-col gap-5">
        {feil && <Melding type="feil">{feil}</Melding>}
        <Felt label="E-post" name="epost" type="email" autoComplete="email" defaultValue={epost} required autoFocus />
        <div className="flex flex-col gap-2">
          <Felt label="Passord" name="passord" type="password" autoComplete="current-password" required />
          <Link
            href="/glemt-passord"
            className="self-end text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            Glemt passordet?
          </Link>
        </div>
        <Knapp laster={sender}>{sender ? "Logger inn …" : "Logg inn"}</Knapp>
      </form>
    </AuthRamme>
  );
}
