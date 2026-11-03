import { Check } from "@/components/icons";

// Avkrysningsboks: hake når alt er valgt, strek når bare noe er valgt (et tema
// der eleven har tatt bort noen av formlene). Selve knappen har role="checkbox".
export function Avkrysning({ tilstand }: { tilstand: boolean | "mixed" }) {
  return (
    <span
      aria-hidden="true"
      className={`shrink-0 size-5 rounded-md border-[1.5px] flex items-center justify-center transition-colors duration-150 ${
        tilstand ? "bg-primary border-primary text-white" : "border-border-strong"
      }`}
    >
      {tilstand === true && <Check size={14} />}
      {tilstand === "mixed" && <span className="w-2.5 h-0.5 rounded-full bg-current" />}
    </span>
  );
}
