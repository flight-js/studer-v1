// Lager skriveoppgaver med fasit og kriterier til miniprøven, ut fra hvert
// temas sammendrag og begreper, og skriver dem inn i innholdsfilene
// (miniprove.skriv). Temaer som allerede har oppgaver, hoppes over, så skriptet
// kan trygt kjøres om igjen hvis det stopper.
//
//   npm run content:skriv                     – alle temaer som mangler oppgaver
//   npm run content:skriv -- kjemi-1 norsk-10 – bare disse fagene
//   npm run content:skriv -- --antall 3       – bare 3 temaer (se på kvaliteten først)
//   npm run content:skriv -- --pa-nytt        – lag nye også der det finnes oppgaver
//
// Leser AI_API_KEY (og ev. AI_BASE_URL, AI_MODELL_INNHOLD, AI_RESONNERING_INNHOLD)
// fra .env.local. Bare innholdet i temaene sendes til leverandøren.
// Etterpå: npm run content:import -- --publiser-utkast

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

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
const ANTALL_OPPGAVER = 8;

if (!API_NOKKEL) {
  console.error("Legg AI_API_KEY=… i .env.local først (filen ignoreres av git).");
  process.exit(1);
}

const args = process.argv.slice(2);
const verdi = (flagg) => (args.includes(flagg) ? Number(args[args.indexOf(flagg) + 1]) : undefined);
const paNytt = args.includes("--pa-nytt");
const maks = verdi("--antall") ?? Infinity;
const parallelt = verdi("--parallelt") ?? 6;
const MED_VERDI = ["--antall", "--parallelt"];
const bareFag = args.filter((a, i) => !a.startsWith("--") && !MED_VERDI.includes(args[i - 1]));

const TRINN = { 8: "8. trinn", 9: "9. trinn", 10: "10. trinn", vg1: "Vg1", vg2: "Vg2", vg3: "Vg3" };
const dirs = (p) => readdirSync(p).filter((d) => statSync(join(p, d)).isDirectory());
const lesJson = (p) => JSON.parse(readFileSync(p, "utf8"));

// Alle temafiler som skal ha oppgaver ------------------------------------------------

const jobber = [];
for (const trinn of dirs(ROOT)) {
  for (const fag of dirs(join(ROOT, trinn))) {
    const fagFil = join(ROOT, trinn, fag, "_fag.json");
    if (!existsSync(fagFil) || (bareFag.length && !bareFag.includes(fag))) continue;
    const fagNavn = lesJson(fagFil).name;
    for (const fil of readdirSync(join(ROOT, trinn, fag)).filter((f) => /^\d{2}-.+\.json$/.test(f)).sort()) {
      const sti = join(ROOT, trinn, fag, fil);
      if (!paNytt && lesJson(sti).miniprove?.skriv?.length) continue;
      jobber.push({ sti, navn: `${trinn}/${fag}/${fil}`, fagNavn, trinnNavn: TRINN[trinn] ?? trinn });
    }
  }
}
const valgte = jobber.slice(0, maks);
console.log(`Modell: ${MODELL} · resonnering: ${ER_OPENAI ? RESONNERING : "–"} · ${valgte.length} temaer`);

// Instruksjonene ----------------------------------------------------------------------

function lagPrompt(t, fagNavn, trinnNavn) {
  const system = `Du lager skriveoppgaver til en miniprøve i appen Studer, for norske elever på ${trinnNavn} i faget ${fagNavn}, temaet «${t.name}».

Lag ${ANTALL_OPPGAVER} oppgaver der eleven skriver svaret selv, med 1–4 setninger, på 2–3 minutter. En språkmodell retter svarene etterpå ut fra fasiten og kriteriene dine, og gir 0, ½ eller 1 poeng.

Krav:
- Bygg bare på fakta i sammendraget og begrepene under. Ikke finn på tall, årstall, navn, sitater eller påstander som ikke står der.
- Varier typen: forklar et begrep med egne ord, forklar en årsak eller sammenheng (hvorfor/hvordan), sammenlign to ting, gi et eksempel og begrunn det, bruk kunnskapen på en konkret situasjon. I matematikk og realfag: minst to korte regneoppgaver som kan løses uten kalkulator, der fasiten viser svaret og det viktigste steget.
- Hver oppgave skal ha et tydelig svar som kan vurderes. Ikke ja/nei-spørsmål, ikke flervalg, ikke meningsspørsmål uten fasit, ikke «skriv en tekst om …».
- Hver oppgave må kunne forstås alene. Eleven ser ikke sammendraget under prøven, så ikke vis til «sammendraget», «teksten», «eksemplene» eller annet eleven ikke har foran seg – ta med det eleven trenger i selve oppgaven.
- Ikke skriv hvor langt svaret skal være («Svar med 1–4 setninger») – det står i appen.
- Ikke spør om det samme to ganger, og ikke kopier quizspørsmålene under.
- Nivået skal passe ${trinnNavn}. Skriv enkelt og presist.
- fasit: et fullgodt svar på elevens nivå, 1–3 setninger.
- kriterier: 1–3 korte punkter som må være med for fullt poeng. Beskriv det vesentlige faglige innholdet, ikke bestemte ord og ikke noe så enkelt at nesten alle svar får det med (som «nevner at det handler om tid»). Et svar som får med noe av det, gir halvt poeng.
- Skriv på samme språk og målform som sammendraget. I språkfag (engelsk, tysk, fransk, spansk …) kan oppgaven stå på målspråket når quizspørsmålene gjør det – da svarer eleven på målspråket.`;

  const begreper = t.flashcards.map((f) => `- ${f.term}: ${f.def}`).join("\n");
  const quiz = t.quiz.map((q) => `- ${q.text}`).join("\n");
  const bruker = `Sammendrag:\n${t.sammendrag}\n\nBegreper:\n${begreper}\n\nQuizspørsmål som allerede finnes (ikke gjenta dem):\n${quiz}`;
  return { system, bruker };
}

