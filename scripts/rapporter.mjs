// Viser rapportene elevene har sendt om kort og spørsmål («Har ikke lært
// dette», «Noe er feil», «For vanskelig»), samlet per kort/spørsmål med de
// mest rapporterte først.
//
//   npm run content:rapporter              – alle rapporter
//   npm run content:rapporter -- --dager 7 – bare siste 7 dager
//
// Krever SUPABASE_URL og SUPABASE_SECRET_KEY i .env.local. Viser aldri hvem
// som har rapportert.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const ROOT = fileURLToPath(new URL("../content/", import.meta.url));
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

const GRUNN = { "ikke-laert": "har ikke lært", feil: "feil", "for-vanskelig": "for vanskelig" };

// Henter i sider på 1000, som er grensen per spørring.
async function hentRader() {
  const rader = [];
  for (let fra = 0; ; fra += 1000) {
    let q = db.from("rapporter").select("tema_id, type, nokkel, grunn").order("id").range(fra, fra + 999);
    if (dager) q = q.gte("opprettet", new Date(Date.now() - dager * 86_400_000).toISOString());
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    rader.push(...data);
    if (data.length < 1000) return rader;
  }
}

// Temanavn og teksten til spørsmålene og oppgavene, fra innholdsfilene.
function lesTekster() {
  const tekster = new Map();
  const dirs = (p) => readdirSync(p).filter((d) => statSync(join(p, d)).isDirectory());
  for (const trinn of dirs(ROOT)) {
    for (const fag of dirs(join(ROOT, trinn))) {
      for (const fil of readdirSync(join(ROOT, trinn, fag)).filter((f) => /^\d{2}-.+\.json$/.test(f))) {
        const t = JSON.parse(readFileSync(join(ROOT, trinn, fag, fil), "utf8"));
        const id = `${fag}:${t.id}`;
        tekster.set(id, `${t.name} · content/${trinn}/${fag}/${fil}`);
        for (const q of [...t.quiz, ...t.miniprove.ekstra, ...(t.miniprove.skriv ?? [])]) tekster.set(`${id}|${q.id}`, q.text);
      }
    }
  }
  return tekster;
}

function vis(rader) {
  const tekster = lesTekster();
  const grupper = new Map();
  for (const r of rader) {
    const nokkel = `${r.tema_id}|${r.type}|${r.nokkel}`;
    const g = grupper.get(nokkel) ?? { ...r, antall: 0, grunner: {} };
    g.antall++;
    g.grunner[r.grunn] = (g.grunner[r.grunn] ?? 0) + 1;
    grupper.set(nokkel, g);
  }

  const sortert = [...grupper.values()].sort((a, b) => b.antall - a.antall);
  console.log(`${rader.length} rapporter om ${sortert.length} kort og spørsmål${dager ? ` (siste ${dager} dager)` : ""}\n`);
  for (const g of sortert) {
    const hva =
      g.type === "flashcard"
        ? `begrep «${g.nokkel}»`
        : `${g.nokkel}: ${tekster.get(`${g.tema_id}|${g.nokkel}`) ?? "(finnes ikke lenger)"}`;
    const grunner = Object.entries(g.grunner)
      .map(([k, n]) => `${GRUNN[k] ?? k} ×${n}`)
      .join(", ");
    console.log(`${g.antall}× ${hva}\n   ${grunner} · ${tekster.get(g.tema_id) ?? g.tema_id}`);
  }
}

// Ikke process.exit() etter nettkall: Node på Windows kan krasje når den
// avslutter mens en forbindelse fortsatt er åpen.
const rader = await hentRader();
if (rader.length) vis(rader);
else console.log(dager ? `Ingen rapporter de siste ${dager} dagene.` : "Ingen rapporter ennå.");
