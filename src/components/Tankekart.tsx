import type { Tankekart as Node } from "@/lib/pensum";

// Tankekart for et tema. På brede skjermer tegnes det som et tre fra venstre
// mot høyre (linjene kommer fra .tk-* i globals.css); på smale skjermer som en
// innrykket liste.

export function Tankekart({ rot }: { rot: Node }) {
  return (
    <>
      <div className="hidden lg:block overflow-x-auto -mx-2 px-2 pb-2">
        <div className="tk-rad-rot flex items-center w-max py-2">
          <span className="shrink-0 max-w-52 bg-foreground text-background rounded-2xl px-5 py-4 font-display text-xl font-semibold leading-tight text-balance">
            {rot.label}
          </span>
          {rot.children && <Grener noder={rot.children} dybde={1} />}
        </div>
      </div>

      <div className="lg:hidden flex flex-col gap-4">
        <span className="self-start bg-foreground text-background rounded-2xl px-4 py-3 font-display text-lg font-semibold">
          {rot.label}
        </span>
        <ul className="flex flex-col gap-3">
          {rot.children?.map((gren, i) => (
            <li key={i} className="bg-surface border border-border rounded-2xl p-4 flex flex-col gap-3">
              <span className="self-start">
                <NodeTekst node={gren} dybde={1} />
              </span>
              {gren.children && <Liste noder={gren.children} />}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function Grener({ noder, dybde }: { noder: Node[]; dybde: number }) {
  return (
    <div className="tk-barn flex flex-col justify-center">
      {noder.map((n, i) => (
        <div key={i} className="tk-gren flex items-center py-1">
          <NodeTekst node={n} dybde={dybde} />
          {n.children && <Grener noder={n.children} dybde={dybde + 1} />}
        </div>
      ))}
    </div>
  );
}

function NodeTekst({ node, dybde }: { node: Node; dybde: number }) {
  if (dybde === 1) {
    return (
      <span className="shrink-0 max-w-56 bg-primary text-white rounded-xl px-4 py-2.5 flex flex-col gap-0.5">
        <span className="font-semibold leading-snug">{node.label}</span>
        {node.note && <span className="text-xs text-white/75 leading-snug">{node.note}</span>}
      </span>
    );
  }
  return (
    <span
      className={`shrink-0 max-w-60 rounded-xl px-3.5 py-2 flex flex-col gap-0.5 border ${
        dybde === 2 ? "bg-primary-tint border-primary/25" : "bg-surface border-border"
      }`}
    >
      <span className="text-[15px] font-semibold leading-snug">{node.label}</span>
      {node.note && <span className="text-xs text-muted leading-snug">{node.note}</span>}
    </span>
  );
}

function Liste({ noder }: { noder: Node[] }) {
  return (
    <ul className="flex flex-col gap-2 pl-3.5 border-l-[1.5px] border-border-strong">
      {noder.map((n, i) => (
        <li key={i} className="flex flex-col gap-2">
          <span className="flex flex-col">
            <span className="text-[15px] font-semibold leading-snug">{n.label}</span>
            {n.note && <span className="text-sm text-muted leading-snug">{n.note}</span>}
          </span>
          {n.children && <Liste noder={n.children} />}
        </li>
      ))}
    </ul>
  );
}
