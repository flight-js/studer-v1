// Skriver ordlistene for kallenavn fra src/lib/kallenavn.ts inn i
// databasefunksjonene kallenavn_delord, kallenavn_forstavelser og
// kallenavn_helord i migrasjonen, så appen og databasen alltid har de samme
// listene.
//
//   npm run kallenavn:sql
//
// Mens migrasjonen er et utkast (ikke kjørt), skrives den om direkte. Er den
// kjørt, lag en ny migrasjon med «create or replace function» for de tre
// funksjonene i stedet (skriptet skriver dem ut med --ny).

import { readFileSync, writeFileSync } from "node:fs";

const TS = new URL("../src/lib/kallenavn.ts", import.meta.url);
const MIGRASJON = new URL("../supabase/migrations/20261109120000_konkurranse.sql", import.meta.url);

const ts = readFileSync(TS, "utf8");
const liste = (navn) => {
  const m = ts.match(new RegExp(`const ${navn} = \\[([\\s\\S]*?)\\];`));
  if (!m) throw new Error(`Fant ikke ${navn} i kallenavn.ts`);
  return [...m[1].replace(/\/\/.*$/gm, "").matchAll(/"([^"]+)"/g)].map((x) => x[1]);
};

function sqlListe(ord) {
  for (const o of ord) if (!/^[a-z0-9]+$/.test(o)) throw new Error(`Ugyldig ord for SQL: ${o}`);
  const linjer = [];
  let linje = "";
  for (const o of ord.map((x) => `'${x}'`)) {
    if ((linje + o).length > 100) {
      linjer.push(linje.trimEnd());
      linje = "";
    }
    linje += `${o}, `;
  }
  linjer.push(linje.replace(/, $/, ""));
  return `  select array[\n    ${linjer.join("\n    ")}\n  ];\n`;
}

const lister = { delord: liste("DELORD"), forstavelser: liste("FORSTAVELSER"), helord: liste("HELORD") };

if (process.argv.includes("--ny")) {
  for (const [navn, ord] of Object.entries(lister)) {
    console.log(`create or replace function public.kallenavn_${navn}()
returns text[]
language sql
immutable
set search_path = ''
as $$
${sqlListe(ord)}$$;
`);
  }
  process.exit(0);
}

const crlf = readFileSync(MIGRASJON, "utf8").includes("\r\n");
let sql = readFileSync(MIGRASJON, "utf8").replace(/\r\n/g, "\n");
for (const [navn, ord] of Object.entries(lister)) {
  const re = new RegExp(`(create function public\\.kallenavn_${navn}\\(\\)[\\s\\S]*?as \\$\\$\\n)  select array\\[[\\s\\S]*?\\];\\n(\\$\\$;)`);
  if (!re.test(sql)) throw new Error(`Fant ikke kallenavn_${navn}() i migrasjonen`);
  sql = sql.replace(re, (_, start, slutt) => start + sqlListe(ord) + slutt);
}
writeFileSync(MIGRASJON, crlf ? sql.replace(/\n/g, "\r\n") : sql);
console.log(`Oppdaterte migrasjonen: ${lister.delord.length} delord, ${lister.forstavelser.length} forstavelser, ${lister.helord.length} helord.`);
