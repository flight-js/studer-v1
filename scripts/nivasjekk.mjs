// Nivåsjekk: går gjennom begrepene, spørsmålene og skriveoppgavene i hvert tema
// og merker det som ikke er kjerne – konkrete eksempler som bare er ett av
// flere mulige valg, og stoff som er over nivået for trinnet. Merket skrives
// inn i innholdsfilene som «niva» (mangler = kjerne), og øvingene tar
// kjernestoffet først. Temaer som allerede er sjekket, hoppes over, så
// skriptet kan trygt kjøres om igjen hvis det stopper.
//
//   npm run content:niva                      – alle temaer som ikke er sjekket
//   npm run content:niva -- kjemi-1 norsk-10  – bare disse fagene
//   npm run content:niva -- --antall 3        – bare 3 temaer (se på kvaliteten først)
//   npm run content:niva -- --pa-nytt         – sjekk på nytt også der det er gjort
//   npm run content:niva -- --rapport         – bare skriv content/NIVASJEKK.md
//
// Leser AI_API_KEY (og ev. AI_BASE_URL, AI_MODELL_NIVA, AI_RESONNERING_NIVA)
// fra .env.local. Bare innholdet i temaene sendes til leverandøren.
// Etterpå: npm run content:import -- --publiser-utkast

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../content/", import.meta.url));
const RAPPORT = join(ROOT, "NIVASJEKK.md");
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
const MODELL = process.env.AI_MODELL_NIVA || env.AI_MODELL_NIVA || env.AI_MODELL_INNHOLD || env.AI_MODELL || "gpt-6-luna";
const RESONNERING = process.env.AI_RESONNERING_NIVA || env.AI_RESONNERING_NIVA || "high";
const ER_OPENAI = new URL(BASE_URL).hostname.endsWith("openai.com");
// Dollar per million tokens (inn, ut) – oppdater ved modellbytte.
const PRISER = { "gpt-6-luna": { inn: 0.1, ut: 0.5 }, "gpt-6-sol": { inn: 2, ut: 10 }, "gpt-6-astra": { inn: 10, ut: 50 } };
const PRIS = PRISER[MODELL] ?? PRISER["gpt-6-luna"];
const NIVAER = ["kjerne", "eksempel", "over-niva"];
// Hvert tema vurderes opptil tre ganger, og flertallet avgjør (modellen svinger litt).
const KJORINGER = 3;

const args = process.argv.slice(2);
const verdi = (flagg) => (args.includes(flagg) ? Number(args[args.indexOf(flagg) + 1]) : undefined);
const paNytt = args.includes("--pa-nytt");
const bareRapport = args.includes("--rapport");
const maks = verdi("--antall") ?? Infinity;
const parallelt = verdi("--parallelt") ?? 6;
const MED_VERDI = ["--antall", "--parallelt"];
const bareFag = args.filter((a, i) => !a.startsWith("--") && !MED_VERDI.includes(args[i - 1]));

const TRINN = { 8: "8. trinn", 9: "9. trinn", 10: "10. trinn", vg1: "Vg1", vg2: "Vg2", vg3: "Vg3" };
const dirs = (p) => readdirSync(p).filter((d) => statSync(join(p, d)).isDirectory());
const lesJson = (p) => JSON.parse(readFileSync(p, "utf8"));

// Alle temafiler ----------------------------------------------------------------------

const alle = [];
for (const trinn of dirs(ROOT)) {
  for (const fag of dirs(join(ROOT, trinn))) {
    const fagFil = join(ROOT, trinn, fag, "_fag.json");
    if (!existsSync(fagFil)) continue;
    const fagMeta = lesJson(fagFil);
    for (const fil of readdirSync(join(ROOT, trinn, fag)).filter((f) => /^\d{2}-.+\.json$/.test(f)).sort()) {
      alle.push({ sti: join(ROOT, trinn, fag, fil), navn: `${trinn}/${fag}/${fil}`, fag, fagMeta, trinnNavn: TRINN[trinn] ?? trinn });
    }
  }
}

