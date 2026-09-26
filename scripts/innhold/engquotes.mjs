// node scripts/innhold/engquotes.mjs <mappe> – bytter «» med “” i alle temafiler (for engelskspråklig innhold).
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const dir = process.argv[2];
const fix = (v) => typeof v === "string" ? v.replace(/«/g, "\u201C").replace(/»/g, "\u201D") : Array.isArray(v) ? v.map(fix) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fix(x)])) : v;
for (const f of readdirSync(dir).filter((f) => /^\d{2}-.*\.json$/.test(f))) {
  const p = join(dir, f);
  const t = JSON.parse(readFileSync(p, "utf8"));
  const ut = JSON.stringify(fix(t), null, 2) + "\n";
  writeFileSync(p, ut);
}
console.log("ok", dir);
