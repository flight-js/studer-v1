"use client";

import { useEffect, useRef, useState } from "react";

// Fallende kirsebærblomster (sakura) over hele siden mens temaet Sakura er i
// bruk (data-premium="sakura" på <html>, se PremiumTema og globals.css).
//
// Kronbladene har den japanske formen med et hakk i tuppen, og noen hele
// blomster med støvbærere faller også. Hvert kronblad vender seg om sin egen
// akse (bredden går gjennom null, så det står på kant et øyeblikk) og glir
// sideveis når det står på kant – det er det som får det til å se ut som et
// blad i lufta og ikke konfetti. Forsiden er rosa, baksiden blekere.
//
// Tre lag: fjerne (små, sakte, svake), midtre og noen få nære som krysser foran
// teksten. Antallet følger skjermflaten. Lerretet tar aldri imot trykk, ligger
// under menyen (z-40), pauser når fanen er skjult, og viser ett stillbilde ved
// redusert bevegelse.

type Blad = {
  x: number;
  y: number;
  str: number; // bredde i px
  fall: number; // px/s
  spinn: number; // vendingen gjennom flaten (radianer)
  spinnFart: number;
  rull: number; // dreiningen i flaten
  rullFart: number;
  glid: number; // sideveis fart når bladet står på kant
  alfa: number;
  blomst: boolean;
  farge: number;
  lag: number; // 0 fjern, 1 midtre, 2 nær
};

// [ved basen, mot tuppen] – fra blek til dyp kirsebærrosa, så de synes både på
// den lyse og den mørke flaten.
const FARGER = [
  ["#f6b1c7", "#fde1ea"],
  ["#f29ab8", "#fbd3e0"],
  ["#ec84aa", "#f9c6d7"],
  ["#e26896", "#f6b8cd"],
] as const;

const LAG = [
  { andel: 12, str: [9, 13], fall: [16, 28], alfa: [0.28, 0.42], blomst: 0.15 },
  { andel: 14, str: [13, 20], fall: [28, 46], alfa: [0.5, 0.8], blomst: 0.2 },
  { andel: 4, str: [22, 30], fall: [48, 72], alfa: [0.55, 0.85], blomst: 0.12 },
] as const;

const SPRITE = 64; // tegnes én gang i denne størrelsen (ganger pikseltetthet)
const tilfeldig = (a: number, b: number) => a + Math.random() * (b - a);

// Ett japansk kirsebærblad: dråpe fra basen med et V-hakk i tuppen, pekende opp.
function kronblad(ctx: CanvasRenderingContext2D, s: number) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-0.42 * s, -0.3 * s, -0.5 * s, -0.78 * s, -0.24 * s, -1 * s);
  ctx.lineTo(0, -0.84 * s);
  ctx.lineTo(0.24 * s, -1 * s);
  ctx.bezierCurveTo(0.5 * s, -0.78 * s, 0.42 * s, -0.3 * s, 0, 0);
  ctx.closePath();
}