// Rapporten: alt som er merket, per tema, så en lærer kan se over det.
function skrivRapport() {
  const linjer = [
    "# Nivåsjekk",
    "",
    "Generert av `npm run content:niva`. Alt som ikke står her, er merket som kjerne.",
    "",
    "- **eksempel** – ett av flere mulige eksempler; mange klasser lærer temaet uten det",
    "- **over nivå** – mer avansert enn det trinnet forventer",
    "",
  ];
  let sjekket = 0;
  let kort = 0;
  let merketKort = 0;
  let merketAnnet = 0;
  for (const j of alle) {
    const t = lesJson(j.sti);
    if (!t.kvalitet.nivasjekk) continue;
    sjekket++;
    kort += t.flashcards.length;
    const merket = [
      ...t.flashcards.filter((c) => c.niva).map((c) => [c.niva, `begrep: ${c.term}`]),
      ...t.quiz.filter((q) => q.niva).map((q) => [q.niva, `${q.id}: ${q.text}`]),
      ...t.miniprove.ekstra.filter((q) => q.niva).map((q) => [q.niva, `${q.id}: ${q.text}`]),
      ...(t.miniprove.skriv ?? []).filter((s) => s.niva).map((s) => [s.niva, `${s.id}: ${s.text}`]),
    ];
    merketKort += t.flashcards.filter((c) => c.niva).length;
    merketAnnet += merket.length - t.flashcards.filter((c) => c.niva).length;
    if (!merket.length) continue;
    linjer.push(`## ${j.navn.replace(/\.json$/, "")} – ${t.name}`, "");
    for (const [niva, tekst] of merket) linjer.push(`- ${niva === "over-niva" ? "over nivå" : niva} · ${tekst}`);
    linjer.push("");
  }
  linjer.splice(
    3,
    0,
    `${sjekket} av ${alle.length} temaer er sjekket. ${merketKort} av ${kort} begreper og ${merketAnnet} spørsmål/oppgaver er merket.`,
    ""
  );
  writeFileSync(RAPPORT, linjer.join("\n"));
  console.log(`Rapport: content/NIVASJEKK.md (${merketKort} av ${kort} begreper merket)`);
}

if (bareRapport) {
  skrivRapport();
  process.exit(0);
}

if (!API_NOKKEL) {
  console.error("Legg AI_API_KEY=… i .env.local først (filen ignoreres av git).");
  process.exit(1);
}

const jobber = alle.filter(
  (j) => (!bareFag.length || bareFag.includes(j.fag)) && (paNytt || !lesJson(j.sti).kvalitet.nivasjekk)
);
const valgte = jobber.slice(0, maks);
console.log(`Modell: ${MODELL} · resonnering: ${ER_OPENAI ? RESONNERING : "–"} · opptil ${KJORINGER} kjøringer per tema · ${valgte.length} temaer`);

// Instruksjonene ----------------------------------------------------------------------

