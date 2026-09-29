// Merke på begreper og spørsmål som ikke er kjerne: eksempler som skoler velger
// ulikt, og stoff over nivået for trinnet (se scripts/nivasjekk.mjs).
// forklart: vis forklaringen, ikke bare «Ekstra».
export function Ekstramerke({ forklart = false }: { forklart?: boolean }) {
  return (
    <span
      title="Ikke alle klasser lærer dette"
      className="inline-flex items-center rounded-full bg-sunken px-2.5 py-0.5 text-xs font-semibold text-muted"
    >
      Ekstra
      {forklart ? " · ikke alle klasser lærer dette" : <span className="sr-only">: ikke alle klasser lærer dette</span>}
    </span>
  );
}
