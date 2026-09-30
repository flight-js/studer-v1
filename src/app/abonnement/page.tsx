"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import {
  loadStripe,
  type Appearance,
  type StripeCheckoutLoadActionsSuccess,
  type StripeExpressCheckoutElement,
} from "@stripe/stripe-js";
import { AppBar } from "@/components/AppBar";
import { ArrowRight, Check, Lock } from "@/components/icons";
import { Laster } from "@/components/Tilstand";
import { useAuth } from "@/lib/auth";
import {
  betalingsfeiltekst,
  endreFornyelse,
  startBetaling,
  tryggNeste,
  type Betalingsokt,
} from "@/lib/betaling";
import { ARLIG_SPARING, ENHET, FORDELER, PLANNAVN, PRIS, PROVEDAGER, type Plan } from "@/lib/priser";
import { datoTekst, harAbonnement, kanProve, type Profil } from "@/lib/profil";

// Kjøp og administrasjon av abonnement. Betalingsskjemaet bygges av Stripes
// Checkout Elements inne på siden: Apple Pay / Google Pay-knapper og kortfelt.
// Nye kunder får 14 dager gratis – det avgjør serveren. Abonnementet i profilen
// settes av Stripe-webhooken, så etter betaling venter siden til profilen er oppdatert.

export default function AbonnementPage() {
  return (
    <div className="flex flex-col flex-1">
      <AppBar back="/" backLabel="Hjem" />
      <Suspense fallback={<Laster />}>
        <Abonnement />
      </Suspense>
    </div>
  );
}

type Steg = "velg" | "betal" | "ferdig";

