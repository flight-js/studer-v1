"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { TELLING } from "@/lib/forsidedata";

gsap.registerPlugin(ScrollTrigger);

// «Øving som faktisk virker» på forsiden: to funn fra forskningen som Studer
// er bygd på, og hvor mye det er å øve på. Bare påstander vi kan dokumentere
// (markedsføringsloven § 3): forskningen står med kilde, og tallene for
// innholdet kommer fra content/ (scripts/lag-forsidedata.mjs). Ingen påstander
// om karakterer – vi har ikke data på det.
//
// Bevegelse (GSAP + ScrollTrigger; Lenis i Bevegelse.tsx er eneste rulling):
//   - stolpene vokser og tallene teller opp når meterlista kommer fram
//   - leselampa leser lesemetodene linje for linje og blir stående over de to
//     som fikk toppkarakter, som lyser opp; etterpå følger den musa
//   - telleverkene ruller fram sifrene
// Uten JavaScript og ved redusert bevegelse står alt i sluttilstanden.

const HUSKET = [
  { navn: "Testet seg selv", verdi: 61, uthevet: true },
  { navn: "Leste teksten på nytt", verdi: 40, uthevet: false },
];

type Nytte = "hoy" | "middels" | "lav";
const NYTTE: Record<Nytte, string> = { hoy: "Høy nytte", middels: "Middels nytte", lav: "Lav nytte" };
// Rekkefølgen gjør at de to vinnerne står ved siden av hverandre både med to
// og fem kolonner (plass 7 og 8), så lampa kan bli stående mellom dem.
const METODER: { navn: string; nytte: Nytte }[] = [
  { navn: "Understreke", nytte: "lav" },
  { navn: "Spørre hvorfor", nytte: "middels" },
  { navn: "Lese på nytt", nytte: "lav" },
  { navn: "Oppsummere", nytte: "lav" },
  { navn: "Blande oppgavetyper", nytte: "middels" },
  { navn: "Huskeord", nytte: "lav" },
  { navn: "Teste seg selv", nytte: "hoy" },
  { navn: "Spre øvingen utover", nytte: "hoy" },
  { navn: "Forklare for seg selv", nytte: "middels" },
  { navn: "Indre bilder", nytte: "lav" },
];

const INNHOLD = [
  { verdi: TELLING.flashcards, navn: "flashcards" },
  { verdi: TELLING.quiz, navn: "quizspørsmål" },
  { verdi: TELLING.skriveoppgaver, navn: "skriveoppgaver" },
  { verdi: TELLING.formler, navn: "formler" },
];

// Tusenskille som i norsk: hardt mellomrom mellom hver tredje siffer (samme
// tegn på serveren og i nettleseren, så ingenting blir ulikt ved hydrering).
const medMellomrom = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const lenke =
  "font-semibold text-background/80 underline decoration-background/30 decoration-2 underline-offset-4 hover:text-background hover:decoration-merke transition-colors duration-200";

