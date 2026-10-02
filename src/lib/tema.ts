import { useSyncExternalStore } from "react";
import { TEMA_NOKKEL } from "@/lib/temaskript";

// Lys og mørk modus. «system» følger innstillingen på telefonen eller PC-en.
// Valget lagres bare i nettleseren. Skriptet i lib/temaskript.ts setter
// modusen før siden tegnes; settTema under bytter den etterpå.

export type Tema = "system" | "lys" | "mork";

const lyttere = new Set<() => void>();

function les(): Tema {
  try {
    const v = localStorage.getItem(TEMA_NOKKEL);
    return v === "lys" || v === "mork" ? v : "system";
  } catch {
    return "system";
  }
}

export function settTema(tema: Tema) {
  try {
    if (tema === "system") localStorage.removeItem(TEMA_NOKKEL);
    else localStorage.setItem(TEMA_NOKKEL, tema);
  } catch {}
  const mork = tema === "mork" || (tema === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.tema = mork ? "mork" : "lys";
  lyttere.forEach((l) => l());
}

export function erMork() {
  return typeof document !== "undefined" && document.documentElement.dataset.tema === "mork";
}

export function useTema(): [Tema, (tema: Tema) => void] {
  const tema = useSyncExternalStore(
    (l) => {
      lyttere.add(l);
      return () => {
        lyttere.delete(l);
      };
    },
    les,
    () => "system" as Tema,
  );
  return [tema, settTema];
}
