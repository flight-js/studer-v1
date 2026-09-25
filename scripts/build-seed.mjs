// Skriver supabase/seed.sql fra innholdet i content/.
//
//   npm run content:seed                       – skriver supabase/seed.sql
//   npm run content:seed -- --publiser-utkast  – publiserer også temaer som ikke
//                                                er godkjent ennå (for testing)
//
// Kjøres etter `npm run content:check` (se package.json), så innholdet er
// validert før det gjøres om til SQL. Filen kan kjøres i Supabase sin
// SQL-editor eller med `supabase db reset`. For å sende innholdet rett til
// databasen, se push-supabase.mjs.

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { seedStatements } from "./lib/seed-statements.mjs";

const OUT = fileURLToPath(new URL("../supabase/seed.sql", import.meta.url));
const publiserUtkast = process.argv.includes("--publiser-utkast");

const { grupper, stats } = seedStatements({ publiserUtkast });

const out = [
  "-- Generert av `npm run content:seed` fra content/. Ikke rediger for hånd.",
  `-- ${publiserUtkast ? "Temaer publiseres uansett status (--publiser-utkast)." : "Bare temaer med status «godkjent» publiseres."}`,
  "",
  "begin;",
  "",
];
for (const g of grupper) out.push(`-- ${g.navn}`, ...g.setninger, "");
out.push("commit;", "");

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, out.join("\n"));
console.log(
  `supabase/seed.sql: ${stats.trinn} trinn · ${stats.fag} fag · ${stats.temaer} temaer (${stats.publisert} publisert)`
);