export function Forskning() {
  const rot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rot.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // 1. Meterlista: stolpene vokser fra null, tallene teller opp.
      const meter = el.querySelector<HTMLElement>("[data-meter]");
      const stolper = gsap.utils.toArray<HTMLElement>("[data-stolpe]", el);
      const tall = gsap.utils.toArray<HTMLElement>("[data-tall]", el);
      gsap.set(stolper, { scaleX: 0 });
      tall.forEach((t) => (t.textContent = "0 %"));
      ScrollTrigger.create({
        trigger: meter,
        start: "top 80%",
        once: true,
        onEnter: () => {
          stolper.forEach((s, i) => gsap.to(s, { scaleX: 1, duration: 1.3, ease: "power3.out", delay: i * 0.2 }));
          tall.forEach((t, i) => {
            const teller = { v: 0 };
            gsap.to(teller, {
              v: Number(t.dataset.tall),
              duration: 1.3,
              ease: "power3.out",
              delay: i * 0.2,
              onUpdate: () => (t.textContent = `${Math.round(teller.v)} %`),
            });
          });
        },
      });

      // 2. Leselampa over lesemetodene.
      const rutenett = el.querySelector<HTMLElement>("[data-metoder]");
      const lampe = rutenett?.querySelector<HTMLElement>("[data-lampe]");
      const brikker = gsap.utils.toArray<HTMLElement>("[data-metode]", rutenett);
      const vinnere = brikker.filter((b) => b.hasAttribute("data-hoy"));
      let ferdig = false;
      let rydd = () => {};
      if (rutenett && lampe && vinnere.length) {
        const midt = (b: HTMLElement) => ({ x: b.offsetLeft + b.offsetWidth / 2, y: b.offsetTop + b.offsetHeight / 2 });
        const hvile = () => {
          const a = midt(vinnere[0]);
          const b = midt(vinnere[vinnere.length - 1]);
          return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        };
        vinnere.forEach((v) => v.removeAttribute("data-lys"));
        gsap.set(lampe, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
        ScrollTrigger.create({
          trigger: rutenett,
          start: "top 72%",
          once: true,
          // Plasseringene måles først nå, når skrift og bredde har satt seg.
          onEnter: () => {
            gsap.set(lampe, midt(brikker[0]));
            const tl = gsap.timeline({ onComplete: () => (ferdig = true) });
            tl.to(lampe, { autoAlpha: 1, duration: 0.35, ease: "power2.out" });
            brikker.forEach((b) => tl.to(lampe, { ...midt(b), duration: 0.16, ease: "sine.inOut" }));
            tl.to(lampe, { ...hvile(), scale: 1.25, duration: 0.7, ease: "power3.inOut" });
            tl.add(() => vinnere.forEach((v) => v.setAttribute("data-lys", "")), "-=0.3");
          },
        });
        // Etterpå følger lampa musa over rutenettet, og går tilbake når musa går.
        const tilX = gsap.quickTo(lampe, "x", { duration: 0.6, ease: "power3.out" });
        const tilY = gsap.quickTo(lampe, "y", { duration: 0.6, ease: "power3.out" });
        const flytt = (e: PointerEvent) => {
          if (!ferdig || e.pointerType !== "mouse") return;
          const r = rutenett.getBoundingClientRect();
          tilX(e.clientX - r.left);
          tilY(e.clientY - r.top);
        };
        const tilbake = () => {
          if (!ferdig) return;
          const h = hvile();
          tilX(h.x);
          tilY(h.y);
        };
        const ro = new ResizeObserver(() => ferdig && gsap.set(lampe, hvile()));
        rutenett.addEventListener("pointermove", flytt);
        rutenett.addEventListener("pointerleave", tilbake);
        ro.observe(rutenett);
        rydd = () => {
          rutenett.removeEventListener("pointermove", flytt);
          rutenett.removeEventListener("pointerleave", tilbake);
          ro.disconnect();
          vinnere.forEach((v) => v.setAttribute("data-lys", ""));
        };
      }

      // 3. Telleverkene: hvert siffer ruller fra 0 gjennom en hel runde og
      // stopper på sitt tall, fra venstre mot høyre.
      gsap.utils.toArray<HTMLElement>("[data-teller]", el).forEach((teller, n) => {
        const band = gsap.utils.toArray<HTMLElement>("[data-band]", teller);
        gsap.set(band, { y: 0, yPercent: 0 });
        ScrollTrigger.create({
          trigger: teller,
          start: "top 88%",
          once: true,
          onEnter: () =>
            band.forEach((b, i) =>
              gsap.to(b, { yPercent: -Number(b.dataset.mal), duration: 1.8, ease: "power4.out", delay: n * 0.1 + i * 0.07 })
            ),
        });
      });

      return () => {
        rydd();
        tall.forEach((t) => (t.textContent = `${t.dataset.tall} %`));
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={rot} className="flex flex-col gap-20 lg:gap-28">
      <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-x-16 gap-y-20">
        {/* Testeffekten */}
        <figure data-vis-gruppe className="border-t border-natt-linje pt-8 flex flex-col">
          <p data-vis className="text-sm font-medium text-background/60">
            Hvor mye av en tekst studentene husket en uke senere
          </p>
          <p data-vis className="mt-3 font-display text-4xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.02]">
            Over 50&nbsp;% mer igjen med å teste seg selv.
          </p>
          <ul data-meter className="mt-10 flex flex-col gap-7">
            {HUSKET.map((r) => (
              <li key={r.navn} className="flex flex-col gap-3">
                <span className="flex items-baseline justify-between gap-4">
                  <span className={`text-base font-semibold ${r.uthevet ? "text-background" : "text-background/70"}`}>{r.navn}</span>
                  <span className="font-display text-3xl font-semibold tabular-nums">
                    <span data-tall={r.verdi} aria-hidden="true">
                      {r.verdi}&nbsp;%
                    </span>
                    <span className="sr-only">{r.verdi} prosent</span>
                  </span>
                </span>
                <span aria-hidden="true" className="h-2 rounded-full bg-background/10 overflow-hidden">
                  <span
                    data-stolpe
                    className={`block h-full rounded-full origin-left ${r.uthevet ? "bg-merke" : "bg-background/45"}`}
                    style={{ width: `${r.verdi}%` }}
                  />
                </span>
              </li>
            ))}
          </ul>
          <figcaption data-vis className="mt-8 text-sm leading-relaxed text-background/55 max-w-[52ch]">
            Roediger og Karpicke (2006). Studentene leste en tekst og øvde så enten ved å teste seg selv eller ved å lese
            teksten på nytt.{" "}
            <a
              href="https://source.washu.edu/2006/03/repeated-testtaking-better-for-retention-than-repeated-studying-research-shows/"
              target="_blank"
              rel="noopener noreferrer"
              className={lenke}
            >
              Les om studien
            </a>
          </figcaption>
        </figure>

        {/* Ti lesemetoder */}
        <figure data-vis-gruppe className="border-t border-natt-linje pt-8 flex flex-col">
          <p data-vis className="text-sm font-medium text-background/60">
            Ti vanlige lesemetoder, vurdert av forskere
          </p>
          <p data-vis className="mt-3 font-display text-4xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.02]">
            Bare 2 av 10 fikk toppkarakter.
          </p>
          <div data-metoder className="relative isolate mt-10">
            <span data-lampe aria-hidden="true" className="metode-lampe" />
            <ul className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {METODER.map((m) => (
                <li
                  key={m.navn}
                  data-metode
                  data-hoy={m.nytte === "hoy" ? "" : undefined}
                  data-lys={m.nytte === "hoy" ? "" : undefined}
                  className="metode"
                >
                  <span className="metode-navn">{m.navn}</span>
                  <span className="metode-nytte">{NYTTE[m.nytte]}</span>
                </li>
              ))}
            </ul>
          </div>
          <figcaption data-vis className="mt-8 text-sm leading-relaxed text-background/55 max-w-[60ch]">
            Dunlosky mfl. (2013) gikk gjennom forskningen på ti populære lesemetoder. Bare å teste seg selv og å spre
            øvingen utover fikk høy nytte – understreking og å lese på nytt fikk lav.{" "}
            <a
              href="https://www.psychologicalscience.org/news/releases/which-study-strategies-make-the-grade.html"
              target="_blank"
              rel="noopener noreferrer"
              className={lenke}
            >
              Les om gjennomgangen
            </a>
          </figcaption>
        </figure>
      </div>

      {/* Innholdet i tall */}
      <div data-vis-gruppe className="border-t border-natt-linje pt-8 flex flex-col gap-8">
        <p data-vis className="text-lg leading-relaxed text-background/70 max-w-[46ch]">
          Og nok å øve på. Alt er laget etter læreplanen, i {TELLING.fag} fag.
        </p>
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {INNHOLD.map((t) => (
            <div key={t.navn} data-teller className="flex flex-col-reverse gap-2">
              <dt className="text-base text-background/65">{t.navn}</dt>
              <dd className="font-display text-[40px] sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-none">
                <span className="sr-only">{medMellomrom(t.verdi)}</span>
                <span aria-hidden="true" className="teller">
                  {[...medMellomrom(t.verdi)].map((tegn, i) =>
                    /\d/.test(tegn) ? (
                      <span key={i} className="teller-kolonne">
                        <span
                          data-band
                          data-mal={(10 + Number(tegn)) * 5}
                          className="teller-band"
                          style={{ transform: `translateY(-${(10 + Number(tegn)) * 5}%)` }}
                        >
                          {"01234567890123456789".split("").map((s, j) => (
                            <span key={j}>{s}</span>
                          ))}
                        </span>
                      </span>
                    ) : (
                      <span key={i} className="teller-skille">
                        {tegn}
                      </span>
                    )
                  )}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
