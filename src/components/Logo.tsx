export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display font-medium tracking-[-0.01em] lowercase ${className}`}
    >
      studer
    </span>
  );
}
