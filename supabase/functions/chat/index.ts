// AI-hjelp i temasiden. Krever abonnement (en prøveperiode teller som
// abonnement). Eleven sender samtalen og tema-ID-en; funksjonen
// henter temaets sammendrag og begreper (med elevens egne rettigheter),
// sjekker de skjulte bruksgrensene, lar temavakten avvise spørsmål som ikke
// hører til faget, og strømmer svaret fra språkmodellen tilbake som ren tekst.
//
// API-nøkkelen til språkmodellen ligger bare her, som hemmelighet i Supabase
// (Edge Functions → Secrets). Samtalene lagres ikke – bare antall meldinger
// (tabellene ai_bruk og ai_bruk_totalt).
//
// Hemmeligheter og innstillinger:
//   AI_API_KEY            påkrevd – nøkkelen fra OpenAI (eller en annen leverandør)
//   AI_BASE_URL           standard https://api.openai.com/v1 (EU: https://eu.api.openai.com/v1)
//   AI_MODELL             standard gpt-6-luna
//   AI_RESONNERING        standard low (none | low | medium | high) – bare OpenAI
//   AI_GRENSE_ABONNEMENT  meldinger per dag per elev, standard 60
//   AI_GRENSE_MINUTT      meldinger per minutt per elev, standard 5
//   AI_GRENSE_TOTALT      meldinger per dag for hele appen, standard 3000
// Grensene vises aldri for eleven.

import { createClient } from "npm:@supabase/supabase-js@2";
import {
  avvisning,
  type Kategori,
  KRISESVAR,
  lagSystemprompt,
  lagTemavakt,
  lesKategori,
  type Melding,
  type Temakontekst,
  TEMAVAKT_FORMAT,
} from "./prompt.ts";

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
const MODELL = env("AI_MODELL", "gpt-6-luna");
const RESONNERING = env("AI_RESONNERING", "low");
const GRENSE_ABONNEMENT = tall("AI_GRENSE_ABONNEMENT", 60);
const GRENSE_MINUTT = tall("AI_GRENSE_MINUTT", 5);
const GRENSE_TOTALT = tall("AI_GRENSE_TOTALT", 3000);
const ER_OPENAI = new URL(BASE_URL).hostname.endsWith("openai.com");

const MAKS_MELDINGER = 10; // så mye av samtalen som sendes med
const MAKS_TEGN = 1500; // per melding

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

