"use client";

import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Katanakuttet (iai) mellom sidene i temaet Sakura (data-premium="sakura" på
// <html>). Når eleven trykker Start eller velger et fag, et tema eller en
// øving, lukker to mørke halvdeler seg skrått over skjermen, og halvdelene av
// et kirsebærmon (kamon) i midten møtes. Mens skjermen er dekket, byttes siden.
// Så skjærer et lysende sverdhugg langs skjøten, monet deles, halvdelene glir
// fra hverandre langs kuttet og åpner den nye siden, og kronblad spruter ut.
//
// Navigasjonen starter etter LUKK_MS (under 0,3 s). Animasjonene er WAAPI på
// transform og opasitet, så de går jevnt også mens den nye siden lastes.
// Ingen overgang for redusert bevegelse, tastatur (Enter på en lenke), lenker
// i menyen, nye faner eller samme side. Utseendet står i globals.css (.so-*).

const RUTER = /^\/(fag|tema|repeter|flashcards|quiz|miniprove|formler|sammendrag)\/?$/;
const VINKEL = -16; // kuttets helning i grader (samme som .so-ramme)
const UT = "cubic-bezier(0.22, 1, 0.36, 1)"; // --ease-out-soft
const INN_UT = "cubic-bezier(0.77, 0, 0.175, 1)"; // bevegelse på skjermen
const LUKK_MS = 280;
const FARGER = ["#ffc2d6", "#f9a8c4", "#ffd9e5", "#f48fb1"];
// Ett kirsebærblad med hakk i tuppen, sentrert.
const BLAD = "M0 9C-7 4-9-4-4-9L0-6L4-9C9-4 7 4 0 9Z";

type Blad = {
  x: number; // prosent av rammebredden
  dx: number;
  dy: number;
  rot: number;
  spinn: number;
  str: number;
  farge: string;
  tid: number;
  forsink: number;
};
type Overgang = { id: number; til: string; blader: Blad[] };

const vent = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const tilfeldig = (a: number, b: number) => a + Math.random() * (b - a);

// Kronbladene spres langs den delen av kuttet som synes på skjermen.
function lagBlader(): Blad[] {
  const b = window.innerWidth;
  const side = 1.5 * Math.max(b, window.innerHeight);
  const synlig = Math.min(b / 2 / Math.cos((VINKEL * Math.PI) / 180), side / 2);
  const andel = (synlig / side) * 0.85;
  return Array.from({ length: 18 }, (_, i) => ({
    x: 50 + tilfeldig(-1, 1) * andel * 100,
    dx: tilfeldig(-30, 110), // mest i hoggets retning
    dy: (i % 2 ? 1 : -1) * tilfeldig(50, 220),
    rot: tilfeldig(0, 360),
    spinn: (Math.random() < 0.5 ? -1 : 1) * tilfeldig(120, 340),
    str: tilfeldig(16, 30),
    farge: FARGER[i % FARGER.length],
    tid: tilfeldig(700, 1100),
    forsink: tilfeldig(0, 160),
  }));
}

export function SakuraOvergang() {
  const router = useRouter();
  const [overgang, setOvergang] = useState<Overgang | null>(null);
  const kjorer = useRef(false);
  const rot = useRef<HTMLDivElement>(null);

  // Fanger klikket før Next-lenken (capture på window), og navigerer selv når
  // skjermen er dekket.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.detail === 0) return; // tastatur: ingen forsinkelse
      if (document.documentElement.dataset.premium !== "sakura") return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const a = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!(a instanceof HTMLAnchorElement) || a.closest("header")) return;
      if ((a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href);
      if (url.origin !== location.origin || !RUTER.test(url.pathname)) return;
      if (url.pathname + url.search === location.pathname + location.search) return;
      e.preventDefault();
      if (kjorer.current) return;
      kjorer.current = true;
      setOvergang({ id: Date.now(), til: url.pathname + url.search + url.hash, blader: lagBlader() });
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, []);

  useLayoutEffect(() => {
    const el = rot.current;
    if (!overgang || !el) return;
    const finn = (s: string) => el.querySelector<HTMLElement>(s)!;
    const [topp, bunn, kutt, spor, blink] = [".so-topp", ".so-bunn", ".so-kutt", ".so-spor", ".so-blink"].map(finn);
    const blader = Array.from(el.querySelectorAll<SVGElement>(".so-blad"));
    const animasjoner: Animation[] = [];
    const anim = (node: Element, frames: Keyframe[], opts: KeyframeAnimationOptions) => {
      const a = node.animate(frames, { fill: "forwards", ...opts });
      animasjoner.push(a);
      return a;
    };
    let avbrutt = false;

    const spill = async () => {
      // 1. Halvdelene lukker seg, og monet settes sammen i skjøten.
      const lukk = { duration: LUKK_MS, easing: UT };
      anim(topp, [{ transform: "translateY(-101%)" }, { transform: "translateY(0)" }], lukk);
      await anim(bunn, [{ transform: "translateY(101%)" }, { transform: "translateY(0)" }], lukk).finished;
      if (avbrutt) return;

      // 2. Bytt side mens skjermen er dekket. Adressen oppdateres når den nye
      // siden er på plass; to rammer til, så den er tegnet før vi åpner.
      const fra = location.href;
      const start = performance.now();
      router.push(overgang.til);
      while (location.href === fra && performance.now() - start < 2500) await vent(16);
      await vent(Math.max(32, 110 - (performance.now() - start)));
      if (avbrutt) return;

      // 3. Hugget: en lysende strek og en glans langs skjøten, et lite blink.
      anim(
        kutt,
        [
          { transform: "scaleX(0)", opacity: 1 },
          { transform: "scaleX(1)", opacity: 1, offset: 0.55 },
          { transform: "scaleX(1)", opacity: 0 },
        ],
        { duration: 420, easing: UT },
      );
      anim(
        spor,
        [
          { transform: "translateX(-50%)", opacity: 0 },
          { opacity: 1, offset: 0.2 },
          { transform: "translateX(50%)", opacity: 0 },
        ],
        { duration: 300, easing: UT },
      );
      anim(blink, [{ opacity: 0 }, { opacity: 1, offset: 0.3 }, { opacity: 0 }], { duration: 380, easing: "ease-out" });
      blader.forEach((node, i) => {
        const b = overgang.blader[i];
        anim(
          node,
          [
            { transform: `translate(0, 0) rotate(${b.rot}deg) scale(0.5)`, opacity: 0 },
            { opacity: 1, offset: 0.12 },
            // Står på kant et øyeblikk mens det vender seg.
            {
              transform: `translate(${b.dx * 0.6}px, ${b.dy * 0.7}px) rotate(${b.rot + b.spinn * 0.6}deg) scale(1, 0.25)`,
              offset: 0.55,
            },
            { transform: `translate(${b.dx}px, ${b.dy}px) rotate(${b.rot + b.spinn}deg) scale(0.9, 1)`, opacity: 0 },
          ],
          { duration: b.tid, delay: 90 + b.forsink, easing: UT, fill: "both" },
        );
      });

      // 4. Halvdelene glir litt langs kuttet (som noe som er skåret over) og
      // åpner seg så. Den nye siden kan brukes med en gang de åpner.
      const glid = { duration: 150, delay: 110, easing: UT };
      anim(topp, [{ transform: "translate(0, 0)" }, { transform: "translate(-1.5%, -0.6%)" }], glid);
      anim(bunn, [{ transform: "translate(0, 0)" }, { transform: "translate(1.5%, 0.6%)" }], glid);
      const apne = { duration: 540, delay: 260, easing: INN_UT };
      anim(topp, [{ transform: "translate(-1.5%, -0.6%)" }, { transform: "translate(-7%, -101%)" }], apne);
      anim(bunn, [{ transform: "translate(1.5%, 0.6%)" }, { transform: "translate(7%, 101%)" }], apne);
      await vent(260);
      el.style.pointerEvents = "none";
      await Promise.all(animasjoner.map((a) => a.finished));
    };

    // Overlegget skal aldri bli stående: avbrytes uansett etter 4 s (avbrutte
    // animasjoner avviser «finished», og finally rydder).
    let ryddet = false;
    const stopp = () => {
      avbrutt = true;
      animasjoner.forEach((a) => a.cancel());
    };
    const nod = setTimeout(stopp, 4000);
    spill()
      .catch(() => {})
      .finally(() => {
        clearTimeout(nod);
        if (ryddet) return; // effekten er ryddet (ny kjøring eller fjernet)
        kjorer.current = false;
        setOvergang(null);
      });
    return () => {
      ryddet = true;
      clearTimeout(nod);
      stopp();
    };
  }, [overgang, router]);

  if (!overgang) return null;
  return (
    <div ref={rot} className="so-rot" aria-hidden="true">
      <div className="so-ramme">
        <div className="so-halv so-topp bg-natt">
          <div className="so-glod" />
          <Mon />
        </div>
        <div className="so-halv so-bunn bg-natt">
          <div className="so-glod" />
          <Mon />
        </div>
        <div className="so-kutt" />
        <div className="so-spor">
          <div className="so-glans" />
        </div>
        <div className="so-blader">
          {overgang.blader.map((b, i) => (
            <svg key={i} className="so-blad" viewBox="-10 -10 20 20" style={{ left: `${b.x}%`, width: b.str, height: b.str }}>
              <path d={BLAD} fill={b.farge} stroke="#c2185b" strokeOpacity="0.35" strokeWidth="0.8" />
            </svg>
          ))}
        </div>
      </div>
      <div className="so-blink" />
    </div>
  );
}

// Kirsebærmon: fem kronblad med hakk, støvbærere mellom bladene og en ring.
// Ligger i begge halvdelene med midten i skjøten, så hver halvdel viser sin del.
function Mon() {
  return (
    <svg className="so-mon" viewBox="-50 -50 100 100">
      <circle r="47" fill="none" stroke="#ffc2d6" strokeOpacity="0.4" strokeWidth="1.5" />
      <g fill="#ffc2d6">
        {[0, 72, 144, 216, 288].map((v) => (
          <path key={v} d="M0-6C-14-14-20-34-9-43L0-36L9-43C20-34 14-14 0-6Z" transform={`rotate(${v})`} />
        ))}
      </g>
      <g stroke="#ffc2d6" strokeWidth="1.4" strokeLinecap="round">
        {[36, 108, 180, 252, 324].map((v) => (
          <line key={v} y1="-7" y2="-16" transform={`rotate(${v})`} />
        ))}
      </g>
      <g fill="#ffc2d6">
        {[36, 108, 180, 252, 324].map((v) => (
          <circle key={v} cy="-17.5" r="2.2" transform={`rotate(${v})`} />
        ))}
      </g>
      <circle r="6" fill="#f48fb1" />
    </svg>
  );
}
