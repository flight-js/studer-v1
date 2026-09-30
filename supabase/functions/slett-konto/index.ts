// Slett konto: eleven sletter sin egen konto og alt som hører til den.
//
// 1. Abonnementer i Stripe avsluttes med en gang (ingen refusjon for resten av
//    perioden), og bruker-ID-en fjernes fra Stripe-kunden. Betalingshistorikken
//    blir liggende hos Stripe, fordi bokføringsloven krever det.
// 2. Kontoen slettes i Supabase Auth. Profil, fremdrift, AI-tellere, betaling,
//    rapporter og forslag slettes med den (on delete cascade).
//
// Prøveperiode-kontrollen (tabellen provetid) blir liggende til den ryddes
// etter 2 år, så samme kort og e-post ikke kan få ny prøveperiode ved å slette
// kontoen. Det står i personvernerklæringen.
//
// Feiler Stripe, slettes ikke kontoen – ellers kunne et abonnement fortsette å
// trekke penger for en konto som ikke finnes.

import Stripe from "npm:stripe@22";
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const HEMMELIG = Deno.env.get("STRIPE_SECRET_KEY")?.trim() ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const stripe = HEMMELIG ? new Stripe(HEMMELIG, { httpClient: Stripe.createFetchHttpClient() }) : null;

// Abonnementer som fortsatt kan trekke penger eller gi tilgang.
const LEVENDE = ["active", "trialing", "past_due", "unpaid", "incomplete", "paused"];

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

// Alle Stripe-kunder som hører til brukeren: den lagrede, og eventuelle andre
// med samme bruker-ID (for eksempel fra et bytte mellom test- og live-nøkler).
async function stripeKunder(brukerId: string, lagret: string | undefined): Promise<string[]> {
  const kunder = new Set<string>();
  if (lagret) kunder.add(lagret);
  const sok = await stripe!.customers.search({ query: `metadata['bruker_id']:'${brukerId}'`, limit: 20 });
  for (const k of sok.data) kunder.add(k.id);
  return [...kunder];
}

async function avsluttIStripe(kunde: string) {
  let k;
  try {
    k = await stripe!.customers.retrieve(kunde);
  } catch (e) {
    if (e instanceof Stripe.errors.StripeInvalidRequestError && e.code === "resource_missing") return;
    throw e;
  }
  if (k.deleted) return;
  const liste = await stripe!.subscriptions.list({ customer: kunde, status: "all", limit: 100 });
  for (const s of liste.data.filter((s) => LEVENDE.includes(s.status))) {
    await stripe!.subscriptions.cancel(s.id);
  }
  // Tom verdi fjerner nøkkelen, så webhooken ikke finner den slettede kontoen.
  await stripe!.customers.update(kunde, { metadata: { bruker_id: "" } });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return svar(405, { feil: "metode" });

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

  const admin = createClient(SUPABASE_URL, supabaseNokkel("SECRET"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: rad } = await admin.from("betaling").select("stripe_kunde").eq("bruker_id", brukerId).maybeSingle();
  const lagret = (rad?.stripe_kunde as string | undefined) ?? undefined;
  if (lagret && !stripe) return svar(503, { feil: "ikke-satt-opp" });

  try {
    if (stripe) {
      for (const kunde of await stripeKunder(brukerId, lagret)) await avsluttIStripe(kunde);
    }
  } catch (e) {
    console.error("Kunne ikke avslutte i Stripe", e instanceof Error ? e.message : String(e));
    return svar(502, { feil: "stripe" });
  }

  const { error } = await admin.auth.admin.deleteUser(brukerId);
  if (error) {
    console.error("Kunne ikke slette kontoen", error.message);
    return svar(500, { feil: "sletting" });
  }
  console.log(JSON.stringify({ slettet: brukerId }));
  return svar(200, { slettet: true });
});
