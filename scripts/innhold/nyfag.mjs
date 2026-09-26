// node scripts/innhold/nyfag.mjs <trinnId> <fagId> <planKode> <settKode> slug1 slug2 ...
// Skriver content/<trinn>/<fag>/_fag.json med kompetansemål fra lk20/<plan>.json.
// Beholder eventuelle «kort»-etiketter fra en eksisterende fil.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
const ROOT = fileURLToPath(new URL("../../content/", import.meta.url));
const [trinnId, fagId, plan, settKode, ...temaer] = process.argv.slice(2);
const lk = JSON.parse(readFileSync(fileURLToPath(new URL(`./lk20/${plan}.json`, import.meta.url)), "utf8"));
const sett = lk.sett.find((s) => s.kode === settKode);
if (!sett) throw new Error(`Fant ikke sett ${settKode} i ${plan}: ${lk.sett.map((s) => s.kode + " " + s.tittel).join(" | ")}`);
const katalog = JSON.parse(readFileSync(ROOT + "katalog.json", "utf8"));
const fag = katalog.trinn.find((t) => t.id === trinnId).fag.find((f) => f.id === fagId);
const dir = `${ROOT}${trinnId}/${fagId}`;
const fil = `${dir}/_fag.json`;
const gammel = existsSync(fil) ? JSON.parse(readFileSync(fil, "utf8")) : null;
const ut = {
  id: fagId,
  trinnId,
  name: fag.navn,
  lareplan: {
    kode: plan,
    url: `https://www.udir.no/lk20/${plan.toLowerCase()}/kompetansemaal-og-vurdering/${settKode.toLowerCase()}`,
    kompetansemaal: sett.maal.map((tekst, i) => {
      const kort = gammel?.lareplan.kompetansemaal.find((k) => k.nr === i + 1)?.kort;
      return kort ? { nr: i + 1, kort, tekst } : { nr: i + 1, tekst };
    }),
  },
  temaer: temaer.length ? temaer : gammel?.temaer ?? [],
};
mkdirSync(dir, { recursive: true });
writeFileSync(fil, JSON.stringify(ut, null, 2) + "\n");
console.log(`${fil}: ${ut.lareplan.kompetansemaal.length} mål, ${ut.temaer.length} temaer`);
