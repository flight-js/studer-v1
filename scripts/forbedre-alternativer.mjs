// Skriver feilsvarene i flervalgsspørsmålene på nytt, så det riktige svaret
// ikke avslører seg ved å være lengre, mer detaljert eller det eneste
// troverdige. Det riktige svaret beholder betydningen (det kan kortes ned).
//
// Hvert nye spørsmål blindtestes: en egen kjøring svarer uten å se fasiten.
// Svarer den feil, kan spørsmålet ha blitt tvetydig, og det gamle beholdes.
// Til slutt kopieres de nye alternativene til repetisjonstemaene, som har
// ordrette kopier av spørsmålene fra temaene.
//
//   npm run content:alternativer                     – alle temaer som ikke er gjort
//   npm run content:alternativer -- kjemi-1 norsk-10 – bare disse fagene
//   npm run content:alternativer -- --antall 3       – bare 3 temaer (se på kvaliteten først)
//   npm run content:alternativer -- --pa-nytt        – gjør på nytt også der det er gjort
//
// Leser AI_API_KEY (og ev. AI_BASE_URL, AI_MODELL_INNHOLD) fra .env.local.
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
const ER_OPENAI = new URL(BASE_URL).hostname.endsWith("openai.com");
// Dollar per million tokens (inn, ut) – oppdater ved modellbytte.
const PRIS = { inn: 0.1, ut: 0.5 };
const REPETISJON = "repetisjon";
const BOKSTAVER = ["A", "B", "C", "D"];

if (!API_NOKKEL) {
  console.error("Legg AI_API_KEY=… i .env.local først (filen ignoreres av git).");
  process.exit(1);
}

const args = process.argv.slice(2);
const verdi = (flagg) => (args.includes(flagg) ? Number(args[args.indexOf(flagg) + 1]) : undefined);
const paNytt = args.includes("--pa-nytt");
const utenSynk = args.includes("--uten-synk"); // ikke rør repetisjonstemaene (til testing)
const maks = verdi("--antall") ?? Infinity;
const parallelt = verdi("--parallelt") ?? 6;
const MED_VERDI = ["--antall", "--parallelt"];
const bareFag = args.filter((a, i) => !a.startsWith("--") && !MED_VERDI.includes(args[i - 1]));

const TRINN = { 8: "8. trinn", 9: "9. trinn", 10: "10. trinn", vg1: "Vg1", vg2: "Vg2", vg3: "Vg3" };
const dirs = (p) => readdirSync(p).filter((d) => statSync(join(p, d)).isDirectory());
const lesJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const skrivJson = (p, data) => writeFileSync(p, JSON.stringify(data, null, 2) + "\n");
const flervalg = (t) => [...t.quiz, ...t.miniprove.ekstra].filter((q) => q.type !== "sant-usant" && q.options);

// Alle temafiler -------------------------------------------------------------------

const alle = [];
for (const trinn of dirs(ROOT)) {
  for (const fag of dirs(join(ROOT, trinn))) {
    const dir = join(ROOT, trinn, fag);
    if (!existsSync(join(dir, "_fag.json")) || (bareFag.length && !bareFag.includes(fag))) continue;
    const fagNavn = lesJson(join(dir, "_fag.json")).name;
    for (const fil of readdirSync(dir).filter((f) => /^\d{2}-.+\.json$/.test(f)).sort()) {
      alle.push({ sti: join(dir, fil), dir, navn: `${trinn}/${fag}/${fil}`, fagNavn, trinnNavn: TRINN[trinn] ?? trinn });
    }
  }
}
// Repetisjonstemaene får alternativene fra temaene sine (se synkRepetisjon).
const jobber = alle.filter((j) => {
  const t = lesJson(j.sti);
  return t.id !== REPETISJON && (paNytt || !t.kvalitet.alternativer);
});
const valgte = jobber.slice(0, maks);
console.log(`Modell: ${MODELL} · ${valgte.length} temaer`);

// Instruksjonene ----------------------------------------------------------------------

