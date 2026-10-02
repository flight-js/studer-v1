// Lager src/lib/forsidedata.ts: tallene, temakatalogen og utvalget av begreper
// som forsiden viser. Alt hentes fra content/, så forsiden bare viser ekte
// innhold. Kjør på nytt når innholdet endres: `npm run content:forside`.

import fs from "node:fs";
import path from "node:path";

const ROT = path.resolve(import.meta.dirname, "..");
const INNHOLD = path.join(ROT, "content");
const UT = path.join(ROT, "src/lib/forsidedata.ts");

// Temaet forsiden bruker som eksempel gjennom hele siden.
const EKSEMPEL = { trinn: "vg2", fag: "kjemi-1", tema: "syrer-baser-og-ph" };
const BEGREPER_PER_FAG = 2;

const les = (fil) => JSON.parse(fs.readFileSync(fil, "utf8"));

// Fast «tilfeldig» rekkefølge, så utvalget blir det samme hver gang.
function hash(tekst) {
  let h = 2166136261;
  for (const tegn of tekst) h = Math.imul(h ^ tegn.codePointAt(0), 16777619);
  return h >>> 0;
}

const katalog = les(path.join(INNHOLD, "katalog.json"));
const telling = { trinn: 0, fag: 0, temaer: 0, flashcards: 0, quiz: 0 };
const trinnListe = [];
const begreper = [];
const brukteBegreper = new Set();
let eksempel = null;

for (const trinn of katalog.trinn) {
  telling.trinn++;
  const fagListe = [];
  for (const fag of trinn.fag) {
    const mappe = path.join(INNHOLD, trinn.id, fag.id);
    const filer = fs
      .readdirSync(mappe)
      .filter((f) => /^\d\d-.+\.json$/.test(f))
      .sort();
    telling.fag++;
    const temaer = [];
    const kandidater = [];
    for (const fil of filer) {
      const tema = les(path.join(mappe, fil));
      telling.temaer++;
      telling.flashcards += tema.flashcards?.length ?? 0;
      telling.quiz += tema.quiz?.length ?? 0;
      temaer.push(tema.name);

      if (trinn.id === EKSEMPEL.trinn && fag.id === EKSEMPEL.fag && tema.id === EKSEMPEL.tema) {
        const quiz = tema.quiz.find((q) => q.id === "q01") ?? tema.quiz[0];
        const skriv = tema.miniprove?.skriv?.[0];
        eksempel = {
          trinn: trinn.navn,
          fag: fag.navn,
          tema: tema.name,
          temaIndeks: temaer.length - 1,
          flashcards: tema.flashcards.length,
          quiz: tema.quiz.length,
          skriveoppgaver: tema.miniprove?.skriv?.length ?? 0,
          minutter: tema.miniprove?.minutter ?? 0,
          flashcard: tema.flashcards.find((f) => f.term === "Amfolytt") ?? tema.flashcards[0],
          sporsmal: { text: quiz.text, options: quiz.options, correct: quiz.correct, explain: quiz.explain },
          skriveoppgave: skriv && { text: skriv.text, fasit: skriv.fasit, kriterier: skriv.kriterier },
        };
      }

      if (tema.id === "repetisjon") continue;
      for (const kort of tema.flashcards ?? []) {
        const { term, def } = kort;
        if (kort.niva) continue; // bare kjernestoff
        if (term.length < 4 || term.length > 22 || /[()/]/.test(term)) continue;
        // Bare latinske bokstaver, tall og vanlig tegnsetting – vektorpiler,
        // kinesiske tegn og formler setter seg dårlig i en tekstvegg.
        if (!/^[\p{Script=Latin}\p{N} '’.,:;!?&-]+$/u.test(term)) continue;
        // Tunge temaer hører hjemme i faget, ikke som pynt på forsiden.
        if (/vold|overgrep|selvmord|drap|terror|tortur|folkemord/i.test(term + " " + def)) continue;
        if (def.length < 24 || def.length > 105 || def.includes("\n")) continue;
        kandidater.push({ term, def, fag: fag.navn, trinn: trinn.navn, tema: tema.id });
      }
    }

    // Spre utvalget over ulike temaer i faget.
    const brukteTemaer = new Set();
    for (const k of kandidater.sort((a, b) => hash(a.term) - hash(b.term))) {
      const nokkel = k.term.toLocaleLowerCase("nb");
      if (brukteTemaer.has(k.tema) || brukteBegreper.has(nokkel)) continue;
      brukteTemaer.add(k.tema);
      brukteBegreper.add(nokkel);
      begreper.push({ term: k.term, def: k.def, fag: k.fag, trinn: k.trinn });
      if (brukteTemaer.size >= BEGREPER_PER_FAG) break;
    }

    fagListe.push({ id: fag.id, navn: fag.navn, temaer });
  }
  trinnListe.push({ id: trinn.id, navn: trinn.navn, fag: fagListe });
}

if (!eksempel) throw new Error("Fant ikke eksempeltemaet " + JSON.stringify(EKSEMPEL));

// Bland fagene, så like begreper ikke havner ved siden av hverandre.
begreper.sort((a, b) => hash(a.term + "·") - hash(b.term + "·"));

const ts = `// Generert av scripts/lag-forsidedata.mjs – ikke rediger for hånd.
// Kjør \`npm run content:forside\` når innholdet i content/ endres.

export type Begrep = { term: string; def: string; fag: string; trinn: string };
export type KatalogTrinn = {
  id: string;
  navn: string;
  fag: { id: string; navn: string; temaer: string[] }[];
};

export const TELLING = ${JSON.stringify(telling)} as const;

export const EKSEMPEL = ${JSON.stringify(eksempel, null, 2)} as const;

export const KATALOG: KatalogTrinn[] = ${JSON.stringify(trinnListe)};

export const BEGREPER: Begrep[] = ${JSON.stringify(begreper, null, 0).replace(/\},\{/g, "},\n  {")};
`;

fs.writeFileSync(UT, ts);
console.log(
  `Skrev ${path.relative(ROT, UT)}: ${begreper.length} begreper, ${telling.temaer} temaer i ${telling.fag} fag.`,
);
