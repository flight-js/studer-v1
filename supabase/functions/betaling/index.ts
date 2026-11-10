// Betaling: starter kjøp av abonnement med Stripe Checkout Elements (kortfelt
// og Apple Pay / Google Pay-knapper bygget inn på Studer), og lar eleven avslutte
// eller fortsette abonnementet. Eleven sendes ikke videre til Stripe.
//
// Funksjonen skriver aldri abonnementet i profiles. Det gjør bare
// «stripe-webhook», etter at Stripe har bekreftet betalingen.
//
// Gratis tid kjøpt med poeng (handling «kreditt») forlenger perioden eleven er
// i: neste betaling flyttes like mange dager frem (trial_end i Stripe, merket
// med metadata «forlenget», så stripe-webhook ikke tar det for en ny
// prøveperiode). Gaver fra venner går ikke gjennom Stripe: vennen løser inn
// gaven i databasen (vennegave_los_inn) og får tilgang uten kort. Starter
// eleven prøveperioden mens gaveuka varer, begynner de 14 dagene først når
// uka er over.
//
// Prøveperiode (14 dager): gis bare hvis kunden aldri har hatt abonnement, og
// kontoen og e-posten ikke har hatt prøveperiode før (tabellen provetid).
// Kortet er ikke kjent før eleven har betalt, så det sjekker webhooken.
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
// Forsøk som aldri ble betalt, teller ikke som et tidligere abonnement.
const ALDRI_STARTET = ["incomplete", "incomplete_expired"];
const PROVEDAGER = 14;

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

// Slutten på perioden ligger på abonnementslinjen i nyere API-versjoner (som i
// stripe-webhook). I prøveperioden er det samme som trial_end.
function periodeslutt(s: Stripe.Subscription): number {
  const linje = s.items.data[0] as unknown as { current_period_end?: number } | undefined;
  const slutt = linje?.current_period_end ?? (s as unknown as { current_period_end?: number }).current_period_end ?? 0;
  return Math.max(slutt, s.trial_end ?? 0);
}