function lagPrompt(t, fagMeta, trinnNavn) {
  const mal = fagMeta.lareplan.kompetansemaal
    .filter((k) => t.kompetansemaal.includes(k.nr))
    .map((k) => `- ${k.tekst}`)
    .join("\n");

  const system = `Du går gjennom innholdet i ett tema i øveappen Studer, for norske elever på ${trinnNavn} i faget ${fagMeta.name}. Temaet heter «${t.name}»: ${t.intro}

Kompetansemål fra læreplanen (LK20) som temaet dekker:
${mal}

Elevene bruker appen til å øve på det de har hatt på skolen. Kompetansemålene er åpne, og lærere og lærebøker velger ulike eksempler, så mye varierer fra klasse til klasse. Elever har klaget på at noen begreper og spørsmål handler om ting de aldri har lært. Merk derfor hvert begrep, hvert spørsmål og hver skriveoppgave med ett av disse nivåene:

- kjerne: Noe nesten alle elever på ${trinnNavn} møter når klassen har dette temaet, uansett lærer og lærebok. Grunnbegreper, sentrale sammenhenger og de hendelsene, personene og eksemplene som nesten alle norske lærebøker på trinnet tar med i temaet.
- eksempel: Et konkret eksempel – en person, hendelse, organisasjon, sak, lov, avtale, sted, verk eller et bestemt årstall – som bare er ett av flere mulige valg. Mange klasser har hatt temaet uten å høre om det.
- over-niva: Mer detaljert, teknisk eller avansert enn det som forventes på ${trinnNavn}, eller stoff som egentlig hører til et annet tema eller et høyere trinn.

Slik vurderer du:
- Spør: Ville en vanlig elev som har fulgt undervisningen i temaet, kjent igjen dette? Ja → kjerne.
- Vurder hva eleven har lært, ikke om innholdet er riktig, viktig eller interessant.
- Vanskelig er ikke det samme som over nivå. Et sentralt begrep er kjerne selv om det er vanskelig.
- Vurder selve begrepet, ikke enkeltdetaljer i forklaringen. Et kjernebegrep er kjerne selv om forklaringen tar med en formel, et tall eller et årstall.
- Et spørsmål eller en skriveoppgave får samme nivå som det den krever at eleven kan. Krever den et eksempel eller noe over nivå, merkes den slik – også om den ellers er enkel.
- Et spørsmål som bruker et vanlig, konkret tilfelle for å øve på et kjernebegrep, er kjerne. Eksempler: atomnummeret til karbon (øver på atomnummer), hvilket virkemiddel en boikott er, eller å bruke kjernekunnskap på en ny situasjon.
- Merk bare når du har god grunn til å tro at mange klasser ikke har lært det. Er du i tvil, velg kjerne.
- I språkfag er grammatikk, ordforråd og tekstkunnskap som hører til trinnet, kjerne.
- I litteraturhistorie er de sentrale forfatterne og verkene i perioden kjerne – de som nesten alle lærebøker tar med, som Wergeland, Welhaven og Asbjørnsen og Moe i romantikken, Ibsen og «Et dukkehjem» i realismen, eller Hamsun og Amalie Skram i naturalismen og nyromantikken. Mindre kjente forfattere og verk, og samtidslitteratur som lærere velger ulikt, er eksempel.
- I matematikk og realfag er metoder, formler og begreper fra kompetansemålene kjerne.
- I historie er de sentrale hendelsene i et tema kjerne – de som nesten alle lærebøker forteller om, som Krystallnatten i et tema om Holocaust eller skuddene i Sarajevo i et tema om første verdenskrig. Eksempel er saker, personer, organisasjoner og avtaler som lærere velger ulikt for å belyse et åpent kompetansemål.
- Det vanlige er at de fleste begrepene er kjerne. Men er temaet bygd opp rundt eksempler som skoler velger ulikt, kan mange være eksempel.`;

  const begreper = t.flashcards.map((c, i) => `${i + 1}. ${c.term}: ${c.def}`).join("\n");
  const fasit = (q) =>
    q.type === "sant-usant" ? `(påstand, ${q.correct ? "sann" : "usann"})` : `(riktig svar: ${q.options[q.correct]})`;
  const sporsmal = [...t.quiz, ...t.miniprove.ekstra].map((q) => `${q.id}. ${q.text} ${fasit(q)}`).join("\n");
  const skriv = (t.miniprove.skriv ?? []).map((s) => `${s.id}. ${s.text}`).join("\n");
  const antall = { sporsmal: t.quiz.length + t.miniprove.ekstra.length, skriv: (t.miniprove.skriv ?? []).length };
  const bruker = `Begreper (nr. begrep: forklaring):\n${begreper}\n\nSpørsmål (id. spørsmål):\n${sporsmal}${
    skriv ? `\n\nSkriveoppgaver (id. oppgave):\n${skriv}` : ""
  }\n\nGi nivå til alle: ${t.flashcards.length} begreper, ${antall.sporsmal} spørsmål og ${antall.skriv} skriveoppgaver.`;
  return { system, bruker };
}

