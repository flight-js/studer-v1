"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProfilKnapp } from "@/components/AppBar";
import { Bunnlenker } from "@/components/Bunnlenker";
import { Bevegelse } from "@/components/forside/Bevegelse";
import { Ordtittel } from "@/components/forside/Ordtittel";
import { Fortsett } from "@/components/hjem/Fortsett";
import { Logo } from "@/components/Logo";
import { ArrowRight } from "@/components/icons";
import { Abonnementskort } from "@/components/Las";
import { useAuth } from "@/lib/auth";
import { hentKatalog, hentSisteTemaer } from "@/lib/pensum";
import { lagreTrinn } from "@/lib/profil";
import { useHent } from "@/lib/useHent";

// Startsiden for innloggede, i samme natt–dag-rytme som forsiden: øverst
// pulten med lampa på det man øvde på sist (se hjem/Fortsett.tsx), under det
// fagene på trinnet man går på.
export function Hjem() {
  const { bruker, profil } = useAuth();
  const brukerId = bruker?.id ?? "";
  const profilLaster = profil === undefined;
  const katalog = useHent("katalog", hentKatalog);
  const siste = useHent(`siste:${brukerId}`, () => hentSisteTemaer(4));
  const [valgtTrinn, setValgtTrinn] = useState<string | null>(null);
  const [bytterTrinn, setBytterTrinn] = useState(false);

  const trinnId = valgtTrinn ?? profil?.trinn ?? null;
  const trinn = katalog.data?.find((t) => t.id === trinnId);
  const navn = (profil?.navn || (bruker?.user_metadata?.navn as string | undefined) || "")
    .trim()
    .split(/\s+/)[0];
  const dato = new Date().toLocaleDateString("nb-NO", { weekday: "long", day: "numeric", month: "long" });
  const harOvd = !!siste.data?.length;

  async function velgTrinn(id: string) {
    setValgtTrinn(id);
    setBytterTrinn(false);
    try {
      await lagreTrinn(brukerId, id);
    } catch (e) {
      console.error("Kunne ikke lagre trinnet:", (e as Error).message);
    }
  }

  const visTrinnvalg = !profilLaster && !!katalog.data && (!trinn || bytterTrinn);
  const fagTittel = visTrinnvalg ? "Hvilket trinn går du på?" : trinn ? `Fagene dine på ${trinn.navn}` : "Fagene dine";
  const fagRef = useRef<HTMLElement>(null);

  // Innholdet kommer etter hvert; mål rulleposisjonene på nytt når det er på plass.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [siste.data, katalog.data, trinnId, visTrinnvalg]);

  // Fagdelen: overskriften kommer inn ord for ord og radene én etter én når
  // delen kommer til syne – og på nytt når man bytter trinn.
  const fagKlar = !profilLaster && !!katalog.data;
  useEffect(() => {
    const el = fagRef.current;
    if (!el || !fagKlar) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true } })
        .from(el.querySelectorAll("#fag-label .ord"), { yPercent: 140, duration: 0.9, ease: "power4.out", stagger: 0.05 })
        .from(
          el.querySelectorAll("[data-fagrad], [role=radio]"),
          { y: 16, autoAlpha: 0, duration: 0.6, ease: "power3.out", stagger: 0.03 },
          "-=0.65",
        );
    });
    return () => mm.revert();
  }, [fagKlar, fagTittel, trinn?.id]);

  return (
    <div data-forside className="flex flex-col flex-1 bg-natt text-background">
      <Bevegelse />

      <header className="fs-meny fs-natt fixed inset-x-0 top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-5 sm:px-8 h-16">
          <Link href="/" aria-label="Studer – hjem" className="rounded-md">
            <Logo className="text-[26px]" />
          </Link>
          <nav aria-label="Hovedmeny" className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/fag"
              className="fs-menylenke inline-flex px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200"
            >
              Alle fag
            </Link>
            <ProfilKnapp />
          </nav>
        </div>
      </header>

      <main id="innhold" className="flex flex-col flex-1">
        {/* Natt: pulten */}
        <section aria-labelledby="hei" className="fs-natt relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-[calc(7rem+env(safe-area-inset-top))] sm:pt-[calc(9rem+env(safe-area-inset-top))] pb-16 lg:pb-24">
            <div className="flex flex-col gap-4">
              <p className="rise text-sm font-medium text-background/65 first-letter:uppercase">{dato}</p>
              <h1
                id="hei"
                className="rise [animation-delay:70ms] font-semibold text-[44px] leading-[0.98] sm:text-7xl lg:text-[88px] tracking-[-0.035em]"
              >
                Hei{navn ? `, ${navn}` : ""}.
              </h1>
              <p className="min-h-[1.65em] text-lg sm:text-xl leading-relaxed text-background/70 max-w-[44ch]">
                {!siste.laster && (
                  <span className="rise [animation-delay:140ms] block">
                    {harOvd
                      ? "Lampa står der du slapp sist. Fortsett, eller velg noe nytt lenger ned."
                      : "Hva vil du øve på i dag? Velg et fag lenger ned, så havner det her."}
                  </span>
                )}
              </p>
            </div>

            <div className="mt-14 lg:mt-20 flex flex-col gap-5">
              <h2 className="text-sm font-medium text-background/65">Fortsett der du slapp</h2>
              {siste.laster ? (
                <div className="border-t border-natt-linje" aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="border-b border-natt-linje py-7 flex flex-col gap-3">
                      <span className="h-3 w-32 rounded bg-background/10 animate-pulse" />
                      <span className="h-9 w-2/3 rounded bg-background/10 animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : siste.feil ? (
                <p className="text-background/75">Fikk ikke hentet det du har øvd på. Last inn siden på nytt.</p>
              ) : harOvd ? (
                <Fortsett temaer={siste.data!} />
              ) : (
                <div className="border-y border-natt-linje py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <span className="flex flex-col gap-1.5">
                    <span className="font-display text-3xl font-semibold tracking-[-0.02em]">Pulten er tom ennå</span>
                    <span className="text-background/70">Temaene du øver på, dukker opp her.</span>
                  </span>
                  <a
                    href="#fag"
                    className="group shrink-0 w-fit inline-flex items-center gap-2 rounded-xl bg-merke text-foreground px-5 py-3.5 text-sm font-semibold transition-[background-color,translate,scale] duration-200 hover:bg-merke-dark active:scale-[0.98]"
                  >
                    Velg et fag
                    <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Dag: fagene */}
        <div data-flate="dag" className="flex-1 bg-background text-foreground">
          <section
            ref={fagRef}
            id="fag"
            aria-labelledby="fag-label"
            className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 lg:pt-24 pb-16"
          >
            {/* Kortet vises bare uten abonnement; ellers er boksen tom og skjult. */}
            <div className="mb-12 lg:mb-16 empty:hidden">
              <Abonnementskort />
            </div>

            <div className="flex flex-wrap items-end justify-between gap-4">
              <Ordtittel
                key={fagTittel}
                id="fag-label"
                selvstyrt
                className="text-4xl sm:text-5xl font-semibold tracking-[-0.025em] leading-[1.02]"
              >
                {fagTittel}
              </Ordtittel>
              {trinn && !bytterTrinn && (
                <button
                  type="button"
                  onClick={() => setBytterTrinn(true)}
                  className="px-3 py-2 -mr-3 rounded-lg text-sm font-semibold text-ink-soft hover:text-foreground hover:bg-sunken transition-colors duration-200"
                >
                  Bytt trinn
                </button>
              )}
            </div>

            <div className="mt-8">
              {profilLaster || katalog.laster ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 border-t border-border-strong" aria-hidden="true">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="border-b border-border py-6">
                      <span className="block h-6 w-1/2 rounded bg-sunken animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : katalog.feil ? (
                <p className="text-danger-ink">Fikk ikke hentet fagene. Sjekk nettet og prøv igjen.</p>
              ) : visTrinnvalg ? (
                <div
                  role="radiogroup"
                  aria-labelledby="fag-label"
                  className="grid grid-cols-3 sm:flex gap-1 p-1 bg-sunken rounded-2xl w-full sm:w-fit"
                >
                  {katalog.data?.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      role="radio"
                      aria-checked={t.id === trinnId}
                      onClick={() => velgTrinn(t.id)}
                      className={`px-3 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-[background-color,color,box-shadow] duration-200 ${
                        t.id === trinnId
                          ? "bg-surface text-foreground shadow-[0_1px_3px_rgba(60,48,30,0.12)]"
                          : "text-muted hover:text-foreground"
                      }`}
                    >
                      {t.navn}
                    </button>
                  ))}
                </div>
              ) : (
                trinn && (
                  <ul key={trinn.id} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 border-t border-border-strong">
                    {trinn.fag.map((f) => (
                      <li key={f.id} data-fagrad className="border-b border-border">
                        <Link
                          href={`/fag?trinn=${trinn.id}&fag=${f.id}`}
                          className="group flex items-baseline justify-between gap-4 py-5 sm:py-6 rounded-lg"
                        >
                          <span lang="nb" className="fs-merk font-display text-[22px] sm:text-2xl font-semibold leading-snug tracking-[-0.01em] hyphens-auto">
                            {f.navn}
                          </span>
                          <span className="shrink-0 flex items-center gap-2 text-sm text-muted tabular-nums">
                            {f.antallTemaer ? `${f.antallTemaer} temaer` : "Kommer snart"}
                            <ArrowRight
                              size={16}
                              className="text-faint transition-[translate,color] duration-200 group-hover:translate-x-0.5 group-hover:text-foreground"
                            />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )
              )}
            </div>

            <Link
              href="/fag"
              className="group mt-10 inline-flex items-center gap-2 text-sm font-semibold text-foreground underline decoration-border-strong decoration-2 underline-offset-[6px] hover:decoration-foreground transition-colors duration-200"
            >
              Se alle fag og trinn
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </section>

          <footer className="max-w-6xl mx-auto px-5 sm:px-8 pb-12">
            <Bunnlenker className="pt-8 border-t border-border" />
          </footer>
        </div>
      </main>
    </div>
  );
}
