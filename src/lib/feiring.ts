// Konfetti og gnister når eleven får til noe (components/Feiringsmerke.tsx,
// quizsvar, rekker, formelmatch, poengvarselet).
//
// Ett lerret over hele skjermen som bare finnes mens noe flyr: det lages ved
// første utbrudd og fjernes når siste partikkel er borte. Ingen bibliotek.
// Partiklene er «papirlapper» og merkepennstrøk i fargene fra leselampa
// (merkepenn-gult, primærblått, grønt og lampegult), og snurrer som papir.
//
// Redusert bevegelse: ingenting flyr. Merket og teksten sier det samme.

type Form = 0 | 1 | 2; // lapp, strek, prikk

type Partikkel = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vrot: number;
  flipp: number; // fase for «snurr» rundt egen akse (papir som blafrer)
  vflipp: number;
  b: number;
  h: number;
  farge: string;
  form: Form;
  alder: number;
  liv: number;
  tyngde: number;
  drag: number;
};

const MAKS = 420;
const partikler: Partikkel[] = [];
let lerret: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let skala = 1;
let raf = 0;
let sist = 0;

export const reduserBevegelse = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Ingen feiring i en skjult fane: den ville bare blitt spilt av (for sent) når
// eleven kommer tilbake.
const avAv = () => typeof window === "undefined" || document.hidden || reduserBevegelse();

function farger(): string[] {
  const s = getComputedStyle(document.documentElement);
  const v = (n: string, reserve: string) => s.getPropertyValue(n).trim() || reserve;
  // Gult to ganger: merkepennen er hovedfargen i feiringen.
  return [v("--merke", "#f6e05e"), v("--merke", "#f6e05e"), v("--primary", "#2c4bd4"), v("--success", "#1f8a58"), v("--lampe", "#ffd98c")];
}

function tilpass() {
  if (!lerret || !ctx) return;
  skala = Math.min(window.devicePixelRatio || 1, 2);
  lerret.width = Math.round(window.innerWidth * skala);
  lerret.height = Math.round(window.innerHeight * skala);
}

function skjult() {
  // Fanen er ikke synlig: ingen vits i å fortsette (og rAF står uansett).
  if (document.hidden) stopp();
}

function sikreLerret() {
  if (lerret) return;
  lerret = document.createElement("canvas");
  lerret.setAttribute("aria-hidden", "true");
  lerret.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:70";
  ctx = lerret.getContext("2d");
  document.body.appendChild(lerret);
  tilpass();
  window.addEventListener("resize", tilpass);
  document.addEventListener("visibilitychange", skjult);
}

function stopp() {
  cancelAnimationFrame(raf);
  raf = 0;
  partikler.length = 0;
  window.removeEventListener("resize", tilpass);
  document.removeEventListener("visibilitychange", skjult);
  lerret?.remove();
  lerret = null;
  ctx = null;
}

function tegn(na: number) {
  const dt = Math.min((na - sist) / 1000, 1 / 30);
  sist = na;
  const c = ctx!;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.clearRect(0, 0, lerret!.width, lerret!.height);

  let i = partikler.length;
  while (i--) {
    const p = partikler[i];
    p.alder += dt;
    if (p.alder >= p.liv || p.y > window.innerHeight + 40) {
      partikler[i] = partikler[partikler.length - 1];
      partikler.pop();
      continue;
    }
    const d = Math.pow(p.drag, dt * 60);
    p.vx *= d;
    p.vy = p.vy * d + p.tyngde * dt;
    // Papiret vaier litt fra side til side mens det faller.
    p.x += (p.vx + (p.form === 2 ? 0 : Math.sin(p.flipp * 0.5) * 40)) * dt;
    p.y += p.vy * dt;
    p.rot += p.vrot * dt;
    p.flipp += p.vflipp * dt;

    const igjen = 1 - p.alder / p.liv;
    c.globalAlpha = igjen < 0.3 ? igjen / 0.3 : 1;
    c.fillStyle = p.farge;
    const cos = Math.cos(p.rot);
    const sin = Math.sin(p.rot);
    const sy = p.form === 2 ? 1 : Math.cos(p.flipp); // papiret snur seg
    c.setTransform(cos * skala, sin * skala, -sin * sy * skala, cos * sy * skala, p.x * skala, p.y * skala);
    if (p.form === 2) {
      c.beginPath();
      c.arc(0, 0, p.b / 2, 0, Math.PI * 2);
      c.fill();
    } else {
      c.fillRect(-p.b / 2, -p.h / 2, p.b, p.h);
    }
  }
  c.globalAlpha = 1;

  if (partikler.length) raf = requestAnimationFrame(tegn);
  else stopp();
}

