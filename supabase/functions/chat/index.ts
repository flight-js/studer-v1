// AI-hjelp i temasiden. Eleven sender samtalen og tema-ID-en; funksjonen
// henter temaets sammendrag og begreper (med elevens egne rettigheter),
// sjekker dagens meldingsgrense og strømmer svaret fra språkmodellen tilbake
// som ren tekst.
//
// API-nøkkelen til språkmodellen ligger bare her, som hemmelighet i Supabase
// (Edge Functions → Secrets). Samtalene lagres ikke – bare antall meldinger
// per dag (tabellen ai_bruk).
//
// Hemmeligheter og innstillinger:
//   AI_API_KEY            påkrevd – nøkkelen fra OpenAI (eller en annen leverandør)
//   AI_BASE_URL           standard https://api.openai.com/v1 (EU: https://eu.api.openai.com/v1)
//   AI_MODELL             standard gpt-6-luna
//   AI_RESONNERING        standard low (none | low | medium | high) – bare OpenAI
//   AI_GRENSE_GRATIS      meldinger per dag uten abonnement, standard 15 (0 = stengt)
//   AI_GRENSE_ABONNEMENT  meldinger per dag med abonnement, standard 150

import { createClient } from "npm:@supabase/supabase-js@2";
import { KRISESVAR, lagSystemprompt } from "./prompt.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Expose-Headers": "x-ai-igjen",
};

const env = (navn: string, standard = "") => Deno.env.get(navn)?.trim() || standard;

const API_NOKKEL = env("AI_API_KEY");
const BASE_URL = env("AI_BASE_URL", "https://api.openai.com/v1").replace(/\/+$/, "");
const MODELL = env("AI_MODELL", "gpt-6-luna");
const RESONNERING = env("AI_RESONNERING", "low");
const GRENSE_GRATIS = Number(env("AI_GRENSE_GRATIS", "15"));
const GRENSE_ABONNEMENT = Number(env("AI_GRENSE_ABONNEMENT", "150"));
const ER_OPENAI = new URL(BASE_URL).hostname.endsWith("openai.com");

const MAKS_MELDINGER = 12; // så mye av samtalen som sendes med
const MAKS_TEGN = 2000; // per melding

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

