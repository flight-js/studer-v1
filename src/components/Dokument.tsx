import { AppBar } from "@/components/AppBar";
import { Bunnlenker } from "@/components/Bunnlenker";

// Oppsett for tekstsider som bruksvilkår og personvernerklæring: kort
// oppsummering øverst, deretter nummererte avsnitt.
export function Dokument({
  tittel,
  oppdatert,
  kortFortalt,
  children,
}: {
  tittel: string;
  oppdatert: string;
  kortFortalt: React.ReactNode[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1">
      <AppBar back="/" backLabel="Forsiden" />
      <main id="innhold" className="px-5 sm:px-8 pt-10 sm:pt-14 pb-20 w-full max-w-2xl mx-auto flex flex-col gap-10">
        <header className="flex flex-col gap-3">
          <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.02em]">{tittel}</h1>
          <p className="text-sm text-muted">Sist oppdatert {oppdatert}</p>
        </header>

        <section aria-labelledby="kort-fortalt" className="bg-surface border border-border rounded-2xl p-5 sm:p-6 flex flex-col gap-3">
          <h2 id="kort-fortalt" className="font-display text-xl font-semibold">
            Kort fortalt
          </h2>
          <ul className="flex flex-col gap-2 list-disc pl-5 text-ink-soft leading-relaxed marker:text-faint">
            {kortFortalt.map((punkt, i) => (
              <li key={i}>{punkt}</li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-9">{children}</div>
      </main>
      <footer className="border-t border-border">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 py-8">
          <Bunnlenker />
        </div>
      </footer>
    </div>
  );
}

export function Avsnitt({ nr, tittel, children }: { nr: number; tittel: string; children: React.ReactNode }) {
  const id = `del-${nr}`;
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3 scroll-mt-24">
      <h2 id={id} className="font-display text-2xl font-semibold tracking-[-0.01em]">
        {nr}. {tittel}
      </h2>
      <div className="flex flex-col gap-3 text-ink-soft leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:marker:text-faint [&_a]:text-primary [&_a]:font-medium [&_a:hover]:text-primary-dark [&_strong]:text-foreground [&_strong]:font-semibold">
        {children}
      </div>
    </section>
  );
}