function lagPrompt(t, jobb) {
  const system = `Du forbedrer flervalgsspørsmål i øveappen Studer, for norske elever på ${jobb.trinnNavn} i faget ${jobb.fagNavn}, temaet «${t.name}».

Problemet: I mange spørsmål er det riktige svaret lengre, mer detaljert og mer nyansert enn feilsvarene, og feilsvarene er ofte tullesvar. Da kan eleven gjette riktig uten å kunne stoffet.

For hvert spørsmål skal du skrive tre nye feilsvar, og ved behov korte ned det riktige svaret, slik at alle fire alternativene:
- er omtrent like lange (samme antall ord, ±30 %) og like konkrete og detaljerte
- har samme form, for eksempel alle som en hel setning, alle som et substantiv, eller alle som et tall med samme enhet
- virker troverdige for en elev som ikke kan stoffet godt

Feilsvarene skal:
- være vanlige misforståelser, forvekslinger med beslektede begreper fra temaet, eller påstander som er nesten riktige, men har én tydelig feil
- være entydig feil for en som kan stoffet – aldri delvis riktige, diskutable eller riktige på en annen måte
- bruke begreper og ord eleven på trinnet kjenner fra temaet, ikke mer avanserte begreper enn det riktige svaret
- ikke være tullesvar, vitser, overdrivelser eller absolutter som «alltid», «aldri», «bare» eller «ingen»
- ikke være «Alle svarene over» eller «Ingen av dem»
- når svaret er et tall, et årstall, et navn eller et kort begrep: være andre tall, årstall, navn eller begreper av samme type fra samme område

Det riktige svaret:
- skal bety det samme som før, og fortsatt være helt riktig. Du kan korte det ned eller omformulere det, men ikke endre innholdet.
- skal ikke skille seg ut ved å gjenta ord fra spørsmålet som feilsvarene ikke har, eller ved å være mer forsiktig formulert («ofte», «kan»).

forklaring: Returner forklaringen uendret, med mindre den nevner de gamle feilsvarene. Da justerer du den så den passer.

Ikke endre spørsmålsteksten. Skriv på samme språk og målform som spørsmålet.`;

  const bruker = flervalg(t)
    .map(
      (q) =>
        `${q.id}. ${q.text}\nRiktig svar: ${q.options[q.correct]}\nGamle feilsvar: ${q.options
          .filter((_, i) => i !== q.correct)
          .join(" | ")}\nForklaring: ${q.explain}`
    )
    .join("\n\n");
  return { system, bruker: `${bruker}\n\nGjør dette for alle ${flervalg(t).length} spørsmålene.` };
}

const FORMAT = {
  type: "json_schema",
  json_schema: {
    name: "alternativer",
    strict: true,
    schema: {
      type: "object",
      properties: {
        sporsmal: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              riktig: { type: "string" },
              feil: { type: "array", items: { type: "string" } },
              forklaring: { type: "string" },
            },
            required: ["id", "riktig", "feil", "forklaring"],
            additionalProperties: false,
          },
        },
      },
      required: ["sporsmal"],
      additionalProperties: false,
    },
  },
};

const FORMAT_BLIND = {
  type: "json_schema",
  json_schema: {
    name: "svar",
    strict: true,
    schema: {
      type: "object",
      properties: {
        svar: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              bokstav: { type: "string", enum: BOKSTAVER },
              tvetydig: { type: "boolean" },
            },
            required: ["id", "bokstav", "tvetydig"],
            additionalProperties: false,
          },
        },
      },
      required: ["svar"],
      additionalProperties: false,
    },
  },
};

// Kall og kontroll -------------------------------------------------------------------

const vent = (ms) => new Promise((r) => setTimeout(r, ms));

function ventetid(headers) {
  const sek = Number(headers.get("retry-after"));
  if (sek > 0) return sek * 1000;
  const m = (headers.get("x-ratelimit-reset-tokens") ?? "").match(/^(?:(\d+)m)?(?:([\d.]+)s)?(?:(\d+)ms)?$/);
  if (m && m[0]) return (Number(m[1] ?? 0) * 60 + Number(m[2] ?? 0)) * 1000 + Number(m[3] ?? 0);
  return 20_000;
}

async function kall(jobb, body) {
  let ventet = 0;
  for (let forsok = 1; forsok <= 3; forsok++) {
    try {
      const res = await fetch(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${API_NOKKEL}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(300_000),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429 && ventet < 10) {
          ventet++;
          forsok--;
          await vent(ventetid(res.headers) + Math.random() * 3000);
          continue;
        }
        if (res.status === 429 || res.status >= 500) {
          await vent(5000 * forsok);
          continue;
        }
        throw new Error(`${res.status}: ${JSON.stringify(data.error ?? data).slice(0, 300)}`);
      }
      const bruk = data.usage ?? {};
      const kostnad = ((bruk.prompt_tokens ?? 0) * PRIS.inn + (bruk.completion_tokens ?? 0) * PRIS.ut) / 1e6;
      return { svar: JSON.parse(data.choices?.[0]?.message?.content ?? "{}"), kostnad };
    } catch (e) {
      if (forsok === 3) throw e;
      await vent(3000 * forsok);
    }
  }
  throw new Error(`${jobb.navn}: ga opp etter tre forsøk`);
}

