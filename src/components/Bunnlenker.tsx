import Link from "next/link";
import { KONTAKT_EPOST } from "@/lib/juridisk";

// Lenkene som skal finnes nederst overalt: vilkår, personvern, forslag og kontakt.
export function Bunnlenker({ className = "" }: { className?: string }) {
  const lenke = "hover:text-foreground transition-colors";
  return (
    <nav aria-label="Om Studer" className={`flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted ${className}`}>
      <Link href="/forslag" className={lenke}>
        Send forslag
      </Link>
      <Link href="/vilkar" className={lenke}>
        Bruksvilkår
      </Link>
      <Link href="/personvern" className={lenke}>
        Personvern
      </Link>
      <a href={`mailto:${KONTAKT_EPOST}`} className={lenke}>
        {KONTAKT_EPOST}
      </a>
    </nav>
  );
}
