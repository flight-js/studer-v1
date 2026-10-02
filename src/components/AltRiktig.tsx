import { Check } from "@/components/icons";

// Vises bare når eleven har alt riktig. Det er sjeldent nok til at merket får
// en liten sprett (.pop i globals.css). Teksten under sier det samme, så merket
// er skjult for skjermlesere.
export function AltRiktig() {
  return (
    <span
      aria-hidden="true"
      className="pop inline-flex items-center justify-center w-14 h-14 rounded-full bg-success text-white shadow-card"
    >
      <Check size={28} />
    </span>
  );
}