// Forside og bakside for ett kronblad eller én blomst i én farge.
function lagSprite(farge: readonly [string, string], blomst: boolean, bak: boolean, dpr: number) {
  const c = document.createElement("canvas");
  c.width = c.height = SPRITE * dpr;
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  ctx.scale(dpr, dpr);
  ctx.translate(SPRITE / 2, blomst ? SPRITE / 2 : SPRITE * 0.92);
  const [dyp, lys] = farge;
  const tegnBlad = (s: number) => {
    // Rosa ved basen, blekere mot tuppen – som på ekte sakura.
    const g = ctx.createLinearGradient(0, 0, 0, -s);
    g.addColorStop(0, bak ? lys : dyp);
    g.addColorStop(1, bak ? "#fff6f9" : lys);
    kronblad(ctx, s);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = bak ? "rgba(226,104,150,0.3)" : "rgba(194,24,91,0.4)";
    ctx.lineWidth = 1;
    ctx.stroke();
  };
  if (!blomst) {
    tegnBlad(SPRITE * 0.84);
    return c;
  }
  for (let i = 0; i < 5; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI * 2) / 5);
    tegnBlad(SPRITE * 0.44);
    ctx.restore();
  }
  // Støvbærere: tynne tråder med små knopper rundt et mørkere midtpunkt.
  if (!bak) {
    ctx.strokeStyle = "rgba(196,40,96,0.55)";
    ctx.fillStyle = "#c2185b";
    ctx.lineWidth = 0.9;
    for (let i = 0; i < 9; i++) {
      const v = (i * Math.PI * 2) / 9 + 0.3;
      const r = SPRITE * (i % 2 ? 0.13 : 0.17);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(v) * r, Math.sin(v) * r);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(Math.cos(v) * r, Math.sin(v) * r, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.beginPath();
  ctx.arc(0, 0, SPRITE * 0.05, 0, Math.PI * 2);
  ctx.fillStyle = bak ? "#f6c4d4" : "#e8336f";
  ctx.fill();
  return c;
}

export function Kirsebaerregn() {
  const [aktiv, setAktiv] = useState(false);

  // Følg temaet på <html> – det settes både av skriptet i <head>, av
  // PremiumTema og når eleven bytter tema.
  useEffect(() => {
    const html = document.documentElement;
    const sjekk = () => setAktiv(html.dataset.premium === "sakura");
    sjekk();
    const mo = new MutationObserver(sjekk);
    mo.observe(html, { attributes: true, attributeFilter: ["data-premium"] });
    return () => mo.disconnect();
  }, []);

  return aktiv ? <Regn /> : null;
}

function Regn() {
  const lerret = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = lerret.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const rolig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const sprites = FARGER.map((f) => ({
      blad: { forside: lagSprite(f, false, false, dpr), bakside: lagSprite(f, false, true, dpr) },
      blomst: { forside: lagSprite(f, true, false, dpr), bakside: lagSprite(f, true, true, dpr) },
    }));

    let b = 0;
    let h = 0;
    let blader: Blad[] = [];
    let ramme = 0;
    let sist = 0;

    const nyttBlad = (lagNr: number, overalt: boolean): Blad => {
      const lag = LAG[lagNr];
      const blomst = Math.random() < lag.blomst;
      const str = tilfeldig(lag.str[0], lag.str[1]) * (blomst ? 1.5 : 1);
      return {
        x: Math.random() * b,
        y: overalt ? Math.random() * h : -str * 2,
        str,
        fall: tilfeldig(lag.fall[0], lag.fall[1]),
        spinn: Math.random() * Math.PI * 2,
        spinnFart: tilfeldig(1.1, 2.6) * (Math.random() < 0.5 ? -1 : 1),
        rull: Math.random() * Math.PI * 2,
        rullFart: tilfeldig(-0.6, 0.6),
        glid: tilfeldig(14, 34),
        alfa: tilfeldig(lag.alfa[0], lag.alfa[1]),
        blomst,
        farge: Math.floor(Math.random() * FARGER.length),
        lag: lagNr,
      };
    };

    // Antallet følger skjermflaten, så mobilen ikke får snøstorm. Bladene lages
    // på nytt bare når bredden endres – ikke når siden blir høyere eller
    // adresselinja på mobilen trekker seg inn mens man ruller.
    let byggetBredde = 0;
    const bygg = () => {
      b = window.innerWidth;
      h = window.innerHeight;
      if (!b || !h) return;
      c.width = Math.round(b * dpr);
      c.height = Math.round(h * dpr);
      if (b !== byggetBredde) {
        byggetBredde = b;
        const k = Math.min(Math.max(Math.sqrt((b * h) / (1440 * 900)), 0.5), 1.3);
        blader = LAG.flatMap((lag, nr) =>
          Array.from({ length: Math.max(1, Math.round(lag.andel * k)) }, () => nyttBlad(nr, true)),
        );
        // Fjerne først, så de nære legger seg over.
        blader.sort((x, y) => x.lag - y.lag);
      }
      tegn();
    };

    const tegn = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, c.width, c.height);
      for (const l of blader) {
        const kos = Math.cos(l.spinn);
        const s = sprites[l.farge][l.blomst ? "blomst" : "blad"];
        const bilde = kos < 0 ? s.bakside : s.forside;
        const cr = Math.cos(l.rull);
        const sr = Math.sin(l.rull);
        // Flytt, drei i flaten, og vend om den lange aksen (bredden ganges med cos).
        ctx.setTransform(dpr * cr * kos, dpr * sr * kos, -dpr * sr, dpr * cr, l.x * dpr, l.y * dpr);
        ctx.globalAlpha = l.alfa;
        ctx.drawImage(bilde, -l.str / 2, -l.str / 2, l.str, l.str);
      }
      ctx.globalAlpha = 1;
    };

    const steg = (tid: number) => {
      const dt = Math.min((tid - (sist || tid)) / 1000, 1 / 30);
      sist = tid;
      for (const l of blader) {
        l.spinn += l.spinnFart * dt;
        l.rull += l.rullFart * dt;
        // Glir sideveis når bladet står på kant, og bremser når flaten vender mot fallet.
        l.x += (Math.sin(l.spinn) * l.glid + 6) * dt;
        l.y += l.fall * dt * (0.75 + 0.25 * Math.abs(Math.cos(l.spinn)));
        // Forbi bunnen: kommer tilbake over toppen et nytt sted, i samme lag.
        if (l.y > h + l.str * 2) Object.assign(l, nyttBlad(l.lag, false));
        if (l.x > b + l.str) l.x = -l.str;
        else if (l.x < -l.str) l.x = b + l.str;
      }
      tegn();
      ramme = requestAnimationFrame(steg);
    };

    const start = () => {
      if (rolig || ramme || document.hidden) return;
      sist = 0;
      ramme = requestAnimationFrame(steg);
    };
    const stopp = () => {
      cancelAnimationFrame(ramme);
      ramme = 0;
    };
    const onSynlighet = () => (document.hidden ? stopp() : start());

    bygg();
    start();
    const ro = new ResizeObserver(() => bygg());
    ro.observe(document.documentElement);
    document.addEventListener("visibilitychange", onSynlighet);
    return () => {
      stopp();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onSynlighet);
    };
  }, []);

  return <canvas ref={lerret} aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 h-full w-full" />;
}
