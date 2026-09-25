"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AuthRamme, Felt, Knapp, Melding, useNeste } from "@/components/AuthRamme";
import { feilmelding, useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export default function RegistrerPage() {
  return (
    <Suspense>
      <Registrer />
    </Suspense>
  );
}

function Registrer() {
  const router = useRouter();
  const neste = useNeste();
  const { bruker } = useAuth();
  const [feil, setFeil] = useState<string | null>(null);
  const [sender, setSender] = useState(false);
  const [sendtTil, setSendtTil] = useState<string | null>(null);

  useEffect(() => {
    if (bruker) router.replace(neste);
  }, [bruker, neste, router]);

  async function registrer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const epost = String(form.get("epost")).trim();
    const passord = String(form.get("passord"));
    if (passord.length < 8) {
      setFeil("Passordet må ha minst 8 tegn.");
      return;
    }
    setSender(true);
    setFeil(null);
    const { data, error } = await supabase.auth.signUp({
      email: epost,
      password: passord,
      options: {
        data: { navn: String(form.get("navn")).trim() },
        emailRedirectTo: window.location.origin + neste,
      },
    });
    setSender(false);
    if (error) return setFeil(feilmelding(error));
    // Når e-posten allerede er i bruk, svarer Supabase med en bruker uten
    // identiteter (for ikke å avsløre hvem som har konto).
    if (data.user && data.user.identities?.length === 0) {
      return setFeil(feilmelding({ code: "user_already_exists", message: "" }));
    }
    // Uten e-postbekreftelse er man logget inn med en gang (effekten over sender videre).
    if (!data.session) setSendtTil(epost);
  }

  const q = neste !== "/fag" ? `?neste=${encodeURIComponent(neste)}` : "";

  if (sendtTil) {
    return (
      <AuthRamme
        tittel="Sjekk e-posten din"
        undertittel={
          <>
            Vi har sendt en lenke til <strong className="font-semibold text-foreground">{sendtTil}</strong>.
            Trykk på den for å bekrefte kontoen, så er du i gang.
          </>
        }
        bunn={
          <>
            Fikk du ingen e-post? Sjekk søppelposten, eller{" "}
            <button
              onClick={() => setSendtTil(null)}
              className="font-semibold text-primary hover:text-primary-dark"
            >
              prøv en annen adresse
            </button>
            .
          </>
        }
      />
    );
  }

  return (
    <AuthRamme
      tittel="Lag konto"
      undertittel="Gratis å opprette, og det tar under ett minutt."
      bunn={
        <>
          Har du allerede konto?{" "}
          <Link href={`/logg-inn${q}`} className="font-semibold text-primary hover:text-primary-dark">
            Logg inn
          </Link>
        </>
      }
    >
      <form onSubmit={registrer} className="flex flex-col gap-5">
        {feil && <Melding type="feil">{feil}</Melding>}
        <Felt label="Fornavn" name="navn" autoComplete="given-name" required autoFocus />
        <Felt label="E-post" name="epost" type="email" autoComplete="email" required />
        <Felt
          label="Passord"
          name="passord"
          type="password"
          autoComplete="new-password"
          minLength={8}
          hjelp="Minst 8 tegn."
          required
        />
        <Knapp laster={sender}>{sender ? "Lager konto …" : "Lag konto"}</Knapp>
      </form>
    </AuthRamme>
  );
}
