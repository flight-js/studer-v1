"use client";

import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FARGER, lagSprite } from "@/components/Kirsebaerregn";

// Vindkast med kirsebærblader (hanafubuki) mellom sidene i temaet Sakura
// (data-premium="sakura" på <html>). Når eleven trykker Start eller velger et
// fag, et tema eller en øving, blåser et hvitrosa teppe med myke, uskarpe
// kanter skrått inn over skjermen sammen med en sky av kronblad. Siden byttes
// mens teppet dekker skjermen, og så blåser teppet videre og tar bladene med
// seg – den nye siden kommer fram bak den myke bakkanten.
//
// Teppet er WAAPI på transform (går jevnt også mens den nye siden lastes).
// Bladene tegnes på et lerret: hvert blad vender seg om sin egen akse og glir
// sideveis når det står på kant, som i Kirsebaerregn. Navigasjonen starter
// etter DEKKET_MS, når teppet dekker skjermen; teppet legger seg rolig mens
// siden byttes. Ingen overgang ved redusert bevegelse, tastatur (Enter på en
// lenke), lenker i menyen, nye faner eller samme side, og overlegget fjernes
// uansett etter 4 s. Utseendet står i globals.css (.so-*).

const RUTER = /^\/(fag|tema|repeter|flashcards|quiz|miniprove|formler|sammendrag)\/?$/;
const INN_MS = 640;
// Teppet dekker hele skjermen når det har kommet 82 % av veien; med INN-kurven
// skjer det ved 0,44 av tiden. Litt margin, så ingen kant skimtes.
const DEKKET_MS = 320;
const UT_MS = 820;
const INN = "cubic-bezier(0.33, 1, 0.68, 1)"; // ease-out (kubisk): synlig forkant, legger seg mykt
const UT = "cubic-bezier(0.45, 0, 0.2, 1)"; // glir av gårde, mykt i begge ender
const START = "translateX(-195vw)";
const DEKKET = "translateX(0)";
const SLUTT = "translateX(195vw)";

type Kronblad = {
  x: number;
  y: number;
  str: number;
  vx: number; // px/s med vinden
  vy: number;
  spinn: number; // vendingen gjennom flaten
  spinnFart: number;
  rull: number; // dreiningen i flaten
  rullFart: number;
  glid: number; // sideveis når bladet står på kant
  fase: number;
  alfa: number;
  blomst: boolean;
  farge: number;
  // Når bladet blir synlig (sekunder fra start). null: venter på forkanten av
  // teppet – blader som ligger på skjermen, plukkes opp når kastet når dem.
  fodt: number | null;
};

const vent = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const tilfeldig = (a: number, b: number) => a + Math.random() * (b - a);

// En bølge med blader: fra xFra til xTil (andeler av bredden), og fart som
// andel av bredden per sekund. Hvert blad får sine egne verdier. fodt: når de
// dukker opp (null = når forkanten når dem, for blader som starter på skjermen).
function bolge(
  antall: number,
  b: number,
  h: number,
  xFra: number,
  xTil: number,
  fart: [number, number],
  fodt: number | null
): Kronblad[] {
  return Array.from({ length: antall }, () => {
    const blomst = Math.random() < 0.16;
    const x = tilfeldig(xFra, xTil) * b;
    return {
      x,
      y: tilfeldig(-0.08, 1.08) * h,
      str: tilfeldig(14, 32) * (blomst ? 1.4 : 1),
      vx: tilfeldig(fart[0], fart[1]) * b,
      vy: tilfeldig(-0.2, 0.05) * h,
      spinn: Math.random() * Math.PI * 2,
      spinnFart: (Math.random() < 0.5 ? -1 : 1) * tilfeldig(3, 7.5),
      rull: Math.random() * Math.PI * 2,
      rullFart: tilfeldig(-2, 2),
      glid: tilfeldig(30, 90),
      fase: Math.random() * Math.PI * 2,
      alfa: tilfeldig(0.7, 1),
      blomst,
      // Mest de dype rosafargene, så bladene synes mot det lyse teppet.
      farge: Math.random() < 0.75 ? 2 + Math.floor(Math.random() * 2) : Math.floor(Math.random() * 2),
      fodt: fodt === null && x < 0 ? 0 : fodt,
    };
  });
}

