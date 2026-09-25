import Link from "next/link";
import { Dot } from "@/components/Dot";
import { Logo } from "@/components/Logo";
import { FagOversikt, ForsideMeny } from "@/components/Forside";
import { ArrowRight, Check } from "@/components/icons";

const MONTHLY = 59;
const YEARLY = 499;
const yearlySaving = MONTHLY * 12 - YEARLY;

const btnPrimary =
  "inline-flex items-center justify-center gap-2 bg-primary text-white rounded-xl font-semibold transition-[background-color,transform,box-shadow] duration-200 hover:bg-primary-dark hover:shadow-[0_10px_24px_-12px_rgba(44,75,212,0.7)] active:scale-[0.98]";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 h-18">
          <Link href="/" aria-label="Studer – forsiden" className="rounded-md">
            <Logo className="text-[28px]" />
          </Link>
          <nav aria-label="Hovedmeny" className="flex items-center gap-1 sm:gap-2">
            <NavLink href="#slik">Slik funker det</NavLink>
            <NavLink href="#priser">Priser</NavLink>
            <ForsideMeny lenke={navLinkCls} knapp={btnPrimary} />
          </nav>
        </div>
      </header>

      <main id="innhold">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-20 lg:pt-24 lg:pb-32 grid lg:grid-cols-[1.1fr_1fr] gap-14 lg:gap-10 items-center">
          <div className="flex flex-col gap-7 rise">
            <p className="text-sm font-medium text-muted flex items-center gap-2.5">
              <span className="w-6 h-px bg-border-strong" aria-hidden="true" />
              <span>
                8. trinn til Vg3<Dot />studiespesialiserende
              </span>
            </p>
            <h1 className="font-display text-[44px] leading-[1.02] sm:text-6xl lg:text-[76px] font-semibold tracking-[-0.025em]">
              Alt pensum.
              <br />
              <span className="italic font-normal text-primary">Ett sted</span> å øve.
            </h1>
            <p className="text-lg leading-relaxed text-ink-soft max-w-[34ch]">
              Flashcards, quiz og miniprøver for hvert tema i hvert fag. Ferdig
              laget, klart til å øve på.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 mt-1">
              <Link href="/registrer" className={`${btnPrimary} group px-6.5 py-4 text-base`}>
                Kom i gang gratis
                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
              <a
                href="#slik"
                className="text-base font-semibold text-foreground underline decoration-border-strong decoration-2 underline-offset-[6px] hover:decoration-primary transition-colors duration-200"
              >
                Se hvordan det funker
              </a>
            </div>
          </div>

          <HeroStack />
        </section>

        {/* Slik funker det */}
        <section
          id="slik"
          className="scroll-mt-20 border-t border-border bg-surface/60"
        >
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 lg:py-28 grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20">
            <div className="flex flex-col gap-5 lg:sticky lg:top-32 self-start">
              <h2 className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.02em] leading-[1.05]">
                Slik funker det
              </h2>
              <p className="text-lg leading-relaxed text-ink-soft max-w-[38ch]">
                Tre valg, så er du i gang. Alt innhold er allerede laget ut fra
                læreplanen, så du slipper å lage kortene selv.
              </p>
            </div>

            <ol className="relative flex flex-col">
              <span
                className="absolute left-[19px] top-6 bottom-6 w-px bg-border-strong"
                aria-hidden="true"
              />
              <Step n={1} label="Velg trinn" value="Vg2" hint="8. trinn til Vg3" />
              <Step n={2} label="Velg fag" value="Kjemi 1" hint="Fellesfag og programfag" />
              <Step
                n={3}
                label="Velg tema"
                value="Syrer, baser og pH"
                hint="Begreper, formler og definisjoner"
              />
              <Step
                n={4}
                label="Øv"
                value="Flashcards, quiz eller miniprøve"
                hint="Du ser hvor mye av temaet du har gått gjennom"
                last
              />
            </ol>
          </div>
        </section>

        {/* Øvingsformer */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20 lg:py-28 flex flex-col gap-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.02em] leading-[1.05] max-w-[14ch]">
              Fire måter å øve på
            </h2>
            <p className="text-ink-soft max-w-[36ch] leading-relaxed">
              Samme tema, ulike vinkler. Bytt når det begynner å gå på autopilot.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <Tile className="md:col-span-4 md:row-span-2" title="Flashcards" text="Begreper, formler og definisjoner. Snu kortet, svar ærlig, og de du ikke kan kommer tilbake.">
              <div className="relative h-44 sm:h-56 mt-2">
                <div className="absolute inset-x-8 sm:inset-x-16 top-4 bottom-0 rounded-2xl bg-sunken border border-border rotate-[-3deg]" />
                <div className="absolute inset-x-4 sm:inset-x-10 top-0 bottom-4 rounded-2xl bg-surface border border-border shadow-card flex flex-col items-center justify-center gap-2 text-center px-6">
                  <span className="text-xs font-medium text-faint">Begrep</span>
                  <span className="font-display text-2xl sm:text-3xl font-semibold">
                    Aktiveringsenergi
                  </span>
                </div>
              </div>
            </Tile>
            <Tile className="md:col-span-2" title="Quiz" text="Flervalg med forklaring på hvert svar.">
              <div className="flex flex-col gap-1.5 mt-1">
                <MiniOption state="right">Øker den</MiniOption>
                <MiniOption state="wrong">Senker den</MiniOption>
              </div>
            </Tile>
            <Tile className="md:col-span-2" title="Miniprøver" text="20 minutter, blandet format – som en ekte prøve.">
              <div className="font-display text-4xl font-semibold tabular-nums tracking-tight text-foreground/90 mt-1">
                14:32
              </div>
            </Tile>
            <Tile className="md:col-span-6" title="AI-hjelp" text="Spør når noe er uklart. Svarene holder seg til pensumet i faget du øver på." horizontal>
              <div className="flex flex-col gap-2 w-full max-w-md">
                <div className="self-end bg-foreground text-background rounded-2xl rounded-br-md px-4 py-2.5 text-sm">
                  Hva er forskjellen på eksoterm og endoterm?
                </div>
                <div className="self-start bg-sunken rounded-2xl rounded-bl-md px-4 py-2.5 text-sm text-ink-soft">
                  Eksoterm avgir energi til omgivelsene, endoterm tar opp energi …
                </div>
              </div>
            </Tile>
          </div>
        </section>

        {/* Fag */}
        <section className="border-t border-border bg-surface/60">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 lg:py-28 flex flex-col gap-12">
            <div className="flex flex-col gap-4 max-w-2xl">
              <h2 className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.02em] leading-[1.05]">
                Fra 8. trinn til Vg3
              </h2>
              <p className="text-lg text-ink-soft leading-relaxed">
                Fellesfag og studieforberedende programfag, samlet på ett sted.
              </p>
            </div>
            <FagOversikt />
          </div>
        </section>

        {/* Priser */}
        <section id="priser" className="scroll-mt-20 max-w-6xl mx-auto px-5 sm:px-8 py-20 lg:py-28 w-full">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-start">
            <div className="flex flex-col gap-5">
              <h2 className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.02em] leading-[1.05]">
                Enkel pris
              </h2>
              <p className="text-lg text-ink-soft leading-relaxed max-w-[34ch]">
                Ett abonnement, alle fag og alle trinn. Ingen pakker å velge
                mellom.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Plan
                name="Månedlig"
                price={MONTHLY}
                unit="/ mnd"
                cta="Velg månedlig"
              />
              <Plan
                name="Årlig"
                price={YEARLY}
                unit="/ år"
                cta="Velg årlig"
                note={`Spar ${yearlySaving} kr`}
                featured
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row gap-6 justify-between sm:items-center">
          <Logo className="text-2xl" />
          <nav aria-label="Bunnmeny" className="flex gap-6 text-sm text-muted">
            <a href="#slik" className="hover:text-foreground transition-colors">Slik funker det</a>
            <a href="#priser" className="hover:text-foreground transition-colors">Priser</a>
            <Link href="/fag" className="hover:text-foreground transition-colors">Fag</Link>
          </nav>
          <div className="text-sm text-faint">© 2026 studer</div>
        </div>
      </footer>
    </div>
  );
}

