import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ArrowRight } from "@/components/icons";

export default function NotFound() {
  return (
    <main
      id="innhold"
      className="flex-1 flex flex-col items-center justify-center gap-6 px-5 py-20 text-center"
    >
      <Link href="/" aria-label="Studer – forsiden" className="rounded-md">
        <Logo className="text-2xl" />
      </Link>
      <p className="font-display text-[120px] sm:text-[160px] leading-none font-semibold tracking-[-0.04em] text-border-strong">
        404
      </p>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.02em]">
        Denne siden står ikke i pensum
      </h1>
      <p className="text-lg text-ink-soft max-w-[40ch]">
        Lenken kan være feil, eller siden er flyttet. Gå tilbake og velg fag
        derfra.
      </p>
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        <Link
          href="/fag"
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98]"
        >
          Velg fag
          <ArrowRight size={16} />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center border-[1.5px] border-border-strong px-5 py-3.5 rounded-xl text-sm font-semibold hover:border-foreground transition-colors active:scale-[0.98]"
        >
          Til forsiden
        </Link>
      </div>
    </main>
  );
}