function Abonnement() {
  const params = useSearchParams();
  const { bruker, laster, profil, oppfriskProfil } = useAuth();
  const [plan, setPlan] = useState<Plan>(params.get("plan") === "maned" ? "maned" : "ar");
  const [steg, setSteg] = useState<Steg>(params.get("betaling") === "fullfort" ? "ferdig" : "velg");
  const [okt, setOkt] = useState<Betalingsokt | null>(null);
  // Når prøveperioden i økten slutter, og om kjøpet som nettopp ble gjort, var en prøveperiode.
  const [provetidSlutt, setProvetidSlutt] = useState<string | null>(null);
  const [provetidKjop, setProvetidKjop] = useState(false);
  const [feil, setFeil] = useState<string | null>(null);
  const [jobber, setJobber] = useState(false);
  const [venter, setVenter] = useState(false);
  const [tokLang, setTokLang] = useState(false);
  const vent = useVentPaProfil();
  const neste = tryggNeste(params.get("neste"));
  // Uten konto vet vi ikke ennå – de aller fleste nye kan prøve gratis.
  const visProve = bruker ? kanProve(profil) : true;

  const tilBetaling = async () => {
    setFeil(null);
    setJobber(true);
    try {
      const ny = await startBetaling(plan);
      setProvetidSlutt(new Date(Date.now() + PROVEDAGER * 86_400_000).toISOString());
      setOkt(ny);
      setSteg("betal");
    } catch (e) {
      setFeil(betalingsfeiltekst(e));
      oppfriskProfil();
    } finally {
      setJobber(false);
    }
  };

  const betalingFullfort = useCallback(() => {
    setProvetidKjop(okt?.provetid ?? false);
    setSteg("ferdig");
    setOkt(null);
  }, [okt]);

  // Etter betaling: vent til webhooken har aktivert abonnementet – eller avvist
  // prøveperioden fordi kortet, e-posten eller kontoen har hatt en før.
  useEffect(() => {
    if (steg !== "ferdig" || !bruker) return;
    let aktiv = true;
    vent((p) => harAbonnement(p) || (provetidKjop && p.provetid_brukt)).then((ok) => aktiv && setTokLang(!ok));
    return () => {
      aktiv = false;
    };
  }, [steg, bruker, vent, provetidKjop]);

  const endre = async (handling: "avslutt" | "fortsett") => {
    setFeil(null);
    setJobber(true);
    try {
      await endreFornyelse(handling);
      setVenter(true);
      await vent((p) => p.abonnement_avsluttes === (handling === "avslutt"));
    } catch (e) {
      setFeil(betalingsfeiltekst(e));
    } finally {
      setVenter(false);
      setJobber(false);
    }
  };

  if (laster || (bruker && profil === undefined)) return <Laster />;

  const fortsett = (
    <Link
      href={neste ?? "/"}
      className="group inline-flex items-center gap-2 bg-primary text-white px-5 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98]"
    >
      {neste ? "Fortsett" : "Til startsiden"}
      <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
    </Link>
  );

  // Etter betaling
  if (steg === "ferdig" && bruker) {
    const aktivt = harAbonnement(profil);
    const avvist = !aktivt && provetidKjop && !!profil?.provetid_brukt;
    const p = profil?.abonnement === "maned" || profil?.abonnement === "ar" ? profil.abonnement : plan;
    return (
      <Ramme>
        <div className="flex flex-col items-center text-center gap-5 bg-surface border border-border rounded-3xl px-6 py-12 sm:py-16 rise">
          {aktivt ? (
            <span className="w-14 h-14 rounded-2xl bg-success-tint text-success-ink flex items-center justify-center" aria-hidden="true">
              <Check size={28} />
            </span>
          ) : avvist ? (
            <span className="w-14 h-14 rounded-2xl bg-sunken text-muted flex items-center justify-center" aria-hidden="true">
              <Lock size={24} />
            </span>
          ) : (
            <Prikker />
          )}
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.02em]" aria-live="polite">
            {aktivt
              ? profil?.provetid_til
                ? "Prøveperioden har startet"
                : "Abonnementet ditt er aktivt"
              : avvist
                ? "Prøveperioden ble ikke startet"
                : provetidKjop
                  ? "Kortet er registrert"
                  : "Betalingen er gjennomført"}
          </h1>
          <p className="text-ink-soft max-w-[44ch]">
            {aktivt && profil?.provetid_til
              ? `Du har tilgang til alt fram til ${datoTekst(profil.provetid_til)}. Da trekkes ${PRIS[p]} kr ${ENHET[p]} automatisk – avslutter du før, betaler du ingenting.`
              : aktivt && profil
                ? `Takk! Du har ${PLANNAVN[profil.abonnement].toLowerCase()} abonnement${profil.abonnement_til ? ` til ${datoTekst(profil.abonnement_til)}` : ""}. Kvitteringen kommer på e-post.`
                : avvist
                  ? "Kortet, e-posten eller kontoen har allerede vært brukt til en prøveperiode, så du fikk ikke en ny. Du er ikke belastet. Du kan fortsatt kjøpe abonnement – da starter det i dag."
                  : tokLang
                    ? "Det tar litt lengre tid enn vanlig. Abonnementet dukker opp på kontoen din så snart Stripe har bekreftet det – du kan trygt lukke siden."
                    : "Vi aktiverer abonnementet ditt. Det tar bare noen sekunder."}
          </p>
          {avvist ? (
            <button
              onClick={() => {
                setProvetidKjop(false);
                setSteg("velg");
              }}
              className="group mt-2 inline-flex items-center gap-2 bg-primary text-white px-5 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98]"
            >
              Velg abonnement
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          ) : (
            <div className="mt-2">{fortsett}</div>
          )}
        </div>
      </Ramme>
    );
  }

  // Har allerede abonnement (eller prøveperiode)
  if (bruker && profil && harAbonnement(profil)) {
    const avsluttes = profil.abonnement_avsluttes;
    const dato = profil.abonnement_til ? datoTekst(profil.abonnement_til) : null;
    const prove = profil.provetid_til ? datoTekst(profil.provetid_til) : null;
    const p = profil.abonnement === "maned" || profil.abonnement === "ar" ? profil.abonnement : null;
    return (
      <Ramme>
        <Overskrift over="Abonnement" tittel="Ditt abonnement" />
        <div className="flex flex-col gap-6 bg-surface border border-border rounded-3xl p-6 sm:p-8 rise">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <span className="flex items-center gap-3">
              <span className="font-display text-3xl font-semibold">{PLANNAVN[profil.abonnement]}</span>
              {prove && (
                <span className="text-xs font-semibold bg-primary-tint text-primary-dark px-2.5 py-1 rounded-md">
                  Prøveperiode
                </span>
              )}
            </span>
            {p && (
              <span className="text-ink-soft tabular-nums">
                {PRIS[p]} kr {ENHET[p]}
              </span>
            )}
          </div>
          <p className={`text-sm font-medium ${avsluttes ? "text-danger-ink" : "text-success-ink"}`}>
            {prove
              ? avsluttes
                ? `Prøveperioden avsluttes ${prove}. Du blir ikke belastet, og har tilgang fram til da.`
                : `Gratis til ${prove}. Da trekkes ${p ? `${PRIS[p]} kr` : "abonnementet"} for første gang.`
              : avsluttes
                ? `Avsluttes${dato ? ` ${dato}` : ""}. Du har tilgang fram til da.`
                : `Aktivt${dato ? ` – fornyes automatisk ${dato}` : ""}.`}
          </p>
          <ul className="flex flex-col gap-2.5 text-sm text-ink-soft">
            {FORDELER.map((f) => (
              <li key={f} className="flex items-center gap-2.5">
                <Check size={16} className="text-primary" />
                {f}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border">
            {neste && <div className="mt-4">{fortsett}</div>}
            {avsluttes ? (
              <button
                onClick={() => endre("fortsett")}
                disabled={jobber}
                className="mt-4 inline-flex items-center bg-primary text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98] disabled:opacity-60"
              >
                {venter ? "Oppdaterer …" : "Fortsett abonnementet"}
              </button>
            ) : (
              <AvsluttKnapp
                onBekreft={() => endre("avslutt")}
                jobber={jobber}
                venter={venter}
                dato={prove ?? dato}
                prove={!!prove}
              />
            )}
          </div>
          {feil && <Feilmelding tekst={feil} />}
        </div>
      </Ramme>
    );
  }

  // Velg plan og betal
  const tilbakeHit = `/abonnement?plan=${plan}${neste ? `&neste=${encodeURIComponent(neste)}` : ""}`;
  return (
    <Ramme bred={steg === "betal"}>
      <Overskrift
        over="Abonnement"
        tittel={
          steg === "betal"
            ? okt?.provetid
              ? "Start prøveperioden"
              : "Betaling"
            : visProve
              ? `Prøv gratis i ${PROVEDAGER} dager`
              : "Velg abonnement"
        }
        tekst={
          steg === "betal"
            ? undefined
            : visProve
              ? "Du får tilgang til alt med en gang og betaler ingenting før prøveperioden er over. Avslutt når som helst."
              : "Ett abonnement gir tilgang til alt – alle fag, alle trinn."
        }
      />

      {steg === "betal" && okt ? (
        <div className="flex flex-col gap-4 rise">
          <div className="flex items-center justify-between gap-4 bg-surface border border-border rounded-2xl px-5 py-4">
            <span className="flex flex-col gap-0.5">
              <span className="font-semibold">{PLANNAVN[plan]} abonnement</span>
              <span className="text-sm text-muted tabular-nums">
                {okt.provetid && provetidSlutt
                  ? `0 kr i dag – deretter ${PRIS[plan]} kr ${ENHET[plan]} fra ${datoTekst(provetidSlutt)}`
                  : `${PRIS[plan]} kr ${ENHET[plan]}`}
              </span>
              {visProve && !okt.provetid && (
                <span className="text-sm text-ink-soft">
                  Du har hatt prøveperiode før, så abonnementet starter i dag.
                </span>
              )}
            </span>
            <button
              onClick={() => {
                setSteg("velg");
                setOkt(null);
              }}
              className="px-3 py-2 rounded-lg text-sm font-medium text-ink-soft hover:text-foreground hover:bg-sunken transition-colors"
            >
              Endre
            </button>
          </div>
          <Betalingsskjema
            clientSecret={okt.clientSecret}
            publishableKey={okt.publishableKey}
            knapp={okt.provetid ? "Start prøveperioden" : `Betal ${PRIS[plan]} kr`}
            onFullfort={betalingFullfort}
          />
          {okt.provetid && provetidSlutt && (
            <p className="text-xs leading-relaxed text-muted max-w-[60ch]">
              Du betaler ingenting nå. {datoTekst(provetidSlutt)} trekkes {PRIS[plan]} kr {ENHET[plan]}, og abonnementet
              fortsetter til du avslutter det. Avslutter du før prøveperioden er over, blir du ikke belastet.
            </p>
          )}
        </div>
      ) : (
        <>
          <div role="radiogroup" aria-label="Abonnement" className="grid sm:grid-cols-2 gap-3 rise">
            {(["maned", "ar"] as const).map((p) => (
              <Planvalg key={p} plan={p} valgt={plan === p} prove={visProve} onVelg={() => setPlan(p)} />
            ))}
          </div>

          <ul className="flex flex-col gap-2.5 text-sm text-ink-soft">
            {FORDELER.map((f) => (
              <li key={f} className="flex items-center gap-2.5">
                <Check size={16} className="text-primary" />
                {f}
              </li>
            ))}
          </ul>

          {feil && <Feilmelding tekst={feil} />}

          {bruker ? (
            <button
              onClick={tilBetaling}
              disabled={jobber}
              className="group self-start inline-flex items-center gap-2 bg-primary text-white px-6 py-4 rounded-xl text-base font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98] disabled:opacity-60"
            >
              {jobber ? "Åpner betaling …" : visProve ? "Start gratis prøveperiode" : "Til betaling"}
              {!jobber && <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />}
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/registrer?neste=${encodeURIComponent(tilbakeHit)}`}
                className="group inline-flex items-center gap-2 bg-primary text-white px-6 py-4 rounded-xl text-base font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98]"
              >
                Lag konto og prøv gratis
                <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={`/logg-inn?neste=${encodeURIComponent(tilbakeHit)}`}
                className="inline-flex items-center border-[1.5px] border-border-strong px-5 py-3.5 rounded-xl text-sm font-semibold hover:border-foreground transition-colors active:scale-[0.98]"
              >
                Jeg har konto
              </Link>
            </div>
          )}

          <p className="flex items-start gap-2 text-xs leading-relaxed text-muted max-w-[60ch]">
            <Lock size={14} className="shrink-0 mt-0.5" />
            <span>
              {visProve &&
                `Du legger inn kort nå, men betaler ingenting de første ${PROVEDAGER} dagene. Avslutter du før prøveperioden er over, blir du ikke belastet – ellers fortsetter abonnementet automatisk. Prøveperioden gjelder én gang per person og per kort. `}
              {!visProve &&
                "Abonnementet fornyes automatisk til du avslutter det. Du kan avslutte når som helst og beholder tilgangen ut perioden du har betalt for. "}
              Betalingen håndteres av Stripe – vi ser aldri kortnummeret ditt.
            </span>
          </p>
        </>
      )}
    </Ramme>
  );
}

// Venter på at webhooken har oppdatert profilen: henter den på nytt hvert
// andre sekund i opptil 30 sekunder.
function useVentPaProfil() {
  const { oppfriskProfil } = useAuth();
  const aktiv = useRef(true);

  useEffect(() => {
    aktiv.current = true;
    return () => {
      aktiv.current = false;
    };
  }, []);

  return useCallback(
    async (betingelse: (p: Profil) => boolean) => {
      for (let i = 0; i < 15 && aktiv.current; i++) {
        const p = await oppfriskProfil();
        if (p && betingelse(p)) return true;
        await new Promise((r) => setTimeout(r, 2000));
      }
      return false;
    },
    [oppfriskProfil]
  );
}

// Stripe-feltene skal se ut som resten av Studer.
const UTSEENDE: Appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#2c4bd4",
    colorBackground: "#fffdf9",
    colorText: "#1b1a2e",
    colorTextSecondary: "#6b6760",
    colorDanger: "#c43d3d",
    fontFamily: '"Instrument Sans", ui-sans-serif, system-ui, sans-serif',
    fontSizeBase: "15px",
    borderRadius: "12px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": { borderColor: "#d3ccbd", boxShadow: "none" },
    ".Input:focus": { borderColor: "#2c4bd4", boxShadow: "0 0 0 3px rgba(44, 75, 212, 0.15)" },
    ".Tab": { borderColor: "#d3ccbd", boxShadow: "none" },
  },
};

// «ready» melder { applePay: true, … }, «availablepaymentmethodschange» { applePay: { available: true }, … }.
type Lommeboker = Record<string, boolean | { available: boolean } | undefined>;
const noenTilgjengelige = (metoder: Lommeboker | undefined) =>
  !!metoder && Object.values(metoder).some((m) => (typeof m === "boolean" ? m : !!m?.available));

function Betalingsskjema({
  clientSecret,
  publishableKey,
  knapp,
  onFullfort,
}: {
  clientSecret: string;
  publishableKey: string;
  knapp: string;
  onFullfort: () => void;
}) {
  const ekspressBeholder = useRef<HTMLDivElement>(null);
  const kortBeholder = useRef<HTMLDivElement>(null);
  const handlinger = useRef<StripeCheckoutLoadActionsSuccess | null>(null);
  const fullfort = useRef(onFullfort);
  const [status, setStatus] = useState<"laster" | "klar" | "feil">("laster");
  const [harEkspress, setHarEkspress] = useState(false);
  const [kanBetale, setKanBetale] = useState(false);
  const [betaler, setBetaler] = useState(false);
  const [feil, setFeil] = useState<string | null>(null);

  useEffect(() => {
    fullfort.current = onFullfort;
  }, [onFullfort]);

  useEffect(() => {
    let avbrutt = false;
    const rydd: Array<() => void> = [];
    (async () => {
      const stripe = await loadStripe(publishableKey);
      if (!stripe || avbrutt) throw new Error("Stripe lastet ikke");
      const checkout = stripe.initCheckoutElementsSdk({
        clientSecret,
        elementsOptions: {
          appearance: UTSEENDE,
          fonts: [{ cssSrc: "https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&display=swap" }],
        },
      });
      checkout.on("change", (okt) => !avbrutt && setKanBetale(okt.canConfirm));
      const lastet = await checkout.loadActions();
      if (lastet.type === "error") throw new Error(lastet.error.message);
      if (avbrutt) return;
      handlinger.current = lastet.actions;
      setKanBetale(lastet.actions.getSession().canConfirm);

      // Apple Pay og Google Pay som egne knapper. «always» gjør at Apple Pay også
      // vises i Chrome, Edge og Firefox – da betaler eleven ved å skanne en QR-kode
      // med iPhonen.
      const ekspress = checkout.createExpressCheckoutElement({
        buttonHeight: 48,
        buttonTheme: undefined,
        buttonType: { applePay: "subscribe", googlePay: "subscribe" },
        // maxRows 0 = ingen grense. Stripe godtar bare overflow «never» sammen med det.
        layout: { maxColumns: 2, maxRows: 0, overflow: "never" },
        paymentMethodOrder: undefined,
        paymentMethods: { applePay: "always", googlePay: "always", link: "never", paypal: "never", klarna: "never", amazonPay: "never" },
      });
      const visKnapper = (metoder: Lommeboker | undefined) => !avbrutt && setHarEkspress(noenTilgjengelige(metoder));
      ekspress.on("ready", ({ availablePaymentMethods }) => visKnapper(availablePaymentMethods));
      // Stripe kan finne lommebøkene først etter «ready». Hendelsen finnes, men
      // mangler i typene til Checkout-versjonen av elementet.
      (ekspress as unknown as StripeExpressCheckoutElement).on("availablepaymentmethodschange", ({ paymentMethods }) =>
        visKnapper(paymentMethods),
      );
      ekspress.on("loaderror", ({ error }) => console.warn("Apple Pay / Google Pay lastet ikke:", error.message));
      ekspress.on("confirm", async (hendelse) => {
        setFeil(null);
        const svar = await lastet.actions.confirm({ expressCheckoutConfirmEvent: hendelse, redirect: "if_required" });
        if (svar.type === "error") setFeil(svar.error.message ?? "Betalingen ble ikke gjennomført.");
        else fullfort.current();
      });
      if (ekspressBeholder.current) ekspress.mount(ekspressBeholder.current);
      rydd.push(() => ekspress.destroy());

      const kort = checkout.createPaymentElement({
        layout: "tabs",
        // Apple Pay og Google Pay ligger i knapperaden over. Link («Lagre informasjonen
        // min») ber om mobilnummer og navn og er tatt bort.
        wallets: { applePay: "never", googlePay: "never", link: "never" },
      });
      if (kortBeholder.current) kort.mount(kortBeholder.current);
      rydd.push(() => kort.destroy());
      setStatus("klar");
    })().catch(() => !avbrutt && setStatus("feil"));
    return () => {
      avbrutt = true;
      rydd.forEach((f) => f());
    };
  }, [clientSecret, publishableKey]);

  const betal = async () => {
    if (!handlinger.current) return;
    setFeil(null);
    setBetaler(true);
    const svar = await handlinger.current.confirm({ redirect: "if_required" });
    setBetaler(false);
    if (svar.type === "error") setFeil(svar.error.message ?? "Betalingen ble ikke gjennomført.");
    else fullfort.current();
  };

  return (
    <div className="relative flex flex-col gap-5 bg-surface border border-border rounded-3xl p-5 sm:p-7 min-h-[22rem]">
      {status === "laster" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Laster tekst="Åpner betalingen" />
        </div>
      )}
      {status === "feil" ? (
        <Feilmelding tekst="Fikk ikke åpnet betalingen. Sjekk nettet, slå av eventuelle blokkere for annonser og prøv igjen." />
      ) : (
        <div className={`flex flex-col gap-5 transition-opacity duration-300 ${status === "klar" ? "opacity-100" : "opacity-0"}`}>
          {/* Ikke display:none – Stripe måler bredden for å vite hvor mange knapper som får plass. */}
          <div ref={ekspressBeholder} className={harEkspress ? "" : "invisible h-0 overflow-hidden"} />
          {harEkspress && (
            <div className="flex items-center gap-3 text-xs font-medium text-muted" aria-hidden="true">
              <span className="h-px flex-1 bg-border" />
              eller betal med kort
              <span className="h-px flex-1 bg-border" />
            </div>
          )}
          <div ref={kortBeholder} />
          {feil && <Feilmelding tekst={feil} />}
          <button
            onClick={betal}
            disabled={!kanBetale || betaler}
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-4 rounded-xl text-base font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Lock size={16} />
            {betaler ? "Behandler …" : knapp}
          </button>
          <p className="text-xs text-muted leading-relaxed text-center">
            Abonnementet fornyes automatisk til du avslutter det, og du kan avslutte når som helst under Min konto. Ved å
            betale godtar du{" "}
            <Link href="/vilkar" className="font-semibold text-foreground underline underline-offset-2">
              bruksvilkårene
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}

function Planvalg({
  plan,
  valgt,
  prove,
  onVelg,
}: {
  plan: Plan;
  valgt: boolean;
  prove: boolean;
  onVelg: () => void;
}) {
  return (
    <button
      role="radio"
      aria-checked={valgt}
      onClick={onVelg}
      className={`flex flex-col gap-4 text-left rounded-2xl p-5 sm:p-6 border-[1.5px] transition-[border-color,background-color,transform] duration-200 active:scale-[0.99] ${
        valgt ? "bg-primary-tint border-primary" : "bg-surface border-border hover:border-border-strong"
      }`}
    >
      <span className="flex items-center justify-between gap-3 h-6">
        <span className={`text-sm font-semibold ${valgt ? "text-primary-dark" : "text-muted"}`}>{PLANNAVN[plan]}</span>
        {plan === "ar" && (
          <span className="text-xs font-semibold bg-primary text-white px-2.5 py-1 rounded-md">Spar {ARLIG_SPARING} kr</span>
        )}
      </span>
      <span className="flex items-baseline gap-1.5">
        <span className="font-display text-4xl font-semibold tabular-nums tracking-[-0.02em]">{PRIS[plan]} kr</span>
        <span className="text-sm text-muted">{ENHET[plan]}</span>
      </span>
      {prove && (
        <span className={`text-sm font-semibold -mt-2 ${valgt ? "text-primary-dark" : "text-foreground"}`}>
          Første {PROVEDAGER} dager gratis
        </span>
      )}
      <span className="text-xs text-muted tabular-nums">
        {plan === "ar"
          ? `Tilsvarer ${(PRIS.ar / 12).toFixed(2).replace(".", ",")} kr i måneden`
          : "Avslutt når som helst"}
      </span>
    </button>
  );
}

function AvsluttKnapp({
  onBekreft,
  jobber,
  venter,
  dato,
  prove,
}: {
  onBekreft: () => void;
  jobber: boolean;
  venter: boolean;
  dato: string | null;
  prove: boolean;
}) {
  const [sikker, setSikker] = useState(false);
  if (!sikker) {
    return (
      <button
        onClick={() => setSikker(true)}
        className="mt-4 inline-flex items-center px-5 py-3 rounded-xl text-sm font-semibold text-muted hover:text-danger-ink hover:bg-danger-tint transition-colors"
      >
        Avslutt abonnementet
      </button>
    );
  }
  return (
    <div className="mt-4 flex flex-col gap-3 w-full">
      <p className="text-sm text-ink-soft">
        {prove
          ? `Vil du avslutte? Du blir ikke belastet, og beholder tilgangen${dato ? ` til ${dato}` : " ut prøveperioden"}.`
          : `Vil du avslutte? Abonnementet fornyes ikke, og du beholder tilgangen${dato ? ` til ${dato}` : " ut perioden"}.`}
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onBekreft}
          disabled={jobber}
          className="inline-flex items-center px-5 py-3 rounded-xl text-sm font-semibold bg-danger text-white hover:brightness-110 transition-[filter] disabled:opacity-60"
        >
          {venter ? "Avslutter …" : "Ja, avslutt"}
        </button>
        <button
          onClick={() => setSikker(false)}
          disabled={jobber}
          className="inline-flex items-center border-[1.5px] border-border-strong px-5 py-3 rounded-xl text-sm font-semibold hover:border-foreground transition-colors disabled:opacity-60"
        >
          Behold abonnementet
        </button>
      </div>
    </div>
  );
}

function Ramme({ children, bred }: { children: React.ReactNode; bred?: boolean }) {
  return (
    <main
      id="innhold"
      className={`px-5 sm:px-8 pt-10 sm:pt-14 pb-20 flex flex-col gap-8 w-full mx-auto ${bred ? "max-w-3xl" : "max-w-2xl"}`}
    >
      {children}
    </main>
  );
}

function Overskrift({ over, tittel, tekst }: { over: string; tittel: string; tekst?: string }) {
  return (
    <div className="flex flex-col gap-3 rise">
      <p className="text-sm font-medium text-muted">{over}</p>
      <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.025em] leading-[1.05]">{tittel}</h1>
      {tekst && <p className="text-lg text-ink-soft max-w-[44ch]">{tekst}</p>}
    </div>
  );
}

function Feilmelding({ tekst }: { tekst: string }) {
  return (
    <p role="alert" className="text-sm font-medium text-danger-ink bg-danger-tint rounded-xl px-4 py-3">
      {tekst}
    </p>
  );
}

function Prikker() {
  return (
    <span className="flex gap-1.5 h-14 items-center" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-primary/60 animate-pulse"
          style={{ animationDelay: `${i * 160}ms` }}
        />
      ))}
    </span>
  );
}
