import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Bunnlenker } from "@/components/Bunnlenker";
import { Logo } from "@/components/Logo";
import { ForsideMeny, Startside } from "@/components/Forside";
import { Bevegelse } from "@/components/forside/Bevegelse";
import { Fagkatalog } from "@/components/forside/Fagkatalog";
import { Fokusfelt } from "@/components/forside/Fokusfelt";
import { Ordtittel } from "@/components/forside/Ordtittel";
import { Ovingsformer } from "@/components/forside/Ovingsformer";
import { Pensumkart } from "@/components/forside/Pensumkart";
import { ArrowRight, Check } from "@/components/icons";
import { EKSEMPEL, TELLING } from "@/lib/forsidedata";
import { DRIVER, SKOLE } from "@/lib/juridisk";
import { ARLIG_SPARING, FORDELER, PRIS, PROVEDAGER, type Plan as Abonnement } from "@/lib/priser";
import { BESKRIVELSE, DELING, NAVN, NETTSTED, SOSIALE_MEDIER, TITTEL } from "@/lib/seo";

// Forsiden for utloggede. Den går fra natt (leselampa og hele pensum som
// prikker) til dag (øvingsformene, fagene og prisen) og tilbake til natt.

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { ...DELING, title: TITTEL, description: BESKRIVELSE, url: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0f1014",
};

// Strukturerte data, så Google vet hva Studer er og viser riktig navn og logo.
const strukturerteData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${NETTSTED}/#organisasjon`,
      name: NAVN,
      url: NETTSTED,
      logo: `${NETTSTED}/apple-touch-icon.png`,
      email: "kontakt@studer.no",
      sameAs: SOSIALE_MEDIER.flatMap((p) => (p.url ? [p.url] : [])),
    },
    {
      "@type": "WebSite",
      "@id": `${NETTSTED}/#nettsted`,
      name: NAVN,
      // Google bruker dette som navnet på nettstedet i søkeresultatene.
      alternateName: "studer.no",
      url: NETTSTED,
      inLanguage: "nb-NO",
      publisher: { "@id": `${NETTSTED}/#organisasjon` },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // Faste data fra koden, ingen brukerinnhold – trygt å sette inn som de er.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(strukturerteData) }}
      />
      <Startside>
        <Markedsside />
      </Startside>
    </>
  );
}

const ctaGul =
  "group inline-flex items-center justify-center gap-2 rounded-xl bg-merke text-foreground font-semibold transition-[background-color,translate,scale,box-shadow] duration-200 hover:bg-merke-dark hover:shadow-[0_14px_36px_-14px_rgba(246,224,94,0.6)] active:scale-[0.98]";
const menyLenke =
  "fs-menylenke px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200";
const menyKnapp =
  "fs-menyknapp inline-flex items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap transition-[background-color,translate,scale] duration-200 active:scale-[0.98]";
const tittel = "font-semibold tracking-[-0.03em] leading-[0.98] text-5xl sm:text-6xl lg:text-7xl";