// Er alternativene jevne nok? Det riktige svaret skal ikke være klart lengst,
// og ingen skal være mye lengre enn de andre (korte svar som tall får slakk).
function jevne(alternativer, riktig) {
  const lengder = alternativer.map((a) => a.length);
  const andre = lengder.filter((_, i) => i !== riktig);
  const lengst = Math.max(...lengder);
  const kortest = Math.min(...lengder);
  const riktigLengst = lengder[riktig] > 1.25 * Math.max(...andre) && lengder[riktig] - Math.max(...andre) > 8;
  const sprik = lengst > 2 * kortest && lengst - kortest > 15;
  return !riktigLengst && !sprik;
}

// Nye alternativer for ett spørsmål, med det riktige på samme plass som før.
function bygg(q, ny) {
  const feil = (ny.feil ?? []).map((f) => f.trim()).filter(Boolean);
  const riktig = ny.riktig?.trim();
  if (!riktig || feil.length !== 3) return null;
  const alternativer = [...feil];
  alternativer.splice(q.correct, 0, riktig);
  if (new Set(alternativer.map((a) => a.toLowerCase())).size !== 4) return null;
  if (/^(alle|ingen) (av )?(svarene|dem|disse|alternativene)/i.test(alternativer.join("\n"))) return null;
  if (alternativer.some((a) => a.length > 220)) return null;
  return { ...q, options: alternativer, explain: ny.forklaring?.trim() || q.explain };
}

// Blindtest: modellen svarer uten fasit. Alternativene stokkes, så plassen
// ikke avslører noe. Gir id-ene som ble besvart riktig.
async function blindtest(jobb, t, kandidater) {
  const stokket = kandidater.map((q) => {
    const rekkefolge = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
    return { q, rekkefolge, riktigBokstav: BOKSTAVER[rekkefolge.indexOf(q.correct)] };
  });
  const body = {
    model: MODELL,
    messages: [
      {
        role: "system",
        content: `Du er en flink elev på ${jobb.trinnNavn} i ${jobb.fagNavn}. Svar på hvert flervalgsspørsmål med bokstaven til det ene riktige svaret. Sett tvetydig til true hvis mer enn ett alternativ kan forsvares som riktig, eller hvis ingen av dem er helt riktige.`,
      },
      {
        role: "user",
        content: stokket
          .map(({ q, rekkefolge }) => `${q.id}. ${q.text}\n${rekkefolge.map((i, j) => `${BOKSTAVER[j]}) ${q.options[i]}`).join("\n")}`)
          .join("\n\n"),
      },
    ],
  };
  if (ER_OPENAI) Object.assign(body, { response_format: FORMAT_BLIND, store: false, reasoning_effort: "medium" });
  const { svar, kostnad } = await kall(jobb, body);
  const gitt = new Map((svar.svar ?? []).map((s) => [s.id, s]));
  const bestatt = new Set(
    stokket
      .filter((s) => {
        const g = gitt.get(s.q.id);
        return g && g.bokstav === s.riktigBokstav && !g.tvetydig;
      })
      .map((s) => s.q.id)
  );
  return { bestatt, kostnad };
}

