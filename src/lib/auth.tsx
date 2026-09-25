"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

type AuthState = { bruker: User | null; laster: boolean };

const AuthContext = createContext<AuthState>({ bruker: null, laster: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ bruker: null, laster: true });

  useEffect(() => {
    // onAuthStateChange sender INITIAL_SESSION med en gang, også når økten
    // kommer fra en bekreftelses- eller tilbakestillingslenke i adressen.
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ bruker: session?.user ?? null, laster: false });
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

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
