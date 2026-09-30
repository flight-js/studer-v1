"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppBar } from "@/components/AppBar";
import { ArrowRight, LogOut } from "@/components/icons";
import { KreverInnlogging, Laster } from "@/components/Tilstand";
import { useAuth } from "@/lib/auth";
import { PLANNAVN, PROVEDAGER } from "@/lib/priser";
import { KONTAKT_EPOST } from "@/lib/juridisk";
import { datoTekst, harAbonnement, kanProve, type Profil } from "@/lib/profil";
import { supabase } from "@/lib/supabase";

export default function KontoPage() {
  const router = useRouter();
  const { bruker, laster, profil } = useAuth();
  const [loggerUt, setLoggerUt] = useState(false);
  const [slettet, setSlettet] = useState(false);

  async function loggUt() {
    setLoggerUt(true);
    await supabase.auth.signOut();
    router.replace("/");
  }

  return (
    <div className="flex flex-col flex-1">
      <AppBar back="/" backLabel="Hjem" />
      {slettet ? (
        <main id="innhold" className="flex-1 flex flex-col items-center justify-center gap-5 px-5 py-24 text-center rise">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.02em]">Kontoen er slettet</h1>
          <p className="text-lg text-ink-soft max-w-[40ch]">Takk for at du brukte Studer. Du er velkommen tilbake når som helst.</p>
          <Link href="/" className="inline-flex items-center border-[1.5px] border-border-strong px-5 py-3.5 rounded-xl text-sm font-semibold hover:border-foreground transition-colors active:scale-[0.98]">
            Til forsiden
          </Link>
        </main>
      ) : laster ? (
        <Laster tekst="Henter kontoen" />
      ) : !bruker ? (
        <KreverInnlogging tittel="Logg inn" tekst="Logg inn for å se kontoen din." />
      ) : (
        <main id="innhold" className="px-5 sm:px-8 pt-10 pb-20 flex flex-col gap-10 max-w-2xl w-full mx-auto rise">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted">Din konto</p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.02em]">
              Hei{bruker.user_metadata?.navn ? `, ${bruker.user_metadata.navn}` : ""}
            </h1>
          </div>

          <dl className="bg-surface border border-border rounded-2xl divide-y divide-border">
            <Rad navn="E-post" verdi={bruker.email ?? "–"} />
            <Rad
              navn="Medlem siden"
              verdi={new Date(bruker.created_at).toLocaleDateString("nb-NO", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />
            <Rad
              navn="Abonnement"
              verdi={profil ? abonnementTekst(profil) : "…"}
            />
          </dl>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 bg-primary text-white px-5 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98]"
            >
              Fortsett å øve
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/abonnement"
              className="inline-flex items-center border-[1.5px] border-border-strong px-5 py-3.5 rounded-xl text-sm font-semibold hover:border-foreground transition-colors active:scale-[0.98]"
            >
              {harAbonnement(profil)
                ? "Administrer abonnement"
                : kanProve(profil)
                  ? `Prøv gratis i ${PROVEDAGER} dager`
                  : "Kjøp abonnement"}
            </Link>
            <Link
              href="/nytt-passord"
              className="inline-flex items-center border-[1.5px] border-border-strong px-5 py-3.5 rounded-xl text-sm font-semibold hover:border-foreground transition-colors active:scale-[0.98]"
            >
              Bytt passord
            </Link>
            <button
              onClick={loggUt}
              disabled={loggerUt}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-muted hover:text-danger-ink hover:bg-danger-tint transition-colors disabled:opacity-60"
            >
              <LogOut size={16} />
              {loggerUt ? "Logger ut …" : "Logg ut"}
            </button>
          </div>

          <SlettKonto medAbonnement={harAbonnement(profil)} onSlettet={() => setSlettet(true)} />
        </main>
      )}
    </div>
  );
}

