// Validerer alt studieinnhold i content/ og skriver en gjennomgangsrapport.
//
//   npm run content:check            – valider, skriv rapport
//   npm run content:check -- vg2     – bare ett trinn (eller vg2/kjemi1 for ett fag)
//
// Avslutter med kode 1 hvis noe bryter kravene, slik at feil stopper en build.

import { readFileSync, readdirSync, existsSync, writeFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../content/", import.meta.url));
const REPORT = join(ROOT, "GJENNOMGANG.md");
const filter = process.argv[2] ?? "";

const LIMITS = {
  sammendragOrd: [300, 600],
  flashcards: [15, 25],
  quiz: [10, 15],
  miniprove: [15, 20],
  mindmapGreiner: 3,
};

const errors = [];
const warnings = [];
const report = [];
let temaCount = 0;

const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);
const words = (s) =>
  s.replace(/[#*_`>-]/g, " ").split(/\s+/).filter(Boolean).length;
const readJson = (file) => {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    err(relative(ROOT, file), `ugyldig JSON (${e.message})`);
    return null;
  }
};
const dirs = (p) =>
  existsSync(p) ? readdirSync(p).filter((d) => statSync(join(p, d)).isDirectory()) : [];
const inRange = (n, [min, max]) => n >= min && n <= max;
const nonEmpty = (s) => typeof s === "string" && s.trim().length > 0;

function checkQuestion(where, q, { needsId = true } = {}) {
  if (needsId && !nonEmpty(q.id)) err(where, "spørsmål mangler id");
  if (!nonEmpty(q.text)) err(where, `${q.id}: mangler tekst`);
  if (!nonEmpty(q.explain)) err(where, `${q.id}: mangler forklaring`);
  if (/^riktig\b/i.test(q.explain ?? "")) err(where, `${q.id}: forklaringen skal ikke starte med «Riktig»`);
  if (q.type === "sant-usant") {
    if (typeof q.correct !== "boolean") err(where, `${q.id}: sant-usant må ha correct: true/false`);
    return;
  }
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    err(where, `${q.id}: må ha nøyaktig 4 svaralternativer`);
    return;
  }
  // Store og små bokstaver skilles: «CO» og «Co» er ulike svar.
  if (new Set(q.options.map((o) => o.trim())).size !== 4)
    err(where, `${q.id}: to svaralternativer er like`);
  if (q.options.some((o) => !nonEmpty(o))) err(where, `${q.id}: tomt svaralternativ`);
  if (!Number.isInteger(q.correct) || q.correct < 0 || q.correct > 3)
    err(where, `${q.id}: correct må være 0–3`);
}

function countNodes(node, depth = 0) {
  if (!node || !nonEmpty(node.label)) return { n: 0, depth };
  const kids = node.children ?? [];
  let n = 1;
  let max = depth;
  for (const c of kids) {
    const r = countNodes(c, depth + 1);
    n += r.n;
    max = Math.max(max, r.depth);
  }
  return { n, depth: max };
}

