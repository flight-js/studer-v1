// node scripts/innhold/balanser.mjs <tema.json> – flytter riktig svar slik at posisjonene 0–3
// fordeles jevnt over quiz + flervalg i miniprøven. Rører ikke forklaringene.
import { readFileSync, writeFileSync } from "node:fs";
const fil = process.argv[2];
const t = JSON.parse(readFileSync(fil, "utf8"));
const sp = [...t.quiz, ...t.miniprove.ekstra.filter((q) => q.type === "flervalg")];
const telling = [0, 0, 0, 0];
sp.forEach((q) => telling[q.correct]++);
const maks = Math.ceil(sp.length / 4);
for (const q of sp) {
  if (telling[q.correct] <= maks) continue;
  const mål = telling.indexOf(Math.min(...telling));
  const riktig = q.options[q.correct];
  const rest = q.options.filter((_, i) => i !== q.correct);
  rest.splice(mål, 0, riktig);
  telling[q.correct]--;
  telling[mål]++;
  q.options = rest;
  q.correct = mål;
}
writeFileSync(fil, JSON.stringify(t, null, 2) + "\n");
console.log(fil.split(/[\\/]/).pop(), "→", telling.join("/"));
