"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { Navnemerker } from "@/components/konkurranse/Navnemerke";
import { Check, Flamme, Gave, Kalender, Lock, Stjerne } from "@/components/icons";
import { konfetti } from "@/lib/feiring";

gsap.registerPlugin(ScrollTrigger);

// «Øv deg til premier» på forsiden: premiene i Studer og hvordan de ser ut.
// Bare Studers egne premier med prisene fra tabellen belonninger (sjekket i
// produksjon 20.11.2026) – ingen eksklusive ting og ingen partnere.
//
// Bevegelse: en poengteller klatrer fra 0 til 1 500 mens man ruller gjennom
// hylla (ScrollTrigger med scrub; Lenis i Bevegelse.tsx er eneste rulling), og
// hvert kort låses opp når telleren passerer prisen. Forhåndsvisningene skifter
// (flammefarge, merke, tema) bare mens hylla er på skjermen. Uten JavaScript og
// ved redusert bevegelse er alt låst opp og står stille på første variant.
// Konfettiknappen virker alltid.

type Scene = "flamme" | "merke" | "konfetti" | "tema" | "venn" | "uke";
const PREMIER: { scene: Scene; tittel: string; pris: number; fra?: boolean; tekst: string }[] = [
  { scene: "flamme", tittel: "Flammefarger", pris: 200, fra: true, tekst: "Dagene på rad brenner blått, grønt eller i regnbuens farger." },
  { scene: "merke", tittel: "Merke ved navnet", pris: 250, tekst: "Vises ved navnet ditt på rangeringene. Du kan ha opptil tre." },
  { scene: "konfetti", tittel: "Konfetti", pris: 300, tekst: "Stjerner eller fjærpenner i stedet for papirlapper når du får til noe." },
  { scene: "tema", tittel: "Temaer", pris: 500, fra: true, tekst: "Hele Studer i nye farger – Nordlys, Solnedgang, Havdyp, Skog eller Galakse." },
  { scene: "venn", tittel: "Gi en venn en uke", pris: 800, tekst: "Vennen får en uke gratis, uten å legge inn kort." },
  { scene: "uke", tittel: "En gratis uke", pris: 1500, tekst: "Abonnementet ditt varer en uke lenger." },
];
const MAKS = PREMIER[PREMIER.length - 1].pris;

const FLAMMER = ["text-primary", "text-success", "flamme-regnbue text-danger"];
const MERKER = ["merke-fjaer", "merke-lyspare", "merke-stjerne"];
const TEMAER = [
  { id: "nordlys", navn: "Nordlys" },
  { id: "solnedgang", navn: "Solnedgang" },
  { id: "havdyp", navn: "Havdyp" },
  { id: "skog", navn: "Skog" },
  { id: "galakse", navn: "Galakse" },
];

