// Viser forslagene brukerne har sendt inn (nytt innhold, nye funksjoner,
// forbedringer), nyeste først og gruppert etter type.
//
//   npm run forslag              – alle forslag
//   npm run forslag -- --dager 7 – bare siste 7 dager
//
// Krever SUPABASE_URL og SUPABASE_SECRET_KEY i .env.local. Viser aldri hvem
// som har sendt forslaget.

import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

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
const dager = args.includes("--dager") ? Number(args[args.indexOf("--dager") + 1]) : null;

const db = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const TYPER = {
  innhold: "Nytt fag eller tema",
  funksjon: "Ny funksjon",
  forbedring: "Noe som kan bli bedre",
  annet: "Annet",
};

// Henter i sider på 1000, som er grensen per spørring.
async function hentForslag() {
  const rader = [];
  for (let fra = 0; ; fra += 1000) {
    let q = db.from("forslag").select("type, tekst, opprettet").order("opprettet", { ascending: false }).range(fra, fra + 999);
    if (dager) q = q.gte("opprettet", new Date(Date.now() - dager * 86_400_000).toISOString());
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    rader.push(...data);
    if (data.length < 1000) return rader;
  }
}

// Ikke process.exit() etter nettkall: Node på Windows kan krasje når den
// avslutter mens en forbindelse fortsatt er åpen.
const rader = await hentForslag();
if (!rader.length) {
  console.log(dager ? `Ingen forslag de siste ${dager} dagene.` : "Ingen forslag ennå.");
} else {
  console.log(`${rader.length} forslag${dager ? ` de siste ${dager} dagene` : ""}\n`);
  for (const [type, navn] of Object.entries(TYPER)) {
    const gruppe = rader.filter((r) => r.type === type);
    if (!gruppe.length) continue;
    console.log(`## ${navn} (${gruppe.length})`);
    for (const r of gruppe) {
      const dato = new Date(r.opprettet).toLocaleDateString("nb-NO", { day: "numeric", month: "short" });
      console.log(`- ${dato}: ${r.tekst.replace(/\s+/g, " ")}`);
    }
    console.log("");
  }
}
