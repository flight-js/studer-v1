import Link from "next/link";
import { subjectChips } from "@/lib/data";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <header className="flex items-center justify-between px-6 sm:px-16 py-6 border-b border-border">
        <div className="font-display font-bold text-2xl">Studer</div>
        <nav className="flex items-center gap-9">
          <a href="#slik" className="text-sm font-medium hidden sm:inline">
            Slik funker det
          </a>
          <a href="#priser" className="text-sm font-medium hidden sm:inline">
            Priser
          </a>
          <Link href="/fag" className="text-sm font-medium hidden sm:inline">
            Logg inn
          </Link>
          <Link
            href="/fag"
            className="bg-primary text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            Prøv gratis
          </Link>
        </nav>
      </header>

      <section className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 px-6 sm:px-16 py-16 lg:py-24">
        <div className="flex-1 flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 bg-[#efeae0] text-muted text-xs font-semibold px-3.5 py-1.5 rounded-full">
            Ungdomsskole og videregående
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.08]">
            Alt pensum.
            <br />
            Ett sted å øve.
          </h1>
          <p className="text-lg leading-relaxed text-[#4b4858] max-w-md">
            Flashcards, quiz og miniprøver for hvert tema i hvert fag – fra 8.
            trinn til Vg3. Ferdig laget, klart til å øve på.
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <Link
              href="/fag"
              className="bg-primary text-white px-7 py-4 rounded-xl text-base font-semibold hover:bg-primary-dark transition-colors"
            >
              Kom i gang gratis
            </Link>
            <a
              href="#slik"
              className="border border-[#d8d2c4] text-foreground px-7 py-4 rounded-xl text-base font-semibold"
            >
              Se hvordan det funker
            </a>
          </div>
        </div>
        <div className="flex-1 flex justify-center w-full">
          <div className="w-full max-w-sm bg-white border border-border rounded-2xl p-8 shadow-[0_24px_48px_-24px_rgba(27,26,46,0.18)]">
            <div className="text-xs font-semibold text-muted mb-3.5">
              KJEMI 1 · KJEMISKE REAKSJONER
            </div>
            <div className="font-display text-2xl font-semibold mb-4">
              Hva kalles en reaksjon som avgir varme til omgivelsene?
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="border-[1.5px] border-primary bg-primary-tint rounded-lg px-4 py-3 text-sm font-semibold text-primary">
                Eksoterm reaksjon
              </div>
              <div className="border border-border rounded-lg px-4 py-3 text-sm text-[#4b4858]">
                Endoterm reaksjon
              </div>
              <div className="border border-border rounded-lg px-4 py-3 text-sm text-[#4b4858]">
                Katalytisk reaksjon
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="slik" className="px-6 sm:px-16 py-16 flex flex-col gap-10">
        <h2 className="font-display text-3xl font-semibold text-center">
          Slik funker det
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-7">
          <FeatureCard
            color="primary"
            title="Flashcards"
            text="Begreper, formler og definisjoner – pugg i eget tempo, tema for tema."
          />
          <FeatureCard
            color="accent"
            title="Quiz og miniprøver"
            text="Test deg selv med multiple choice og tidsbegrensede miniprøver."
          />
          <FeatureCard
            color="success"
            title="AI-hjelp"
            text="Spør chatboten når noe er uklart – den svarer ut fra pensumet ditt."
          />
        </div>
      </section>

      <section className="px-6 sm:px-16 py-16 flex flex-col gap-8">
        <div className="text-center flex flex-col gap-2.5">
          <h2 className="font-display text-3xl font-semibold">
            Fra 8. trinn til Vg3
          </h2>
          <p className="text-muted">
            Fellesfag og studieforberedende programfag, samlet på ett sted.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
          {subjectChips.map((s) => (
            <div
              key={s}
              className="bg-white border border-border rounded-full px-5 py-2.5 text-sm font-medium"
            >
              {s}
            </div>
          ))}
        </div>
      </section>

      <section
        id="priser"
        className="px-6 sm:px-16 py-16 flex flex-col gap-8 items-center"
      >
        <h2 className="font-display text-3xl font-semibold">Enkel pris</h2>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-full sm:w-[300px] bg-white border border-border rounded-2xl p-8 flex flex-col gap-4.5">
            <div className="text-sm font-semibold text-muted">Månedlig</div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-4xl font-semibold">
                69 kr
              </span>
              <span className="text-sm text-muted">/ mnd</span>
            </div>
            <ul className="flex flex-col gap-2.5 text-sm text-[#4b4858]">
              <li>✓ Alle fag og trinn</li>
              <li>✓ Ubegrenset quiz og flashcards</li>
              <li>✓ AI-chatbot inkludert</li>
            </ul>
            <Link
              href="/fag"
              className="mt-2 text-center border-[1.5px] border-primary text-primary px-3 py-3 rounded-xl text-sm font-semibold"
            >
              Velg månedlig
            </Link>
          </div>
          <div className="w-full sm:w-[300px] bg-foreground rounded-2xl p-8 flex flex-col gap-4.5 text-white relative">
            <div className="absolute -top-3.5 right-6 bg-accent text-white text-xs font-bold px-3.5 py-1.5 rounded-full">
              Spar 2 mnd
            </div>
            <div className="text-sm font-semibold text-[#c9c6d6]">Årlig</div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-4xl font-semibold">
                499 kr
              </span>
              <span className="text-sm text-[#c9c6d6]">/ år</span>
            </div>
            <ul className="flex flex-col gap-2.5 text-sm text-[#d8d5e4]">
              <li>✓ Alle fag og trinn</li>
              <li>✓ Ubegrenset quiz og flashcards</li>
              <li>✓ AI-chatbot inkludert</li>
            </ul>
            <Link
              href="/fag"
              className="mt-2 text-center bg-white text-foreground px-3 py-3 rounded-xl text-sm font-semibold"
            >
              Velg årlig
            </Link>
          </div>
        </div>
      </section>

      <footer className="mt-auto px-6 sm:px-16 py-8 border-t border-border flex justify-between items-center">
        <div className="font-display font-bold">Studer</div>
        <div className="text-xs text-muted">© 2026 Studer</div>
      </footer>
    </div>
  );
}

function FeatureCard({
  color,
  title,
  text,
}: {
  color: "primary" | "accent" | "success";
  title: string;
  text: string;
}) {
  const bg =
    color === "primary"
      ? "bg-primary-tint text-primary"
      : color === "accent"
        ? "bg-accent-tint text-accent"
        : "bg-success-tint text-success";
  return (
    <div className="bg-white border border-border rounded-2xl p-8 flex flex-col gap-3.5">
      <div
        className={`w-13 h-13 rounded-xl flex items-center justify-center ${bg}`}
      >
        <Icon name={title} />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-muted">{text}</p>
    </div>
  );
}

function Icon({ name }: { name: string }) {
  if (name === "Flashcards") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="7" width="14" height="11" rx="2" />
        <rect x="7" y="3" width="14" height="11" rx="2" fill="var(--background)" />
      </svg>
    );
  }
  if (name === "Quiz og miniprøver") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12.5l2.5 2.5L16 9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16v11H8l-4 4z" />
    </svg>
  );
}
