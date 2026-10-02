"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { EKSEMPEL, KATALOG, TELLING } from "@/lib/forsidedata";

gsap.registerPlugin(ScrollTrigger);

// «Slik funker det» på forsiden: hele pensum som prikker – én prikk per tema,
// én rad per fag, én blokk per trinn. Mens man ruller gjennom stegene,
// snevres utvalget inn fra alt til ett tema (eksempeltemaet fra forsidedata).

const VALGT_TRINN = KATALOG.findIndex((t) => t.navn === EKSEMPEL.trinn);
const VALGT_FAG = KATALOG[VALGT_TRINN].fag.findIndex((f) => f.navn === EKSEMPEL.fag);
const ANTALL_FAG_VALGT = KATALOG[VALGT_TRINN].fag.length;
const ANTALL_TEMA_VALGT = KATALOG[VALGT_TRINN].fag[VALGT_FAG].temaer.length;

type Prikk = { blokk: number; rad: number; kol: number; valgtFag: boolean; valgt: boolean; sti: string };

const PRIKKER: Prikk[] = KATALOG.flatMap((t, blokk) =>
  t.fag.flatMap((f, rad) =>
    f.temaer.map((navn, kol) => ({
      blokk,
      rad,
      kol,
      valgtFag: blokk === VALGT_TRINN && rad === VALGT_FAG,
      valgt: blokk === VALGT_TRINN && rad === VALGT_FAG && kol === EKSEMPEL.temaIndeks,
      sti: `${t.navn} · ${f.navn} · ${navn}`,
    })),
  ),
);

const STEG = [
  {
    tittel: "Velg trinn",
    tekst: "Fra 8. trinn til Vg3 – ungdomsskolen og studiespesialiserende på videregående.",
  },
  {
    tittel: "Velg fag",
    tekst: `Fellesfag og programfag, ${TELLING.fag} til sammen. Her: ${EKSEMPEL.fag} på ${EKSEMPEL.trinn}.`,
  },
  {
    tittel: "Velg tema",
    tekst: "Hvert fag er delt inn i temaer etter læreplanen, med en repetisjon av hele faget til slutt.",
  },
  {
    tittel: "Øv",
    tekst: `${EKSEMPEL.flashcards} flashcards, ${EKSEMPEL.quiz} quizspørsmål og en miniprøve på ${EKSEMPEL.minutter} minutter – bare i dette temaet.`,
  },
];

const BILDETEKST = [
  `${TELLING.temaer} temaer · ${TELLING.fag} fag · ${TELLING.trinn} trinn`,
  `${EKSEMPEL.trinn} · ${ANTALL_FAG_VALGT} fag`,
  `${EKSEMPEL.fag} · ${ANTALL_TEMA_VALGT} temaer`,
  EKSEMPEL.tema,
  EKSEMPEL.tema,
];

// Gjennomsiktighet, gulhet og størrelse for hver prikk i hvert steg.
function tilstand(steg: number): Tilstand {
  const n = PRIKKER.length;
  const a = new Float32Array(n);
  const g = new Float32Array(n);
  const k = new Float32Array(n);
  PRIKKER.forEach((p, i) => {
    const iTrinn = p.blokk === VALGT_TRINN;
    k[i] = 1;
    if (steg === 0) a[i] = 0.5;
    else if (steg === 1) a[i] = iTrinn ? 0.95 : 0.1;
    else if (steg === 2) {
      a[i] = p.valgtFag ? 1 : iTrinn ? 0.22 : 0.07;
      g[i] = p.valgtFag ? 1 : 0;
    } else {
      a[i] = p.valgt ? 1 : p.valgtFag ? 0.45 : iTrinn ? 0.1 : 0.05;
      g[i] = p.valgt ? 1 : 0;
      k[i] = p.valgt ? (steg === 3 ? 1.9 : 2.3) : 1;
    }
  });
  const etiketter = KATALOG.map((_, b) => (steg === 0 ? 0.7 : b === VALGT_TRINN ? 1 : 0.3));
  return { a, g, k, etiketter, glod: steg >= 3 ? 1 : 0, zoom: steg >= 2 ? 1 : 0 };
}
// zoom: 1 betyr innzoomet på det valgte faget (bare på smale skjermer, se oppsett).
type Tilstand = { a: Float32Array; g: Float32Array; k: Float32Array; etiketter: number[]; glod: number; zoom: number };

