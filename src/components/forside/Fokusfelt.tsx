"use client";

import { gsap } from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Repeat } from "@/components/icons";
import { BEGREPER } from "@/lib/forsidedata";

// Heroen på forsiden: en mørk pult full av ekte begreper fra flashcardene, og
// en leselampe som gjør dem lesbare. Lampa følger musa; uten mus (eller når
// musa er borte) leter den rundt på egen hånd og lyser bare opp. Ord velges
// først når noen styrer lampa selv: begrepet nærmest midten av lyset blir gult
// med en gang, og definisjonen kommer når lyset har hvilt litt på ordet, eller
// med en gang ved klikk. Ingenting er valgt når siden åpnes.
//
// Lyset er to lag med samme tekst: et uskarpt, svakt lag over hele flaten, og
// et skarpt lag inne i lampa. Lampa flyttes med transform og det skarpe laget
// flyttes like mye motsatt vei, så teksten står stille og bare lyset beveger
// seg – uten at noe tegnes på nytt. Feltet er pynt (aria-hidden); knappen
// «Bytt begrep» gjør det samme for tastatur og berøring.

const BEGREPENE = BEGREPER.slice(0, 120);
const FREMMEDE = new Set(["Engelsk", "Engelsk fordypning", "Tysk", "Fransk", "Spansk", "Kinesisk"]);
const START = Math.max(
  0,
  BEGREPENE.findIndex((b) => b.term === "Folkesuverenitet"),
);

// lysbar: lampa kan stå her (synlig, og ikke over teksten). ok: i tillegg er
// det plass til definisjonen. Når lampa går av seg selv, viser den ingen
// definisjon, så da holder det at ordet er lysbart – ellers fikk den nesten
// ingen steder å gå på mobil, der det er lite plass over overskriften.
type Punkt = { x: number; y: number; venstre: number; topp: number; bunn: number; lysbar: boolean; ok: boolean };
type Boks = { l: number; t: number; r: number; b: number };

// Øverste kant lampa og notatet kan bruke: under toppmenyen, og på smale
// skjermer også under «Bytt begrep»-knappen.
const ovreKant = (bredde: number) => (bredde < 1024 ? 128 : 72);
const NOTAT_H = 150; // anslått høyde på notatet før det er målt
// Hvor lenge lyset må hvile på et ord før definisjonen vises (sekunder):
// med mus regnes det fra siste musebevegelse, ellers fra lyset stoppet.
const VENT_PEKER = 0.8;
const VENT_AUTO = 0.35;
const overlapper = (a: Boks, b: Boks) => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;
type Styring = "auto" | "peker" | "knapp";

