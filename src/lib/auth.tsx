"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { harAbonnement, hentProfil, kanProve, type Profil } from "./profil";
import { supabase } from "./supabase";
import { useHent } from "./useHent";

type AuthState = {
  bruker: User | null;
  laster: boolean;
  // undefined mens profilen hentes, null når ingen er logget inn.
  profil: Profil | null | undefined;
  // Henter profilen på nytt, f.eks. etter at et abonnement er kjøpt.
  oppfriskProfil: () => Promise<Profil | null>;
};

const AuthContext = createContext<AuthState>({
  bruker: null,
  laster: true,
  profil: undefined,
  oppfriskProfil: async () => null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [okt, setOkt] = useState<{ bruker: User | null; laster: boolean }>({ bruker: null, laster: true });
  const brukerId = okt.bruker?.id ?? null;
  const forste = useHent(brukerId ? `profil:${brukerId}` : null, hentProfil);
  const [oppdatert, setOppdatert] = useState<{ brukerId: string; profil: Profil } | null>(null);

  useEffect(() => {
    // onAuthStateChange sender INITIAL_SESSION med en gang, også når økten
    // kommer fra en bekreftelses- eller tilbakestillingslenke i adressen.
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setOkt({ bruker: session?.user ?? null, laster: false });
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const oppfriskProfil = useCallback(async () => {
    if (!brukerId) return null;
    const p = await hentProfil().catch(() => null);
    if (p) setOppdatert({ brukerId, profil: p });
    return p;
  }, [brukerId]);

  const profil = !brukerId
    ? null
    : oppdatert?.brukerId === brukerId
      ? oppdatert.profil
      : forste.laster
        ? undefined
        : (forste.data ?? null);

  const verdi = useMemo(
    () => ({ bruker: okt.bruker, laster: okt.laster, profil, oppfriskProfil }),
    [okt, profil, oppfriskProfil]
  );
  return <AuthContext.Provider value={verdi}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

// Hva eleven har tilgang til. Så lenge laster er true, vet vi det ikke ennå –
// vis ikke lås før det er avklart.
export function useTilgang() {
  const { bruker, laster, profil } = useAuth();
  return {
    laster: laster || (!!bruker && profil === undefined),
    innlogget: !!bruker,
    abonnement: harAbonnement(profil),
    kanProve: kanProve(profil),
  };
}

export function initialer(bruker: User) {
  const navn = (bruker.user_metadata?.navn as string | undefined)?.trim();
  if (navn) {
    const deler = navn.split(/\s+/);
    return (deler[0][0] + (deler.length > 1 ? deler[deler.length - 1][0] : "")).toUpperCase();
  }
  return (bruker.email ?? "?").slice(0, 2).toUpperCase();
}

// Supabase sine feilmeldinger er på engelsk – vis dem på norsk.
export function feilmelding(error: { code?: string; message: string }): string {
  switch (error.code) {
    case "invalid_credentials":
      return "Feil e-post eller passord.";
    case "email_not_confirmed":
      return "Du må bekrefte e-posten din først. Sjekk innboksen (og søppelposten).";
    case "user_already_exists":
    case "email_exists":
      return "Det finnes allerede en konto med denne e-posten. Prøv å logge inn.";
    case "otp_expired":
      return "Koden er feil eller utløpt. Sjekk sifrene, eller be om en ny kode.";
    case "otp_disabled":
      return "Innlogging med kode er ikke slått på.";
    case "weak_password":
      return "Passordet er for svakt. Bruk minst 8 tegn.";
    case "same_password":
      return "Det nye passordet må være forskjellig fra det gamle.";
    case "email_address_invalid":
      return "E-postadressen ser ikke gyldig ut.";
    case "email_address_not_authorized":
      return "Vi kan ikke sende e-post til denne adressen ennå. Prøv igjen senere.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "For mange forsøk på kort tid. Vent litt og prøv igjen.";
    case "signup_disabled":
      return "Registrering er stengt akkurat nå.";
  }
  if (error.message === "Failed to fetch") return "Fikk ikke kontakt med serveren. Sjekk nettet.";
  return "Noe gikk galt. Prøv igjen.";
}
