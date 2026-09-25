// Gjør innholdet i content/ om til SQL-setninger for Supabase (brukes av
// build-seed.mjs, som skriver supabase/seed.sql). Hver gruppe (katalogen, og så
// ett tema om gangen) kan kjøres for seg, og alt er idempotent: grupper kan
// kjøres om igjen, og et tema erstattes i sin helhet.

import { pensumRader } from "./pensum-rader.mjs";

// SQL-literaler -----------------------------------------------------------------

const str = (s) => (s == null ? "null" : `'${String(s).replace(/'/g, "''")}'`);
const int = (n) => String(Math.trunc(Number(n)));
const bool = (b) => (b ? "true" : "false");
const textArr = (a) => (a.length ? `array[${a.map(str).join(", ")}]::text[]` : "'{}'::text[]");
const intArr = (a) => (a.length ? `array[${a.map(int).join(", ")}]::int[]` : "'{}'::int[]");
const jsonb = (v) => `${str(JSON.stringify(v))}::jsonb`;
const values = (rows) => rows.map((r) => `  (${r.join(", ")})`).join(",\n");

/**
 * @param {{ publiserUtkast?: boolean, fag?: string[] }} opts  se pensumRader
 * @returns {{ grupper: { navn: string, setninger: string[] }[], stats: object }}
 */
export function seedStatements(opts = {}) {
  const { trinn, fag, innhold, stats } = pensumRader(opts);
  const grupper = [];

  grupper.push({
    navn: "Katalog (trinn og fag)",
    setninger: [
      "insert into public.trinn (id, navn, skoleniva, sortering) values\n" +
        values(trinn.map((t) => [str(t.id), str(t.navn), str(t.skoleniva), int(t.sortering)])) +
        "\non conflict (id) do update set navn = excluded.navn, skoleniva = excluded.skoleniva, sortering = excluded.sortering;",
      "insert into public.fag (id, trinn_id, navn, lareplan_kode, lareplan_url, kompetansemaal, sortering) values\n" +
        values(
          fag.map((f) => [
            str(f.id), str(f.trinn_id), str(f.navn), str(f.lareplan_kode), str(f.lareplan_url),
            jsonb(f.kompetansemaal), int(f.sortering),
          ])
        ) +
        "\non conflict (id) do update set trinn_id = excluded.trinn_id, navn = excluded.navn, lareplan_kode = excluded.lareplan_kode,\n" +
        "  lareplan_url = excluded.lareplan_url, kompetansemaal = excluded.kompetansemaal, sortering = excluded.sortering;",
    ],
  });

  for (const f of innhold) {
    // Temaer som er tatt ut av faget, fjernes (innholdet slettes med cascade).
    grupper.push({
      navn: `${f.navn} (${f.trinnId}): rydd bort fjernede temaer`,
      setninger: [
        `delete from public.temaer where fag_id = ${str(f.fagId)}` +
          (f.slugs.length ? ` and slug not in (${f.slugs.map(str).join(", ")});` : ";"),
      ],
    });

    for (const { tema: t, innhold: inn, flashcards, sporsmal, miniprove } of f.temaer) {
      grupper.push({
        navn: `${f.navn}: ${t.navn}`,
        setninger: [
          "insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values\n" +
            values([[
              str(t.id), str(t.fag_id), str(t.slug), str(t.navn), str(t.intro), intArr(t.kompetansemaal),
              int(t.sortering), str(t.status), textArr(t.merknader), bool(t.publisert), "now()",
            ]]) +
            "\non conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,\n" +
            "  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,\n" +
            "  publisert = excluded.publisert, oppdatert = excluded.oppdatert;",
          "insert into public.tema_innhold (tema_id, sammendrag, tankekart) values\n" +
            values([[str(inn.tema_id), str(inn.sammendrag), jsonb(inn.tankekart)]]) +
            "\non conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;",
          `delete from public.flashcards where tema_id = ${str(t.id)};`,
          "insert into public.flashcards (tema_id, begrep, forklaring, sortering) values\n" +
            values(flashcards.map((c) => [str(c.tema_id), str(c.begrep), str(c.forklaring), int(c.sortering)])) + ";",
          `delete from public.quiz_sporsmal where tema_id = ${str(t.id)};`,
          "insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values\n" +
            values(
              sporsmal.map((q) => [
                str(q.tema_id), str(q.nokkel), str(q.type), str(q.tekst), textArr(q.alternativer),
                int(q.riktig), str(q.forklaring), bool(q.i_quiz), bool(q.i_miniprove), int(q.sortering),
              ])
            ) + ";",
          "insert into public.miniprover (tema_id, minutter) values\n" +
            values([[str(miniprove.tema_id), int(miniprove.minutter)]]) +
            "\non conflict (tema_id) do update set minutter = excluded.minutter;",
        ],
      });
    }
  }

  return { grupper, stats };
}