function tekststrom(tekst: ReadableStream<Uint8Array> | string) {
  return new Response(tekst, {
    headers: { ...cors, "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}

async function sha256(tekst: string) {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(tekst));
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("");
}

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

function kallAi(sti: string, body: Record<string, unknown>, signal?: AbortSignal) {
  return fetch(`${BASE_URL}${sti}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${API_NOKKEL}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
}

// OpenAIs moderering er gratis. Vi bruker den bare til å fange opp at eleven
// kan være i fare – da får hen hjelpenumrene med en gang i stedet for et
// modellsvar. Feiler kallet, går vi videre som vanlig.
async function trengerKrisesvar(tekst: string): Promise<boolean> {
  if (!ER_OPENAI) return false;
  try {
    const res = await kallAi(
      "/moderations",
      { model: "omni-moderation-latest", input: tekst },
      AbortSignal.timeout(4000)
    );
    if (!res.ok) return false;
    const kategorier = (await res.json()).results?.[0]?.categories ?? {};
    return !!(kategorier["self-harm/intent"] || kategorier["self-harm/instructions"]);
  } catch {
    return false;
  }
}

// Temavakten plasserer spørsmålet i en kategori. Feiler den, slipper vi
// spørsmålet gjennom – instruksjonene til hovedmodellen avviser det da selv.
async function temavakt(t: Temakontekst, meldinger: Melding[], sikkerhetsId: string): Promise<Kategori | null> {
  const { system, bruker } = lagTemavakt(t, meldinger);
  const body: Record<string, unknown> = {
    model: MODELL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: bruker },
    ],
  };
  if (ER_OPENAI) {
    body.max_completion_tokens = 50;
    body.reasoning_effort = "none";
    body.response_format = TEMAVAKT_FORMAT;
    body.store = false;
    body.safety_identifier = sikkerhetsId;
  } else {
    body.max_tokens = 20;
  }
  try {
    const res = await kallAi("/chat/completions", body, AbortSignal.timeout(8000));
    if (!res.ok) {
      console.error("Temavakten svarte", res.status, (await res.text()).slice(0, 300));
      return null;
    }
    return lesKategori((await res.json()).choices?.[0]?.message?.content ?? "");
  } catch (e) {
    console.error("Temavakten feilet", String(e));
    return null;
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

  const { data: profil } = await bruker.from("profiles").select("abonnement").eq("id", brukerId).maybeSingle();
  if (!profil || profil.abonnement === "gratis") return svar(403, { feil: "abonnement" });

  // Temaet hentes med elevens rettigheter, så RLS bestemmer hva som er lov.
  const { data: tema } = await bruker
    .from("temaer")
    .select("navn, intro, fag(navn, trinn(navn)), tema_innhold(sammendrag), flashcards(begrep, forklaring, sortering)")
    .eq("id", temaId)
    .maybeSingle();
  if (!tema || !tema.tema_innhold) return svar(404, { feil: "fant-ikke-tema" });

  const sisteSporsmal = meldinger[meldinger.length - 1].tekst;
  if (await trengerKrisesvar(sisteSporsmal)) return tekststrom(KRISESVAR);

  // Telleren kan bare endres med secret-nøkkelen.
  const admin = createClient(SUPABASE_URL, supabaseNokkel("SECRET"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: utfall, error: tellefeil } = await admin.rpc("ai_registrer_melding", {
    p_bruker_id: brukerId,
    p_dagsgrense: GRENSE_ABONNEMENT,
    p_minuttgrense: GRENSE_MINUTT,
    p_global_grense: GRENSE_TOTALT,
  });
  if (tellefeil) {
    console.error("ai_registrer_melding", tellefeil.message);
    return svar(500, { feil: "server" });
  }
  if (utfall !== "ok") return svar(429, { feil: "grense", grunn: utfall });

  const fag = tema.fag as unknown as { navn: string; trinn: { navn: string } };
  const innhold = tema.tema_innhold as unknown as { sammendrag: string };
  const kontekst: Temakontekst = {
    trinn: fag.trinn.navn,
    fag: fag.navn,
    tema: tema.navn,
    intro: tema.intro,
    sammendrag: innhold.sammendrag,
    begreper: [...(tema.flashcards ?? [])].sort((a, b) => a.sortering - b.sortering),
  };
  const sikkerhetsId = await sha256(brukerId);

  const foresporsel: Record<string, unknown> = {
    model: MODELL,
    stream: true,
    messages: [
      { role: "system", content: lagSystemprompt(kontekst) },
      ...meldinger.map((m) => ({ role: m.rolle === "bruker" ? "user" : "assistant", content: m.tekst })),
    ],
  };
  if (ER_OPENAI) {
    foresporsel.max_completion_tokens = 1500;
    foresporsel.stream_options = { include_usage: true };
    foresporsel.store = false;
    // Hashet bruker-ID: bryter én elev OpenAIs regler, stenges bare den eleven.
    foresporsel.safety_identifier = sikkerhetsId;
    if (RESONNERING) foresporsel.reasoning_effort = RESONNERING;
  } else {
    foresporsel.max_tokens = 1000;
  }

  // Temavakten og svaret starter samtidig, så eleven ikke må vente på begge
  // etter hverandre. Avviser vakten spørsmålet, avbrytes svaret.
  const avbryt = new AbortController();
  const tidsgrense = setTimeout(() => avbryt.abort(), 60_000);
  const svarKall = kallAi("/chat/completions", foresporsel, avbryt.signal).catch((e) => e as Error);
  const kategori = await temavakt(kontekst, meldinger, sikkerhetsId);

  if (kategori === "annet") {
    avbryt.abort();
    clearTimeout(tidsgrense);
    return tekststrom(avvisning(kontekst));
  }

  let modellsvar = await svarKall;
  if (modellsvar instanceof Response && !modellsvar.ok) {
    const feiltekst = (await modellsvar.text()).slice(0, 500);
    console.error("AI-tjenesten svarte", modellsvar.status, feiltekst);
    // Noen modeller krever verifisert organisasjon for strømming. Da prøver vi
    // én gang til uten strømming og sender hele svaret samlet.
    if (/stream|verif/i.test(feiltekst)) {
      const { stream: _s, stream_options: _o, ...utenStromming } = foresporsel;
      const res = await kallAi("/chat/completions", utenStromming, avbryt.signal).catch((e) => e as Error);
      if (res instanceof Response && res.ok) {
        clearTimeout(tidsgrense);
        const data = await res.json();
        if (data.usage) console.log(JSON.stringify({ modell: MODELL, bruk: data.usage }));
        return tekststrom(data.choices?.[0]?.message?.content ?? "");
      }
    }
    modellsvar = new Error("feil fra AI-tjenesten");
  }
  if (!(modellsvar instanceof Response) || !modellsvar.body) {
    clearTimeout(tidsgrense);
    if (modellsvar instanceof Error) console.error("AI-kall feilet", String(modellsvar));
    await admin.rpc("ai_angre_melding", { p_bruker_id: brukerId });
    return svar(502, { feil: "ai" });
  }

  const strom = tilTekst(modellsvar.body).pipeThrough(
    new TransformStream({ flush: () => clearTimeout(tidsgrense) })
  );
  return tekststrom(strom);
});
