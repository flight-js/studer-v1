// Henter ut formlene i hvert tema til formelmatchen («formler» i temafilen).
//
// KI foreslår formlene, men bare de som står ordrett i temaets eget innhold
// (sammendrag, flashcards, quiz og miniprøve) blir med – ingen nye formler.
// Repetisjonstemaet får formlene fra alle temaene i faget ved importen
// (se scripts/lib/pensum-rader.mjs), så det hoppes over her.
//
//   npm run content:formler -- kjemi-1 fysikk-1   – bare disse fagene
//   npm run content:formler -- --pa-nytt kjemi-1  – lag på nytt også der det finnes
//
// Leser AI_API_KEY (og ev. AI_BASE_URL, AI_MODELL_INNHOLD, AI_RESONNERING_INNHOLD)
// fra .env.local. Etterpå: npm run content:import -- --publiser-utkast <fag …>

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { erSymbolformel, harGeneriskVenstreside, normaliserFormel, somSetning } from "./lib/pensum-rader.mjs";

const ROOT = fileURLToPath(new URL("../content/", import.meta.url));
const ENV = fileURLToPath(new URL("../.env.local", import.meta.url));
const env = existsSync(ENV)
  ? Object.fromEntries(
      readFileSync(ENV, "utf8")
        .split(/\r?\n/)
        .filter((l) => /^[A-Z0-9_]+=/.test(l))
        .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()])
    )
  : {};

const API_NOKKEL = env.AI_API_KEY;
const BASE_URL = (env.AI_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, "");
const MODELL = env.AI_MODELL_INNHOLD || env.AI_MODELL || "gpt-6-luna";
const RESONNERING = env.AI_RESONNERING_INNHOLD || "medium";
const ER_OPENAI = new URL(BASE_URL).hostname.endsWith("openai.com");
// Dollar per million tokens (inn, ut) – oppdater ved modellbytte.
const PRIS = { inn: 0.1, ut: 0.5 };
const MAKS = 12;

if (!API_NOKKEL) {
  console.error("Legg AI_API_KEY=… i .env.local først (filen ignoreres av git).");
  process.exit(1);
}

const args = process.argv.slice(2);
const paNytt = args.includes("--pa-nytt");
const bareFag = args.filter((a) => !a.startsWith("--"));
if (!bareFag.length) {
  console.error("Skriv hvilke fag, for eksempel: npm run content:formler -- kjemi-1");
  process.exit(1);
}

const TRINN = { 8: "8. trinn", 9: "9. trinn", 10: "10. trinn", vg1: "Vg1", vg2: "Vg2", vg3: "Vg3", pabygg: "påbygg" };
const dirs = (p) => readdirSync(p).filter((d) => statSync(join(p, d)).isDirectory());
const lesJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const skrivJson = (p, data) => writeFileSync(p, JSON.stringify(data, null, 2) + "\n");

// Temaene som skal ha formler ------------------------------------------------------

const jobber = [];
for (const trinn of dirs(ROOT)) {
  for (const fag of dirs(join(ROOT, trinn))) {
    const dir = join(ROOT, trinn, fag);
    if (!bareFag.includes(fag) || !existsSync(join(dir, "_fag.json"))) continue;
    const meta = lesJson(join(dir, "_fag.json"));
    for (const fil of readdirSync(dir).filter((f) => /^\d{2}-.+\.json$/.test(f))) {
      const t = lesJson(join(dir, fil));
      if (t.id === "repetisjon" || (!paNytt && t.formler)) continue;
      jobber.push({ sti: join(dir, fil), navn: `${fag}/${t.id}`, fag: meta.name, trinn: TRINN[trinn] ?? trinn });
    }
  }
}
const ukjente = bareFag.filter((f) => !dirs(ROOT).some((tr) => existsSync(join(ROOT, tr, f, "_fag.json"))));
if (ukjente.length) {
  console.error(`Fant ikke faget: ${ukjente.join(", ")}`);
  process.exit(1);
}
console.log(`Modell: ${MODELL} · resonnering: ${ER_OPENAI ? RESONNERING : "–"} · ${jobber.length} temaer`);

