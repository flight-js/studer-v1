// Lager et repetisjonstema som siste tema i hvert fag: det viktigste fra alle
// temaene samlet, til tentamen og eksamen.
//
// - Sammendraget og skriveoppgavene (på tvers av temaene) skrives av KI, bare
//   ut fra sammendragene som finnes.
// - Flashcards, quiz og prøvespørsmål er de viktigste kjerneelementene fra
//   temaene, valgt av KI, men kopiert ordrett – ingen nye påstander.
// - Tankekartet bygges av de valgte begrepene, med ett grein per tema.
//
//   npm run content:repetisjon                     – alle fag som mangler repetisjon
//   npm run content:repetisjon -- kjemi-1 norsk-10 – bare disse fagene
//   npm run content:repetisjon -- --antall 2       – bare 2 fag (se på kvaliteten først)
//   npm run content:repetisjon -- --pa-nytt        – lag på nytt også der det finnes
//   npm run content:repetisjon -- --flere-skriv    – fyll opp skriveoppgavene i eksisterende
//                                                    repetisjonstemaer til 16, og sett tiden
//
// Leser AI_API_KEY (og ev. AI_BASE_URL, AI_MODELL_INNHOLD, AI_RESONNERING_INNHOLD)
// fra .env.local. Etterpå: npm run content:niva, så npm run content:import -- --publiser-utkast

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

const REPETISJON = {
  id: "repetisjon",
  navn: "Repetisjon av hele faget",
  intro: "Det viktigste fra alle temaene samlet – fint å gå gjennom før tentamen og eksamen.",
  minutter: 45, // en lengre prøve, som en tentamen (se antallOppgaver i src/lib/miniprove.ts)
};
const KORT = [8, 25];
const QUIZ = [10, 15];
const PROVE = [15, 20]; // quizspørsmålene + egne prøvespørsmål
const SKRIV = 16; // prøven trekker 10 av dem, så den blir litt annerledes hver gang
const ORD = [450, 1600];

if (!API_NOKKEL) {
  console.error("Legg AI_API_KEY=… i .env.local først (filen ignoreres av git).");
  process.exit(1);
}

const args = process.argv.slice(2);
const verdi = (flagg) => (args.includes(flagg) ? Number(args[args.indexOf(flagg) + 1]) : undefined);
const paNytt = args.includes("--pa-nytt");
const flereSkriv = args.includes("--flere-skriv");
const maks = verdi("--antall") ?? Infinity;
const parallelt = verdi("--parallelt") ?? 6;
const MED_VERDI = ["--antall", "--parallelt"];
const bareFag = args.filter((a, i) => !a.startsWith("--") && !MED_VERDI.includes(args[i - 1]));

