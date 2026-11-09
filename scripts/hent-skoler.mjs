// Henter skoler fra Nasjonalt skoleregister (NSR, data-nsr.udir.no) og lager
// supabase/skoler.sql med en rad per skole eleven kan velge i «Konkurranse»:
// skoler med ungdomstrinn (8.–10.) og videregående skoler. Rene barneskoler og
// voksenopplæring er ikke med.
//
//   npm run skoler
//
// Kjør på nytt en gang i året, eller når noen savner skolen sin. Filen lastes
// inn etter migrasjonen 20261109120000_konkurranse.sql.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const API = "https://data-nsr.udir.no/v4";
const UT = fileURLToPath(new URL("../supabase/skoler.sql", import.meta.url));
const SAMTIDIGE = 8;

const hent = async (sti, forsok = 3) => {
  for (let i = 1; ; i++) {
    try {
      const r = await fetch(API + sti, { headers: { accept: "application/json" } });
      if (!r.ok) throw new Error(`${sti}: ${r.status}`);
      return await r.json();
    } catch (e) {
      if (i >= forsok) throw e;
      await new Promise((ok) => setTimeout(ok, 1000 * i));
    }
  }
};

// 1. Alle enheter, side for side.
const enheter = [];
for (let side = 1; ; side++) {
  const s = await hent(`/enheter?antallPerSide=1000&sidenummer=${side}`);
  enheter.push(...s.EnhetListe);
  process.stdout.write(`\rEnheter: ${enheter.length} av ${s.TotaltAntallEnheter}`);
  if (side >= s.AntallSider) break;
}
console.log();

const erVoksenoppl = (e) => (e.Skolekategorier ?? []).some((k) => k.Id === "10");
const kandidater = enheter.filter(
  (e) => e.ErAktiv && e.ErSkole && (e.ErGrunnskole || e.ErVideregaaendeSkole) && !erVoksenoppl(e),
);

// 2. Detaljer (trinn og kommune) for hver kandidat.
const skoler = [];
let ferdig = 0;
const ko = [...kandidater];
await Promise.all(
  Array.from({ length: SAMTIDIGE }, async () => {
    for (let e = ko.shift(); e; e = ko.shift()) {
      try {
        const d = await hent(`/enhet/${e.Organisasjonsnummer}`);
        const ungdom = d.ErGrunnskole && (d.SkoletrinnGSTil ?? 0) >= 8;
        const vgs = d.ErVideregaaendeSkole;
        if (ungdom || vgs) {
          skoler.push({
            id: d.Organisasjonsnummer,
            navn: d.Navn.trim(),
            kommune: (d.Kommune?.Navn ?? "").split(" - ")[0].trim(),
            fylke: (d.Fylke?.Navn ?? "").split(" - ")[0].trim(),
            ungdomstrinn: !!ungdom,
            vgs: !!vgs,
          });
        }
      } catch (err) {
        console.error(`\nHoppet over ${e.Organisasjonsnummer} ${e.Navn}: ${err.message}`);
      }
      process.stdout.write(`\rDetaljer: ${++ferdig} av ${kandidater.length}, ${skoler.length} skoler`);
    }
  }),
);
console.log();

skoler.sort((a, b) => a.navn.localeCompare(b.navn, "nb") || a.kommune.localeCompare(b.kommune, "nb"));
const q = (s) => `'${s.replaceAll("'", "''")}'`;
const rader = skoler.map(
  (s) => `  (${q(s.id)}, ${q(s.navn)}, ${q(s.kommune)}, ${q(s.fylke)}, ${s.ungdomstrinn}, ${s.vgs})`,
);
writeFileSync(
  UT,
  `-- Generert av scripts/hent-skoler.mjs fra Nasjonalt skoleregister (NSR) ${new Date().toISOString().slice(0, 10)}.
-- Skoler med ungdomstrinn og videregående skoler. Ikke rediger for hånd.

insert into public.skoler (id, navn, kommune, fylke, ungdomstrinn, vgs) values
${rader.join(",\n")}
on conflict (id) do update set
  navn = excluded.navn,
  kommune = excluded.kommune,
  fylke = excluded.fylke,
  ungdomstrinn = excluded.ungdomstrinn,
  vgs = excluded.vgs,
  aktiv = true;
`,
);
console.log(`Skrev ${skoler.length} skoler (${skoler.filter((s) => s.ungdomstrinn).length} med ungdomstrinn, ${skoler.filter((s) => s.vgs).length} videregående) til supabase/skoler.sql`);
