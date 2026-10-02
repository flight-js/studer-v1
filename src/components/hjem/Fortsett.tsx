"use client";

import { gsap } from "gsap";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "@/components/icons";
import { prosentGjennomgatt, sistOvd, temaHref, type Aktivitet, type SistOvdTema } from "@/lib/pensum";

// «Fortsett der du slapp» på startsiden for innloggede: temaene man øvde på
// sist, som linjer på en mørk pult. Lampa står på det nyeste og glir til det
// man holder musa over eller tabber til – samme leselampe som på forsiden.
// Alle radene er like høye, så ingenting hopper når lyset flytter seg.

const FORMER: { id: Aktivitet; navn: string }[] = [
  { id: "flashcards", navn: "Flashcards" },
  { id: "quiz", navn: "Quiz" },
  { id: "miniprove", navn: "Miniprøve" },
];

const tall = (n: number) => n.toLocaleString("nb-NO", { maximumFractionDigits: 1 });

export function Fortsett({ temaer }: { temaer: SistOvdTema[] }) {
  const rot = useRef<HTMLDivElement>(null);
  const glod = useRef<HTMLDivElement>(null);
  const [aktiv, setAktiv] = useState(0);
  const flytt = useRef<(i: number) => void>(() => {});

  useEffect(() => {
    const el = rot.current;
    const lys = glod.current;
    if (!el || !lys) return;
    const rolig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rader = () => Array.from(el.querySelectorAll<HTMLElement>("[data-rad]"));
    const tilY = gsap.quickTo(lys, "y", { duration: rolig ? 0 : 0.6, ease: "power3.out" });
    const tilX = gsap.quickTo(lys, "x", { duration: rolig ? 0 : 0.9, ease: "power3.out" });
    let pekerX = el.clientWidth * 0.3;
    let valgt = 0;

    const plasser = (i: number, straks = false) => {
      valgt = i;
      const rad = rader()[i];
      if (!rad) return;
      const y = rad.offsetTop + rad.offsetHeight / 2 - lys.offsetHeight / 2;
      const x = pekerX - lys.offsetWidth / 2;
      if (straks) gsap.set(lys, { x, y });
      else {
        tilY(y);
        tilX(x);
      }
    };
    flytt.current = (i) => plasser(i);

    // Lampa følger musa sidelengs, men holder seg på raden som er valgt.
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pekerX = e.clientX - el.getBoundingClientRect().left;
      tilX(pekerX - lys.offsetWidth / 2);
    };
    el.addEventListener("pointermove", onMove);

    const ro = new ResizeObserver(() => {
      pekerX = Math.min(pekerX, el.clientWidth);
      plasser(valgt, true);
    });
    ro.observe(el);
    plasser(0, true);

    // Intro: radene legger seg på pulten, og lampa skrus på.
    const ctx = gsap.context(() => {
      if (rolig) return;
      gsap.from("[data-rad]", { y: 18, autoAlpha: 0, duration: 0.6, ease: "power3.out", stagger: 0.07 });
      gsap.fromTo(
        lys,
        { opacity: 0 },
        {
          keyframes: [
            { opacity: 0.7, duration: 0.08 },
            { opacity: 0.15, duration: 0.1 },
            { opacity: 1, duration: 0.5, ease: "power2.out" },
          ],
          delay: 0.25,
        },
      );
    }, el);

    return () => {
      ctx.revert();
      ro.disconnect();
      el.removeEventListener("pointermove", onMove);
      gsap.killTweensOf(lys);
    };
  }, [temaer.length]);

  const velg = (i: number) => {
    setAktiv(i);
    flytt.current(i);
  };

  return (
    <div ref={rot} className="relative isolate">
      <div
        ref={glod}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 -z-10 h-[280px] w-[min(760px,100%)] rounded-full bg-[radial-gradient(closest-side,rgba(255,217,140,0.17),rgba(255,217,140,0.05)_60%,transparent)]"
      />
      <ol className="border-t border-natt-linje">
        {temaer.map((t, i) => {
          const pst = prosentGjennomgatt(t.fremdrift);
          const erAktiv = i === aktiv;
          const sist = sistOvd(t.fremdrift);
          return (
            <li key={t.id} data-rad className="border-b border-natt-linje">
              <Link
                href={temaHref("/tema", t.id)}
                onPointerEnter={(e) => e.pointerType !== "touch" && velg(i)}
                onFocus={() => velg(i)}
                aria-label={`Fortsett med ${t.navn}, ${t.fagNavn} på ${t.trinnNavn}. ${pst} prosent gjennomgått.`}
                className="group grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-3 py-6 sm:py-7 rounded-lg"
              >
                <span className="flex flex-col gap-2 min-w-0">
                  <span
                    className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
                      erAktiv ? "text-background/75" : "text-background/55"
                    }`}
                  >
                    {t.trinnNavn} · {t.fagNavn}
                  </span>
                  <span
                    lang="nb"
                    className={`font-display font-semibold text-[26px] leading-[1.08] sm:text-4xl lg:text-5xl tracking-[-0.025em] hyphens-auto transition-colors duration-300 ${
                      erAktiv ? "text-background" : "text-background/60"
                    }`}
                  >
                    {t.navn}
                  </span>
                  <span
                    className={`flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm tabular-nums transition-colors duration-300 ${
                      erAktiv ? "text-background/75" : "text-background/55"
                    }`}
                  >
                    {FORMER.map((f) => {
                      const r = t.fremdrift[f.id];
                      return (
                        <span key={f.id}>
                          {f.navn} {r ? `${tall(r.beste)}/${tall(r.av)}` : "–"}
                        </span>
                      );
                    })}
                    {sist && <span className="hidden sm:inline">{sist}</span>}
                  </span>
                </span>

                <span className="flex flex-col items-end justify-between gap-2">
                  <span
                    className={`font-display font-semibold text-2xl sm:text-4xl tabular-nums tracking-[-0.02em] transition-colors duration-300 ${
                      erAktiv ? "text-merke" : "text-background/60"
                    }`}
                  >
                    {pst} %
                  </span>
                  <span
                    aria-hidden="true"
                    className={`inline-flex items-center gap-1.5 text-sm font-semibold text-merke transition-opacity duration-300 ${
                      erAktiv ? "opacity-100" : "opacity-0 group-focus-visible:opacity-100"
                    }`}
                  >
                    <span className="hidden sm:inline">Fortsett</span>
                    <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </span>

                <span aria-hidden="true" className="col-span-2 h-[3px] rounded-full bg-background/12 overflow-hidden">
                  <span
                    className={`block h-full rounded-full transition-colors duration-300 ${
                      erAktiv ? "bg-merke" : "bg-background/40"
                    }`}
                    style={{ width: `${pst}%` }}
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