const TRINN = { 8: "8. trinn", 9: "9. trinn", 10: "10. trinn", vg1: "Vg1", vg2: "Vg2", vg3: "Vg3" };
const dirs = (p) => readdirSync(p).filter((d) => statSync(join(p, d)).isDirectory());
const lesJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const skrivJson = (p, data) => writeFileSync(p, JSON.stringify(data, null, 2) + "\n");
const ord = (s) => s.replace(/[#*_`>-]/g, " ").split(/\s+/).filter(Boolean).length;

// Alle fag ---------------------------------------------------------------------------

const jobber = [];
for (const trinn of dirs(ROOT)) {
  for (const fag of dirs(join(ROOT, trinn))) {
    const dir = join(ROOT, trinn, fag);
    if (!existsSync(join(dir, "_fag.json")) || (bareFag.length && !bareFag.includes(fag))) continue;
    const meta = lesJson(join(dir, "_fag.json"));
    const har = meta.temaer.includes(REPETISJON.id);
    if (flereSkriv ? !har : !paNytt && har) continue;
    jobber.push({ dir, navn: `${trinn}/${fag}`, trinnNavn: TRINN[trinn] ?? trinn });
  }
}
const valgte = jobber.slice(0, maks);
console.log(`Modell: ${MODELL} · resonnering: ${ER_OPENAI ? RESONNERING : "–"} · ${valgte.length} fag`);

// Innholdet i faget, med id-er modellen kan velge fra ---------------------------------

function lesFag(dir) {
  const meta = lesJson(join(dir, "_fag.json"));
  const filer = new Map(
    readdirSync(dir)
      .filter((f) => /^\d{2}-.+\.json$/.test(f))
      .map((f) => [lesJson(join(dir, f)).id, f])
  );
  const temaer = meta.temaer
    .filter((slug) => slug !== REPETISJON.id && filer.has(slug))
    .map((slug, i) => {
      const t = lesJson(join(dir, filer.get(slug)));
      const nr = `T${i + 1}`;
      return {
        nr,
        t,
        kort: t.flashcards.flatMap((c, j) => (c.niva ? [] : [{ id: `${nr}-K${j + 1}`, c }])),
        quiz: t.quiz.flatMap((q) => (q.niva ? [] : [{ id: `${nr}-${q.id}`, q }])),
        prove: t.miniprove.ekstra.flatMap((q) => (q.niva ? [] : [{ id: `${nr}-${q.id}`, q }])),
      };
    });
  const fil = filer.get(REPETISJON.id) ?? `${String(temaer.length + 1).padStart(2, "0")}-${REPETISJON.id}.json`;
  return { meta, temaer, fil };
}

const skrivRegler = (antall) => `${antall} skriveoppgaver som eksamensøving. Eleven skriver svaret selv, med 1–5 setninger, og en språkmodell retter det ut fra fasiten og kriteriene (0, ½ eller 1 poeng).
   - Minst halvparten skal gå på tvers av temaer: sammenligne, forklare en sammenheng, eller bruke kunnskap fra flere temaer på en situasjon. Dekk så mange temaer som mulig. I matematikk og realfag: minst en firedel korte regneoppgaver som kan løses uten kalkulator.
   - Hver oppgave må kunne forstås alene. Ikke vis til sammendraget, temaene eller annet eleven ikke ser.
   - Ikke skriv hvor langt svaret skal være. Ikke ja/nei-spørsmål eller meningsspørsmål uten fasit.
   - fasit: et fullgodt svar på elevens nivå, 1–4 setninger. kriterier: 1–3 korte punkter med det vesentlige faglige innholdet.
   - Bygg bare på fakta i sammendragene, på samme språk og målform.`;

// Gyldige skriveoppgaver uten gjentakelser, heller ikke av dem som finnes fra før.
function rensSkriv(liste, finnes = []) {
  const ut = [];
  const tekster = new Set(finnes.map((s) => s.text.trim().toLowerCase()));
  for (const o of liste ?? []) {
    const text = o.text?.trim();
    const fasit = o.fasit?.trim();
    const kriterier = (o.kriterier ?? []).map((k) => k.trim()).filter(Boolean).slice(0, 3);
    if (!text || !fasit || !kriterier.length || text.length > 500 || fasit.length > 900) continue;
    if (tekster.has(text.toLowerCase())) continue;
    tekster.add(text.toLowerCase());
    ut.push({ text, fasit, kriterier });
  }
  return ut;
}

function lagPrompt({ meta, temaer }, trinnNavn) {
  const n = temaer.length;
  const system = `Du lager et repetisjonstema i øveappen Studer, for norske elever på ${trinnNavn} i faget ${meta.name}. Temaet heter «${REPETISJON.navn}» og er siste tema i faget. Eleven bruker det til å repetere før tentamen og eksamen. Faget har ${n} temaer (T1–T${n}). Under får du sammendraget, kjernebegrepene og kjernespørsmålene fra hvert tema.

Lag dette:

1. sammendrag: Det viktigste fra hele faget, 600–1200 ord.
   - Start med to–tre setninger om hva faget handler om.
   - Deretter én del per tema, i samme rekkefølge, med mellomtittelen «## <temanavn>». Ta med det eleven må kunne: de sentrale begrepene, sammenhengene og (i realfag) formlene og metodene. Skriv kort og tett, gjerne med en kort punktliste. Marker nøkkelbegreper med **fet**.
   - Avslutt med «## Sammenhenger i faget», som viser hvordan temaene henger sammen, og «## Huskeliste før prøven» med 6–10 korte punkter.
   - Bygg bare på fakta i sammendragene under. Ikke finn på tall, årstall, navn, sitater eller påstander.
   - Skriv på samme språk og målform som sammendragene. Ikke vis til «sammendraget» eller «temaet over».

2. begreper: id-ene (som «T3-K5») til de ${Math.max(KORT[0], Math.min(KORT[1], n))}–${KORT[1]} viktigste begrepene i hele faget. Ta med minst ett fra hvert tema, og velg dem som oftest kommer på prøver og eksamen.

3. quiz: id-ene til ${QUIZ[0]}–${QUIZ[1]} quizspørsmål (som «T2-q04») som til sammen dekker så mange temaer som mulig. Velg spørsmål om det viktigste, ikke detaljer.

4. prove: id-ene til 5–8 prøvespørsmål (som «T4-m02») fra så mange temaer som mulig, til miniprøven.

5. skriv: ${skrivRegler(SKRIV)}`;

  const deler = temaer.map(({ nr, t, kort, quiz, prove }) => {
    const fasit = (q) =>
      q.type === "sant-usant" ? `(påstand, ${q.correct ? "sann" : "usann"})` : `(riktig svar: ${q.options[q.correct]})`;
    return [
      `### ${nr}: ${t.name}`,
      `Sammendrag:\n${t.sammendrag}`,
      `Kjernebegreper:\n${kort.map(({ id, c }) => `${id}. ${c.term}: ${c.def}`).join("\n")}`,
      `Quizspørsmål:\n${quiz.map(({ id, q }) => `${id}. ${q.text} ${fasit(q)}`).join("\n")}`,
      prove.length ? `Prøvespørsmål:\n${prove.map(({ id, q }) => `${id}. ${q.text} ${fasit(q)}`).join("\n")}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");
  });
  return { system, bruker: deler.join("\n\n") };
}

const FORMAT = {
  type: "json_schema",
  json_schema: {
    name: "repetisjon",
    strict: true,
    schema: {
      type: "object",
      properties: {
        sammendrag: { type: "string" },
        begreper: { type: "array", items: { type: "string" } },
        quiz: { type: "array", items: { type: "string" } },
        prove: { type: "array", items: { type: "string" } },
        skriv: {
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
      required: ["sammendrag", "begreper", "quiz", "prove", "skriv"],
      additionalProperties: false,
    },
  },
};

// Kall og kontroll -------------------------------------------------------------------

const vent = (ms) => new Promise((r) => setTimeout(r, ms));

// Tom for kreditt hos OpenAI: å vente hjelper ikke, så hele kjøringen stopper.
let tomForKreditt = false;
const KREDITTFEIL = ["insufficient_quota", "credit_balance_exhausted"];

function ventetid(headers) {
  const sek = Number(headers.get("retry-after"));
  if (sek > 0) return sek * 1000;
  const m = (headers.get("x-ratelimit-reset-tokens") ?? "").match(/^(?:(\d+)m)?(?:([\d.]+)s)?(?:(\d+)ms)?$/);
  if (m && m[0]) return (Number(m[1] ?? 0) * 60 + Number(m[2] ?? 0)) * 1000 + Number(m[3] ?? 0);
  return 20_000;
}

// Gyldige, unike valg i rekkefølgen temaene kommer.
function velg(ider, alle) {
  const sett = new Set(ider);
  return alle.filter((x) => sett.has(x.id));
}

function kontroller(svar, fag) {
  const alleKort = fag.temaer.flatMap((t) => t.kort.map((k) => ({ ...k, tema: t })));
  const alleQuiz = fag.temaer.flatMap((t) => t.quiz);
  const alleProve = fag.temaer.flatMap((t) => t.prove);

  // Samme begrep kan finnes i flere temaer – ta det bare med én gang.
  const sett = new Set();
  const kort = velg(svar.begreper ?? [], alleKort)
    .filter(({ c }) => {
      const k = c.term.trim().toLowerCase();
      if (sett.has(k)) return false;
      sett.add(k);
      return true;
    })
    .slice(0, KORT[1]);
  const quiz = velg(svar.quiz ?? [], alleQuiz).slice(0, QUIZ[1]);
  let prove = velg(svar.prove ?? [], alleProve);
  // Miniprøven skal ha 15–20 spørsmål i alt. Mangler det, fylles den opp med
  // flere prøvespørsmål, ett fra hvert tema om gangen.
  const brukt = new Set(prove.map((p) => p.id));
  const reserve = fag.temaer.flatMap((t) => t.prove.filter((p) => !brukt.has(p.id)));
  while (quiz.length + prove.length < PROVE[0] && reserve.length) prove.push(reserve.shift());
  prove = prove.slice(0, Math.max(0, PROVE[1] - quiz.length));

  const skriv = rensSkriv(svar.skriv);

  const sammendrag = (svar.sammendrag ?? "").trim();
  const feil = [];
  if (kort.length < KORT[0]) feil.push(`${kort.length} begreper`);
  if (quiz.length < QUIZ[0]) feil.push(`${quiz.length} quizspørsmål`);
  if (quiz.length + prove.length < PROVE[0]) feil.push(`${quiz.length + prove.length} i miniprøven`);
  if (skriv.length < SKRIV - 4) feil.push(`${skriv.length} skriveoppgaver`);
  if (ord(sammendrag) < ORD[0] || ord(sammendrag) > ORD[1]) feil.push(`${ord(sammendrag)} ord i sammendraget`);
  if (feil.length) return { feil: feil.join(", ") };
  return { kort, quiz, prove, skriv: skriv.slice(0, SKRIV), sammendrag };
}

// Tankekartet: faget i midten, ett grein per tema med de valgte begrepene.
function lagTankekart(fag, kort) {
  return {
    label: fag.meta.name,
    children: fag.temaer.map((t) => {
      const egne = kort.filter((k) => k.tema === t).slice(0, 5);
      const barn = egne.length
        ? egne.map(({ c }) => ({ label: c.term, note: c.def }))
        : (t.t.mindmap.children ?? []).slice(0, 3).map((g) => ({ label: g.label }));
      return { label: t.t.name, children: barn };
    }),
  };
}

function lagTema(fag, valg) {
  const { meta, temaer } = fag;
  // Kopier spørsmålet med ny id. Nivåmerket fjernes: bare kjernestoff er valgt.
  const kopi = (q, id) => {
    const ny = { ...q, id };
    delete ny.niva;
    return ny;
  };
  const quiz = valg.quiz.map(({ q }, i) => kopi(q, `q${String(i + 1).padStart(2, "0")}`));
  const ekstra = valg.prove.map(({ q }, i) => kopi(q, `m${String(i + 1).padStart(2, "0")}`));
  return {
    id: REPETISJON.id,
    fagId: meta.id,
    trinnId: meta.trinnId,
    name: REPETISJON.navn,
    intro: REPETISJON.intro,
    kompetansemaal: [...new Set(temaer.flatMap((t) => t.t.kompetansemaal))].sort((a, b) => a - b),
    sammendrag: valg.sammendrag,
    flashcards: valg.kort.map(({ c }) => ({ term: c.term, def: c.def })),
    quiz,
    mindmap: lagTankekart(fag, valg.kort),
    miniprove: {
      minutter: REPETISJON.minutter,
      quizRefs: quiz.map((q) => q.id),
      ekstra,
      skriv: valg.skriv.map((s, i) => ({ id: `s${String(i + 1).padStart(2, "0")}`, ...s })),
    },
    kvalitet: {
      status: "utkast",
      merknader: [],
    },
  };
}

// Ett kall til modellen, med nye forsøk. godta(svar) gir resultatet, eller { feil }.
async function kall(jobb, body, godta) {
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
        if (KREDITTFEIL.includes(data.error?.code)) {
          tomForKreditt = true;
          throw new Error("tom for kreditt hos OpenAI – fyll på og kjør skriptet igjen");
        }
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
      const resultat = godta(JSON.parse(data.choices?.[0]?.message?.content ?? "{}"));
      if (!resultat.feil) return { resultat, kostnad };
      console.log(`  … ${jobb.navn}: ${resultat.feil}, prøver igjen`);
    } catch (e) {
      if (tomForKreditt || forsok === 3) throw e;
      await vent(3000 * forsok);
    }
  }
  throw new Error("ga opp etter tre forsøk");
}

const FORMAT_SKRIV = {
  type: "json_schema",
  json_schema: {
    name: "skriveoppgaver",
    strict: true,
    schema: {
      type: "object",
      properties: { skriv: FORMAT.json_schema.schema.properties.skriv },
      required: ["skriv"],
      additionalProperties: false,
    },
  },
};

// --flere-skriv: fyller opp skriveoppgavene i et eksisterende repetisjonstema og
// setter tiden. Nivåsjekken fjernes, så content:niva sjekker temaet på nytt.
async function lagFlere(jobb) {
  const start = Date.now();
  const fag = lesFag(jobb.dir);
  const sti = join(jobb.dir, fag.fil);
  const rep = lesJson(sti);
  const finnes = rep.miniprove.skriv ?? [];
  const mangler = SKRIV - finnes.length;
  if (mangler <= 0 && rep.miniprove.minutter === REPETISJON.minutter) {
    console.log(`· ${jobb.navn}: har allerede ${finnes.length} skriveoppgaver`);
    return 0;
  }
  let nye = [];
  let kostnad = 0;
  if (mangler > 0) {
    const system = `Du lager skriveoppgaver til repetisjonsprøven i øveappen Studer, for norske elever på ${jobb.trinnNavn} i faget ${fag.meta.name}. Prøven dekker hele faget og brukes før tentamen og eksamen. Under får du sammendraget fra hvert tema.

Lag ${skrivRegler(mangler)}

Disse oppgavene finnes allerede. Ikke lag like eller nesten like oppgaver:
${finnes.map((s) => `- ${s.text}`).join("\n")}`;
    const bruker = fag.temaer.map(({ t }) => `### ${t.name}\n${t.sammendrag}`).join("\n\n");
    const body = {
      model: MODELL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: bruker },
      ],
    };
    if (ER_OPENAI) Object.assign(body, { response_format: FORMAT_SKRIV, store: false, reasoning_effort: RESONNERING });
    const svar = await kall(jobb, body, (s) => {
      const r = rensSkriv(s.skriv, finnes);
      return r.length >= Math.min(mangler, 6) ? { skriv: r.slice(0, mangler) } : { feil: `${r.length} skriveoppgaver` };
    });
    nye = svar.resultat.skriv;
    kostnad = svar.kostnad;
  }
  // Leser filen på nytt rett før skriving, i tilfelle den er endret imens.
  const fersk = lesJson(sti);
  const alle = [...(fersk.miniprove.skriv ?? []), ...nye];
  fersk.miniprove.skriv = alle.map((s, i) => ({ ...s, id: `s${String(i + 1).padStart(2, "0")}` }));
  fersk.miniprove.minutter = REPETISJON.minutter;
  delete fersk.kvalitet.nivasjekk;
  skrivJson(sti, fersk);
  console.log(`✓ ${jobb.navn} · ${alle.length} skriveoppgaver (+${nye.length}) · ${((Date.now() - start) / 1000).toFixed(1)} s · ${(kostnad * 100).toFixed(2)} cent`);
  return kostnad;
}

async function lag(jobb) {
  const fag = lesFag(jobb.dir);
  if (fag.temaer.length < 2) throw new Error("for få temaer");
  const { system, bruker } = lagPrompt(fag, jobb.trinnNavn);
  const body = {
    model: MODELL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: bruker },
    ],
  };
  if (ER_OPENAI) Object.assign(body, { response_format: FORMAT, store: false, reasoning_effort: RESONNERING });

  const start = Date.now();
  const { resultat: valg, kostnad } = await kall(jobb, body, (svar) => kontroller(svar, fag));

  skrivJson(join(jobb.dir, fag.fil), lagTema(fag, valg));
  // Leser _fag.json på nytt rett før skriving, i tilfelle den er endret imens.
  const meta = lesJson(join(jobb.dir, "_fag.json"));
  if (!meta.temaer.includes(REPETISJON.id)) {
    meta.temaer.push(REPETISJON.id);
    skrivJson(join(jobb.dir, "_fag.json"), meta);
  }
  console.log(
    `✓ ${jobb.navn} · ${fag.temaer.length} temaer · ${ord(valg.sammendrag)} ord · ${valg.kort.length} kort · ` +
      `${valg.quiz.length} quiz · ${valg.prove.length} prøve · ${valg.skriv.length} skriv · ` +
      `${((Date.now() - start) / 1000).toFixed(1)} s · ${(kostnad * 100).toFixed(2)} cent`
  );
  return kostnad;
}

let sum = 0;
let ferdig = 0;
const feil = [];
let neste = 0;
async function arbeider() {
  while (neste < valgte.length && !tomForKreditt) {
    const jobb = valgte[neste++];
    try {
      const kostnad = await (flereSkriv ? lagFlere(jobb) : lag(jobb));
      sum += kostnad; // ikke «sum += await …»: da overskriver arbeiderne hverandres sum
      ferdig++;
    } catch (e) {
      feil.push(jobb.navn);
      console.log(`✗ ${jobb.navn}: ${e.message}`);
    }
  }
}
await Promise.all(Array.from({ length: Math.min(parallelt, valgte.length) }, arbeider));

console.log(`\nFerdig: ${ferdig} av ${valgte.length} fag · ${(sum * 100).toFixed(1)} cent totalt`);
if (feil.length) {
  console.log(`Feilet (kjør skriptet igjen for å prøve på nytt):\n  ${feil.join("\n  ")}`);
  process.exitCode = 1;
}
