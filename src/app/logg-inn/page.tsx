"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AuthRamme, Felt, Knapp, Melding, useNeste } from "@/components/AuthRamme";
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

  // Allerede innlogget (eller nettopp logget inn): videre dit man skulle.
  useEffect(() => {
    if (bruker) router.replace(neste);
  }, [bruker, neste, router]);

  async function loggInn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setSender(true);
    setFeil(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("epost")).trim(),
      password: String(form.get("passord")),
    });
    setSender(false);
    if (error) setFeil(feilmelding(error));
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
        <Felt label="E-post" name="epost" type="email" autoComplete="email" required autoFocus />
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