// Den lagrede kunden finnes ikke hvis den er slettet, eller hvis den ble laget
// i testmodus og nøklene nå er live (eller omvendt). Da lages en ny.
async function finnesKunde(id: string | undefined): Promise<boolean> {
  if (!id) return false;
  try {
    const k = await stripe!.customers.retrieve(id);
    return !k.deleted;
  } catch (e) {
    if (e instanceof Stripe.errors.StripeInvalidRequestError && e.code === "resource_missing") return false;
    throw e;
  }
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

  let handling: unknown, plan: unknown, skjema: unknown, belonning: unknown;
  try {
    ({ handling, plan, skjema, belonning } = await req.json());
  } catch {
    return svar(400, { feil: "ugyldig" });
  }

  const admin = createClient(SUPABASE_URL, supabaseNokkel("SECRET"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: rad } = await admin.from("betaling").select("stripe_kunde").eq("bruker_id", brukerId).maybeSingle();
  let kunde = rad?.stripe_kunde as string | undefined;

  try {
    if (kunde && !(await finnesKunde(kunde))) kunde = undefined;

    if (handling === "start") {
      if (plan !== "maned" && plan !== "ar") return svar(400, { feil: "ugyldig" });
      const retur = nettstedet(req);
      if (!retur) return svar(400, { feil: "ugyldig" });

      if (!kunde) {
        const ny = await stripe.customers.create({
          email: typeof claims?.email === "string" ? claims.email : undefined,
          metadata: { bruker_id: brukerId },
        });
        const { error } = rad
          ? await admin
              .from("betaling")
              .update({ stripe_kunde: ny.id, stripe_abonnement: null, status: null, plan: null, gjelder_til: null })
              .eq("bruker_id", brukerId)
          : await admin.from("betaling").insert({ bruker_id: brukerId, stripe_kunde: ny.id });
        if (error) {
          // Et samtidig kall rakk å lage kunden først – bruk den.
          const { data: finnes } = await admin.from("betaling").select("stripe_kunde").eq("bruker_id", brukerId).single();
          kunde = finnes?.stripe_kunde as string;
          await stripe.customers.del(ny.id).catch(() => {});
        } else {
          kunde = ny.id;
        }
      }

      const tidligere = (await stripe.subscriptions.list({ customer: kunde!, status: "all", limit: 20 })).data;
      if (tidligere.some((s) => AKTIVE.includes(s.status))) return svar(409, { feil: "har-abonnement" });

      const { data: ledig, error: provefeil } = await admin.rpc("provetid_tilgjengelig", {
        p_bruker: brukerId,
        p_epost: typeof claims?.email === "string" ? claims.email : null,
      });
      if (provefeil) throw new Error(provefeil.message);
      const provetid = ledig === true && !tidligere.some((s) => !ALDRI_STARTET.includes(s.status));

      // Har eleven en gave fra en venn som varer ennå, starter prøveperioden
      // når gaven er over (trial_end i stedet for 14 dager fra nå), så ingen
      // gratisdager går tapt. Uten kolonnen (før migrasjonen) blir det null.
      let provetidSlutt: number | null = null;
      if (provetid) {
        const { data: profil } = await admin.from("profiles").select("gave_til").eq("id", brukerId).maybeSingle();
        const gaveTil = Date.parse((profil as { gave_til?: string | null } | null)?.gave_til ?? "");
        const fra = gaveTil > Date.now() ? Math.ceil(gaveTil / 1000) : Math.floor(Date.now() / 1000);
        provetidSlutt = fra + PROVEDAGER * 86400;
      }

      const felles = {
        mode: "subscription" as const,
        customer: kunde,
        client_reference_id: brukerId,
        line_items: [{ price: PRISER[plan], quantity: 1 }],
        subscription_data: {
          metadata: { bruker_id: brukerId },
          ...(provetid && {
            trial_end: provetidSlutt!,
            trial_settings: { end_behavior: { missing_payment_method: "cancel" as const } },
          }),
        },
        // Prøveperioden krever kort (også via Apple Pay / Google Pay), så
        // webhooken kan kjenne igjen kortet neste gang.
        ...(provetid && { payment_method_types: ["card" as const], payment_method_collection: "always" as const }),
        metadata: { bruker_id: brukerId },
        locale: "nb" as const,
        // Studer selger selv (ungdomsbedrift uten mva). Managed Payments gjør Stripe
        // til selger og legger på skatt – det er på som standard på nye kontoer.
        managed_payments: { enabled: false },
        // Kort, Apple Pay og Google Pay fullføres inne på siden. Bare betalingsmåter
        // som krever at eleven sendes til banken sin, kommer tilbake hit etterpå.
        return_url: `${retur}/abonnement?betaling=fullfort`,
      };
      // Nettsiden ber om «elements» (egne felt med Apple Pay i alle nettlesere).
      // Eldre versjoner av siden ber ikke om noe og får det innebygde skjemaet,
      // så betalingen virker mens en ny versjon av nettsiden rulles ut.
      const modus = skjema === "elements" ? ["elements", "custom"] : ["embedded_page", "embedded"];
      const ekstra = skjema === "elements" ? {} : { redirect_on_completion: "if_required" };
      let okt: Stripe.Checkout.Session;
      try {
        okt = await stripe.checkout.sessions.create({ ...felles, ...ekstra, ui_mode: modus[0] } as Stripe.Checkout.SessionCreateParams);
      } catch (e) {
        // Eldre API-versjoner bruker de gamle navnene.
        if (!(e instanceof Stripe.errors.StripeInvalidRequestError) || e.param !== "ui_mode") throw e;
        okt = await stripe.checkout.sessions.create({ ...felles, ...ekstra, ui_mode: modus[1] } as unknown as Stripe.Checkout.SessionCreateParams);
      }
      return svar(200, {
        clientSecret: okt.client_secret,
        publishableKey: PUBLISERBAR,
        provetid,
        provetidSlutt: provetidSlutt ? new Date(provetidSlutt * 1000).toISOString() : null,
      });
    }

    // Gratis tid kjøpt med poeng: poengene trekkes i databasen (kreditt_start),
    // så flyttes slutten på perioden – og dermed neste betaling – like mange
    // dager frem. Stripe gjør det med trial_end og proration_behavior «none»:
    // ingen trekk eller tilbakebetaling nå, og senere betalinger kommer på den
    // nye datoen. Feiler Stripe, gis poengene tilbake (kreditt_angre).
    if (handling === "kreditt") {
      if (typeof belonning !== "string" || !/^[0-9a-f-]{36}$/.test(belonning)) return svar(400, { feil: "ugyldig" });
      const abonnement = kunde ? await aktivtAbonnement(kunde) : null;
      if (!abonnement) return svar(409, { feil: "kreditt-uten-abonnement" });
      if (abonnement.cancel_at_period_end || abonnement.cancel_at) return svar(409, { feil: "kreditt-avsluttes" });
      // En betaling som har feilet, skal betales før perioden kan forlenges.
      if (abonnement.status === "past_due") return svar(409, { feil: "kreditt-forfalt" });
      // En ny prøveperiode må være godkjent av stripe-webhook først. Ellers
      // kunne «forlenget» (som webhooken hopper over) kommet før sjekken.
      if (abonnement.status === "trialing" && !abonnement.metadata?.forlenget) {
        const { data: prove } = await admin
          .from("provetid")
          .select("avvist")
          .eq("abonnement_id", abonnement.id)
          .maybeSingle();
        if (!prove || prove.avvist) return svar(409, { feil: "kreditt-vent" });
      }
      const slutt = periodeslutt(abonnement);
      if (!slutt) throw new Error("Fant ikke slutten på perioden");

      const { data: start, error: startfeil } = await admin.rpc("kreditt_start", { p_bruker: brukerId, p_belonning: belonning });
      // Meldingene fra databasen (for få poeng, én gang i måneden …) vises som de er.
      if (startfeil) return svar(422, { feil: "kreditt", melding: startfeil.message });
      const k = (start as { id: string; dager: number; saldo: number }[])[0];
      const nyttSlutt = slutt + k.dager * 86400;
      try {
        await stripe.subscriptions.update(
          abonnement.id,
          {
            trial_end: nyttSlutt,
            proration_behavior: "none",
            // «betalt»: abonnementet var betalt (ikke i prøveperioden), så
            // webhooken skal ikke vise det som prøveperiode i appen.
            metadata: { forlenget: abonnement.status === "trialing" ? "prove" : "betalt" },
          },
          { idempotencyKey: `poeng-${k.id}` }
        );
        const til = new Date(nyttSlutt * 1000).toISOString();
        const { error } = await admin.rpc("kreditt_ferdig", { p_id: k.id, p_stripe_id: abonnement.id, p_til: til });
        if (error) console.error("kreditt_ferdig", error.message); // perioden er forlenget; bare statusen mangler
        return svar(200, { saldo: k.saldo, dager: k.dager, til });
      } catch (e) {
        await admin.rpc("kreditt_angre", { p_id: k.id });
        throw e;
      }
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