function checkTema(file, tema, fag) {
  const where = relative(ROOT, file).replace(/\\/g, "/");
  temaCount++;
  for (const key of ["id", "fagId", "trinnId", "name", "intro", "sammendrag"])
    if (!nonEmpty(tema[key])) err(where, `mangler «${key}»`);
  if (tema.fagId !== fag.id) err(where, `fagId «${tema.fagId}» ≠ «${fag.id}»`);
  if (tema.trinnId !== fag.trinnId) err(where, `trinnId «${tema.trinnId}» ≠ «${fag.trinnId}»`);

  const kmNr = new Set(fag.lareplan.kompetansemaal.map((k) => k.nr));
  for (const k of fag.lareplan.kompetansemaal)
    if (!nonEmpty(k.tekst)) warn(where, `kompetansemål ${k.nr} mangler tekst fra læreplanen`);
  if (!Array.isArray(tema.kompetansemaal) || tema.kompetansemaal.length === 0)
    err(where, "mangler kompetansemål");
  else for (const nr of tema.kompetansemaal) if (!kmNr.has(nr)) err(where, `ukjent kompetansemål ${nr}`);

  const ord = words(tema.sammendrag ?? "");
  if (!inRange(ord, LIMITS.sammendragOrd)) err(where, `sammendraget har ${ord} ord (krav ${LIMITS.sammendragOrd.join("–")})`);

  const cards = tema.flashcards ?? [];
  if (!inRange(cards.length, LIMITS.flashcards)) err(where, `${cards.length} flashcards (krav ${LIMITS.flashcards.join("–")})`);
  const terms = new Set();
  for (const c of cards) {
    if (!nonEmpty(c.term) || !nonEmpty(c.def)) err(where, `flashcard mangler begrep eller definisjon`);
    const k = c.term?.trim().toLowerCase();
    if (terms.has(k)) err(where, `flashcard «${c.term}» finnes to ganger`);
    terms.add(k);
  }

  const quiz = tema.quiz ?? [];
  if (!inRange(quiz.length, LIMITS.quiz)) err(where, `${quiz.length} quizspørsmål (krav ${LIMITS.quiz.join("–")})`);
  const ids = new Set();
  const texts = new Set();
  for (const q of quiz) {
    checkQuestion(where, q);
    if (ids.has(q.id)) err(where, `quiz-id «${q.id}» finnes to ganger`);
    ids.add(q.id);
    texts.add(q.text?.trim().toLowerCase());
  }
  // Riktig svar bør ikke nesten alltid stå på samme plass.
  if (quiz.length >= 8) {
    const pos = [0, 0, 0, 0];
    quiz.forEach((q) => pos[q.correct]++);
    if (Math.max(...pos) / quiz.length > 0.45)
      warn(where, `riktig svar står skjevt fordelt på plass A–D: ${pos.join("/")}`);
  }

  const mp = tema.miniprove;
  let mpTotal = 0;
  if (!mp) err(where, "mangler miniprøve");
  else {
    if (!(mp.minutter > 0)) err(where, "miniprøven mangler minutter");
    const refs = mp.quizRefs ?? [];
    for (const r of refs) if (!ids.has(r)) err(where, `miniprøven viser til ukjent quiz-id «${r}»`);
    if (new Set(refs).size !== refs.length) err(where, "miniprøven viser til samme quizspørsmål to ganger");
    for (const q of mp.ekstra ?? []) {
      if (q.type !== "flervalg" && q.type !== "sant-usant") err(where, `${q.id}: ukjent type «${q.type}»`);
      checkQuestion(where, q);
      if (ids.has(q.id)) err(where, `id «${q.id}» brukes både i quiz og miniprøve`);
      ids.add(q.id);
      if (texts.has(q.text?.trim().toLowerCase())) warn(where, `${q.id}: samme tekst som et quizspørsmål`);
    }
    mpTotal = refs.length + (mp.ekstra?.length ?? 0);
    if (!inRange(mpTotal, LIMITS.miniprove)) err(where, `miniprøven har ${mpTotal} spørsmål (krav ${LIMITS.miniprove.join("–")})`);
  }

  const mm = countNodes(tema.mindmap);
  if ((tema.mindmap?.children?.length ?? 0) < LIMITS.mindmapGreiner)
    err(where, `tankekartet har under ${LIMITS.mindmapGreiner} greiner`);
  if (mm.depth < 2) err(where, "tankekartet må ha minst to nivåer under roten");

  const kv = tema.kvalitet;
  if (!kv || !["utkast", "sjekkes", "godkjent"].includes(kv.status)) err(where, "ugyldig kvalitet.status");
  else if (kv.status === "sjekkes" && !(kv.merknader?.length > 0))
    err(where, "status «sjekkes» krever minst én merknad");

  return {
    tema,
    stats: `${ord} ord · ${cards.length} kort · ${quiz.length} quiz · ${mpTotal} i miniprøve · ${mm.n} noder i tankekart`,
  };
}

