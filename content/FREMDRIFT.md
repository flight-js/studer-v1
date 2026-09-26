# Fremdrift: studieinnhold

Status for arbeidet med å lage innhold til alle 83 fag (8. trinn–Vg3), og hvordan man fortsetter.

## Ferdig (lastet inn i Supabase, publisert som utkast)

| Fag | Temaer |
| --- | --- |
| Kjemi 1 (vg2) | 11 |
| Matematikk 8, 9, 10 | 8 + 8 + 9 |
| Norsk 8, 9, 10 | 7 + 7 + 7 |
| Engelsk 8, 9, 10 | 6 + 6 + 7 |
| Naturfag 8, 9, 10 | 7 + 7 + 6 |
| Samfunnsfag 8, 9, 10 | 7 + 7 + 7 |
| KRLE 8, 9, 10 | 6 + 6 + 7 |
| Engelsk fordypning 8, 9, 10 | 5 + 5 + 5 |
| Tysk, fransk, spansk 8, 9, 10 | 6 per trinn (54) |
| Arbeidslivsfag 8, 9, 10 | 4 + 4 + 4 |
| Utdanningsvalg 9, 10 | 4 + 4 |
| Norsk Vg1 | 9 |
| Matematikk 1P, 1T | 8 + 9 |
| Engelsk Vg1 | 9 |
| Naturfag Vg1 | 11 |
| Geografi Vg1 | 7 |
| Samfunnskunnskap Vg1 | 12 |
| Tysk, fransk, spansk Vg1 (nivå II) | 6 per språk (18) |
| Kinesisk Vg1 (nivå I) | 6 |

Hele ungdomstrinnet er ferdig.

Hele Vg1 er ferdig.

**Neste:** Vg2 fellesfag: norsk-vg2 (NOR01-08 KV1112), historie-vg2 (HIS01-03 KV84), matematikk-2p (MAT05-04 KV46), tysk/fransk/spansk-vg2 (KV966, fortsettelse), kinesisk-vg2 (KV965, fortsettelse). Deretter Vg2 programfag.

**Fremmedspråk nivå I (FSP01-04 KV965)**, samme slugs for tysk, fransk og spansk (`_fag.json` er laget). Forklaringer på norsk, eksempler og flashcard-termer på målspråket:

- **8**: hilsener-og-presentasjon (2, 6), tall-og-tid (6, 1), familie-og-venner (3, 5), skole-og-fritid (2, 3), grammatikk-grunnlag (6), land-og-kultur (8, 9)
- **9**: mat-og-drikke, hjemmet-og-hverdagen, byen-og-veibeskrivelse, klaer-og-handel, fortid, hoytider-og-tradisjoner
- **10**: reise-og-ferie, helse-og-kropp, framtid-og-planer, ungdom-og-medier, kunst-og-kultur, miljo-og-samfunn

Alle ferdige.

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
| engelsk-fordypning-8/9/10 | ENG03-02 | KV13 (etter 10. trinn) |
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
| kinesisk-vg1 / -vg2 | FSP01-04 | KV965 (nivå I) – valgt fordi de fleste begynner på kinesisk i vgs; bytt til KV966 hvis skolen har kinesisk på ungdomstrinnet |
| entreprenorskap-og-bedriftsutvikling-1 | ENT01-04 | KV885 |
| sosialkunnskap | POS02-02 | KV892 |
| matematikk-2p | MAT05-04 | KV46 |
| geofag-1 / geofag-2 | GFG01-03 | KV972 / KV973 |
| historie-og-filosofi-1 / -2 | HIF01-04 | KV895 / KV896 |


## Gjenstår

alle Vg2-fag unntatt Kjemi 1 (inkl. kinesisk, entreprenørskap og bedriftsutvikling 1, matematikk 2P, geofag 1 og historie og filosofi 1), alle Vg3-fag (inkl. geofag 2 og historie og filosofi 2).