const PAPIR = [247, 244, 238];
const GUL = [246, 224, 94];
const ETIKETT = 22;
const RADGAP = 18;
const KOLGAP = 2; // i prikker

export function Pensumkart() {
  const rot = useRef<HTMLDivElement>(null);
  const flate = useRef<HTMLDivElement>(null);
  const lerret = useRef<HTMLCanvasElement>(null);
  const kort = useRef<HTMLDivElement>(null);
  const gaaTil = useRef<(steg: number) => void>(() => {});
  const [steg, setSteg] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const [klar, setKlar] = useState(false);

  useEffect(() => {
    const rotEl = rot.current;
    const flateEl = flate.current;
    const canvas = lerret.current;
    const ctx = canvas?.getContext("2d");
    if (!rotEl || !flateEl || !canvas || !ctx) return;

    const rolig = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setKlar(true);

    // Oppsett: blokkene står i to rader (ungdomsskole og videregående) med
    // tre trinn i hver. Kolonnebredden følger faget med flest temaer.
    const kolBredde = [0, 1, 2].map((c) =>
      Math.max(...KATALOG.filter((_, b) => b % 3 === c).map((t) => Math.max(...t.fag.map((f) => f.temaer.length)))),
    );
    const radHoyde = [0, 1].map((r) => Math.max(...KATALOG.slice(r * 3, r * 3 + 3).map((t) => t.fag.length)));
    const enheterBredde = kolBredde.reduce((s, v) => s + v, 0) + KOLGAP * 2;
    const enheterHoyde = radHoyde[0] + radHoyde[1];

    let steg = 0;
    let hoverIndeks = -1;
    let pitch = 10;
    let w = 0;
    let h = 0;
    let xs = new Float32Array(PRIKKER.length);
    let ys = new Float32Array(PRIKKER.length);
    let blokkPos: { x: number; y: number }[] = [];
    let fra: Tilstand = tilstand(0);
    let til: Tilstand = fra;
    const fremdrift = { p: 1 };
    let skrift = "500 12px system-ui";
    // På mobil blir prikkene små. Fra «Velg fag» zoomes det inn på faget og
    // radene rundt, så det valgte temaet synes. fokus er midten av utsnittet,
    // z hvor mye det forstørres; vis er transformen som er tegnet nå.
    let kanZoome = false;
    const kamera = { z: 1, fx: 0, fy: 0 };
    const vis = { z: 1, x: 0, y: 0 };
    const transform = (zoom: number) => {
      if (!kanZoome || zoom <= 0) return { z: 1, x: 0, y: 0 };
      const z = Math.exp(Math.log(kamera.z) * zoom);
      // Fokuspunktet glir mot midten mens det forstørres.
      const sx = kamera.fx + (w / 2 - kamera.fx) * zoom;
      const sy = kamera.fy + (h / 2 - kamera.fy) * zoom;
      return { z, x: sx - kamera.fx * z, y: sy - kamera.fy * z };
    };

    const oppsett = () => {
      const tilgjengelig = flateEl.getBoundingClientRect();
      pitch = Math.min(
        16,
        tilgjengelig.width / enheterBredde,
        (tilgjengelig.height - ETIKETT * 2 - RADGAP) / enheterHoyde,
      );
      pitch = Math.max(pitch, 4);
      w = Math.ceil(enheterBredde * pitch);
      h = Math.ceil(enheterHoyde * pitch + ETIKETT * 2 + RADGAP);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      skrift = `500 12px ${getComputedStyle(document.body).fontFamily}`;

      blokkPos = KATALOG.map((_, b) => {
        const c = b % 3;
        const r = Math.floor(b / 3);
        const x = (kolBredde.slice(0, c).reduce((s, v) => s + v, 0) + c * KOLGAP) * pitch;
        const y = r === 0 ? 0 : ETIKETT + radHoyde[0] * pitch + RADGAP;
        return { x, y };
      });
      xs = new Float32Array(PRIKKER.length);
      ys = new Float32Array(PRIKKER.length);
      PRIKKER.forEach((p, i) => {
        xs[i] = blokkPos[p.blokk].x + p.kol * pitch + pitch / 2;
        ys[i] = blokkPos[p.blokk].y + ETIKETT + p.rad * pitch + pitch / 2;
      });

      // Utsnittet det zoomes inn på: faget og tre rader over og under.
      kanZoome = pitch < 10;
      const fag = KATALOG[VALGT_TRINN].fag;
      const radFra = Math.max(0, VALGT_FAG - 3);
      const radTil = Math.min(fag.length - 1, VALGT_FAG + 3);
      const x0 = blokkPos[VALGT_TRINN].x;
      const x1 = x0 + Math.max(...fag.map((f) => f.temaer.length)) * pitch;
      const y0 = blokkPos[VALGT_TRINN].y + ETIKETT + radFra * pitch;
      const y1 = blokkPos[VALGT_TRINN].y + ETIKETT + (radTil + 1) * pitch;
      kamera.z = Math.min(4, (w / (x1 - x0)) * 0.9, (h / (y1 - y0)) * 0.9);
      kamera.fx = (x0 + x1) / 2;
      kamera.fy = (y0 + y1) / 2;

      plasserKort();
      tegn();
    };

    const plasserKort = () => {
      const k = kort.current;
      const i = PRIKKER.findIndex((p) => p.valgt);
      if (!k || i < 0) return;
      const flateBoks = flateEl.getBoundingClientRect();
      const canvasBoks = canvas.getBoundingClientRect();
      const ox = canvasBoks.left - flateBoks.left;
      const oy = canvasBoks.top - flateBoks.top;
      const kw = k.offsetWidth;
      const kh = k.offsetHeight;
      // Kortet vises når kartet er ferdig zoomet, så det plasseres ut fra det.
      const t = transform(til.zoom);
      const px = xs[i] * t.z + t.x;
      const py = ys[i] * t.z + t.y;
      const avstand = pitch * t.z * 1.6;
      let x = ox + px + avstand;
      if (x + kw > flateBoks.width) x = ox + px - avstand - kw;
      x = Math.max(0, Math.min(x, flateBoks.width - kw));
      const y = Math.max(0, Math.min(oy + py - kh / 2, flateBoks.height - kh));
      k.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
    };

    const tegn = () => {
      if (!w) return;
      const p = fremdrift.p;
      const lerp = (a: number, b: number) => a + (b - a) * p;
      const dpr = canvas.width / w;
      const zoom = lerp(fra.zoom, til.zoom);
      Object.assign(vis, transform(zoom));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Etiketter – de tones ut når kartet zoomes inn; bildeteksten under
      // sier da hvilket trinn og fag det er.
      ctx.font = skrift;
      ctx.textBaseline = "alphabetic";
      KATALOG.forEach((t, b) => {
        ctx.globalAlpha = lerp(fra.etiketter[b], til.etiketter[b]) * (kanZoome ? 1 - zoom : 1);
        ctx.fillStyle = `rgb(${PAPIR.join(",")})`;
        ctx.fillText(t.navn, blokkPos[b].x, blokkPos[b].y + 13);
      });

      // Prikkene og gløden tegnes gjennom zoomen.
      ctx.setTransform(dpr * vis.z, 0, 0, dpr * vis.z, dpr * vis.x, dpr * vis.y);

      // Glød rundt det valgte temaet
      const glod = lerp(fra.glod, til.glod);
      const valgt = PRIKKER.findIndex((q) => q.valgt);
      if (glod > 0.01 && valgt >= 0) {
        const r = pitch * 2.6;
        const grad = ctx.createRadialGradient(xs[valgt], ys[valgt], 0, xs[valgt], ys[valgt], r);
        grad.addColorStop(0, `rgba(${GUL.join(",")},${0.35 * glod})`);
        grad.addColorStop(1, `rgba(${GUL.join(",")},0)`);
        ctx.globalAlpha = 1;
        ctx.fillStyle = grad;
        ctx.fillRect(xs[valgt] - r, ys[valgt] - r, r * 2, r * 2);
      }

      for (let i = 0; i < PRIKKER.length; i++) {
        const a = lerp(fra.a[i], til.a[i]);
        const g = lerp(fra.g[i], til.g[i]);
        const s = pitch * 0.68 * lerp(fra.k[i], til.k[i]);
        const r = Math.round(PAPIR[0] + (GUL[0] - PAPIR[0]) * g);
        const gr = Math.round(PAPIR[1] + (GUL[1] - PAPIR[1]) * g);
        const bl = Math.round(PAPIR[2] + (GUL[2] - PAPIR[2]) * g);
        ctx.globalAlpha = a;
        ctx.fillStyle = `rgb(${r},${gr},${bl})`;
        ctx.beginPath();
        ctx.roundRect(xs[i] - s / 2, ys[i] - s / 2, s, s, s * 0.28);
        ctx.fill();
      }

      if (hoverIndeks >= 0) {
        const s = pitch * 0.68 * lerp(fra.k[hoverIndeks], til.k[hoverIndeks]) + 4;
        ctx.globalAlpha = 1;
        ctx.strokeStyle = `rgb(${PAPIR.join(",")})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(xs[hoverIndeks] - s / 2, ys[hoverIndeks] - s / 2, s, s, s * 0.3);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Innzoomet går radene ut over kanten: ton dem ut mot bakgrunnen i
      // stedet for å kutte prikkene.
      if (kanZoome && zoom > 0.01) {
        const kant = Math.min(32, h * 0.12);
        const natt = (a: number) => `rgba(15,16,20,${a})`;
        for (const [y0, y1] of [
          [0, kant],
          [h, h - kant],
        ]) {
          const grad = ctx.createLinearGradient(0, y0, 0, y1);
          grad.addColorStop(0, natt(zoom));
          grad.addColorStop(1, natt(0));
          ctx.fillStyle = grad;
          ctx.fillRect(0, Math.min(y0, y1), w, kant);
        }
      }
    };

    // Gå til et nytt steg fra der animasjonen er nå, også midt i en overgang.
    gaaTil.current = (nytt: number) => {
      if (nytt === steg) return;
      steg = nytt;
      const p = fremdrift.p;
      const blandet = (a: ArrayLike<number>, b: ArrayLike<number>) =>
        Float32Array.from(a, (v, i) => v + (b[i] - v) * p);
      fra = {
        a: blandet(fra.a, til.a),
        g: blandet(fra.g, til.g),
        k: blandet(fra.k, til.k),
        etiketter: Array.from(blandet(fra.etiketter, til.etiketter)),
        glod: fra.glod + (til.glod - fra.glod) * p,
        zoom: fra.zoom + (til.zoom - fra.zoom) * p,
      };
      til = tilstand(nytt);
      plasserKort();
      fremdrift.p = 0;
      gsap.to(fremdrift, {
        p: 1,
        duration: rolig() ? 0 : 0.9,
        ease: "power2.inOut",
        overwrite: true,
        onUpdate: tegn,
      });
    };

    // Hold musa over en prikk for å se hvilket tema det er.
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const b = canvas.getBoundingClientRect();
      // Tilbake fra skjermen til kartet, også når det er zoomet inn.
      const mx = (e.clientX - b.left - vis.x) / vis.z;
      const my = (e.clientY - b.top - vis.y) / vis.z;
      let funnet = -1;
      const halv = pitch / 2;
      for (let i = 0; i < PRIKKER.length; i++) {
        if (Math.abs(xs[i] - mx) <= halv && Math.abs(ys[i] - my) <= halv) {
          funnet = i;
          break;
        }
      }
      if (funnet !== hoverIndeks) {
        hoverIndeks = funnet;
        setHover(funnet >= 0 ? PRIKKER[funnet].sti : null);
        canvas.style.cursor = funnet >= 0 ? "crosshair" : "";
        tegn();
      }
    };
    const onLeave = () => {
      if (hoverIndeks < 0) return;
      hoverIndeks = -1;
      setHover(null);
      tegn();
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    const ro = new ResizeObserver(oppsett);
    ro.observe(flateEl);
    document.fonts?.ready.then(oppsett);

    // Stegene styrer tilstanden mens de passerer midten av skjermen.
    const ctxGsap = gsap.context(() => {
      const elementer = gsap.utils.toArray<HTMLElement>("[data-steg]", rotEl);
      elementer.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 62%",
          end: "bottom 62%",
          onToggle: (st) => st.isActive && setSteg(i + 1),
          onLeaveBack: i === 0 ? () => setSteg(0) : undefined,
        });
      });
    }, rotEl);

    return () => {
      ctxGsap.revert();
      gsap.killTweensOf(fremdrift);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  useEffect(() => {
    gaaTil.current(steg);
  }, [steg]);

  return (
    <div ref={rot} data-klar={klar || undefined} className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-x-16">
      <div className="sticky top-16 lg:top-[12vh] z-10 h-[44svh] lg:h-[76vh] -mx-5 px-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0 bg-natt flex flex-col justify-center py-4 lg:py-0">
        {/* Lerretet står absolutt, så det er flaten som bestemmer størrelsen og ikke omvendt. */}
        <div ref={flate} className="relative flex-1 min-h-0">
          <canvas
            ref={lerret}
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:left-0 lg:translate-x-0"
          />
          <div
            ref={kort}
            aria-hidden="true"
            className={`absolute left-0 top-0 w-[220px] rounded-2xl bg-background text-foreground p-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)] transition-[opacity,visibility,scale] duration-500 ease-out-soft ${
              steg === 4 ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-95 motion-reduce:scale-100"
            }`}
          >
            <div className="text-xs font-medium text-muted">
              {EKSEMPEL.fag} · {EKSEMPEL.trinn}
            </div>
            <div className="mt-0.5 font-display text-lg font-semibold leading-tight">{EKSEMPEL.tema}</div>
            <ul className="mt-3 flex flex-col gap-1 text-sm text-ink-soft tabular-nums">
              <li>{EKSEMPEL.flashcards} flashcards</li>
              <li>{EKSEMPEL.quiz} quizspørsmål</li>
              <li>Miniprøve · {EKSEMPEL.minutter} min</li>
            </ul>
          </div>
        </div>
        <p className="mt-3 h-5 text-sm text-background/70 tabular-nums truncate">
          {hover ?? BILDETEKST[steg]}
        </p>
        <p className="sr-only">
          Grafikk med {TELLING.temaer} prikker, én for hvert tema i Studer, gruppert etter fag og
          trinn.
        </p>
        {/* Stegene ruller inn under kartet på mobil: tone dem ut i stedet for å
            kutte overskriften midt i. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-full h-16 bg-linear-to-b from-natt to-transparent lg:hidden"
        />
      </div>

      <ol className="relative flex flex-col pb-[16svh] lg:pb-[24vh]">
        {STEG.map((s, i) => (
          <li
            key={s.tittel}
            data-steg
            data-aktiv={steg === i + 1 ? "" : undefined}
            className="fs-steg min-h-[56svh] lg:min-h-[64vh] flex flex-col justify-center gap-3 transition-opacity duration-500"
          >
            <span className="text-sm font-medium tabular-nums text-merke">0{i + 1}</span>
            <h3 className="text-4xl sm:text-5xl font-semibold tracking-[-0.02em] leading-[1.02]">
              {s.tittel}
            </h3>
            <p className="text-lg leading-relaxed text-background/70 max-w-[34ch]">{s.tekst}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
