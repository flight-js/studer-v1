import Link from "next/link";
import { Instagram, TikTok } from "@/components/icons";
import { KONTAKT_EPOST } from "@/lib/juridisk";
import { SOSIALE_MEDIER } from "@/lib/seo";

const IKONER: Record<string, typeof Instagram> = { Instagram, TikTok };

// Lenkene som skal finnes nederst overalt: forslag, vilkår, personvern og
// kontakt til venstre, profilene våre i sosiale medier til høyre.
export function Bunnlenker({ className = "" }: { className?: string }) {
  const lenke = "hover:text-foreground transition-colors";
  const profiler = SOSIALE_MEDIER.filter((p) => p.url);
  return (
    <div className={`flex flex-wrap items-center justify-between gap-x-6 gap-y-4 ${className}`}>
      <nav aria-label="Om Studer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
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
          Kontakt oss
        </a>
      </nav>
      {profiler.length > 0 && (
        <ul aria-label="Studer i sosiale medier" className="flex items-center gap-1 -mx-2">
          {profiler.map((p) => {
            const Ikon = IKONER[p.navn];
            return (
              <li key={p.navn}>
                <a
                  href={p.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Studer på ${p.navn}`}
                  title={p.navn}
                  className="flex p-2 rounded-lg text-muted hover:text-foreground hover:bg-sunken transition-colors"
                >
                  {Ikon && <Ikon size={20} />}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
