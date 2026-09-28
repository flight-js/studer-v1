"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, Close } from "@/components/icons";
import { useAuth } from "@/lib/auth";
import { temaHref } from "@/lib/pensum";
import { supabase, supabaseKey, supabaseUrl } from "@/lib/supabase";

// Chat med AI-hjelpen i et tema. Svaret strømmes fra edge-funksjonen «chat»
// (supabase/functions/chat), som har API-nøkkelen og holder bruksgrensene.
// Grensene er skjult: eleven får aldri se tall, bare en vennlig melding.
// Samtalen finnes bare her i nettleseren og forsvinner når siden lukkes.

type Melding = { rolle: "bruker" | "assistent"; tekst: string };

const FORSLAG = ["Forklar temaet kort", "Hva er de viktigste begrepene?", "Gi meg en øvingsoppgave"];

export function AiHjelp({
  temaId,
  temaNavn,
  fagNavn,
  apen,
  onLukk,
}: {
  temaId: string;
  temaNavn: string;
  fagNavn: string;
  apen: boolean;
  onLukk: () => void;
}) {
  const { bruker, laster } = useAuth();
  const [meldinger, setMeldinger] = useState<Melding[]>([]);
  const [utkast, setUtkast] = useState("");
  const [skriver, setSkriver] = useState(false);
  const [feil, setFeil] = useState<string | null>(null);
  const liste = useRef<HTMLDivElement>(null);
  const felt = useRef<HTMLTextAreaElement>(null);
  const avbryt = useRef<AbortController | null>(null);

  useEffect(() => () => avbryt.current?.abort(), []);

  useEffect(() => {
    if (apen) felt.current?.focus();
  }, [apen]);

  useEffect(() => {
    liste.current?.scrollTo({ top: liste.current.scrollHeight });
  }, [meldinger]);

  async function send(tekst: string) {
    const sporsmal = tekst.trim();
    if (!sporsmal || skriver) return;
    const samtale: Melding[] = [...meldinger, { rolle: "bruker", tekst: sporsmal }];
    setMeldinger([...samtale, { rolle: "assistent", tekst: "" }]);
    setUtkast("");
    setFeil(null);
    setSkriver(true);

    const kontroller = new AbortController();
    avbryt.current = kontroller;
    let svar = "";
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Chatfeil("Du må logge inn på nytt for å bruke AI-hjelpen.");

      const res = await fetch(`${supabaseUrl}/functions/v1/chat`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ temaId, meldinger: samtale }),
        signal: kontroller.signal,
      });
      if (!res.ok || !res.body) throw new Chatfeil(await feiltekst(res));


      const leser = res.body.getReader();
      const dekoder = new TextDecoder();
      for (;;) {
        const { done, value } = await leser.read();
        if (done) break;
        svar += dekoder.decode(value, { stream: true });
        const delsvar = svar;
        setMeldinger([...samtale, { rolle: "assistent", tekst: delsvar }]);
      }
      if (!svar.trim()) throw new Chatfeil("Fikk ikke noe svar. Prøv å spørre på en annen måte.");
    } catch (e) {
      if (kontroller.signal.aborted) return;
      if (svar.trim()) {
        // Svaret ble brutt underveis – behold det som kom.
        setFeil("Svaret ble avbrutt. Spør gjerne igjen.");
      } else {
        // Ingenting kom fram: ta spørsmålet tilbake i feltet.
        setMeldinger(meldinger);
        setUtkast(sporsmal);
        setFeil(
          e instanceof Chatfeil
            ? e.message
            : e instanceof TypeError
              ? "Fikk ikke kontakt med serveren. Sjekk nettet."
              : "AI-hjelpen svarer ikke akkurat nå. Prøv igjen om litt."
        );
      }
    } finally {
      if (avbryt.current === kontroller) avbryt.current = null;
      setSkriver(false);
    }
  }

  return (
    <div
      id="ai-panel"
      role="dialog"
      aria-label="AI-hjelp"
      hidden={!apen}
      className="w-[min(24rem,calc(100vw-2.5rem))] bg-surface border border-border rounded-3xl shadow-lift flex flex-col rise"
    >
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <span className="text-sm font-semibold">AI-hjelp</span>
        <button
          onClick={onLukk}
          aria-label="Lukk AI-hjelp"
          className="p-1.5 -m-1.5 rounded-lg text-muted hover:text-foreground hover:bg-sunken transition-colors"
        >
          <Close size={18} />
        </button>
      </div>

      {!bruker ? (
        <div className="px-5 pb-5 flex flex-col gap-4">
          <p className="bg-sunken rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed text-ink-soft">
            Logg inn for å stille spørsmål om {temaNavn}.
          </p>
          {!laster && (
            <Link
              href={`/logg-inn?neste=${encodeURIComponent(temaHref("/tema", temaId))}`}
              className="text-center px-4 py-3 rounded-xl bg-foreground text-background text-sm font-semibold active:scale-[0.98] transition-transform"
            >
              Logg inn
            </Link>
          )}
        </div>
      ) : (
        <>
          <div
            ref={liste}
            aria-live="polite"
            aria-busy={skriver}
            className="px-5 flex flex-col gap-3 max-h-[min(26rem,55vh)] overflow-y-auto overscroll-contain"
          >
            <p className="self-start max-w-[92%] bg-sunken rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed text-ink-soft">
              Hva lurer du på i {temaNavn}? Jeg svarer på spørsmål om {fagNavn}, ut fra pensumet.
            </p>
            {meldinger.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {FORSLAG.map((f) => (
                  <button
                    key={f}
                    onClick={() => send(f)}
                    className="text-xs font-medium px-3 py-1.5 rounded-full border border-border text-ink-soft hover:border-primary/50 hover:text-foreground transition-colors"
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
            {meldinger.map((m, i) =>
              m.rolle === "bruker" ? (
                <p
                  key={i}
                  className="self-end max-w-[85%] bg-primary text-white rounded-2xl rounded-br-md px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words"
                >
                  {m.tekst}
                </p>
              ) : (
                <div
                  key={i}
                  className="self-start max-w-[92%] bg-sunken rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed text-ink-soft break-words"
                >
                  {m.tekst ? <Svartekst tekst={m.tekst} /> : <Prikker />}
                </div>
              )
            )}
          </div>

          <div className="px-5 pt-3 pb-4 flex flex-col gap-2">
            {feil && (
              <p role="alert" className="text-xs font-medium text-danger-ink bg-danger-tint rounded-lg px-3 py-2">
                {feil}
              </p>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(utkast);
              }}
              className="flex items-end gap-2"
            >
              <label htmlFor="ai-input" className="sr-only">
                Skriv et spørsmål
              </label>
              <textarea
                id="ai-input"
                ref={felt}
                rows={1}
                value={utkast}
                maxLength={1500}
                onChange={(e) => setUtkast(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(utkast);
                  }
                }}
                placeholder="Skriv et spørsmål"
                className="flex-1 min-w-0 resize-none max-h-32 field-sizing-content bg-background border border-border rounded-xl px-3.5 py-2.5 text-base sm:text-sm placeholder:text-faint"
              />
              <button
                type="submit"
                disabled={skriver || !utkast.trim()}
                aria-label="Send"
                className="shrink-0 w-10.5 h-10.5 rounded-xl bg-foreground text-background flex items-center justify-center disabled:opacity-40 active:scale-[0.95] transition-[opacity,transform]"
              >
                <ArrowUp size={18} />
              </button>
            </form>
            <p className="text-[11px] leading-snug text-faint">
              AI kan ta feil – sjekk viktige ting i sammendraget. Ikke del personlige opplysninger.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

class Chatfeil extends Error {}

async function feiltekst(res: Response): Promise<string> {
  const body = (await res.json().catch(() => ({}))) as { feil?: string; grunn?: string };
  if (res.status === 401) return "Du må logge inn på nytt for å bruke AI-hjelpen.";
  if (res.status === 429) {
    if (body.grunn === "minutt") return "Du sender spørsmål veldig raskt. Vent litt før du spør igjen.";
    if (body.grunn === "global") return "AI-hjelpen har mye pågang akkurat nå. Prøv igjen senere.";
    return "Du har brukt AI-hjelpen mye i dag. Ta en pause og prøv igjen i morgen.";
  }
  if (body.feil === "ikke-satt-opp") return "AI-hjelpen er ikke slått på ennå. Prøv igjen senere.";
  if (res.status === 404) return "Fant ikke temaet. Last inn siden på nytt.";
  return "AI-hjelpen svarer ikke akkurat nå. Prøv igjen om litt.";
}

function Prikker() {
  return (
    <span className="flex gap-1 py-1.5" aria-label="Skriver">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-border-strong animate-pulse"
          style={{ animationDelay: `${i * 160}ms` }}
        />
      ))}
    </span>
  );
}

// Svarene bruker enkel Markdown: avsnitt, «- » og «1. »-lister og **fet**.
function Svartekst({ tekst }: { tekst: string }) {
  const blokker: React.ReactNode[] = [];
  let linjer: string[] = [];
  let liste = null as { nummerert: boolean; punkter: string[] } | null;

  const tomAvsnitt = () => {
    if (linjer.length) {
      const l = linjer;
      blokker.push(
        <p key={blokker.length}>
          {l.map((linje, i) => (
            <span key={i}>
              {i > 0 && <br />}
              <Fet tekst={linje} />
            </span>
          ))}
        </p>
      );
      linjer = [];
    }
  };
  const tomListe = () => {
    if (liste) {
      const { nummerert, punkter } = liste;
      const Tag = nummerert ? "ol" : "ul";
      blokker.push(
        <Tag key={blokker.length} className={`pl-5 flex flex-col gap-1 ${nummerert ? "list-decimal" : "list-disc"}`}>
          {punkter.map((p, i) => (
            <li key={i}>
              <Fet tekst={p} />
            </li>
          ))}
        </Tag>
      );
      liste = null;
    }
  };

  for (const rad of tekst.split("\n")) {
    const l = rad.trim();
    const punkt = /^[-*•]\s+(.*)/.exec(l);
    const nummer = /^\d+[.)]\s+(.*)/.exec(l);
    if (!l) {
      tomAvsnitt();
      tomListe();
    } else if (punkt || nummer) {
      tomAvsnitt();
      const nummerert = !!nummer;
      if (liste && liste.nummerert !== nummerert) tomListe();
      liste ??= { nummerert, punkter: [] };
      liste.punkter.push((punkt ?? nummer)![1]);
    } else {
      tomListe();
      linjer.push(l.replace(/^#+\s+/, ""));
    }
  }
  tomAvsnitt();
  tomListe();

  return <div className="flex flex-col gap-2.5">{blokker}</div>;
}

function Fet({ tekst }: { tekst: string }) {
  return (
    <>
      {tekst.split(/(\*\*[^*]+\*\*)/g).map((del, i) =>
        del.startsWith("**") && del.endsWith("**") && del.length > 4 ? (
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