const navLinkCls =
  "hidden sm:inline-flex px-3 py-2 rounded-lg text-sm font-medium text-ink-soft hover:text-foreground hover:bg-sunken transition-colors duration-200";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const cls = navLinkCls;
  return href.startsWith("#") ? (
    <a href={href} className={cls}>{children}</a>
  ) : (
    <Link href={href} className={cls}>{children}</Link>
  );
}

function HeroStack() {
  return (
    <div className="relative mx-auto w-full max-w-[420px] pt-6 pb-10 rise [animation-delay:120ms]">
      {/* Flashcard bak */}
      <div
        className="absolute right-[-6%] top-0 w-[78%] h-[62%] rounded-3xl bg-surface border border-border shadow-card rotate-[5deg] flex flex-col p-6"
        aria-hidden="true"
      >
        <span className="text-xs font-medium text-faint">Begrep</span>
        <span className="font-display text-xl font-semibold">Katalysator</span>
      </div>

      {/* Quizkort foran */}
      <div className="relative mt-16 bg-surface border border-border rounded-3xl p-7 sm:p-8 shadow-lift">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted mb-4">
          Vg2 <span className="text-faint">/</span> Kjemi 1{" "}
          <span className="text-faint">/</span> Energi og entalpi
        </div>
        <div className="font-display text-[22px] sm:text-2xl font-semibold leading-snug mb-5 tracking-[-0.01em]">
          Hva kalles en reaksjon som avgir varme til omgivelsene?
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between border-[1.5px] border-success bg-success-tint rounded-xl px-4 py-3 text-sm font-semibold text-success-ink">
            Eksoterm reaksjon
            <Check size={16} />
          </div>
          <div className="border border-border rounded-xl px-4 py-3 text-sm text-ink-soft">
            Endoterm reaksjon
          </div>
          <div className="border border-border rounded-xl px-4 py-3 text-sm text-ink-soft">
            Katalytisk reaksjon
          </div>
        </div>
      </div>

      {/* Fremdrift */}
      <div className="absolute -left-3 sm:-left-8 bottom-0 bg-foreground text-background rounded-2xl pl-3.5 pr-4 py-3 flex items-center gap-3 shadow-lift">
        <svg width="30" height="30" viewBox="0 0 36 36" aria-hidden="true">
          <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="4" />
          <circle cx="18" cy="18" r="14" fill="none" stroke="#8fa3ff" strokeWidth="4" strokeLinecap="round" strokeDasharray="52.8 88" transform="rotate(-90 18 18)" />
        </svg>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tabular-nums">60 % gjennomgått</span>
          <span className="text-xs text-background/60">Energi og entalpi</span>
        </div>
      </div>
    </div>
  );
}

