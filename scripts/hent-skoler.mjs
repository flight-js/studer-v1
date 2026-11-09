// Henter skoler fra Nasjonalt skoleregister (NSR, data-nsr.udir.no): alle
// aktive skoler med ungdomstrinn (8.–10.) og alle videregående skoler, offentlige
// og private. Rene barneskoler og voksenopplæring er ikke med.
//
//   npm run skoler
//
// Lager to filer med de samme skolene:
//   public/skoler.json   – skolevelgeren søker i denne (lastes ned ved første søk)
//   supabase/skoler.sql  – tabellen skoler, som profiles.skole_id peker på; lastes
//                          inn etter migrasjonen 20261109120000_konkurranse.sql
//
// Kjør på nytt en gang i året (nye og nedlagte skoler), eller når noen savner
// skolen sin, og kjør skoler.sql på nytt i Supabase.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const API = "https://data-nsr.udir.no/v4";
const UT_SQL = fileURLToPath(new URL("../supabase/skoler.sql", import.meta.url));
const UT_JSON = fileURLToPath(new URL("../public/skoler.json", import.meta.url));
const SAMTIDIGE = 8;
// Noen grunnskoler (rundt 90) mangler trinn i NSR. De tas med som «trinn ukjent»
// når de ser ut som en skole med ansatte – heller en barneskole for mye i søket
// enn en ungdomsskole som mangler. Administrasjon, voksenopplæring, tiltak og
// rene barneskoler holdes utenfor. Begge listene skrives ut til slutt.
const UNGDOM_I_NAVNET = /ungdomssk[ou]le|ungdomstrinn/i;
const IKKE_EN_SKOLE =
  /kommune|felles|administrasjon|voksenoppl|vikar|team\b|rådgjevar|rådgiver|morsmål|innføring|spesial|tiltak|migrasjon|barnesk[ou]le|læringsmiljø|kunnskapspark|skoleutvikling|newton|omsorgssenter|særskilt|hospital/i;

// Registeret har med juridiske tillegg («Stiftelsen …», «… AS», «… Sti»,
// «avd Undervisning»). Elevene kjenner skolen uten dem. Avdelinger med stedsnavn
// («Nesna skole avd Tomma») beholdes.
const ryddNavn = (navn) => {
  let n = navn.trim().replace(/\s+/g, " ");
  for (let forrige = ""; forrige !== n; ) {
    forrige = n;
    n = n
      .replace(/^stiftelsen\s+/i, "")
      .replace(/\s+(AS|SA|A\/S|Sti|stiftelsen)$/i, "")
      .replace(/\s+(avd\.?|avdeling)\s+(skole|skule|undervisning)$/i, "")
      .trim();
  }
  return n.charAt(0).toUpperCase() + n.slice(1);
};

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
const feil = [];
const ukjentTrinn = [];
const utenTrinn = [];
let barneskoler = 0;
let ferdig = 0;
const ko = [...kandidater];
await Promise.all(
  Array.from({ length: SAMTIDIGE }, async () => {
    for (let e = ko.shift(); e; e = ko.shift()) {
      try {
        const d = await hent(`/enhet/${e.Organisasjonsnummer}`);
        const til = d.SkoletrinnGSTil ?? 0;
        const ungdom = d.ErGrunnskole && (til > 0 ? til >= 8 : UNGDOM_I_NAVNET.test(d.Navn));
        const vgs = d.ErVideregaaendeSkole;
        const navn = `${d.Organisasjonsnummer} ${d.Navn.trim()}`;
        let ukjent = false;
        if (!ungdom && !vgs) {
          if (d.ErGrunnskole && til === 0) {
            ukjent = !IKKE_EN_SKOLE.test(d.Navn) && (d.AntallAnsatte ?? 0) > 0;
            (ukjent ? ukjentTrinn : utenTrinn).push(`${navn} (${d.AntallAnsatte ?? 0} ansatte)`);
          } else barneskoler++;
        }
        if (ungdom || vgs || ukjent) {
          skoler.push({
            id: d.Organisasjonsnummer,
            navn: ryddNavn(d.Navn),
            kommune: (d.Kommune?.Navn ?? "").split(" - ")[0].trim(),
            fylke: (d.Fylke?.Navn ?? "").split(" - ")[0].trim(),
            ungdomstrinn: !!ungdom,
            vgs: !!vgs,
          });
        }
      } catch (err) {
        feil.push(`${e.Organisasjonsnummer} ${e.Navn}: ${err.message}`);
      }
      process.stdout.write(`\rDetaljer: ${++ferdig} av ${kandidater.length}, ${skoler.length} skoler`);
    }
  }),
);
console.log();

// En halv liste er verre enn en gammel: da forsvinner skoler fra søket.
if (feil.length) {
  console.error(`\nFikk ikke hentet ${feil.length} skoler, så filene er ikke endret. Kjør på nytt:`);
  for (const f of feil) console.error(`  ${f}`);
  process.exit(1);
}

skoler.sort(
  (a, b) => a.navn.localeCompare(b.navn, "nb") || a.kommune.localeCompare(b.kommune, "nb") || a.id.localeCompare(b.id),
);
// Noen skoler står dobbelt i registeret (to enheter med samme navn og kommune).
// Behold én, så elevene ikke deles på to i skolelista.
for (let i = skoler.length - 1; i > 0; i--) {
  const [a, b] = [skoler[i - 1], skoler[i]];
  if (a.navn !== b.navn || a.kommune !== b.kommune) continue;
  a.ungdomstrinn ||= b.ungdomstrinn;
  a.vgs ||= b.vgs;
  skoler.splice(i, 1);
  console.log(`Slo sammen ${b.id} med ${a.id} (${a.navn}, ${a.kommune})`);
}

// Skolevelgeren: én skole per linje, så endringer er lette å se i git.
writeFileSync(
  UT_JSON,
  `[\n${skoler.map((s) => JSON.stringify({ id: s.id, navn: s.navn, kommune: s.kommune })).join(",\n")}\n]\n`,
);

const q = (s) => `'${s.replaceAll("'", "''")}'`;
const rader = skoler.map(
  (s) => `  (${q(s.id)}, ${q(s.navn)}, ${q(s.kommune)}, ${q(s.fylke)}, ${s.ungdomstrinn}, ${s.vgs})`,
);
writeFileSync(
  UT_SQL,
  `-- Generert av scripts/hent-skoler.mjs fra Nasjonalt skoleregister (NSR) ${new Date().toISOString().slice(0, 10)}.
-- Skoler med ungdomstrinn og videregående skoler. Grunnskoler uten trinn i NSR
-- har ungdomstrinn = false og vgs = false. Ikke rediger for hånd.

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
console.log(
  `Skrev ${skoler.length} skoler (${skoler.filter((s) => s.ungdomstrinn).length} med ungdomstrinn, ` +
    `${skoler.filter((s) => s.vgs).length} videregående, ${ukjentTrinn.length} med ukjent trinn) ` +
    `til public/skoler.json og supabase/skoler.sql`,
);
console.log(`Ikke med: ${barneskoler} barneskoler og andre uten ungdomstrinn eller vgs.`);
console.log(`\nMed, men trinn ukjent i NSR (${ukjentTrinn.length}):`);
for (const s of ukjentTrinn) console.log(`  ${s}`);
console.log(`\nIkke med, trinn ukjent og ser ikke ut som en skole (${utenTrinn.length}):`);
for (const s of utenTrinn) console.log(`  ${s}`);
