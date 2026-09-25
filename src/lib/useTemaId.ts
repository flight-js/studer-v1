"use client";

import { useSearchParams } from "next/navigation";
import { temaId } from "./pensum";

// Tema-ID fra adressen (?fag=…&tema=…). Krever <Suspense> rundt komponenten.
export function useTemaId(): string | null {
  const params = useSearchParams();
  const fag = params.get("fag");
  const tema = params.get("tema");
  return fag && tema ? temaId(fag, tema) : null;
}