const element = (nokkel, type) => ({
  type: "array",
  items: {
    type: "object",
    properties: { [nokkel]: { type }, niva: { type: "string", enum: NIVAER } },
    required: [nokkel, "niva"],
    additionalProperties: false,
  },
});

const FORMAT = {
  type: "json_schema",
  json_schema: {
    name: "nivasjekk",
    strict: true,
    schema: {
      type: "object",
      properties: {
        begreper: element("nr", "integer"),
        sporsmal: element("id", "string"),
        skriv: element("id", "string"),
      },
      required: ["begreper", "sporsmal", "skriv"],
      additionalProperties: false,
    },
  },
};

// Kall og kontroll -------------------------------------------------------------------

const vent = (ms) => new Promise((r) => setTimeout(r, ms));

// Hvor lenge vi skal vente etter 429: «retry-after» (sekunder) eller
// «x-ratelimit-reset-tokens» («56.8s», «120ms», «1m2s»), ellers 20 s.
function ventetid(headers) {
  const sek = Number(headers.get("retry-after"));
  if (sek > 0) return sek * 1000;
  const m = (headers.get("x-ratelimit-reset-tokens") ?? "").match(/^(?:(\d+)m)?(?:([\d.]+)s)?(?:(\d+)ms)?$/);
  if (m && m[0]) return (Number(m[1] ?? 0) * 60 + Number(m[2] ?? 0)) * 1000 + Number(m[3] ?? 0);
  return 20_000;
}

// Hvert begrep og hver id skal ha fått ett gyldig nivå. Ukjente id-er og
// gjentakelser hoppes over. Mangler noen få (under 10 %), regnes de som kjerne
// – det trygge valget. Mangler flere, er svaret ubrukelig.
function kontroller(svar, t) {
  const kart = (liste, nokkel, ider) => {
    const m = new Map();
    for (const x of liste ?? []) {
      if (ider.includes(x[nokkel]) && NIVAER.includes(x.niva) && !m.has(x[nokkel])) m.set(x[nokkel], x.niva);
    }
    if (m.size < ider.length * 0.9) return null;
    for (const id of ider) if (!m.has(id)) m.set(id, "kjerne");
    return m;
  };
  const begreper = kart(svar.begreper, "nr", t.flashcards.map((_, i) => i + 1));
  const sporsmal = kart(svar.sporsmal, "id", [...t.quiz, ...t.miniprove.ekstra].map((q) => q.id));
  const skriv = kart(svar.skriv, "id", (t.miniprove.skriv ?? []).map((s) => s.id));
  return begreper && sporsmal && skriv ? { begreper, sporsmal, skriv } : null;
}

const merk = (x, niva) => {
  if (niva === "kjerne") delete x.niva;
  else x.niva = niva;
};

// Ett kall til modellen, med nye forsøk ved feil og ufullstendige svar.
async function vurder(jobb, t, body) {
  let ventet = 0;
  for (let forsok = 1; forsok <= 3; forsok++) {
    try {
      const res = await fetch(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${API_NOKKEL}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(180_000),
      });
      const data = await res.json();
      if (!res.ok) {
        // Tokengrensen per minutt: vent så lenge leverandøren sier, uten å
        // bruke opp forsøkene (men gi opp etter ti ganger).
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
      const svar = kontroller(JSON.parse(data.choices?.[0]?.message?.content ?? "{}"), t);
      if (svar) return { svar, kostnad };
      console.log(`  … ${jobb.navn}: ufullstendig svar, prøver igjen`);
    } catch (e) {
      if (forsok === 3) throw e;
      await vent(3000 * forsok);
    }
  }
  throw new Error("ga opp etter tre forsøk");
}

