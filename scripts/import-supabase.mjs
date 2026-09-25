// Sender innholdet i content/ rett til Supabase via API-et.
//
//   npm run content:import                            – alle fag med innhold
//   npm run content:import -- kjemi-1 fysikk-1        – bare disse fagene
//   npm run content:import -- --publiser-utkast       – publiser også temaer som
//                                                       ikke er godkjent ennå
//
// Krever SUPABASE_URL og SUPABASE_SECRET_KEY i .env.local (secret-nøkkelen
// omgår RLS og skal aldri inn i git eller frontenden). Kjøres etter
// `npm run content:check` (se package.json), så innholdet er validert først.
//
// Hvert fag erstattes i sin helhet: temaer som er tatt ut av faget slettes, og
// flashcards og spørsmål for hvert tema slettes og settes inn på nytt. Skriptet
// kan trygt kjøres om igjen hvis det stopper halvveis.

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { pensumRader } from "./lib/pensum-rader.mjs";

const ENV = fileURLToPath(new URL("../.env.local", import.meta.url));
if (existsSync(ENV)) {
  for (const linje of readFileSync(ENV, "utf8").split(/\r?\n/)) {
    const m = linje.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
  }
}

const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error("Mangler SUPABASE_URL eller SUPABASE_SECRET_KEY i .env.local.");
  process.exit(1);
}

const args = process.argv.slice(2);
const publiserUtkast = args.includes("--publiser-utkast");
const bareFag = args.filter((a) => !a.startsWith("--"));

const db = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function kjør(beskrivelse, sporring) {
  const { error } = await sporring;
  if (error) throw new Error(`${beskrivelse}: ${error.message}`);
}

const { trinn, fag, innhold, stats } = pensumRader({
  publiserUtkast,
  fag: bareFag.length ? bareFag : undefined,
});

const ukjente = bareFag.filter((id) => !innhold.some((f) => f.fagId === id));
if (ukjente.length) {
  console.error(`Fant ikke innhold for: ${ukjente.join(", ")}`);
  process.exit(1);
}

await kjør("trinn", db.from("trinn").upsert(trinn));
await kjør("fag", db.from("fag").upsert(fag));
console.log(`Katalog: ${trinn.length} trinn · ${fag.length} fag`);

const nå = new Date().toISOString();
for (const f of innhold) {
  const ider = f.temaer.map((t) => t.tema.id);

  let fjern = db.from("temaer").delete().eq("fag_id", f.fagId);
  if (f.slugs.length) fjern = fjern.not("slug", "in", `(${f.slugs.join(",")})`);
  await kjør(`${f.fagId}: fjern gamle temaer`, fjern);

  if (!ider.length) continue;
  await kjør(
    `${f.fagId}: temaer`,
    db.from("temaer").upsert(f.temaer.map((t) => ({ ...t.tema, oppdatert: nå })))
  );
  await kjør(`${f.fagId}: innhold`, db.from("tema_innhold").upsert(f.temaer.map((t) => t.innhold)));
  await kjør(`${f.fagId}: slett flashcards`, db.from("flashcards").delete().in("tema_id", ider));
  await kjør(`${f.fagId}: flashcards`, db.from("flashcards").insert(f.temaer.flatMap((t) => t.flashcards)));
  await kjør(`${f.fagId}: slett spørsmål`, db.from("quiz_sporsmal").delete().in("tema_id", ider));
  await kjør(`${f.fagId}: spørsmål`, db.from("quiz_sporsmal").insert(f.temaer.flatMap((t) => t.sporsmal)));
  await kjør(`${f.fagId}: miniprøver`, db.from("miniprover").upsert(f.temaer.map((t) => t.miniprove)));

  const publisert = f.temaer.filter((t) => t.tema.publisert).length;
  console.log(`${f.navn} (${f.trinnId}): ${ider.length} temaer, ${publisert} publisert`);
}

console.log(`Ferdig: ${stats.temaer} temaer (${stats.publisert} publisert)`);
