// Gi en venn en gratis uke: eleven skriver vennens e-postadresse, poengene
// trekkes i databasen (vennegave_lag), og Studer sender vennen en e-post.
// Feiler e-posten, gis poengene tilbake (vennegave_angre).
//
// Vennen trenger ingen kode: noen med den e-postadressen lager konto og løser
// inn gaven på /abonnement (vennegave_los_inn i databasen), og får tilgang til
// alt i en uke – uten kort. Brukes ikke gaven innen 60 dager, får eleven
// poengene tilbake (vennegaver_rydd i databasen, hver natt).
//
// E-posten er alltid den samme teksten – eleven kan ikke skrive en egen melding,
// så funksjonen kan ikke brukes til å sende hva som helst. Det eneste fra
// eleven er fornavnet (bare bokstaver, se gavenavn i databasen). Svaret sier
// aldri om adressen har konto hos Studer.
//
// Sendes med SMTP fra e-postserveren til studer.no (port 465 – Supabase
// stenger 25 og 587). Hemmeligheter (Edge Functions → Secrets):
//   SMTP_VERT      e-postserveren, for eksempel mail.studer.no
//   SMTP_PORT      valgfri, standard 465
//   SMTP_BRUKER    for eksempel kontakt@studer.no
//   SMTP_PASSORD   passordet til den adressen
//   EPOST_FRA      valgfri, standard «Studer <SMTP_BRUKER>»
//   SITE_URL       valgfri, standard https://studer.no (lenken i e-posten)

import { createClient } from "npm:@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const env = (navn: string, standard = "") => Deno.env.get(navn)?.trim() || standard;
const SMTP_VERT = env("SMTP_VERT");
const SMTP_PORT = Number(env("SMTP_PORT", "465"));
const SMTP_BRUKER = env("SMTP_BRUKER");
const SMTP_PASSORD = env("SMTP_PASSORD");
const FRA = env("EPOST_FRA", SMTP_BRUKER ? `Studer <${SMTP_BRUKER}>` : "");
const SIDE = env("SITE_URL", "https://studer.no").replace(/\/+$/, "");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;

const post =
  SMTP_VERT && SMTP_BRUKER && SMTP_PASSORD
    ? nodemailer.createTransport({
        host: SMTP_VERT,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: { user: SMTP_BRUKER, pass: SMTP_PASSORD },
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 20_000,
      })
    : null;

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

const html = (t: string) =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Samme sjekk som i databasen (vennegave_lag), så åpenbare feil stoppes før
// noe trekkes.
const GYLDIG_EPOST = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function lagEpost(fra: string | null, epost: string, dager: number, gyldigTil: string) {
  const hvem = fra ?? "En venn";
  const tid = dager === 7 ? "en gratis uke" : `${dager} gratis dager`;
  const dato = new Date(gyldigTil).toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Oslo",
  });
  const lenke = `${SIDE}/registrer?neste=${encodeURIComponent("/abonnement")}`;
  const emne = `${hvem} har gitt deg ${tid} på Studer`;
  const tekst = [
    "Hei!",
    "",
    `${hvem} har gitt deg ${tid} på Studer, en app for å øve til prøver og eksamen med flashcards, quiz og miniprøver – fra 8. trinn til Vg3.`,
    "",
    `Lag en konto med denne e-postadressen (${epost}) innen ${dato}, og løs inn gaven. Da får du tilgang til alt i Studer i ${dager === 7 ? "en uke" : `${dager} dager`}. Du trenger ikke kort, og det koster ingenting.`,
    "",
    `Lag konto: ${lenke}`,
    "",
    `Kjenner du ikke ${fra ?? "avsenderen"}, eller vil du ikke ha gaven, kan du se bort fra denne e-posten. Vi bruker ikke adressen din til noe annet, og du får ikke flere e-poster fra oss om dette.`,
    "",
    "Hilsen Studer",
  ].join("\n");
  const avsnitt = (t: string) => `<p style="margin:0 0 16px">${t}</p>`;
  const kropp = `<!doctype html><html lang="nb"><body style="margin:0;padding:24px;background:#f6f4ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:16px;line-height:1.5;color:#1c1b19">
<div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px">
${avsnitt("Hei!")}
${avsnitt(`<strong>${html(hvem)}</strong> har gitt deg ${tid} på Studer, en app for å øve til prøver og eksamen med flashcards, quiz og miniprøver – fra 8. trinn til Vg3.`)}
${avsnitt(`Lag en konto med denne e-postadressen (${html(epost)}) innen ${html(dato)}, og løs inn gaven. Da får du tilgang til alt i Studer i ${dager === 7 ? "en uke" : `${dager} dager`}. Du trenger ikke kort, og det koster ingenting.`)}
<p style="margin:24px 0"><a href="${html(lenke)}" style="display:inline-block;background:#1c1b19;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:12px">Lag konto</a></p>
<p style="margin:0;font-size:14px;color:#6b6760">Kjenner du ikke ${html(fra ?? "avsenderen")}, eller vil du ikke ha gaven, kan du se bort fra denne e-posten. Vi bruker ikke adressen din til noe annet, og du får ikke flere e-poster fra oss om dette.</p>
</div></body></html>`;
  return { emne, tekst, kropp };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return svar(405, { feil: "metode" });

  // Hvem spør? Anonyme kall slippes gjennom av verify_jwt, så rollen sjekkes her.
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
  if (!post || !FRA) return svar(503, { feil: "ikke-satt-opp" });

  let belonning: unknown, epost: unknown;
  try {
    ({ belonning, epost } = await req.json());
  } catch {
    return svar(400, { feil: "ugyldig" });
  }
  if (typeof belonning !== "string" || !/^[0-9a-f-]{36}$/.test(belonning)) return svar(400, { feil: "ugyldig" });
  const adresse = typeof epost === "string" ? epost.trim().toLowerCase() : "";
  if (adresse.length > 254 || !GYLDIG_EPOST.test(adresse)) return svar(400, { feil: "epost" });

  const admin = createClient(SUPABASE_URL, supabaseNokkel("SECRET"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 1. Sjekk og trekk poengene. Feilmeldingene fra databasen er laget for eleven.
  const { data: rader, error: lagfeil } = await admin.rpc("vennegave_lag", {
    p_bruker: brukerId,
    p_belonning: belonning,
    p_epost: adresse,
  });
  if (lagfeil) {
    if (lagfeil.code === "P0001") return svar(422, { feil: "vennegave", melding: lagfeil.message });
    console.error("vennegave_lag", lagfeil.message);
    return svar(500, { feil: "server" });
  }
  const gave = rader?.[0] as { id: string; dager: number; fra: string | null; gyldig_til: string; saldo: number } | undefined;
  if (!gave) return svar(500, { feil: "server" });

  // 2. Send e-posten. Går det ikke, får eleven poengene tilbake.
  const { emne, tekst, kropp } = lagEpost(gave.fra, adresse, gave.dager, gave.gyldig_til);
  try {
    await post.sendMail({ from: FRA, to: adresse, subject: emne, text: tekst, html: kropp });
  } catch (e) {
    console.error("Sending av vennegave feilet", e instanceof Error ? e.message : e);
    const { error: angrefeil } = await admin.rpc("vennegave_angre", { p_id: gave.id });
    if (angrefeil) console.error("vennegave_angre", gave.id, angrefeil.message);
    return svar(502, { feil: "sendefeil" });
  }

  return svar(200, { saldo: gave.saldo, epost: adresse });
});
