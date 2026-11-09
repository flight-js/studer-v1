// Vises når konkurransen ikke er satt opp i databasen ennå, og sidene bruker
// eksempeldata (se lib/konkurranse.ts). Tallene skal aldri kunne forveksles med ekte.
export function Demomerke({ className = "" }: { className?: string }) {
  return (
    <p
      role="note"
      className={`rounded-xl border border-dashed border-border-strong bg-sunken px-4 py-3 text-sm text-ink-soft ${className}`}
    >
      <span className="font-semibold text-foreground">Eksempeldata.</span> Konkurransen er ikke slått på ennå, så
      tallene, kallenavnene og skolene her er oppdiktet for å vise hvordan siden vil se ut.
    </p>
  );
}
