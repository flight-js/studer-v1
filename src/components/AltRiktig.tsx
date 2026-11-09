import { Feiringsmerke } from "@/components/Feiringsmerke";

// Vises bare når eleven har alt riktig: grønn hake som stemples inn, med
// konfetti (se Feiringsmerke).
export function AltRiktig() {
  return <Feiringsmerke type="alt-riktig" />;
}
