// Mottar hendelser fra Stripe og holder abonnementet i profiles oppdatert.
// Dette er det eneste stedet abonnementet skrives. Hver forespørsel må ha en
// gyldig signatur fra Stripe, ellers avvises den.
//
// Funksjonen henter alltid ferske data fra Stripe i stedet for å stole på
// innholdet i hendelsen, så rekkefølgen hendelsene kommer i, spiller ingen rolle.
//
// Prøveperioder sjekkes før abonnementet gis: har kontoen, e-posten eller
// kortet hatt prøveperiode før, avsluttes det nye abonnementet med en gang.
// Eleven er ikke belastet – prøveperioden koster 0 kr.
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
const ALDRI_STARTET = ["incomplete", "incomplete_expired"];

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

async function finnBruker(kunde: string): Promise<string | undefined> {
  const { data: rad } = await admin.from("betaling").select("bruker_id").eq("stripe_kunde", kunde).maybeSingle();
  if (rad?.bruker_id) return rad.bruker_id as string;
  const k = await stripe!.customers.retrieve(kunde);
  return k.deleted ? undefined : k.metadata?.bruker_id;
}

async function kortFingeravtrykk(s: Stripe.Subscription, kunde: string): Promise<string | null> {
  const pm = s.default_payment_method;
  if (pm && typeof pm === "object") return pm.card?.fingerprint ?? null;
  const kort = await stripe!.paymentMethods.list({ customer: kunde, type: "card", limit: 1 });
  return kort.data[0]?.card?.fingerprint ?? null;
}

async function sjekkProvetider(kunde: string, brukerId: string, epost: string | null) {
  const liste = await stripe!.subscriptions.list({
    customer: kunde,
    status: "trialing",
    limit: 10,
    expand: ["data.default_payment_method"],
  });
  for (const s of liste.data) {
    const { data: godkjent, error } = await admin.rpc("provetid_registrer", {
      p_abonnement: s.id,
      p_bruker: brukerId,
      p_epost: epost,
      p_kort: await kortFingeravtrykk(s, kunde),
    });
    if (error) throw new Error(error.message);
    if (godkjent === false) {
      // To hendelser for samme kjøp kan komme samtidig – da er det kanskje avsluttet allerede.
      await stripe!.subscriptions.cancel(s.id).catch(async (e) => {
        if ((await stripe!.subscriptions.retrieve(s.id)).status !== "canceled") throw e;
      });
      console.log(JSON.stringify({ kunde, provetid: "avvist" }));
    }
  }
}

async function synkroniser(kunde: string, brukerId: string, epost: string | null) {
  // Har kunden flere abonnementer, gjelder det aktive med lengst periode.
  const liste = await stripe!.subscriptions.list({ customer: kunde, status: "all", limit: 20 });
  const aktivt = liste.data
    .filter((s) => AKTIVE.includes(s.status))
    .sort((a, b) => periodeslutt(b) - periodeslutt(a))[0];
  const sist = aktivt ?? liste.data[0];
  const til = aktivt ? new Date(periodeslutt(aktivt) * 1000).toISOString() : null;
  const plan = aktivt ? planFor(aktivt) : null;
  const provetidTil =
    aktivt?.status === "trialing" && aktivt.trial_end ? new Date(aktivt.trial_end * 1000).toISOString() : null;

  // Brukt = har hatt abonnement før, eller kontoen / e-posten har hatt prøveperiode.
  const { data: ledig, error: feil0 } = await admin.rpc("provetid_tilgjengelig", { p_bruker: brukerId, p_epost: epost });
  if (feil0) throw new Error(feil0.message);
  const provetidBrukt = ledig !== true || liste.data.some((s) => !ALDRI_STARTET.includes(s.status));

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
      provetid_til: provetidTil,
      provetid_brukt: provetidBrukt,
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
          const brukerId = await finnBruker(kunde);
          if (!brukerId) {
            console.error("Fant ingen bruker for Stripe-kunden", kunde);
            break;
          }
          const { data } = await admin.auth.admin.getUserById(brukerId);
          const epost = data.user?.email ?? null;
          // Først prøveperioden, så abonnementet – et avvist abonnement gir aldri tilgang.
          await sjekkProvetider(kunde, brukerId, epost);
          await synkroniser(kunde, brukerId, epost);
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
