import Link from "next/link";
import { ChevronLeft } from "@/components/icons";

// Topplinje for app-sidene: tilbakeknapp til venstre, brødsmuler, profil til høyre.
export function AppBar({
  back,
  backLabel,
  children,
}: {
  back: string;
  backLabel: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-5 sm:px-8 h-16">
        <Link
          href={back}
          className="group flex items-center gap-1.5 -ml-2 pl-1 pr-3 py-2 rounded-lg text-sm text-muted hover:text-foreground hover:bg-sunken transition-colors duration-200 min-w-0"
        >
          <ChevronLeft
            size={18}
            className="shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5"
          />
          <span className="truncate">{backLabel}</span>
        </Link>
        <div className="flex items-center gap-4">
          {children}
          <div
            className="w-9 h-9 rounded-[10px] bg-foreground text-background flex items-center justify-center text-[13px] font-semibold"
            aria-label="Din profil"
            title="Din profil"
          >
            CL
          </div>
        </div>
      </div>
    </header>
  );
}
