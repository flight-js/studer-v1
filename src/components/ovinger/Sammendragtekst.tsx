// Sammendragene bruker en liten del av Markdown: «## » for mellomtitler,
// «- » for punktlister og **fet** for nøkkelbegreper.
export function Sammendragtekst({ kilde }: { kilde: string }) {
  const blokker: React.ReactNode[] = [];
  let avsnitt: string[] = [];
  let liste: string[] = [];

  const tomAvsnitt = () => {
    if (avsnitt.length) {
      const tekst = avsnitt.join(" ");
      blokker.push(
        erFormel(tekst) ? (
          <p
            key={blokker.length}
            className="w-fit max-w-full bg-sunken/70 rounded-xl px-4 py-3 text-[17px] font-medium text-foreground tabular-nums"
          >
            <Inline tekst={tekst} />
          </p>
        ) : (
          <p key={blokker.length} className="text-[17px] leading-[1.75] text-ink-soft">
            <Inline tekst={tekst} />
          </p>
        )
      );
      avsnitt = [];
    }
  };
  const tomListe = () => {
    if (liste.length) {
      blokker.push(
        <ul key={blokker.length} className="flex flex-col gap-2 pl-1">
          {liste.map((l, i) => (
            <li key={i} className="flex gap-3 text-[17px] leading-[1.7] text-ink-soft">
              <span className="mt-[0.72em] w-1.5 h-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <span>
                <Inline tekst={l} />
              </span>
            </li>
          ))}
        </ul>
      );
      liste = [];
    }
  };

  for (const linje of kilde.split("\n")) {
    const l = linje.trim();
    if (!l) {
      tomAvsnitt();
      tomListe();
    } else if (l.startsWith("## ")) {
      tomAvsnitt();
      tomListe();
      blokker.push(
        <h2
          key={blokker.length}
          className="font-display text-2xl sm:text-[28px] font-semibold tracking-[-0.015em] leading-tight mt-6 first:mt-0"
        >
          {l.slice(3)}
        </h2>
      );
    } else if (l.startsWith("- ")) {
      tomAvsnitt();
      liste.push(l.slice(2));
    } else {
      tomListe();
      avsnitt.push(l);
    }
  }
  tomAvsnitt();
  tomListe();

  return <div className="flex flex-col gap-5">{blokker}</div>;
}

// Et kort avsnitt med likhets- eller reaksjonstegn og uten punktum er en
// formel eller reaksjonsligning, og vises for seg.
function erFormel(tekst: string) {
  return tekst.length < 90 && /[=→⇌≈]/.test(tekst) && !/[.:!?]$/.test(tekst.trim());
}

function Inline({ tekst }: { tekst: string }) {
  return (
    <>
      {tekst.split(/(\*\*[^*]+\*\*)/g).map((del, i) =>
        del.startsWith("**") && del.endsWith("**") ? (
          <strong key={i} className="font-semibold text-foreground">
            {del.slice(2, -2)}
          </strong>
        ) : (
          del
        )
      )}
    </>
  );
}
