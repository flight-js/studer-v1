export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display font-bold tracking-normal lowercase ${className}`}
    >
      studer
    </span>
  );
}