function Step({
  n,
  label,
  value,
  hint,
  last,
}: {
  n: number;
  label: string;
  value: string;
  hint: string;
  last?: boolean;
}) {
  return (
    <li className={`relative flex gap-6 ${last ? "" : "pb-10"}`}>
      <span
        className={`relative z-10 shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold tabular-nums ${
          last
            ? "bg-primary text-white"
            : "bg-surface border border-border-strong text-foreground"
        }`}
      >
        {n}
      </span>
      <div className="flex flex-col gap-1 pt-1.5">
        <span className="text-sm font-medium text-muted">{label}</span>
        <span className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.015em]">
          {value}
        </span>
        <span className="text-sm text-faint">{hint}</span>
      </div>
    </li>
  );
}

function Tile({
  title,
  text,
  className = "",
  horizontal,
  children,
}: {
  title: string;
  text: string;
  className?: string;
  horizontal?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`bg-surface border border-border rounded-3xl p-7 flex gap-6 ${
        horizontal
          ? "flex-col md:flex-row md:items-center md:justify-between"
          : "flex-col justify-between"
      } ${className}`}
    >
      <div className="flex flex-col gap-2 max-w-[40ch]">
        <h3 className="text-2xl font-semibold tracking-[-0.01em]">{title}</h3>
        <p className="text-ink-soft leading-relaxed">{text}</p>
      </div>
      {children}
    </div>
  );
}

function MiniOption({
  state,
  children,
}: {
  state: "right" | "wrong";
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm border ${
        state === "right"
          ? "border-success bg-success-tint text-success-ink font-semibold"
          : "border-border text-faint line-through decoration-danger/60"
      }`}
    >
      {children}
      {state === "right" && <Check size={14} />}
    </div>
  );
}

function Plan({
  name,
  price,
  unit,
  cta,
  note,
  featured,
}: {
  name: string;
  price: number;
  unit: string;
  cta: string;
  note?: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl p-7 sm:p-8 flex flex-col gap-6 ${
        featured
          ? "bg-foreground text-background shadow-lift"
          : "bg-surface border border-border"
      }`}
    >
      <div className="flex items-center justify-between h-7">
        <span className={`text-sm font-semibold ${featured ? "text-background/70" : "text-muted"}`}>
          {name}
        </span>
        {note && (
          <span className="text-xs font-semibold bg-primary text-white px-2.5 py-1 rounded-md">
            {note}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-display text-5xl font-semibold tabular-nums tracking-[-0.02em]">
          {price} kr
        </span>
        <span className={`text-sm ${featured ? "text-background/60" : "text-muted"}`}>{unit}</span>
      </div>
      <ul className={`flex flex-col gap-3 text-sm ${featured ? "text-background/80" : "text-ink-soft"}`}>
        {["Alle fag og trinn", "Ubegrenset quiz og flashcards", "AI-chatbot inkludert"].map((f) => (
          <li key={f} className="flex items-center gap-2.5">
            <Check size={16} className={featured ? "text-[#8fa3ff]" : "text-primary"} />
            {f}
          </li>
        ))}
      </ul>
      <Link
        href="/registrer"
        className={`mt-auto text-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-[background-color,transform,border-color] duration-200 active:scale-[0.98] ${
          featured
            ? "bg-background text-foreground hover:bg-white"
            : "border-[1.5px] border-border-strong text-foreground hover:border-foreground"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}
