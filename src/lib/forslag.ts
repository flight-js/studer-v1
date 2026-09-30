// Forslag fra brukerne: nytt innhold, nye funksjoner og forbedringer.
// Innloggede kan sende inn, men ikke lese (se migrasjonen forslag_og_opprydding).
// Forslagene leses med `npm run forslag`.

import { supabase } from "./supabase";

export type Forslagstype = "innhold" | "funksjon" | "forbedring" | "annet";

export const FORSLAGSTYPER: { id: Forslagstype; tekst: string }[] = [
  { id: "innhold", tekst: "Nytt fag eller tema" },
  { id: "funksjon", tekst: "Ny funksjon" },
  { id: "forbedring", tekst: "Noe som kan bli bedre" },
  { id: "annet", tekst: "Annet" },
];

export const FORSLAG_MIN = 5;
export const FORSLAG_MAKS = 2000;

export class Forslagsfeil extends Error {}

export async function sendForslag(type: Forslagstype, tekst: string) {
  const { error } = await supabase.from("forslag").insert({ type, tekst: tekst.trim() });
  if (!error) return;
  // Satt av triggeren forslag_grense: maks 10 forslag per døgn.
  if (error.hint === "grense") throw new Forslagsfeil("Du har sendt mange forslag i dag. Prøv igjen i morgen.");
  throw new Forslagsfeil("Fikk ikke sendt forslaget. Prøv igjen.");
}
