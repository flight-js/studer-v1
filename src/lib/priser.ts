// Prisene som vises i appen. De må stemme med prisene i Stripe
// (STRIPE_PRIS_MANED og STRIPE_PRIS_AR i Supabase) – det er Stripe som trekker.

export type Plan = "maned" | "ar";

export const PRIS: Record<Plan, number> = { maned: 59, ar: 499 };
export const ARLIG_SPARING = PRIS.maned * 12 - PRIS.ar;

export const PLANNAVN: Record<string, string> = {
  gratis: "Gratis",
  maned: "Månedlig",
  ar: "Årlig",
};

export const ENHET: Record<Plan, string> = { maned: "/ mnd", ar: "/ år" };

export const FORDELER = ["Alle fag og trinn", "Ubegrenset quiz og flashcards", "AI-hjelp i alle temaer"];
