// node scripts/innhold/lk20-hent.mjs KODE1 KODE2 … – henter kompetansemål fra Udirs API (data.udir.no)
// og lagrer dem i scripts/innhold/lk20/<KODE>.json.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const DIR = fileURLToPath(new URL("./lk20/", import.meta.url));
const get = async (u) => { const r = await fetch(u, { headers: { accept: "application/json" } }); if (!r.ok) throw new Error(u + " " + r.status); return r.json(); };
const nob = (t) => (t && t.tekst ? nob(t.tekst) : Array.isArray(t) ? (t.find((x) => x.spraak === "nob") ?? t.find((x) => x.spraak === "default") ?? t[0])?.verdi : t);
for (const kode of process.argv.slice(2)) {
  const plan = await get(`https://data.udir.no/kl06/v201906/laereplaner-lk20/${kode}`);
  const sett = [];
  for (const s of plan["kompetansemaal-kapittel"]?.kompetansemaalsett ?? []) {
    const full = s.kompetansemaal ? s : await get(s["url-data"]);
    sett.push({ kode: full.kode ?? s.kode, tittel: nob(full.tittel ?? s.tittel), maal: (full.kompetansemaal ?? []).map((m) => nob(m.tittel)) });
  }
  writeFileSync(`${DIR}${kode}.json`, JSON.stringify({ kode, tittel: nob(plan.tittel), url: `https://www.udir.no/lk20/${kode.toLowerCase()}`, sett }, null, 1));
  console.log(kode, "|", sett.map((s) => `${s.kode} ${s.tittel} (${s.maal.length})`).join("; "));
}
