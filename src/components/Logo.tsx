// Ordmerket «studer» med fjærpennen (public/merke/studer-ordmerke.svg).
// Tegnes som en maske fylt med tekstfargen (se .logo-ordmerke i globals.css),
// så det er mørkt på papir og kremhvitt på natt-flatene og i mørk modus.
// Størrelsen følger font-size (text-2xl osv.): høyden er 1em.
export function Logo({ className = "" }: { className?: string }) {
  return <span role="img" aria-label="studer" className={`logo-ordmerke ${className}`} />;
}
