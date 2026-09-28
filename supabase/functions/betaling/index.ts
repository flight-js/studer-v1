// Betaling: starter kjøp av abonnement med Stripe Embedded Checkout, og lar
// eleven avslutte eller fortsette abonnementet. Betalingsskjemaet vises inne
// på Studer – eleven sendes ikke videre til Stripe.
//
// Funksjonen skriver aldri abonnementet i profiles. Det gjør bare
// «stripe-webhook», etter at Stripe har bekreftet betalingen.
//
// Hemmeligheter (Edge Functions → Secrets):
//   STRIPE_SECRET_KEY        sk_live_… / sk_test_…
//   STRIPE_PUBLISHABLE_KEY   pk_live_… / pk_test_… (sendes til nettleseren – den er laget for det)
//   STRIPE_PRIS_MANED        pris-ID for månedlig abonnement (price_…)
//   STRIPE_PRIS_AR           pris-ID for årlig abonnement (price_…)
//   SITE_URL                 valgfri, f.eks. https://studer.no – ellers brukes adressen eleven kom fra

import Stripe from "npm:stripe@22";
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const env = (navn: string) => Deno.env.get(navn)?.trim() ?? "";
const HEMMELIG = env("STRIPE_SECRET_KEY");
const PUBLISERBAR = env("STRIPE_PUBLISHABLE_KEY");
const PRISER: Record<string, string> = { maned: env("STRIPE_PRIS_MANED"), ar: env("STRIPE_PRIS_AR") };
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;

const stripe = HEMMELIG ? new Stripe(HEMMELIG, { httpClient: Stripe.createFetchHttpClient() }) : null;

// Abonnementer som gir tilgang. past_due betyr at en fornyelse feilet, men
// Stripe prøver igjen – eleven beholder tilgangen så lenge.
const AKTIVE = ["active", "trialing", "past_due"];

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

function nettstedet(req: Request): string {
  const oppgitt = env("SITE_URL") || req.headers.get("origin") || "";
  try {
    const url = new URL(oppgitt);
    if (url.protocol === "https:" || url.hostname === "localhost") return url.origin;
  } catch {
    // ugyldig adresse
  }
  return "";
}

async function aktivtAbonnement(kunde: string) {
  const liste = await stripe!.subscriptions.list({ customer: kunde, status: "all", limit: 20 });
  return liste.data.find((s) => AKTIVE.includes(s.status)) ?? null;
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
  if (!stripe || !PUBLISERBAR || !PRISER.maned || !PRISER.ar) return svar(503, { feil: "ikke-satt-opp" });

  let handling: unknown, plan: unknown;
  try {
    ({ handling, plan } = await req.json());
  } catch {
    return svar(400, { feil: "ugyldig" });
  }

  const admin = createClient(SUPABASE_URL, supabaseNokkel("SECRET"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: rad } = await admin.from("betaling").select("stripe_kunde").eq("bruker_id", brukerId).maybeSingle();
  let kunde = rad?.stripe_kunde as string | undefined;

  try {
    if (handling === "start") {
      if (plan !== "maned" && plan !== "ar") return svar(400, { feil: "ugyldig" });
      const retur = nettstedet(req);
      if (!retur) return svar(400, { feil: "ugyldig" });

      if (!kunde) {
        const ny = await stripe.customers.create({
          email: typeof claims?.email === "string" ? claims.email : undefined,
          metadata: { bruker_id: brukerId },
        });
        const { error } = await admin.from("betaling").insert({ bruker_id: brukerId, stripe_kunde: ny.id });
        if (error) {
          // Et samtidig kall rakk å lage kunden først – bruk den.
          const { data: finnes } = await admin.from("betaling").select("stripe_kunde").eq("bruker_id", brukerId).single();
          kunde = finnes?.stripe_kunde as string;
          await stripe.customers.del(ny.id).catch(() => {});
        } else {
          kunde = ny.id;
        }
      }

      if (await aktivtAbonnement(kunde!)) return svar(409, { feil: "har-abonnement" });

      const felles = {
        mode: "subscription" as const,
        customer: kunde,
        client_reference_id: brukerId,
        line_items: [{ price: PRISER[plan], quantity: 1 }],
        subscription_data: { metadata: { bruker_id: brukerId } },
        metadata: { bruker_id: brukerId },
        locale: "nb" as const,
        // Kort, Apple Pay og Google Pay fullføres inne på siden. Bare betalingsmåter
        // som krever at eleven sendes til banken sin, kommer tilbake hit etterpå.
        redirect_on_completion: "if_required" as const,
        return_url: `${retur}/abonnement?betaling=fullfort`,
      };
      let okt: Stripe.Checkout.Session;
      try {
        okt = await stripe.checkout.sessions.create({ ...felles, ui_mode: "embedded_page" } as Stripe.Checkout.SessionCreateParams);
      } catch (e) {
        // Eldre API-versjoner kaller det «embedded».
        if (!(e instanceof Stripe.errors.StripeInvalidRequestError) || e.param !== "ui_mode") throw e;
        okt = await stripe.checkout.sessions.create({ ...felles, ui_mode: "embedded" } as unknown as Stripe.Checkout.SessionCreateParams);
      }
      return svar(200, { clientSecret: okt.client_secret, publishableKey: PUBLISERBAR });
    }

    if (handling === "avslutt" || handling === "fortsett") {
      const abonnement = kunde ? await aktivtAbonnement(kunde) : null;
      if (!abonnement) return svar(404, { feil: "ingen-abonnement" });
      await stripe.subscriptions.update(abonnement.id, { cancel_at_period_end: handling === "avslutt" });
      return svar(200, { ok: true });
    }

    return svar(400, { feil: "ugyldig" });
  } catch (e) {
    console.error("Stripe-feil", e instanceof Error ? e.message : String(e));
    return svar(502, { feil: "stripe" });
  }
});
