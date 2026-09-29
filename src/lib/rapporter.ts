// Rapporter fra elevene om enkeltkort og spørsmål. Eleven kan bare legge inn
// egne rapporter, ikke lese dem (se migrasjonen niva_og_rapporter). De leses
// med `npm run content:rapporter`.

import { supabase } from "./supabase";

export type Rapporttype = "flashcard" | "sporsmal" | "skriv";
export type Rapportgrunn = "ikke-laert" | "feil" | "for-vanskelig";

export const GRUNNER: { id: Rapportgrunn; tekst: string }[] = [
  { id: "ikke-laert", tekst: "Har ikke lært dette" },
  { id: "feil", tekst: "Noe er feil" },
  { id: "for-vanskelig", tekst: "For vanskelig" },
];

// nokkel: begrepet for flashcards, ellers spørsmålets nøkkel («q01»).
export async function sendRapport(temaId: string, type: Rapporttype, nokkel: string, grunn: Rapportgrunn) {
  const { error } = await supabase.from("rapporter").insert({ tema_id: temaId, type, nokkel: nokkel.slice(0, 200), grunn });
  // 23505: den samme rapporten er sendt før – det er greit.
  if (error && error.code !== "23505") throw new Error(error.message);
}
