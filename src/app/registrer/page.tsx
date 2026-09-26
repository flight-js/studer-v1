"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AuthRamme, Felt, Knapp, Melding, useNeste } from "@/components/AuthRamme";
import { Kodesteg } from "@/components/Kodesteg";
import { feilmelding, useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export default function RegistrerPage() {
  return (
    <Suspense>
      <Registrer />
    </Suspense>
  );
}

// To steg: først navn, e-post og passord, deretter koden som sendes på e-post.
function Registrer() {
  const router = useRouter();
  const neste = useNeste();
  const { bruker } = useAuth();
  const [feil, setFeil] = useState<string | null>(null);
  const [sender, setSender] = useState(false);
  const [skjema, setSkjema] = useState({ navn: "", epost: "" });
  const [kodeTil, setKodeTil] = useState<string | null>(null);

  // Innlogget (også rett etter at koden er bekreftet): videre dit man skulle.
  useEffect(() => {
    if (bruker) router.replace(neste);
  }, [bruker, neste, router]);

  async function registrer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const navn = String(form.get("navn")).trim();
    const epost = String(form.get("epost")).trim();
    const passord = String(form.get("passord"));
    setSkjema({ navn, epost });
    if (passord.length < 8) return setFeil("Passordet må ha minst 8 tegn.");

    setSender(true);
    setFeil(null);
    const { data, error } = await supabase.auth.signUp({
      email: epost,
      password: passord,
      options: { data: { navn } },
    });
    setSender(false);
    if (error) return setFeil(feilmelding(error));
    // Når e-posten allerede har en bekreftet konto, svarer Supabase med en
    // bruker uten identiteter og sender ingen kode.
    if (data.user && data.user.identities?.length === 0) {
      return setFeil(feilmelding({ code: "user_already_exists", message: "" }));
    }
    // Er e-postbekreftelse slått av, er man logget inn med en gang (effekten over sender videre).
    if (!data.session) setKodeTil(epost);
  }

  if (kodeTil) {
    return (
      <Kodesteg
        epost={kodeTil}
        type="signup"
        tittel="Bekreft e-posten din"
        onBekreftet={() => router.replace(neste)}
        onTilbake={() => setKodeTil(null)}
      />
    );
  }

  const q = neste !== "/fag" ? `?neste=${encodeURIComponent(neste)}` : "";

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
        <Felt label="Fornavn" name="navn" autoComplete="given-name" defaultValue={skjema.navn} required autoFocus />
        <Felt label="E-post" name="epost" type="email" autoComplete="email" defaultValue={skjema.epost} required />
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
