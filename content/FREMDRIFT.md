# Fremdrift: studieinnhold

Status for arbeidet med å lage innhold til alle 72 fag (8. trinn–Vg3), og hvordan man fortsetter.

## Ferdig (lastet inn i Supabase, publisert som utkast)

| Fag | Temaer |
| --- | --- |
| Kjemi 1 (vg2) | 11 |
| Matematikk 8, 9, 10 | 8 + 8 + 9 |
| Norsk 8, 9, 10 | 7 + 7 + 7 |
| Engelsk 8, 9, 10 | 6 + 6 + 7 |
| Naturfag 8, 9, 10 | 7 + 7 + 6 |

**Påbegynt:** Samfunnsfag 8 (2 av 7 temaer skrevet: `metoder-og-kilder`, `identitet-og-fellesskap`).

## Arbeidsflyt per fag

```bash
node scripts/innhold/maal.mjs SAF01-05 KV1151                       # les kompetansemålene
node scripts/innhold/nyfag.mjs 8 samfunnsfag-8 SAF01-05 KV1151 slug1 slug2 …   # lag _fag.json
# skriv content/<trinn>/<fag>/NN-<slug>.json, ett tema per fil (se types.ts)
node scripts/check-content.mjs 8/samfunnsfag-8                        # valider
node scripts/innhold/balanser.mjs <fil>                               # ved skjev fordeling av riktig svar
node scripts/innhold/engquotes.mjs content/<trinn>/<fag>              # engelskfag: «» → “”
node scripts/import-supabase.mjs --publiser-utkast samfunnsfag-8      # last inn
```

Til slutt: kjør `node scripts/check-content.mjs` uten filter (skriver full GJENNOMGANG.md) og `node scripts/build-seed.mjs`.

Mal per tema: sammendrag 330–420 ord (`##`-titler, `- `-lister, `**fet**`), 15 flashcards, 10 quiz (4 alternativer, riktig svar spredt på A–D), tankekart med 4–5 greiner, miniprøve med 8 quizRefs + 7 ekstra (4 sant/usant + 3 flervalg), 15 minutter, status «utkast» (eller «sjekkes» med merknader ved tall/fakta som kan endre seg). Forklaringer starter aldri med «Riktig». Bokmål; engelskfag skrives på engelsk.

## Gjeldende læreplaner (høsten 2026) og kompetansemålsett

Kompetansemålene ligger i `scripts/innhold/lk20/` (hent flere med `lk20-hent.mjs`).

| Fag i katalogen | Plan | Sett |
| --- | --- | --- |
| norsk-8/9/10 | NOR01-08 | KV1110 |
| matematikk-8/9/10 | MAT01-06 | KV1027 / KV1028 / KV1029 |
| engelsk-8/9/10 | ENG01-06 | KV1033 |
| naturfag-8/9/10 | NAT01-05 | KV1078 |
| samfunnsfag-8/9/10 | SAF01-05 | KV1151 |
| krle-8/9/10 | RLE01-04 | KV1145 |
| tysk/fransk/spansk-8/9/10 | FSP01-04 | KV965 (nivå I) |
| arbeidslivsfag-8/9/10 | ARB01-03 | KV107 |
| utdanningsvalg-9/10 | UTV01-03 | KV106 |
| norsk-vg1 / vg2 / vg3 | NOR01-08 | KV1113 / KV1112 / KV1114 |
| matematikk-1p | MAT08-01 | KV31 |
| matematikk-1t | MAT09-02 | KV979 |
| engelsk-vg1 | ENG01-06 | KV1035 |
| naturfag-vg1 | NAT01-05 | KV1079 |
| geografi-vg1 | GEO01-02 | KV49 |
| samfunnskunnskap-vg1 | SAK01-01 | KV48 |
| tysk/fransk/spansk-vg1, -vg2 | FSP01-04 | KV966 (nivå II) |
| historie-vg2 / vg3 | HIS01-03 | KV84 / KV85 |
| religion-og-etikk | REL01-02 | KV172 |
| kjemi-1 / kjemi-2 | KJE01-02 | KV532 / KV533 |
| fysikk-1 / fysikk-2 | FYS01-02 | KV466 / KV467 |
| biologi-1 / biologi-2 | BIO01-02 | KV538 / KV539 |
| matematikk-r1 / r2 | MAT03-02 | KV293 / KV294 |
| matematikk-s1 / s2 | MAT04-02 | KV295 / KV296 |
| informasjonsteknologi-1 | INF01-03 | KV977 |
| teknologi-og-forskningslare-1 | TNF01-03 | KV975 |
| sosiologi-og-sosialantropologi | POS04-01 | KV494 |
| politikk-og-menneskerettigheter | POS05-02 | KV891 |
| rettslare-1 / rettslare-2 | RTL01-05 | KV889 / KV890 |
| psykologi-1 / psykologi-2 | PSY01-04 | KV883 / KV884 |
| markedsforing-og-ledelse-1 / -2 | MFL01-04 | KV887 / KV888 |
| samfunnsokonomi-1 | SOK01-04 | KV1000 |
| sosialkunnskap | POS02-02 | KV892 |

## Planlagt temainndeling (ikke skrevet ennå)

- **Samfunnsfag 8** (resten): demokrati-og-politikk (19, 16), lover-og-regler (18), okonomi-og-forbruk (12), befolkning-og-levekar (6), digitale-spor-og-personvern (14, 17)
- **Samfunnsfag 9**: industrialisering-og-teknologi (4), kamp-for-endring (5), forste-verdenskrig (7), mellomkrigstid-og-andre-verdenskrig (7, 8), holocaust-og-folkemord (8), fornorsking-og-minoriteter (10), menneskerettigheter (9)
- **Samfunnsfag 10**: den-kalde-krigen (7), konflikter-i-var-tid (7), terror-og-ekstremisme (8), berekraftig-utvikling (11), velferdsstaten (19), mangfold-og-fordommer (13, 3), makt-og-medier (16, 17, 2)

`_fag.json` for samfunnsfag 8–10 er allerede laget med disse slugene.

## Gjenstår etter samfunnsfag

KRLE 8–10, tysk/fransk/spansk 8–10 (nivå I, ~6 temaer per trinn), arbeidslivsfag 8–10, utdanningsvalg 9–10, alle Vg1-fag, alle Vg2-fag unntatt Kjemi 1, alle Vg3-fag.
