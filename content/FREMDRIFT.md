# Fremdrift: studieinnhold

Status for arbeidet med å lage innhold til alle 78 fag (8. trinn–Vg3), og hvordan man fortsetter.

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

**Neste:** Tysk/fransk/spansk 9 og 10.

**Fremmedspråk nivå I (FSP01-04 KV965)**, samme slugs for tysk, fransk og spansk (`_fag.json` er laget). Forklaringer på norsk, eksempler og flashcard-termer på målspråket:

- **8**: hilsener-og-presentasjon (2, 6), tall-og-tid (6, 1), familie-og-venner (3, 5), skole-og-fritid (2, 3), grammatikk-grunnlag (6), land-og-kultur (8, 9)
- **9**: mat-og-drikke, hjemmet-og-hverdagen, byen-og-veibeskrivelse, klaer-og-handel, fortid, hoytider-og-tradisjoner
- **10**: reise-og-ferie, helse-og-kropp, framtid-og-planer, ungdom-og-medier, kunst-og-kultur, miljo-og-samfunn

Ferdig: tysk 8–9, fransk 8, spansk 8. Neste: fransk 9.

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
| kinesisk-vg1 / -vg2 | FSP01-04 | KV966 (nivå II) – sjekk om skolen bruker nivå I (KV965) |
| entreprenorskap-og-bedriftsutvikling-1 | ENT01-04 | KV885 |
| sosialkunnskap | POS02-02 | KV892 |

## Planlagt temainndeling (ikke skrevet ennå)

RLE01-04 KV1145 har 15 mål for hele ungdomstrinnet:

- **KRLE 8**: kristendommen (1, 6), islam (1, 6), jodedommen (1, 6), livssynshumanisme (3, 6), samisk-religion-og-urfolk (5), etiske-teorier (11, 12)
- **KRLE 9**: hinduismen (1, 6), buddhismen (1, 6), religion-og-historie (2), religiost-mangfold (4), religion-i-populaerkultur (9), etiske-forbilder (10)
- **KRLE 10**: sikhisme-og-andre-tradisjoner (1), kjonn-og-seksualitet (8), eksistensielle-sporsmal (13), etikk-og-kommunikasjon (14, 12), filosofi-og-aktuell-etikk (11), menneskerettigheter-og-fattigdom (15), kilder-og-perspektiver (7, 6)

## Gjenstår etter KRLE

Tysk/fransk/spansk 8–10 (nivå I, ~6 temaer per trinn), arbeidslivsfag 8–10, utdanningsvalg 9–10, alle Vg1-fag (inkl. kinesisk), alle Vg2-fag unntatt Kjemi 1 (inkl. kinesisk og entreprenørskap og bedriftsutvikling 1), alle Vg3-fag.
