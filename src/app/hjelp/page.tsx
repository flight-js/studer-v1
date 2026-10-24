import { AppBar } from "@/components/AppBar";
import { Bunnlenker } from "@/components/Bunnlenker";
import { Sporsmalliste } from "@/components/Sporsmal";
import { KONTAKT_EPOST } from "@/lib/juridisk";
import { sideMetadata } from "@/lib/seo";
import { SPORSMAL } from "@/lib/sporsmal";

export const metadata = sideMetadata({
  tittel: "Spørsmål og svar",
  googleTittel: "Spørsmål og svar om Studer",
  beskrivelse: "Svar på det folk lurer på om Studer: fagene, prøveperioden, pris, avslutning, AI-hjelpen og kontoen.",
  sti: "/hjelp",
  indekser: true,
});

export default function Hjelp() {
  return (
    <div className="flex flex-col flex-1">
      <AppBar back="/" backLabel="Forsiden" />
      <main id="innhold" className="px-5 sm:px-8 pt-10 sm:pt-14 pb-20 w-full max-w-2xl mx-auto flex flex-col gap-12">
        <header className="flex flex-col gap-3">
          <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.02em]">Spørsmål og svar</h1>
          <p className="text-ink-soft leading-relaxed">
            Finner du ikke svaret, skriv til oss på{" "}
            <a href={`mailto:${KONTAKT_EPOST}`} className="font-semibold text-primary hover:text-primary-dark">
              {KONTAKT_EPOST}
            </a>
            .
          </p>
        </header>

        {SPORSMAL.map((g, i) => (
          <section key={g.tittel} aria-labelledby={`gruppe-${i}`} className="flex flex-col gap-2">
            <h2 id={`gruppe-${i}`} className="font-display text-2xl font-semibold tracking-[-0.01em]">
              {g.tittel}
            </h2>
            <Sporsmalliste liste={g.liste} />
          </section>
        ))}
      </main>
      <footer className="border-t border-border">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 py-8">
          <Bunnlenker />
        </div>
      </footer>
    </div>
  );
}
