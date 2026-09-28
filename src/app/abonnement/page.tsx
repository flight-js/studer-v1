"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { loadStripe, type StripeEmbeddedCheckout } from "@stripe/stripe-js";
import { AppBar } from "@/components/AppBar";
import { ArrowRight, Check, Lock } from "@/components/icons";
import { Laster } from "@/components/Tilstand";
import { useAuth } from "@/lib/auth";
import { betalingsfeiltekst, endreFornyelse, startBetaling } from "@/lib/betaling";
import { ARLIG_SPARING, ENHET, FORDELER, PLANNAVN, PRIS, type Plan } from "@/lib/priser";
import { datoTekst, harAbonnement, hentProfil, type Profil } from "@/lib/profil";
import { useHent } from "@/lib/useHent";

// Kjøp og administrasjon av abonnement. Betalingsskjemaet fra Stripe vises
// inne på siden (Embedded Checkout). Abonnementet i profilen settes av
// Stripe-webhooken, så etter betaling venter siden til profilen er oppdatert.

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
  const { bruker, laster } = useAuth();
  const [plan, setPlan] = useState<Plan>(params.get("plan") === "maned" ? "maned" : "ar");
  const [steg, setSteg] = useState<Steg>(params.get("betaling") === "fullfort" ? "ferdig" : "velg");
  const [okt, setOkt] = useState<{ clientSecret: string; publishableKey: string } | null>(null);
  const [feil, setFeil] = useState<string | null>(null);
  const [jobber, setJobber] = useState(false);
  const [venter, setVenter] = useState(false);
  const [tokLang, setTokLang] = useState(false);
  const { profil, last, vent } = useProfil(bruker?.id);

  const tilBetaling = async () => {
    setFeil(null);
    setJobber(true);
    try {
      setOkt(await startBetaling(plan));
      setSteg("betal");
    } catch (e) {
      setFeil(betalingsfeiltekst(e));
      last();
    } finally {
      setJobber(false);
    }
  };

  const betalingFullfort = useCallback(async () => {
    setSteg("ferdig");
    setOkt(null);
  }, []);

  // Etter betaling: vent til webhooken har aktivert abonnementet.
  useEffect(() => {
    if (steg !== "ferdig" || !bruker) return;
    let aktiv = true;
    vent(harAbonnement).then((ok) => aktiv && setTokLang(!ok));
    return () => {
      aktiv = false;
    };
  }, [steg, bruker, vent]);

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

  // Etter betaling
  if (steg === "ferdig" && bruker) {
    const aktivt = harAbonnement(profil);
    return (
      <Ramme>
        <div className="flex flex-col items-center text-center gap-5 bg-surface border border-border rounded-3xl px-6 py-12 sm:py-16 rise">
          {aktivt ? (
            <span className="w-14 h-14 rounded-2xl bg-success-tint text-success-ink flex items-center justify-center" aria-hidden="true">
              <Check size={28} />
            </span>
          ) : (
            <Prikker />
          )}
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.02em]" aria-live="polite">
            {aktivt ? "Abonnementet ditt er aktivt" : "Betalingen er gjennomført"}
          </h1>
          <p className="text-ink-soft max-w-[42ch]">
            {aktivt && profil
              ? `Takk! Du har ${PLANNAVN[profil.abonnement].toLowerCase()} abonnement${profil.abonnement_til ? ` til ${datoTekst(profil.abonnement_til)}` : ""}. Kvitteringen kommer på e-post.`
              : tokLang
                ? "Det tar litt lengre tid enn vanlig. Abonnementet dukker opp på kontoen din så snart Stripe har bekreftet betalingen – du kan trygt lukke siden."
                : "Vi aktiverer abonnementet ditt. Det tar bare noen sekunder."}
          </p>
          <Link
            href="/"
            className="group mt-2 inline-flex items-center gap-2 bg-primary text-white px-5 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98]"
          >
            Til startsiden
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Ramme>
    );
  }

  // Har allerede abonnement
  if (bruker && profil && harAbonnement(profil)) {
    const avsluttes = profil.abonnement_avsluttes;
    const dato = profil.abonnement_til ? datoTekst(profil.abonnement_til) : null;
    return (
      <Ramme>
        <Overskrift over="Abonnement" tittel="Ditt abonnement" />
        <div className="flex flex-col gap-6 bg-surface border border-border rounded-3xl p-6 sm:p-8 rise">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <span className="font-display text-3xl font-semibold">{PLANNAVN[profil.abonnement]}</span>
            {(profil.abonnement === "maned" || profil.abonnement === "ar") && (
              <span className="text-ink-soft tabular-nums">
                {PRIS[profil.abonnement]} kr {ENHET[profil.abonnement]}
              </span>
            )}
          </div>
          <p className={`text-sm font-medium ${avsluttes ? "text-danger-ink" : "text-success-ink"}`}>
            {avsluttes
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
            {avsluttes ? (
              <button
                onClick={() => endre("fortsett")}
                disabled={jobber}
                className="mt-4 inline-flex items-center bg-primary text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98] disabled:opacity-60"
              >
                {venter ? "Oppdaterer …" : "Fortsett abonnementet"}
              </button>
            ) : (
              <AvsluttKnapp onBekreft={() => endre("avslutt")} jobber={jobber} venter={venter} dato={dato} />
            )}
          </div>
          {feil && <Feilmelding tekst={feil} />}
        </div>
      </Ramme>
    );
  }

  // Velg plan og betal
  const neste = `/abonnement?plan=${plan}`;
  return (
    <Ramme bred={steg === "betal"}>
      <Overskrift
        over="Abonnement"
        tittel={steg === "betal" ? "Betaling" : "Velg abonnement"}
        tekst={steg === "betal" ? undefined : "Ett abonnement gir tilgang til alt – alle fag, alle trinn."}
      />

      {steg === "betal" && okt ? (
        <div className="flex flex-col gap-4 rise">
          <div className="flex items-center justify-between gap-4 bg-surface border border-border rounded-2xl px-5 py-4">
            <span className="flex flex-col">
              <span className="font-semibold">{PLANNAVN[plan]} abonnement</span>
              <span className="text-sm text-muted tabular-nums">
                {PRIS[plan]} kr {ENHET[plan]}
              </span>
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
            onFullfort={betalingFullfort}
          />
        </div>
      ) : (
        <>
          <div role="radiogroup" aria-label="Abonnement" className="grid sm:grid-cols-2 gap-3 rise">
            {(["maned", "ar"] as const).map((p) => (
              <Planvalg key={p} plan={p} valgt={plan === p} onVelg={() => setPlan(p)} />
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
              {jobber ? "Åpner betaling …" : "Til betaling"}
              {!jobber && <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />}
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/registrer?neste=${encodeURIComponent(neste)}`}
                className="group inline-flex items-center gap-2 bg-primary text-white px-6 py-4 rounded-xl text-base font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98]"
              >
                Lag konto og kjøp
                <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={`/logg-inn?neste=${encodeURIComponent(neste)}`}
                className="inline-flex items-center border-[1.5px] border-border-strong px-5 py-3.5 rounded-xl text-sm font-semibold hover:border-foreground transition-colors active:scale-[0.98]"
              >
                Jeg har konto
              </Link>
            </div>
          )}

          <p className="flex items-start gap-2 text-xs leading-relaxed text-muted max-w-[60ch]">
            <Lock size={14} className="shrink-0 mt-0.5" />
            Abonnementet fornyes automatisk til du avslutter det. Du kan avslutte når som helst og beholder tilgangen ut
            perioden du har betalt for. Betalingen håndteres av Stripe – vi ser aldri kortnummeret ditt.
          </p>
        </>
      )}
    </Ramme>
  );
}

// Henter profilen og kan vente på at webhooken har oppdatert den.
function useProfil(brukerId: string | undefined) {
  const forste = useHent(brukerId ? `profil:${brukerId}` : null, hentProfil);
  const [oppdatert, setOppdatert] = useState<Profil | undefined>(undefined);
  const aktiv = useRef(true);
  const profil = oppdatert ?? (forste.laster ? undefined : (forste.data ?? null));

  const last = useCallback(async () => {
    const p = await hentProfil().catch(() => null);
    if (p && aktiv.current) setOppdatert(p);
    return p;
  }, []);

  const vent = useCallback(
    async (betingelse: (p: Profil) => boolean) => {
      for (let i = 0; i < 15 && aktiv.current; i++) {
        const p = await last();
        if (p && betingelse(p)) return true;
        await new Promise((r) => setTimeout(r, 2000));
      }
      return false;
    },
    [last]
  );

  useEffect(() => {
    aktiv.current = true;
    return () => {
      aktiv.current = false;
    };
  }, []);

  return { profil, last, vent };
}

function Betalingsskjema({
  clientSecret,
  publishableKey,
  onFullfort,
}: {
  clientSecret: string;
  publishableKey: string;
  onFullfort: () => void;
}) {
  const beholder = useRef<HTMLDivElement>(null);
  const fullfort = useRef(onFullfort);
  const [status, setStatus] = useState<"laster" | "klar" | "feil">("laster");

  useEffect(() => {
    fullfort.current = onFullfort;
  }, [onFullfort]);

  useEffect(() => {
    let checkout: StripeEmbeddedCheckout | null = null;
    let avbrutt = false;
    (async () => {
      const stripe = await loadStripe(publishableKey);
      if (!stripe || avbrutt) throw new Error("Stripe lastet ikke");
      const ny = await stripe.createEmbeddedCheckoutPage({
        fetchClientSecret: async () => clientSecret,
        onComplete: () => fullfort.current(),
      });
      if (avbrutt) {
        ny.destroy();
        return;
      }
      checkout = ny;
      if (beholder.current) checkout.mount(beholder.current);
      setStatus("klar");
    })().catch(() => !avbrutt && setStatus("feil"));
    return () => {
      avbrutt = true;
      checkout?.destroy();
    };
  }, [clientSecret, publishableKey]);

  return (
    <div className="relative min-h-[32rem] bg-surface border border-border rounded-3xl overflow-hidden">
      {status === "laster" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Laster tekst="Åpner betalingen" />
        </div>
      )}
      {status === "feil" && (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <Feilmelding tekst="Fikk ikke åpnet betalingen. Sjekk nettet, slå av eventuelle blokkere for annonser og prøv igjen." />
        </div>
      )}
      <div ref={beholder} className="p-2 sm:p-4" />
    </div>
  );
}

function Planvalg({ plan, valgt, onVelg }: { plan: Plan; valgt: boolean; onVelg: () => void }) {
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
}: {
  onBekreft: () => void;
  jobber: boolean;
  venter: boolean;
  dato: string | null;
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
        Vil du avslutte? Abonnementet fornyes ikke, og du beholder tilgangen{dato ? ` til ${dato}` : " ut perioden"}.
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