export function Fokusfelt() {
  const rot = useRef<HTMLDivElement>(null);
  const [aktiv, setAktiv] = useState(START);

  // Samme tekst i begge lag. Fremmedspråk står i kursiv, som i trykt tekst.
  const ord = useMemo(
    () =>
      BEGREPENE.map((b, i) => (
        <span key={i} data-i={i} className={FREMMEDE.has(b.fag) ? "fremmed" : undefined}>
          {b.term}
        </span>
      )),
    [],
  );

  useEffect(() => {
    const el = rot.current;
    const felt = el?.querySelector<HTMLElement>(".ff-felt");
    const lampe = el?.querySelector<HTMLElement>(".ff-lampe");
    const notat = el?.querySelector<HTMLElement>(".ff-notat");
    const notatKort = el?.querySelector<HTMLElement>(".ff-notat-kort");
    const seksjon = el?.closest("section");
    if (!el || !felt || !lampe || !notat || !notatKort || !seksjon) return;

    const roligMedium = window.matchMedia("(prefers-reduced-motion: reduce)");
    const rolig = () => roligMedium.matches;
    const dimOrd = Array.from(el.querySelectorAll<HTMLElement>(".ff-dim [data-i]"));
    const skarpeOrd = Array.from(el.querySelectorAll<HTMLElement>(".ff-skarp [data-i]"));

    let punkter: Punkt[] = [];
    let radius = 150;
    let bredde = 0;
    let hoyde = 0;
    const lys = { x: 0, y: 0 };
    const maal = { x: 0, y: 0 };
    let styring: Styring = "auto";
    let aktivIndeks = -1;
    let kandidat = -1;
    let kandidatSiden = 0;
    let tikker = false;
    let synlig = true;
    let auto: gsap.core.Tween | null = null;
    let tilbake: gsap.core.Tween | null = null;
    let unnta: Boks[] = [];
    let vist = START; // begrepet notatet viser nå (React-tilstanden)
    let notatVist = -1; // begrepet notatet er synlig for, eller -1
    let aktivSiden = 0;
    let sistBevegelse = 0;
    let klikketVed = -Infinity; // et klikk gjelder bare et øyeblikk
    let overTekst = false;
    let levende = true;

    // Linjene i overskriften, ingressen og knappene, målt som tekst og ikke
    // som blokker, så lampa kan lyse helt inntil dem.
    const malUnnta = (r: DOMRect) => {
      const blokk = seksjon.querySelector<HTMLElement>("[data-fokus-unnta]");
      if (!blokk) return [];
      const kant = 18;
      return Array.from(blokk.children).flatMap((barn) => {
        const omraade = document.createRange();
        omraade.selectNodeContents(barn);
        return Array.from(omraade.getClientRects()).map((b) => ({
          l: b.left - r.left - kant,
          t: b.top - r.top - kant,
          r: b.right - r.left + kant,
          b: b.bottom - r.top + kant,
        }));
      });
    };

    // Hvor notatet havner for et begrep: under det hvis det er plass, ellers
    // over. null hvis det ikke får plass uten å dekke menyen eller teksten.
    const notatBoks = (p: Omit<Punkt, "ok" | "lysbar">, w: number, h: number): Boks | null => {
      const l = Math.min(Math.max(p.venstre, 16), bredde - w - 16);
      for (const t of [p.bunn + 12, p.topp - h - 12]) {
        const boks = { l, t, r: l + w, b: t + h };
        if (t < ovreKant(bredde) || boks.b > hoyde - 16) continue;
        if (unnta.some((u) => overlapper(u, boks))) continue;
        return boks;
      }
      return null;
    };

    // Mål opp hvor hvert begrep står, og hvilke lampa kan stoppe ved: fritt
    // for teksten, og med plass til notatet.
    const mal = () => {
      const r = felt.getBoundingClientRect();
      bredde = r.width;
      hoyde = r.height;
      radius = lampe.offsetWidth / 2;
      unnta = malUnnta(r);
      // På smale skjermer står ordene over teksten. Masken i globals.css
      // toner dem ut fra der teksten begynner, som avhenger av skjermhøyden.
      const grense = unnta.length ? Math.min(...unnta.map((u) => u.t)) : hoyde * 0.4;
      felt.style.setProperty("--ff-grense", `${Math.round(grense)}px`);
      const notatW = notat.offsetWidth || 300;
      punkter = dimOrd.map((o) => {
        const b = o.getBoundingClientRect();
        const p = {
          x: b.left - r.left + b.width / 2,
          y: b.top - r.top + b.height / 2,
          venstre: b.left - r.left,
          topp: b.top - r.top,
          bunn: b.bottom - r.top,
        };
        const ord = { l: p.venstre, t: p.topp, r: b.right - r.left, b: p.bunn };
        // Samme fade som masken i globals.css (.ff-felt): ikke stopp ved ord
        // som nesten er borte.
        const synlig =
          bredde < 1024
            ? p.bunn < grense
            : (p.x / bredde / 0.62) ** 2 + ((hoyde - p.y) / hoyde / 0.64) ** 2 > 0.75;
        const lysbar =
          synlig &&
          p.topp > ovreKant(bredde) &&
          p.x > radius * 0.45 &&
          p.x < bredde - radius * 0.45 &&
          !unnta.some((u) => overlapper(u, ord));
        const ok = lysbar && notatBoks(p, notatW, NOTAT_H) !== null;
        return { ...p, lysbar, ok };
      });
    };

    const skrivLys = () => {
      lampe.style.setProperty("--lx", `${lys.x.toFixed(1)}px`);
      lampe.style.setProperty("--ly", `${lys.y.toFixed(1)}px`);
    };

    // Notatet plasseres av oss; GSAP animerer bare kortet inni.
    const plasserNotat = (i: number) => {
      const p = punkter[i];
      const boks = notatBoks(p, notat.offsetWidth, notat.offsetHeight) ?? {
        l: Math.min(Math.max(p.venstre, 16), bredde - notat.offsetWidth - 16),
        t: p.bunn + 12,
      };
      notat.style.transform = `translate3d(${Math.round(boks.l)}px, ${Math.round(boks.t)}px, 0)`;
    };

    const skjulNotat = () => {
      if (notatVist < 0) return;
      notatVist = -1;
      gsap.to(notatKort, { autoAlpha: 0, y: 0, duration: rolig() ? 0 : 0.2, overwrite: true });
    };

    // Hånd-peker når et markert ord kan klikkes fram – ikke over teksten.
    const oppdaterPeker = () => {
      const klikkbar = styring === "peker" && !overTekst && aktivIndeks >= 0 && notatVist !== aktivIndeks;
      seksjon.style.cursor = klikkbar ? "pointer" : "";
    };

    const visNotat = (i: number) => {
      notatVist = i;
      klikketVed = -Infinity;
      // Bytt tekst med en gang, så notatet måles med riktig høyde.
      if (i !== vist) {
        vist = i;
        flushSync(() => setAktiv(i));
      }
      plasserNotat(i);
      gsap.fromTo(
        notatKort,
        { autoAlpha: 0, y: rolig() ? 0 : 6 },
        { autoAlpha: 1, y: 0, duration: rolig() ? 0 : 0.4, ease: "power3.out", overwrite: true },
      );
      oppdaterPeker();
    };

    // Markér begrepet under lyset. Notatet for et annet begrep forsvinner.
    const aktiver = (i: number) => {
      if (i === aktivIndeks) return;
      if (aktivIndeks >= 0) skarpeOrd[aktivIndeks]?.removeAttribute("data-aktiv");
      aktivIndeks = i;
      aktivSiden = gsap.ticker.time;
      if (notatVist !== i) skjulNotat();
      if (i >= 0) skarpeOrd[i]?.setAttribute("data-aktiv", "");
      oppdaterPeker();
    };

    const naermeste = () => {
      let best = -1;
      let bestAvstand = (radius * 0.62) ** 2;
      for (let i = 0; i < punkter.length; i++) {
        const p = punkter[i];
        if (!p.ok) continue;
        const d = (p.x - lys.x) ** 2 + (p.y - lys.y) ** 2;
        if (d < bestAvstand) {
          bestAvstand = d;
          best = i;
        }
      }
      return best;
    };

    const tikk = (tid: number, deltaMs: number) => {
      const dt = Math.min(deltaMs, 50) / 1000;
      const fart = styring === "peker" ? 9 : styring === "knapp" ? 4.5 : 2.1;
      const k = rolig() ? 1 : 1 - Math.exp(-dt * fart);
      const dx = maal.x - lys.x;
      const dy = maal.y - lys.y;
      if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
        lys.x += dx * k;
        lys.y += dy * k;
        skrivLys();
      }
      // Når lampa går for seg selv, lyser den bare – ingen ord er valgt.
      if (styring === "auto") {
        if (aktivIndeks >= 0) aktiver(-1);
        kandidat = -1;
        return;
      }
      // Bytt begrep først når lyset har roet seg litt, så det gule ikke
      // blinker forbi hvert ord lampa passerer.
      const n = naermeste();
      if (n !== kandidat) {
        kandidat = n;
        kandidatSiden = tid;
      } else if (n !== aktivIndeks && tid - kandidatSiden > (rolig() ? 0 : 0.14)) {
        aktiver(n);
      }
      // Definisjonen kommer når lyset har hvilt en stund på ordet, eller
      // med en gang ved museklikk.
      if (aktivIndeks >= 0 && notatVist !== aktivIndeks) {
        const fremme = Math.abs(maal.x - lys.x) < 10 && Math.abs(maal.y - lys.y) < 10;
        const hvilt =
          fremme &&
          (styring === "peker"
            ? tid - Math.max(aktivSiden, sistBevegelse) > VENT_PEKER
            : tid - aktivSiden > VENT_AUTO);
        if (tid - klikketVed < 0.8 || hvilt) visNotat(aktivIndeks);
      }
    };

    const startTikk = () => {
      if (tikker || !synlig) return;
      tikker = true;
      gsap.ticker.add(tikk);
    };
    const stoppTikk = () => {
      tikker = false;
      gsap.ticker.remove(tikk);
    };

    // Steder lampa kan gå til. Med definisjon må det være plass til notatet;
    // finnes ingen slike (svært lave skjermer), holder det at ordet er lysbart.
    const ledige = (medNotat: boolean) => {
      const alle = (krav: "ok" | "lysbar") => punkter.flatMap((p, i) => (p[krav] && i !== aktivIndeks ? [i] : []));
      const valg = medNotat ? alle("ok") : [];
      return valg.length ? valg : alle("lysbar");
    };
    const flyttTil = (i: number) => {
      maal.x = punkter[i].x;
      maal.y = punkter[i].y;
      startTikk();
    };
    // Helst et sted et stykke unna, så det synes at lampa flytter seg.
    const tilfeldig = (medNotat = true) => {
      const valg = ledige(medNotat);
      const langt = valg.filter((i) => Math.hypot(punkter[i].x - maal.x, punkter[i].y - maal.y) > radius);
      const fra = langt.length ? langt : valg;
      if (fra.length) flyttTil(fra[Math.floor(Math.random() * fra.length)]);
    };

    const stoppAuto = () => {
      auto?.kill();
      auto = null;
    };
    // Lampa bruker vel et sekund på å flytte seg, så med 2,6 sekunder mellom
    // hvert sted hviler den omtrent et sekund før den går videre.
    const startAuto = (forsinkelse = 2) => {
      stoppAuto();
      if (rolig() || !synlig) return;
      styring = "auto";
      auto = gsap.delayedCall(forsinkelse, function neste() {
        tilfeldig(false);
        auto = gsap.delayedCall(2.6, neste);
      });
    };
    const autoOm = (sekunder: number) => {
      tilbake?.kill();
      tilbake = gsap.delayedCall(sekunder, () => startAuto(0.4));
    };

    // Plasser lampa på startbegrepet før den skrus på.
    const plasserStart = () => {
      // Startbegrepet hvis det ligger fritt, ellers det som ligger nærmest
      // øvre høyre del av pulten.
      let start = punkter[START]?.lysbar ? START : -1;
      if (start < 0) {
        let best = Infinity;
        punkter.forEach((p, i) => {
          const d = (p.x - bredde * 0.68) ** 2 + (p.y - hoyde * 0.3) ** 2;
          if (p.lysbar && d < best) {
            best = d;
            start = i;
          }
        });
      }
      if (start < 0) return;
      lys.x = maal.x = punkter[start].x;
      lys.y = maal.y = punkter[start].y;
      skrivLys();
      startTikk();
    };

    mal();
    plasserStart();

    // Intro: pulten kommer fram, og lampa skrus på med et lite blaff.
    const intro = gsap.timeline({ paused: rolig() });
    if (!rolig()) {
      intro
        .fromTo(felt.querySelector(".ff-dim"), { opacity: 0 }, { opacity: 1, duration: 1.4, ease: "power2.out" }, 0)
        .fromTo(
          lampe,
          { opacity: 0 },
          {
            keyframes: [
              { opacity: 0.75, duration: 0.08 },
              { opacity: 0.15, duration: 0.1 },
              { opacity: 1, duration: 0.5, ease: "power2.out" },
            ],
          },
          0.45,
        );
      intro.play();
    }
    // Introen har satt startverdiene selv; nå kan CSS-skjulingen fjernes.
    document.documentElement.classList.remove("fs-intro");
    startAuto(2.6);

    // Mus og penn: lampa følger pekeren.
    const tilFelt = (e: PointerEvent) => {
      const r = felt.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const p = tilFelt(e);
      maal.x = Math.min(Math.max(p.x, 0), bredde);
      maal.y = Math.min(Math.max(p.y, 0), hoyde);
      sistBevegelse = gsap.ticker.time;
      overTekst = !!(e.target as HTMLElement).closest("a, button, [data-fokus-unnta]");
      if (styring !== "peker") {
        styring = "peker";
        stoppAuto();
        tilbake?.kill();
      }
      oppdaterPeker();
      startTikk();
    };
    const onLeave = () => {
      if (styring === "peker") autoOm(1.2);
      seksjon.style.cursor = "";
    };
    // Klikk med mus viser definisjonen med en gang. Berøring flytter lyset
    // dit man trykket, og viser definisjonen når det er fremme.
    const onDown = (e: PointerEvent) => {
      const trykket = e.target as HTMLElement;
      if (trykket.closest("a, button, [data-fokus-unnta]")) return;
      if (e.pointerType !== "touch") {
        klikketVed = gsap.ticker.time;
        if (aktivIndeks >= 0 && notatVist !== aktivIndeks) visNotat(aktivIndeks);
        return;
      }
      const p = tilFelt(e);
      maal.x = p.x;
      maal.y = p.y;
      styring = "knapp";
      stoppAuto();
      autoOm(6);
      startTikk();
    };
    seksjon.addEventListener("pointermove", onMove);
    seksjon.addEventListener("pointerleave", onLeave);
    seksjon.addEventListener("pointerdown", onDown);
    window.addEventListener("blur", onLeave);

    const knapp = el.querySelector<HTMLButtonElement>(".ff-bytt");
    const onKnapp = () => {
      styring = "knapp";
      stoppAuto();
      tilfeldig();
      autoOm(7);
    };
    knapp?.addEventListener("click", onKnapp);

    // Bare jobb når heroen er synlig og fanen er åpen.
    const settSynlig = (ja: boolean) => {
      if (ja === synlig) return;
      synlig = ja;
      if (ja) {
        startTikk();
        if (styring === "auto") startAuto(1);
      } else {
        stoppTikk();
        stoppAuto();
        tilbake?.kill();
      }
    };
    let iSkjerm = true;
    const io = new IntersectionObserver(([inn]) => {
      iSkjerm = inn.isIntersecting;
      settSynlig(iSkjerm && !document.hidden);
    });
    io.observe(seksjon);
    const onSynlighet = () => settSynlig(iSkjerm && !document.hidden);
    document.addEventListener("visibilitychange", onSynlighet);

    // Ny størrelse eller skrift: mål på nytt og flytt lyset med begrepet.
    const ommal = () => {
      if (!levende) return;
      const fra = aktivIndeks;
      mal();
      if (fra >= 0 && punkter[fra]?.ok) {
        lys.x = maal.x = punkter[fra].x;
        lys.y = maal.y = punkter[fra].y;
        skrivLys();
        if (notatVist === fra) plasserNotat(fra);
      } else if (fra < 0) {
        plasserStart();
      } else {
        aktiver(-1);
        tilfeldig();
      }
    };
    const ro = new ResizeObserver(ommal);
    ro.observe(felt);
    document.fonts?.ready.then(ommal);

    const onRolig = () => {
      if (rolig()) {
        stoppAuto();
        intro.progress(1);
      } else startAuto(1);
    };
    roligMedium.addEventListener("change", onRolig);

    return () => {
      levende = false;
      stoppTikk();
      stoppAuto();
      tilbake?.kill();
      intro.kill();
      gsap.killTweensOf(notatKort);
      seksjon.style.cursor = "";
      io.disconnect();
      ro.disconnect();
      seksjon.removeEventListener("pointermove", onMove);
      seksjon.removeEventListener("pointerleave", onLeave);
      seksjon.removeEventListener("pointerdown", onDown);
      window.removeEventListener("blur", onLeave);
      knapp?.removeEventListener("click", onKnapp);
      document.removeEventListener("visibilitychange", onSynlighet);
      roligMedium.removeEventListener("change", onRolig);
    };
  }, []);

  const b = BEGREPENE[aktiv] ?? BEGREPENE[0];

  return (
    <div ref={rot} className="absolute inset-0">
      <div className="ff-felt" aria-hidden="true">
        <p className="ff-tekst ff-dim ff-intro">{ord}</p>
        <div className="ff-lampe ff-intro">
          <div className="ff-glod" />
          <div className="ff-innhold">
            <p className="ff-tekst ff-skarp">{ord}</p>
          </div>
        </div>
      </div>

      <div className="ff-notat" aria-hidden="true">
        <div className="ff-notat-kort rounded-2xl bg-background text-foreground px-5 py-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]">
          <div className="text-xs font-medium text-muted">
            {b.fag} · {b.trinn}
          </div>
          <div className="mt-1 font-display text-xl font-semibold leading-snug tracking-[-0.01em]">
            {b.term}
          </div>
          <p className="mt-1.5 text-[15px] leading-snug text-ink-soft">{b.def}</p>
        </div>
      </div>

      <div className="absolute z-20 right-4 top-[76px] lg:top-auto lg:right-8 lg:bottom-8 flex items-center gap-4">
        <span className="hidden lg:block text-sm text-background/55">
          Ekte begreper fra Studer · klikk på et ord for forklaringen
        </span>
        <span className="lg:hidden text-[13px] text-background/55">Trykk på et ord</span>
        <button
          type="button"
          className="ff-bytt inline-flex items-center gap-2 rounded-full border border-natt-linje bg-natt/70 backdrop-blur-sm px-3.5 py-2 text-sm font-medium text-background/80 transition-colors duration-200 hover:text-background hover:border-background/40 active:scale-[0.98]"
        >
          <Repeat size={16} />
          Bytt begrep
        </button>
      </div>
    </div>
  );
}