function abonnementTekst(p: Profil): string {
  const navn = PLANNAVN[p.abonnement] ?? p.abonnement;
  if (!harAbonnement(p)) return "Gratis – øvingene er låst";
  if (p.provetid_til) {
    return `Prøveperiode (${navn.toLowerCase()}) – ${p.abonnement_avsluttes ? "avsluttes" : "første trekk"} ${datoTekst(p.provetid_til)}`;
  }
  if (!p.abonnement_til) return navn;
  return `${navn} – ${p.abonnement_avsluttes ? "avsluttes" : "fornyes"} ${datoTekst(p.abonnement_til)}`;
}

function Rad({ navn, verdi }: { navn: string; verdi: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-5 sm:px-6 py-4">
      <dt className="text-sm text-muted">{navn}</dt>
      <dd className="font-semibold break-all">{verdi}</dd>
    </div>
  );
}

// Sletter kontoen og alt som hører til den (edge-funksjonen «slett-konto»).
// Eleven må skrive SLETT først, så det ikke skjer ved et uhell.
function SlettKonto({ medAbonnement, onSlettet }: { medAbonnement: boolean; onSlettet: () => void }) {
  const [apen, setApen] = useState(false);
  const [bekreft, setBekreft] = useState("");
  const [sletter, setSletter] = useState(false);
  const [feil, setFeil] = useState<string | null>(null);

  async function slett() {
    setSletter(true);
    setFeil(null);
    const { error } = await supabase.functions.invoke("slett-konto", { body: {} });
    if (error) {
      const res = (error as { context?: unknown }).context;
      const kode = res instanceof Response ? ((await res.json().catch(() => ({}))) as { feil?: string }).feil : undefined;
      setFeil(
        kode === "stripe"
          ? `Fikk ikke avsluttet abonnementet, så kontoen er ikke slettet. Prøv igjen, eller skriv til ${KONTAKT_EPOST}.`
          : "Fikk ikke slettet kontoen. Prøv igjen."
      );
      setSletter(false);
      return;
    }
    // Kontoen finnes ikke lenger på serveren – fjern bare innloggingen i nettleseren.
    await supabase.auth.signOut({ scope: "local" });
    onSlettet();
  }

  return (
    <section aria-labelledby="slett-konto" className="border-t border-border pt-8 flex flex-col gap-3">
      <h2 id="slett-konto" className="font-display text-xl font-semibold">
        Slett konto
      </h2>
      <p className="text-sm text-ink-soft leading-relaxed max-w-[56ch]">
        Kontoen, fremdriften og alt annet som hører til den, slettes for godt.
        {medAbonnement && " Abonnementet avsluttes med en gang, uten refusjon for resten av perioden."}
      </p>
      {!apen ? (
        <button
          onClick={() => setApen(true)}
          className="self-start px-4 py-2.5 -mx-4 rounded-xl text-sm font-semibold text-danger-ink hover:bg-danger-tint transition-colors"
        >
          Slett kontoen
        </button>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (bekreft.trim().toUpperCase() === "SLETT") slett();
          }}
          className="flex flex-col gap-3 bg-danger-tint rounded-2xl p-5 rise"
        >
          <label htmlFor="bekreft-sletting" className="text-sm font-semibold text-danger-ink">
            Skriv SLETT for å bekrefte
          </label>
          <input
            id="bekreft-sletting"
            value={bekreft}
            onChange={(e) => setBekreft(e.target.value)}
            autoComplete="off"
            autoCapitalize="characters"
            autoFocus
            className="w-full max-w-60 bg-surface border-[1.5px] border-border rounded-xl px-4 py-3 text-base font-semibold tracking-wide focus:border-danger transition-colors"
          />
          {feil && (
            <p role="alert" className="text-sm font-medium text-danger-ink">
              {feil}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={sletter || bekreft.trim().toUpperCase() !== "SLETT"}
              className="px-5 py-3 rounded-xl text-sm font-semibold bg-danger text-white hover:brightness-110 transition-[filter] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sletter ? "Sletter …" : "Slett kontoen for godt"}
            </button>
            <button
              type="button"
              onClick={() => {
                setApen(false);
                setBekreft("");
                setFeil(null);
              }}
              className="px-5 py-3 rounded-xl text-sm font-semibold text-foreground hover:bg-surface transition-colors"
            >
              Avbryt
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
