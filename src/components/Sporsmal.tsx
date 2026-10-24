import { Plus } from "@/components/icons";
import type { Sporsmal } from "@/lib/sporsmal";

// Spørsmål og svar som trekkspill. <details> åpner og lukker uten JavaScript,
// og svaret glir opp der nettleseren kan animere høyden (se .sporsmal i
// globals.css). vis: data-vis-attributtene til forsidens innglidning.
export function Sporsmalliste({ liste, vis = false }: { liste: Sporsmal[]; vis?: boolean }) {
  return (
    <div data-vis-gruppe={vis || undefined} className="border-t border-border">
      {liste.map((s) => (
        <details key={s.id} id={s.id} data-vis={vis || undefined} className="sporsmal group border-b border-border">
          <summary className="flex items-start justify-between gap-6 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden text-[17px] sm:text-lg font-semibold leading-snug rounded-md">
            {s.sporsmal}
            <Plus
              size={20}
              className="shrink-0 mt-0.5 text-muted transition-[rotate,color] duration-300 ease-(--ease-out-soft) group-hover:text-foreground group-open:rotate-45 group-open:text-foreground"
            />
          </summary>
          <div className="pb-6 pr-10 max-w-[62ch] flex flex-col gap-3 text-ink-soft leading-relaxed [&_a]:font-semibold [&_a]:text-foreground [&_a]:underline [&_a]:decoration-border-strong [&_a]:decoration-2 [&_a]:underline-offset-4 [&_a:hover]:decoration-foreground">
            {s.svar}
          </div>
        </details>
      ))}
    </div>
  );
}
