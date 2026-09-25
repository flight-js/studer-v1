// Gjør innholdet i content/ om til SQL-setninger for Supabase.
//
// Brukes av build-seed.mjs (skriver supabase/seed.sql) og push-supabase.mjs
// (sender setningene rett til databasen). Hver gruppe (katalogen, og så ett
// tema om gangen) kan kjøres for seg, og alt er idempotent: grupper kan
// kjøres om igjen, og et tema erstattes i sin helhet.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../../content/", import.meta.url));
const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));

// SQL-literaler -----------------------------------------------------------------

const str = (s) => (s == null ? "null" : `'${String(s).replace(/'/g, "''")}'`);
const int = (n) => String(Math.trunc(Number(n)));
const bool = (b) => (b ? "true" : "false");
const textArr = (a) => (a.length ? `array[${a.map(str).join(", ")}]::text[]` : "'{}'::text[]");
const intArr = (a) => (a.length ? `array[${a.map(int).join(", ")}]::int[]` : "'{}'::int[]");
const jsonb = (v) => `${str(JSON.stringify(v))}::jsonb`;
const values = (rows) => rows.map((r) => `  (${r.join(", ")})`).join(",\n");

/**
 * @param {{ publiserUtkast?: boolean, fag?: string }} opts
 *   publiserUtkast – publiser temaer uansett status (for testing)
 *   fag            – bare dette faget (id), ellers alle
 * @returns {{ grupper: { navn: string, setninger: string[] }[], stats: object }}
 */
export function seedStatements({ publiserUtkast = false, fag: bareFag } = {}) {
  const grupper = [];
  const katalog = readJson(join(ROOT, "katalog.json"));

  // Trinn og fag -----------------------------------------------------------------

  const fagRows = [];
  const fagMedInnhold = [];
  for (const t of katalog.trinn) {
    t.fag.forEach((f, i) => {
      const dir = join(ROOT, t.id, f.id);
      const meta = existsSync(join(dir, "_fag.json")) ? readJson(join(dir, "_fag.json")) : null;
      if (meta && (!bareFag || meta.id === bareFag)) fagMedInnhold.push({ dir, meta });
      fagRows.push([
        str(f.id), str(t.id), str(f.navn),
        str(meta?.lareplan.kode ?? null), str(meta?.lareplan.url ?? null),
        jsonb(meta?.lareplan.kompetansemaal ?? []), int(i),
      ]);
    });
  }

  grupper.push({
    navn: "Katalog (trinn og fag)",
    setninger: [
      "insert into public.trinn (id, navn, skoleniva, sortering) values\n" +
        values(katalog.trinn.map((t, i) => [str(t.id), str(t.navn), str(t.skoleniva), int(i)])) +
        "\non conflict (id) do update set navn = excluded.navn, skoleniva = excluded.skoleniva, sortering = excluded.sortering;",
      "insert into public.fag (id, trinn_id, navn, lareplan_kode, lareplan_url, kompetansemaal, sortering) values\n" +
        values(fagRows) +
        "\non conflict (id) do update set trinn_id = excluded.trinn_id, navn = excluded.navn, lareplan_kode = excluded.lareplan_kode,\n" +
        "  lareplan_url = excluded.lareplan_url, kompetansemaal = excluded.kompetansemaal, sortering = excluded.sortering;",
    ],
  });

  // Temaer -----------------------------------------------------------------------

  let antallTemaer = 0;
  let antallPublisert = 0;

  for (const { dir, meta } of fagMedInnhold) {
    const temaer = new Map(
      readdirSync(dir)
        .filter((f) => /^\d{2}-.+\.json$/.test(f))
        .map((f) => {
          const t = readJson(join(dir, f));
          return [t.id, t];
        })
    );
    const skrevne = meta.temaer.filter((id) => temaer.has(id));

    // Temaer som er tatt ut av faget, fjernes (innholdet slettes med cascade).
    grupper.push({
      navn: `${meta.name} (${meta.trinnId}): rydd bort fjernede temaer`,
      setninger: [
        `delete from public.temaer where fag_id = ${str(meta.id)}` +
          (skrevne.length ? ` and slug not in (${skrevne.map(str).join(", ")});` : ";"),
      ],
    });

    for (const slug of skrevne) {
      const t = temaer.get(slug);
      const id = `${meta.id}:${slug}`;
      const publisert = publiserUtkast || t.kvalitet.status === "godkjent";
      antallTemaer++;
      if (publisert) antallPublisert++;

      const iMiniprove = new Set(t.miniprove.quizRefs);
      const sporsmal = [
        ...t.quiz.map((q) => ({ ...q, type: "flervalg", iQuiz: true, iMini: iMiniprove.has(q.id) })),
        ...t.miniprove.ekstra.map((q) => ({ ...q, iQuiz: false, iMini: true })),
      ];

      grupper.push({
        navn: `${meta.name}: ${t.name}`,
        setninger: [
          "insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values\n" +
            values([[
              str(id), str(meta.id), str(slug), str(t.name), str(t.intro), intArr(t.kompetansemaal),
              int(meta.temaer.indexOf(slug)), str(t.kvalitet.status), textArr(t.kvalitet.merknader),
              bool(publisert), "now()",
            ]]) +
            "\non conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,\n" +
            "  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,\n" +
            "  publisert = excluded.publisert, oppdatert = excluded.oppdatert;",
          "insert into public.tema_innhold (tema_id, sammendrag, tankekart) values\n" +
            values([[str(id), str(t.sammendrag), jsonb(t.mindmap)]]) +
            "\non conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;",
          `delete from public.flashcards where tema_id = ${str(id)};`,
          "insert into public.flashcards (tema_id, begrep, forklaring, sortering) values\n" +
            values(t.flashcards.map((c, i) => [str(id), str(c.term), str(c.def), int(i)])) + ";",
          `delete from public.quiz_sporsmal where tema_id = ${str(id)};`,
          "insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values\n" +
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
            ) + ";",
          "insert into public.miniprover (tema_id, minutter) values\n" +
            values([[str(id), int(t.miniprove.minutter)]]) +
            "\non conflict (tema_id) do update set minutter = excluded.minutter;",
        ],
      });
    }
  }

  return {
    grupper,
    stats: {
      trinn: katalog.trinn.length,
      fag: fagRows.length,
      temaer: antallTemaer,
      publisert: antallPublisert,
    },
  };
}
