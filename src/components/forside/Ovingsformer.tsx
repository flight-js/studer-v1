"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { Check, Close } from "@/components/icons";
import { EKSEMPEL } from "@/lib/forsidedata";

gsap.registerPlugin(ScrollTrigger);

// De fire øvingsformene på forsiden, vist med eksempeltemaet fra «Slik funker
// det». Flashcardet og quizen er ekte og kan prøves; miniprøven og AI-hjelpen
// er eksempler (tydelig merket) som spilles av når de kommer inn i bildet.

const tema = `${EKSEMPEL.fag} · ${EKSEMPEL.tema}`;

export function Ovingsformer() {
  const rot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rot.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-demo]", el).forEach((demo) => {
        gsap.from(demo, {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: demo, start: "top 85%", once: true },
        });
      });
    }, el);
    return () => mm.revert();
  }, []);

  return (
    <div ref={rot} className="flex flex-col">
      <Rad nr={1} tittel="Flashcards" tekst="Begreper, formler og definisjoner. Snu kortet, svar ærlig, og de du ikke kan, kommer tilbake.">
        <Flashcard />
      </Rad>
      <Rad nr={2} tittel="Quiz" tekst="Flervalg med en forklaring på hvert svar, så du skjønner hvorfor – ikke bare hva som var riktig.">
        <Quiz />
      </Rad>
      <Rad nr={3} tittel="Miniprøver" tekst="Skriv svarene selv, på tid. KI retter mot fasiten, og delvis riktig gir halvt poeng.">
        <Miniprove />
      </Rad>
      <Rad nr={4} tittel="AI-hjelp" tekst="Spør når noe er uklart. Svarene holder seg til pensumet i faget du øver på.">
        <AiHjelp />
      </Rad>
    </div>
  );
}

function Rad({
  nr,
  tittel,
  tekst,
  children,
}: {
  nr: number;
  tittel: string;
  tekst: string;
  children: React.ReactNode;
}) {
  return (
    <article className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-8 lg:gap-16 py-14 lg:py-20 border-t border-border">
      <div className="flex flex-col gap-4 lg:pt-4">
        <span className="text-sm font-medium tabular-nums text-muted">0{nr}</span>
        <h3 className="text-5xl lg:text-6xl font-semibold tracking-[-0.025em] leading-[0.98]">{tittel}</h3>
        <p className="text-lg leading-relaxed text-ink-soft max-w-[36ch]">{tekst}</p>
      </div>
      <div data-demo className="rounded-3xl bg-surface border border-border p-5 sm:p-8 shadow-card">
        {children}
      </div>
    </article>
  );
}

function Demohode({ merke }: { merke?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-5 text-xs font-medium text-muted">
      <span className="truncate">{tema}</span>
      {merke && (
        <span className="shrink-0 rounded-md bg-sunken px-2 py-1 text-ink-soft">{merke}</span>
      )}
    </div>
  );
}

type Svar = "kan" | "kanIkke";

const SVARTEKST: Record<Svar, string> = {
  kan: "Bra! I appen går kortet ut av bunken.",
  kanIkke: "Helt greit. I appen kommer kortet tilbake senere i bunken.",
};

