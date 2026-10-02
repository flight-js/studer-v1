// Overskrift som Bevegelse.tsx kan vise ord for ord. Skjermlesere får hele
// teksten fra sr-only-kopien; de enkelte ordene er aria-hidden. Uten
// JavaScript står ordene bare der som vanlig tekst.
// selvstyrt: overskriften animeres av komponenten selv (f.eks. fordi teksten
// endrer seg), ikke av Bevegelse.tsx.
export function Ordtittel({
  as: Tag = "h2",
  children,
  className = "",
  id,
  selvstyrt = false,
}: {
  as?: "h1" | "h2" | "h3";
  children: string;
  className?: string;
  id?: string;
  selvstyrt?: boolean;
}) {
  const ord = children.split(" ");
  return (
    <Tag id={id} data-ord={selvstyrt ? undefined : ""} className={className}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">
        {ord.map((o, i) => (
          <span key={i}>
            <span className="ord-maske">
              <span className="ord">{o}</span>
            </span>
            {i < ord.length - 1 && " "}
          </span>
        ))}
      </span>
    </Tag>
  );
}
