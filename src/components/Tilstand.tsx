import Link from "next/link";
import { ArrowRight } from "@/components/icons";

// Felles visninger for lasting, feil og innhold som krever innlogging.

export function Laster({ tekst = "Henter innhold" }: { tekst?: string }) {
  return (
    <div role="status" className="flex-1 flex flex-col items-center justify-center gap-4 py-24 text-muted">
      <span className="flex gap-1.5" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-border-strong animate-pulse"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </span>
      <span className="text-sm">{tekst} …</span>
    </div>
  );
}

export function Feil({
  tittel = "Noe gikk galt",
  tekst,
  href = "/fag",
  lenketekst = "Til fagoversikten",
}: {
  tittel?: string;
  tekst: string;
  href?: string;
  lenketekst?: string;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-5 py-24 text-center rise">
      <h1 className="font-display text-3xl font-semibold tracking-[-0.02em]">{tittel}</h1>
      <p className="text-ink-soft max-w-[42ch]">{tekst}</p>
      <Link
        href={href}
        className="mt-2 inline-flex items-center gap-2 border-[1.5px] border-border-strong px-5 py-3 rounded-xl text-sm font-semibold hover:border-foreground transition-colors active:scale-[0.98]"
      >
        {lenketekst}
      </Link>
    </div>
  );
}

export function KreverInnlogging({ hva = "dette temaet" }: { hva?: string }) {
  const neste = typeof window === "undefined" ? "/fag" : window.location.pathname + window.location.search;
  const q = `?neste=${encodeURIComponent(neste)}`;
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 px-5 py-24 text-center rise">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.02em]">
        Logg inn for å øve
      </h1>
      <p className="text-lg text-ink-soft max-w-[40ch]">
        Du trenger en konto for å se flashcards, quiz og miniprøver i {hva}.
      </p>
      <div className="flex flex-wrap justify-center gap-3 mt-1">
        <Link
          href={`/registrer${q}`}
          className="group inline-flex items-center gap-2 bg-primary text-white px-5 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98]"
        >
          Lag konto
          <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
        <Link
          href={`/logg-inn${q}`}
          className="inline-flex items-center border-[1.5px] border-border-strong px-5 py-3.5 rounded-xl text-sm font-semibold hover:border-foreground transition-colors active:scale-[0.98]"
        >
          Logg inn
        </Link>
      </div>
    </div>
  );
}