function start() {
  if (raf) return;
  sist = performance.now();
  raf = requestAnimationFrame(tegn);
}

const tilfeldig = (a: number, b: number) => a + Math.random() * (b - a);

function legg(p: Omit<Partikkel, "alder">) {
  if (partikler.length >= MAKS) return;
  partikler.push({ ...p, alder: 0 });
}

// Midten av et element (eller et punkt), i skjermkoordinater.
type Kilde = Element | { x: number; y: number } | null | undefined;
function punkt(k: Kilde): { x: number; y: number } {
  if (!k) return { x: window.innerWidth / 2, y: window.innerHeight / 3 };
  if ("getBoundingClientRect" in k) {
    const r = k.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  return k;
}

function utbrudd(
  { x, y }: { x: number; y: number },
  { antall, retning, spredning, fart, liv }: { antall: number; retning: number; spredning: number; fart: [number, number]; liv: [number, number] },
) {
  const f = farger();
  for (let i = 0; i < antall; i++) {
    const vinkel = retning + tilfeldig(-spredning / 2, spredning / 2);
    const v = tilfeldig(fart[0], fart[1]);
    const form: Form = Math.random() < 0.55 ? 0 : Math.random() < 0.6 ? 1 : 2;
    legg({
      x,
      y,
      vx: Math.cos(vinkel) * v,
      vy: Math.sin(vinkel) * v,
      rot: tilfeldig(0, Math.PI * 2),
      vrot: tilfeldig(-8, 8),
      flipp: tilfeldig(0, Math.PI * 2),
      vflipp: tilfeldig(6, 14),
      b: form === 1 ? tilfeldig(12, 18) : form === 2 ? tilfeldig(5, 7) : tilfeldig(7, 11),
      h: form === 1 ? tilfeldig(3, 4) : tilfeldig(4, 7),
      farge: f[(Math.random() * f.length) | 0],
      form,
      liv: tilfeldig(liv[0], liv[1]),
      tyngde: tilfeldig(650, 950),
      drag: tilfeldig(0.95, 0.97),
    });
  }
}

// Konfetti fra et element. «stor»: alt riktig og nye rekorder – også fra begge
// sidene nederst. «liten»: godt resultat.
export function konfetti(kilde?: Kilde, niva: "liten" | "stor" = "stor") {
  if (avAv()) return;
  sikreLerret();
  const p = punkt(kilde);
  const stor = niva === "stor";
  utbrudd(p, {
    antall: stor ? 100 : 50,
    retning: -Math.PI / 2,
    spredning: Math.PI * 0.85,
    fart: stor ? [750, 1500] : [550, 1050],
    liv: [2, 3],
  });
  if (stor) {
    const h = window.innerHeight;
    const w = window.innerWidth;
    const fart: [number, number] = [Math.max(h, 700) * 1.25, Math.max(h, 700) * 1.9];
    utbrudd({ x: -10, y: h * 0.85 }, { antall: 60, retning: -Math.PI * 0.34, spredning: 0.45, fart, liv: [2.2, 3] });
    utbrudd({ x: w + 10, y: h * 0.85 }, { antall: 60, retning: -Math.PI * 0.66, spredning: 0.45, fart, liv: [2.2, 3] });
  }
  start();
}

// Små gnister rett ut fra et element: riktig svar, et par i formelmatch, en
// milepæl i rekka. Korte (under et halvt sekund), så de aldri står i veien.
export function gnister(kilde: Kilde, antall = 12) {
  if (avAv()) return;
  sikreLerret();
  const { x, y } = punkt(kilde);
  const f = farger();
  for (let i = 0; i < antall; i++) {
    const vinkel = (i / antall) * Math.PI * 2 + tilfeldig(-0.25, 0.25);
    const v = tilfeldig(260, 480);
    const strek = i % 3 === 0;
    legg({
      x,
      y,
      vx: Math.cos(vinkel) * v,
      vy: Math.sin(vinkel) * v,
      rot: vinkel,
      vrot: 0,
      flipp: 0,
      vflipp: 0,
      b: strek ? tilfeldig(8, 12) : tilfeldig(4, 6),
      h: strek ? 2.5 : 0,
      farge: f[i % f.length],
      form: strek ? 1 : 2,
      liv: tilfeldig(0.35, 0.55),
      tyngde: 380,
      drag: 0.88,
    });
  }
  start();
}