function tekststrom(tekst: ReadableStream<Uint8Array> | string, ekstra: Record<string, string> = {}) {
  return new Response(tekst, {
    headers: { ...cors, ...ekstra, "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}

async function sha256(tekst: string) {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(tekst));
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("");
}

type Melding = { rolle: "bruker" | "assistent"; tekst: string };

function lesMeldinger(verdi: unknown): Melding[] | null {
  if (!Array.isArray(verdi)) return null;
  const meldinger = verdi
    .filter(
      (m): m is Melding =>
        !!m && (m.rolle === "bruker" || m.rolle === "assistent") && typeof m.tekst === "string"
    )
    .map((m) => ({ rolle: m.rolle, tekst: m.tekst.trim().slice(0, MAKS_TEGN) }))
    .filter((m) => m.tekst)
    .slice(-MAKS_MELDINGER);
  if (!meldinger.length || meldinger[meldinger.length - 1].rolle !== "bruker") return null;
  return meldinger;
}

// OpenAIs moderering er gratis. Vi bruker den bare til å fange opp at eleven
// kan være i fare – da får hen hjelpenumrene med en gang i stedet for et
// modellsvar. Feiler kallet, går vi videre som vanlig.
async function trengerKrisesvar(tekst: string): Promise<boolean> {
  if (!ER_OPENAI) return false;
  try {
    const res = await fetch(`${BASE_URL}/moderations`, {
      method: "POST",
      headers: { Authorization: `Bearer ${API_NOKKEL}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "omni-moderation-latest", input: tekst }),
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return false;
    const kategorier = (await res.json()).results?.[0]?.categories ?? {};
    return !!(kategorier["self-harm/intent"] || kategorier["self-harm/instructions"]);
  } catch {
    return false;
  }
}

// Gjør modellens SSE-strøm om til ren tekst.
function tilTekst(kilde: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const dekoder = new TextDecoder();
  const koder = new TextEncoder();
  let rest = "";
  return kilde.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(bit, kontroller) {
        rest += dekoder.decode(bit, { stream: true });
        const linjer = rest.split("\n");
        rest = linjer.pop() ?? "";
        for (const linje of linjer) {
          if (!linje.startsWith("data:")) continue;
          const data = linje.slice(5).trim();
          if (!data || data === "[DONE]") continue;
          try {
            const hendelse = JSON.parse(data);
            const delta = hendelse.choices?.[0]?.delta?.content;
            if (delta) kontroller.enqueue(koder.encode(delta));
            if (hendelse.usage) {
              // Bare tokenbruk logges – aldri innholdet i samtalen.
              console.log(JSON.stringify({ modell: MODELL, bruk: hendelse.usage }));
            }
          } catch {
            // Ufullstendig eller ukjent linje – hopp over.
          }
        }
      },
    })
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return svar(405, { feil: "metode" });

  // Hvem spør? verify_jwt avviser ugyldige tokens, men slipper gjennom
  // anonyme kall med den publiserbare nøkkelen – derfor sjekkes rollen her.
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

  let temaId: unknown, meldinger: Melding[] | null;
  try {
    const body = await req.json();
    temaId = body.temaId;
    meldinger = lesMeldinger(body.meldinger);
  } catch {
    return svar(400, { feil: "ugyldig" });
  }
  if (typeof temaId !== "string" || temaId.length > 200 || !meldinger) {
    return svar(400, { feil: "ugyldig" });
  }

  // Temaet hentes med elevens rettigheter, så RLS bestemmer hva som er lov.
  const { data: tema } = await bruker
    .from("temaer")
    .select("navn, intro, fag(navn, trinn(navn)), tema_innhold(sammendrag), flashcards(begrep, forklaring, sortering)")
    .eq("id", temaId)
    .maybeSingle();
  if (!tema || !tema.tema_innhold) return svar(404, { feil: "fant-ikke-tema" });

  const { data: profil } = await bruker.from("profiles").select("abonnement").eq("id", brukerId).maybeSingle();
  const grense =
    profil?.abonnement && profil.abonnement !== "gratis" ? GRENSE_ABONNEMENT : GRENSE_GRATIS;

  const sisteSporsmal = meldinger[meldinger.length - 1].tekst;
  if (await trengerKrisesvar(sisteSporsmal)) return tekststrom(KRISESVAR);

  // Telleren kan bare endres med secret-nøkkelen.
  const admin = createClient(SUPABASE_URL, supabaseNokkel("SECRET"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: antall, error: tellefeil } = await admin.rpc("ai_registrer_melding", {
    p_bruker_id: brukerId,
    p_grense: grense,
  });
  if (tellefeil) {
    console.error("ai_registrer_melding", tellefeil.message);
    return svar(500, { feil: "server" });
  }
  if (antall === -1) return svar(429, { feil: "grense", grense });

  const fag = tema.fag as unknown as { navn: string; trinn: { navn: string } };
  const innhold = tema.tema_innhold as unknown as { sammendrag: string };
  const system = lagSystemprompt({
    trinn: fag.trinn.navn,
    fag: fag.navn,
    tema: tema.navn,
    intro: tema.intro,
    sammendrag: innhold.sammendrag,
    begreper: [...(tema.flashcards ?? [])].sort((a, b) => a.sortering - b.sortering),
  });

  const foresporsel: Record<string, unknown> = {
    model: MODELL,
    stream: true,
    messages: [
      { role: "system", content: system },
      ...meldinger.map((m) => ({ role: m.rolle === "bruker" ? "user" : "assistant", content: m.tekst })),
    ],
  };
  if (ER_OPENAI) {
    foresporsel.max_completion_tokens = 2000;
    foresporsel.stream_options = { include_usage: true };
    foresporsel.store = false;
    // Hashet bruker-ID: bryter én elev OpenAIs regler, stenges bare den eleven.
    foresporsel.safety_identifier = await sha256(brukerId);
    if (RESONNERING) foresporsel.reasoning_effort = RESONNERING;
  } else {
    foresporsel.max_tokens = 1200;
  }

  let modellsvar: Response;
  try {
    modellsvar = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${API_NOKKEL}`, "Content-Type": "application/json" },
      body: JSON.stringify(foresporsel),
      signal: AbortSignal.timeout(60_000),
    });
  } catch (e) {
    console.error("AI-kall feilet", String(e));
    await admin.rpc("ai_angre_melding", { p_bruker_id: brukerId });
    return svar(502, { feil: "ai" });
  }
  if (!modellsvar.ok || !modellsvar.body) {
    console.error("AI-tjenesten svarte", modellsvar.status, (await modellsvar.text()).slice(0, 500));
    await admin.rpc("ai_angre_melding", { p_bruker_id: brukerId });
    return svar(502, { feil: "ai" });
  }

  return tekststrom(tilTekst(modellsvar.body), { "x-ai-igjen": String(Math.max(0, grense - antall)) });
});