// katalog.json: alle trinn og fag. Hver fagmappe må finnes der.
const katalog = readJson(join(ROOT, "katalog.json")) ?? { trinn: [] };
const katalogFag = new Map();
for (const t of katalog.trinn)
  for (const fg of t.fag) {
    if (katalogFag.has(fg.id)) err("katalog.json", `fag-id «${fg.id}» finnes to ganger`);
    katalogFag.set(fg.id, { trinn: t.id, navn: fg.navn });
  }

for (const trinn of dirs(ROOT)) {
  for (const fagDir of dirs(join(ROOT, trinn))) {
    const key = `${trinn}/${fagDir}`;
    if (filter && !key.startsWith(filter)) continue;
    const dir = join(ROOT, trinn, fagDir);
    const fagFile = join(dir, "_fag.json");
    if (!existsSync(fagFile)) {
      err(key, "mangler _fag.json");
      continue;
    }
    const fag = readJson(fagFile);
    if (!fag) continue;
    if (fag.id !== fagDir) err(key, `mappenavn ≠ fag.id «${fag.id}»`);
    if (fag.trinnId !== trinn) err(key, `mappe-trinn ≠ trinnId «${fag.trinnId}»`);
    const iKatalog = katalogFag.get(fag.id);
    if (!iKatalog) err(key, "faget finnes ikke i katalog.json");
    else {
      if (iKatalog.trinn !== trinn) err(key, `katalog.json har faget på trinn «${iKatalog.trinn}»`);
      if (iKatalog.navn !== fag.name) err(key, `navnet «${fag.name}» ≠ «${iKatalog.navn}» i katalog.json`);
    }

    const files = readdirSync(dir).filter((f) => /^\d{2}-.+\.json$/.test(f)).sort();
    const byId = new Map();
    for (const f of files) {
      const tema = readJson(join(dir, f));
      if (!tema) continue;
      const expected = f.replace(/^\d{2}-/, "").replace(/\.json$/, "");
      if (tema.id !== expected) err(`${key}/${f}`, `id «${tema.id}» stemmer ikke med filnavnet`);
      byId.set(tema.id, checkTema(join(dir, f), tema, fag));
    }

    const done = fag.temaer.filter((id) => byId.has(id)).length;
    report.push(`## ${fag.name} (${trinn}) – ${done} av ${fag.temaer.length} temaer ferdig\n`);
    report.push(`Læreplan: [${fag.lareplan.kode}](${fag.lareplan.url})\n`);
    for (const id of fag.temaer) {
      const r = byId.get(id);
      if (!r) {
        report.push(`- ⬜ **${id}** – ikke skrevet ennå`);
        continue;
      }
      const { tema, stats } = r;
      const icon = { utkast: "🟡", sjekkes: "🔴", godkjent: "🟢" }[tema.kvalitet?.status] ?? "❔";
      report.push(`- ${icon} **${tema.name}** – ${tema.kvalitet?.status} (${stats})`);
      for (const m of tema.kvalitet?.merknader ?? []) report.push(`  - Sjekk: ${m}`);
    }
    for (const id of byId.keys()) if (!fag.temaer.includes(id)) err(key, `temaet «${id}» mangler i _fag.json`);
    report.push("");
  }
}

const header = [
  "# Gjennomgang av studieinnhold",
  "",
  "Generert av `npm run content:check`. Ikke rediger for hånd.",
  "",
  "🟡 utkast – ikke gjennomgått av et menneske · 🔴 sjekkes – har påstander som må dobbeltsjekkes · 🟢 godkjent",
  "",
  "Alt innhold er skrevet med egne ord ut fra LK20-læreplanene. Før publisering bør en lærer lese gjennom hvert tema og sette status til «godkjent».",
  "",
];
if (!filter) writeFileSync(REPORT, header.concat(report).join("\n") + "\n");

for (const w of warnings) console.warn(`⚠  ${w}`);
for (const e of errors) console.error(`✗  ${e}`);
console.log(
  `\n${temaCount} temaer sjekket · ${errors.length} feil · ${warnings.length} advarsler` +
    (filter ? "" : ` · rapport: ${relative(process.cwd(), REPORT)}`)
);
process.exit(errors.length ? 1 : 0);
