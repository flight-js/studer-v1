// Lagrer kallenavnet en elev vil vise på rangeringene (i stedet for fornavnet).
// Eneste vei til kolonnen profiles.kallenavn – eleven har ikke lov til å
// oppdatere den selv. Tre sjekker, så stygge navn stoppes uten at noen må
// rapportere dem:
//   1. ordlistene (public.kallenavn_feil – de samme som i appen)
//   2. en språkmodell, som fanger det lister ikke kan (nye skrivemåter, andre
//      språk, hets mot personer, hentydninger, fulle navn, kontaktinfo)
//   3. databasen sjekker ordlistene igjen når navnet lagres (trigger)
// Kan ikke modellen sjekke navnet (feil, tidsavbrudd, ikke satt opp), lagres
// det ikke. Tomt kallenavn fjerner det, uten sjekk.
//
// Krever innlogging, ikke abonnement (kallenavnet kan velges rett etter
// registreringen). Kallenavnet logges aldri – bare tokenbruk.
//
// Fartsgrenser, så ingen kan spamme (kallenavn_tempo i databasen):
//   - høyst KALLENAVN_PER_MINUTT forsøk per minutt (også de ordlistene stopper)
//   - høyst KALLENAVN_BYTTER_UKE nye kallenavn per 7 dager (databasen håndhever
//     det også når navnet lagres) – ellers kunne noen skrevet beskjeder på
//     rangeringene ved å bytte navn ord for ord
//   - høyst AI_GRENSE_KALLENAVN sjekker med språkmodellen per døgn per elev, og
//     AI_GRENSE_KALLENAVN_TOTALT for hele appen
// Å fjerne kallenavnet er alltid lov, og samme navn som før sjekkes ikke på nytt.
//
// Hemmeligheter og innstillinger (i tillegg til AI_API_KEY og AI_BASE_URL fra «chat»):
//   AI_MODELL_KALLENAVN           standard AI_MODELL, ellers gpt-6-luna
//   AI_RESONNERING_KALLENAVN      standard low (none | low | medium | high) – bare OpenAI
//   AI_GRENSE_KALLENAVN           sjekker per døgn per elev, standard 10
//   AI_GRENSE_KALLENAVN_TOTALT    sjekker per døgn for hele appen, standard 5000
//   KALLENAVN_PER_MINUTT          forsøk per minutt per elev, standard 3
//   KALLENAVN_BYTTER_UKE          nye kallenavn per 7 dager, standard 3 (må stemme
//                                 med triggeren sjekk_kallenavn i databasen)

import { createClient } from "npm:@supabase/supabase-js@2";
import { lagSjekk, lesSjekk, MAKS_KALLENAVN, meldingFor, SJEKK_FORMAT } from "./prompt.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const env = (navn: string, standard = "") => Deno.env.get(navn)?.trim() || standard;
const tall = (navn: string, standard: number) => {
  const v = Number(env(navn, String(standard)));
  return Number.isFinite(v) ? v : standard;
};

const API_NOKKEL = env("AI_API_KEY");
const BASE_URL = env("AI_BASE_URL", "https://api.openai.com/v1").replace(/\/+$/, "");
const MODELL = env("AI_MODELL_KALLENAVN", env("AI_MODELL", "gpt-6-luna"));
const RESONNERING = env("AI_RESONNERING_KALLENAVN", "low");
const GRENSE_DAG = tall("AI_GRENSE_KALLENAVN", 10);
const GRENSE_TOTALT = tall("AI_GRENSE_KALLENAVN_TOTALT", 5000);
const PER_MINUTT = tall("KALLENAVN_PER_MINUTT", 3);
const BYTTER_UKE = tall("KALLENAVN_BYTTER_UKE", 3);
const ER_OPENAI = new URL(BASE_URL).hostname.endsWith("openai.com");

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;

function supabaseNokkel(type: "PUBLISHABLE" | "SECRET"): string {
  const nye = Deno.env.get(`SUPABASE_${type}_KEYS`);
  if (nye) return JSON.parse(nye).default;
  return Deno.env.get(type === "SECRET" ? "SUPABASE_SERVICE_ROLE_KEY" : "SUPABASE_ANON_KEY")!;
}

function svar(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

async function sha256(tekst: string) {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(tekst));
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("");
}