async function forbedre(jobb) {
  const start = Date.now();
  const t = lesJson(jobb.sti);
  const sporsmal = flervalg(t);
  let kostnad = 0;
  const nye = new Map();

  if (sporsmal.length) {
    const { system, bruker } = lagPrompt(t, jobb);
    const body = {
      model: MODELL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: bruker },
      ],
    };
    if (ER_OPENAI) Object.assign(body, { response_format: FORMAT, store: false, reasoning_effort: "medium" });
    const forslag = await kall(jobb, body);
    kostnad += forslag.kostnad;
    for (const ny of forslag.svar.sporsmal ?? []) {
      const q = sporsmal.find((s) => s.id === ny.id);
      const bygget = q && bygg(q, ny);
      if (bygget) nye.set(q.id, bygget);
    }
  }

  // Blindtest de nye. Bare de som besto, tas i bruk.
  const kandidater = [...nye.values()];
  const test = kandidater.length ? await blindtest(jobb, t, kandidater) : { bestatt: new Set(), kostnad: 0 };
  kostnad += test.kostnad;

  // Leser filen på nytt rett før skriving, i tilfelle den er endret imens.
  const fersk = lesJson(jobb.sti);
  let byttet = 0;
  let jevneFor = 0;
  let jevneEtter = 0;
  const oppdater = (q) => {
    const ny = nye.get(q.id);
    if (q.type !== "sant-usant" && q.options) jevneFor += jevne(q.options, q.correct) ? 1 : 0;
    if (!ny || !test.bestatt.has(q.id)) {
      if (q.type !== "sant-usant" && q.options) jevneEtter += jevne(q.options, q.correct) ? 1 : 0;
      return q;
    }
    byttet++;
    jevneEtter += jevne(ny.options, ny.correct) ? 1 : 0;
    return { ...q, options: ny.options, explain: ny.explain };
  };
  fersk.quiz = fersk.quiz.map(oppdater);
  fersk.miniprove.ekstra = fersk.miniprove.ekstra.map(oppdater);
  fersk.kvalitet.alternativer = new Date().toISOString().slice(0, 10);
  skrivJson(jobb.sti, fersk);

  const avvist = kandidater.length - test.bestatt.size;
  console.log(
    `✓ ${jobb.navn} · ${byttet} av ${sporsmal.length} forbedret` +
      (avvist ? ` (${avvist} besto ikke blindtesten)` : "") +
      ` · jevne ${jevneFor} → ${jevneEtter} · ${((Date.now() - start) / 1000).toFixed(1)} s · ${(kostnad * 100).toFixed(2)} cent`
  );
  return kostnad;
}

// Repetisjonstemaene har ordrette kopier av spørsmålene fra temaene. De får de
// samme nye alternativene, funnet på spørsmålsteksten.
function synkRepetisjon() {
  const fagDirs = [...new Set(alle.map((j) => j.dir))];
  let oppdatert = 0;
  for (const dir of fagDirs) {
    const filer = alle.filter((j) => j.dir === dir);
    const rep = filer.find((j) => lesJson(j.sti).id === REPETISJON);
    if (!rep) continue;
    const kilde = new Map();
    for (const j of filer) {
      const t = lesJson(j.sti);
      if (t.id === REPETISJON) continue;
      for (const q of [...t.quiz, ...t.miniprove.ekstra]) kilde.set(q.text.trim(), q);
    }
    const t = lesJson(rep.sti);
    const synk = (q) => {
      const k = kilde.get(q.text.trim());
      if (!k || q.type === "sant-usant") return q;
      // Samme spørsmål, men det riktige svaret kan stå på en annen plass.
      if (k.options[k.correct] === q.options[q.correct] && k.options.join() === q.options.join()) return q;
      oppdatert++;
      return { ...q, options: k.options, correct: k.correct, explain: k.explain };
    };
    t.quiz = t.quiz.map(synk);
    t.miniprove.ekstra = t.miniprove.ekstra.map(synk);
    t.kvalitet.alternativer = new Date().toISOString().slice(0, 10);
    skrivJson(rep.sti, t);
  }
  console.log(`Repetisjonstemaene: ${oppdatert} spørsmål oppdatert fra temaene`);
}

let sum = 0;
let ferdig = 0;
const feil = [];
let neste = 0;
async function arbeider() {
  while (neste < valgte.length) {
    const jobb = valgte[neste++];
    try {
      const kostnad = await forbedre(jobb);
      sum += kostnad; // ikke «sum += await …»: da overskriver arbeiderne hverandres sum
      ferdig++;
    } catch (e) {
      feil.push(jobb.navn);
      console.log(`✗ ${jobb.navn}: ${e.message}`);
    }
  }
}
await Promise.all(Array.from({ length: Math.min(parallelt, valgte.length) }, arbeider));
if (!utenSynk) synkRepetisjon();

console.log(`\nFerdig: ${ferdig} av ${valgte.length} temaer · ${(sum * 100).toFixed(1)} cent totalt`);
if (feil.length) {
  console.log(`Feilet (kjør skriptet igjen for å prøve på nytt):\n  ${feil.join("\n  ")}`);
  process.exitCode = 1;
}
