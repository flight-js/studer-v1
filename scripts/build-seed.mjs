// Gjør innholdet i content/ om til SQL som kan kjøres mot Supabase.
//
//   npm run content:seed                     – skriver supabase/seed.sql
//   npm run content:seed -- --publiser-utkast – publiserer også temaer som ikke
//                                              er godkjent ennå (for testing)
//
// Kjøres etter `npm run content:check` (se package.json), så innholdet er
// validert før det gjøres om til SQL. Skriptet er idempotent: det kan kjøres
// om igjen, og hvert tema erstattes i sin helhet.

import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../content/", import.meta.url));
const OUT = fileURLToPath(new URL("../supabase/seed.sql", import.meta.url));
const publiserUtkast = process.argv.includes("--publiser-utkast");

const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));

// SQL-literaler ---------------------------------------------------------------

const str = (s) => (s == null ? "null" : `'${String(s).replace(/'/g, "''")}'`);
const int = (n) => String(Math.trunc(Number(n)));
const bool = (b) => (b ? "true" : "false");
const textArr = (a) => (a.length ? `array[${a.map(str).join(", ")}]::text[]` : "'{}'::text[]");
const intArr = (a) => (a.length ? `array[${a.map(int).join(", ")}]::int[]` : "'{}'::int[]");
const jsonb = (v) => `${str(JSON.stringify(v))}::jsonb`;
const values = (rows) => rows.map((r) => `  (${r.join(", ")})`).join(",\n");

const out = [
  "-- Generert av `npm run content:seed` fra content/. Ikke rediger for hånd.",
  `-- ${publiserUtkast ? "Temaer publiseres uansett status (--publiser-utkast)." : "Bare temaer med status «godkjent» publiseres."}`,
  "",
  "begin;",
  "",
];

// Trinn og fag fra katalogen ----------------------------------------------------

const katalog = readJson(join(ROOT, "katalog.json"));

out.push("insert into public.trinn (id, navn, skoleniva, sortering) values");
out.push(values(katalog.trinn.map((t, i) => [str(t.id), str(t.navn), str(t.skoleniva), int(i)])));
out.push(
  "on conflict (id) do update set navn = excluded.navn, skoleniva = excluded.skoleniva, sortering = excluded.sortering;",
  ""
);

const fagRows = [];
const fagMedInnhold = [];
for (const t of katalog.trinn) {
  t.fag.forEach((f, i) => {
    const dir = join(ROOT, t.id, f.id);
    const meta = existsSync(join(dir, "_fag.json")) ? readJson(join(dir, "_fag.json")) : null;
    if (meta) fagMedInnhold.push({ dir, meta });
    fagRows.push([
      str(f.id),
      str(t.id),
      str(f.navn),
      str(meta?.lareplan.kode ?? null),
      str(meta?.lareplan.url ?? null),
      jsonb(meta?.lareplan.kompetansemaal ?? []),
      int(i),
    ]);
  });
}

out.push("insert into public.fag (id, trinn_id, navn, lareplan_kode, lareplan_url, kompetansemaal, sortering) values");
out.push(values(fagRows));
out.push(
  "on conflict (id) do update set trinn_id = excluded.trinn_id, navn = excluded.navn, lareplan_kode = excluded.lareplan_kode,",
  "  lareplan_url = excluded.lareplan_url, kompetansemaal = excluded.kompetansemaal, sortering = excluded.sortering;",
  ""
);

// Temaer ------------------------------------------------------------------------

let antallTemaer = 0;
let antallPublisert = 0;

for (const { dir, meta } of fagMedInnhold) {
  const files = readdirSync(dir).filter((f) => /^\d{2}-.+\.json$/.test(f));
  const temaer = new Map(files.map((f) => {
    const t = readJson(join(dir, f));
    return [t.id, t];
  }));
  const skrevne = meta.temaer.filter((id) => temaer.has(id));

  out.push(`-- ${meta.name} (${meta.trinnId}) ${"-".repeat(Math.max(0, 60 - meta.name.length))}`, "");

  // Temaer som er tatt ut av faget, fjernes (innholdet slettes med cascade).
  out.push(
    `delete from public.temaer where fag_id = ${str(meta.id)}` +
      (skrevne.length ? ` and slug not in (${skrevne.map(str).join(", ")});` : ";"),
    ""
  );

  for (const slug of skrevne) {
    const t = temaer.get(slug);
    const id = `${meta.id}:${slug}`;
    const publisert = publiserUtkast || t.kvalitet.status === "godkjent";
    antallTemaer++;
    if (publisert) antallPublisert++;

    out.push(`-- ${t.name}`);
    out.push(
      "insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values",
      values([[
        str(id), str(meta.id), str(slug), str(t.name), str(t.intro), intArr(t.kompetansemaal),
        int(meta.temaer.indexOf(slug)), str(t.kvalitet.status), textArr(t.kvalitet.merknader),
        bool(publisert), "now()",
      ]]),
      "on conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,",
      "  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,",
      "  publisert = excluded.publisert, oppdatert = excluded.oppdatert;"
    );

    out.push(
      "insert into public.tema_innhold (tema_id, sammendrag, tankekart) values",
      values([[str(id), str(t.sammendrag), jsonb(t.mindmap)]]),
      "on conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;"
    );

    out.push(
      `delete from public.flashcards where tema_id = ${str(id)};`,
      "insert into public.flashcards (tema_id, begrep, forklaring, sortering) values",
      values(t.flashcards.map((c, i) => [str(id), str(c.term), str(c.def), int(i)])) + ";"
    );

    const iMiniprove = new Set(t.miniprove.quizRefs);
    const sporsmal = [
      ...t.quiz.map((q) => ({ ...q, type: "flervalg", iQuiz: true, iMini: iMiniprove.has(q.id) })),
      ...t.miniprove.ekstra.map((q) => ({ ...q, iQuiz: false, iMini: true })),
    ];
    out.push(
      `delete from public.quiz_sporsmal where tema_id = ${str(id)};`,
      "insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values",
      values(
        sporsmal.map((q, i) => {
          const santUsant = q.type === "sant-usant";
          return [
            str(id), str(q.id), str(q.type), str(q.text),
            textArr(santUsant ? ["Sant", "Usant"] : q.options),
            int(santUsant ? (q.correct ? 0 : 1) : q.correct),
            str(q.explain), bool(q.iQuiz), bool(q.iMini), int(i),
          ];
        })
      ) + ";"
    );

    out.push(
      "insert into public.miniprover (tema_id, minutter) values",
      values([[str(id), int(t.miniprove.minutter)]]),
      "on conflict (tema_id) do update set minutter = excluded.minutter;",
      ""
    );
  }
}

out.push("commit;", "");

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, out.join("\n"));
console.log(
  `supabase/seed.sql: ${katalog.trinn.length} trinn · ${fagRows.length} fag · ` +
    `${antallTemaer} temaer (${antallPublisert} publisert)`
);