// Ber språkmodellen vurdere kallenavnet. null: sjekken feilet.
async function sjekkMedModell(kallenavn: string, brukerId: string) {
  const { system, bruker } = lagSjekk(kallenavn);
  const foresporsel: Record<string, unknown> = {
    model: MODELL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: bruker },
    ],
  };
  if (ER_OPENAI) {
    foresporsel.max_completion_tokens = 600;
    foresporsel.response_format = SJEKK_FORMAT;
    foresporsel.store = false;
    foresporsel.safety_identifier = await sha256(brukerId);
    if (RESONNERING) foresporsel.reasoning_effort = RESONNERING;
  } else {
    foresporsel.max_tokens = 60;
  }
  try {
    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${API_NOKKEL}`, "Content-Type": "application/json" },
      body: JSON.stringify(foresporsel),
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) throw new Error(`AI-tjenesten svarte ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data = await res.json();
    if (data.usage) console.log(JSON.stringify({ modell: MODELL, bruk: data.usage }));
    return lesSjekk(data.choices?.[0]?.message?.content ?? "");
  } catch (e) {
    console.error("Kallenavnsjekk feilet", e instanceof Error ? e.message : String(e));
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return svar(405, { feil: "metode" });

  // Hvem spør? verify_jwt slipper gjennom anonyme kall med den publiserbare
  // nøkkelen – derfor sjekkes rollen her.
  const authorization = req.headers.get("Authorization") ?? "";
  const token = authorization.replace(/^Bearer\s+/i, "");
  const bruker = createClient(SUPABASE_URL, supabaseNokkel("PUBLISHABLE"), {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: claimsData } = await bruker.auth.getClaims(token);
  const claims = claimsData?.claims;
  const brukerId = claims?.role === "authenticated" ? claims.sub : undefined;
  if (!brukerId) return svar(401, { feil: "ikke-innlogget" });

  let kallenavn: unknown;
  try {
    ({ kallenavn } = await req.json());
  } catch {
    return svar(400, { feil: "ugyldig" });
  }
  if (kallenavn !== null && typeof kallenavn !== "string") return svar(400, { feil: "ugyldig" });
  const tekst = typeof kallenavn === "string" ? kallenavn : "";
  if (tekst.length > MAKS_KALLENAVN * 3) return svar(400, { feil: "ugyldig" });
  const rent = tekst.trim().replace(/\s+/g, " ");

  const admin = createClient(SUPABASE_URL, supabaseNokkel("SECRET"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const lagre = async (verdi: string | null) => {
    const { error } = await admin.from("profiles").update({ kallenavn: verdi }).eq("id", brukerId);
    if (!error) return svar(200, { kallenavn: verdi });
    // Triggeren i databasen stoppet navnet (skal ikke skje etter sjekk 1).
    if (error.code === "23514") return svar(422, { feil: "kallenavn", melding: error.message });
    console.error("Lagring av kallenavn feilet", error.message);
    return svar(500, { feil: "server" });
  };

  // Tomt: fjern kallenavnet – alltid lov, uten fartsgrense.
  if (!rent) return lagre(null);

  // Samme navn som eleven har nå: ingenting å sjekke eller lagre.
  const { data: profil } = await admin.from("profiles").select("kallenavn").eq("id", brukerId).maybeSingle();
  if (profil?.kallenavn === rent) return svar(200, { kallenavn: rent });

  // Fartsgrensene (forsøk per minutt og bytter per uke). Er migrasjonen ikke
  // kjørt ennå (funksjonen finnes ikke), hoppes de over – døgngrensen under
  // gjelder uansett.
  const { data: tempo, error: tempofeil } = await admin.rpc("kallenavn_tempo", {
    p_bruker: brukerId,
    p_per_minutt: PER_MINUTT,
    p_per_uke: BYTTER_UKE,
  });
  if (tempofeil && tempofeil.code !== "PGRST202") {
    console.error("kallenavn_tempo", tempofeil.message);
    return svar(500, { feil: "server" });
  }
  const fart = (tempo as { utfall: string; neste: string | null }[] | null)?.[0];
  if (fart && fart.utfall !== "ok") return svar(429, { feil: "grense", grunn: fart.utfall, neste: fart.neste });

  // 1. Ordlistene – gratis, og stopper det åpenbare før modellen spørres.
  const { data: ordfeil, error: ordlistefeil } = await admin.rpc("kallenavn_feil", { p_kallenavn: rent });
  if (ordlistefeil) {
    console.error("kallenavn_feil", ordlistefeil.message);
    return svar(500, { feil: "server" });
  }
  if (ordfeil) return svar(422, { feil: "kallenavn", melding: ordfeil });

  // 2. Språkmodellen. Uten den lagres ingenting.
  if (!API_NOKKEL) return svar(503, { feil: "ikke-satt-opp" });
  const { data: utfall, error: tellefeil } = await admin.rpc("kallenavn_tell_sjekk", {
    p_bruker_id: brukerId,
    p_dagsgrense: GRENSE_DAG,
    p_global_grense: GRENSE_TOTALT,
  });
  if (tellefeil) {
    console.error("kallenavn_tell_sjekk", tellefeil.message);
    return svar(500, { feil: "server" });
  }
  if (utfall !== "ok") return svar(429, { feil: "grense", grunn: utfall });

  const vurdering = await sjekkMedModell(rent, brukerId);
  if (!vurdering) return svar(502, { feil: "ai" });
  if (!vurdering.godkjent) return svar(422, { feil: "kallenavn", melding: meldingFor(vurdering.grunn) });

  // 3. Lagre (databasen sjekker ordlistene en gang til).
  return lagre(rent);
});
