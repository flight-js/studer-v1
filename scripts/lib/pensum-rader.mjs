// Leser content/ og gjør innholdet om til rader for tabellene i Supabase.
//
// Brukes av seed-statements.mjs (SQL til supabase/seed.sql) og
// import-supabase.mjs (sender radene rett til databasen via API-et).

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../../content/", import.meta.url));
const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));

/**
 * @param {{ publiserUtkast?: boolean, fag?: string[] }} opts
 *   publiserUtkast – publiser temaer uansett status (for testing)
 *   fag            – bare disse fagene (id), ellers alle som har innhold
 */
export function pensumRader({ publiserUtkast = false, fag: bareFag } = {}) {
  const katalog = readJson(join(ROOT, "katalog.json"));

  const trinn = katalog.trinn.map((t, i) => ({
    id: t.id,
    navn: t.navn,
    skoleniva: t.skoleniva,
    sortering: i,
  }));

  const fag = [];
  const fagMedInnhold = [];
  for (const t of katalog.trinn) {
    t.fag.forEach((f, i) => {
      const dir = join(ROOT, t.id, f.id);
      const meta = existsSync(join(dir, "_fag.json")) ? readJson(join(dir, "_fag.json")) : null;
      if (meta && (!bareFag || bareFag.includes(meta.id))) fagMedInnhold.push({ dir, meta });
      fag.push({
        id: f.id,
        trinn_id: t.id,
        navn: f.navn,
        lareplan_kode: meta?.lareplan.kode ?? null,
        lareplan_url: meta?.lareplan.url ?? null,
        kompetansemaal: meta?.lareplan.kompetansemaal ?? [],
        sortering: i,
      });
    });
  }

  let antallTemaer = 0;
  let antallPublisert = 0;

  const innhold = fagMedInnhold.map(({ dir, meta }) => {
    const filer = new Map(
      readdirSync(dir)
        .filter((f) => /^\d{2}-.+\.json$/.test(f))
        .map((f) => {
          const t = readJson(join(dir, f));
          return [t.id, t];
        })
    );
    const slugs = meta.temaer.filter((slug) => filer.has(slug));

    const temaer = slugs.map((slug) => {
      const t = filer.get(slug);
      const id = `${meta.id}:${slug}`;
      const publisert = publiserUtkast || t.kvalitet.status === "godkjent";
      antallTemaer++;
      if (publisert) antallPublisert++;

      const iMiniprove = new Set(t.miniprove.quizRefs);
      const sporsmal = [
        ...t.quiz.map((q) => ({ ...q, type: "flervalg", iQuiz: true, iMini: iMiniprove.has(q.id) })),
        ...t.miniprove.ekstra.map((q) => ({ ...q, iQuiz: false, iMini: true })),
      ];

      return {
        tema: {
          id,
          fag_id: meta.id,
          slug,
          navn: t.name,
          intro: t.intro,
          kompetansemaal: t.kompetansemaal,
          sortering: meta.temaer.indexOf(slug),
          status: t.kvalitet.status,
          merknader: t.kvalitet.merknader,
          publisert,
        },
        innhold: { tema_id: id, sammendrag: t.sammendrag, tankekart: t.mindmap },
        flashcards: t.flashcards.map((c, i) => ({
          tema_id: id,
          begrep: c.term,
          forklaring: c.def,
          sortering: i,
        })),
        sporsmal: sporsmal.map((q, i) => {
          const santUsant = q.type === "sant-usant";
          return {
            tema_id: id,
            nokkel: q.id,
            type: q.type,
            tekst: q.text,
            alternativer: santUsant ? ["Sant", "Usant"] : q.options,
            riktig: santUsant ? (q.correct ? 0 : 1) : q.correct,
            forklaring: q.explain,
            i_quiz: q.iQuiz,
            i_miniprove: q.iMini,
            sortering: i,
          };
        }),
        miniprove: { tema_id: id, minutter: t.miniprove.minutter },
      };
    });

    return { fagId: meta.id, navn: meta.name, trinnId: meta.trinnId, slugs, temaer };
  });

  return {
    trinn,
    fag,
    innhold,
    stats: {
      trinn: trinn.length,
      fag: fag.length,
      temaer: antallTemaer,
      publisert: antallPublisert,
    },
  };
}