const FORMAT = {
  type: "json_schema",
  json_schema: {
    name: "skriveoppgaver",
    strict: true,
    schema: {
      type: "object",
      properties: {
        oppgaver: {
          type: "array",
          items: {
            type: "object",
            properties: {
              text: { type: "string" },
              fasit: { type: "string" },
              kriterier: { type: "array", items: { type: "string" } },
            },
            required: ["text", "fasit", "kriterier"],
            additionalProperties: false,
          },
        },
      },
      required: ["oppgaver"],
      additionalProperties: false,
    },
  },
};

// Kall og kontroll -------------------------------------------------------------------

const vent = (ms) => new Promise((r) => setTimeout(r, ms));

function kontroller(oppgaver) {
  if (!Array.isArray(oppgaver) || oppgaver.length < 6) return null;
  const ut = [];
  const sett = new Set();
  for (const o of oppgaver) {
    const text = o.text?.trim();
    const fasit = o.fasit?.trim();
    const kriterier = (o.kriterier ?? []).map((k) => k.trim()).filter(Boolean).slice(0, 3);
    if (!text || !fasit || !kriterier.length || text.length > 400 || fasit.length > 800) continue;
    if (sett.has(text.toLowerCase())) continue;
    sett.add(text.toLowerCase());
    ut.push({ text, fasit, kriterier });
  }
  return ut.length >= 6 ? ut.slice(0, ANTALL_OPPGAVER) : null;
}

async function lag(jobb) {
  const t = lesJson(jobb.sti);
  const { system, bruker } = lagPrompt(t, jobb.fagNavn, jobb.trinnNavn);
  const body = {
    model: MODELL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: bruker },
    ],
  };
  if (ER_OPENAI) Object.assign(body, { response_format: FORMAT, store: false, reasoning_effort: RESONNERING });

  for (let forsok = 1; forsok <= 3; forsok++) {
    const start = Date.now();
    try {
      const res = await fetch(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${API_NOKKEL}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(180_000),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429 || res.status >= 500) {
          await vent(5000 * forsok);
          continue;
        }
        throw new Error(`${res.status}: ${JSON.stringify(data.error ?? data).slice(0, 300)}`);
      }
      const bruk = data.usage ?? {};
      const kostnad = ((bruk.prompt_tokens ?? 0) * PRIS.inn + (bruk.completion_tokens ?? 0) * PRIS.ut) / 1e6;
      const oppgaver = kontroller(JSON.parse(data.choices?.[0]?.message?.content ?? "{}").oppgaver);
      if (!oppgaver) {
        console.log(`  … ${jobb.navn}: ugyldig svar, prøver igjen`);
        continue;
      }
      // Leser filen på nytt rett før skriving, i tilfelle den er endret imens.
      const fersk = lesJson(jobb.sti);
      fersk.miniprove.skriv = oppgaver.map((o, i) => ({ id: `s${String(i + 1).padStart(2, "0")}`, ...o }));
      writeFileSync(jobb.sti, JSON.stringify(fersk, null, 2) + "\n");
      console.log(`✓ ${jobb.navn} · ${oppgaver.length} oppgaver · ${((Date.now() - start) / 1000).toFixed(1)} s · ${(kostnad * 100).toFixed(2)} cent`);
      return kostnad;
    } catch (e) {
      if (forsok === 3) throw e;
      await vent(3000 * forsok);
    }
  }
  throw new Error("ga opp etter tre forsøk");
}

let sum = 0;
let ferdig = 0;
const feil = [];
let neste = 0;
async function arbeider() {
  while (neste < valgte.length) {
    const jobb = valgte[neste++];
    try {
      sum += await lag(jobb);
      ferdig++;
    } catch (e) {
      feil.push(jobb.navn);
      console.log(`✗ ${jobb.navn}: ${e.message}`);
    }
  }
}
await Promise.all(Array.from({ length: Math.min(parallelt, valgte.length) }, arbeider));

console.log(`\nFerdig: ${ferdig} av ${valgte.length} temaer · ${(sum * 100).toFixed(1)} cent totalt`);
if (feil.length) {
  console.log(`Feilet (kjør skriptet igjen for å prøve på nytt):\n  ${feil.join("\n  ")}`);
  process.exit(1);
}
