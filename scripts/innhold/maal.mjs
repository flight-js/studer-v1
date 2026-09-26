// node scripts/innhold/maal.mjs <PLAN> [SETTKODE] – skriver ut kompetansemålene nummerert.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const [plan, settKode] = process.argv.slice(2);
const lk = JSON.parse(readFileSync(fileURLToPath(new URL(`./lk20/${plan}.json`, import.meta.url)), "utf8"));
for (const s of lk.sett) {
  if (settKode && s.kode !== settKode) { console.log(`(${s.kode} ${s.tittel})`); continue; }
  console.log(`## ${s.kode} ${s.tittel}`);
  s.maal.forEach((m, i) => console.log(`${i + 1}. ${m}`));
}
