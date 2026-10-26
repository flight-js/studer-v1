// Leser content/ og gjør innholdet om til rader for tabellene i Supabase.
//
// Brukes av seed-statements.mjs (SQL til supabase/seed.sql) og
// import-supabase.mjs (sender radene rett til databasen via API-et).

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../../content/", import.meta.url));
const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));

// Samme formel skrevet litt ulikt (mellomrom, gangetegn, minus, fet skrift)
// regnes som lik. Brukes også av lag-formler.mjs.
export const normaliserFormel = (s) =>
  s
    .replace(/\*\*/g, "")
    .replace(/[\s\u00a0\u202f]/g, "")
    .replace(/[*×⋅•]/g, "·")
    .replace(/[−–]/g, "-");

// Formelmatchen skal bare ha formler skrevet med symboler, ikke med ord
// («Utbytte i prosent = faktisk utbytte / …» er ute). Tre bokstaver på rad er
// greit (sin, log, lim, mol, pOH, E_kin), fire eller flere regnes som ord.
// Navnet på en formel skrives som en setning: «Integral av sinus», ikke «Integral
// Av Sinus». Egennavn (Celsius, Eulers metode, de Broglie) beholder stor bokstav.
const EGENNAVN = /^(Fahrenheit|Celsius|Kelvin|Eulers?|Newtons?|Pytagoras'?|Broglie|Hardy|Weinberg|Ohms?|Coulombs?|Avogadros?|Plancks?|Einsteins?|Keplers?|Hookes?|Bohrs?|Gauss)\b/;
export const somSetning = (navn) =>
  navn
    .split(" ")
    .map((ord, i) => (i === 0 || EGENNAVN.test(ord) ? ord : ord.replace(/^([A-ZÆØÅ])(?=[a-zæøå])/, (b) => b.toLowerCase())))
    .join(" ");

// Venstresiden må si hva formelen er. «f(x) = a · bˣ» og «N(t) = K/(1 + a · e⁻ᵏᵗ)»
// har bare et funksjonsnavn til venstre, så alle slike brikker passer med alle
// funksjonsuttrykk – det er ingenting å koble.
const GENERISK = /^(?:[fghN]\([xt]\)|r⃗?\(t\))$/;
export const harGeneriskVenstreside = (f) => GENERISK.test(f.venstre.replace(/\s/g, ""));

const FUNKSJONER = new Set(["arcsin", "arccos", "arctan", "sinh", "cosh", "tanh"]);
export const erSymbolformel = (f) =>
  [f.venstre, f.hoyre].every((side) =>
    (side.match(/[A-Za-zÆØÅæøå]{4,}/g) ?? []).every((ord) => FUNKSJONER.has(ord.toLowerCase()))
  );

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

    // Temasiden viser formelmatchen bare når minst tre formler har ulik venstreside
    // (samme tekst kan bare stå én gang per brett, se src/lib/formelmatch.ts).
    const spillbare = (liste) =>
      new Set(liste.map((f) => normaliserFormel(f.venstre))).size >= 3 ? liste.length : 0;

    // Formlene til formelmatchen. Repetisjonstemaet får formlene fra alle
    // temaene i faget, hver formel én gang.
    const formler = (slug) => {
      if (slug !== "repetisjon") return filer.get(slug).formler ?? [];
      const sett = new Set();
      // tema: hvilket tema formelen kommer fra, så eleven kan velge temaer før runden.
      return slugs
        .filter((s) => s !== "repetisjon")
        .flatMap((s) => (filer.get(s).formler ?? []).map((f) => ({ ...f, tema: filer.get(s).name })))
        .filter((f) => {
          const k = normaliserFormel(`${f.venstre}=${f.hoyre}`);
          if (sett.has(k)) return false;
          sett.add(k);
          return true;
        });
    };

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
          antall_formler: spillbare(formler(slug)),
        },
        innhold: { tema_id: id, sammendrag: t.sammendrag, tankekart: t.mindmap, formler: formler(slug) },
        flashcards: t.flashcards.map((c, i) => ({
          tema_id: id,
          begrep: c.term,
          forklaring: c.def,
          kjerne: !c.niva,
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
            kjerne: !q.niva,
            sortering: i,
          };
        }),
        miniprove: { tema_id: id, minutter: t.miniprove.minutter },
        skriveoppgaver: (t.miniprove.skriv ?? []).map((s, i) => ({
          tema_id: id,
          nokkel: s.id,
          tekst: s.text,
          fasit: s.fasit,
          kriterier: s.kriterier,
          kjerne: !s.niva,
          sortering: i,
        })),
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
