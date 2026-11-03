// Merker skriveoppgavene i repetisjonstemaene med temaene de bygger på
// (skriv[].temaer, med slugs), så eleven kan velge temaer i miniprøven.
// Kortene og spørsmålene i repetisjonen er kopier fra temaene, så de spores ved
// importen (scripts/lib/pensum-rader.mjs). Skriveoppgavene er skrevet for
// repetisjonen og går ofte på tvers, så KI velger 1–3 temaer for hver.
//
//   node scripts/innhold/merk-repetisjon-skriv.mjs              – alle fag som mangler merking
//   node scripts/innhold/merk-repetisjon-skriv.mjs kjemi-1      – bare disse fagene
//   node scripts/innhold/merk-repetisjon-skriv.mjs --pa-nytt    – merk på nytt
//
// Leser AI_API_KEY (og ev. AI_BASE_URL, AI_MODELL_INNHOLD) fra .env.local.

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../../content/", import.meta.url));
const ENV = fileURLToPath(new URL("../../.env.local", import.meta.url));
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
const ER_OPENAI = new URL(BASE_URL).hostname.endsWith("openai.com");
const PRIS = { inn: 0.1, ut: 0.5 }; // dollar per million tokens

if (!API_NOKKEL) {
  console.error("Legg AI_API_KEY=… i .env.local først (filen ignoreres av git).");
  process.exit(1);
}

const args = process.argv.slice(2);
const paNytt = args.includes("--pa-nytt");
const bareFag = args.filter((a) => !a.startsWith("--"));
const dirs = (p) => readdirSync(p).filter((d) => statSync(join(p, d)).isDirectory());
const lesJson = (p) => JSON.parse(readFileSync(p, "utf8"));

const jobber = [];
for (const trinn of dirs(ROOT))
  for (const fag of dirs(join(ROOT, trinn))) {
    const dir = join(ROOT, trinn, fag);
    if (!existsSync(join(dir, "_fag.json")) || (bareFag.length && !bareFag.includes(fag))) continue;
    const filer = readdirSync(dir).filter((f) => /^\d{2}-.+\.json$/.test(f));
    const repFil = filer.find((f) => lesJson(join(dir, f)).id === "repetisjon");
    if (!repFil) continue;
    const rep = lesJson(join(dir, repFil));
    if (!rep.miniprove.skriv?.length || (!paNytt && rep.miniprove.skriv.every((s) => s.temaer?.length))) continue;
    const meta = lesJson(join(dir, "_fag.json"));
    const temaer = meta.temaer
      .filter((slug) => slug !== "repetisjon")
      .map((slug) => filer.map((f) => lesJson(join(dir, f))).find((t) => t.id === slug))
      .filter(Boolean);
    jobber.push({ navn: fag, sti: join(dir, repFil), fag: meta.name, temaer });
  }
console.log(`Modell: ${MODELL} · ${jobber.length} fag`);

const FORMAT = {
  type: "json_schema",
  json_schema: {
    name: "merking",
    strict: true,
    schema: {
      type: "object",
      properties: {
        oppgaver: {
          type: "array",
          items: {
            type: "object",
            properties: { id: { type: "string" }, temaer: { type: "array", items: { type: "string" } } },
            required: ["id", "temaer"],
            additionalProperties: false,
          },
        },
      },
      required: ["oppgaver"],
      additionalProperties: false,
    },
  },
};

const vent = (ms) => new Promise((r) => setTimeout(r, ms));

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
    if (["insufficient_quota", "credit_balance_exhausted"].includes(data.error?.code)) throw new Error("tom for kreditt hos OpenAI");
    if (res.status === 429 || res.status >= 500) {
      await vent(5000 * forsok);
      continue;
    }
    throw new Error(`${res.status}: ${JSON.stringify(data.error ?? data).slice(0, 300)}`);
  }
  throw new Error("ga opp etter fire forsøk");
}

async function merk(jobb) {
  const rep = lesJson(jobb.sti);
  const nr = new Map(jobb.temaer.map((t, i) => [`T${i + 1}`, t.id]));
  const system = `Du hjelper øveappen Studer i faget ${jobb.fag}. Repetisjonsprøven har skriveoppgaver som kan gå på tvers av temaene i faget. Eleven skal kunne velge temaer før prøven, så hver oppgave må merkes med temaene den bygger på.

For hver oppgave: velg de 1–3 temaene (T-numrene) eleven må kunne for å svare godt. Ta bare med temaer oppgaven faktisk handler om – det viktigste først. Bruk fasiten til å se hva svaret krever.`;
  const bruker = [
    "Temaene:",
    ...jobb.temaer.map((t, i) => `T${i + 1}: ${t.name} – ${t.intro}`),
    "",
    "Oppgavene:",
    ...rep.miniprove.skriv.map((s) => `${s.id}: ${s.text}\nFasit: ${s.fasit}`),
  ].join("\n");
  const body = {
    model: MODELL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: bruker },
    ],
  };
  if (ER_OPENAI) Object.assign(body, { response_format: FORMAT, store: false, reasoning_effort: "low" });
  const data = await kall(body);
  const bruk = data.usage ?? {};
  const kostnad = ((bruk.prompt_tokens ?? 0) * PRIS.inn + (bruk.completion_tokens ?? 0) * PRIS.ut) / 1e6;
  const svar = new Map(JSON.parse(data.choices?.[0]?.message?.content ?? "{}").oppgaver?.map((o) => [o.id, o.temaer]) ?? []);

  // Leser filen på nytt rett før skriving, og tar bare gyldige T-numre.
  const fersk = lesJson(jobb.sti);
  let merket = 0;
  for (const s of fersk.miniprove.skriv) {
    const temaer = [...new Set((svar.get(s.id) ?? []).map((t) => nr.get(t.trim())).filter(Boolean))].slice(0, 3);
    if (temaer.length) {
      s.temaer = temaer;
      merket++;
    } else delete s.temaer;
  }
  writeFileSync(jobb.sti, JSON.stringify(fersk, null, 2) + "\n");
  console.log(`✓ ${jobb.navn}: ${merket} av ${fersk.miniprove.skriv.length} merket`);
  return kostnad;
}

let kostnad = 0;
const ko = [...jobber];
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (ko.length) {
      const jobb = ko.shift();
      try {
        kostnad += await merk(jobb);
      } catch (e) {
        console.log(`✗ ${jobb.navn}: ${e.message}`);
        if (e.message.includes("kreditt")) ko.length = 0;
      }
    }
  })
);
console.log(`\nFerdig · ${(kostnad * 100).toFixed(2)} cent`);