function Markedsside() {
  return (
    <div data-forside className="kun-utlogget flex flex-col flex-1 bg-natt text-background">
      <Bevegelse />

      <header className="fs-meny fs-natt fixed inset-x-0 top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 h-16">
          <Link href="/" aria-label="Studer – forsiden" className="rounded-md">
            <Logo className="text-[26px]" />
          </Link>
          <nav aria-label="Hovedmeny" className="flex items-center gap-1 sm:gap-2">
            <a href="#slik" className={`${menyLenke} hidden md:inline-flex`}>
              Slik funker det
            </a>
            <a href="#priser" className={`${menyLenke} hidden md:inline-flex`}>
              Priser
            </a>
            <ForsideMeny lenke={`${menyLenke} inline-flex`} knapp={menyKnapp} />
          </nav>
        </div>
      </header>

      <main id="innhold">
        {/* Hero: leselampa */}
        <section aria-labelledby="hero-tittel" className="fs-natt relative isolate overflow-hidden bg-natt">
          <Fokusfelt />
          {/* På mobil og nettbrett står ordene over teksten: pt holder av plass
              til lampa, så teksten aldri går lenger opp enn 46 % av skjermen. */}
          <div className="relative z-10 max-w-7xl mx-auto min-h-[max(100svh,640px)] px-5 sm:px-8 pt-[max(46svh,300px)] lg:pt-0 flex flex-col justify-end pb-12 sm:pb-16 lg:pb-20">
            <div data-fokus-unnta className="max-w-[48rem] flex flex-col gap-5 sm:gap-6">
              <p className="text-sm font-medium text-background/65">For 8.&nbsp;trinn til Vg3 og påbygg · etter LK20</p>
              <h1
                id="hero-tittel"
                className="font-semibold text-[46px] leading-[0.96] sm:text-7xl lg:text-[96px] tracking-[-0.035em]"
              >
                Alt pensum.
                <br />
                Ett tema om gangen.
              </h1>
              <p className="text-[17px] sm:text-xl leading-relaxed text-background/75 max-w-[40ch]">
                Flashcards, quiz og miniprøver til hvert tema i hvert fag. Ferdig laget etter
                læreplanen, så du kan bruke tiden på å øve.
              </p>
              <div className="flex flex-wrap items-center gap-x-7 gap-y-4 mt-2">
                <Link href="/registrer" className={`${ctaGul} px-6.5 py-4 text-base`}>
                  Prøv gratis i {PROVEDAGER} dager
                  <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <a
                  href="#slik"
                  className="text-base font-semibold underline decoration-background/30 decoration-2 underline-offset-[6px] hover:decoration-merke transition-colors duration-200"
                >
                  Se hvordan det funker
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Slik funker det: hele pensum som prikker */}
        <section id="slik" aria-labelledby="slik-tittel" className="fs-natt relative bg-natt border-t border-natt-linje">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-24 lg:pt-36 pb-16 lg:pb-24">
            <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-x-16 gap-y-6 items-end pb-8 lg:pb-0">
              <Ordtittel id="slik-tittel" className={tittel}>
                Hele pensum, prikk for prikk.
              </Ordtittel>
              <p className="text-lg leading-relaxed text-background/70 max-w-[38ch]">
                Hver prikk er ett tema i Studer – {TELLING.temaer} til sammen. Slik finner du fram til
                det du skal øve på.
              </p>
            </div>
            <Pensumkart />
          </div>
        </section>

        {/* Dag: øvingsformene, fagene og prisen */}
        <div data-flate="dag" className="bg-background text-foreground">
          <section aria-labelledby="ov-tittel" className="max-w-7xl mx-auto px-5 sm:px-8 pt-24 lg:pt-36 pb-16">
            <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-x-16 gap-y-6 items-end mb-12 lg:mb-16">
              <Ordtittel id="ov-tittel" className={tittel}>
                Fire måter å øve på.
              </Ordtittel>
              <p className="text-lg leading-relaxed text-ink-soft max-w-[42ch]">
                Samme tema, fire vinkler. Bytt når det begynner å gå på autopilot. Eksemplene er fra{" "}
                {EKSEMPEL.tema} i {EKSEMPEL.fag}.
              </p>
            </div>
            <Ovingsformer />
            <p className="border-t border-border pt-8 text-lg text-ink-soft">
              Hvert tema har også et sammendrag og et tankekart, så du kan lese deg opp før du øver.
            </p>
          </section>

          <section id="fag" aria-labelledby="fag-tittel" className="bg-sunken/70 border-y border-border">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 py-24 lg:py-32">
              <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-x-16 gap-y-6 items-end">
                <Ordtittel id="fag-tittel" className={tittel}>
                  {`${TELLING.fag} fag, fra 8. trinn til Vg3 og påbygg.`}
                </Ordtittel>
                <p className="text-lg leading-relaxed text-ink-soft max-w-[42ch]">
                  Fellesfag og studieforberedende programfag, og fellesfagene på påbygg. Mangler faget ditt?{" "}
                  <Link
                    href="/forslag"
                    className="font-semibold text-foreground underline decoration-border-strong decoration-2 underline-offset-4 hover:decoration-foreground"
                  >
                    Send oss et forslag
                  </Link>
                  .
                </p>
              </div>
              <Fagkatalog />
            </div>
          </section>

          <section id="priser" aria-labelledby="pris-tittel" className="max-w-7xl mx-auto px-5 sm:px-8 py-24 lg:py-36 w-full">
            <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-x-16 gap-y-12 items-start">
              <div className="flex flex-col gap-5">
                <Ordtittel id="pris-tittel" className={tittel}>
                  Én pris for alt.
                </Ordtittel>
                <p className="text-lg leading-relaxed text-ink-soft max-w-[36ch]">
                  Alle fag og alle trinn i ett abonnement. De første {PROVEDAGER} dagene er gratis, og du
                  kan avslutte når som helst.
                </p>
              </div>
              <div data-vis-gruppe className="grid sm:grid-cols-2 gap-4">
                <Plan plan="maned" name="Månedlig" price={PRIS.maned} unit="/ mnd" cta="Prøv månedlig" />
                <Plan
                  plan="ar"
                  name="Årlig"
                  price={PRIS.ar}
                  unit="/ år"
                  cta="Prøv årlig"
                  note={`Spar ${ARLIG_SPARING} kr`}
                  perManed={Math.round(PRIS.ar / 12)}
                  featured
                />
              </div>
            </div>
          </section>
        </div>

        {/* Natt igjen: avslutning */}
        <section data-lampelys aria-labelledby="slutt-tittel" className="fs-natt relative isolate overflow-hidden bg-natt">
          <div
            data-glod
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[min(960px,130vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_closest-side,rgba(255,217,140,0.15),rgba(255,217,140,0.045)_55%,transparent)]"
          />
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-28 lg:py-44 flex flex-col items-start gap-8">
            <Ordtittel
              id="slutt-tittel"
              className="font-semibold text-[52px] leading-[0.94] sm:text-7xl lg:text-[112px] tracking-[-0.04em] max-w-[11ch]"
            >
              Neste prøve kommer. Vær klar.
            </Ordtittel>
            <p className="text-lg sm:text-xl leading-relaxed text-background/70 max-w-[40ch]">
              Prøv alt gratis i {PROVEDAGER} dager. Du kan avslutte når som helst.
            </p>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-4 mt-2">
              <Link href="/registrer" className={`${ctaGul} px-6.5 py-4 text-base`}>
                Prøv gratis i {PROVEDAGER} dager
                <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/logg-inn"
                className="text-base font-semibold underline decoration-background/30 decoration-2 underline-offset-[6px] hover:decoration-merke transition-colors duration-200"
              >
                Har du konto? Logg inn
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="fs-natt bg-natt border-t border-natt-linje">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 flex flex-col gap-10">
          <div className="flex flex-col sm:flex-row gap-6 justify-between sm:items-end">
            <div className="flex flex-col gap-2">
              <Logo className="text-3xl" />
              <p className="text-sm text-background/60 max-w-[46ch]">
                {DRIVER} er en ungdomsbedrift{SKOLE ? ` ved ${SKOLE}` : ""}.
              </p>
            </div>
            <nav aria-label="Bunnmeny" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-background/60">
              <a href="#slik" className="hover:text-background transition-colors">
                Slik funker det
              </a>
              <a href="#fag" className="hover:text-background transition-colors">
                Fag
              </a>
              <a href="#priser" className="hover:text-background transition-colors">
                Priser
              </a>
            </nav>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between border-t border-natt-linje pt-6">
            <Bunnlenker mork className="flex-1" />
            <span className="text-sm text-background/45">© 2026 studer</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Plan({
  plan,
  name,
  price,
  unit,
  cta,
  note,
  perManed,
  featured,
}: {
  plan: Abonnement;
  name: string;
  price: number;
  unit: string;
  cta: string;
  note?: string;
  perManed?: number;
  featured?: boolean;
}) {
  return (
    <div
      data-vis
      className={`rounded-3xl p-7 sm:p-8 flex flex-col gap-6 ${
        featured ? "fs-natt bg-natt text-background shadow-lift" : "bg-surface border border-border"
      }`}
    >
      <div className="flex items-center justify-between h-7">
        <span className={`text-sm font-semibold ${featured ? "text-background/70" : "text-muted"}`}>{name}</span>
        {note && (
          <span className="text-xs font-semibold bg-merke text-foreground px-2.5 py-1 rounded-md">{note}</span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-5xl font-semibold tabular-nums tracking-[-0.02em]">{price} kr</span>
          <span className={`text-sm ${featured ? "text-background/60" : "text-muted"}`}>{unit}</span>
        </div>
        <span className={`text-sm ${featured ? "text-background/60" : "text-muted"}`}>
          {perManed ? `Rundt ${perManed} kr i måneden` : "Betal måned for måned"}
        </span>
      </div>
      <ul className={`flex flex-col gap-3 text-sm ${featured ? "text-background/80" : "text-ink-soft"}`}>
        <li className={`flex items-center gap-2.5 font-semibold ${featured ? "text-merke" : "text-foreground"}`}>
          <Check size={16} />
          Første {PROVEDAGER} dager gratis
        </li>
        {FORDELER.map((f) => (
          <li key={f} className="flex items-center gap-2.5">
            <Check size={16} className={featured ? "text-background/50" : "text-faint"} />
            {f}
          </li>
        ))}
      </ul>
      <Link
        href={`/abonnement?plan=${plan}`}
        className={`mt-auto text-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-[background-color,translate,scale,border-color] duration-200 active:scale-[0.98] ${
          featured
            ? "bg-merke text-foreground hover:bg-merke-dark"
            : "bg-foreground text-background hover:bg-black"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}
