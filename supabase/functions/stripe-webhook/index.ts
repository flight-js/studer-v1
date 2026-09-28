// Mottar hendelser fra Stripe og holder abonnementet i profiles oppdatert.
// Dette er det eneste stedet abonnementet skrives. Hver forespørsel må ha en
// gyldig signatur fra Stripe, ellers avvises den.
//
// Funksjonen henter alltid ferske data fra Stripe i stedet for å stole på
// innholdet i hendelsen, så rekkefølgen hendelsene kommer i, spiller ingen rolle.
//
// Hemmeligheter (Edge Functions → Secrets):
//   STRIPE_SECRET_KEY      sk_live_… / sk_test_…
//   STRIPE_WEBHOOK_SECRET  whsec_… (fra webhook-endepunktet i Stripe)
//   STRIPE_PRIS_MANED / STRIPE_PRIS_AR  pris-ID-ene (brukes til å se hvilken plan det er)
//
// Deployes med verify_jwt = false: Stripe sender ingen Supabase-token, så
// signaturen er autentiseringen.

import Stripe from "npm:stripe@22";
import { createClient } from "npm:@supabase/supabase-js@2";

const env = (navn: string) => Deno.env.get(navn)?.trim() ?? "";
const HEMMELIG = env("STRIPE_SECRET_KEY");
const SIGNERING = env("STRIPE_WEBHOOK_SECRET");
const PRIS_AR = env("STRIPE_PRIS_AR");
const PRIS_MANED = env("STRIPE_PRIS_MANED");

const stripe = HEMMELIG ? new Stripe(HEMMELIG, { httpClient: Stripe.createFetchHttpClient() }) : null;
const krypto = Stripe.createSubtleCryptoProvider();

const AKTIVE = ["active", "trialing", "past_due"];

function secretKey(): string {
  const nye = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (nye) return JSON.parse(nye).default;
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
}

const admin = createClient(Deno.env.get("SUPABASE_URL")!, secretKey(), {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Slutten på perioden ligger på abonnementslinjen i nyere API-versjoner.
function periodeslutt(s: Stripe.Subscription): number {
  const linje = s.items.data[0] as unknown as { current_period_end?: number } | undefined;
  return linje?.current_period_end ?? (s as unknown as { current_period_end?: number }).current_period_end ?? 0;
}

function planFor(s: Stripe.Subscription): "maned" | "ar" {
  const pris = s.items.data[0]?.price;
  if (pris?.id === PRIS_AR) return "ar";
  if (pris?.id === PRIS_MANED) return "maned";
  return pris?.recurring?.interval === "year" ? "ar" : "maned";
}

async function synkroniser(kunde: string) {
  const { data: rad } = await admin.from("betaling").select("bruker_id").eq("stripe_kunde", kunde).maybeSingle();
  let brukerId = rad?.bruker_id as string | undefined;
  if (!brukerId) {
    const k = await stripe!.customers.retrieve(kunde);
    if (!k.deleted) brukerId = k.metadata?.bruker_id;
  }
  if (!brukerId) {
    console.error("Fant ingen bruker for Stripe-kunden", kunde);
    return;
  }

  // Har kunden flere abonnementer, gjelder det aktive med lengst periode.
  const liste = await stripe!.subscriptions.list({ customer: kunde, status: "all", limit: 20 });
  const aktivt = liste.data
    .filter((s) => AKTIVE.includes(s.status))
    .sort((a, b) => periodeslutt(b) - periodeslutt(a))[0];
  const sist = aktivt ?? liste.data[0];
  const til = aktivt ? new Date(periodeslutt(aktivt) * 1000).toISOString() : null;
  const plan = aktivt ? planFor(aktivt) : null;

  const { error: feil1 } = await admin.from("betaling").upsert(
    {
      bruker_id: brukerId,
      stripe_kunde: kunde,
      stripe_abonnement: sist?.id ?? null,
      status: sist?.status ?? null,
      plan: sist ? planFor(sist) : null,
      gjelder_til: sist ? new Date(periodeslutt(sist) * 1000).toISOString() : null,
      oppdatert: new Date().toISOString(),
    },
    { onConflict: "bruker_id" }
  );
  const { error: feil2 } = await admin
    .from("profiles")
    .update({
      abonnement: plan ?? "gratis",
      abonnement_til: til,
      abonnement_avsluttes: aktivt ? aktivt.cancel_at_period_end || !!aktivt.cancel_at : false,
    })
    .eq("id", brukerId);
  if (feil1 || feil2) throw new Error((feil1 ?? feil2)!.message);
  console.log(JSON.stringify({ kunde, abonnement: plan ?? "gratis", status: sist?.status ?? "ingen" }));
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Metode ikke tillatt", { status: 405 });
  if (!stripe || !SIGNERING) return new Response("Ikke satt opp", { status: 503 });

  const signatur = req.headers.get("Stripe-Signature");
  const body = await req.text();
  let hendelse: Stripe.Event;
  try {
    hendelse = await stripe.webhooks.constructEventAsync(body, signatur ?? "", SIGNERING, undefined, krypto);
  } catch {
    return new Response("Ugyldig signatur", { status: 400 });
  }

  const objekt = hendelse.data.object as { customer?: string | { id: string } | null };
  const kunde = typeof objekt.customer === "string" ? objekt.customer : objekt.customer?.id;

  switch (hendelse.type) {
    case "checkout.session.completed":
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
    case "customer.subscription.paused":
    case "customer.subscription.resumed":
    case "invoice.paid":
    case "invoice.payment_failed":
      if (kunde) {
        try {
          await synkroniser(kunde);
        } catch (e) {
          console.error("Synkronisering feilet", e instanceof Error ? e.message : String(e));
          // 500 gjør at Stripe prøver igjen senere.
          return new Response("Feil", { status: 500 });
        }
      }
      break;
  }
  return new Response(JSON.stringify({ mottatt: true }), { headers: { "Content-Type": "application/json" } });
});
