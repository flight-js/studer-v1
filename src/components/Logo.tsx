export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display font-bold tracking-[-0.015em] lowercase ${className}`}
    >
      studer
    </span>
  );
}