const tall = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export function Premier() {
  const rot = useRef<HTMLDivElement>(null);
  const saldo = useRef<HTMLSpanElement>(null);
  // Hvor mange kort som er låst opp (i prisrekkefølge). Alle som standard, så
  // siden er hel uten JavaScript og ved redusert bevegelse.
  const [apne, setApne] = useState(PREMIER.length);
  const [steg, setSteg] = useState(0);

  useEffect(() => {
    const el = rot.current;
    const hylle = el?.querySelector<HTMLElement>("[data-premiehylle]");
    if (!el || !hylle) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // 1. Poengtelleren følger rullingen og låser opp kortene.
      const teller = { v: 0 };
      let sist = -1;
      const vis = () => {
        const v = Math.round(teller.v);
        if (saldo.current) saldo.current.textContent = tall(v);
        const n = PREMIER.filter((p) => p.pris <= v).length;
        if (n !== sist) {
          sist = n;
          setApne(n);
        }
      };
      vis();
      gsap.to(teller, {
        v: MAKS,
        ease: "none",
        onUpdate: vis,
        scrollTrigger: { trigger: hylle, start: "top 78%", end: "bottom 70%", scrub: 0.6 },
      });

      // 2. Forhåndsvisningene skifter bare mens hylla er på skjermen.
      let tikk: number | undefined;
      const io = new IntersectionObserver(([inn]) => {
        window.clearInterval(tikk);
        tikk = inn.isIntersecting ? window.setInterval(() => setSteg((s) => s + 1), 1800) : undefined;
      });
      io.observe(hylle);

      return () => {
        io.disconnect();
        window.clearInterval(tikk);
        if (saldo.current) saldo.current.textContent = tall(MAKS);
        setApne(PREMIER.length);
        setSteg(0);
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={rot} className="flex flex-col gap-10">
      {/* Saldoen står fast øverst mens man ruller gjennom hylla (fra lg; på mobil
          ville den dekket kortene, som har én kolonne). */}
      <div aria-hidden="true" className="lg:sticky lg:top-20 z-10 self-start">
        <span className="inline-flex items-center gap-2.5 rounded-full border border-natt-linje bg-natt-hevet/95 pl-2 pr-4 py-1.5 shadow-[0_12px_32px_-16px_rgba(0,0,0,0.8)]">
          <span className="size-8 rounded-full bg-merke text-pa-merke inline-flex items-center justify-center">
            <Stjerne size={16} fylt />
          </span>
          <span className="font-display text-2xl font-semibold tabular-nums tracking-[-0.02em]">
            <span ref={saldo}>{tall(MAKS)}</span>
          </span>
          <span className="text-sm text-background/60">poeng</span>
        </span>
      </div>

      <ul data-premiehylle data-vis-gruppe className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        {PREMIER.map((p, i) => {
          const apen = i < apne;
          return (
            <li key={p.scene} data-vis data-apen={apen ? "" : undefined} className="premie">
              <div className="premie-scene">
                <Scenevisning scene={p.scene} steg={steg} />
              </div>
              <div className="flex flex-col gap-2 px-1 pb-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold leading-tight">{p.tittel}</h3>
                  <span className="premie-pris">
                    {apen ? <Check size={13} aria-hidden="true" /> : <Lock size={13} aria-hidden="true" />}
                    {p.fra ? "fra " : ""}
                    {tall(p.pris)} poeng
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-background/65">{p.tekst}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <p data-vis-gruppe className="text-base text-background/65 max-w-[60ch]">
        <span data-vis className="block">
          Noen merker kan ikke kjøpes, bare øves fram – som en måned på rad eller 1000 flashcards. De vises i blått ved
          navnet.
        </span>
      </p>
    </div>
  );
}

function Scenevisning({ scene, steg }: { scene: Scene; steg: number }) {
  const knapp = useRef<HTMLButtonElement>(null);
  switch (scene) {
    case "flamme":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-merke pl-2.5 pr-4 py-1.5 text-base font-bold text-pa-merke tabular-nums">
          <Flamme size={22} fylt className={`transition-colors duration-500 ${FLAMMER[steg % FLAMMER.length]}`} />
          12 på rad
        </span>
      );
    case "merke":
      return (
        <span className="inline-flex items-center gap-2 rounded-xl bg-background/[0.07] border border-natt-linje px-4 py-3 text-base">
          <span className="inline-flex items-center font-semibold">
            Navnet ditt
            <span key={steg} className="ikon-pop inline-flex">
              <Navnemerker merker={[MERKER[steg % MERKER.length]]} />
            </span>
          </span>
          <span className="text-background/45">·</span>
          <span className="text-background/60">Skolen din</span>
        </span>
      );
    case "konfetti":
      return (
        <button
          ref={knapp}
          type="button"
          onClick={() => konfetti(knapp.current, "liten", steg % 2 ? "konfetti-fjaer" : "konfetti-stjerner")}
          className="trykk rounded-xl bg-background text-foreground px-5 py-3 text-sm font-semibold hover:bg-merke hover:text-pa-merke"
        >
          Trykk for konfetti
        </button>
      );
    case "tema":
      return (
        <span aria-hidden="true" className="relative block w-[min(100%,15rem)] aspect-[4/3]">
          {TEMAER.map((t, i) => (
            <span
              key={t.id}
              data-premium={t.id}
              className={`premium-flate absolute inset-0 flex flex-col overflow-hidden rounded-xl border border-border bg-background text-foreground transition-opacity duration-700 ${
                i === steg % TEMAER.length ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="bg-natt premium-natt px-3 pt-3 pb-3.5 flex flex-col gap-1.5">
                <span className="text-[10px] font-medium opacity-65">{t.navn}</span>
                <span className="font-display text-base font-semibold leading-none">Hei!</span>
              </span>
              <span className="flex-1 p-2.5 flex flex-col gap-2">
                <span className="rounded-lg bg-surface border border-border px-2.5 py-2 flex items-center justify-between gap-2">
                  <span className="h-1.5 w-16 rounded-full bg-foreground/60" />
                  <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-semibold text-white">Øv</span>
                </span>
                <span className="h-1 rounded-full bg-sunken overflow-hidden">
                  <span className="block h-full w-2/3 rounded-full bg-primary" />
                </span>
              </span>
            </span>
          ))}
        </span>
      );
    case "venn":
      return (
        <span className="premie-billett">
          <Gave size={26} />
          <span className="flex flex-col">
            <span className="font-display text-2xl font-semibold leading-none">1 uke</span>
            <span className="text-xs opacity-70">til en venn</span>
          </span>
        </span>
      );
    case "uke":
      return (
        <span className="premie-billett">
          <Kalender size={26} />
          <span className="flex flex-col">
            <span className="font-display text-2xl font-semibold leading-none">+7 dager</span>
            <span className="text-xs opacity-70">neste betaling en uke senere</span>
          </span>
        </span>
      );
  }
}
