// Retter skriveoppgaver i miniprøven. Eleven sender tema, oppgave og svar;
// funksjonen henter fasiten (som eleven ikke kan lese), lar språkmodellen
// vurdere svaret og sender tilbake vurdering, poeng, tilbakemelding og fasit.
// Krever abonnement. Svarene lagres ikke – bare antall vurderinger (ai_bruk).
//
// Hemmeligheter og innstillinger (i tillegg til AI_API_KEY og AI_BASE_URL fra «chat»):
//   AI_MODELL_VURDERING         standard AI_MODELL, ellers gpt-6-luna
//   AI_RESONNERING_VURDERING    standard low (none | low | medium | high) – bare OpenAI
//   AI_GRENSE_VURDERING         vurderinger per dag per elev, standard 150
//   AI_GRENSE_VURDERING_TOTALT  vurderinger per dag for hele appen, standard 30000
// Grensene vises aldri for eleven.

import { createClient } from "npm:@supabase/supabase-js@2";
import { lagVurdering, lesVurdering, MAKS_SVAR, POENG, VURDERING_FORMAT } from "./prompt.ts";

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
const MODELL = env("AI_MODELL_VURDERING", env("AI_MODELL", "gpt-6-luna"));
const RESONNERING = env("AI_RESONNERING_VURDERING", "low");
const GRENSE_DAG = tall("AI_GRENSE_VURDERING", 150);
const GRENSE_TOTALT = tall("AI_GRENSE_VURDERING_TOTALT", 30000);
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

type Rad = {
  tekst: string;
  fasit: string;
  kriterier: string[];
  temaer: { navn: string; publisert: boolean; fag: { navn: string; trinn: { navn: string } } };
};

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
  if (!API_NOKKEL) return svar(503, { feil: "ikke-satt-opp" });

  let temaId: unknown, nokkel: unknown, elevsvar: unknown;
  try {
    ({ temaId, nokkel, svar: elevsvar } = await req.json());
  } catch {
    return svar(400, { feil: "ugyldig" });
  }
  if (
    typeof temaId !== "string" || temaId.length > 200 ||
    typeof nokkel !== "string" || nokkel.length > 20 ||
    typeof elevsvar !== "string" || elevsvar.length > MAKS_SVAR * 2
  ) {
    return svar(400, { feil: "ugyldig" });
  }

  const { data: profil } = await bruker.from("profiles").select("abonnement").eq("id", brukerId).maybeSingle();
  if (!profil || profil.abonnement === "gratis") return svar(403, { feil: "abonnement" });

  // Fasiten kan bare leses med secret-nøkkelen.
  const admin = createClient(SUPABASE_URL, supabaseNokkel("SECRET"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data } = await admin
    .from("skriveoppgaver")
    .select("tekst, fasit, kriterier, temaer!inner(navn, publisert, fag(navn, trinn(navn)))")
    .eq("tema_id", temaId)
    .eq("nokkel", nokkel)
    .maybeSingle();
  const rad = data as unknown as Rad | null;
  if (!rad || !rad.temaer.publisert) return svar(404, { feil: "fant-ikke-oppgave" });

  const tekst = elevsvar.trim();
  if (!tekst) {
    return svar(200, { vurdering: "feil", poeng: 0, tilbakemelding: "Du svarte ikke på denne oppgaven.", fasit: rad.fasit });
  }

  const { data: utfall, error: tellefeil } = await admin.rpc("ai_registrer_vurdering", {
    p_bruker_id: brukerId,
    p_dagsgrense: GRENSE_DAG,
    p_global_grense: GRENSE_TOTALT,
  });
  if (tellefeil) {
    console.error("ai_registrer_vurdering", tellefeil.message);
    return svar(500, { feil: "server" });
  }
  if (utfall !== "ok") return svar(429, { feil: "grense", grunn: utfall });

  const { system, bruker: melding } = lagVurdering(
    {
      trinn: rad.temaer.fag.trinn.navn,
      fag: rad.temaer.fag.navn,
      tema: rad.temaer.navn,
      sporsmal: rad.tekst,
      fasit: rad.fasit,
      kriterier: rad.kriterier,
    },
    tekst
  );
  const foresporsel: Record<string, unknown> = {
    model: MODELL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: melding },
    ],
  };
  if (ER_OPENAI) {
    foresporsel.max_completion_tokens = 1500;
    foresporsel.response_format = VURDERING_FORMAT;
    foresporsel.store = false;
    foresporsel.safety_identifier = await sha256(brukerId);
    if (RESONNERING) foresporsel.reasoning_effort = RESONNERING;
  } else {
    foresporsel.max_tokens = 300;
  }

  try {
    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${API_NOKKEL}`, "Content-Type": "application/json" },
      body: JSON.stringify(foresporsel),
      signal: AbortSignal.timeout(45_000),
    });
    if (!res.ok) throw new Error(`AI-tjenesten svarte ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data = await res.json();
    // Bare tokenbruk logges – aldri oppgaven eller svaret.
    if (data.usage) console.log(JSON.stringify({ modell: MODELL, bruk: data.usage }));
    const resultat = lesVurdering(data.choices?.[0]?.message?.content ?? "");
    if (!resultat) throw new Error("ugyldig vurdering fra modellen");
    return svar(200, { ...resultat, poeng: POENG[resultat.vurdering], fasit: rad.fasit });
  } catch (e) {
    console.error("Vurdering feilet", e instanceof Error ? e.message : String(e));
    await admin.rpc("ai_angre_vurdering", { p_bruker_id: brukerId });
    return svar(502, { feil: "ai" });
  }
});