// Svarknappene er de samme som i appen, men demoen har bare dette ene kortet:
// svaret vises, og kortet blir liggende.
function Flashcard() {
  const [snudd, setSnudd] = useState(false);
  const [svar, setSvar] = useState<Svar | null>(null);
  const [trykk, setTrykk] = useState(0);
  const knapper = useRef<Record<Svar, HTMLButtonElement | null>>({ kan: null, kanIkke: null });
  const { term, def } = EKSEMPEL.flashcard;

  const snu = () => {
    setSnudd((s) => !s);
    setSvar(null);
  };

  const velg = (valg: Svar) => {
    if (!snudd) return;
    setSvar(valg);
    setTrykk((t) => t + 1);
    // Et lite trykk inn og ut – også når samme knapp trykkes flere ganger.
    // GSAP rører bare transform, som React ikke styrer på knappen.
    const el = knapper.current[valg];
    if (el && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(
        el,
        { scale: 0.94 },
        { scale: 1, duration: 0.5, ease: "back.out(3)", overwrite: true, clearProps: "transform" },
      );
    }
  };

  const tilstand = (valg: Svar) => (!snudd ? "lukket" : svar === valg ? "valgt" : svar ? "annen" : "klar");
  const kanIkke = tilstand("kanIkke");
  const kan = tilstand("kan");
  const knapp =
    "flex items-center justify-center gap-2 rounded-xl border-[1.5px] px-4 py-3 text-sm font-semibold transition-[background-color,border-color,color,opacity] duration-300";

  return (
    <div>
      <Demohode merke="Prøv selv" />
      <button
        type="button"
        onClick={snu}
        aria-pressed={snudd}
        aria-label={snudd ? `${term}: ${def}. Trykk for å snu tilbake.` : `Flashcard: ${term}. Trykk for å snu.`}
        className="flip-scene block w-full text-left rounded-2xl"
      >
        <div className="flip-card relative h-56 sm:h-64" data-flipped={snudd}>
          <div className="flip-face absolute inset-0 rounded-2xl bg-background border border-border flex flex-col items-center justify-center gap-2 text-center px-6">
            <span className="text-xs font-medium text-faint">Begrep</span>
            <span className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.02em]">{term}</span>
            <span className="mt-3 text-sm text-muted">Trykk for å snu</span>
          </div>
          <div className="flip-face flip-back absolute inset-0 rounded-2xl bg-foreground text-background flex flex-col justify-center gap-3 px-7 sm:px-10">
            <span className="text-xs font-medium text-background/60">Definisjon</span>
            <p className="font-display text-2xl sm:text-[28px] leading-snug tracking-[-0.01em]">{def}</p>
          </div>
        </div>
      </button>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          ref={(el) => {
            knapper.current.kanIkke = el;
          }}
          type="button"
          onClick={() => velg("kanIkke")}
          aria-disabled={!snudd || undefined}
          aria-pressed={svar === "kanIkke"}
          className={`${knapp} ${
            kanIkke === "lukket"
              ? "opacity-35 cursor-default border-border-strong text-ink-soft"
              : kanIkke === "valgt"
                ? "border-danger bg-danger-tint text-danger-ink"
                : kanIkke === "annen"
                  ? "opacity-50 border-border-strong text-ink-soft hover:opacity-100"
                  : "border-border-strong text-ink-soft hover:border-danger hover:text-danger-ink"
          }`}
        >
          <Close key={kanIkke === "valgt" ? `x${trykk}` : "x"} size={16} className={kanIkke === "valgt" ? "fs-ikon" : ""} />
          Kan ikke ennå
        </button>
        <button
          ref={(el) => {
            knapper.current.kan = el;
          }}
          type="button"
          onClick={() => velg("kan")}
          aria-disabled={!snudd || undefined}
          aria-pressed={svar === "kan"}
          className={`${knapp} ${
            kan === "lukket"
              ? "opacity-35 cursor-default border-success/40 bg-success-tint text-success-ink"
              : kan === "valgt"
                ? "border-success bg-success text-white"
                : kan === "annen"
                  ? "opacity-50 border-success/40 bg-success-tint text-success-ink hover:opacity-100"
                  : "border-success/40 bg-success-tint text-success-ink hover:border-success"
          }`}
        >
          <Check key={kan === "valgt" ? `v${trykk}` : "v"} size={16} className={kan === "valgt" ? "fs-ikon" : ""} />
          Kan dette
        </button>
      </div>

      <p aria-live="polite" className="mt-3 min-h-6 text-sm text-muted">
        <span key={`${snudd}-${svar}-${trykk}`} className={svar ? "rise inline-block" : "inline-block"}>
          {svar ? SVARTEKST[svar] : snudd ? "Kunne du det?" : "Snu kortet først, og svar ærlig."}
        </span>
      </p>
    </div>
  );
}