// Teksten formlene må stå i --------------------------------------------------------

function kilde(t) {
  const q = (x) => [x.text, ...(x.options ?? []), x.explain].join("\n");
  return [
    t.sammendrag,
    ...t.flashcards.map((c) => `${c.term}: ${c.def}`),
    ...t.quiz.map(q),
    ...(t.miniprove.ekstra ?? []).map(q),
    ...(t.miniprove.skriv ?? []).map((s) => `${s.text}\n${s.fasit}`),
  ].join("\n");
}

function rens(liste, tekst) {
  const kildeNorm = normaliserFormel(tekst);
  const sett = new Set();
  const ut = [];
  const forkastet = [];
  for (const f of liste ?? []) {
    const venstre = f.venstre?.trim();
    const hoyre = f.hoyre?.trim();
    const navn = f.navn && somSetning(f.navn.trim().replace(/\.$/, ""));
    if (!venstre || !hoyre || !navn) continue;
    const formel = `${venstre} = ${hoyre}`;
    const nokkel = normaliserFormel(`${venstre}=${hoyre}`);
    if (venstre.length > 24 || hoyre.length > 48 || navn.length > 60 || /[→⇌=]/.test(venstre + hoyre)) {
      forkastet.push(`${formel} (for lang eller ikke en formel)`);
    } else if (!erSymbolformel({ venstre, hoyre })) {
      forkastet.push(`${formel} (skrevet med ord)`);
    } else if (harGeneriskVenstreside({ venstre })) {
      forkastet.push(`${formel} (bare et funksjonsnavn til venstre)`);
    } else if (!kildeNorm.includes(nokkel)) {
      forkastet.push(`${formel} (står ikke i temaet)`);
    } else if (!sett.has(nokkel)) {
      sett.add(nokkel);
      ut.push({ venstre, hoyre, navn });
    }
  }
  return { formler: ut.slice(0, MAKS), forkastet };
}

const system = (jobb) => `Du hjelper øveappen Studer for norske elever på ${jobb.trinn} i faget ${jobb.fag}. Appen har en formelmatch: eleven ser venstre og høyre side av formlene i et tema som løse brikker, og skal koble sammen sidene som hører til samme formel.

Finn formlene i temaet under som eleven bør kunne utenat eller kjenne igjen:
- Bare formler som står i teksten, skrevet nøyaktig som der: samme symboler, samme rekkefølge og samme tegn (², ·, √, N_A og så videre). Ikke lag nye formler, og ikke skriv om eller snu dem.
- Bare formler skrevet med symboler, ikke med ord. «Utbytte i prosent = faktisk utbytte / teoretisk utbytte · 100 %» og «ΔH = H(produkter) − H(reaktanter)» skal ikke være med.
- En formel har likhetstegn og bokstaver eller symboler på minst én side, for eksempel n = m / M, (xⁿ)′ = n · xⁿ⁻¹ eller sin²v + cos²v = 1. Viktige konstanter teksten oppgir, som N_A = 6,022 · 10²³ mol⁻¹, kan også være med.
- Ikke ta med regneeksempler eller modeller med bestemte tall (som P = 50 + 15x eller B(x) = 5000 · 1,02ˣ), utregninger, reaksjonslikninger, ulikheter eller definisjoner i ord.
- Ikke ta med formler der venstresiden bare er et funksjonsnavn eller y, som f(x) = a · bˣ, N(t) = K / (1 + a · e⁻ᵏᵗ), r(t) = [x(t), y(t)] eller y = k · x. Da sier ikke venstresiden hva formelen er.
- Ikke ta med betingelser som bare sier at noe er null eller likt (f′(x) = 0, u · v = 0, y = L, [A⁻] = [HA]), trinn i bevis, eller programlinjer som v = v + a · dt.
- Står samme formel flere ganger, ta den med én gang. Står den omformet i teksten (som både n = m / M og m = n · M), kan begge være med.
- venstre er det som står før likhetstegnet, hoyre det som står etter. Står det flere likhetstegn etter hverandre, velg den delen som er selve formelen.
- navn: hva formelen er, på norsk, 2–6 ord med stor forbokstav og uten punktum, for eksempel «Stoffmengde fra masse» eller «Derivasjon av potens».
- Høyst ${MAKS} formler, de viktigste først. Har temaet ingen formler, svar med en tom liste.`;