type Overgang = { id: number; til: string };

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
      setOvergang({ id: Date.now(), til: url.pathname + url.search + url.hash });
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, []);

  useLayoutEffect(() => {
    const el = rot.current;
    const vind = el?.querySelector<HTMLElement>(".so-vind");
    const lerret = el?.querySelector<HTMLCanvasElement>(".so-blader");
    const ctx = lerret?.getContext("2d");
    if (!overgang || !el || !vind || !lerret || !ctx) return;

    // ---- Bladene
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const b = window.innerWidth;
    const h = window.innerHeight;
    lerret.width = Math.round(b * dpr);
    lerret.height = Math.round(h * dpr);
    const sprites = FARGER.map((f) => ({
      blad: { forside: lagSprite(f, false, false, dpr), bakside: lagSprite(f, false, true, dpr) },
      blomst: { forside: lagSprite(f, true, false, dpr), bakside: lagSprite(f, true, true, dpr) },
    }));
    // Antallet følger skjermflaten, så mobilen ikke får snøstorm.
    const k = Math.min(Math.max(Math.sqrt((b * h) / (1440 * 900)), 0.55), 1.25);
    // Første kast: noen kommer inn fra venstre, og blader over hele venstre del
    // av skjermen plukkes opp når forkanten av teppet når dem.
    let blader = bolge(Math.round(84 * k), b, h, -0.7, 0.75, [1.1, 1.9], null);
    // Forkanten av teppet (px fra venstre) mens det kommer inn: samme kurve som
    // INN (kubisk ease-out). Den myke kanten ligger ved 146vw + forskyvningen.
    const kant = (t: number) => {
      const fremdrift = 1 - Math.pow(1 - Math.min(t / (INN_MS / 1000), 1), 3);
      return ((-49 + 195 * fremdrift) * b) / 100;
    };
    let ramme = 0;
    let sist = 0;
    let tid = 0;
    const steg = (na: number) => {
      const dt = Math.min((na - (sist || na)) / 1000, 1 / 30);
      sist = na;
      tid += dt;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, lerret.width, lerret.height);
      for (const l of blader) {
        if (l.fodt === null) {
          if (kant(tid) < l.x + 0.06 * b) continue; // ligger og venter på kastet
          l.fodt = tid;
        }
        l.spinn += l.spinnFart * dt;
        l.rull += l.rullFart * dt;
        // Glir sideveis når bladet står på kant, og vinden løfter og kaster det.
        l.x += (l.vx + Math.sin(l.spinn) * l.glid) * dt;
        l.y += (l.vy + Math.cos(tid * 2.4 + l.fase) * 46) * dt;
        const kos = Math.cos(l.spinn);
        const s = sprites[l.farge][l.blomst ? "blomst" : "blad"];
        const cr = Math.cos(l.rull);
        const sr = Math.sin(l.rull);
        ctx.setTransform(dpr * cr * kos, dpr * sr * kos, -dpr * sr, dpr * cr, l.x * dpr, l.y * dpr);
        ctx.globalAlpha = l.alfa * Math.min(1, (tid - l.fodt) / 0.18);
        ctx.drawImage(kos < 0 ? s.bakside : s.forside, -l.str / 2, -l.str / 2, l.str, l.str);
      }
      ctx.globalAlpha = 1;
      blader = blader.filter((l) => l.fodt === null || l.x < b + 80);
      ramme = requestAnimationFrame(steg);
    };
    ramme = requestAnimationFrame(steg);

    // ---- Teppet
    const animasjoner: Animation[] = [];
    const anim = (frames: Keyframe[], opts: KeyframeAnimationOptions) => {
      const a = vind.animate(frames, { fill: "forwards", ...opts });
      animasjoner.push(a);
      return a;
    };
    let avbrutt = false;

    const spill = async () => {
      const inn = anim([{ transform: START }, { transform: DEKKET }], { duration: INN_MS, easing: INN });
      await vent(DEKKET_MS);
      if (avbrutt) return;

      // Bytt side mens skjermen er dekket. Adressen oppdateres når den nye
      // siden er på plass; et lite øyeblikk til, så den er tegnet.
      const fra = location.href;
      const start = performance.now();
      router.push(overgang.til);
      while (location.href === fra && performance.now() - start < 2500) await vent(16);
      await inn.finished;
      await vent(Math.max(40, 90 - (performance.now() - start)));
      if (avbrutt) return;

      // Kastet blåser videre: nye blader over hele skjermen følger med ut.
      el.style.pointerEvents = "none";
      blader = blader.concat(bolge(Math.round(40 * k), b, h, -0.25, 0.7, [0.9, 1.5], tid));
      await anim([{ transform: DEKKET }, { transform: SLUTT }], { duration: UT_MS, easing: UT }).finished;
      // La de siste bladene fly ut (høyst et halvt sekund).
      const slutt = performance.now() + 500;
      while (blader.length && performance.now() < slutt) await vent(16);
    };

    // Overlegget skal aldri bli stående: avbrytes uansett etter 4 s.
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
        cancelAnimationFrame(ramme);
        if (ryddet) return; // effekten er ryddet (ny kjøring eller fjernet)
        kjorer.current = false;
        setOvergang(null);
      });
    return () => {
      ryddet = true;
      clearTimeout(nod);
      cancelAnimationFrame(ramme);
      stopp();
    };
  }, [overgang, router]);

  if (!overgang) return null;
  return (
    <div ref={rot} className="so-rot" aria-hidden="true">
      <div className="so-vind" />
      <canvas className="so-blader" />
    </div>
  );
}