function Quiz() {
  const { text, options, correct, explain } = EKSEMPEL.sporsmal;
  const [valgt, setValgt] = useState<number | null>(null);
  const svart = valgt !== null;
  return (
    <div>
      <Demohode merke="Prøv selv" />
      <p id="fs-quiz" className="font-display text-2xl sm:text-[28px] font-semibold leading-snug tracking-[-0.01em] mb-5">
        {text}
      </p>
      <div role="group" aria-labelledby="fs-quiz" className="grid sm:grid-cols-2 gap-2">
        {options.map((o, i) => {
          const riktig = i === correct;
          const tilstand = !svart ? "" : riktig ? "riktig" : i === valgt ? "feil" : "dempet";
          return (
            <button
              key={o}
              type="button"
              aria-disabled={svart || undefined}
              onClick={() => !svart && setValgt(i)}
              className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left text-[15px] transition-[background-color,border-color,color,transform] duration-200 ${
                tilstand === "riktig"
                  ? "border-success bg-success-tint text-success-ink font-semibold"
                  : tilstand === "feil"
                    ? "border-danger bg-danger-tint text-danger-ink"
                    : tilstand === "dempet"
                      ? "border-border text-faint"
                      : "border-border-strong bg-background hover:border-foreground active:scale-[0.99]"
              }`}
            >
              {o}
              {tilstand === "riktig" && <Check size={16} />}
              {tilstand === "feil" && <Close size={16} />}
            </button>
          );
        })}
      </div>
      <div aria-live="polite" className="min-h-0">
        {svart && (
          <div className="mt-4 flex flex-col sm:flex-row sm:items-end gap-3 justify-between rise">
            <p className="text-[15px] leading-relaxed text-ink-soft max-w-[52ch]">
              <span className="font-semibold text-foreground">
                {valgt === correct ? "Riktig. " : "Ikke helt. "}
              </span>
              {explain}
            </p>
            <button
              type="button"
              onClick={() => setValgt(null)}
              className="shrink-0 text-sm font-semibold underline decoration-border-strong decoration-2 underline-offset-4 hover:decoration-foreground"
            >
              Prøv igjen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Teller ned mens prøven er i bildet.
function useNedtelling(start: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [igjen, setIgjen] = useState(start);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id: number | undefined;
    const io = new IntersectionObserver(([inn]) => {
      window.clearInterval(id);
      if (inn.isIntersecting) id = window.setInterval(() => setIgjen((s) => (s > 0 ? s - 1 : start)), 1000);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [start]);
  return { ref, tid: `${Math.floor(igjen / 60)}:${String(igjen % 60).padStart(2, "0")}` };
}

function Miniprove() {
  const oppgave = EKSEMPEL.skriveoppgave;
  const { ref, tid } = useNedtelling(EKSEMPEL.minutter * 60 - 7 * 60 - 18);
  return (
    <div ref={ref}>
      <Demohode merke="Eksempel" />
      <div className="flex items-center justify-between text-sm mb-3">
        <span className="font-semibold">Skriveoppgave 1 av 5</span>
        <span className="font-display text-2xl font-semibold tabular-nums tracking-tight" aria-label="Tid igjen">
          {tid}
        </span>
      </div>
      <p className="text-[17px] leading-relaxed text-foreground">{oppgave.text}</p>
      <div className="mt-4 rounded-xl bg-background border border-border px-4 py-3.5">
        <span className="text-xs font-medium text-faint">Eksempel på svar</span>
        <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">
          Det er en protolyse fordi HCl gir fra seg et proton til vannet, så det blir H₃O⁺ og Cl⁻.
        </p>
      </div>
      <div className="mt-3 rounded-xl border border-border px-4 py-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted">Rettet av KI</span>
          <span className="rounded-md bg-merke px-2 py-0.5 text-sm font-semibold text-foreground tabular-nums">½ poeng</span>
        </div>
        <ul className="mt-2.5 flex flex-col gap-2 text-sm">
          <li className="flex gap-2.5 text-success-ink">
            <Check size={16} className="shrink-0 mt-0.5" />
            {oppgave.kriterier[0]}
          </li>
          <li className="flex gap-2.5 text-ink-soft">
            <Close size={16} className="shrink-0 mt-0.5 text-danger" />
            <span>
              {oppgave.kriterier[1]}{" "}
              <span className="text-muted">Du sier ikke at H₂O er basen som tar opp protonet.</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function AiHjelp() {
  const rot = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = rot.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 75%", once: true } });
      tl.from("[data-sporsmal]", { y: 12, autoAlpha: 0, duration: 0.5, ease: "power3.out" })
        .fromTo("[data-skriver]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, "+=0.25")
        .to("[data-skriver]", { autoAlpha: 0, duration: 0.2 }, "+=0.9")
        .from("[data-svar]", { y: 12, autoAlpha: 0, duration: 0.6, ease: "power3.out" }, "<");
    }, el);
    return () => mm.revert();
  }, []);

  return (
    <div ref={rot}>
      <Demohode merke="Eksempel" />
      <div className="relative flex flex-col gap-3">
        <div data-sporsmal className="self-end max-w-[85%] rounded-2xl rounded-br-md bg-foreground text-background px-4 py-3 text-[15px]">
          Hvorfor kan vann være både syre og base?
        </div>
        <div
          data-skriver
          aria-hidden="true"
          className="invisible absolute left-0 top-[64px] flex gap-1 rounded-2xl rounded-bl-md bg-sunken px-4 py-3.5"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-1.5 rounded-full bg-muted animate-pulse"
              style={{ animationDelay: `${i * 160}ms` }}
            />
          ))}
        </div>
        <div data-svar className="self-start max-w-[92%] rounded-2xl rounded-bl-md bg-sunken px-4 py-3 text-[15px] leading-relaxed text-ink-soft">
          Vann er en <strong className="font-semibold text-foreground">amfolytt</strong>. Det kan gi fra seg et
          proton og bli OH⁻, eller ta opp et proton og bli H₃O⁺. Hva det gjør, kommer an på hva det reagerer
          med: Med HCl er vann en base, med NH₃ er det en syre.
        </div>
      </div>
    </div>
  );
}