const FORMAT = {
  type: "json_schema",
  json_schema: {
    name: "formler",
    strict: true,
    schema: {
      type: "object",
      properties: {
        formler: {
          type: "array",
          items: {
            type: "object",
            properties: { venstre: { type: "string" }, hoyre: { type: "string" }, navn: { type: "string" } },
            required: ["venstre", "hoyre", "navn"],
            additionalProperties: false,
          },
        },
      },
      required: ["formler"],
      additionalProperties: false,
    },
  },
};

// Kall og lagring ------------------------------------------------------------------

const vent = (ms) => new Promise((r) => setTimeout(r, ms));
const KREDITTFEIL = ["insufficient_quota", "credit_balance_exhausted"];

async function kall(body) {
  for (let forsok = 1; forsok <= 4; forsok++) {
    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${API_NOKKEL}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(180_000),
    });
    const data = await res.json();
    if (res.ok) return data;
    if (KREDITTFEIL.includes(data.error?.code)) throw new Error("tom for kreditt hos OpenAI");
    if (res.status === 429 || res.status >= 500) {
      await vent(5000 * forsok);
      continue;
    }
    throw new Error(`${res.status}: ${JSON.stringify(data.error ?? data).slice(0, 300)}`);
  }
  throw new Error("ga opp etter fire forsøk");
}

// «formler» legges rett etter quizen i temafilen.
function medFormler(t, formler) {
  const ut = {};
  for (const [k, v] of Object.entries(t)) {
    if (k === "formler") continue;
    ut[k] = v;
    if (k === "quiz") ut.formler = formler;
  }
  return ut;
}

async function lag(jobb) {
  const t = lesJson(jobb.sti);
  const tekst = kilde(t);
  const body = {
    model: MODELL,
    messages: [
      { role: "system", content: system(jobb) },
      { role: "user", content: `### ${t.name}\n\n${tekst}` },
    ],
  };
  if (ER_OPENAI) Object.assign(body, { response_format: FORMAT, store: false, reasoning_effort: RESONNERING });
  const data = await kall(body);
  const bruk = data.usage ?? {};
  const kostnad = ((bruk.prompt_tokens ?? 0) * PRIS.inn + (bruk.completion_tokens ?? 0) * PRIS.ut) / 1e6;
  const { formler, forkastet } = rens(JSON.parse(data.choices?.[0]?.message?.content ?? "{}").formler, tekst);
  skrivJson(jobb.sti, medFormler(lesJson(jobb.sti), formler));
  console.log(`✓ ${jobb.navn}: ${formler.length} formler`);
  for (const f of formler) console.log(`    ${f.venstre} = ${f.hoyre}   (${f.navn})`);
  for (const f of forkastet) console.log(`    ✗ ${f}`);
  return kostnad;
}

let kostnad = 0;
const ko = [...jobber];
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (ko.length) {
      const jobb = ko.shift();
      try {
        kostnad += await lag(jobb);
      } catch (e) {
        console.log(`✗ ${jobb.navn}: ${e.message}`);
        if (e.message.includes("kreditt")) ko.length = 0;
      }
    }
  })
);
console.log(`\nFerdig · ${(kostnad * 100).toFixed(2)} cent`);