// Flertallet avgjør: noe merkes bare når de fleste kjøringene er enige om at
// det ikke er kjerne, og da med nivået som ble valgt oftest.
function flertall(verdier) {
  const ikkeKjerne = verdier.filter((v) => v !== "kjerne");
  if (ikkeKjerne.length * 2 <= verdier.length) return "kjerne";
  const antall = (n) => ikkeKjerne.filter((v) => v === n).length;
  return antall("over-niva") > antall("eksempel") ? "over-niva" : "eksempel";
}

async function sjekk(jobb) {
  const start = Date.now();
  const t = lesJson(jobb.sti);
  const { system, bruker } = lagPrompt(t, jobb.fagMeta, jobb.trinnNavn);
  const body = {
    model: MODELL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: bruker },
    ],
  };
  if (ER_OPENAI) Object.assign(body, { response_format: FORMAT, store: false, reasoning_effort: RESONNERING });

  // To kjøringer først. Er de enige om hva som er kjerne, endrer ikke en
  // tredje utfallet, så den trengs bare der de er uenige.
  const runder = await Promise.all([1, 2].map(() => vurder(jobb, t, body)));
  const kjerne = (r) => ["begreper", "sporsmal", "skriv"].flatMap((del) => [...r.svar[del]].map(([k, v]) => `${del}|${k}|${v === "kjerne"}`)).sort().join();
  if (KJORINGER > 2 && kjerne(runder[0]) !== kjerne(runder[1])) {
    runder.push(...(await Promise.all(Array.from({ length: KJORINGER - 2 }, () => vurder(jobb, t, body)))));
  }
  const kostnad = runder.reduce((s, r) => s + r.kostnad, 0);
  const niva = (del, nokkel) => flertall(runder.map((r) => r.svar[del].get(nokkel)));

  // Leser filen på nytt rett før skriving, i tilfelle den er endret imens.
  const fersk = lesJson(jobb.sti);
  fersk.flashcards.forEach((c, i) => merk(c, niva("begreper", i + 1)));
  [...fersk.quiz, ...fersk.miniprove.ekstra].forEach((q) => merk(q, niva("sporsmal", q.id)));
  (fersk.miniprove.skriv ?? []).forEach((s) => merk(s, niva("skriv", s.id)));
  fersk.kvalitet.nivasjekk = new Date().toISOString().slice(0, 10);
  writeFileSync(jobb.sti, JSON.stringify(fersk, null, 2) + "\n");

  const ekstra = fersk.flashcards.filter((c) => c.niva);
  const sp = [...fersk.quiz, ...fersk.miniprove.ekstra, ...(fersk.miniprove.skriv ?? [])].filter((q) => q.niva).length;
  console.log(
    `✓ ${jobb.navn} · ${fersk.flashcards.length - ekstra.length} kjerne, ${ekstra.length} merket` +
      (ekstra.length ? ` (${ekstra.map((c) => c.term).join(", ")})` : "") +
      ` · ${sp} spørsmål merket · ${runder.length} kjøringer · ${((Date.now() - start) / 1000).toFixed(1)} s · ${(kostnad * 100).toFixed(2)} cent`
  );
  return kostnad;
}

let sum = 0;
let ferdig = 0;
const feil = [];
let neste = 0;
async function arbeider() {
  while (neste < valgte.length) {
    const jobb = valgte[neste++];
    try {
      const kostnad = await sjekk(jobb);
      sum += kostnad; // ikke «sum += await …»: da overskriver arbeiderne hverandres sum
      ferdig++;
    } catch (e) {
      feil.push(jobb.navn);
      console.log(`✗ ${jobb.navn}: ${e.message}`);
    }
  }
}
await Promise.all(Array.from({ length: Math.min(parallelt, valgte.length) }, arbeider));

console.log(`\nFerdig: ${ferdig} av ${valgte.length} temaer · ${(sum * 100).toFixed(1)} cent totalt`);
skrivRapport();
if (feil.length) {
  console.log(`Feilet (kjør skriptet igjen for å prøve på nytt):\n  ${feil.join("\n  ")}`);
  process.exit(1);
}
