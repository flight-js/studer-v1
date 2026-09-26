-- Generert av `npm run content:seed` fra content/. Ikke rediger for hånd.
-- Bare temaer med status «godkjent» publiseres.

begin;

-- Katalog (trinn og fag)
insert into public.trinn (id, navn, skoleniva, sortering) values
  ('8', '8. trinn', 'ungdomsskole', 0),
  ('9', '9. trinn', 'ungdomsskole', 1),
  ('10', '10. trinn', 'ungdomsskole', 2),
  ('vg1', 'Vg1', 'vgs', 3),
  ('vg2', 'Vg2', 'vgs', 4),
  ('vg3', 'Vg3', 'vgs', 5)
on conflict (id) do update set navn = excluded.navn, skoleniva = excluded.skoleniva, sortering = excluded.sortering;
insert into public.fag (id, trinn_id, navn, lareplan_kode, lareplan_url, kompetansemaal, sortering) values
  ('norsk-8', '8', 'Norsk', null, null, '[]'::jsonb, 0),
  ('matematikk-8', '8', 'Matematikk', 'MAT01-06', 'https://www.udir.no/lk20/mat01-06/kompetansemaal-og-vurdering/kv1027', '[{"nr":1,"tekst":"rekne med potensar og kvadratrøter og forklare framgangsmåtar og resultat"},{"nr":2,"tekst":"bruke kommutative, assosiative og distributive eigenskapar til å utvikle og kommunisere strategiar for hovudrekning og skriftleg rekning"},{"nr":3,"tekst":"beskrive og utforske faktorisering og primtalsfaktorisering og bruke det i brøkrekning"},{"nr":4,"tekst":"utforske og generalisere geometriske mønster og tallmønster med eigne ord og algebraisk"},{"nr":5,"tekst":"lage og forklare rekneuttrykk med tal, variablar og konstantar knytte til praktiske situasjonar"},{"nr":6,"tekst":"lage og løyse likningar knytte til praktiske situasjonar og kritisk vurdere løysingar"},{"nr":7,"tekst":"bruke ulike strategiar for å løyse ulikskapar og vurdere om løysingar er gyldige"},{"nr":8,"tekst":"beskrive, samanlikne og utforske funksjonar knytte til praktiske situasjonar"},{"nr":9,"tekst":"bruke situasjonar, tabellar, grafar og uttrykk til å representere funksjonar og vise samanhengar mellom representasjonane"},{"nr":10,"tekst":"utforske korleis algoritmar kan skapast, testast og forbetrast ved hjelp av programmering"}]'::jsonb, 1),
  ('engelsk-8', '8', 'Engelsk', null, null, '[]'::jsonb, 2),
  ('naturfag-8', '8', 'Naturfag', null, null, '[]'::jsonb, 3),
  ('samfunnsfag-8', '8', 'Samfunnsfag', null, null, '[]'::jsonb, 4),
  ('krle-8', '8', 'KRLE', null, null, '[]'::jsonb, 5),
  ('tysk-8', '8', 'Tysk', null, null, '[]'::jsonb, 6),
  ('fransk-8', '8', 'Fransk', null, null, '[]'::jsonb, 7),
  ('spansk-8', '8', 'Spansk', null, null, '[]'::jsonb, 8),
  ('arbeidslivsfag-8', '8', 'Arbeidslivsfag', null, null, '[]'::jsonb, 9),
  ('norsk-9', '9', 'Norsk', null, null, '[]'::jsonb, 0),
  ('matematikk-9', '9', 'Matematikk', 'MAT01-06', 'https://www.udir.no/lk20/mat01-06/kompetansemaal-og-vurdering/kv1028', '[{"nr":1,"tekst":"lage og løyse problem som handlar om samansette måleiningar"},{"nr":2,"tekst":"utforske eigenskapane ved ulike todimensjonale figurar og forklare omgrepa formlikskap og kongruens"},{"nr":3,"tekst":"bruke formlikskap og læresetninga til Pytagoras til utforsking av praktiske situasjonar"},{"nr":4,"tekst":"utforske, beskrive og argumentere for samanhengar mellom sidelengdene i trekantar"},{"nr":5,"tekst":"utforske og argumentere for korleis det å endre føresetnader i geometriske problemstillingar påverkar løysingar både praktisk og algebraisk"},{"nr":6,"tekst":"bruke og argumentere for formlar for overflateareal og volum av tredimensjonale figurar"},{"nr":7,"tekst":"tolke og kritisk vurdere statistiske framstillingar frå media og lokalsamfunnet"},{"nr":8,"tekst":"rekne på sentralmål og spreiingsmål i eigne og reelle datasett og bruke resultata til å beskrive dataa"},{"nr":9,"tekst":"samanlikne og argumentere for korleis framstillingar av tal og data kan brukast for å fremje ulike synspunkt"},{"nr":10,"tekst":"berekne og vurdere sannsyn i statistikk og spel"},{"nr":11,"tekst":"simulere utfall i tilfeldige forsøk og berekne sannsynet for at noko skal inntreffe, ved å bruke programmering"}]'::jsonb, 1),
  ('engelsk-9', '9', 'Engelsk', null, null, '[]'::jsonb, 2),
  ('naturfag-9', '9', 'Naturfag', null, null, '[]'::jsonb, 3),
  ('samfunnsfag-9', '9', 'Samfunnsfag', null, null, '[]'::jsonb, 4),
  ('krle-9', '9', 'KRLE', null, null, '[]'::jsonb, 5),
  ('tysk-9', '9', 'Tysk', null, null, '[]'::jsonb, 6),
  ('fransk-9', '9', 'Fransk', null, null, '[]'::jsonb, 7),
  ('spansk-9', '9', 'Spansk', null, null, '[]'::jsonb, 8),
  ('arbeidslivsfag-9', '9', 'Arbeidslivsfag', null, null, '[]'::jsonb, 9),
  ('utdanningsvalg-9', '9', 'Utdanningsvalg', null, null, '[]'::jsonb, 10),
  ('norsk-10', '10', 'Norsk', null, null, '[]'::jsonb, 0),
  ('matematikk-10', '10', 'Matematikk', null, null, '[]'::jsonb, 1),
  ('engelsk-10', '10', 'Engelsk', null, null, '[]'::jsonb, 2),
  ('naturfag-10', '10', 'Naturfag', null, null, '[]'::jsonb, 3),
  ('samfunnsfag-10', '10', 'Samfunnsfag', null, null, '[]'::jsonb, 4),
  ('krle-10', '10', 'KRLE', null, null, '[]'::jsonb, 5),
  ('tysk-10', '10', 'Tysk', null, null, '[]'::jsonb, 6),
  ('fransk-10', '10', 'Fransk', null, null, '[]'::jsonb, 7),
  ('spansk-10', '10', 'Spansk', null, null, '[]'::jsonb, 8),
  ('arbeidslivsfag-10', '10', 'Arbeidslivsfag', null, null, '[]'::jsonb, 9),
  ('utdanningsvalg-10', '10', 'Utdanningsvalg', null, null, '[]'::jsonb, 10),
  ('norsk-vg1', 'vg1', 'Norsk', null, null, '[]'::jsonb, 0),
  ('matematikk-1p', 'vg1', 'Matematikk 1P', null, null, '[]'::jsonb, 1),
  ('matematikk-1t', 'vg1', 'Matematikk 1T', null, null, '[]'::jsonb, 2),
  ('engelsk-vg1', 'vg1', 'Engelsk', null, null, '[]'::jsonb, 3),
  ('naturfag-vg1', 'vg1', 'Naturfag', null, null, '[]'::jsonb, 4),
  ('geografi-vg1', 'vg1', 'Geografi', null, null, '[]'::jsonb, 5),
  ('samfunnskunnskap-vg1', 'vg1', 'Samfunnskunnskap', null, null, '[]'::jsonb, 6),
  ('tysk-vg1', 'vg1', 'Tysk', null, null, '[]'::jsonb, 7),
  ('fransk-vg1', 'vg1', 'Fransk', null, null, '[]'::jsonb, 8),
  ('spansk-vg1', 'vg1', 'Spansk', null, null, '[]'::jsonb, 9),
  ('norsk-vg2', 'vg2', 'Norsk', null, null, '[]'::jsonb, 0),
  ('historie-vg2', 'vg2', 'Historie', null, null, '[]'::jsonb, 1),
  ('tysk-vg2', 'vg2', 'Tysk', null, null, '[]'::jsonb, 2),
  ('fransk-vg2', 'vg2', 'Fransk', null, null, '[]'::jsonb, 3),
  ('spansk-vg2', 'vg2', 'Spansk', null, null, '[]'::jsonb, 4),
  ('kjemi-1', 'vg2', 'Kjemi 1', 'KJE01-02', 'https://www.udir.no/lk20/kje01-02/kompetansemaal-og-vurdering/kv532', '[{"nr":1,"kort":"Kjemisk terminologi og navnsetting","tekst":"forstå og bruke kjemisk terminologi og regler for navnsetting i faglig kommunikasjon"},{"nr":2,"kort":"Forsøk, usikkerhet og feilkilder","tekst":"planlegge og gjennomføre forsøk, estimere usikkerhet og vurdere feilkilder, presentere resultater og argumentere for gyldigheten av resultater og konklusjoner"},{"nr":3,"kort":"Sikkerhetsdatablad og HMS","tekst":"bruke informasjon fra sikkerhetsdatablad til å gjøre vurderinger knyttet til helse, miljø og sikkerhet i praktisk arbeid"},{"nr":4,"kort":"Data, simuleringer og beregninger","tekst":"bruke data, simuleringer og beregninger i tolkninger og til å trekke konklusjoner"},{"nr":5,"kort":"Modeller, styrker og begrensninger","tekst":"bruke modeller til å forklare observasjoner og kjemiske fenomener, og argumentere for modellenes styrker og begrensinger"},{"nr":6,"kort":"Periodesystemet og periodiske trender","tekst":"gjøre rede for oppbygningen av periodesystemet, og bruke kjerneladning og elektronkonfigurasjon til å forklare periodiske trender"},{"nr":7,"kort":"Kjemisk binding, molekylgeometri og struktur","tekst":"gjøre rede for kjemisk binding som elektrostatiske krefter som virker mellom partikler, og bruke dette til å forklare molekylgeometri og organiske og uorganiske stoffers struktur, sammensetning og egenskaper"},{"nr":8,"kort":"Beregninger på reaksjoner og reaksjonstyper","tekst":"utforske og gjøre beregninger på kjemiske reaksjoner, og bruke observasjoner og teoretiske vurderinger til å identifisere reaksjonstype"},{"nr":9,"kort":"Konsentrasjon og ulike enheter","tekst":"gjøre beregninger med ulike enheter for konsentrasjon og bruke stoffkonsentrasjon i vurderinger av vann- og luftkvalitet"},{"nr":10,"kort":"Volumetrisk og gravimetrisk titreranalyse","tekst":"gjennomføre volumetrisk og gravimetrisk titreranalyse og drøfte bruk av titreranalyse"},{"nr":11,"kort":"Atomets oppbygning, spektre og spektroskopi","tekst":"gjøre rede for sammenhengen mellom atomets oppbygning og grunnstoffers absorbsjons- og emisjonsspektre og bruke spektroskopiske metoder i kvalitativ og kvantitativ analyse"},{"nr":12,"kort":"Entalpi og entalpiendringer","tekst":"gjøre rede for entalpi og bruke beregninger og forsøk til å utforske entalpiendringer i reaksjoner"},{"nr":13,"kort":"Kollisjonsteori, reaksjonsfart og likevekt","tekst":"gjøre rede for kollisjonsteori og utforske faktorer som påvirker reaksjonsfart og kjemisk likevekt"},{"nr":14,"kort":"Løselighet: ladning, polaritet og temperatur","tekst":"utforske løseligheten til stoffer, og gjøre rede for betydningen av ladning, polaritet og temperatur for løselighet"},{"nr":15,"kort":"Syre, base, protolyse og pH","tekst":"gjøre rede for begrepene syre, base, protolyse og pH, og utforske egenskapene til sterke og svake syrer og baser"},{"nr":16,"kort":"Grønn kjemi og bærekraft","tekst":"gjøre rede for prinsipper for grønn kjemi og drøfte hvordan bruk av prinsippene kan bidra til bærekraftig utvikling"},{"nr":17,"kort":"Kilder og kildekritikk","tekst":"presentere kjemifaglig innhold fra ulike kilder, kritisk vurdere kildene og bruke relevant teori til å drøfte innholdet"}]'::jsonb, 5),
  ('fysikk-1', 'vg2', 'Fysikk 1', null, null, '[]'::jsonb, 6),
  ('biologi-1', 'vg2', 'Biologi 1', null, null, '[]'::jsonb, 7),
  ('matematikk-r1', 'vg2', 'Matematikk R1', null, null, '[]'::jsonb, 8),
  ('matematikk-s1', 'vg2', 'Matematikk S1', null, null, '[]'::jsonb, 9),
  ('informasjonsteknologi-1', 'vg2', 'Informasjonsteknologi 1', null, null, '[]'::jsonb, 10),
  ('teknologi-og-forskningslare-1', 'vg2', 'Teknologi og forskningslære 1', null, null, '[]'::jsonb, 11),
  ('sosiologi-og-sosialantropologi', 'vg2', 'Sosiologi og sosialantropologi', null, null, '[]'::jsonb, 12),
  ('politikk-og-menneskerettigheter', 'vg2', 'Politikk og menneskerettigheter', null, null, '[]'::jsonb, 13),
  ('rettslare-1', 'vg2', 'Rettslære 1', null, null, '[]'::jsonb, 14),
  ('psykologi-1', 'vg2', 'Psykologi 1', null, null, '[]'::jsonb, 15),
  ('markedsforing-og-ledelse-1', 'vg2', 'Markedsføring og ledelse 1', null, null, '[]'::jsonb, 16),
  ('samfunnsokonomi-1', 'vg2', 'Samfunnsøkonomi 1', null, null, '[]'::jsonb, 17),
  ('norsk-vg3', 'vg3', 'Norsk', null, null, '[]'::jsonb, 0),
  ('historie-vg3', 'vg3', 'Historie', null, null, '[]'::jsonb, 1),
  ('religion-og-etikk', 'vg3', 'Religion og etikk', null, null, '[]'::jsonb, 2),
  ('kjemi-2', 'vg3', 'Kjemi 2', null, null, '[]'::jsonb, 3),
  ('fysikk-2', 'vg3', 'Fysikk 2', null, null, '[]'::jsonb, 4),
  ('biologi-2', 'vg3', 'Biologi 2', null, null, '[]'::jsonb, 5),
  ('matematikk-r2', 'vg3', 'Matematikk R2', null, null, '[]'::jsonb, 6),
  ('matematikk-s2', 'vg3', 'Matematikk S2', null, null, '[]'::jsonb, 7),
  ('rettslare-2', 'vg3', 'Rettslære 2', null, null, '[]'::jsonb, 8),
  ('psykologi-2', 'vg3', 'Psykologi 2', null, null, '[]'::jsonb, 9),
  ('sosialkunnskap', 'vg3', 'Sosialkunnskap', null, null, '[]'::jsonb, 10),
  ('markedsforing-og-ledelse-2', 'vg3', 'Markedsføring og ledelse 2', null, null, '[]'::jsonb, 11)
on conflict (id) do update set trinn_id = excluded.trinn_id, navn = excluded.navn, lareplan_kode = excluded.lareplan_kode,
  lareplan_url = excluded.lareplan_url, kompetansemaal = excluded.kompetansemaal, sortering = excluded.sortering;

-- Matematikk (8): rydd bort fjernede temaer
delete from public.temaer where fag_id = 'matematikk-8' and slug not in ('potenser-og-kvadratrotter', 'regnestrategier', 'faktorisering-og-brok', 'monstre-og-algebra', 'likninger', 'ulikheter', 'funksjoner', 'algoritmer-og-programmering');

-- Matematikk: Potenser og kvadratrøtter
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('matematikk-8:potenser-og-kvadratrotter', 'matematikk-8', 'potenser-og-kvadratrotter', 'Potenser og kvadratrøtter', 'Hva en potens er, regnereglene for potenser, tall på standardform og hvordan du finner og anslår kvadratrøtter.', array[1]::int[], 0, 'utkast', '{}'::text[], false, now())
on conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,
  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,
  publisert = excluded.publisert, oppdatert = excluded.oppdatert;
insert into public.tema_innhold (tema_id, sammendrag, tankekart) values
  ('matematikk-8:potenser-og-kvadratrotter', '## Hva er en potens?

En **potens** er en kort måte å skrive gjentatt multiplikasjon på. I 2⁵ er 2 **grunntallet** og 5 **eksponenten**. Eksponenten forteller hvor mange ganger grunntallet skal ganges med seg selv: 2⁵ = 2 · 2 · 2 · 2 · 2 = 32. Vi leser det som «2 opphøyd i femte». Et helt tall opphøyd i andre kalles et **kvadrattall**, fordi 5² er arealet av et kvadrat med side 5. Et helt tall opphøyd i tredje kalles et **kubikktall**, fordi 3³ er volumet av en terning med side 3.

## Regneregler for potenser

Når potensene har samme grunntall, kan vi forenkle:

- Ved multiplikasjon legger vi sammen eksponentene: 3² · 3⁴ = 3⁶.
- Ved divisjon trekker vi eksponentene fra hverandre: 5⁷ : 5³ = 5⁴.
- Når en potens opphøyes i en ny eksponent, ganger vi eksponentene: (2³)² = 2⁶.
- Alle tall unntatt 0 opphøyd i null er 1: 7⁰ = 1.

Pass på fortegnet. (−3)² = 9 fordi hele parentesen ganges med seg selv, men −3² = −9 fordi potensen regnes ut før minustegnet brukes.

## Tierpotenser og standardform

Tierpotenser gjør det lettere å skrive store tall: 10³ = 1000 og 10⁶ = 1 000 000. Eksponenten viser hvor mange nuller som kommer etter 1-tallet. Et tall på **standardform** skrives som et tall mellom 1 og 10 ganget med en tierpotens. For eksempel er 4 200 000 = 4,2 · 10⁶. Standardform brukes mye i naturfag, der tallene ofte er svært store.

## Kvadratrøtter

**Kvadratroten** av et tall er det positive tallet som ganget med seg selv gir tallet. √49 = 7 fordi 7 · 7 = 49. Å ta kvadratroten er altså det motsatte av å opphøye i andre. Er tallet ikke et kvadrattall, blir kvadratroten et desimaltall som ikke går opp, for eksempel √2 ≈ 1,41. Da kan du anslå svaret ved å finne de nærmeste kvadrattallene: √30 ligger mellom 5 og 6 fordi 25 < 30 < 36.

## Rekkefølge og forklaring

I regnestykker regner vi først ut parenteser, så potenser og røtter, så multiplikasjon og divisjon, og til slutt addisjon og subtraksjon. Når du forklarer en framgangsmåte, bør du vise hvert steg, for eksempel ved å skrive potensen som gjentatt multiplikasjon eller si hvilken regneregel du bruker.', '{"label":"Potenser og kvadratrøtter","children":[{"label":"Potens","children":[{"label":"Grunntall","note":"Tallet som ganges med seg selv"},{"label":"Eksponent","note":"Hvor mange faktorer"},{"label":"Kvadrattall","note":"n²: 1, 4, 9, 16 …"},{"label":"Kubikktall","note":"n³: 1, 8, 27, 64 …"}]},{"label":"Regneregler","children":[{"label":"aᵐ · aⁿ = aᵐ⁺ⁿ","note":"Legg sammen eksponentene"},{"label":"aᵐ : aⁿ = aᵐ⁻ⁿ","note":"Trekk fra eksponentene"},{"label":"(aᵐ)ⁿ","note":"Gang eksponentene"},{"label":"a⁰ = 1","note":"Gjelder når a ≠ 0"}]},{"label":"Store tall","children":[{"label":"Tierpotenser","note":"10ⁿ = 1 med n nuller"},{"label":"Standardform","note":"a · 10ⁿ, der 1 ≤ a < 10"}]},{"label":"Kvadratrot","children":[{"label":"√a · √a = a","note":"Motsatt av å opphøye i andre"},{"label":"Anslå","note":"Bruk de nærmeste kvadrattallene"}]},{"label":"Regnerekkefølge","children":[{"label":"1. Parenteser"},{"label":"2. Potenser og røtter"},{"label":"3. Ganging og deling"},{"label":"4. Pluss og minus"}]}]}'::jsonb)
on conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;
delete from public.flashcards where tema_id = 'matematikk-8:potenser-og-kvadratrotter';
insert into public.flashcards (tema_id, begrep, forklaring, sortering) values
  ('matematikk-8:potenser-og-kvadratrotter', 'Potens', 'En kort skrivemåte for gjentatt multiplikasjon, for eksempel 2⁵ = 2 · 2 · 2 · 2 · 2.', 0),
  ('matematikk-8:potenser-og-kvadratrotter', 'Grunntall', 'Tallet som ganges med seg selv i en potens. I 4³ er grunntallet 4.', 1),
  ('matematikk-8:potenser-og-kvadratrotter', 'Eksponent', 'Det lille tallet oppe til høyre i en potens. Det viser hvor mange ganger grunntallet ganges med seg selv.', 2),
  ('matematikk-8:potenser-og-kvadratrotter', 'Kvadrattall', 'Et helt tall opphøyd i andre, for eksempel 1, 4, 9, 16, 25 og 36.', 3),
  ('matematikk-8:potenser-og-kvadratrotter', 'Kubikktall', 'Et helt tall opphøyd i tredje, for eksempel 8 = 2³ og 27 = 3³.', 4),
  ('matematikk-8:potenser-og-kvadratrotter', 'aᵐ · aⁿ', 'Ved multiplikasjon av potenser med samme grunntall legges eksponentene sammen: aᵐ · aⁿ = aᵐ⁺ⁿ.', 5),
  ('matematikk-8:potenser-og-kvadratrotter', 'aᵐ : aⁿ', 'Ved divisjon av potenser med samme grunntall trekkes eksponentene fra hverandre: aᵐ : aⁿ = aᵐ⁻ⁿ.', 6),
  ('matematikk-8:potenser-og-kvadratrotter', '(aᵐ)ⁿ', 'En potens opphøyd i en ny eksponent: eksponentene ganges. (2³)² = 2⁶.', 7),
  ('matematikk-8:potenser-og-kvadratrotter', 'a⁰', 'Alle tall unntatt 0 opphøyd i null er lik 1. For eksempel er 7⁰ = 1.', 8),
  ('matematikk-8:potenser-og-kvadratrotter', 'Tierpotens', 'En potens med grunntall 10. Eksponenten viser antall nuller: 10⁴ = 10 000.', 9),
  ('matematikk-8:potenser-og-kvadratrotter', 'Standardform', 'Et tall skrevet som a · 10ⁿ, der a er mellom 1 og 10. For eksempel er 350 000 = 3,5 · 10⁵.', 10),
  ('matematikk-8:potenser-og-kvadratrotter', 'Kvadratrot', 'Det positive tallet som ganget med seg selv gir tallet. √36 = 6 fordi 6 · 6 = 36.', 11),
  ('matematikk-8:potenser-og-kvadratrotter', '(−3)² og −3²', '(−3)² = 9 fordi parentesen tar med minustegnet. −3² = −9 fordi bare 3 opphøyes.', 12),
  ('matematikk-8:potenser-og-kvadratrotter', 'Anslå en kvadratrot', 'Finn de to nærmeste kvadrattallene. √50 ligger mellom 7 og 8 fordi 49 < 50 < 64.', 13),
  ('matematikk-8:potenser-og-kvadratrotter', 'Regnerekkefølge', 'Parenteser først, så potenser og røtter, så multiplikasjon og divisjon, og til slutt addisjon og subtraksjon.', 14),
  ('matematikk-8:potenser-og-kvadratrotter', 'Opphøye i andre', 'Å gange et tall med seg selv. Det motsatte er å ta kvadratroten.', 15);
delete from public.quiz_sporsmal where tema_id = 'matematikk-8:potenser-og-kvadratrotter';
insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values
  ('matematikk-8:potenser-og-kvadratrotter', 'q01', 'flervalg', 'Hva er 3⁴?', array['12', '81', '64', '27']::text[], 1, '3⁴ = 3 · 3 · 3 · 3 = 81. Svaret 12 får du hvis du ganger grunntallet med eksponenten, og det er en vanlig feil.', true, true, 0),
  ('matematikk-8:potenser-og-kvadratrotter', 'q02', 'flervalg', 'Hvilken potens er det samme som 5 · 5 · 5?', array['5³', '3⁵', '15', '5 · 3']::text[], 0, 'Grunntallet 5 ganges med seg selv tre ganger, så eksponenten er 3: 5 · 5 · 5 = 5³ = 125.', true, false, 1),
  ('matematikk-8:potenser-og-kvadratrotter', 'q03', 'flervalg', 'Forenkle 2³ · 2⁴.', array['2¹²', '4⁷', '2⁷', '2¹']::text[], 2, 'Potensene har samme grunntall, så eksponentene legges sammen: 3 + 4 = 7. Grunntallet endres ikke.', true, true, 2),
  ('matematikk-8:potenser-og-kvadratrotter', 'q04', 'flervalg', 'Hva er 10⁶?', array['60', '100 000', '10 000 000', '1 000 000']::text[], 3, 'Eksponenten 6 betyr seks nuller etter 1-tallet: 10⁶ = 1 000 000, altså én million.', true, true, 3),
  ('matematikk-8:potenser-og-kvadratrotter', 'q05', 'flervalg', 'Hva er √64?', array['32', '8', '16', '4']::text[], 1, '8 · 8 = 64, så kvadratroten av 64 er 8. Å halvere tallet (32) gir ikke kvadratroten.', true, true, 4),
  ('matematikk-8:potenser-og-kvadratrotter', 'q06', 'flervalg', 'Hva er 9⁰?', array['0', '9', '1', 'Det er ikke definert']::text[], 2, 'Alle tall unntatt 0 opphøyd i null er 1. Det følger av divisjonsregelen: 9² : 9² = 9⁰, og et tall delt på seg selv er 1.', true, false, 5),
  ('matematikk-8:potenser-og-kvadratrotter', 'q07', 'flervalg', 'Hva er −2⁴?', array['−16', '16', '−8', '8']::text[], 0, 'Uten parentes regnes potensen ut først: 2⁴ = 16. Deretter brukes minustegnet, så svaret er −16.', true, true, 6),
  ('matematikk-8:potenser-og-kvadratrotter', 'q08', 'flervalg', 'Hvordan skrives 4 700 000 på standardform?', array['47 · 10⁵', '4,7 · 10⁶', '0,47 · 10⁷', '4,7 · 10⁵']::text[], 1, 'På standardform skal tallet foran tierpotensen være mellom 1 og 10. Kommaet flyttes seks plasser: 4 700 000 = 4,7 · 10⁶.', true, true, 7),
  ('matematikk-8:potenser-og-kvadratrotter', 'q09', 'flervalg', 'Mellom hvilke to hele tall ligger √40?', array['4 og 5', '5 og 6', '6 og 7', '7 og 8']::text[], 2, 'De nærmeste kvadrattallene er 36 = 6² og 49 = 7². Siden 36 < 40 < 49, ligger √40 mellom 6 og 7.', true, true, 8),
  ('matematikk-8:potenser-og-kvadratrotter', 'q10', 'flervalg', 'Regn ut 2 + 3 · 4².', array['80', '196', '146', '50']::text[], 3, 'Potensen først: 4² = 16. Så multiplikasjonen: 3 · 16 = 48. Til slutt addisjonen: 2 + 48 = 50.', true, true, 9),
  ('matematikk-8:potenser-og-kvadratrotter', 'm01', 'sant-usant', '2⁵ er det samme som 2 · 5.', array['Sant', 'Usant']::text[], 1, '2⁵ betyr at 2 ganges med seg selv fem ganger: 2⁵ = 32. Men 2 · 5 = 10.', false, true, 10),
  ('matematikk-8:potenser-og-kvadratrotter', 'm02', 'sant-usant', '(−5)² = 25.', array['Sant', 'Usant']::text[], 0, 'Parentesen gjør at hele −5 opphøyes: (−5) · (−5) = 25, fordi minus ganger minus gir pluss.', false, true, 11),
  ('matematikk-8:potenser-og-kvadratrotter', 'm03', 'sant-usant', '√100 = 50.', array['Sant', 'Usant']::text[], 1, '√100 = 10 fordi 10 · 10 = 100. Kvadratroten er ikke det samme som halvparten.', false, true, 12),
  ('matematikk-8:potenser-og-kvadratrotter', 'm04', 'sant-usant', '7³ : 7 = 7².', array['Sant', 'Usant']::text[], 0, '7 er det samme som 7¹. Ved divisjon trekkes eksponentene fra hverandre: 3 − 1 = 2.', false, true, 13),
  ('matematikk-8:potenser-og-kvadratrotter', 'm05', 'flervalg', 'Forenkle (3²)³.', array['3⁵', '3⁶', '9⁵', '3⁸']::text[], 1, 'Når en potens opphøyes i en ny eksponent, ganges eksponentene: 2 · 3 = 6. Svaret er 3⁶.', false, true, 14),
  ('matematikk-8:potenser-og-kvadratrotter', 'm06', 'flervalg', 'Hvilket av tallene er et kvadrattall?', array['50', '60', '72', '81']::text[], 3, '81 = 9 · 9 = 9². Ingen av de andre tallene kan skrives som et helt tall ganget med seg selv.', false, true, 15),
  ('matematikk-8:potenser-og-kvadratrotter', 'm07', 'flervalg', 'Hva er 6,2 · 10³ skrevet som et vanlig tall?', array['6200', '620', '62 000', '6,2000']::text[], 0, 'Å gange med 10³ = 1000 flytter kommaet tre plasser mot høyre: 6,2 · 1000 = 6200.', false, true, 16);
insert into public.miniprover (tema_id, minutter) values
  ('matematikk-8:potenser-og-kvadratrotter', 15)
on conflict (tema_id) do update set minutter = excluded.minutter;

-- Matematikk: Regnestrategier og regneregler
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('matematikk-8:regnestrategier', 'matematikk-8', 'regnestrategier', 'Regnestrategier og regneregler', 'Kommutativ, assosiativ og distributiv lov, og hvordan du bruker dem til smart hoderegning og ryddig skriftlig regning.', array[2]::int[], 1, 'utkast', '{}'::text[], false, now())
on conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,
  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,
  publisert = excluded.publisert, oppdatert = excluded.oppdatert;
insert into public.tema_innhold (tema_id, sammendrag, tankekart) values
  ('matematikk-8:regnestrategier', '## Tre regneregler som gjør regning lettere

De fire regneartene følger noen faste regler. Når du kjenner dem, kan du bytte om og dele opp tall slik at regnestykket blir enklere.

Den **kommutative loven** sier at rekkefølgen ikke spiller noen rolle ved addisjon og multiplikasjon: a + b = b + a og a · b = b · a. Derfor er 4 · 25 · 7 det samme som 4 · 7 · 25, og du kan starte med 4 · 25 = 100.

Den **assosiative loven** sier at du kan velge hvilke tall du slår sammen først: (a + b) + c = a + (b + c) og (a · b) · c = a · (b · c). 17 + 38 + 62 blir lett hvis du regner 38 + 62 = 100 først.

Den **distributive loven** sier at en faktor kan ganges inn i en parentes: a · (b + c) = a · b + a · c. Den er grunnlaget for mange strategier. 7 · 13 = 7 · 10 + 7 · 3 = 70 + 21 = 91.

Merk at subtraksjon og divisjon ikke er kommutative: 10 − 4 er ikke det samme som 4 − 10, og 12 : 3 er ikke det samme som 3 : 12.

## Strategier for hoderegning

- **Dele opp**: 36 + 47 = 30 + 40 + 6 + 7 = 83.
- **Kompensere**: 99 · 6 = 100 · 6 − 6 = 594. Du regner med et runt tall og justerer etterpå.
- **Doble og halvere**: 16 · 25 = 8 · 50 = 4 · 100 = 400. Produktet endres ikke når én faktor dobles og den andre halveres.
- **Finne tiervenner**: 0,25 · 4 = 1 og 125 · 8 = 1000 er nyttige par å kunne.

## Skriftlig regning

Når tallene blir store, stiller vi opp regnestykket. Ved addisjon og subtraksjon står enere under enere og tiere under tiere, og vi veksler eller låner når det trengs. Ved multiplikasjon ganger vi med ett siffer om gangen og legger sammen delsvarene. Oppstillingen bygger på den distributive loven: 23 · 14 = 23 · 10 + 23 · 4.

## Forklare og kontrollere

En god strategi kan forklares. Skriv hvilke lover du bruker, og kontroller svaret med et overslag: 49 · 21 er omtrent 50 · 20 = 1000, så et svar på 10 290 er urimelig, mens 1029 passer.', '{"label":"Regnestrategier","children":[{"label":"Regneregler","children":[{"label":"Kommutativ","note":"a + b = b + a, a · b = b · a"},{"label":"Assosiativ","note":"Velg hva som regnes først"},{"label":"Distributiv","note":"a(b + c) = ab + ac"}]},{"label":"Hoderegning","children":[{"label":"Dele opp","note":"Tiere og enere hver for seg"},{"label":"Kompensere","note":"Runde tall, juster etterpå"},{"label":"Doble og halvere","note":"Produktet er uendret"},{"label":"Tiervenner","note":"25 · 4 = 100"}]},{"label":"Skriftlig regning","children":[{"label":"Oppstilling","note":"Siffer etter plassverdi"},{"label":"Veksle og låne"},{"label":"Delsvar","note":"Bygger på distributiv lov"}]},{"label":"Kontroll","children":[{"label":"Overslag","note":"Rund av og sjekk"},{"label":"Forklar steg","note":"Si hvilken lov du bruker"}]}]}'::jsonb)
on conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;
delete from public.flashcards where tema_id = 'matematikk-8:regnestrategier';
insert into public.flashcards (tema_id, begrep, forklaring, sortering) values
  ('matematikk-8:regnestrategier', 'Kommutativ lov', 'Rekkefølgen spiller ingen rolle ved addisjon og multiplikasjon: a + b = b + a og a · b = b · a.', 0),
  ('matematikk-8:regnestrategier', 'Assosiativ lov', 'Du kan velge hvilke tall du regner sammen først: (a + b) + c = a + (b + c), og tilsvarende for multiplikasjon.', 1),
  ('matematikk-8:regnestrategier', 'Distributiv lov', 'En faktor kan ganges inn i en parentes: a · (b + c) = a · b + a · c.', 2),
  ('matematikk-8:regnestrategier', 'Faktor', 'Et tall som ganges med et annet tall. I 6 · 7 er både 6 og 7 faktorer.', 3),
  ('matematikk-8:regnestrategier', 'Produkt', 'Svaret på en multiplikasjon. Produktet av 6 og 7 er 42.', 4),
  ('matematikk-8:regnestrategier', 'Sum', 'Svaret på en addisjon. Summen av 8 og 5 er 13.', 5),
  ('matematikk-8:regnestrategier', 'Differanse', 'Svaret på en subtraksjon. Differansen mellom 12 og 5 er 7.', 6),
  ('matematikk-8:regnestrategier', 'Kvotient', 'Svaret på en divisjon. Kvotienten av 20 og 4 er 5.', 7),
  ('matematikk-8:regnestrategier', 'Dele opp', 'Hoderegningsstrategi der tallene deles i tiere og enere: 36 + 47 = 30 + 40 + 6 + 7.', 8),
  ('matematikk-8:regnestrategier', 'Kompensere', 'Regne med et runt tall og justere etterpå: 99 · 6 = 100 · 6 − 6.', 9),
  ('matematikk-8:regnestrategier', 'Doble og halvere', 'Produktet endres ikke når én faktor dobles og den andre halveres: 16 · 25 = 8 · 50.', 10),
  ('matematikk-8:regnestrategier', 'Overslag', 'Et grovt anslag med runde tall for å sjekke om svaret er rimelig.', 11),
  ('matematikk-8:regnestrategier', 'Oppstilling', 'Skriftlig regning der sifrene står under hverandre etter plassverdi.', 12),
  ('matematikk-8:regnestrategier', 'Plassverdi', 'Verdien et siffer har ut fra plassen i tallet. I 352 står 5 for 5 tiere.', 13),
  ('matematikk-8:regnestrategier', 'Ikke kommutativ', 'Subtraksjon og divisjon: 10 − 4 ≠ 4 − 10 og 12 : 3 ≠ 3 : 12.', 14);
delete from public.quiz_sporsmal where tema_id = 'matematikk-8:regnestrategier';
insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values
  ('matematikk-8:regnestrategier', 'q01', 'flervalg', 'Hvilken regel viser at 6 · 9 = 9 · 6?', array['Den distributive loven', 'Den assosiative loven', 'Den kommutative loven', 'Regnerekkefølgen']::text[], 2, 'Den kommutative loven sier at faktorene kan bytte plass ved multiplikasjon uten at produktet endres.', true, true, 0),
  ('matematikk-8:regnestrategier', 'q02', 'flervalg', 'Hva er 5 · (8 + 2) skrevet med den distributive loven?', array['5 · 8 + 2', '5 · 8 + 5 · 2', '5 + 8 · 2', '5 · 8 · 2']::text[], 1, 'Faktoren 5 skal ganges med begge leddene i parentesen: 5 · 8 + 5 · 2 = 40 + 10 = 50.', true, true, 1),
  ('matematikk-8:regnestrategier', 'q03', 'flervalg', 'Hvilken strategi passer best for å regne 99 · 8 i hodet?', array['100 · 8 − 8', '99 · 10 − 2', '90 · 8 + 99', '9 · 9 · 8 − 1']::text[], 0, '99 er én mindre enn 100. Regn 100 · 8 = 800 og trekk fra én åtter: 800 − 8 = 792.', true, true, 2),
  ('matematikk-8:regnestrategier', 'q04', 'flervalg', 'Hva er 25 · 4 · 17?', array['425', '1017', '1360', '1700']::text[], 3, 'Bruk den kommutative og assosiative loven: 25 · 4 = 100, og 100 · 17 = 1700.', true, true, 3),
  ('matematikk-8:regnestrategier', 'q05', 'flervalg', 'Hvilken regneart er kommutativ?', array['Subtraksjon', 'Addisjon', 'Divisjon', 'Ingen av dem']::text[], 1, 'a + b = b + a gjelder alltid. For subtraksjon og divisjon gir det et annet svar om tallene bytter plass.', true, false, 4),
  ('matematikk-8:regnestrategier', 'q06', 'flervalg', 'Hva er 16 · 25 hvis du dobler og halverer?', array['8 · 50 = 400', '32 · 50 = 1600', '8 · 12,5 = 100', '4 · 25 = 100']::text[], 0, 'Halver 16 og doble 25: 8 · 50. Én gang til: 4 · 100 = 400. Produktet er det samme hele veien.', true, true, 5),
  ('matematikk-8:regnestrategier', 'q07', 'flervalg', 'Hva er 7 · 23?', array['141', '151', '161', '171']::text[], 2, 'Del opp: 7 · 20 + 7 · 3 = 140 + 21 = 161.', true, true, 6),
  ('matematikk-8:regnestrategier', 'q08', 'flervalg', 'Hvilket overslag passer best for 48 · 31?', array['50 · 30 = 1500', '40 · 30 = 1200', '50 · 40 = 2000', '48 · 3 = 144']::text[], 0, 'Rund 48 opp til 50 og 31 ned til 30. Det nøyaktige svaret er 1488, som ligger nær 1500.', true, false, 7),
  ('matematikk-8:regnestrategier', 'q09', 'flervalg', 'Hva er 17 + 38 + 62?', array['107', '127', '117', '137']::text[], 2, 'Bruk den assosiative loven og legg sammen 38 + 62 = 100 først. Så er 100 + 17 = 117.', true, true, 8),
  ('matematikk-8:regnestrategier', 'q10', 'flervalg', 'Hvilket uttrykk er lik 12 · 15?', array['12 · 10 + 5', '10 · 15 + 2', '12 · 10 + 12 · 5', '12 + 10 · 5']::text[], 2, '15 = 10 + 5, så 12 · 15 = 12 · 10 + 12 · 5 = 120 + 60 = 180. Begge leddene må ganges med 12.', true, true, 9),
  ('matematikk-8:regnestrategier', 'm01', 'sant-usant', '20 − 8 er det samme som 8 − 20.', array['Sant', 'Usant']::text[], 1, 'Subtraksjon er ikke kommutativ. 20 − 8 = 12, mens 8 − 20 = −12.', false, true, 10),
  ('matematikk-8:regnestrategier', 'm02', 'sant-usant', '(3 · 4) · 5 = 3 · (4 · 5).', array['Sant', 'Usant']::text[], 0, 'Den assosiative loven gjelder for multiplikasjon. Begge sider blir 60.', false, true, 11),
  ('matematikk-8:regnestrategier', 'm03', 'sant-usant', '4 · (10 + 3) = 4 · 10 + 3.', array['Sant', 'Usant']::text[], 1, 'Også 3-tallet må ganges med 4: 4 · 10 + 4 · 3 = 52. Høyre side gir bare 43.', false, true, 12),
  ('matematikk-8:regnestrategier', 'm04', 'sant-usant', 'Når du dobler én faktor og halverer den andre, blir produktet det samme.', array['Sant', 'Usant']::text[], 0, 'Å gange med 2 og dele på 2 opphever hverandre, så produktet endres ikke.', false, true, 13),
  ('matematikk-8:regnestrategier', 'm05', 'flervalg', 'Hva er 199 + 57?', array['246', '256', '266', '257']::text[], 1, 'Kompenser: 200 + 57 = 257, og trekk fra 1 fordi du la til 1 for mye: 256.', false, true, 14),
  ('matematikk-8:regnestrategier', 'm06', 'flervalg', 'Hva kalles svaret på en divisjon?', array['Produkt', 'Differanse', 'Sum', 'Kvotient']::text[], 3, 'Svaret på en divisjon kalles kvotient. Produkt er svaret på en multiplikasjon.', false, true, 15),
  ('matematikk-8:regnestrategier', 'm07', 'flervalg', 'Hva er 8 · 125?', array['1000', '800', '1250', '10 000']::text[], 0, '125 · 8 er et nyttig par å kunne: 125 · 2 = 250, 250 · 2 = 500 og 500 · 2 = 1000.', false, true, 16);
insert into public.miniprover (tema_id, minutter) values
  ('matematikk-8:regnestrategier', 15)
on conflict (tema_id) do update set minutter = excluded.minutter;

-- Matematikk: Faktorisering og brøk
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('matematikk-8:faktorisering-og-brok', 'matematikk-8', 'faktorisering-og-brok', 'Faktorisering og brøk', 'Primtall, primtallsfaktorisering og hvordan du bruker faktorer til å forkorte, utvide og regne med brøker.', array[3]::int[], 2, 'utkast', '{}'::text[], false, now())
on conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,
  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,
  publisert = excluded.publisert, oppdatert = excluded.oppdatert;
insert into public.tema_innhold (tema_id, sammendrag, tankekart) values
  ('matematikk-8:faktorisering-og-brok', '## Faktorer og primtall

Å **faktorisere** et tall betyr å skrive det som et produkt av mindre tall. 12 kan skrives som 3 · 4 eller 2 · 6. Et **primtall** er et helt tall større enn 1 som bare er delelig med 1 og seg selv. De første primtallene er 2, 3, 5, 7, 11, 13, 17, 19 og 23. Tallet 1 er ikke et primtall, og 2 er det eneste partallet som er primtall. Tall som ikke er primtall, kalles **sammensatte tall**.

## Primtallsfaktorisering

Alle sammensatte tall kan skrives som et produkt av bare primtall, og det finnes bare én slik faktorisering. Du finner den ved å dele på primtall så lenge det går:

- 60 : 2 = 30
- 30 : 2 = 15
- 15 : 3 = 5

Altså er 60 = 2 · 2 · 3 · 5 = 2² · 3 · 5. Et **faktortre** er en annen måte å vise det samme på.

Noen delelighetsregler gjør arbeidet raskere. Et tall er delelig med 2 hvis det slutter på et partall, med 3 hvis tverrsummen er delelig med 3, med 5 hvis det slutter på 0 eller 5, og med 10 hvis det slutter på 0.

## Forkorte og utvide brøker

En brøk kan **forkortes** ved å dele teller og nevner på samme tall. 18/24 kan forkortes med 6 til 3/4. Primtallsfaktorisering viser hvilke faktorer teller og nevner har felles: 18 = 2 · 3 · 3 og 24 = 2 · 2 · 2 · 3, så de har 2 · 3 = 6 felles. En brøk er **fullstendig forkortet** når teller og nevner ikke har flere felles faktorer.

Å **utvide** en brøk betyr å gange teller og nevner med samme tall. Verdien endres ikke: 2/3 = 8/12.

## Fellesnevner

For å legge sammen eller trekke fra brøker må de ha lik nevner. Den **minste fellesnevneren** er det minste tallet som alle nevnerne går opp i. For 1/6 + 3/8 faktoriserer vi: 6 = 2 · 3 og 8 = 2 · 2 · 2. Fellesnevneren må inneholde 2 · 2 · 2 · 3 = 24. Da blir 1/6 + 3/8 = 4/24 + 9/24 = 13/24.

## Multiplikasjon og divisjon

Brøker ganges ved å gange teller med teller og nevner med nevner: 2/3 · 5/7 = 10/21. Det lønner seg å forkorte før du ganger. Å dele på en brøk er det samme som å gange med den omvendte brøken: 3/4 : 1/2 = 3/4 · 2/1 = 6/4 = 3/2.', '{"label":"Faktorisering og brøk","children":[{"label":"Primtall","children":[{"label":"Definisjon","note":"Bare delelig med 1 og seg selv"},{"label":"2, 3, 5, 7, 11, 13 …"},{"label":"1 er ikke primtall"}]},{"label":"Primtallsfaktorisering","children":[{"label":"Del på primtall","note":"60 = 2² · 3 · 5"},{"label":"Faktortre"},{"label":"Delelighetsregler","note":"2, 3, 5 og 10"}]},{"label":"Forkorte og utvide","children":[{"label":"Forkorte","note":"Del teller og nevner likt"},{"label":"Utvide","note":"Gang teller og nevner likt"},{"label":"Fullstendig forkortet","note":"Ingen felles faktorer"}]},{"label":"Regne med brøk","children":[{"label":"Fellesnevner","note":"Ved pluss og minus"},{"label":"Multiplikasjon","note":"Teller · teller, nevner · nevner"},{"label":"Divisjon","note":"Gang med omvendt brøk"}]}]}'::jsonb)
on conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;
delete from public.flashcards where tema_id = 'matematikk-8:faktorisering-og-brok';
insert into public.flashcards (tema_id, begrep, forklaring, sortering) values
  ('matematikk-8:faktorisering-og-brok', 'Faktorisere', 'Å skrive et tall eller uttrykk som et produkt av faktorer, for eksempel 12 = 3 · 4.', 0),
  ('matematikk-8:faktorisering-og-brok', 'Primtall', 'Et helt tall større enn 1 som bare er delelig med 1 og seg selv: 2, 3, 5, 7, 11, 13 …', 1),
  ('matematikk-8:faktorisering-og-brok', 'Sammensatt tall', 'Et helt tall større enn 1 som ikke er et primtall, for eksempel 4, 6, 9 og 15.', 2),
  ('matematikk-8:faktorisering-og-brok', 'Primtallsfaktorisering', 'Et tall skrevet som produkt av bare primtall. 60 = 2 · 2 · 3 · 5.', 3),
  ('matematikk-8:faktorisering-og-brok', 'Faktortre', 'En tegning der et tall deles i faktorer grein for grein, til alle greinene ender i primtall.', 4),
  ('matematikk-8:faktorisering-og-brok', 'Delelig med 3', 'Et tall er delelig med 3 når tverrsummen (summen av sifrene) er delelig med 3. 471: 4 + 7 + 1 = 12.', 5),
  ('matematikk-8:faktorisering-og-brok', 'Teller', 'Tallet over brøkstreken. Det viser hvor mange deler vi har.', 6),
  ('matematikk-8:faktorisering-og-brok', 'Nevner', 'Tallet under brøkstreken. Det viser hvor mange like deler helheten er delt i.', 7),
  ('matematikk-8:faktorisering-og-brok', 'Forkorte en brøk', 'Dele teller og nevner på samme tall. 18/24 = 3/4 når vi deler på 6.', 8),
  ('matematikk-8:faktorisering-og-brok', 'Utvide en brøk', 'Gange teller og nevner med samme tall. 2/3 = 8/12 når vi ganger med 4.', 9),
  ('matematikk-8:faktorisering-og-brok', 'Fullstendig forkortet', 'En brøk der teller og nevner ikke har noen felles faktor utenom 1.', 10),
  ('matematikk-8:faktorisering-og-brok', 'Fellesnevner', 'En nevner som alle brøkene i et regnestykke kan utvides til. Trengs ved addisjon og subtraksjon.', 11),
  ('matematikk-8:faktorisering-og-brok', 'Minste fellesnevner', 'Det minste tallet som alle nevnerne går opp i. For 6 og 8 er det 24.', 12),
  ('matematikk-8:faktorisering-og-brok', 'Gange brøker', 'Teller ganges med teller og nevner med nevner: 2/3 · 5/7 = 10/21.', 13),
  ('matematikk-8:faktorisering-og-brok', 'Dele med en brøk', 'Gang med den omvendte brøken: 3/4 : 1/2 = 3/4 · 2/1.', 14),
  ('matematikk-8:faktorisering-og-brok', 'Uekte brøk', 'En brøk der telleren er større enn nevneren, for eksempel 7/4 = 1 3/4.', 15);
delete from public.quiz_sporsmal where tema_id = 'matematikk-8:faktorisering-og-brok';
insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values
  ('matematikk-8:faktorisering-og-brok', 'q01', 'flervalg', 'Hvilket av disse tallene er et primtall?', array['21', '27', '29', '33']::text[], 2, '29 kan bare deles på 1 og 29. 21 = 3 · 7, 27 = 3 · 9 og 33 = 3 · 11 er sammensatte tall.', true, true, 0),
  ('matematikk-8:faktorisering-og-brok', 'q02', 'flervalg', 'Hva er primtallsfaktoriseringen av 36?', array['4 · 9', '2 · 2 · 3 · 3', '6 · 6', '2 · 18']::text[], 1, 'Alle de andre svarene inneholder tall som ikke er primtall. 36 = 2 · 2 · 3 · 3 = 2² · 3².', true, true, 1),
  ('matematikk-8:faktorisering-og-brok', 'q03', 'flervalg', 'Er tallet 1 et primtall?', array['Nei, et primtall må være større enn 1', 'Ja, fordi det bare er delelig med seg selv', 'Ja, det er det minste primtallet', 'Det kommer an på sammenhengen']::text[], 0, 'Et primtall har nøyaktig to ulike faktorer: 1 og seg selv. Tallet 1 har bare én, og regnes derfor ikke som primtall.', true, false, 2),
  ('matematikk-8:faktorisering-og-brok', 'q04', 'flervalg', 'Forkort 18/24 fullstendig.', array['9/12', '6/8', '2/3', '3/4']::text[], 3, 'Største felles faktor for 18 og 24 er 6. 18 : 6 = 3 og 24 : 6 = 4, så brøken blir 3/4.', true, true, 3),
  ('matematikk-8:faktorisering-og-brok', 'q05', 'flervalg', 'Hvilket tall er delelig med 3?', array['412', '513', '701', '830']::text[], 1, 'Tverrsummen av 513 er 5 + 1 + 3 = 9, som er delelig med 3. Da er også 513 delelig med 3 (513 = 3 · 171).', true, true, 4),
  ('matematikk-8:faktorisering-og-brok', 'q06', 'flervalg', 'Hva er minste fellesnevner for 1/4 og 1/6?', array['10', '24', '12', '2']::text[], 2, '4 = 2 · 2 og 6 = 2 · 3. Fellesnevneren må inneholde 2 · 2 · 3 = 12. Både 4 og 6 går opp i 12.', true, true, 5),
  ('matematikk-8:faktorisering-og-brok', 'q07', 'flervalg', 'Hva er 1/6 + 3/8?', array['4/14', '13/24', '4/48', '1/2']::text[], 1, 'Fellesnevner 24: 1/6 = 4/24 og 3/8 = 9/24. Summen er 13/24. Tellere og nevnere kan ikke legges sammen hver for seg.', true, true, 6),
  ('matematikk-8:faktorisering-og-brok', 'q08', 'flervalg', 'Hva er 2/3 · 5/7?', array['10/21', '7/10', '10/7', '7/21']::text[], 0, 'Gang teller med teller og nevner med nevner: 2 · 5 = 10 og 3 · 7 = 21.', true, false, 7),
  ('matematikk-8:faktorisering-og-brok', 'q09', 'flervalg', 'Hva er 3/4 : 1/2?', array['3/8', '1/2', '3/4', '3/2']::text[], 3, 'Å dele på 1/2 er det samme som å gange med 2: 3/4 · 2 = 6/4 = 3/2.', true, true, 8),
  ('matematikk-8:faktorisering-og-brok', 'q10', 'flervalg', 'Hvilken brøk er lik 2/5?', array['4/15', '6/15', '5/2', '2/10']::text[], 1, 'Utvid 2/5 med 3: 2 · 3 = 6 og 5 · 3 = 15. Verdien er den samme, 6/15 = 2/5.', true, true, 9),
  ('matematikk-8:faktorisering-og-brok', 'm01', 'sant-usant', '2 er det eneste partallet som er et primtall.', array['Sant', 'Usant']::text[], 0, 'Alle andre partall er delelige med 2 og har derfor minst tre faktorer.', false, true, 10),
  ('matematikk-8:faktorisering-og-brok', 'm02', 'sant-usant', '1/3 + 1/4 = 2/7.', array['Sant', 'Usant']::text[], 1, 'Nevnerne kan ikke legges sammen. Med fellesnevner 12 blir det 4/12 + 3/12 = 7/12.', false, true, 11),
  ('matematikk-8:faktorisering-og-brok', 'm03', 'sant-usant', 'Når du utvider en brøk, blir verdien større.', array['Sant', 'Usant']::text[], 1, 'Teller og nevner ganges med det samme tallet, så verdien er uendret. 1/2 = 3/6.', false, true, 12),
  ('matematikk-8:faktorisering-og-brok', 'm04', 'sant-usant', 'Tallet 45 er delelig med både 3 og 5.', array['Sant', 'Usant']::text[], 0, 'Tverrsummen 4 + 5 = 9 er delelig med 3, og tallet slutter på 5. 45 = 3 · 3 · 5.', false, true, 13),
  ('matematikk-8:faktorisering-og-brok', 'm05', 'flervalg', 'Hva er primtallsfaktoriseringen av 84?', array['2 · 42', '4 · 21', '2 · 2 · 3 · 7', '2 · 3 · 14']::text[], 2, '84 : 2 = 42, 42 : 2 = 21, 21 : 3 = 7. Altså 84 = 2 · 2 · 3 · 7, og alle faktorene er primtall.', false, true, 14),
  ('matematikk-8:faktorisering-og-brok', 'm06', 'flervalg', 'Hva er 5/6 − 1/3?', array['4/3', '1/2', '4/6', '1/3']::text[], 1, '1/3 = 2/6. Da blir 5/6 − 2/6 = 3/6, som forkortes til 1/2.', false, true, 15),
  ('matematikk-8:faktorisering-og-brok', 'm07', 'flervalg', 'Hvilket tall er et sammensatt tall?', array['51', '53', '47', '43']::text[], 0, '51 = 3 · 17. Tverrsummen 5 + 1 = 6 avslører at 51 er delelig med 3. De andre er primtall.', false, true, 16);
insert into public.miniprover (tema_id, minutter) values
  ('matematikk-8:faktorisering-og-brok', 15)
on conflict (tema_id) do update set minutter = excluded.minutter;

-- Matematikk: Mønstre og algebraiske uttrykk
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('matematikk-8:monstre-og-algebra', 'matematikk-8', 'monstre-og-algebra', 'Mønstre og algebraiske uttrykk', 'Hvordan du beskriver tallmønstre og figurmønstre med en formel, og hvordan du lager og forenkler uttrykk med variabler.', array[4, 5]::int[], 3, 'utkast', '{}'::text[], false, now())
on conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,
  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,
  publisert = excluded.publisert, oppdatert = excluded.oppdatert;
insert into public.tema_innhold (tema_id, sammendrag, tankekart) values
  ('matematikk-8:monstre-og-algebra', '## Mønstre

Et **mønster** er en følge av tall eller figurer som endrer seg etter en fast regel. I tallfølgen 3, 7, 11, 15, … øker hvert tall med 4. Når vi har funnet regelen, kan vi finne neste tall, og vi kan beskrive et hvilket som helst tall i følgen med en **formel**.

For å finne formelen lager vi gjerne en tabell med figurnummer n og antall. Øker antallet med 4 for hver figur, inneholder formelen 4n. Så justerer vi med et fast tall: 4 · 1 = 4, men første tall er 3, så formelen er 4n − 1. Sjekk med n = 2: 4 · 2 − 1 = 7. Stemmer.

Ikke alle mønstre vokser med like mye. **Kvadrattallene** 1, 4, 9, 16 kan skrives som n², og antall prikker i en trekant som vokser 1, 3, 6, 10 kalles **trekanttall**.

## Variabler og konstanter

En **variabel** er en bokstav som står for et tall som kan variere, for eksempel antall kilometer eller antall billetter. En **konstant** er et tall som ikke endrer seg. Når en taxi koster 60 kr i startpris og 15 kr per kilometer, kan prisen skrives som 15x + 60, der x er antall kilometer. 60 er konstanten, og 15 er tallet foran variabelen, kalt **koeffisienten**.

## Algebraiske uttrykk

Et **algebraisk uttrykk** inneholder tall, variabler og regnetegn. Vi kan regne ut verdien når vi setter inn et tall for variabelen: med x = 8 blir 15x + 60 = 120 + 60 = 180.

Noen skrivemåter å kunne:

- 3x betyr 3 · x, og x² betyr x · x.
- **Like ledd** har samme variabel i samme potens og kan slås sammen: 4a + 2a = 6a.
- Ulike ledd kan ikke slås sammen: 4a + 2b må stå som det står.
- En parentes kan ganges ut: 3(x + 2) = 3x + 6.

## Fra situasjon til uttrykk

Når du lager et uttrykk til en praktisk situasjon, bør du først skrive hva variabelen står for. «Jonas har x kroner. Emma har 50 kroner mer enn dobbelt så mye» blir 2x + 50. Forklar gjerne hva hvert ledd betyr, og test uttrykket med et konkret tall for å se om det gir mening.', '{"label":"Mønstre og algebra","children":[{"label":"Mønstre","children":[{"label":"Tallfølger","note":"Fast økning, f.eks. +4"},{"label":"Figurmønstre","note":"Tell og lag tabell"},{"label":"Formel","note":"Gir tallet på plass n"},{"label":"Spesielle tall","note":"Kvadrattall og trekanttall"}]},{"label":"Byggesteiner","children":[{"label":"Variabel","note":"Bokstav for et tall som varierer"},{"label":"Konstant","note":"Fast tall"},{"label":"Koeffisient","note":"Tallet foran variabelen"}]},{"label":"Uttrykk","children":[{"label":"Like ledd","note":"4a + 2a = 6a"},{"label":"Gange ut parentes","note":"3(x + 2) = 3x + 6"},{"label":"Sette inn verdi","note":"Regn ut for en gitt x"}]},{"label":"Praktiske situasjoner","children":[{"label":"Definer variabelen","note":"Hva står x for?"},{"label":"Lag uttrykket","note":"15x + 60"},{"label":"Test med et tall"}]}]}'::jsonb)
on conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;
delete from public.flashcards where tema_id = 'matematikk-8:monstre-og-algebra';
insert into public.flashcards (tema_id, begrep, forklaring, sortering) values
  ('matematikk-8:monstre-og-algebra', 'Mønster', 'En følge av tall eller figurer som endrer seg etter en fast regel.', 0),
  ('matematikk-8:monstre-og-algebra', 'Tallfølge', 'Tall i en bestemt rekkefølge, for eksempel 3, 7, 11, 15, der hvert tall øker med 4.', 1),
  ('matematikk-8:monstre-og-algebra', 'Formel for et mønster', 'Et uttrykk som gir tallet på plass n. For 3, 7, 11, 15 er formelen 4n − 1.', 2),
  ('matematikk-8:monstre-og-algebra', 'Figurnummer n', 'Plassen i mønsteret. Vi setter inn n = 1, 2, 3 … i formelen.', 3),
  ('matematikk-8:monstre-og-algebra', 'Trekanttall', 'Tallene 1, 3, 6, 10, 15 …, som gir antall prikker i trekanter som vokser.', 4),
  ('matematikk-8:monstre-og-algebra', 'Variabel', 'En bokstav som står for et tall som kan variere, for eksempel x for antall kilometer.', 5),
  ('matematikk-8:monstre-og-algebra', 'Konstant', 'Et tall som ikke endrer seg i uttrykket, for eksempel en fast startpris.', 6),
  ('matematikk-8:monstre-og-algebra', 'Koeffisient', 'Tallet som står foran en variabel. I 15x er koeffisienten 15.', 7),
  ('matematikk-8:monstre-og-algebra', 'Algebraisk uttrykk', 'Et uttrykk med tall, variabler og regnetegn, for eksempel 15x + 60.', 8),
  ('matematikk-8:monstre-og-algebra', 'Ledd', 'Deler av et uttrykk som er skilt med pluss eller minus. 3x + 7 har to ledd.', 9),
  ('matematikk-8:monstre-og-algebra', 'Like ledd', 'Ledd med samme variabel i samme potens. 4a og 2a kan slås sammen til 6a.', 10),
  ('matematikk-8:monstre-og-algebra', '3x', 'Kort skrivemåte for 3 · x. Gangetegnet sløyfes mellom tall og variabel.', 11),
  ('matematikk-8:monstre-og-algebra', 'Gange ut en parentes', 'Gange faktoren med hvert ledd i parentesen: 3(x + 2) = 3x + 6.', 12),
  ('matematikk-8:monstre-og-algebra', 'Sette inn en verdi', 'Bytte variabelen med et tall og regne ut. 2x + 1 med x = 5 gir 11.', 13),
  ('matematikk-8:monstre-og-algebra', 'Generalisere', 'Beskrive en sammenheng som gjelder for alle tilfeller, ikke bare ett, ofte med en formel.', 14);
delete from public.quiz_sporsmal where tema_id = 'matematikk-8:monstre-og-algebra';
insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values
  ('matematikk-8:monstre-og-algebra', 'q01', 'flervalg', 'Hva er neste tall i følgen 5, 9, 13, 17, …?', array['19', '20', '21', '22']::text[], 2, 'Hvert tall øker med 4, så neste tall er 17 + 4 = 21.', true, true, 0),
  ('matematikk-8:monstre-og-algebra', 'q02', 'flervalg', 'Hvilken formel passer til følgen 3, 7, 11, 15, …?', array['4n − 1', '3n + 4', 'n + 4', '4n + 3']::text[], 0, 'Følgen øker med 4, så formelen har 4n. For n = 1 skal svaret bli 3: 4 · 1 − 1 = 3. Sjekk n = 2: 4 · 2 − 1 = 7.', true, true, 1),
  ('matematikk-8:monstre-og-algebra', 'q03', 'flervalg', 'Hva er 5x + 3 når x = 4?', array['57', '23', '12', '20']::text[], 1, 'Sett inn 4 for x: 5 · 4 + 3 = 20 + 3 = 23. Svaret 57 får du hvis du skriver 5 og 4 ved siden av hverandre.', true, true, 2),
  ('matematikk-8:monstre-og-algebra', 'q04', 'flervalg', 'Forenkle 4a + 3b + 2a − b.', array['8ab', '6a + 3b', '6a + 2b', '7a + 2b']::text[], 2, 'Slå sammen like ledd: 4a + 2a = 6a og 3b − b = 2b. Ulike ledd kan ikke slås sammen.', true, true, 3),
  ('matematikk-8:monstre-og-algebra', 'q05', 'flervalg', 'En taxi koster 60 kr i start og 15 kr per km. Hvilket uttrykk gir prisen for x km?', array['60x + 15', '75x', '15 + 60 + x', '15x + 60']::text[], 3, 'Kilometerprisen ganges med antall kilometer (15x), og startprisen legges til én gang (60).', true, true, 4),
  ('matematikk-8:monstre-og-algebra', 'q06', 'flervalg', 'Hva er 3(x + 5) når parentesen er ganget ut?', array['3x + 15', '3x + 5', 'x + 15', '3x + 8']::text[], 0, '3 skal ganges med begge leddene: 3 · x + 3 · 5 = 3x + 15.', true, true, 5),
  ('matematikk-8:monstre-og-algebra', 'q07', 'flervalg', 'Hva er koeffisienten i leddet 7y?', array['y', '7', '7y', '1']::text[], 1, 'Koeffisienten er tallet foran variabelen. I 7y er den 7.', true, false, 6),
  ('matematikk-8:monstre-og-algebra', 'q08', 'flervalg', 'Hvilken formel gir kvadrattallene 1, 4, 9, 16, …?', array['2n', 'n + 3', 'n²', '3n − 2']::text[], 2, '1 = 1², 4 = 2², 9 = 3² og 16 = 4². Tallet på plass n er n · n = n².', true, true, 7),
  ('matematikk-8:monstre-og-algebra', 'q09', 'flervalg', 'Emma har 50 kr mer enn dobbelt så mye som Jonas, som har x kr. Hvor mye har Emma?', array['2(x + 50)', 'x + 50', '50x + 2', '2x + 50']::text[], 3, 'Dobbelt så mye som Jonas er 2x, og 50 kr mer blir 2x + 50. Uttrykket 2(x + 50) = 2x + 100 er for mye.', true, true, 8),
  ('matematikk-8:monstre-og-algebra', 'q10', 'flervalg', 'Hva er neste trekanttall etter 1, 3, 6, 10?', array['15', '14', '13', '16']::text[], 0, 'Økningen blir én større for hver figur: +2, +3, +4, og så +5. 10 + 5 = 15.', true, false, 9),
  ('matematikk-8:monstre-og-algebra', 'm01', 'sant-usant', '3a + 2b kan forenkles til 5ab.', array['Sant', 'Usant']::text[], 1, '3a og 2b er ulike ledd fordi variablene er forskjellige. Uttrykket kan ikke forenkles mer.', false, true, 10),
  ('matematikk-8:monstre-og-algebra', 'm02', 'sant-usant', 'I uttrykket 15x + 60 er 60 en konstant.', array['Sant', 'Usant']::text[], 0, '60 endrer seg ikke når x endrer seg. Det er derfor en konstant.', false, true, 11),
  ('matematikk-8:monstre-og-algebra', 'm03', 'sant-usant', 'Formelen 2n + 1 gir tallene 3, 5, 7, 9 for n = 1, 2, 3, 4.', array['Sant', 'Usant']::text[], 0, '2 · 1 + 1 = 3, 2 · 2 + 1 = 5, 2 · 3 + 1 = 7 og 2 · 4 + 1 = 9.', false, true, 12),
  ('matematikk-8:monstre-og-algebra', 'm04', 'sant-usant', 'x² betyr det samme som 2x.', array['Sant', 'Usant']::text[], 1, 'x² = x · x, mens 2x = x + x. Med x = 5 blir x² = 25 og 2x = 10.', false, true, 13),
  ('matematikk-8:monstre-og-algebra', 'm05', 'flervalg', 'Hvilket tall kommer på plass nummer 10 i følgen gitt ved 3n + 2?', array['30', '32', '35', '302']::text[], 1, 'Sett inn n = 10: 3 · 10 + 2 = 32.', false, true, 14),
  ('matematikk-8:monstre-og-algebra', 'm06', 'flervalg', 'Forenkle 2(x + 4) + 3x.', array['5x + 4', '5x + 8', '6x + 4', '2x + 11']::text[], 1, 'Gang ut parentesen: 2x + 8. Legg til 3x: 2x + 3x + 8 = 5x + 8.', false, true, 15),
  ('matematikk-8:monstre-og-algebra', 'm07', 'flervalg', 'Hva kalles et tall som står for en verdi som kan endre seg?', array['Variabel', 'Konstant', 'Koeffisient', 'Faktor']::text[], 0, 'En variabel kan ta ulike verdier. En konstant har alltid samme verdi.', false, true, 16);
insert into public.miniprover (tema_id, minutter) values
  ('matematikk-8:monstre-og-algebra', 15)
on conflict (tema_id) do update set minutter = excluded.minutter;

-- Matematikk: Likninger
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('matematikk-8:likninger', 'matematikk-8', 'likninger', 'Likninger', 'Hva en likning er, hvordan du løser den med balansemetoden, og hvordan du lager likninger til praktiske problemer og vurderer svaret.', array[6]::int[], 4, 'utkast', '{}'::text[], false, now())
on conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,
  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,
  publisert = excluded.publisert, oppdatert = excluded.oppdatert;
insert into public.tema_innhold (tema_id, sammendrag, tankekart) values
  ('matematikk-8:likninger', '## Hva er en likning?

En **likning** er et matematisk utsagn der to uttrykk er like store, og der minst ett av dem inneholder en ukjent. I likningen 3x + 5 = 20 er x den **ukjente**. Å **løse** likningen betyr å finne verdien av x som gjør at venstre og høyre side blir like. Denne verdien kalles **løsningen**.

## Balansemetoden

Tenk på likningen som en vekt i balanse. Så lenge du gjør det samme på begge sider, holder vekten seg i balanse. Målet er å få x alene på den ene siden.

- Legg til eller trekk fra samme tall på begge sider.
- Gang eller del begge sider med samme tall (men aldri med 0).

Eksempel: 3x + 5 = 20

- Trekk fra 5 på begge sider: 3x = 15
- Del begge sider på 3: x = 5

Mange sier at et ledd «flyttes over og skifter fortegn». Det er en kortversjon av balansemetoden: å trekke fra 5 på begge sider gir samme resultat som å flytte +5 over som −5.

## Ukjente på begge sider

I likningen 5x − 4 = 2x + 11 samler vi først x-leddene på én side og tallene på den andre: 5x − 2x = 11 + 4, altså 3x = 15 og x = 5. Har likningen parenteser, ganger vi dem ut først. Har den brøker, kan vi gange alle ledd med fellesnevneren for å bli kvitt nevnerne.

## Sett prøve

Du kan alltid kontrollere svaret ved å **sette prøve**. Sett løsningen inn i den opprinnelige likningen og regn ut hver side for seg. Med x = 5 i 5x − 4 = 2x + 11 blir venstre side 21 og høyre side 21. Løsningen stemmer.

## Likninger i praktiske situasjoner

Mange hverdagsproblemer kan løses med likninger. «En klassetur koster 1200 kr for bussen pluss 150 kr per elev. Totalt ble det 5250 kr. Hvor mange elever var med?» Vi lar x være antall elever og får 150x + 1200 = 5250. Det gir 150x = 4050 og x = 27.

Til slutt må vi **vurdere løsningen kritisk**. Gir svaret mening i situasjonen? Antall elever må være et helt, positivt tall. Hvis likningen hadde gitt x = 26,4, ville det vært et tegn på regnefeil eller at oppgaven bygger på feil opplysninger.', '{"label":"Likninger","children":[{"label":"Begreper","children":[{"label":"Ukjent","note":"Ofte x"},{"label":"Løsning","note":"Gjør sidene like"},{"label":"VS og HS","note":"Venstre og høyre side"}]},{"label":"Balansemetoden","children":[{"label":"Pluss/minus på begge sider"},{"label":"Gang/del på begge sider","note":"Aldri del på 0"},{"label":"Samle ledd","note":"x-ledd på én side"}]},{"label":"Spesielle likninger","children":[{"label":"Med parentes","note":"Gang ut først"},{"label":"Med brøk","note":"Gang med fellesnevner"},{"label":"x på begge sider"}]},{"label":"Kontroll og bruk","children":[{"label":"Sett prøve","note":"Sett inn i opprinnelig likning"},{"label":"Tekstoppgaver","note":"La x være det ukjente"},{"label":"Vurder svaret","note":"Gir det mening?"}]}]}'::jsonb)
on conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;
delete from public.flashcards where tema_id = 'matematikk-8:likninger';
insert into public.flashcards (tema_id, begrep, forklaring, sortering) values
  ('matematikk-8:likninger', 'Likning', 'Et utsagn der to uttrykk er like store og minst ett inneholder en ukjent, for eksempel 3x + 5 = 20.', 0),
  ('matematikk-8:likninger', 'Ukjent', 'Bokstaven i en likning som står for tallet vi skal finne, ofte x.', 1),
  ('matematikk-8:likninger', 'Løsning', 'Verdien av den ukjente som gjør at begge sidene av likningen blir like store.', 2),
  ('matematikk-8:likninger', 'Balansemetoden', 'Gjør alltid det samme på begge sider av likhetstegnet, slik at likningen holder seg i balanse.', 3),
  ('matematikk-8:likninger', 'Legge til / trekke fra', 'Samme tall kan legges til eller trekkes fra på begge sider uten at løsningen endres.', 4),
  ('matematikk-8:likninger', 'Gange / dele', 'Begge sider kan ganges eller deles med samme tall, men aldri deles på 0.', 5),
  ('matematikk-8:likninger', 'Flytte og bytte fortegn', 'Kortversjon av balansemetoden: +5 på én side blir −5 på den andre siden.', 6),
  ('matematikk-8:likninger', 'Samle ledd', 'Samle alle x-ledd på én side og alle tall på den andre før du løser videre.', 7),
  ('matematikk-8:likninger', 'Sette prøve', 'Sette løsningen inn i den opprinnelige likningen for å sjekke at begge sider blir like.', 8),
  ('matematikk-8:likninger', 'Venstre side (VS)', 'Uttrykket til venstre for likhetstegnet.', 9),
  ('matematikk-8:likninger', 'Høyre side (HS)', 'Uttrykket til høyre for likhetstegnet.', 10),
  ('matematikk-8:likninger', 'Likninger med brøk', 'Gang alle ledd med fellesnevneren for å bli kvitt nevnerne: x/2 + 3 = 7 gir x + 6 = 14.', 11),
  ('matematikk-8:likninger', 'Likninger med parentes', 'Gang ut parentesene først, så løs som vanlig: 2(x + 3) = 14 gir 2x + 6 = 14.', 12),
  ('matematikk-8:likninger', 'Modellere med likning', 'Oversette en tekstoppgave til en likning ved å la x stå for det ukjente tallet.', 13),
  ('matematikk-8:likninger', 'Vurdere løsningen', 'Sjekke om svaret gir mening i situasjonen, for eksempel at antall personer er et helt, positivt tall.', 14);
delete from public.quiz_sporsmal where tema_id = 'matematikk-8:likninger';
insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values
  ('matematikk-8:likninger', 'q01', 'flervalg', 'Løs likningen x + 7 = 15.', array['x = 22', 'x = 8', 'x = 7', 'x = 15']::text[], 1, 'Trekk fra 7 på begge sider: x = 15 − 7 = 8. Prøve: 8 + 7 = 15.', true, true, 0),
  ('matematikk-8:likninger', 'q02', 'flervalg', 'Løs likningen 3x + 5 = 20.', array['x = 5', 'x = 25/3', 'x = 15', 'x = 8']::text[], 0, 'Trekk fra 5: 3x = 15. Del på 3: x = 5. Prøve: 3 · 5 + 5 = 20.', true, true, 1),
  ('matematikk-8:likninger', 'q03', 'flervalg', 'Hva er det første lurt å gjøre i likningen 4x − 3 = 21?', array['Dele begge sider på 4', 'Trekke fra 3 på begge sider', 'Legge til 3 på begge sider', 'Gange begge sider med 3']::text[], 2, 'Minus 3 fjernes ved å legge til 3 på begge sider: 4x = 24. Så deler du på 4 og får x = 6.', true, false, 2),
  ('matematikk-8:likninger', 'q04', 'flervalg', 'Løs likningen 5x − 4 = 2x + 11.', array['x = 3', 'x = 7/3', 'x = 15', 'x = 5']::text[], 3, 'Samle x-ledd: 5x − 2x = 3x. Samle tall: 11 + 4 = 15. Da er 3x = 15 og x = 5.', true, true, 3),
  ('matematikk-8:likninger', 'q05', 'flervalg', 'Løs likningen x/3 = 6.', array['x = 2', 'x = 18', 'x = 9', 'x = 3']::text[], 1, 'Gang begge sider med 3: x = 6 · 3 = 18. Prøve: 18/3 = 6.', true, true, 4),
  ('matematikk-8:likninger', 'q06', 'flervalg', 'Løs likningen 2(x + 3) = 14.', array['x = 4', 'x = 5,5', 'x = 8', 'x = 10']::text[], 0, 'Gang ut: 2x + 6 = 14. Trekk fra 6: 2x = 8. Del på 2: x = 4.', true, true, 5),
  ('matematikk-8:likninger', 'q07', 'flervalg', 'Hvilken likning passer? «Buss 1200 kr pluss 150 kr per elev, totalt 5250 kr.»', array['1200x + 150 = 5250', '150 + 1200 = 5250x', '150x + 1200 = 5250', '150x = 5250 + 1200']::text[], 2, 'Prisen per elev ganges med antall elever (150x), og bussen legges til én gang (1200). Summen skal bli 5250.', true, true, 6),
  ('matematikk-8:likninger', 'q08', 'flervalg', 'Du har løst en likning og fått x = 6. Hvordan setter du prøve?', array['Løser likningen på nytt med en annen metode', 'Setter x = 6 inn i den opprinnelige likningen og sjekker at sidene blir like', 'Ganger svaret med 2 og ser om det blir partall', 'Deler begge sider på 6']::text[], 1, 'En prøve betyr å sette løsningen inn i den opprinnelige likningen. Blir venstre og høyre side like, er løsningen riktig.', true, false, 7),
  ('matematikk-8:likninger', 'q09', 'flervalg', 'En likning om antall elever gir x = 26,4. Hva bør du tenke?', array['At det var 26,4 elever', 'At svaret skal rundes opp til 27 uten videre', 'At svaret skal rundes ned til 26 uten videre', 'At det trolig er en feil, fordi antall elever må være et helt tall']::text[], 3, 'Antall elever må være et helt, positivt tall. Et desimalsvar tyder på regnefeil eller feil i opplysningene, og bør sjekkes.', true, true, 8),
  ('matematikk-8:likninger', 'q10', 'flervalg', 'Løs likningen 7 − x = 2.', array['x = 5', 'x = −5', 'x = 9', 'x = −9']::text[], 0, 'Legg til x på begge sider: 7 = 2 + x. Trekk fra 2: x = 5. Prøve: 7 − 5 = 2.', true, true, 9),
  ('matematikk-8:likninger', 'm01', 'sant-usant', 'x = 4 er løsningen på likningen 2x + 1 = 9.', array['Sant', 'Usant']::text[], 0, 'Prøve: 2 · 4 + 1 = 9. Begge sider blir 9.', false, true, 10),
  ('matematikk-8:likninger', 'm02', 'sant-usant', 'Du kan dele begge sider av en likning på 0.', array['Sant', 'Usant']::text[], 1, 'Deling på 0 er ikke definert. Du kan gange og dele med alle andre tall.', false, true, 11),
  ('matematikk-8:likninger', 'm03', 'sant-usant', 'Å trekke fra 3 på begge sider gir samme resultat som å flytte +3 over og bytte fortegn.', array['Sant', 'Usant']::text[], 0, 'Å flytte og bytte fortegn er en kortversjon av balansemetoden.', false, true, 12),
  ('matematikk-8:likninger', 'm04', 'sant-usant', 'Likningen x + 3 = x + 5 har løsningen x = 2.', array['Sant', 'Usant']::text[], 1, 'Trekker du fra x på begge sider, får du 3 = 5, som aldri stemmer. Likningen har ingen løsning.', false, true, 13),
  ('matematikk-8:likninger', 'm05', 'flervalg', 'Løs likningen 6x = 42.', array['x = 36', 'x = 48', 'x = 7', 'x = 252']::text[], 2, 'Del begge sider på 6: x = 42 : 6 = 7.', false, true, 14),
  ('matematikk-8:likninger', 'm06', 'flervalg', 'Løs likningen x/4 + 2 = 5.', array['x = 28', 'x = 12', 'x = 3', 'x = 7']::text[], 1, 'Trekk fra 2: x/4 = 3. Gang med 4: x = 12. Prøve: 12/4 + 2 = 5.', false, true, 15),
  ('matematikk-8:likninger', 'm07', 'flervalg', 'Summen av et tall og det dobbelte av tallet er 36. Hvilket tall er det?', array['12', '18', '9', '6']::text[], 0, 'x + 2x = 36 gir 3x = 36 og x = 12. Prøve: 12 + 24 = 36.', false, true, 16);
insert into public.miniprover (tema_id, minutter) values
  ('matematikk-8:likninger', 15)
on conflict (tema_id) do update set minutter = excluded.minutter;

-- Matematikk: Ulikheter
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('matematikk-8:ulikheter', 'matematikk-8', 'ulikheter', 'Ulikheter', 'Ulikhetstegnene, hvordan du løser ulikheter nesten som likninger, den viktige regelen om å snu tegnet, og hvordan du viser løsningen på tallinja.', array[7]::int[], 5, 'utkast', '{}'::text[], false, now())
on conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,
  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,
  publisert = excluded.publisert, oppdatert = excluded.oppdatert;
insert into public.tema_innhold (tema_id, sammendrag, tankekart) values
  ('matematikk-8:ulikheter', '## Hva er en ulikhet?

En **ulikhet** sammenligner to uttrykk som ikke nødvendigvis er like store. Vi bruker fire tegn:

- **<** betyr «mindre enn»: 3 < 7.
- **>** betyr «større enn»: 10 > 4.
- **≤** betyr «mindre enn eller lik».
- **≥** betyr «større enn eller lik».

En huskeregel er at den åpne siden av tegnet alltid vender mot det største tallet. Ulikheten x > 2 betyr at x kan være alle tall større enn 2. Løsningen er derfor ikke ett tall, men en hel **mengde** av tall.

## Løse ulikheter

Ulikheter løses nesten på samme måte som likninger. Du kan legge til eller trekke fra samme tall på begge sider, og du kan gange eller dele begge sider med samme **positive** tall uten at tegnet endres.

Eksempel: 2x + 3 < 11. Trekk fra 3: 2x < 8. Del på 2: x < 4.

## Når tegnet må snus

Den viktigste forskjellen fra likninger: Når du ganger eller deler begge sider med et **negativt** tall, må ulikhetstegnet snus. Vi ser hvorfor med et eksempel: 2 < 5 er sant. Ganger vi begge sider med −1, får vi −2 og −5. Men −2 er større enn −5, så det riktige blir −2 > −5.

Eksempel: −3x ≤ 12. Del på −3 og snu tegnet: x ≥ −4.

Du kan også unngå å dele på et negativt tall ved å flytte x-leddet til den andre siden, slik at koeffisienten blir positiv.

## Løsningen på tallinja

Løsningen tegnes ofte på en **tallinje**. En åpen ring betyr at tallet ikke er med (ved < og >). En fylt prikk betyr at tallet er med (ved ≤ og ≥). En pil viser hvilken vei løsningen fortsetter. x ≥ −4 tegnes med fylt prikk på −4 og pil mot høyre.

## Ulikheter i praksis og kontroll

Ulikheter passer når det er en grense: «Du har 200 kr og kjøper kinobilletter til 85 kr. Hvor mange har du råd til?» gir 85x ≤ 200 og x ≤ 2,35. Fordi billetter er hele tall, er svaret høyst 2 billetter. Kontroller alltid løsningen ved å teste et tall som skal være med og et som ikke skal være med. Sjekk også om løsningen er gyldig i situasjonen, for eksempel at antall ikke kan være negativt.', '{"label":"Ulikheter","children":[{"label":"Tegn","children":[{"label":"<  og  >","note":"Mindre enn / større enn"},{"label":"≤  og  ≥","note":"Tallet er med"},{"label":"Huskeregel","note":"Åpen side mot største tall"}]},{"label":"Løse","children":[{"label":"Som likninger","note":"Samme på begge sider"},{"label":"Snu tegnet","note":"Ved · eller : med negativt tall"},{"label":"Løsningsmengde","note":"Mange tall, ikke ett"}]},{"label":"Tallinje","children":[{"label":"Åpen ring","note":"Ikke med (<, >)"},{"label":"Fylt prikk","note":"Med (≤, ≥)"},{"label":"Pil","note":"Retning for løsningen"}]},{"label":"I praksis","children":[{"label":"Høyst / minst","note":"≤ / ≥"},{"label":"Test løsningen","note":"Et tall med, et tall utenfor"},{"label":"Gyldighet","note":"Hele tall, ikke negative"}]}]}'::jsonb)
on conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;
delete from public.flashcards where tema_id = 'matematikk-8:ulikheter';
insert into public.flashcards (tema_id, begrep, forklaring, sortering) values
  ('matematikk-8:ulikheter', 'Ulikhet', 'Et utsagn som sammenligner to uttrykk med <, >, ≤ eller ≥ i stedet for =.', 0),
  ('matematikk-8:ulikheter', '<', 'Mindre enn. 3 < 7 betyr at 3 er mindre enn 7.', 1),
  ('matematikk-8:ulikheter', '>', 'Større enn. 10 > 4 betyr at 10 er større enn 4.', 2),
  ('matematikk-8:ulikheter', '≤', 'Mindre enn eller lik. x ≤ 5 betyr at x kan være 5 eller alt som er mindre.', 3),
  ('matematikk-8:ulikheter', '≥', 'Større enn eller lik. x ≥ −2 betyr at x kan være −2 eller alt som er større.', 4),
  ('matematikk-8:ulikheter', 'Huskeregel for tegnet', 'Den åpne siden av tegnet vender alltid mot det største tallet.', 5),
  ('matematikk-8:ulikheter', 'Løsningsmengde', 'Alle tallene som gjør ulikheten sann. For x > 2 er det alle tall større enn 2.', 6),
  ('matematikk-8:ulikheter', 'Snu tegnet', 'Når du ganger eller deler begge sider med et negativt tall, må ulikhetstegnet snus.', 7),
  ('matematikk-8:ulikheter', 'Hvorfor snu?', '2 < 5, men ganget med −1 blir det −2 og −5, og −2 > −5.', 8),
  ('matematikk-8:ulikheter', 'Åpen ring på tallinja', 'Tallet er ikke med i løsningen. Brukes ved < og >.', 9),
  ('matematikk-8:ulikheter', 'Fylt prikk på tallinja', 'Tallet er med i løsningen. Brukes ved ≤ og ≥.', 10),
  ('matematikk-8:ulikheter', 'Positiv koeffisient', 'Flytt x-leddet slik at tallet foran x blir positivt, så slipper du å snu tegnet.', 11),
  ('matematikk-8:ulikheter', 'Teste løsningen', 'Sett inn ett tall som skal være med og ett som ikke skal være med, og se om ulikheten stemmer.', 12),
  ('matematikk-8:ulikheter', 'Gyldig løsning', 'En løsning som gir mening i situasjonen, for eksempel et helt, positivt antall billetter.', 13),
  ('matematikk-8:ulikheter', 'Høyst og minst', '«Høyst 5» betyr x ≤ 5. «Minst 5» betyr x ≥ 5.', 14);
delete from public.quiz_sporsmal where tema_id = 'matematikk-8:ulikheter';
insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values
  ('matematikk-8:ulikheter', 'q01', 'flervalg', 'Hva betyr x ≥ 3?', array['x er mindre enn 3', 'x er større enn eller lik 3', 'x er lik 3', 'x er større enn 3, men ikke lik 3']::text[], 1, 'Tegnet ≥ betyr større enn eller lik. 3 er altså med i løsningen.', true, true, 0),
  ('matematikk-8:ulikheter', 'q02', 'flervalg', 'Løs ulikheten x + 5 > 9.', array['x > 14', 'x < 4', 'x > 4', 'x = 4']::text[], 2, 'Trekk fra 5 på begge sider: x > 4. Tegnet endres ikke når du trekker fra et tall.', true, true, 1),
  ('matematikk-8:ulikheter', 'q03', 'flervalg', 'Løs ulikheten 2x + 3 < 11.', array['x < 4', 'x > 4', 'x < 7', 'x < 8']::text[], 0, 'Trekk fra 3: 2x < 8. Del på 2 (et positivt tall): x < 4.', true, true, 2),
  ('matematikk-8:ulikheter', 'q04', 'flervalg', 'Når må du snu ulikhetstegnet?', array['Når du legger til et negativt tall', 'Når du deler på et positivt tall', 'Når du trekker fra et tall', 'Når du ganger eller deler med et negativt tall']::text[], 3, 'Bare multiplikasjon og divisjon med negative tall snur rekkefølgen på tallene, og da må tegnet snus.', true, true, 3),
  ('matematikk-8:ulikheter', 'q05', 'flervalg', 'Løs ulikheten −3x ≤ 12.', array['x ≤ −4', 'x ≥ −4', 'x ≥ 4', 'x ≤ 4']::text[], 1, 'Del på −3 og snu tegnet: x ≥ −4. Test x = 0: −3 · 0 = 0 ≤ 12, stemmer.', true, true, 4),
  ('matematikk-8:ulikheter', 'q06', 'flervalg', 'Hvordan tegner du x < 2 på en tallinje?', array['Åpen ring på 2 og pil mot venstre', 'Fylt prikk på 2 og pil mot venstre', 'Åpen ring på 2 og pil mot høyre', 'Fylt prikk på 2 og pil mot høyre']::text[], 0, '2 er ikke med (<), så ringen er åpen. Tallene mindre enn 2 ligger til venstre.', true, false, 5),
  ('matematikk-8:ulikheter', 'q07', 'flervalg', 'Hvilket tall er en løsning av 4x − 1 > 7?', array['x = 0', 'x = 1', 'x = 2', 'x = 3']::text[], 3, '4x − 1 > 7 gir 4x > 8 og x > 2. Bare x = 3 er større enn 2. For x = 2 blir 4 · 2 − 1 = 7, som ikke er større enn 7.', true, true, 6),
  ('matematikk-8:ulikheter', 'q08', 'flervalg', 'Du har 200 kr, og en kinobillett koster 85 kr. Hvor mange billetter kan du høyst kjøpe?', array['3', '2', '2,35', '1']::text[], 1, '85x ≤ 200 gir x ≤ 2,35. Du kan bare kjøpe hele billetter, så svaret er høyst 2.', true, true, 7),
  ('matematikk-8:ulikheter', 'q09', 'flervalg', 'Hvilket utsagn er sant?', array['−7 > −2', '−3 < −5', '−1 > −4', '0 < −1']::text[], 2, 'På tallinja ligger −1 til høyre for −4, så −1 er størst. For negative tall er det nærmest null som er størst.', true, true, 8),
  ('matematikk-8:ulikheter', 'q10', 'flervalg', '«Du må være minst 15 år.» Hvilken ulikhet passer for alderen a?', array['a ≥ 15', 'a > 15', 'a ≤ 15', 'a < 15']::text[], 0, '«Minst 15» betyr 15 eller mer, altså a ≥ 15. Den som akkurat har fylt 15, er med.', true, false, 9),
  ('matematikk-8:ulikheter', 'm01', 'sant-usant', 'Løsningen på en ulikhet er ofte mange tall, ikke bare ett.', array['Sant', 'Usant']::text[], 0, 'x > 2 er oppfylt av alle tall større enn 2, for eksempel 2,1, 3 og 100.', false, true, 10),
  ('matematikk-8:ulikheter', 'm02', 'sant-usant', 'Når du deler begge sider på 5, må du snu ulikhetstegnet.', array['Sant', 'Usant']::text[], 1, '5 er positivt, så tegnet beholdes. Tegnet snus bare ved multiplikasjon eller divisjon med et negativt tall.', false, true, 11),
  ('matematikk-8:ulikheter', 'm03', 'sant-usant', '−10 < −3.', array['Sant', 'Usant']::text[], 0, '−10 ligger lenger til venstre på tallinja enn −3, og er derfor minst.', false, true, 12),
  ('matematikk-8:ulikheter', 'm04', 'sant-usant', 'x ≤ 6 tegnes med åpen ring på 6.', array['Sant', 'Usant']::text[], 1, 'Tegnet ≤ betyr at 6 er med i løsningen. Da brukes fylt prikk.', false, true, 13),
  ('matematikk-8:ulikheter', 'm05', 'flervalg', 'Løs ulikheten 5 − x > 2.', array['x > 3', 'x > −3', 'x < 3', 'x < −3']::text[], 2, 'Trekk fra 5: −x > −3. Gang med −1 og snu tegnet: x < 3. Test x = 0: 5 > 2, stemmer.', false, true, 14),
  ('matematikk-8:ulikheter', 'm06', 'flervalg', '«Høyst 30 elever» kan skrives som', array['e > 30', 'e ≥ 30', 'e < 30', 'e ≤ 30']::text[], 3, 'Høyst 30 betyr 30 eller færre, altså e ≤ 30.', false, true, 15),
  ('matematikk-8:ulikheter', 'm07', 'flervalg', 'Løs ulikheten 3x − 4 ≥ 2x + 1.', array['x ≥ 5', 'x ≥ −3', 'x ≤ 5', 'x ≥ 1']::text[], 0, 'Trekk fra 2x: x − 4 ≥ 1. Legg til 4: x ≥ 5.', false, true, 16);
insert into public.miniprover (tema_id, minutter) values
  ('matematikk-8:ulikheter', 15)
on conflict (tema_id) do update set minutter = excluded.minutter;

-- Matematikk: Funksjoner
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('matematikk-8:funksjoner', 'matematikk-8', 'funksjoner', 'Funksjoner', 'Hva en funksjon er, og hvordan samme sammenheng kan vises som situasjon, tabell, graf og uttrykk.', array[8, 9]::int[], 6, 'utkast', '{}'::text[], false, now())
on conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,
  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,
  publisert = excluded.publisert, oppdatert = excluded.oppdatert;
insert into public.tema_innhold (tema_id, sammendrag, tankekart) values
  ('matematikk-8:funksjoner', '## Hva er en funksjon?

En **funksjon** er en sammenheng der hver inngangsverdi gir nøyaktig én utgangsverdi. Prisen på epler avhenger av hvor mange kilo du kjøper, og temperaturen i en kopp te avhenger av hvor lenge den har stått. Verdien vi velger, kalles den **uavhengige variabelen** og skrives ofte x. Verdien som blir bestemt av den, kalles den **avhengige variabelen** og skrives y eller f(x).

## Fire måter å vise en funksjon på

Samme sammenheng kan vises på fire måter, og det er nyttig å kunne gå fra den ene til den andre.

- **Situasjon**: «Et abonnement koster 100 kr i måneden pluss 2 kr per minutt.»
- **Uttrykk**: y = 2x + 100, der x er antall minutter og y er prisen.
- **Tabell**: x = 0 gir y = 100, x = 50 gir y = 200, x = 100 gir y = 300.
- **Graf**: punktene (0, 100), (50, 200) og (100, 300) tegnes i et koordinatsystem og bindes sammen.

Uttrykket er lettest å regne med, tabellen gir raske tall, grafen gir oversikt, og situasjonen forteller hva tallene betyr.

## Koordinatsystemet

Et **koordinatsystem** har en vannrett x-akse og en loddrett y-akse som krysser hverandre i **origo** (0, 0). Et punkt skrives (x, y): først hvor langt til siden, så hvor langt opp. Når vi tegner grafen til en funksjon, står den uavhengige variabelen alltid på x-aksen.

## Lineære og ikke-lineære funksjoner

En funksjon der grafen er en rett linje, kalles **lineær**. Den øker eller minker med like mye for hver enhet: abonnementet ovenfor blir 2 kr dyrere per minutt. Tallet 2 kalles **stigningstallet**, og 100 er **konstantleddet**, der grafen krysser y-aksen.

Andre funksjoner gir krumme grafer. Arealet av et kvadrat, A = s², vokser raskere og raskere, og te som avkjøles, synker først raskt og så sakte. Når du sammenligner funksjoner, kan du se på om de øker eller minker, hvor raskt de endrer seg, og hvor grafene krysser hverandre.

## Lese grafer kritisk

Når du leser av en graf, sjekk hva aksene viser og hvilke enheter som brukes. En graf kan se bratt ut bare fordi skalaen på y-aksen er strukket. Spør også om funksjonen gir mening for alle x-verdier. Antall minutter kan ikke være negativt, så grafen for abonnementet starter i x = 0.', '{"label":"Funksjoner","children":[{"label":"Begreper","children":[{"label":"Uavhengig variabel","note":"x – vi velger"},{"label":"Avhengig variabel","note":"y eller f(x)"},{"label":"Én y for hver x"}]},{"label":"Fire representasjoner","children":[{"label":"Situasjon","note":"Hva tallene betyr"},{"label":"Uttrykk","note":"y = 2x + 100"},{"label":"Tabell","note":"Utvalgte verdier"},{"label":"Graf","note":"Oversikt"}]},{"label":"Koordinatsystem","children":[{"label":"x-akse og y-akse"},{"label":"Origo","note":"(0, 0)"},{"label":"Punkt (x, y)"}]},{"label":"Typer","children":[{"label":"Lineær","note":"Rett linje"},{"label":"Stigningstall","note":"Endring per enhet"},{"label":"Konstantledd","note":"Skjæring med y-aksen"},{"label":"Ikke-lineær","note":"Krum graf"}]}]}'::jsonb)
on conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;
delete from public.flashcards where tema_id = 'matematikk-8:funksjoner';
insert into public.flashcards (tema_id, begrep, forklaring, sortering) values
  ('matematikk-8:funksjoner', 'Funksjon', 'En sammenheng der hver inngangsverdi (x) gir nøyaktig én utgangsverdi (y).', 0),
  ('matematikk-8:funksjoner', 'Uavhengig variabel', 'Verdien vi velger fritt, ofte x. Den står på x-aksen.', 1),
  ('matematikk-8:funksjoner', 'Avhengig variabel', 'Verdien som bestemmes av x, ofte y eller f(x). Den står på y-aksen.', 2),
  ('matematikk-8:funksjoner', 'f(x)', 'Skrivemåte for funksjonsverdien. f(3) er verdien når x = 3.', 3),
  ('matematikk-8:funksjoner', 'Funksjonsuttrykk', 'En formel som gir y ut fra x, for eksempel y = 2x + 100.', 4),
  ('matematikk-8:funksjoner', 'Verditabell', 'En tabell med utvalgte x-verdier og de tilhørende y-verdiene.', 5),
  ('matematikk-8:funksjoner', 'Graf', 'Tegningen av en funksjon i et koordinatsystem.', 6),
  ('matematikk-8:funksjoner', 'Koordinatsystem', 'To akser som står vinkelrett på hverandre: x-aksen vannrett og y-aksen loddrett.', 7),
  ('matematikk-8:funksjoner', 'Origo', 'Punktet (0, 0), der x-aksen og y-aksen krysser hverandre.', 8),
  ('matematikk-8:funksjoner', 'Koordinater (x, y)', 'Et punkts plassering: først x (sideveis), så y (opp eller ned).', 9),
  ('matematikk-8:funksjoner', 'Lineær funksjon', 'En funksjon med en rett linje som graf. Den endrer seg like mye for hver enhet i x.', 10),
  ('matematikk-8:funksjoner', 'Stigningstall', 'Hvor mye y endrer seg når x øker med 1. I y = 2x + 100 er det 2.', 11),
  ('matematikk-8:funksjoner', 'Konstantledd', 'Verdien av y når x = 0. Det er der grafen krysser y-aksen. I y = 2x + 100 er det 100.', 12),
  ('matematikk-8:funksjoner', 'Ikke-lineær funksjon', 'En funksjon med krum graf, for eksempel A = s², som vokser raskere og raskere.', 13),
  ('matematikk-8:funksjoner', 'Skala på aksene', 'Avstanden mellom tallene på aksene. En strukket skala kan få en endring til å se større ut enn den er.', 14);
delete from public.quiz_sporsmal where tema_id = 'matematikk-8:funksjoner';
insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values
  ('matematikk-8:funksjoner', 'q01', 'flervalg', 'Hva er y når x = 5 i funksjonen y = 3x + 2?', array['10', '17', '15', '35']::text[], 1, 'Sett inn x = 5: 3 · 5 + 2 = 15 + 2 = 17.', true, true, 0),
  ('matematikk-8:funksjoner', 'q02', 'flervalg', 'Hva kalles punktet (0, 0) i et koordinatsystem?', array['Origo', 'Konstantleddet', 'Stigningstallet', 'Toppunktet']::text[], 0, 'Origo er punktet der x-aksen og y-aksen krysser hverandre, (0, 0).', true, true, 1),
  ('matematikk-8:funksjoner', 'q03', 'flervalg', 'Et abonnement koster 100 kr per måned pluss 2 kr per minutt. Hvilket uttrykk passer?', array['y = 100x + 2', 'y = 102x', 'y = 2x + 100', 'y = 2 + 100']::text[], 2, 'Minuttprisen ganges med antall minutter (2x), og den faste månedsprisen legges til (100).', true, true, 2),
  ('matematikk-8:funksjoner', 'q04', 'flervalg', 'Hva er stigningstallet i y = −4x + 7?', array['7', '4', 'x', '−4']::text[], 3, 'Stigningstallet er tallet foran x. Her er det −4, så y minker med 4 for hver gang x øker med 1.', true, true, 3),
  ('matematikk-8:funksjoner', 'q05', 'flervalg', 'Hvor krysser grafen til y = 2x + 5 y-aksen?', array['I (0, 5)', 'I (5, 0)', 'I (0, 2)', 'I (2, 5)']::text[], 0, 'På y-aksen er x = 0. Da er y = 2 · 0 + 5 = 5, så skjæringspunktet er (0, 5).', true, true, 4),
  ('matematikk-8:funksjoner', 'q06', 'flervalg', 'Hvilken tabell passer til y = x + 3?', array['x = 1, y = 3', 'x = 2, y = 5', 'x = 3, y = 3', 'x = 4, y = 12']::text[], 1, '2 + 3 = 5. Sjekk de andre: 1 + 3 = 4, 3 + 3 = 6 og 4 + 3 = 7.', true, false, 5),
  ('matematikk-8:funksjoner', 'q07', 'flervalg', 'Hvilken funksjon har en rett linje som graf?', array['A = s²', 'y = x · x', 'y = 5x − 1', 'y = 2ˣ']::text[], 2, 'y = 5x − 1 er lineær: y øker med 5 hver gang x øker med 1. De andre vokser raskere og raskere og gir krumme grafer.', true, true, 6),
  ('matematikk-8:funksjoner', 'q08', 'flervalg', 'I punktet (4, −2), hva er y-koordinaten?', array['4', '2', '−4', '−2']::text[], 3, 'Koordinatene skrives (x, y). Den andre verdien, −2, er y-koordinaten.', true, false, 7),
  ('matematikk-8:funksjoner', 'q09', 'flervalg', 'En graf over temperaturen i en kopp te synker raskt først og så langsommere. Hvordan ser grafen ut?', array['En rett linje som stiger', 'En krum linje som synker og flater ut', 'En vannrett linje', 'En rett linje som synker like mye hele tiden']::text[], 1, 'Endringen er ikke lik hele tiden, så grafen er krum. Den synker bratt først og blir flatere etter hvert.', true, true, 8),
  ('matematikk-8:funksjoner', 'q10', 'flervalg', 'Hvorfor starter grafen for abonnementsprisen i x = 0?', array['Fordi funksjonen ikke kan tegnes for negative tall', 'Fordi prisen er 0 der', 'Fordi antall minutter ikke kan være negativt', 'Fordi stigningstallet er positivt']::text[], 2, 'x står for antall minutter, og det gir ikke mening med negative minutter. Grafen tegnes derfor bare for x ≥ 0.', true, true, 9),
  ('matematikk-8:funksjoner', 'm01', 'sant-usant', 'I en funksjon kan én x-verdi gi to ulike y-verdier.', array['Sant', 'Usant']::text[], 1, 'I en funksjon gir hver x-verdi nøyaktig én y-verdi.', false, true, 10),
  ('matematikk-8:funksjoner', 'm02', 'sant-usant', 'Grafen til y = 3x + 1 er en rett linje.', array['Sant', 'Usant']::text[], 0, 'Funksjonen er lineær: y øker med 3 hver gang x øker med 1.', false, true, 11),
  ('matematikk-8:funksjoner', 'm03', 'sant-usant', 'Den uavhengige variabelen tegnes langs y-aksen.', array['Sant', 'Usant']::text[], 1, 'Den uavhengige variabelen, x, står langs den vannrette x-aksen.', false, true, 12),
  ('matematikk-8:funksjoner', 'm04', 'sant-usant', 'En strukket skala på y-aksen kan få en liten endring til å se stor ut.', array['Sant', 'Usant']::text[], 0, 'Derfor må du alltid sjekke tallene på aksene når du leser en graf.', false, true, 13),
  ('matematikk-8:funksjoner', 'm05', 'flervalg', 'Hva er f(2) når f(x) = x² + 1?', array['5', '3', '4', '9']::text[], 0, 'Sett inn x = 2: 2² + 1 = 4 + 1 = 5.', false, true, 14),
  ('matematikk-8:funksjoner', 'm06', 'flervalg', 'Hvilket punkt ligger på grafen til y = 2x − 1?', array['(1, 2)', '(2, 3)', '(3, 4)', '(0, 1)']::text[], 1, 'Med x = 2 blir y = 2 · 2 − 1 = 3. Punktet (2, 3) ligger derfor på grafen.', false, true, 15),
  ('matematikk-8:funksjoner', 'm07', 'flervalg', 'Et taxiselskap tar 50 kr + 12 kr per km. Hva er konstantleddet?', array['12', '62', '50', '600']::text[], 2, 'Konstantleddet er den faste delen som ikke avhenger av antall km, altså 50 kr.', false, true, 16);
insert into public.miniprover (tema_id, minutter) values
  ('matematikk-8:funksjoner', 15)
on conflict (tema_id) do update set minutter = excluded.minutter;

-- Matematikk: Algoritmer og programmering
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('matematikk-8:algoritmer-og-programmering', 'matematikk-8', 'algoritmer-og-programmering', 'Algoritmer og programmering', 'Hva en algoritme er, og hvordan du bruker variabler, løkker og betingelser til å lage, teste og forbedre programmer som løser matematiske oppgaver.', array[10]::int[], 7, 'utkast', '{}'::text[], false, now())
on conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,
  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,
  publisert = excluded.publisert, oppdatert = excluded.oppdatert;
insert into public.tema_innhold (tema_id, sammendrag, tankekart) values
  ('matematikk-8:algoritmer-og-programmering', '## Hva er en algoritme?

En **algoritme** er en nøyaktig oppskrift som løser et problem steg for steg. Oppskriften må være så tydelig at den kan følges uten å tenke selv, og den må stoppe etter et endelig antall steg. Du bruker algoritmer hele tiden i matematikk, for eksempel når du stiller opp et gangestykke eller finner fellesnevner. Et **program** er en algoritme skrevet på et språk som en datamaskin forstår, for eksempel Python eller Scratch.

## Byggesteinene i et program

- **Variabler** lagrer verdier som kan endre seg. I Python skriver vi sum = 0.
- **Sekvens** betyr at kommandoene utføres i den rekkefølgen de står.
- **Løkker** gjentar kommandoer. En for-løkke gjentar et bestemt antall ganger, og en while-løkke gjentar så lenge en betingelse er sann.
- **Betingelser** (if-setninger) lar programmet velge: if tall % 2 == 0 betyr «hvis tallet er delelig med 2».
- **Input og output**: programmet kan få inn tall fra brukeren og skrive ut svar med print.

Et lite eksempel som legger sammen tallene fra 1 til 100:

sum = 0, så for n i området 1 til 100: sum = sum + n, og til slutt print(sum). Svaret blir 5050.

## Lage, teste og forbedre

Arbeid med algoritmer skjer i runder. Først **lager** du en plan, gjerne som punktliste eller flytskjema. Så **tester** du programmet med tall der du vet svaret, for eksempel summen fra 1 til 4 = 10. Finner du feil, må du **feilsøke**: gå gjennom programmet linje for linje, skriv ut mellomverdier og sjekk om variablene får de verdiene du venter.

Til slutt kan du **forbedre** algoritmen. Den kan bli kortere, raskere eller fungere for flere tilfeller. Summen 1 + 2 + … + n kan for eksempel regnes ut direkte med formelen n(n + 1)/2 i stedet for med en løkke. Det viser hvordan matematikk kan gjøre et program mer effektivt.

## Vanlige feil

Typiske feil er at en løkke stopper ett steg for tidlig eller for sent, at en variabel ikke får en startverdi, eller at en betingelse aldri blir usann slik at programmet går i evig løkke. I Python er innrykk en del av språket, så feil innrykk kan gjøre at kode havner utenfor løkka.', '{"label":"Algoritmer og programmering","children":[{"label":"Algoritme","children":[{"label":"Steg-for-steg-oppskrift"},{"label":"Må stoppe"},{"label":"Flytskjema","note":"Tegnet algoritme"}]},{"label":"Byggesteiner","children":[{"label":"Variabel","note":"sum = 0"},{"label":"Sekvens","note":"Linje for linje"},{"label":"Løkker","note":"for og while"},{"label":"Betingelser","note":"if … else"}]},{"label":"Arbeidsmåte","children":[{"label":"Lage","note":"Plan først"},{"label":"Teste","note":"Kjente svar"},{"label":"Feilsøke","note":"Skriv ut mellomverdier"},{"label":"Forbedre","note":"Raskere, mer generell"}]},{"label":"Vanlige feil","children":[{"label":"Evig løkke"},{"label":"Ett steg for mye/lite"},{"label":"Feil innrykk","note":"Viktig i Python"}]}]}'::jsonb)
on conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;
delete from public.flashcards where tema_id = 'matematikk-8:algoritmer-og-programmering';
insert into public.flashcards (tema_id, begrep, forklaring, sortering) values
  ('matematikk-8:algoritmer-og-programmering', 'Algoritme', 'En nøyaktig oppskrift som løser et problem steg for steg og stopper etter et endelig antall steg.', 0),
  ('matematikk-8:algoritmer-og-programmering', 'Program', 'En algoritme skrevet i et programmeringsspråk som en datamaskin kan utføre.', 1),
  ('matematikk-8:algoritmer-og-programmering', 'Variabel (i programmering)', 'Et navn som lagrer en verdi som kan endre seg, for eksempel sum = 0.', 2),
  ('matematikk-8:algoritmer-og-programmering', 'Sekvens', 'Kommandoene utføres én etter én i den rekkefølgen de står.', 3),
  ('matematikk-8:algoritmer-og-programmering', 'Løkke', 'En del av programmet som gjentas flere ganger.', 4),
  ('matematikk-8:algoritmer-og-programmering', 'for-løkke', 'En løkke som gjentas et bestemt antall ganger, for eksempel for hvert tall fra 1 til 100.', 5),
  ('matematikk-8:algoritmer-og-programmering', 'while-løkke', 'En løkke som gjentas så lenge en betingelse er sann.', 6),
  ('matematikk-8:algoritmer-og-programmering', 'Betingelse (if)', 'Lar programmet velge hva som skal skje ut fra om noe er sant eller usant.', 7),
  ('matematikk-8:algoritmer-og-programmering', '% (modulo)', 'Gir resten ved divisjon. 17 % 5 = 2. Et tall er partall hvis tall % 2 == 0.', 8),
  ('matematikk-8:algoritmer-og-programmering', 'print', 'Kommando i Python som skriver ut en verdi eller tekst på skjermen.', 9),
  ('matematikk-8:algoritmer-og-programmering', 'Flytskjema', 'En tegning av en algoritme med bokser for handlinger og valg, bundet sammen med piler.', 10),
  ('matematikk-8:algoritmer-og-programmering', 'Teste', 'Kjøre programmet med verdier der du kjenner svaret, for å se om det virker.', 11),
  ('matematikk-8:algoritmer-og-programmering', 'Feilsøke', 'Finne og rette feil i et program, for eksempel ved å skrive ut mellomverdier.', 12),
  ('matematikk-8:algoritmer-og-programmering', 'Evig løkke', 'En løkke der betingelsen aldri blir usann, slik at programmet aldri stopper.', 13),
  ('matematikk-8:algoritmer-og-programmering', 'Effektiv algoritme', 'En algoritme som bruker få steg. Summen 1 + … + n kan regnes direkte med n(n + 1)/2.', 14);
delete from public.quiz_sporsmal where tema_id = 'matematikk-8:algoritmer-og-programmering';
insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values
  ('matematikk-8:algoritmer-og-programmering', 'q01', 'flervalg', 'Hva er en algoritme?', array['Et dataprogram som bare kan skrives i Python', 'En nøyaktig trinnvis oppskrift for å løse et problem', 'En type graf', 'Et matematisk bevis']::text[], 1, 'En algoritme er en steg-for-steg-oppskrift. Den kan skrives på papir, som flytskjema eller som et program.', true, true, 0),
  ('matematikk-8:algoritmer-og-programmering', 'q02', 'flervalg', 'Hvilken byggestein brukes til å gjenta kode mange ganger?', array['Variabel', 'Betingelse', 'print', 'Løkke']::text[], 3, 'En løkke gjentar kommandoene inni seg, enten et bestemt antall ganger (for) eller så lenge noe er sant (while).', true, true, 1),
  ('matematikk-8:algoritmer-og-programmering', 'q03', 'flervalg', 'Hva er 23 % 5 i Python?', array['3', '4', '4,6', '18']::text[], 0, '% gir resten ved divisjon. 23 = 4 · 5 + 3, så resten er 3.', true, true, 2),
  ('matematikk-8:algoritmer-og-programmering', 'q04', 'flervalg', 'Et program skal legge sammen tallene fra 1 til 100. Hva blir svaret?', array['100', '5000', '5050', '10 100']::text[], 2, 'Med formelen n(n + 1)/2: 100 · 101 / 2 = 5050. Et riktig program med løkke gir samme svar.', true, true, 3),
  ('matematikk-8:algoritmer-og-programmering', 'q05', 'flervalg', 'Hvilken betingelse sjekker om tallet t er et partall?', array['t % 2 == 1', 't / 2 == 0', 't % 2 == 0', 't == 2']::text[], 2, 'Et partall gir rest 0 ved deling på 2. Derfor bruker vi t % 2 == 0.', true, true, 4),
  ('matematikk-8:algoritmer-og-programmering', 'q06', 'flervalg', 'Hvorfor tester vi et program med tall der vi kjenner svaret?', array['For å se om programmet gir riktig resultat', 'For å gjøre programmet raskere', 'Fordi datamaskinen krever det', 'For å slippe å bruke variabler']::text[], 0, 'Kjenner du svaret på forhånd, kan du sammenligne og oppdage om programmet regner feil.', true, false, 5),
  ('matematikk-8:algoritmer-og-programmering', 'q07', 'flervalg', 'Hva kalles en løkke som aldri stopper?', array['En for-løkke', 'En evig løkke', 'En betingelse', 'En sekvens']::text[], 1, 'Hvis betingelsen i en while-løkke aldri blir usann, fortsetter løkka i det uendelige.', true, true, 6),
  ('matematikk-8:algoritmer-og-programmering', 'q08', 'flervalg', 'Hva gjør linjen sum = sum + n inne i en løkke?', array['Setter sum lik n', 'Sjekker om sum er lik n', 'Skriver ut summen', 'Legger n til den verdien sum allerede har']::text[], 3, 'Høyre side regnes ut først med den gamle verdien av sum. Resultatet lagres så som ny verdi i sum.', true, true, 7),
  ('matematikk-8:algoritmer-og-programmering', 'q09', 'flervalg', 'Hvilken metode er ofte nyttig når du feilsøker?', array['Slette hele programmet', 'Skrive ut verdien av variablene underveis', 'Bytte programmeringsspråk', 'Kjøre programmet raskere']::text[], 1, 'Ved å skrive ut mellomverdier ser du hvor programmet begynner å oppføre seg annerledes enn du venter.', true, false, 8),
  ('matematikk-8:algoritmer-og-programmering', 'q10', 'flervalg', 'Hva betyr det at en algoritme er forbedret?', array['Den har fått flere linjer', 'Den bruker flere variabler', 'Den gir samme riktige svar, men er for eksempel raskere eller gjelder flere tilfeller', 'Den gir et annet svar enn før']::text[], 2, 'En forbedret algoritme løser fortsatt problemet riktig, men mer effektivt, oversiktlig eller generelt.', true, true, 9),
  ('matematikk-8:algoritmer-og-programmering', 'm01', 'sant-usant', 'En algoritme må alltid skrives i et programmeringsspråk.', array['Sant', 'Usant']::text[], 1, 'En algoritme kan også skrives med vanlige ord, som punktliste eller som flytskjema.', false, true, 10),
  ('matematikk-8:algoritmer-og-programmering', 'm02', 'sant-usant', 'En for-løkke brukes ofte når vi vet hvor mange ganger noe skal gjentas.', array['Sant', 'Usant']::text[], 0, 'For-løkka går gjennom et bestemt område, for eksempel tallene fra 1 til 10.', false, true, 11),
  ('matematikk-8:algoritmer-og-programmering', 'm03', 'sant-usant', 'I Python har innrykk betydning for hvilke linjer som hører til en løkke.', array['Sant', 'Usant']::text[], 0, 'Linjer med innrykk under en for- eller if-setning hører til den. Feil innrykk gir feil oppførsel.', false, true, 12),
  ('matematikk-8:algoritmer-og-programmering', 'm04', 'sant-usant', '17 % 3 er lik 5.', array['Sant', 'Usant']::text[], 1, '% gir resten. 17 = 5 · 3 + 2, så 17 % 3 = 2. Tallet 5 er kvotienten, ikke resten.', false, true, 13),
  ('matematikk-8:algoritmer-og-programmering', 'm05', 'flervalg', 'Hva skrives ut? x = 3, så x = x · 2, så print(x)', array['3', '6', '5', '32']::text[], 1, 'x starter som 3. Linjen x = x · 2 gir x ny verdi 3 · 2 = 6, og det er dette som skrives ut.', false, true, 14),
  ('matematikk-8:algoritmer-og-programmering', 'm06', 'flervalg', 'Hvilken formel gir summen 1 + 2 + … + n direkte?', array['n²', '2n + 1', 'n(n + 1)/2', 'n + 100']::text[], 2, 'n(n + 1)/2 gir for eksempel 4 · 5 / 2 = 10 for n = 4, og 1 + 2 + 3 + 4 = 10.', false, true, 15),
  ('matematikk-8:algoritmer-og-programmering', 'm07', 'flervalg', 'Hva gjør en if-setning?', array['Gjentar kode', 'Lagrer en verdi', 'Skriver ut tekst', 'Lar programmet velge ut fra om noe er sant']::text[], 3, 'En if-setning sjekker en betingelse og utfører kode bare hvis betingelsen er sann.', false, true, 16);
insert into public.miniprover (tema_id, minutter) values
  ('matematikk-8:algoritmer-og-programmering', 15)
on conflict (tema_id) do update set minutter = excluded.minutter;

-- Matematikk (9): rydd bort fjernede temaer
delete from public.temaer where fag_id = 'matematikk-9' and slug not in ('sammensatte-maleenheter', 'formlikhet-og-kongruens', 'pytagoras', 'overflate-og-volum', 'sentralmal-og-spredning', 'statistikk-i-media', 'sannsynlighet', 'simulering');

-- Matematikk: Sammensatte måleenheter
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('matematikk-9:sammensatte-maleenheter', 'matematikk-9', 'sammensatte-maleenheter', 'Sammensatte måleenheter', 'Fart, tetthet, pris per enhet og befolkningstetthet – enheter som består av to andre, og hvordan du regner og gjør om mellom dem.', array[1]::int[], 0, 'utkast', '{}'::text[], false, now())
on conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,
  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,
  publisert = excluded.publisert, oppdatert = excluded.oppdatert;
insert into public.tema_innhold (tema_id, sammendrag, tankekart) values
  ('matematikk-9:sammensatte-maleenheter', '## Hva er en sammensatt måleenhet?

En **sammensatt måleenhet** er laget av to andre enheter, som regel med «per» mellom seg. Kilometer per time (km/h) sier hvor mange kilometer noe beveger seg på én time, og kroner per kilo (kr/kg) sier hva ett kilo koster. Enheten forteller hvordan du skal regne: «per» betyr delt på.

## Fart

**Fart** er strekning delt på tid: v = s / t. En syklist som sykler 36 km på 2 timer, har farten 36 km / 2 h = 18 km/h. Formelen kan snus. Strekningen er s = v · t, og tiden er t = s / v.

Fart måles ofte i km/h eller m/s. For å gjøre om bruker vi at 1 km = 1000 m og 1 h = 3600 s:

- 1 m/s = 3,6 km/h
- Fra m/s til km/h: gang med 3,6. 20 m/s = 72 km/h.
- Fra km/h til m/s: del på 3,6. 90 km/h = 25 m/s.

Når tiden er oppgitt i minutter, må den ofte gjøres om til timer: 45 minutter = 0,75 h.

## Tetthet

**Tetthet** er masse delt på volum og måles ofte i gram per kubikkcentimeter (g/cm³). Vann har tetthet på omtrent 1 g/cm³, og jern omtrent 7,9 g/cm³. En gjenstand med lavere tetthet enn vann flyter. Har en stein masse 270 g og volum 100 cm³, er tettheten 270 g / 100 cm³ = 2,7 g/cm³.

## Pris per enhet

**Enhetspris** er pris delt på mengde, for eksempel kr/kg eller kr/L. Den gjør det lett å sammenligne tilbud. En pakke på 500 g til 45 kr koster 90 kr/kg, mens en pakke på 750 g til 60 kr koster 80 kr/kg. Den største pakken er billigst per kilo.

## Andre eksempler

- **Befolkningstetthet**: innbyggere per km².
- **Strømforbruk**: kilowattimer (kWh) er effekt ganget med tid.
- **Drivstofforbruk**: liter per mil.

## Løse problemer

En god arbeidsmåte er å skrive enhetene med i utregningen. Da ser du om svaret får riktig enhet, og du oppdager om du har glemt å gjøre om. Lag gjerne egne oppgaver: «Hvor lang tid tar det å gå 6 km med farten 5 km/h?» (t = 6 / 5 = 1,2 h, altså 1 time og 12 minutter).', '{"label":"Sammensatte måleenheter","children":[{"label":"Fart","children":[{"label":"v = s / t"},{"label":"s = v · t"},{"label":"m/s ↔ km/h","note":"Gang eller del med 3,6"}]},{"label":"Tetthet","children":[{"label":"Masse / volum","note":"g/cm³"},{"label":"Vann ≈ 1 g/cm³"},{"label":"Flyte eller synke"}]},{"label":"Enhetspris","children":[{"label":"kr/kg og kr/L"},{"label":"Sammenligne tilbud"}]},{"label":"Andre","children":[{"label":"Befolkningstetthet","note":"Innbyggere per km²"},{"label":"kWh","note":"Effekt · tid"},{"label":"Liter per mil"}]},{"label":"Arbeidsmåte","children":[{"label":"Skriv enhetene med"},{"label":"Gjør om minutter til timer","note":"Del på 60"}]}]}'::jsonb)
on conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;
delete from public.flashcards where tema_id = 'matematikk-9:sammensatte-maleenheter';
insert into public.flashcards (tema_id, begrep, forklaring, sortering) values
  ('matematikk-9:sammensatte-maleenheter', 'Sammensatt måleenhet', 'En enhet laget av to andre enheter med «per» imellom, for eksempel km/h eller kr/kg.', 0),
  ('matematikk-9:sammensatte-maleenheter', '«Per»', 'Betyr delt på. 18 km/h betyr 18 km på hver time.', 1),
  ('matematikk-9:sammensatte-maleenheter', 'Fart', 'Strekning delt på tid: v = s / t.', 2),
  ('matematikk-9:sammensatte-maleenheter', 'Strekning fra fart', 's = v · t. 60 km/h i 1,5 h gir 90 km.', 3),
  ('matematikk-9:sammensatte-maleenheter', 'Tid fra fart', 't = s / v. 6 km med 5 km/h tar 1,2 h.', 4),
  ('matematikk-9:sammensatte-maleenheter', '1 m/s', 'Er lik 3,6 km/h.', 5),
  ('matematikk-9:sammensatte-maleenheter', 'm/s til km/h', 'Gang med 3,6. 20 m/s = 72 km/h.', 6),
  ('matematikk-9:sammensatte-maleenheter', 'km/h til m/s', 'Del på 3,6. 90 km/h = 25 m/s.', 7),
  ('matematikk-9:sammensatte-maleenheter', 'Minutter til timer', 'Del på 60. 45 min = 0,75 h og 12 min = 0,2 h.', 8),
  ('matematikk-9:sammensatte-maleenheter', 'Tetthet', 'Masse delt på volum, ofte i g/cm³.', 9),
  ('matematikk-9:sammensatte-maleenheter', 'Tettheten til vann', 'Omtrent 1 g/cm³. Stoffer med lavere tetthet flyter i vann.', 10),
  ('matematikk-9:sammensatte-maleenheter', 'Enhetspris', 'Pris delt på mengde, for eksempel kr/kg eller kr/L. Brukes til å sammenligne tilbud.', 11),
  ('matematikk-9:sammensatte-maleenheter', 'Befolkningstetthet', 'Antall innbyggere per km².', 12),
  ('matematikk-9:sammensatte-maleenheter', 'Kilowattime (kWh)', 'Enhet for energi: effekt i kilowatt ganget med tid i timer.', 13),
  ('matematikk-9:sammensatte-maleenheter', 'Enheter i utregningen', 'Skriv enhetene med når du regner, så ser du om svaret får riktig enhet.', 14);
delete from public.quiz_sporsmal where tema_id = 'matematikk-9:sammensatte-maleenheter';
insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values
  ('matematikk-9:sammensatte-maleenheter', 'q01', 'flervalg', 'En syklist sykler 36 km på 2 timer. Hva er farten?', array['72 km/h', '18 km/h', '34 km/h', '38 km/h']::text[], 1, 'Fart = strekning / tid = 36 km / 2 h = 18 km/h.', true, true, 0),
  ('matematikk-9:sammensatte-maleenheter', 'q02', 'flervalg', 'Hva er 20 m/s i km/h?', array['72 km/h', '5,6 km/h', '200 km/h', '20 km/h']::text[], 0, 'Fra m/s til km/h ganger vi med 3,6: 20 · 3,6 = 72 km/h.', true, true, 1),
  ('matematikk-9:sammensatte-maleenheter', 'q03', 'flervalg', 'Hvor langt kjører en bil på 1,5 timer med farten 80 km/h?', array['53 km', '81,5 km', '120 km', '160 km']::text[], 2, 'Strekning = fart · tid = 80 km/h · 1,5 h = 120 km.', true, true, 2),
  ('matematikk-9:sammensatte-maleenheter', 'q04', 'flervalg', 'Hva er 45 minutter i timer?', array['0,45 h', '4,5 h', '0,57 h', '0,75 h']::text[], 3, 'Del på 60: 45 / 60 = 0,75 h. Å skrive 0,45 h er en vanlig feil.', true, true, 3),
  ('matematikk-9:sammensatte-maleenheter', 'q05', 'flervalg', 'En stein har masse 270 g og volum 100 cm³. Hva er tettheten?', array['2,7 g/cm³', '27 000 g/cm³', '0,37 g/cm³', '170 g/cm³']::text[], 0, 'Tetthet = masse / volum = 270 g / 100 cm³ = 2,7 g/cm³.', true, true, 4),
  ('matematikk-9:sammensatte-maleenheter', 'q06', 'flervalg', 'Hvilket tilbud er billigst per kilo?', array['500 g for 45 kr', '250 g for 25 kr', '750 g for 60 kr', '1 kg for 95 kr']::text[], 2, 'Enhetsprisene er 90, 100, 80 og 95 kr/kg. 750 g for 60 kr gir 60 / 0,75 = 80 kr/kg.', true, true, 5),
  ('matematikk-9:sammensatte-maleenheter', 'q07', 'flervalg', 'Hvor lang tid tar det å gå 6 km med farten 5 km/h?', array['30 min', '1 time og 12 minutter', '1 time og 2 minutter', '1 time og 20 minutter']::text[], 1, 't = s / v = 6 / 5 = 1,2 h. 0,2 h = 0,2 · 60 min = 12 min.', true, true, 6),
  ('matematikk-9:sammensatte-maleenheter', 'q08', 'flervalg', 'Hva er 90 km/h i m/s?', array['324 m/s', '90 m/s', '15 m/s', '25 m/s']::text[], 3, 'Fra km/h til m/s deler vi på 3,6: 90 / 3,6 = 25 m/s.', true, true, 7),
  ('matematikk-9:sammensatte-maleenheter', 'q09', 'flervalg', 'Hvilken enhet passer for befolkningstetthet?', array['Innbyggere per km²', 'km² per innbygger', 'Innbyggere · km', 'km/h']::text[], 0, 'Befolkningstetthet sier hvor mange som bor på hver kvadratkilometer: innbyggere per km².', true, false, 8),
  ('matematikk-9:sammensatte-maleenheter', 'q10', 'flervalg', 'En kloss har tetthet 0,6 g/cm³. Hva skjer når den legges i vann?', array['Den synker', 'Den flyter', 'Den løses opp', 'Det kan ikke avgjøres']::text[], 1, 'Tettheten er lavere enn vannets, som er omtrent 1 g/cm³. Da flyter klossen.', true, false, 9),
  ('matematikk-9:sammensatte-maleenheter', 'm01', 'sant-usant', '«Per» i en enhet betyr at vi skal gange.', array['Sant', 'Usant']::text[], 1, '«Per» betyr delt på. km/h betyr kilometer delt på timer.', false, true, 10),
  ('matematikk-9:sammensatte-maleenheter', 'm02', 'sant-usant', '1 m/s er raskere enn 3 km/h.', array['Sant', 'Usant']::text[], 0, '1 m/s = 3,6 km/h, som er litt mer enn 3 km/h.', false, true, 11),
  ('matematikk-9:sammensatte-maleenheter', 'm03', 'sant-usant', 'Den største pakken er alltid billigst per kilo.', array['Sant', 'Usant']::text[], 1, 'Ofte er det slik, men ikke alltid. Du må regne ut enhetsprisen for å være sikker.', false, true, 12),
  ('matematikk-9:sammensatte-maleenheter', 'm04', 'sant-usant', '12 minutter er 0,2 timer.', array['Sant', 'Usant']::text[], 0, '12 / 60 = 0,2. Altså er 12 minutter en femtedel av en time.', false, true, 13),
  ('matematikk-9:sammensatte-maleenheter', 'm05', 'flervalg', 'Et tog kjører 240 km på 3 timer. Hva er gjennomsnittsfarten?', array['720 km/h', '80 km/h', '60 km/h', '243 km/h']::text[], 1, '240 km / 3 h = 80 km/h.', false, true, 14),
  ('matematikk-9:sammensatte-maleenheter', 'm06', 'flervalg', 'En flaske med 1,5 L brus koster 30 kr. Hva er literprisen?', array['45 kr/L', '20 kr/L', '15 kr/L', '31,5 kr/L']::text[], 1, 'Enhetspris = pris / mengde = 30 kr / 1,5 L = 20 kr/L.', false, true, 15),
  ('matematikk-9:sammensatte-maleenheter', 'm07', 'flervalg', 'Hva er massen av 200 cm³ av et stoff med tetthet 2,5 g/cm³?', array['80 g', '202,5 g', '500 g', '50 g']::text[], 2, 'Masse = tetthet · volum = 2,5 g/cm³ · 200 cm³ = 500 g.', false, true, 16);
insert into public.miniprover (tema_id, minutter) values
  ('matematikk-9:sammensatte-maleenheter', 15)
on conflict (tema_id) do update set minutter = excluded.minutter;

-- Matematikk: Formlikhet og kongruens
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('matematikk-9:formlikhet-og-kongruens', 'matematikk-9', 'formlikhet-og-kongruens', 'Formlikhet og kongruens', 'Egenskaper ved trekanter og firkanter, når to figurer er kongruente eller formlike, og hvordan du bruker formlikhet og målestokk til å finne ukjente lengder.', array[2, 3, 5]::int[], 1, 'utkast', '{}'::text[], false, now())
on conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,
  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,
  publisert = excluded.publisert, oppdatert = excluded.oppdatert;
insert into public.tema_innhold (tema_id, sammendrag, tankekart) values
  ('matematikk-9:formlikhet-og-kongruens', '## Todimensjonale figurer

En **mangekant** er en lukket figur med rette sider. Summen av vinklene i en trekant er alltid 180°, og i en firkant 360°. Trekanter kan deles inn etter sidene (likesidet, likebeint, ulikesidet) eller etter vinklene (spissvinklet, rettvinklet, stumpvinklet). Blant firkantene finner vi kvadrat, rektangel, rombe, parallellogram og trapes, som har ulike egenskaper når det gjelder parallelle sider, like lange sider og rette vinkler. Et kvadrat er både et rektangel og en rombe.

## Kongruens

To figurer er **kongruente** når de har nøyaktig samme form og størrelse. Du kan legge den ene oppå den andre slik at de dekker hverandre helt, eventuelt etter å ha snudd eller speilet den. Alle samsvarende sider og vinkler er like store.

To trekanter er kongruente hvis ett av disse kravene er oppfylt:

- alle tre sidene er parvis like lange (SSS),
- to sider og vinkelen mellom dem er like (SVS),
- to vinkler og siden mellom dem er like (VSV).

## Formlikhet

To figurer er **formlike** når de har samme form, men ikke nødvendigvis samme størrelse. Den ene er en forstørrelse eller forminskelse av den andre. Da er samsvarende vinkler like store, og forholdet mellom samsvarende sider er det samme. To trekanter er formlike allerede når to av vinklene er parvis like store, for da må også den tredje være lik.

Forholdet mellom samsvarende sider kalles **forstørrelsesfaktoren** eller målestokken. Er trekant ABC formlik med trekant DEF, gjelder DE/AB = EF/BC = DF/AC.

## Finne ukjente lengder

Formlikhet brukes til å måle ting vi ikke når. En pinne på 2 m kaster en skygge på 3 m. Samtidig kaster et tre en skygge på 18 m. Sollyset gir formlike trekanter, så treet er 2 · 18/3 = 12 m høyt.

## Målestokk

Et kart eller en tegning i **målestokk** 1 : 50 000 betyr at 1 cm på kartet er 50 000 cm = 500 m i virkeligheten. Kartet og landskapet er formlike.

## Areal i formlike figurer

Når alle lengder ganges med k, blir arealet k² ganger så stort. Dobler du sidene i et kvadrat, blir arealet fire ganger så stort. Det viser hvordan endrede forutsetninger påvirker løsningen.', '{"label":"Formlikhet og kongruens","children":[{"label":"Figurer","children":[{"label":"Trekanter","note":"Vinkelsum 180°"},{"label":"Firkanter","note":"Vinkelsum 360°"},{"label":"Kvadrat, rektangel, rombe, trapes"}]},{"label":"Kongruens","children":[{"label":"Samme form og størrelse"},{"label":"SSS"},{"label":"SVS"},{"label":"VSV"}]},{"label":"Formlikhet","children":[{"label":"Samme form, ulik størrelse"},{"label":"Like vinkler","note":"To er nok i trekanter"},{"label":"Sider i samme forhold"}]},{"label":"Bruk","children":[{"label":"Ukjente lengder","note":"Skyggemetoden"},{"label":"Målestokk","note":"Kart og modeller"},{"label":"Areal","note":"Ganges med k²"}]}]}'::jsonb)
on conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;
delete from public.flashcards where tema_id = 'matematikk-9:formlikhet-og-kongruens';
insert into public.flashcards (tema_id, begrep, forklaring, sortering) values
  ('matematikk-9:formlikhet-og-kongruens', 'Vinkelsum i trekant', 'Summen av vinklene i en trekant er alltid 180°.', 0),
  ('matematikk-9:formlikhet-og-kongruens', 'Vinkelsum i firkant', 'Summen av vinklene i en firkant er alltid 360°.', 1),
  ('matematikk-9:formlikhet-og-kongruens', 'Likebeint trekant', 'En trekant med to like lange sider. Vinklene ved grunnlinjen er like store.', 2),
  ('matematikk-9:formlikhet-og-kongruens', 'Likesidet trekant', 'En trekant der alle sidene er like lange og alle vinklene er 60°.', 3),
  ('matematikk-9:formlikhet-og-kongruens', 'Parallellogram', 'En firkant der begge par av motstående sider er parallelle.', 4),
  ('matematikk-9:formlikhet-og-kongruens', 'Trapes', 'En firkant med minst ett par parallelle sider.', 5),
  ('matematikk-9:formlikhet-og-kongruens', 'Rombe', 'En firkant der alle fire sider er like lange.', 6),
  ('matematikk-9:formlikhet-og-kongruens', 'Kongruente figurer', 'Figurer med nøyaktig samme form og størrelse. De dekker hverandre helt.', 7),
  ('matematikk-9:formlikhet-og-kongruens', 'SSS, SVS, VSV', 'Krav som gjør to trekanter kongruente: tre sider, to sider og vinkelen mellom, eller to vinkler og siden mellom.', 8),
  ('matematikk-9:formlikhet-og-kongruens', 'Formlike figurer', 'Figurer med samme form, men ulik størrelse. Vinklene er like og sidene har samme forhold.', 9),
  ('matematikk-9:formlikhet-og-kongruens', 'Formlike trekanter', 'To trekanter er formlike hvis to vinkler er parvis like store.', 10),
  ('matematikk-9:formlikhet-og-kongruens', 'Samsvarende sider', 'Sidene som ligger på samme plass i to formlike figurer, for eksempel motsatt av like vinkler.', 11),
  ('matematikk-9:formlikhet-og-kongruens', 'Forstørrelsesfaktor', 'Forholdet mellom samsvarende sider i formlike figurer.', 12),
  ('matematikk-9:formlikhet-og-kongruens', 'Målestokk 1 : 50 000', '1 cm på kartet er 50 000 cm = 500 m i virkeligheten.', 13),
  ('matematikk-9:formlikhet-og-kongruens', 'Areal ved forstørrelse', 'Ganges alle lengder med k, blir arealet k² ganger så stort.', 14),
  ('matematikk-9:formlikhet-og-kongruens', 'Skyggemetoden', 'Sollys gir formlike trekanter. Høyden av et tre kan finnes fra skyggen til en kjent pinne.', 15);
delete from public.quiz_sporsmal where tema_id = 'matematikk-9:formlikhet-og-kongruens';
insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values
  ('matematikk-9:formlikhet-og-kongruens', 'q01', 'flervalg', 'To vinkler i en trekant er 50° og 70°. Hvor stor er den tredje?', array['50°', '70°', '60°', '120°']::text[], 2, 'Vinkelsummen er 180°: 180° − 50° − 70° = 60°.', true, true, 0),
  ('matematikk-9:formlikhet-og-kongruens', 'q02', 'flervalg', 'Hva betyr det at to figurer er kongruente?', array['De har samme form og samme størrelse', 'De har samme form, men ulik størrelse', 'De har samme areal, men ulik form', 'De har like mange sider']::text[], 0, 'Kongruente figurer er helt like og kan legges oppå hverandre, eventuelt etter speiling.', true, true, 1),
  ('matematikk-9:formlikhet-og-kongruens', 'q03', 'flervalg', 'Hva er nok for å vite at to trekanter er formlike?', array['At én side er lik', 'At arealet er likt', 'At to vinkler er parvis like store', 'At de er rettvinklede']::text[], 2, 'Er to vinkler like, blir også den tredje lik fordi summen er 180°. Da har trekantene samme form.', true, true, 2),
  ('matematikk-9:formlikhet-og-kongruens', 'q04', 'flervalg', 'Trekant ABC er formlik med DEF. AB = 4 cm, DE = 10 cm og BC = 6 cm. Hvor lang er EF?', array['12 cm', '15 cm', '2,4 cm', '16 cm']::text[], 1, 'Forstørrelsesfaktoren er 10/4 = 2,5. EF = 6 · 2,5 = 15 cm.', true, true, 3),
  ('matematikk-9:formlikhet-og-kongruens', 'q05', 'flervalg', 'En pinne på 2 m kaster en skygge på 3 m. Et tre kaster samtidig en skygge på 18 m. Hvor høyt er treet?', array['27 m', '9 m', '12 m', '36 m']::text[], 2, 'Forholdet høyde/skygge er det samme: 2/3 = h/18. Da er h = 2 · 18/3 = 12 m.', true, true, 4),
  ('matematikk-9:formlikhet-og-kongruens', 'q06', 'flervalg', 'Et kart har målestokk 1 : 50 000. Hvor langt er 4 cm på kartet i virkeligheten?', array['2 km', '200 m', '20 km', '12,5 km']::text[], 0, '4 cm · 50 000 = 200 000 cm = 2000 m = 2 km.', true, true, 5),
  ('matematikk-9:formlikhet-og-kongruens', 'q07', 'flervalg', 'Sidene i et kvadrat dobles. Hva skjer med arealet?', array['Det dobles', 'Det blir tre ganger så stort', 'Det blir åtte ganger så stort', 'Det blir fire ganger så stort']::text[], 3, 'Arealet ganges med k² = 2² = 4. Et kvadrat med side 3 har areal 9, med side 6 har det areal 36.', true, true, 6),
  ('matematikk-9:formlikhet-og-kongruens', 'q08', 'flervalg', 'Hvilken firkant har alle sider like lange, men ikke nødvendigvis rette vinkler?', array['Rektangel', 'Trapes', 'Parallellogram', 'Rombe']::text[], 3, 'En rombe har fire like lange sider. Hvis vinklene i tillegg er rette, er den et kvadrat.', true, false, 7),
  ('matematikk-9:formlikhet-og-kongruens', 'q09', 'flervalg', 'Hvilket krav gir IKKE sikker kongruens mellom to trekanter?', array['SSS', 'SVS', 'Tre like vinkler', 'VSV']::text[], 2, 'Tre like vinkler gir bare formlikhet. Trekantene kan ha samme form, men være forskjellig store.', true, true, 8),
  ('matematikk-9:formlikhet-og-kongruens', 'q10', 'flervalg', 'En modell av et hus er i målestokk 1 : 100. Huset er 12 m høyt. Hvor høy er modellen?', array['1,2 cm', '12 cm', '120 cm', '0,12 cm']::text[], 1, '12 m = 1200 cm. Del på 100: 1200 cm / 100 = 12 cm.', true, false, 9),
  ('matematikk-9:formlikhet-og-kongruens', 'm01', 'sant-usant', 'Alle kongruente figurer er også formlike.', array['Sant', 'Usant']::text[], 0, 'Kongruente figurer har samme form, og forstørrelsesfaktoren er 1.', false, true, 10),
  ('matematikk-9:formlikhet-og-kongruens', 'm02', 'sant-usant', 'Alle rektangler er formlike med hverandre.', array['Sant', 'Usant']::text[], 1, 'Vinklene er like, men forholdet mellom sidene kan være ulikt. Et 2 × 4-rektangel og et 3 × 3-kvadrat er ikke formlike.', false, true, 11),
  ('matematikk-9:formlikhet-og-kongruens', 'm03', 'sant-usant', 'Alle vinklene i en likesidet trekant er 60°.', array['Sant', 'Usant']::text[], 0, 'Vinklene er like store og summen er 180°, så hver vinkel er 180° / 3 = 60°.', false, true, 12),
  ('matematikk-9:formlikhet-og-kongruens', 'm04', 'sant-usant', 'Målestokk 1 : 100 betyr at 1 cm på tegningen er 100 m i virkeligheten.', array['Sant', 'Usant']::text[], 1, '1 cm på tegningen er 100 cm = 1 m i virkeligheten.', false, true, 13),
  ('matematikk-9:formlikhet-og-kongruens', 'm05', 'flervalg', 'Tre vinkler i en firkant er 90°, 90° og 100°. Hvor stor er den fjerde?', array['80°', '90°', '100°', '180°']::text[], 0, 'Vinkelsummen er 360°: 360° − 90° − 90° − 100° = 80°.', false, true, 14),
  ('matematikk-9:formlikhet-og-kongruens', 'm06', 'flervalg', 'En trekant har sidene 3, 4 og 5 cm. En formlik trekant har korteste side 9 cm. Hvor lang er lengste side?', array['11 cm', '15 cm', '12 cm', '25 cm']::text[], 1, 'Forstørrelsesfaktoren er 9/3 = 3. Lengste side blir 5 · 3 = 15 cm.', false, true, 15),
  ('matematikk-9:formlikhet-og-kongruens', 'm07', 'flervalg', 'Alle lengder i en figur ganges med 3. Hvor mange ganger større blir arealet?', array['3', '6', '27', '9']::text[], 3, 'Arealet ganges med 3² = 9.', false, true, 16);
insert into public.miniprover (tema_id, minutter) values
  ('matematikk-9:formlikhet-og-kongruens', 15)
on conflict (tema_id) do update set minutter = excluded.minutter;

-- Matematikk: Pytagoras' setning
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('matematikk-9:pytagoras', 'matematikk-9', 'pytagoras', 'Pytagoras'' setning', 'Sammenhengen mellom sidene i en rettvinklet trekant, hvordan du finner en ukjent side, og hvordan setningen brukes i praktiske situasjoner.', array[3, 4, 5]::int[], 2, 'utkast', '{}'::text[], false, now())
on conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,
  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,
  publisert = excluded.publisert, oppdatert = excluded.oppdatert;
insert into public.tema_innhold (tema_id, sammendrag, tankekart) values
  ('matematikk-9:pytagoras', '## Den rettvinklede trekanten

I en **rettvinklet trekant** er én av vinklene 90°. De to sidene som danner den rette vinkelen, kalles **kateter**. Den lengste siden, som ligger rett overfor den rette vinkelen, kalles **hypotenusen**.

## Pytagoras'' setning

**Pytagoras'' setning** sier at i en rettvinklet trekant er summen av kvadratene av katetene lik kvadratet av hypotenusen:

a² + b² = c²

her er a og b katetene og c hypotenusen. Geometrisk betyr det at hvis vi tegner et kvadrat på hver side av trekanten, er arealet av de to små kvadratene til sammen like stort som arealet av det store.

## Finne hypotenusen

En trekant har kateter på 6 cm og 8 cm. Da er c² = 6² + 8² = 36 + 64 = 100, og c = √100 = 10 cm.

## Finne en katet

Kjenner du hypotenusen og én katet, trekker du fra: a² = c² − b². Er hypotenusen 13 cm og den ene kateten 5 cm, blir a² = 169 − 25 = 144 og a = 12 cm. En vanlig feil er å legge sammen også her. Husk at hypotenusen alltid er den lengste siden, så svaret må bli kortere enn hypotenusen.

## Pytagoreiske tripler

Noen sett med hele tall passer nøyaktig i setningen, for eksempel 3, 4, 5 og 5, 12, 13 og 8, 15, 17. Ganger du et slikt sett med samme tall, får du nye: 6, 8, 10 og 9, 12, 15.

## Sjekke om en vinkel er rett

Setningen gjelder også motsatt vei. Hvis a² + b² = c² for sidene i en trekant, er trekanten rettvinklet. Håndverkere bruker dette når de setter opp hjørner: de måler 3 m langs den ene veggen og 4 m langs den andre. Er avstanden mellom merkene 5 m, er hjørnet rett. Er c² større enn a² + b², er vinkelen stump, og er c² mindre, er den spiss.

## Praktiske bruksområder

- Lengden av en stige som står mot en vegg.
- Diagonalen i et rektangel, for eksempel skjermstørrelse på en TV.
- Korteste avstand på skrå over en fotballbane.
- Avstanden mellom to punkter i et koordinatsystem.

Tegn alltid en skisse, marker den rette vinkelen og finn ut hvilken side som er hypotenusen før du regner. Vurder til slutt om svaret er rimelig.', '{"label":"Pytagoras'' setning","children":[{"label":"Trekanten","children":[{"label":"Rett vinkel","note":"90°"},{"label":"Kateter","note":"Danner den rette vinkelen"},{"label":"Hypotenus","note":"Lengst, overfor 90°"}]},{"label":"Setningen","children":[{"label":"a² + b² = c²"},{"label":"Kvadrater på sidene","note":"Arealtolkning"}]},{"label":"Regne","children":[{"label":"Hypotenus","note":"c = √(a² + b²)"},{"label":"Katet","note":"a = √(c² − b²)"},{"label":"Tripler","note":"3-4-5, 5-12-13"}]},{"label":"Bruk","children":[{"label":"Sjekke rett vinkel","note":"3-4-5-regelen"},{"label":"Stiger og diagonaler"},{"label":"Avstand mellom punkter"}]}]}'::jsonb)
on conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;
delete from public.flashcards where tema_id = 'matematikk-9:pytagoras';
insert into public.flashcards (tema_id, begrep, forklaring, sortering) values
  ('matematikk-9:pytagoras', 'Rettvinklet trekant', 'En trekant der én vinkel er 90°.', 0),
  ('matematikk-9:pytagoras', 'Katet', 'En av de to sidene som danner den rette vinkelen i en rettvinklet trekant.', 1),
  ('matematikk-9:pytagoras', 'Hypotenus', 'Den lengste siden i en rettvinklet trekant, rett overfor den rette vinkelen.', 2),
  ('matematikk-9:pytagoras', 'Pytagoras'' setning', 'a² + b² = c², der a og b er katetene og c er hypotenusen.', 3),
  ('matematikk-9:pytagoras', 'Finne hypotenusen', 'c = √(a² + b²). Katetene 6 og 8 gir c = √100 = 10.', 4),
  ('matematikk-9:pytagoras', 'Finne en katet', 'a = √(c² − b²). Hypotenus 13 og katet 5 gir a = √144 = 12.', 5),
  ('matematikk-9:pytagoras', 'Kvadrater på sidene', 'Arealene av kvadratene på katetene er til sammen like store som kvadratet på hypotenusen.', 6),
  ('matematikk-9:pytagoras', 'Pytagoreisk trippel', 'Tre hele tall som passer i a² + b² = c², for eksempel 3, 4, 5 og 5, 12, 13.', 7),
  ('matematikk-9:pytagoras', '3-4-5-regelen', 'Måler du 3 og 4 langs to vegger og avstanden er 5, er hjørnet rett.', 8),
  ('matematikk-9:pytagoras', 'Omvendt Pytagoras', 'Hvis a² + b² = c² for sidene i en trekant, er trekanten rettvinklet.', 9),
  ('matematikk-9:pytagoras', 'Stump vinkel', 'Hvis c² > a² + b², er vinkelen overfor c stump (over 90°).', 10),
  ('matematikk-9:pytagoras', 'Diagonal i rektangel', 'Deler rektangelet i to rettvinklede trekanter. d = √(l² + b²).', 11),
  ('matematikk-9:pytagoras', 'Avstand i koordinatsystem', 'Avstanden mellom to punkter er hypotenusen i en trekant med sidene Δx og Δy.', 12),
  ('matematikk-9:pytagoras', 'Kontroll av svar', 'Hypotenusen skal alltid være lengst. En katet må derfor bli kortere enn hypotenusen.', 13),
  ('matematikk-9:pytagoras', 'Skisse', 'Tegn trekanten, marker den rette vinkelen og finn hypotenusen før du regner.', 14);
delete from public.quiz_sporsmal where tema_id = 'matematikk-9:pytagoras';
insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values
  ('matematikk-9:pytagoras', 'q01', 'flervalg', 'Hva kalles den lengste siden i en rettvinklet trekant?', array['Katet', 'Diagonal', 'Hypotenus', 'Grunnlinje']::text[], 2, 'Hypotenusen ligger rett overfor den rette vinkelen og er alltid den lengste siden.', true, true, 0),
  ('matematikk-9:pytagoras', 'q02', 'flervalg', 'Katetene er 6 cm og 8 cm. Hvor lang er hypotenusen?', array['14 cm', '10 cm', '48 cm', '100 cm']::text[], 1, 'c² = 36 + 64 = 100, og c = √100 = 10 cm. 100 er c², ikke c.', true, true, 1),
  ('matematikk-9:pytagoras', 'q03', 'flervalg', 'Hypotenusen er 13 cm og den ene kateten 5 cm. Hvor lang er den andre kateten?', array['12 cm', '8 cm', '13,9 cm', '18 cm']::text[], 0, 'a² = 13² − 5² = 169 − 25 = 144, så a = 12 cm.', true, true, 2),
  ('matematikk-9:pytagoras', 'q04', 'flervalg', 'Hvilke tall er en pytagoreisk trippel?', array['2, 3, 4', '4, 5, 6', '5, 12, 13', '6, 7, 8']::text[], 2, '5² + 12² = 25 + 144 = 169 = 13². De andre settene passer ikke.', true, false, 3),
  ('matematikk-9:pytagoras', 'q05', 'flervalg', 'En trekant har sidene 7, 24 og 25. Er den rettvinklet?', array['Nei, 7 + 24 er ikke 25', 'Det kan ikke avgjøres uten vinkelmåler', 'Nei, sidene er for ulike', 'Ja, fordi 7² + 24² = 25²']::text[], 3, '49 + 576 = 625 = 25². Når setningen stemmer, er trekanten rettvinklet.', true, true, 4),
  ('matematikk-9:pytagoras', 'q06', 'flervalg', 'En stige på 5 m står 3 m fra en vegg. Hvor høyt opp på veggen når den?', array['2 m', '4 m', '8 m', '5,8 m']::text[], 1, 'Stigen er hypotenusen. h² = 5² − 3² = 25 − 9 = 16, så h = 4 m.', true, true, 5),
  ('matematikk-9:pytagoras', 'q07', 'flervalg', 'Et rektangel er 9 cm langt og 12 cm bredt. Hvor lang er diagonalen?', array['21 cm', '10,5 cm', '15 cm', '225 cm']::text[], 2, 'Diagonalen er hypotenusen: d² = 81 + 144 = 225, og d = 15 cm.', true, true, 6),
  ('matematikk-9:pytagoras', 'q08', 'flervalg', 'Du finner en katet og får 15 cm, men hypotenusen er 13 cm. Hva har skjedd?', array['Du har lagt sammen i stedet for å trekke fra', 'Svaret er riktig', 'Trekanten er stumpvinklet', 'Du har glemt å ta kvadratroten']::text[], 0, 'En katet må være kortere enn hypotenusen. Et for stort svar tyder på at du la sammen kvadratene i stedet for å trekke fra.', true, false, 7),
  ('matematikk-9:pytagoras', 'q09', 'flervalg', 'Hva er avstanden mellom punktene (1, 1) og (4, 5)?', array['7', '3', '4', '5']::text[], 3, 'Δx = 3 og Δy = 4. Avstanden er √(3² + 4²) = √25 = 5.', true, true, 8),
  ('matematikk-9:pytagoras', 'q10', 'flervalg', 'En snekker måler 3 m og 4 m langs to vegger. Avstanden mellom merkene er 5,2 m. Hva betyr det?', array['Hjørnet er nøyaktig rett', 'Vinkelen er litt større enn 90°', 'Vinkelen er litt mindre enn 90°', 'Veggene er parallelle']::text[], 1, '5,2² = 27,04 er større enn 3² + 4² = 25. Da er vinkelen stump, altså litt over 90°.', true, true, 9),
  ('matematikk-9:pytagoras', 'm01', 'sant-usant', 'Pytagoras'' setning gjelder for alle trekanter.', array['Sant', 'Usant']::text[], 1, 'Setningen gjelder bare for rettvinklede trekanter.', false, true, 10),
  ('matematikk-9:pytagoras', 'm02', 'sant-usant', 'Hypotenusen ligger rett overfor den rette vinkelen.', array['Sant', 'Usant']::text[], 0, 'Det er derfor hypotenusen alltid er den lengste siden.', false, true, 11),
  ('matematikk-9:pytagoras', 'm03', 'sant-usant', '6, 8 og 10 er en pytagoreisk trippel.', array['Sant', 'Usant']::text[], 0, '36 + 64 = 100 = 10². Settet er 3, 4, 5 ganget med 2.', false, true, 12),
  ('matematikk-9:pytagoras', 'm04', 'sant-usant', 'I en rettvinklet trekant med kateter 1 og 1 er hypotenusen 2.', array['Sant', 'Usant']::text[], 1, 'c² = 1 + 1 = 2, så c = √2 ≈ 1,41.', false, true, 13),
  ('matematikk-9:pytagoras', 'm05', 'flervalg', 'En TV har bredde 80 cm og høyde 60 cm. Hvor lang er diagonalen?', array['140 cm', '100 cm', '70 cm', '120 cm']::text[], 1, 'd² = 80² + 60² = 6400 + 3600 = 10 000, og d = 100 cm.', false, true, 14),
  ('matematikk-9:pytagoras', 'm06', 'flervalg', 'Hypotenusen er 10 og én katet er 6. Hva er arealet av trekanten?', array['30', '60', '24', '48']::text[], 2, 'Den andre kateten er √(100 − 36) = 8. Arealet er 6 · 8 / 2 = 24.', false, true, 15),
  ('matematikk-9:pytagoras', 'm07', 'flervalg', 'Hvilken trekant er stumpvinklet?', array['3, 4, 6', '3, 4, 5', '5, 12, 13', '4, 4, 5']::text[], 0, '6² = 36 er større enn 3² + 4² = 25. Da er vinkelen overfor den lengste siden stump.', false, true, 16);
insert into public.miniprover (tema_id, minutter) values
  ('matematikk-9:pytagoras', 15)
on conflict (tema_id) do update set minutter = excluded.minutter;

-- Matematikk: Overflate og volum
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('matematikk-9:overflate-og-volum', 'matematikk-9', 'overflate-og-volum', 'Overflate og volum', 'Formlene for volum og overflateareal av prismer, sylindre, pyramider, kjegler og kuler, og hvordan du gjør om mellom volumenheter.', array[6]::int[], 3, 'utkast', '{}'::text[], false, now())
on conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,
  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,
  publisert = excluded.publisert, oppdatert = excluded.oppdatert;
insert into public.tema_innhold (tema_id, sammendrag, tankekart) values
  ('matematikk-9:overflate-og-volum', '## Tredimensjonale figurer

En **romfigur** har lengde, bredde og høyde. **Volum** er hvor mye plass figuren tar, og måles i kubikkenheter som cm³ og m³. **Overflateareal** er summen av arealet av alle flatene, og måles i kvadratenheter som cm² og m². Et godt triks for overflate er å tenke seg figuren brettet ut til en **utbretting**.

## Prismer og sylindre

Et **prisme** har to like, parallelle endeflater (grunnflater) og rette sideflater. Et **rett prisme** med rektangulære flater kalles et rett, firkantet prisme, og en terning er et spesialtilfelle. Volumet av alle prismer er grunnflate ganger høyde: V = G · h.

En **sylinder** er som et prisme med sirkel som grunnflate. Da blir V = πr² · h. Overflaten består av to sirkler og en krum sideflate som kan rulles ut til et rektangel med lengde lik omkretsen 2πr. Derfor er O = 2πr² + 2πrh.

## Pyramider og kjegler

En **pyramide** har en mangekant som grunnflate og sideflater som møtes i en topp. En **kjegle** har sirkel som grunnflate. Begge har volum lik en tredjedel av et prisme eller en sylinder med samme grunnflate og høyde:

- Pyramide: V = G · h / 3
- Kjegle: V = πr² · h / 3

Du kan sjekke dette praktisk: fyll en kjegle med vann tre ganger og hell over i en sylinder med samme grunnflate og høyde. Da blir sylinderen full.

## Kule

En **kule** har volum V = 4πr³/3 og overflate O = 4πr². Overflaten til en kule er altså like stor som fire sirkler med samme radius.

## Enheter

1 dm³ = 1 L = 1000 cm³, og 1 m³ = 1000 L. Mellom volumenheter er det faktor 1000 per steg, fordi alle tre dimensjonene endres. Mellom arealenheter er faktoren 100 per steg: 1 m² = 100 dm² = 10 000 cm².

## Argumentere for formlene

Formlene kan begrunnes. Volumet av et prisme er antall lag med grunnflate stablet oppå hverandre, og hver ny centimeter i høyden gir ett lag til. I praktiske oppgaver, som å beregne hvor mye maling som trengs eller hvor mye vann et basseng rommer, må du avgjøre om oppgaven spør etter overflate eller volum.', '{"label":"Overflate og volum","children":[{"label":"Begreper","children":[{"label":"Volum","note":"cm³, m³, L"},{"label":"Overflate","note":"cm², m²"},{"label":"Utbretting"}]},{"label":"Prisme og sylinder","children":[{"label":"V = G · h"},{"label":"Sylinder","note":"V = πr²h"},{"label":"Sylinderoverflate","note":"2πr² + 2πrh"}]},{"label":"Pyramide og kjegle","children":[{"label":"V = G · h / 3"},{"label":"Kjegle","note":"V = πr²h / 3"},{"label":"En tredjedel","note":"Av prisme/sylinder"}]},{"label":"Kule","children":[{"label":"V = 4πr³/3"},{"label":"O = 4πr²"}]},{"label":"Enheter","children":[{"label":"1 L = 1 dm³ = 1000 cm³"},{"label":"1 m³ = 1000 L"},{"label":"Areal: faktor 100","note":"Volum: faktor 1000"}]}]}'::jsonb)
on conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;
delete from public.flashcards where tema_id = 'matematikk-9:overflate-og-volum';
insert into public.flashcards (tema_id, begrep, forklaring, sortering) values
  ('matematikk-9:overflate-og-volum', 'Volum', 'Hvor mye plass en romfigur tar. Måles i cm³, dm³ eller m³.', 0),
  ('matematikk-9:overflate-og-volum', 'Overflateareal', 'Summen av arealet av alle flatene på en romfigur. Måles i cm² eller m².', 1),
  ('matematikk-9:overflate-og-volum', 'Utbretting', 'En romfigur brettet ut til en flat figur. Nyttig for å finne overflatearealet.', 2),
  ('matematikk-9:overflate-og-volum', 'Prisme', 'Romfigur med to like, parallelle grunnflater og rette sideflater. V = G · h.', 3),
  ('matematikk-9:overflate-og-volum', 'Rett firkantet prisme', 'Et prisme der alle flatene er rektangler. V = l · b · h.', 4),
  ('matematikk-9:overflate-og-volum', 'Sylinder', 'Romfigur med to sirkler som grunnflater. V = πr² · h.', 5),
  ('matematikk-9:overflate-og-volum', 'Overflate av sylinder', 'O = 2πr² + 2πrh: to sirkler pluss en sideflate med lengde lik omkretsen.', 6),
  ('matematikk-9:overflate-og-volum', 'Pyramide', 'Mangekant som grunnflate og sideflater som møtes i en topp. V = G · h / 3.', 7),
  ('matematikk-9:overflate-og-volum', 'Kjegle', 'Sirkel som grunnflate og en spiss topp. V = πr² · h / 3.', 8),
  ('matematikk-9:overflate-og-volum', 'Kule', 'V = 4πr³/3 og O = 4πr².', 9),
  ('matematikk-9:overflate-og-volum', 'Grunnflate (G)', 'Flaten figuren står på, som brukes i volumformlene.', 10),
  ('matematikk-9:overflate-og-volum', '1 L', '1 liter = 1 dm³ = 1000 cm³.', 11),
  ('matematikk-9:overflate-og-volum', '1 m³', '1 kubikkmeter = 1000 liter.', 12),
  ('matematikk-9:overflate-og-volum', 'Faktor mellom volumenheter', '1000 per steg, fordi lengde, bredde og høyde alle ganges med 10.', 13),
  ('matematikk-9:overflate-og-volum', 'En tredjedel', 'En pyramide eller kjegle har en tredjedel av volumet til et prisme eller en sylinder med samme G og h.', 14);
delete from public.quiz_sporsmal where tema_id = 'matematikk-9:overflate-og-volum';
insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values
  ('matematikk-9:overflate-og-volum', 'q01', 'flervalg', 'Hva er volumet av en eske som er 5 cm lang, 4 cm bred og 3 cm høy?', array['12 cm³', '60 cm³', '47 cm³', '94 cm³']::text[], 1, 'V = l · b · h = 5 · 4 · 3 = 60 cm³.', true, true, 0),
  ('matematikk-9:overflate-og-volum', 'q02', 'flervalg', 'Hvilken formel gir volumet av en sylinder?', array['2πr · h', 'πr² · h / 3', '4πr³/3', 'πr² · h']::text[], 3, 'Grunnflaten er en sirkel med areal πr². Den ganges med høyden: V = πr² · h.', true, true, 1),
  ('matematikk-9:overflate-og-volum', 'q03', 'flervalg', 'Hvor mange liter er 1 m³?', array['10 L', '100 L', '1000 L', '10 000 L']::text[], 2, '1 m³ = 1000 dm³, og 1 dm³ = 1 L. Altså er 1 m³ = 1000 L.', true, true, 2),
  ('matematikk-9:overflate-og-volum', 'q04', 'flervalg', 'En pyramide har grunnflate 36 cm² og høyde 10 cm. Hva er volumet?', array['120 cm³', '360 cm³', '180 cm³', '46 cm³']::text[], 0, 'V = G · h / 3 = 36 · 10 / 3 = 120 cm³.', true, true, 3),
  ('matematikk-9:overflate-og-volum', 'q05', 'flervalg', 'Hvor stor del av en sylinders volum har en kjegle med samme grunnflate og høyde?', array['Halvparten', 'En tredjedel', 'To tredjedeler', 'Like mye']::text[], 1, 'Kjeglen har volum πr²h/3, som er en tredjedel av sylinderens πr²h.', true, false, 4),
  ('matematikk-9:overflate-og-volum', 'q06', 'flervalg', 'En sylinder har radius 2 cm og høyde 5 cm. Hva er volumet? (Bruk π ≈ 3,14.)', array['31,4 cm³', '20 cm³', '62,8 cm³', '125,6 cm³']::text[], 2, 'V = πr²h = 3,14 · 4 · 5 = 62,8 cm³.', true, true, 5),
  ('matematikk-9:overflate-og-volum', 'q07', 'flervalg', 'Hva er overflatearealet av en terning med side 3 cm?', array['27 cm²', '54 cm²', '18 cm²', '36 cm²']::text[], 1, 'En terning har 6 kvadratiske flater med areal 3 · 3 = 9 cm². 6 · 9 = 54 cm². 27 cm³ er volumet.', true, true, 6),
  ('matematikk-9:overflate-og-volum', 'q08', 'flervalg', 'Du skal male utsiden av en kasse. Hva må du regne ut?', array['Volumet', 'Omkretsen', 'Overflatearealet', 'Diagonalen']::text[], 2, 'Maling dekker flater, så det er overflatearealet som bestemmer hvor mye maling som trengs.', true, false, 7),
  ('matematikk-9:overflate-og-volum', 'q09', 'flervalg', 'Hvor mange cm³ er 2,5 L?', array['250 cm³', '25 cm³', '25 000 cm³', '2500 cm³']::text[], 3, '1 L = 1000 cm³, så 2,5 L = 2500 cm³.', true, true, 8),
  ('matematikk-9:overflate-og-volum', 'q10', 'flervalg', 'Hvilken formel gir overflatearealet av en kule?', array['4πr²', 'πr²', '4πr³/3', '2πr']::text[], 0, 'Overflaten av en kule er O = 4πr², altså like stor som fire sirkler med samme radius.', true, true, 9),
  ('matematikk-9:overflate-og-volum', 'm01', 'sant-usant', '1 dm³ er det samme som 1 liter.', array['Sant', 'Usant']::text[], 0, 'En kube med side 1 dm = 10 cm rommer 1000 cm³, som er 1 liter.', false, true, 10),
  ('matematikk-9:overflate-og-volum', 'm02', 'sant-usant', '1 m² = 100 cm².', array['Sant', 'Usant']::text[], 1, '1 m² = 100 cm · 100 cm = 10 000 cm².', false, true, 11),
  ('matematikk-9:overflate-og-volum', 'm03', 'sant-usant', 'Volumet av et prisme er grunnflate ganger høyde.', array['Sant', 'Usant']::text[], 0, 'V = G · h gjelder for alle prismer, også sylindre.', false, true, 12),
  ('matematikk-9:overflate-og-volum', 'm04', 'sant-usant', 'En kjegle har halvparten så stort volum som en sylinder med samme grunnflate og høyde.', array['Sant', 'Usant']::text[], 1, 'Kjeglen har en tredjedel av sylinderens volum.', false, true, 13),
  ('matematikk-9:overflate-og-volum', 'm05', 'flervalg', 'Et basseng er 10 m langt, 5 m bredt og 2 m dypt. Hvor mange liter rommer det?', array['100 L', '10 000 L', '1000 L', '100 000 L']::text[], 3, 'V = 10 · 5 · 2 = 100 m³, og 100 m³ = 100 · 1000 L = 100 000 L.', false, true, 14),
  ('matematikk-9:overflate-og-volum', 'm06', 'flervalg', 'En kjegle har radius 3 cm og høyde 4 cm. Hva er volumet? (π ≈ 3,14)', array['37,68 cm³', '113,04 cm³', '12,56 cm³', '28,26 cm³']::text[], 0, 'V = πr²h/3 = 3,14 · 9 · 4 / 3 = 37,68 cm³.', false, true, 15),
  ('matematikk-9:overflate-og-volum', 'm07', 'flervalg', 'Hvor mange ganger større blir volumet av en terning når siden dobles?', array['2', '4', '8', '6']::text[], 2, 'Alle tre dimensjonene dobles: 2 · 2 · 2 = 8.', false, true, 16);
insert into public.miniprover (tema_id, minutter) values
  ('matematikk-9:overflate-og-volum', 15)
on conflict (tema_id) do update set minutter = excluded.minutter;

-- Matematikk: Sentralmål og spredningsmål
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('matematikk-9:sentralmal-og-spredning', 'matematikk-9', 'sentralmal-og-spredning', 'Sentralmål og spredningsmål', 'Gjennomsnitt, median og typetall, variasjonsbredde og kvartiler, og hvordan du bruker dem til å beskrive et datasett.', array[8]::int[], 4, 'utkast', '{}'::text[], false, now())
on conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,
  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,
  publisert = excluded.publisert, oppdatert = excluded.oppdatert;
insert into public.tema_innhold (tema_id, sammendrag, tankekart) values
  ('matematikk-9:sentralmal-og-spredning', '## Datasett

Et **datasett** er en samling observasjoner, for eksempel høyden til elevene i klassen eller antall minutter hver elev bruker på lekser. Før vi regner, ordner vi gjerne dataene i stigende rekkefølge eller i en **frekvenstabell**, der vi teller hvor mange ganger hver verdi forekommer.

## Sentralmål

**Sentralmål** sier noe om hva som er typisk eller midt i datasettet.

- **Gjennomsnitt**: summen av alle verdiene delt på antall verdier. For 4, 6, 7, 7 og 11 er gjennomsnittet 35 / 5 = 7.
- **Median**: den midterste verdien når dataene er sortert. Er det et partall antall verdier, tar vi gjennomsnittet av de to midterste. For 2, 5, 8, 10 er medianen (5 + 8) / 2 = 6,5.
- **Typetall**: verdien som forekommer oftest. Et datasett kan ha flere typetall eller ingen.

Gjennomsnittet påvirkes mye av **ekstremverdier**. Hvis ni personer tjener 40 000 kr i måneden og én tjener 400 000 kr, blir gjennomsnittet 76 000 kr, selv om nesten alle tjener mye mindre. Medianen, 40 000 kr, gir da et bedre bilde av det typiske.

## Spredningsmål

**Spredningsmål** viser hvor mye dataene varierer.

- **Variasjonsbredde**: største verdi minus minste verdi.
- **Kvartiler**: Vi deler det sorterte datasettet i fire like store deler. Nedre kvartil er medianen av den nedre halvdelen, og øvre kvartil er medianen av den øvre halvdelen.
- **Kvartilbredde**: øvre kvartil minus nedre kvartil. Den viser spredningen til de midterste 50 % av dataene og påvirkes ikke av ekstremverdier.

To klasser kan ha samme gjennomsnitt på en prøve, men helt ulik spredning. I den ene klassen ligger alle nær snittet, i den andre er det både veldig høye og veldig lave resultater.

## Gjennomsnitt fra frekvenstabell

Når dataene står i en frekvenstabell, ganger vi hver verdi med frekvensen, summerer og deler på antall observasjoner. Har 3 elever 2 søsken og 5 elever 1 søsken, er gjennomsnittet (3 · 2 + 5 · 1) / 8 = 11 / 8 ≈ 1,4.

## Beskrive data

En god beskrivelse av et datasett har både et sentralmål og et spredningsmål, og en vurdering av hvilke mål som passer. Bruk medianen når det finnes ekstremverdier, og bruk typetall når dataene er kategorier, som favorittfarge.', '{"label":"Sentralmål og spredning","children":[{"label":"Ordne data","children":[{"label":"Sortere"},{"label":"Frekvenstabell"},{"label":"Relativ frekvens","note":"I prosent"}]},{"label":"Sentralmål","children":[{"label":"Gjennomsnitt","note":"Sum / antall"},{"label":"Median","note":"Midterste verdi"},{"label":"Typetall","note":"Vanligste verdi"}]},{"label":"Spredningsmål","children":[{"label":"Variasjonsbredde","note":"Maks − min"},{"label":"Kvartiler","note":"Deler i fire"},{"label":"Kvartilbredde","note":"Q3 − Q1"}]},{"label":"Vurdere","children":[{"label":"Ekstremverdier","note":"Bruk median"},{"label":"Kategorier","note":"Bruk typetall"},{"label":"Oppgi både sentral- og spredningsmål"}]}]}'::jsonb)
on conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;
delete from public.flashcards where tema_id = 'matematikk-9:sentralmal-og-spredning';
insert into public.flashcards (tema_id, begrep, forklaring, sortering) values
  ('matematikk-9:sentralmal-og-spredning', 'Datasett', 'En samling observasjoner eller måledata, for eksempel høyden til elevene i en klasse.', 0),
  ('matematikk-9:sentralmal-og-spredning', 'Frekvens', 'Hvor mange ganger en verdi forekommer i et datasett.', 1),
  ('matematikk-9:sentralmal-og-spredning', 'Relativ frekvens', 'Frekvensen delt på antall observasjoner, ofte oppgitt i prosent.', 2),
  ('matematikk-9:sentralmal-og-spredning', 'Sentralmål', 'Mål som beskriver det typiske i et datasett: gjennomsnitt, median og typetall.', 3),
  ('matematikk-9:sentralmal-og-spredning', 'Gjennomsnitt', 'Summen av alle verdiene delt på antall verdier.', 4),
  ('matematikk-9:sentralmal-og-spredning', 'Median', 'Den midterste verdien når dataene er sortert. Ved partall antall: snittet av de to midterste.', 5),
  ('matematikk-9:sentralmal-og-spredning', 'Typetall', 'Verdien som forekommer oftest i datasettet.', 6),
  ('matematikk-9:sentralmal-og-spredning', 'Ekstremverdi', 'En verdi som skiller seg mye ut fra resten. Påvirker gjennomsnittet mer enn medianen.', 7),
  ('matematikk-9:sentralmal-og-spredning', 'Spredningsmål', 'Mål som viser hvor mye dataene varierer: variasjonsbredde og kvartilbredde.', 8),
  ('matematikk-9:sentralmal-og-spredning', 'Variasjonsbredde', 'Største verdi minus minste verdi.', 9),
  ('matematikk-9:sentralmal-og-spredning', 'Nedre kvartil', 'Medianen av den nedre halvdelen av det sorterte datasettet.', 10),
  ('matematikk-9:sentralmal-og-spredning', 'Øvre kvartil', 'Medianen av den øvre halvdelen av det sorterte datasettet.', 11),
  ('matematikk-9:sentralmal-og-spredning', 'Kvartilbredde', 'Øvre kvartil minus nedre kvartil. Viser spredningen til de midterste 50 %.', 12),
  ('matematikk-9:sentralmal-og-spredning', 'Frekvenstabell', 'En tabell som viser hver verdi og hvor mange ganger den forekommer.', 13),
  ('matematikk-9:sentralmal-og-spredning', 'Velge sentralmål', 'Median ved ekstremverdier, typetall for kategorier, gjennomsnitt når dataene er jevne.', 14);
delete from public.quiz_sporsmal where tema_id = 'matematikk-9:sentralmal-og-spredning';
insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values
  ('matematikk-9:sentralmal-og-spredning', 'q01', 'flervalg', 'Hva er gjennomsnittet av 4, 6, 7, 7 og 11?', array['6', '7', '7,5', '35']::text[], 1, 'Summen er 4 + 6 + 7 + 7 + 11 = 35. Del på 5 verdier: 35 / 5 = 7.', true, true, 0),
  ('matematikk-9:sentralmal-og-spredning', 'q02', 'flervalg', 'Hva er medianen av 2, 5, 8 og 10?', array['5', '8', '6,25', '6,5']::text[], 3, 'Det er fire verdier, så medianen er snittet av de to midterste: (5 + 8) / 2 = 6,5.', true, true, 1),
  ('matematikk-9:sentralmal-og-spredning', 'q03', 'flervalg', 'Hva er typetallet i 3, 5, 5, 6, 8, 8, 8, 9?', array['8', '5', '6,5', '9']::text[], 0, '8 forekommer tre ganger, oftere enn noen annen verdi.', true, true, 2),
  ('matematikk-9:sentralmal-og-spredning', 'q04', 'flervalg', 'Hva er variasjonsbredden i 12, 7, 19, 3, 15?', array['12', '19', '16', '3']::text[], 2, 'Største verdi er 19 og minste er 3. 19 − 3 = 16.', true, true, 3),
  ('matematikk-9:sentralmal-og-spredning', 'q05', 'flervalg', 'Ni personer tjener 40 000 kr og én tjener 400 000 kr i måneden. Hvilket sentralmål beskriver det typiske best?', array['Gjennomsnittet', 'Medianen', 'Variasjonsbredden', 'Summen']::text[], 1, 'Gjennomsnittet (76 000 kr) trekkes opp av én ekstremverdi. Medianen (40 000 kr) viser hva de fleste tjener.', true, true, 4),
  ('matematikk-9:sentralmal-og-spredning', 'q06', 'flervalg', 'Hva måler kvartilbredden?', array['Spredningen til de midterste 50 % av dataene', 'Forskjellen mellom største og minste verdi', 'Den vanligste verdien', 'Gjennomsnittet av kvartilene']::text[], 0, 'Kvartilbredden er øvre minus nedre kvartil, og viser spredningen i den midterste halvdelen av dataene.', true, false, 5),
  ('matematikk-9:sentralmal-og-spredning', 'q07', 'flervalg', '3 elever har 2 søsken og 5 elever har 1 søsken. Hva er gjennomsnittlig antall søsken?', array['1,5', '1,6', '1,4', '1,3']::text[], 2, '(3 · 2 + 5 · 1) / 8 = 11 / 8 ≈ 1,4.', true, true, 6),
  ('matematikk-9:sentralmal-og-spredning', 'q08', 'flervalg', 'Hvilket sentralmål passer for favorittfarge?', array['Gjennomsnitt', 'Median', 'Kvartilbredde', 'Typetall']::text[], 3, 'Farger kan ikke legges sammen eller sorteres etter størrelse. Da er typetallet det eneste meningsfulle sentralmålet.', true, true, 7),
  ('matematikk-9:sentralmal-og-spredning', 'q09', 'flervalg', 'Hva er nedre kvartil i 1, 3, 4, 6, 8, 9, 10, 12?', array['3', '3,5', '4', '7']::text[], 1, 'Nedre halvdel er 1, 3, 4, 6. Medianen av den er (3 + 4) / 2 = 3,5.', true, true, 8),
  ('matematikk-9:sentralmal-og-spredning', 'q10', 'flervalg', 'To klasser har samme gjennomsnitt på en prøve. Hva kan likevel være forskjellig?', array['Spredningen i resultatene', 'Summen av poengene hvis klassene er like store', 'Gjennomsnittet', 'Ingenting']::text[], 0, 'Samme gjennomsnitt kan skjule stor forskjell i spredning, for eksempel jevne resultater i én klasse og store forskjeller i den andre.', true, false, 9),
  ('matematikk-9:sentralmal-og-spredning', 'm01', 'sant-usant', 'Medianen påvirkes mindre av ekstremverdier enn gjennomsnittet.', array['Sant', 'Usant']::text[], 0, 'Medianen avhenger bare av plasseringen i det sorterte datasettet, ikke av hvor ekstrem den største verdien er.', false, true, 10),
  ('matematikk-9:sentralmal-og-spredning', 'm02', 'sant-usant', 'Et datasett kan ha mer enn ett typetall.', array['Sant', 'Usant']::text[], 0, 'Forekommer to verdier like ofte og oftest, har datasettet to typetall.', false, true, 11),
  ('matematikk-9:sentralmal-og-spredning', 'm03', 'sant-usant', 'Variasjonsbredden er største verdi pluss minste verdi.', array['Sant', 'Usant']::text[], 1, 'Variasjonsbredden er største verdi minus minste verdi.', false, true, 12),
  ('matematikk-9:sentralmal-og-spredning', 'm04', 'sant-usant', 'Gjennomsnittet må alltid være en av verdiene i datasettet.', array['Sant', 'Usant']::text[], 1, 'Gjennomsnittet av 1 og 2 er 1,5, som ikke er med i datasettet.', false, true, 13),
  ('matematikk-9:sentralmal-og-spredning', 'm05', 'flervalg', 'Hva er medianen av 9, 2, 7, 4, 5?', array['7', '4', '5', '5,4']::text[], 2, 'Sortert: 2, 4, 5, 7, 9. Den midterste verdien er 5.', false, true, 14),
  ('matematikk-9:sentralmal-og-spredning', 'm06', 'flervalg', 'Fem tall har gjennomsnitt 8. Hva er summen av tallene?', array['13', '40', '8', '1,6']::text[], 1, 'Gjennomsnitt = sum / antall, så sum = 8 · 5 = 40.', false, true, 15),
  ('matematikk-9:sentralmal-og-spredning', 'm07', 'flervalg', 'Hvilket mål forteller om dataene er samlet eller spredt?', array['Typetall', 'Median', 'Gjennomsnitt', 'Kvartilbredde']::text[], 3, 'Kvartilbredde er et spredningsmål. De tre andre er sentralmål.', false, true, 16);
insert into public.miniprover (tema_id, minutter) values
  ('matematikk-9:sentralmal-og-spredning', 15)
on conflict (tema_id) do update set minutter = excluded.minutter;

-- Matematikk: Statistikk i media
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('matematikk-9:statistikk-i-media', 'matematikk-9', 'statistikk-i-media', 'Statistikk i media', 'Diagramtyper, hvordan statistikk kan presenteres for å fremme et synspunkt, og hvordan du vurderer tall og grafer kritisk.', array[7, 9]::int[], 5, 'utkast', '{}'::text[], false, now())
on conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,
  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,
  publisert = excluded.publisert, oppdatert = excluded.oppdatert;
insert into public.tema_innhold (tema_id, sammendrag, tankekart) values
  ('matematikk-9:statistikk-i-media', '## Diagrammer

Statistikk presenteres ofte som diagrammer, og hvert diagram passer til sin type data:

- **Stolpediagram** sammenligner antall eller mengder i ulike kategorier.
- **Linjediagram** viser utvikling over tid, for eksempel temperatur gjennom et år.
- **Sektordiagram** (kakediagram) viser hvordan en helhet er fordelt i prosent. Sektorene skal til sammen bli 100 %, og vinklene 360°.
- **Histogram** viser hvordan tallverdier fordeler seg i intervaller, for eksempel høyder i en klasse.

## Hvordan statistikk kan villede

Tall og diagrammer kan være riktige og likevel gi et skjevt inntrykk. Noen vanlige grep er:

- **Avkuttet akse**: Starter y-aksen på 95 i stedet for 0, kan en økning fra 96 til 98 se ut som en dobling.
- **Ujevn skala**: Avstandene på aksen står ikke for like store tall.
- **Utvalgte perioder**: Man viser bare årene der utviklingen passer argumentet.
- **Absolutte tall og prosent**: «Antall ulykker økte med 50 %» kan bety en økning fra 2 til 3.
- **Tredimensjonale diagrammer**: Perspektivet kan gjøre sektorer eller stolper større enn de er.
- **Lite utvalg**: En undersøkelse med 20 svar sier lite om hele befolkningen.

## Utvalg og kilder

En **undersøkelse** spør et **utvalg** for å si noe om en større **populasjon**. Utvalget bør være stort og **representativt**, altså ligne populasjonen. En nettavstemning der alle kan svare, er ikke representativ, fordi de som bryr seg mest om saken, svarer oftest. Spør også hvem som har laget statistikken og hvorfor. En produsent som selv har finansiert en undersøkelse om eget produkt, kan ha interesse av et bestemt resultat.

## Samme tall, ulike synspunkt

De samme dataene kan presenteres for å støtte ulike syn. En kommune kan si at «skatteinntektene økte med 20 millioner», mens en kritiker sier at «inntektene per innbygger falt», fordi befolkningen vokste mer. Begge kan ha rett. Derfor er det lurt å se på tallene selv og regne med både absolutte tall og prosent.

## Spørsmål å stille

Hvor kommer tallene fra? Starter aksen på null? Hvor stort er utvalget? Hvilke tall er utelatt? Og passer diagramtypen til dataene? Med slike spørsmål kan du vurdere statistikk fra aviser, reklame, sosiale medier og lokalsamfunnet kritisk.', '{"label":"Statistikk i media","children":[{"label":"Diagramtyper","children":[{"label":"Stolpediagram","note":"Kategorier"},{"label":"Linjediagram","note":"Utvikling over tid"},{"label":"Sektordiagram","note":"Andeler av helhet"},{"label":"Histogram","note":"Intervaller"}]},{"label":"Villedende grep","children":[{"label":"Avkuttet akse"},{"label":"Utvalgte perioder"},{"label":"Prosent uten antall"},{"label":"3D-effekter"}]},{"label":"Undersøkelser","children":[{"label":"Populasjon og utvalg"},{"label":"Representativt","note":"Ligner populasjonen"},{"label":"Selvselektert","note":"Skjevt"}]},{"label":"Kritiske spørsmål","children":[{"label":"Hvem står bak?"},{"label":"Starter aksen på 0?"},{"label":"Hvor stort er utvalget?"},{"label":"Per innbygger?"}]}]}'::jsonb)
on conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;
delete from public.flashcards where tema_id = 'matematikk-9:statistikk-i-media';
insert into public.flashcards (tema_id, begrep, forklaring, sortering) values
  ('matematikk-9:statistikk-i-media', 'Stolpediagram', 'Sammenligner antall eller mengder i ulike kategorier med stolper.', 0),
  ('matematikk-9:statistikk-i-media', 'Linjediagram', 'Viser utvikling over tid med punkter som bindes sammen.', 1),
  ('matematikk-9:statistikk-i-media', 'Sektordiagram', 'Viser fordelingen av en helhet i prosent. Sektorene utgjør til sammen 360°.', 2),
  ('matematikk-9:statistikk-i-media', 'Histogram', 'Viser hvordan tallverdier fordeler seg i intervaller, uten mellomrom mellom søylene.', 3),
  ('matematikk-9:statistikk-i-media', 'Avkuttet akse', 'En y-akse som ikke starter på 0. Kan få små forskjeller til å se store ut.', 4),
  ('matematikk-9:statistikk-i-media', 'Absolutt endring', 'Endringen målt i antall, for eksempel en økning på 5 personer.', 5),
  ('matematikk-9:statistikk-i-media', 'Relativ endring', 'Endringen målt i prosent av startverdien. Fra 2 til 3 er en økning på 50 %.', 6),
  ('matematikk-9:statistikk-i-media', 'Populasjon', 'Hele gruppen en undersøkelse vil si noe om, for eksempel alle ungdommer i Norge.', 7),
  ('matematikk-9:statistikk-i-media', 'Utvalg', 'Den delen av populasjonen som faktisk blir spurt eller målt.', 8),
  ('matematikk-9:statistikk-i-media', 'Representativt utvalg', 'Et utvalg som ligner populasjonen, slik at resultatet kan overføres.', 9),
  ('matematikk-9:statistikk-i-media', 'Selvselektert utvalg', 'Når deltakerne selv velger å svare, som i nettavstemninger. Gir ofte skjeve resultater.', 10),
  ('matematikk-9:statistikk-i-media', 'Kildekritikk', 'Å vurdere hvem som står bak statistikken, og om de har interesse av et bestemt resultat.', 11),
  ('matematikk-9:statistikk-i-media', 'Utvalgte perioder', 'Å bare vise de årene som passer argumentet. Kan gi et skjevt bilde av utviklingen.', 12),
  ('matematikk-9:statistikk-i-media', 'Per innbygger', 'Å dele et tall på antall innbyggere gjør det mulig å sammenligne steder av ulik størrelse.', 13),
  ('matematikk-9:statistikk-i-media', '3D-diagram', 'Tredimensjonale effekter kan få deler av diagrammet til å se større ut enn de er.', 14);
delete from public.quiz_sporsmal where tema_id = 'matematikk-9:statistikk-i-media';
insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values
  ('matematikk-9:statistikk-i-media', 'q01', 'flervalg', 'Hvilket diagram passer best til å vise temperaturen hver måned gjennom et år?', array['Sektordiagram', 'Linjediagram', 'Histogram', 'Stolpediagram med kategorier']::text[], 1, 'Et linjediagram viser utvikling over tid og gjør det lett å se hvordan temperaturen stiger og synker.', true, true, 0),
  ('matematikk-9:statistikk-i-media', 'q02', 'flervalg', 'Hva må sektorene i et sektordiagram til sammen utgjøre?', array['180°', '100°', 'Antallet svar', '100 %, altså 360°']::text[], 3, 'Et sektordiagram viser en helhet. Alle sektorene til sammen blir 100 % av sirkelen, som er 360°.', true, true, 1),
  ('matematikk-9:statistikk-i-media', 'q03', 'flervalg', 'Y-aksen i et diagram starter på 95. Hva kan det føre til?', array['At små forskjeller ser store ut', 'At diagrammet blir mer nøyaktig', 'At dataene endres', 'At gjennomsnittet blir feil']::text[], 0, 'Når aksen er kuttet, blir forskjellene mellom stolpene overdrevet visuelt, selv om tallene er riktige.', true, true, 2),
  ('matematikk-9:statistikk-i-media', 'q04', 'flervalg', 'Antall ulykker økte fra 2 til 3. Hvor stor er den relative økningen?', array['1 %', '33 %', '50 %', '150 %']::text[], 2, 'Økningen er 1. Relativ økning = 1 / 2 = 0,5 = 50 %. Det høres mye ut, selv om det bare gjelder én ulykke.', true, true, 3),
  ('matematikk-9:statistikk-i-media', 'q05', 'flervalg', 'Hvorfor er en nettavstemning der alle kan stemme, lite pålitelig?', array['Fordi den har for mange svar', 'Fordi utvalget ikke er representativt', 'Fordi nettet regner feil', 'Fordi den bare gir prosent']::text[], 1, 'De som velger å svare, er ofte de som er mest engasjert i saken. Da ligner ikke utvalget befolkningen.', true, true, 4),
  ('matematikk-9:statistikk-i-media', 'q06', 'flervalg', 'Hva kalles hele gruppen en undersøkelse vil si noe om?', array['Utvalget', 'Frekvensen', 'Populasjonen', 'Medianen']::text[], 2, 'Populasjonen er hele gruppen, mens utvalget er de som faktisk blir spurt.', true, false, 5),
  ('matematikk-9:statistikk-i-media', 'q07', 'flervalg', 'En kommunes inntekter økte, men befolkningen økte mer. Hva kan da ha skjedd med inntektene per innbygger?', array['De må ha økt', 'De er uendret', 'Det kan ikke regnes ut', 'De kan ha gått ned']::text[], 3, 'Når befolkningen vokser raskere enn inntektene, blir det mindre per person. Begge påstandene kan være sanne samtidig.', true, true, 6),
  ('matematikk-9:statistikk-i-media', 'q08', 'flervalg', 'Hvilket diagram viser fordelingen av høyder i intervaller som 150–155 cm og 155–160 cm?', array['Histogram', 'Sektordiagram', 'Linjediagram', 'Punktdiagram over tid']::text[], 0, 'Et histogram viser hvor mange verdier som havner i hvert intervall av en tallskala.', true, false, 7),
  ('matematikk-9:statistikk-i-media', 'q09', 'flervalg', 'En undersøkelse om en brusmerkes smak er betalt av produsenten. Hva bør du tenke?', array['At den er ekstra pålitelig', 'At avsenderen kan ha interesse av et bestemt resultat', 'At den må være feil', 'At utvalget er stort']::text[], 1, 'Avsenderens interesser betyr ikke at tallene er feil, men du bør være ekstra kritisk til utvalg, spørsmål og presentasjon.', true, true, 8),
  ('matematikk-9:statistikk-i-media', 'q10', 'flervalg', 'Hvilket av disse er et eksempel på å bruke utvalgte perioder?', array['Å vise alle år fra 2000 til i dag', 'Å bruke et histogram', 'Å bare vise de tre årene der salget økte', 'Å oppgi både antall og prosent']::text[], 2, 'Å plukke ut bare de årene som passer argumentet, kan gi et helt annet inntrykk enn hele tidsserien.', true, true, 9),
  ('matematikk-9:statistikk-i-media', 'm01', 'sant-usant', 'Et diagram kan gi et skjevt inntrykk selv om alle tallene er riktige.', array['Sant', 'Usant']::text[], 0, 'Valg av skala, utsnitt og diagramtype påvirker hvordan tallene oppfattes.', false, true, 10),
  ('matematikk-9:statistikk-i-media', 'm02', 'sant-usant', 'Et stort utvalg er alltid representativt.', array['Sant', 'Usant']::text[], 1, 'Et stort utvalg kan fortsatt være skjevt, for eksempel hvis bare én gruppe har svart.', false, true, 11),
  ('matematikk-9:statistikk-i-media', 'm03', 'sant-usant', 'Et sektordiagram passer godt til å vise utvikling over mange år.', array['Sant', 'Usant']::text[], 1, 'Sektordiagram viser fordelingen av en helhet på ett tidspunkt. Utvikling over tid vises best med linjediagram.', false, true, 12),
  ('matematikk-9:statistikk-i-media', 'm04', 'sant-usant', 'En økning fra 10 til 15 er en relativ økning på 50 %.', array['Sant', 'Usant']::text[], 0, 'Økningen er 5, og 5 / 10 = 0,5 = 50 %.', false, true, 13),
  ('matematikk-9:statistikk-i-media', 'm05', 'flervalg', '30 % av 200 elever sykler til skolen. Hvor mange grader utgjør syklistene i et sektordiagram?', array['30°', '60°', '108°', '90°']::text[], 2, '30 % av 360° = 0,3 · 360° = 108°.', false, true, 14),
  ('matematikk-9:statistikk-i-media', 'm06', 'flervalg', 'Hvilket tall er best for å sammenligne kriminalitet i en storby og en liten kommune?', array['Antall lovbrudd per 1000 innbyggere', 'Totalt antall lovbrudd', 'Antall politifolk', 'Kommunens areal']::text[], 0, 'Et tall per innbygger tar hensyn til at storbyen har langt flere innbyggere.', false, true, 15),
  ('matematikk-9:statistikk-i-media', 'm07', 'flervalg', 'Hva er et representativt utvalg?', array['Et utvalg der alle har samme mening', 'Et utvalg som ligner populasjonen', 'Et utvalg med bare eksperter', 'Et utvalg som velger seg selv']::text[], 1, 'Et representativt utvalg har omtrent samme sammensetning som populasjonen, for eksempel når det gjelder alder og bosted.', false, true, 16);
insert into public.miniprover (tema_id, minutter) values
  ('matematikk-9:statistikk-i-media', 15)
on conflict (tema_id) do update set minutter = excluded.minutter;

-- Matematikk: Sannsynlighet
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('matematikk-9:sannsynlighet', 'matematikk-9', 'sannsynlighet', 'Sannsynlighet', 'Hva sannsynlighet er, gunstige og mulige utfall, relativ frekvens, og hvordan du regner på sannsynlighet i spill og statistikk.', array[10]::int[], 6, 'utkast', '{}'::text[], false, now())
on conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,
  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,
  publisert = excluded.publisert, oppdatert = excluded.oppdatert;
insert into public.tema_innhold (tema_id, sammendrag, tankekart) values
  ('matematikk-9:sannsynlighet', '## Hva er sannsynlighet?

**Sannsynlighet** er et tall mellom 0 og 1 som sier hvor stor sjanse det er for at noe skal skje. Sannsynlighet 0 betyr at hendelsen er umulig, og 1 betyr at den er sikker. Sannsynlighet kan skrives som brøk, desimaltall eller prosent: 1/4 = 0,25 = 25 %.

Et **tilfeldig forsøk** er en handling der vi ikke vet utfallet på forhånd, som å kaste en terning. Hvert mulig resultat kalles et **utfall**, og alle utfallene til sammen er **utfallsrommet**. En **hendelse** er ett eller flere utfall, for eksempel «terningen viser partall».

## Uniforme sannsynlighetsmodeller

Når alle utfallene er like sannsynlige, kan vi regne slik:

P(hendelse) = antall gunstige utfall / antall mulige utfall

Det er 3 partall på en vanlig terning, så P(partall) = 3/6 = 1/2. En kortstokk har 52 kort og 4 ess, så P(ess) = 4/52 = 1/13.

## Komplementære hendelser

Sannsynligheten for at noe **ikke** skjer, er 1 minus sannsynligheten for at det skjer: P(ikke A) = 1 − P(A). Sannsynligheten for å ikke få seks på en terning er 1 − 1/6 = 5/6.

## Relativ frekvens

I mange situasjoner kan vi ikke telle gunstige og mulige utfall, for eksempel sannsynligheten for at en tegnestift lander med spissen opp. Da gjør vi mange forsøk og regner **relativ frekvens**: antall ganger hendelsen skjedde delt på antall forsøk. Jo flere forsøk, desto nærmere kommer den relative frekvensen den egentlige sannsynligheten. Dette kalles **de store talls lov**. Statistikk brukes på samme måte: Hvis 18 av 600 lyspærer i en kontroll er defekte, anslår vi at sannsynligheten for en defekt pære er 18/600 = 3 %.

## To forsøk

Når vi gjør to forsøk etter hverandre, kan vi bruke en **tabell** eller et **valgtre** for å finne alle mulige utfall. Kaster vi to terninger, er det 6 · 6 = 36 mulige utfall. Summen 7 kan komme på 6 måter, så P(sum 7) = 6/36 = 1/6. For uavhengige forsøk kan vi gange sannsynlighetene: P(to seksere) = 1/6 · 1/6 = 1/36.

## Vurdere spill

Sannsynlighet hjelper oss å vurdere om et spill er **rettferdig**, altså om alle har like stor sjanse. Det avslører også myter: En terning har ingen hukommelse. Etter fem kast uten sekser er sjansen for sekser i neste kast fortsatt 1/6.', '{"label":"Sannsynlighet","children":[{"label":"Begreper","children":[{"label":"Utfall og utfallsrom"},{"label":"Hendelse"},{"label":"Mellom 0 og 1","note":"Umulig til sikker"}]},{"label":"Regne","children":[{"label":"Gunstige / mulige","note":"Uniform modell"},{"label":"Komplement","note":"1 − P(A)"},{"label":"Brøk, desimal, prosent"}]},{"label":"Erfaring","children":[{"label":"Relativ frekvens","note":"Antall / forsøk"},{"label":"De store talls lov"},{"label":"Statistikk som grunnlag"}]},{"label":"Flere forsøk","children":[{"label":"Tabell","note":"To terninger: 36 utfall"},{"label":"Valgtre"},{"label":"Uavhengige","note":"Gang sannsynlighetene"}]},{"label":"Spill","children":[{"label":"Rettferdig?"},{"label":"Ingen hukommelse"}]}]}'::jsonb)
on conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;
delete from public.flashcards where tema_id = 'matematikk-9:sannsynlighet';
insert into public.flashcards (tema_id, begrep, forklaring, sortering) values
  ('matematikk-9:sannsynlighet', 'Sannsynlighet', 'Et tall mellom 0 og 1 som sier hvor stor sjanse det er for at en hendelse skjer.', 0),
  ('matematikk-9:sannsynlighet', 'Tilfeldig forsøk', 'En handling der utfallet ikke er kjent på forhånd, for eksempel et terningkast.', 1),
  ('matematikk-9:sannsynlighet', 'Utfall', 'Ett mulig resultat av et forsøk, for eksempel at terningen viser 4.', 2),
  ('matematikk-9:sannsynlighet', 'Utfallsrom', 'Alle mulige utfall. For en terning: {1, 2, 3, 4, 5, 6}.', 3),
  ('matematikk-9:sannsynlighet', 'Hendelse', 'Ett eller flere utfall, for eksempel «partall» = {2, 4, 6}.', 4),
  ('matematikk-9:sannsynlighet', 'Gunstige / mulige', 'P = antall gunstige utfall / antall mulige utfall, når alle utfall er like sannsynlige.', 5),
  ('matematikk-9:sannsynlighet', 'Uniform modell', 'En sannsynlighetsmodell der alle utfallene har like stor sannsynlighet.', 6),
  ('matematikk-9:sannsynlighet', 'Umulig og sikker', 'P = 0 betyr umulig. P = 1 betyr sikker.', 7),
  ('matematikk-9:sannsynlighet', 'Komplementær hendelse', 'At hendelsen ikke skjer. P(ikke A) = 1 − P(A).', 8),
  ('matematikk-9:sannsynlighet', 'Relativ frekvens', 'Antall ganger en hendelse skjedde delt på antall forsøk.', 9),
  ('matematikk-9:sannsynlighet', 'De store talls lov', 'Med mange forsøk nærmer den relative frekvensen seg den egentlige sannsynligheten.', 10),
  ('matematikk-9:sannsynlighet', 'Valgtre', 'En tegning med greiner som viser alle utfall når flere forsøk gjøres etter hverandre.', 11),
  ('matematikk-9:sannsynlighet', 'Uavhengige forsøk', 'Forsøk der utfallet i det ene ikke påvirker det andre. Da kan sannsynlighetene ganges.', 12),
  ('matematikk-9:sannsynlighet', 'Rettferdig spill', 'Et spill der alle spillerne har like stor sjanse til å vinne.', 13),
  ('matematikk-9:sannsynlighet', 'Terningen har ingen hukommelse', 'Tidligere kast påvirker ikke neste. P(sekser) er alltid 1/6.', 14);
delete from public.quiz_sporsmal where tema_id = 'matematikk-9:sannsynlighet';
insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values
  ('matematikk-9:sannsynlighet', 'q01', 'flervalg', 'Hva er sannsynligheten for å få et partall med én terning?', array['1/6', '1/3', '1/2', '2/3']::text[], 2, 'Partallene er 2, 4 og 6: 3 gunstige av 6 mulige. 3/6 = 1/2.', true, true, 0),
  ('matematikk-9:sannsynlighet', 'q02', 'flervalg', 'Hva betyr sannsynligheten 0?', array['At hendelsen er umulig', 'At hendelsen er sikker', 'At det er 50 % sjanse', 'At vi ikke vet']::text[], 0, 'Sannsynlighet 0 betyr at hendelsen aldri kan skje. 1 betyr at den er sikker.', true, false, 1),
  ('matematikk-9:sannsynlighet', 'q03', 'flervalg', 'Hva er sannsynligheten for å trekke et ess fra en vanlig kortstokk med 52 kort?', array['1/52', '1/4', '4/13', '1/13']::text[], 3, 'Det er 4 ess blant 52 kort: 4/52 = 1/13.', true, true, 2),
  ('matematikk-9:sannsynlighet', 'q04', 'flervalg', 'Sannsynligheten for regn i morgen er 0,3. Hva er sannsynligheten for at det ikke regner?', array['0,3', '0,7', '1,3', '0,03']::text[], 1, 'Komplementær hendelse: 1 − 0,3 = 0,7.', true, true, 3),
  ('matematikk-9:sannsynlighet', 'q05', 'flervalg', 'En tegnestift kastes 200 ganger og lander med spissen opp 130 ganger. Hva er den relative frekvensen?', array['0,65', '0,35', '1,3', '0,5']::text[], 0, 'Relativ frekvens = 130 / 200 = 0,65, altså 65 %.', true, true, 4),
  ('matematikk-9:sannsynlighet', 'q06', 'flervalg', 'Hvor mange mulige utfall er det når du kaster to terninger?', array['12', '6', '36', '18']::text[], 2, 'Hver terning har 6 utfall, og alle kombinasjoner er mulige: 6 · 6 = 36.', true, true, 5),
  ('matematikk-9:sannsynlighet', 'q07', 'flervalg', 'Hva er sannsynligheten for summen 7 med to terninger?', array['1/36', '7/36', '1/12', '1/6']::text[], 3, 'Summen 7 får du med (1,6), (2,5), (3,4), (4,3), (5,2) og (6,1): 6 av 36 = 1/6.', true, true, 6),
  ('matematikk-9:sannsynlighet', 'q08', 'flervalg', 'Du har kastet fem kast uten sekser. Hva er sannsynligheten for sekser i neste kast?', array['Større enn 1/6', '1/6', 'Mindre enn 1/6', '5/6']::text[], 1, 'Kastene er uavhengige. Terningen husker ikke tidligere kast, så sannsynligheten er fortsatt 1/6.', true, true, 7),
  ('matematikk-9:sannsynlighet', 'q09', 'flervalg', 'Hva sier de store talls lov?', array['At store tall er mer sannsynlige', 'At man alltid vinner til slutt', 'At relativ frekvens nærmer seg sannsynligheten når antall forsøk øker', 'At sannsynligheten blir større jo flere ganger man prøver']::text[], 2, 'Med få forsøk kan resultatet variere mye. Med mange forsøk stabiliserer den relative frekvensen seg rundt den egentlige sannsynligheten.', true, false, 8),
  ('matematikk-9:sannsynlighet', 'q10', 'flervalg', 'Hva er sannsynligheten for å få kron to ganger på rad med en mynt?', array['1/2', '1/3', '1/8', '1/4']::text[], 3, 'Kastene er uavhengige: 1/2 · 1/2 = 1/4. Utfallene er KK, KM, MK og MM, og bare ett er gunstig.', true, true, 9),
  ('matematikk-9:sannsynlighet', 'm01', 'sant-usant', 'En sannsynlighet kan være 1,2.', array['Sant', 'Usant']::text[], 1, 'Sannsynligheter ligger alltid mellom 0 og 1, eller mellom 0 % og 100 %.', false, true, 10),
  ('matematikk-9:sannsynlighet', 'm02', 'sant-usant', '25 % er det samme som sannsynligheten 1/4.', array['Sant', 'Usant']::text[], 0, '1/4 = 0,25 = 25 %.', false, true, 11),
  ('matematikk-9:sannsynlighet', 'm03', 'sant-usant', 'Med to terninger er summen 2 like sannsynlig som summen 7.', array['Sant', 'Usant']::text[], 1, 'Summen 2 kan bare komme som (1,1): 1/36. Summen 7 kan komme på 6 måter: 6/36.', false, true, 12),
  ('matematikk-9:sannsynlighet', 'm04', 'sant-usant', 'Relativ frekvens fra mange forsøk kan brukes som et anslag for sannsynligheten.', array['Sant', 'Usant']::text[], 0, 'Etter de store talls lov kommer relativ frekvens nær sannsynligheten når forsøkene er mange.', false, true, 13),
  ('matematikk-9:sannsynlighet', 'm05', 'flervalg', 'En pose har 3 røde og 7 blå kuler. Hva er sannsynligheten for å trekke en rød?', array['3/7', '3/10', '7/10', '1/3']::text[], 1, 'Det er 3 gunstige (røde) av 10 mulige kuler: 3/10.', false, true, 14),
  ('matematikk-9:sannsynlighet', 'm06', 'flervalg', '18 av 600 lyspærer er defekte. Hva er anslått sannsynlighet for en defekt pære?', array['18 %', '0,3 %', '6 %', '3 %']::text[], 3, '18 / 600 = 0,03 = 3 %.', false, true, 15),
  ('matematikk-9:sannsynlighet', 'm07', 'flervalg', 'Hva er sannsynligheten for to seksere med to terninger?', array['1/36', '2/6', '1/12', '1/6']::text[], 0, 'Terningene er uavhengige: 1/6 · 1/6 = 1/36.', false, true, 16);
insert into public.miniprover (tema_id, minutter) values
  ('matematikk-9:sannsynlighet', 15)
on conflict (tema_id) do update set minutter = excluded.minutter;

-- Matematikk: Simulering med programmering
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('matematikk-9:simulering', 'matematikk-9', 'simulering', 'Simulering med programmering', 'Hvordan du bruker tilfeldige tall og løkker i et program til å simulere tusenvis av forsøk og anslå sannsynligheter.', array[11]::int[], 7, 'utkast', '{}'::text[], false, now())
on conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,
  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,
  publisert = excluded.publisert, oppdatert = excluded.oppdatert;
insert into public.tema_innhold (tema_id, sammendrag, tankekart) values
  ('matematikk-9:simulering', '## Hva er en simulering?

En **simulering** er en etterligning av et virkelig forsøk. I stedet for å kaste en terning 10 000 ganger for hånd, lar vi en datamaskin gjøre det på et øyeblikk. Resultatet bruker vi til å regne ut **relativ frekvens**, som ifølge de store talls lov kommer nær den egentlige sannsynligheten når antall forsøk er stort.

Simulering er særlig nyttig når sannsynligheten er vanskelig å regne ut direkte, for eksempel i spill med mange regler eller i forsøk med mange trinn.

## Tilfeldige tall i Python

I Python henter vi funksjoner for tilfeldige tall fra modulen **random**. Kommandoen randint(1, 6) gir et tilfeldig heltall fra og med 1 til og med 6, som et terningkast. Kommandoen random() gir et tilfeldig desimaltall mellom 0 og 1, og kan brukes til å simulere hendelser med kjent sannsynlighet: hvis random() < 0,3, har noe med sannsynlighet 30 % skjedd.

## Oppbygningen av en simulering

En typisk simulering har fire deler:

- En **teller** som starter på 0, for eksempel antall_seksere = 0.
- En **løkke** som gjentar forsøket mange ganger, for eksempel 10 000.
- En **betingelse** som sjekker om hendelsen skjedde, og øker telleren med 1 i så fall.
- En **utregning** til slutt: telleren delt på antall forsøk.

For å simulere to terninger lager vi to tilfeldige tall i hver runde og sjekker for eksempel om summen er 7. Etter 10 000 runder bør den relative frekvensen ligge nær 1/6 ≈ 0,167.

## Tolke resultatet

En simulering gir et **anslag**, ikke et eksakt svar. Kjører du programmet på nytt, får du et litt annet tall. Med 100 forsøk kan svaret variere mye, med 100 000 forsøk blir det stabilt. Derfor bør du kjøre simuleringen flere ganger og med ulike antall forsøk for å se hvor stor variasjonen er.

Når det går an, bør du sammenligne simuleringen med den teoretiske sannsynligheten. Stemmer de godt overens, er det et tegn på at programmet er riktig. Er avviket stort, kan det være en feil i programmet, for eksempel at randint har fått feil grenser.

## Eksempler på bruk

- Hvor mange kast trengs i gjennomsnitt før du får en sekser?
- Hvor sannsynlig er det at to i en klasse på 25 har samme bursdag?
- Hvor ofte vinner den som begynner i et terningspill?

Slike spørsmål er vanskelige å regne ut for hånd, men enkle å simulere.', '{"label":"Simulering","children":[{"label":"Idé","children":[{"label":"Etterligne forsøk"},{"label":"Mange gjentakelser"},{"label":"De store talls lov"}]},{"label":"Python","children":[{"label":"import random"},{"label":"randint(1, 6)","note":"Heltall 1–6"},{"label":"random()","note":"Tall mellom 0 og 1"}]},{"label":"Oppbygning","children":[{"label":"Teller = 0"},{"label":"Løkke","note":"10 000 ganger"},{"label":"if-betingelse","note":"Øk telleren"},{"label":"Teller / forsøk"}]},{"label":"Tolke","children":[{"label":"Anslag, ikke eksakt"},{"label":"Variasjon mellom kjøringer"},{"label":"Sammenlign med teori","note":"Avslører feil"}]}]}'::jsonb)
on conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;
delete from public.flashcards where tema_id = 'matematikk-9:simulering';
insert into public.flashcards (tema_id, begrep, forklaring, sortering) values
  ('matematikk-9:simulering', 'Simulering', 'En etterligning av et virkelig forsøk, ofte gjentatt mange ganger ved hjelp av en datamaskin.', 0),
  ('matematikk-9:simulering', 'random-modulen', 'Python-modul med funksjoner for tilfeldige tall. Hentes med import random.', 1),
  ('matematikk-9:simulering', 'randint(1, 6)', 'Gir et tilfeldig heltall fra og med 1 til og med 6, som et terningkast.', 2),
  ('matematikk-9:simulering', 'random()', 'Gir et tilfeldig desimaltall mellom 0 og 1.', 3),
  ('matematikk-9:simulering', 'random() < 0,3', 'Er sant i omtrent 30 % av tilfellene. Brukes til å simulere en hendelse med sannsynlighet 0,3.', 4),
  ('matematikk-9:simulering', 'Teller', 'En variabel som starter på 0 og økes med 1 hver gang hendelsen skjer.', 5),
  ('matematikk-9:simulering', 'Antall forsøk', 'Hvor mange ganger løkka gjentar forsøket, for eksempel 10 000.', 6),
  ('matematikk-9:simulering', 'Relativ frekvens i simulering', 'Telleren delt på antall forsøk.', 7),
  ('matematikk-9:simulering', 'Anslag', 'Et omtrentlig svar. En simulering gir et anslag, ikke et eksakt svar.', 8),
  ('matematikk-9:simulering', 'Variasjon mellom kjøringer', 'Hver kjøring gir litt ulikt svar. Variasjonen blir mindre med flere forsøk.', 9),
  ('matematikk-9:simulering', 'Teoretisk sannsynlighet', 'Sannsynligheten regnet ut med gunstige/mulige. Kan brukes til å sjekke simuleringen.', 10),
  ('matematikk-9:simulering', 'Bursdagsproblemet', 'Sannsynligheten for at to i en gruppe har samme bursdag. Egnet for simulering.', 11),
  ('matematikk-9:simulering', 'Simulere to terninger', 'Lag to tilfeldige tall i hver runde og sjekk for eksempel summen.', 12),
  ('matematikk-9:simulering', 'Feil grenser', 'Vanlig programfeil, for eksempel randint(0, 6), som gir sju mulige tall i stedet for seks.', 13),
  ('matematikk-9:simulering', 'Når simulere?', 'Når sannsynligheten er vanskelig å regne ut direkte, som i spill med mange regler.', 14);
delete from public.quiz_sporsmal where tema_id = 'matematikk-9:simulering';
insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values
  ('matematikk-9:simulering', 'q01', 'flervalg', 'Hva er en simulering?', array['Et bevis for en formel', 'En etterligning av et forsøk, ofte gjentatt mange ganger med datamaskin', 'En tabell over alle utfall', 'Et diagram']::text[], 1, 'I en simulering etterligner vi et virkelig forsøk, for eksempel et terningkast, og gjentar det mange ganger.', true, true, 0),
  ('matematikk-9:simulering', 'q02', 'flervalg', 'Hvilke tall kan randint(1, 6) gi?', array['0, 1, 2, 3, 4, 5', 'Alle tall mellom 1 og 6, også desimaltall', '1, 2, 3, 4, 5, 6', 'Bare 1 og 6']::text[], 2, 'randint gir heltall fra og med den første til og med den siste grensen.', true, true, 1),
  ('matematikk-9:simulering', 'q03', 'flervalg', 'Hvorfor gjør vi mange forsøk i en simulering?', array['For at relativ frekvens skal komme nær sannsynligheten', 'For at programmet skal gå saktere', 'Fordi Python krever det', 'For å få et eksakt svar']::text[], 0, 'Etter de store talls lov blir den relative frekvensen mer stabil og nærmere sannsynligheten jo flere forsøk vi gjør.', true, true, 2),
  ('matematikk-9:simulering', 'q04', 'flervalg', 'En simulering gir 1712 seksere på 10 000 kast. Hva er den relative frekvensen?', array['1712', '0,01712', '17,12', '0,1712']::text[], 3, '1712 / 10 000 = 0,1712, som ligger nær den teoretiske sannsynligheten 1/6 ≈ 0,167.', true, true, 3),
  ('matematikk-9:simulering', 'q05', 'flervalg', 'Hva gjør vi med telleren hver gang hendelsen skjer?', array['Setter den til 0', 'Øker den med 1', 'Deler den på 2', 'Skriver den ut']::text[], 1, 'Telleren teller hvor mange ganger hendelsen har skjedd, så den økes med 1 hver gang.', true, true, 4),
  ('matematikk-9:simulering', 'q06', 'flervalg', 'Du kjører samme simulering to ganger og får 0,164 og 0,169. Hva er mest sannsynlig?', array['Programmet er feil', 'Datamaskinen er ødelagt', 'Det er vanlig variasjon mellom kjøringer', 'Sannsynligheten har endret seg']::text[], 2, 'Simuleringer gir tilfeldige resultater, så små forskjeller mellom kjøringer er helt normale.', true, false, 5),
  ('matematikk-9:simulering', 'q07', 'flervalg', 'Hvilken betingelse simulerer en hendelse med sannsynlighet 20 %?', array['random() < 0,2', 'random() > 0,2', 'randint(1, 20) == 1', 'random() == 0,2']::text[], 0, 'random() gir et tall mellom 0 og 1, og er mindre enn 0,2 i omtrent 20 % av tilfellene.', true, true, 6),
  ('matematikk-9:simulering', 'q08', 'flervalg', 'En simulering av summen 7 med to terninger gir 0,25. Den teoretiske sannsynligheten er 1/6. Hva bør du gjøre?', array['Stole på simuleringen', 'Sjekke programmet for feil', 'Senke antall forsøk', 'Endre den teoretiske verdien']::text[], 1, '0,25 er langt unna 1/6 ≈ 0,167. Med mange forsøk tyder et så stort avvik på en feil i programmet.', true, true, 7),
  ('matematikk-9:simulering', 'q09', 'flervalg', 'Hvilken feil gjør at en simulert terning kan vise 0?', array['Løkka er for kort', 'Telleren starter på 0', 'Antall forsøk er for lite', 'randint(0, 6) i stedet for randint(1, 6)']::text[], 3, 'randint(0, 6) gir sju mulige tall, 0 til 6. En terning skal bare gi 1 til 6.', true, true, 8),
  ('matematikk-9:simulering', 'q10', 'flervalg', 'Hvilket spørsmål egner seg best for simulering?', array['Hva er 7 · 8?', 'Hvor mange kast trengs i gjennomsnitt før du får en sekser?', 'Hva er arealet av et kvadrat?', 'Hva er medianen av tre tall?']::text[], 1, 'Antall kast før sekser er tilfeldig og varierer. En simulering med mange runder gir et godt anslag på gjennomsnittet.', true, false, 9),
  ('matematikk-9:simulering', 'm01', 'sant-usant', 'En simulering gir alltid nøyaktig samme svar hver gang den kjøres.', array['Sant', 'Usant']::text[], 1, 'Simuleringer bruker tilfeldige tall, så svaret varierer litt fra kjøring til kjøring.', false, true, 10),
  ('matematikk-9:simulering', 'm02', 'sant-usant', 'Med 100 000 forsøk varierer resultatet vanligvis mindre enn med 100 forsøk.', array['Sant', 'Usant']::text[], 0, 'Flere forsøk gir mer stabile relative frekvenser.', false, true, 11),
  ('matematikk-9:simulering', 'm03', 'sant-usant', 'random() kan brukes til å simulere en hendelse med sannsynlighet 0,5.', array['Sant', 'Usant']::text[], 0, 'Betingelsen random() < 0,5 er sann omtrent halvparten av gangene, som et myntkast.', false, true, 12),
  ('matematikk-9:simulering', 'm04', 'sant-usant', 'Simulering kan bare brukes når vi allerede kjenner sannsynligheten.', array['Sant', 'Usant']::text[], 1, 'Simulering er nettopp nyttig når sannsynligheten er vanskelig å regne ut direkte.', false, true, 13),
  ('matematikk-9:simulering', 'm05', 'flervalg', 'Et program teller 4950 kron på 10 000 myntkast. Hva er den relative frekvensen?', array['0,495', '4,95', '49,5', '0,0495']::text[], 0, '4950 / 10 000 = 0,495, nær den teoretiske verdien 0,5.', false, true, 14),
  ('matematikk-9:simulering', 'm06', 'flervalg', 'Hva må telleren settes til før løkka starter?', array['1', '10 000', '0', 'Et tilfeldig tall']::text[], 2, 'Telleren skal telle fra null, så den settes til 0 før forsøkene begynner.', false, true, 15),
  ('matematikk-9:simulering', 'm07', 'flervalg', 'Hvordan simulerer du to terningkast i én runde?', array['randint(2, 12)', 'Lag to tilfeldige tall med randint(1, 6)', 'randint(1, 6) · 2', 'random() · 12']::text[], 1, 'To uavhengige tall gir riktig fordeling. randint(2, 12) gir alle summer like sannsynlige, og det stemmer ikke for to terninger.', false, true, 16);
insert into public.miniprover (tema_id, minutter) values
  ('matematikk-9:simulering', 15)
on conflict (tema_id) do update set minutter = excluded.minutter;

-- Kjemi 1 (vg2): rydd bort fjernede temaer
delete from public.temaer where fag_id = 'kjemi-1' and slug not in ('atomet-og-periodesystemet', 'kjemisk-binding', 'formler-og-navnsetting', 'stoffmengde-og-stokiometri', 'reaksjonstyper-og-redoks', 'losninger-og-konsentrasjon', 'syrer-baser-og-ph', 'energi-og-entalpi', 'reaksjonsfart-og-likevekt', 'titrering-og-spektroskopi', 'gronn-kjemi');

-- Kjemi 1: Atomet og periodesystemet
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('kjemi-1:atomet-og-periodesystemet', 'kjemi-1', 'atomet-og-periodesystemet', 'Atomet og periodesystemet', 'Hvordan atomer er bygd opp, hvordan elektronene er ordnet, og hvorfor periodesystemet viser tydelige mønstre.', array[5, 6]::int[], 0, 'utkast', '{}'::text[], false, now())
on conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,
  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,
  publisert = excluded.publisert, oppdatert = excluded.oppdatert;
insert into public.tema_innhold (tema_id, sammendrag, tankekart) values
  ('kjemi-1:atomet-og-periodesystemet', '## Atomets oppbygning

Et atom består av en liten, tung **kjerne** med positivt ladde **protoner** og nøytrale **nøytroner**, og negativt ladde **elektroner** som beveger seg rundt kjernen. Antall protoner kalles **atomnummeret** (Z), og det bestemmer hvilket grunnstoff atomet er. **Massetallet** (A) er summen av protoner og nøytroner. Atomer av samme grunnstoff med ulikt antall nøytroner kalles **isotoper**, for eksempel karbon-12 og karbon-14. Et nøytralt atom har like mange elektroner som protoner. Tar atomet opp eller gir fra seg elektroner, blir det et **ion**.

## Elektronkonfigurasjon

Elektronene ligger i **skall** med økende energi. Skall nummer n kan romme høyst 2n² elektroner. Hvert skall er delt i **orbitaler** av typene s, p, d og f. En orbital rommer to elektroner, så en s-undergruppe rommer 2, en p-undergruppe 6 og en d-undergruppe 10. Orbitalene fylles fra lavest energi: 1s, 2s, 2p, 3s, 3p, 4s, 3d og så videre. Natrium har konfigurasjonen 1s² 2s² 2p⁶ 3s¹. Elektronene i det ytterste skallet kalles **valenselektroner**, og det er de som bestemmer hvordan atomet reagerer. Edelgassene har fullt ytterskall og er svært stabile, og mange andre atomer oppnår en slik **edelgasskonfigurasjon** ved å gi fra seg, ta opp eller dele elektroner.

## Periodesystemet

Periodesystemet ordner grunnstoffene etter økende atomnummer. Radene kalles **perioder**, og periodenummeret forteller hvor mange skall som er i bruk. Kolonnene kalles **grupper**. Grunnstoffer i samme gruppe har like mange valenselektroner og derfor lignende kjemiske egenskaper. Gruppe 1 er alkalimetallene, gruppe 2 jordalkalimetallene, gruppe 17 halogenene og gruppe 18 edelgassene. Gruppe 3–12 er overgangsmetallene. Metallene står til venstre og i midten, ikke-metallene øverst til høyre.

## Periodiske trender

Mønstrene i periodesystemet kan forklares med **kjerneladning** og **skjerming**. De indre elektronene skjermer valenselektronene for noe av kjernens tiltrekning. Det valenselektronene faktisk merker, kalles **effektiv kjerneladning**.

- **Atomradius** minker bortover en periode, fordi den effektive kjerneladningen øker mens antall skall er det samme. Nedover en gruppe øker radien, fordi det kommer til flere skall.
- **Ioniseringsenergi** er energien som trengs for å fjerne et elektron. Den øker bortover en periode og minker nedover en gruppe.
- **Elektronegativitet** er et atoms evne til å trekke på elektronene i en binding. Den følger samme mønster som ioniseringsenergien, og fluor er det mest elektronegative grunnstoffet.

## Atommodeller

Synet på atomet har endret seg gjennom historien. Dalton så atomer som udelelige kuler. Thomson oppdaget elektronet, og Rutherford viste at atomet har en liten, tett kjerne. Bohr innførte faste energinivåer for elektronene, og dagens kvantemekaniske modell beskriver elektronene som orbitaler, altså områder der det er sannsynlig å finne dem. Alle modellene forenkler virkeligheten. De er nyttige så lenge vi vet hva de kan og ikke kan forklare.', '{"label":"Atomet og periodesystemet","children":[{"label":"Atomets oppbygning","children":[{"label":"Proton","note":"Positiv ladning, i kjernen"},{"label":"Nøytron","note":"Nøytral, i kjernen"},{"label":"Elektron","note":"Negativ ladning, rundt kjernen"},{"label":"Atomnummer (Z)","note":"Antall protoner"},{"label":"Massetall (A)","note":"Protoner + nøytroner"},{"label":"Isotoper","note":"Samme Z, ulikt antall nøytroner"},{"label":"Ioner","note":"Kationer (+) og anioner (−)"}]},{"label":"Elektronkonfigurasjon","children":[{"label":"Skall","note":"Høyst 2n² elektroner"},{"label":"Orbitaler","children":[{"label":"s","note":"2 elektroner"},{"label":"p","note":"6 elektroner"},{"label":"d","note":"10 elektroner"},{"label":"f","note":"14 elektroner"}]},{"label":"Valenselektroner","note":"Elektronene i ytterskallet"},{"label":"Edelgasskonfigurasjon","note":"Fullt ytterskall, stabilt"}]},{"label":"Periodesystemet","children":[{"label":"Perioder","note":"Rader – antall skall"},{"label":"Grupper","note":"Kolonner – like mange valenselektroner"},{"label":"Alkalimetaller","note":"Gruppe 1"},{"label":"Jordalkalimetaller","note":"Gruppe 2"},{"label":"Overgangsmetaller","note":"Gruppe 3–12"},{"label":"Halogener","note":"Gruppe 17"},{"label":"Edelgasser","note":"Gruppe 18"}]},{"label":"Periodiske trender","children":[{"label":"Effektiv kjerneladning","note":"Øker bortover en periode"},{"label":"Atomradius","note":"Minker bortover, øker nedover"},{"label":"Ioniseringsenergi","note":"Øker bortover, minker nedover"},{"label":"Elektronegativitet","note":"Øker bortover, minker nedover – fluor høyest"}]},{"label":"Atommodeller","children":[{"label":"Dalton","note":"Udelelige kuler"},{"label":"Thomson","note":"Oppdaget elektronet"},{"label":"Rutherford","note":"Liten, tett kjerne"},{"label":"Bohr","note":"Faste energinivåer"},{"label":"Kvantemekanisk modell","note":"Orbitaler som sannsynlighetsområder"}]}]}'::jsonb)
on conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;
delete from public.flashcards where tema_id = 'kjemi-1:atomet-og-periodesystemet';
insert into public.flashcards (tema_id, begrep, forklaring, sortering) values
  ('kjemi-1:atomet-og-periodesystemet', 'Proton', 'Positivt ladd partikkel i atomkjernen. Antall protoner bestemmer hvilket grunnstoff atomet er.', 0),
  ('kjemi-1:atomet-og-periodesystemet', 'Nøytron', 'Nøytral partikkel i atomkjernen med omtrent samme masse som et proton.', 1),
  ('kjemi-1:atomet-og-periodesystemet', 'Elektron', 'Negativt ladd partikkel med svært liten masse som befinner seg rundt atomkjernen.', 2),
  ('kjemi-1:atomet-og-periodesystemet', 'Atomnummer (Z)', 'Antall protoner i kjernen. Grunnstoffene i periodesystemet er ordnet etter økende atomnummer.', 3),
  ('kjemi-1:atomet-og-periodesystemet', 'Massetall (A)', 'Summen av protoner og nøytroner i kjernen.', 4),
  ('kjemi-1:atomet-og-periodesystemet', 'Isotoper', 'Atomer av samme grunnstoff med ulikt antall nøytroner, og dermed ulikt massetall.', 5),
  ('kjemi-1:atomet-og-periodesystemet', 'Ion', 'Et atom eller en atomgruppe med elektrisk ladning fordi antall elektroner er forskjellig fra antall protoner.', 6),
  ('kjemi-1:atomet-og-periodesystemet', 'Kation', 'Positivt ladd ion. Dannes når et atom gir fra seg elektroner, for eksempel Na⁺.', 7),
  ('kjemi-1:atomet-og-periodesystemet', 'Anion', 'Negativt ladd ion. Dannes når et atom tar opp elektroner, for eksempel Cl⁻.', 8),
  ('kjemi-1:atomet-og-periodesystemet', 'Elektronskall', 'Energinivå der elektronene befinner seg. Skall nummer n kan romme høyst 2n² elektroner.', 9),
  ('kjemi-1:atomet-og-periodesystemet', 'Orbital', 'Område rundt kjernen der det er stor sannsynlighet for å finne et elektron. Hver orbital rommer høyst to elektroner.', 10),
  ('kjemi-1:atomet-og-periodesystemet', 'Elektronkonfigurasjon', 'Oversikt over hvordan elektronene er fordelt i skall og orbitaler, for eksempel 1s² 2s² 2p⁶ 3s¹ for natrium.', 11),
  ('kjemi-1:atomet-og-periodesystemet', 'Valenselektroner', 'Elektronene i det ytterste skallet. De avgjør hvordan atomet binder seg og reagerer.', 12),
  ('kjemi-1:atomet-og-periodesystemet', 'Edelgasskonfigurasjon', 'Fullt ytterskall, som hos edelgassene. En svært stabil elektronfordeling som mange atomer oppnår ved å danne ioner eller bindinger.', 13),
  ('kjemi-1:atomet-og-periodesystemet', 'Periode', 'En vannrett rad i periodesystemet. Periodenummeret tilsvarer antall skall som er i bruk.', 14),
  ('kjemi-1:atomet-og-periodesystemet', 'Gruppe', 'En loddrett kolonne i periodesystemet. Grunnstoffene i samme gruppe har like mange valenselektroner og lignende egenskaper.', 15),
  ('kjemi-1:atomet-og-periodesystemet', 'Alkalimetaller', 'Grunnstoffene i gruppe 1 (unntatt hydrogen). Svært reaktive metaller med ett valenselektron.', 16),
  ('kjemi-1:atomet-og-periodesystemet', 'Halogener', 'Grunnstoffene i gruppe 17, for eksempel fluor og klor. Reaktive ikke-metaller med sju valenselektroner.', 17),
  ('kjemi-1:atomet-og-periodesystemet', 'Edelgasser', 'Grunnstoffene i gruppe 18. Har fullt ytterskall og reagerer svært lite.', 18),
  ('kjemi-1:atomet-og-periodesystemet', 'Effektiv kjerneladning', 'Den tiltrekningen valenselektronene faktisk merker fra kjernen, etter at de indre elektronene har skjermet for noe av den.', 19),
  ('kjemi-1:atomet-og-periodesystemet', 'Atomradius', 'Et mål på atomets størrelse. Minker bortover en periode og øker nedover en gruppe.', 20),
  ('kjemi-1:atomet-og-periodesystemet', 'Ioniseringsenergi', 'Energien som trengs for å fjerne det løsest bundne elektronet fra et atom i gassform. Øker bortover en periode og minker nedover en gruppe.', 21),
  ('kjemi-1:atomet-og-periodesystemet', 'Elektronegativitet', 'Et atoms evne til å tiltrekke seg elektronene i en kjemisk binding. Fluor har høyest elektronegativitet.', 22);
delete from public.quiz_sporsmal where tema_id = 'kjemi-1:atomet-og-periodesystemet';
insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values
  ('kjemi-1:atomet-og-periodesystemet', 'q01', 'flervalg', 'Hva bestemmer hvilket grunnstoff et atom er?', array['Antall nøytroner', 'Antall protoner', 'Antall elektroner i ytterskallet', 'Massetallet']::text[], 1, 'Atomnummeret, altså antall protoner, bestemmer grunnstoffet. Antall nøytroner kan variere (isotoper), og antall elektroner endres når det dannes ioner.', true, true, 0),
  ('kjemi-1:atomet-og-periodesystemet', 'q02', 'flervalg', 'Et atom har 17 protoner, 18 nøytroner og 17 elektroner. Hva er massetallet?', array['17', '18', '34', '35']::text[], 3, 'Massetallet er protoner pluss nøytroner: 17 + 18 = 35. Atomet er klor-35.', true, true, 1),
  ('kjemi-1:atomet-og-periodesystemet', 'q03', 'flervalg', 'Hva er karbon-12 og karbon-14 et eksempel på?', array['Isotoper', 'Ioner', 'Allotrope former', 'Ulike grunnstoffer']::text[], 0, 'Begge har 6 protoner, men karbon-14 har 8 nøytroner og karbon-12 har 6. Samme grunnstoff med ulikt antall nøytroner kalles isotoper.', true, false, 2),
  ('kjemi-1:atomet-og-periodesystemet', 'q04', 'flervalg', 'Hvor mange elektroner kan skall nummer 3 (M-skallet) romme?', array['8', '18', '2', '32']::text[], 1, 'Et skall kan romme høyst 2n² elektroner. For n = 3 gir det 2 · 3² = 18.', true, true, 3),
  ('kjemi-1:atomet-og-periodesystemet', 'q05', 'flervalg', 'Hvilken elektronkonfigurasjon har magnesium (Z = 12)?', array['1s² 2s² 2p⁶ 3s¹', '1s² 2s² 2p⁸', '1s² 2s² 2p⁶ 3p²', '1s² 2s² 2p⁶ 3s²']::text[], 3, 'Tolv elektroner fordeles 2 i 1s, 2 i 2s, 6 i 2p og 2 i 3s. En p-undergruppe kan ikke ha mer enn 6 elektroner, og 3s fylles før 3p.', true, true, 4),
  ('kjemi-1:atomet-og-periodesystemet', 'q06', 'flervalg', 'Hvorfor har grunnstoffene i samme gruppe lignende kjemiske egenskaper?', array['De har samme atommasse', 'De har like mange skall', 'De har like mange valenselektroner', 'De har like mange nøytroner']::text[], 2, 'Valenselektronene avgjør hvordan et atom reagerer, og grunnstoffene i samme gruppe har like mange av dem.', true, true, 5),
  ('kjemi-1:atomet-og-periodesystemet', 'q07', 'flervalg', 'Hvordan endrer atomradius seg bortover en periode fra venstre mot høyre?', array['Den minker', 'Den øker', 'Den er konstant', 'Den øker først og minker så']::text[], 0, 'Bortover en periode øker den effektive kjerneladningen mens antall skall er det samme. Elektronene trekkes tettere inn, og atomet blir mindre.', true, true, 6),
  ('kjemi-1:atomet-og-periodesystemet', 'q08', 'flervalg', 'Hvilket grunnstoff har høyest elektronegativitet?', array['Oksygen', 'Klor', 'Helium', 'Fluor']::text[], 3, 'Fluor står øverst til høyre blant grunnstoffene som danner bindinger, og har den høyeste elektronegativiteten av alle.', true, false, 7),
  ('kjemi-1:atomet-og-periodesystemet', 'q09', 'flervalg', 'Hvorfor har kalium lavere ioniseringsenergi enn natrium?', array['Kalium har færre protoner', 'Valenselektronet i kalium er lenger fra kjernen og mer skjermet', 'Kalium har flere valenselektroner', 'Natrium er et edelgassatom']::text[], 1, 'Kalium har ett skall mer enn natrium. Valenselektronet er lenger unna kjernen og skjermes av flere indre elektroner, så det er lettere å fjerne.', true, true, 8),
  ('kjemi-1:atomet-og-periodesystemet', 'q10', 'flervalg', 'Hvilket ion danner kalsium (gruppe 2) oftest?', array['Ca⁺', 'Ca²⁻', 'Ca²⁺', 'Ca³⁺']::text[], 2, 'Kalsium har to valenselektroner. Ved å gi fra seg begge får det edelgasskonfigurasjon og blir Ca²⁺.', true, true, 9),
  ('kjemi-1:atomet-og-periodesystemet', 'q11', 'flervalg', 'Hva viste Rutherfords gullfolieforsøk?', array['At atomet har en liten, tett og positivt ladd kjerne', 'At elektronene går i faste baner', 'At atomer er udelelige', 'At elektronet finnes']::text[], 0, 'De fleste alfapartiklene gikk rett gjennom folien, men noen få ble kastet kraftig tilbake. Det viste at nesten all massen og den positive ladningen er samlet i en liten kjerne.', true, true, 10),
  ('kjemi-1:atomet-og-periodesystemet', 'q12', 'flervalg', 'Et natriumatom blir til Na⁺. Hva skjer med størrelsen?', array['Den øker', 'Den er uendret', 'Den dobles', 'Den minker']::text[], 3, 'Natrium mister hele det ytterste skallet sitt når det gir fra seg ett elektron. De resterende elektronene trekkes dessuten sterkere inn, så Na⁺ er mye mindre enn Na.', true, true, 11),
  ('kjemi-1:atomet-og-periodesystemet', 'm01', 'sant-usant', 'Et nøytralt atom har like mange elektroner som protoner.', array['Sant', 'Usant']::text[], 0, 'Protonene har ladning +1 og elektronene −1. Et nøytralt atom har like mange av hver, slik at ladningene opphever hverandre.', false, true, 12),
  ('kjemi-1:atomet-og-periodesystemet', 'm02', 'sant-usant', 'Isotoper av samme grunnstoff har ulikt antall protoner.', array['Sant', 'Usant']::text[], 1, 'Isotoper har samme antall protoner, men ulikt antall nøytroner.', false, true, 13),
  ('kjemi-1:atomet-og-periodesystemet', 'm03', 'flervalg', 'Hvor mange valenselektroner har et atom i gruppe 16, for eksempel oksygen?', array['2', '4', '6', '8']::text[], 2, 'For hovedgruppene 13–18 er antall valenselektroner gruppenummeret minus 10. Gruppe 16 gir seks valenselektroner.', false, true, 14),
  ('kjemi-1:atomet-og-periodesystemet', 'm04', 'flervalg', 'Hvilket av disse er et halogen?', array['Natrium', 'Brom', 'Argon', 'Kalsium']::text[], 1, 'Brom står i gruppe 17 sammen med fluor, klor og jod. Natrium er et alkalimetall, argon en edelgass og kalsium et jordalkalimetall.', false, true, 15),
  ('kjemi-1:atomet-og-periodesystemet', 'm05', 'sant-usant', 'Ioniseringsenergien øker nedover en gruppe i periodesystemet.', array['Sant', 'Usant']::text[], 1, 'Den minker nedover en gruppe. Valenselektronene er lenger fra kjernen og mer skjermet, og de er derfor lettere å fjerne.', false, true, 16),
  ('kjemi-1:atomet-og-periodesystemet', 'm06', 'flervalg', 'Hvilken orbital fylles rett etter 3p?', array['3d', '4p', '4s', '4d']::text[], 2, '4s har litt lavere energi enn 3d og fylles derfor først. Rekkefølgen er 3s, 3p, 4s, 3d, 4p.', false, true, 17),
  ('kjemi-1:atomet-og-periodesystemet', 'm07', 'sant-usant', 'Et klorid-ion (Cl⁻) er større enn et kloratom.', array['Sant', 'Usant']::text[], 0, 'Det ekstra elektronet gir mer frastøtning mellom elektronene, mens kjerneladningen er den samme. Elektronskyen blir derfor større.', false, true, 18),
  ('kjemi-1:atomet-og-periodesystemet', 'm08', 'flervalg', 'Hvem innførte ideen om at elektronene har faste energinivåer?', array['Dalton', 'Thomson', 'Bohr', 'Mendelejev']::text[], 2, 'Bohr foreslo i 1913 at elektronene bare kan ha bestemte energier. Modellen forklarer linjespektrene til hydrogen.', false, true, 19);
insert into public.miniprover (tema_id, minutter) values
  ('kjemi-1:atomet-og-periodesystemet', 20)
on conflict (tema_id) do update set minutter = excluded.minutter;

-- Kjemi 1: Kjemisk binding og molekylgeometri
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('kjemi-1:kjemisk-binding', 'kjemi-1', 'kjemisk-binding', 'Kjemisk binding og molekylgeometri', 'Ionebinding, kovalent binding og metallbinding, formen på molekyler og kreftene som virker mellom dem.', array[5, 7]::int[], 1, 'utkast', array['Læreverk bruker litt ulike navn på molekylformene (for eksempel «plan trigonal» eller «plan trekantet»). Sjekk at navnene stemmer med læreboka elevene bruker.']::text[], false, now())
on conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,
  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,
  publisert = excluded.publisert, oppdatert = excluded.oppdatert;
insert into public.tema_innhold (tema_id, sammendrag, tankekart) values
  ('kjemi-1:kjemisk-binding', '## Binding er elektrostatisk tiltrekning

All kjemisk binding skyldes at positive og negative ladninger tiltrekker hverandre. Hvilken bindingstype som dannes, avhenger av hvor sterkt atomene trekker på elektronene, altså **elektronegativiteten** deres.

## Ionebinding

Når et metall reagerer med et ikke-metall, gir metallatomet fra seg elektroner og ikke-metallatomet tar dem opp. Da dannes positive og negative ioner som holdes sammen i et **ionegitter**. Natriumklorid (NaCl) er et typisk eksempel. Ioneforbindelser har høyt smeltepunkt og er harde og sprø. De leder strøm når de er smeltet eller løst i vann, fordi ionene da kan bevege seg.

## Kovalent binding

Mellom ikke-metaller deles elektronpar. Ett delt elektronpar er en **enkeltbinding**, to eller tre delte par gir **dobbelt-** og **trippelbinding**. Er elektronegativiteten lik, deles elektronene likt, og bindingen er **upolar**, som i H₂ og Cl₂. Er den ulik, trekkes elektronene mot det mest elektronegative atomet. Da får vi en **polar kovalent binding** med delladninger δ+ og δ−, som i HCl. Jo større forskjell i elektronegativitet, desto mer polar blir bindingen. Ved svært store forskjeller regner vi den som ionisk.

## Metallbinding

I et metall har atomene gitt fra seg valenselektronene til et felles **elektronhav**. De positive metallionene holdes sammen av de frie elektronene. Det forklarer at metaller leder strøm og varme godt og kan bøyes og formes uten å knekke.

## Molekylgeometri

En **Lewisstruktur** viser valenselektronene som bindinger og **frie elektronpar**. Formen på molekylet kan forutsies med **VSEPR-modellen**: elektronparene rundt sentralatomet frastøter hverandre og ordner seg så langt fra hverandre som mulig.

- To elektronområder gir **lineær** form, 180° (CO₂).
- Tre gir **plan trigonal** form, 120° (BF₃).
- Fire gir **tetraedrisk** form, 109,5° (CH₄).

Frie elektronpar tar mer plass enn bindinger. Derfor blir NH₃ **trigonal pyramidal** (omtrent 107°) og H₂O **vinklet** (omtrent 104,5°).

## Polare molekyler

Et molekyl er polart når det har polare bindinger og en form der delladningene ikke opphever hverandre. H₂O er polart. CO₂ har polare bindinger, men er lineært og symmetrisk, så molekylet som helhet er upolart.

## Krefter mellom molekyler

Molekylære stoffer holdes sammen av **intermolekylære krefter**, som er mye svakere enn bindingene inne i molekylene.

- **London-krefter** virker mellom alle molekyler og blir sterkere jo større molekylet er.
- **Dipol-dipol-krefter** virker mellom polare molekyler.
- **Hydrogenbindinger** er spesielt sterke dipolkrefter. De oppstår når H er bundet til N, O eller F og tiltrekkes av et fritt elektronpar på N, O eller F i et annet molekyl.

Sterkere krefter mellom molekylene gir høyere kokepunkt. Vann har uvanlig høyt kokepunkt for et så lite molekyl på grunn av hydrogenbindingene.

## Stoffers struktur

I **kovalente nettverk**, som diamant og kvarts (SiO₂), er alle atomene i krystallen bundet sammen med kovalente bindinger. Slike stoffer er svært harde og har svært høye smeltepunkter.', '{"label":"Kjemisk binding","children":[{"label":"Bindingstyper","children":[{"label":"Ionebinding","note":"Metall + ikke-metall, ionegitter"},{"label":"Kovalent binding","note":"Delte elektronpar mellom ikke-metaller","children":[{"label":"Upolar","note":"Lik elektronegativitet"},{"label":"Polar","note":"Delladninger δ+ og δ−"},{"label":"Enkelt-, dobbelt- og trippelbinding","note":"1, 2 eller 3 delte elektronpar"}]},{"label":"Metallbinding","note":"Metallioner i et elektronhav"}]},{"label":"Elektronegativitet","children":[{"label":"Lik","note":"Upolar binding"},{"label":"Ulik","note":"Polar binding"},{"label":"Svært ulik","note":"Ionebinding"}]},{"label":"Molekylgeometri (VSEPR)","children":[{"label":"Lineær","note":"180°, CO₂"},{"label":"Plan trigonal","note":"120°, BF₃"},{"label":"Tetraedrisk","note":"109,5°, CH₄"},{"label":"Trigonal pyramidal","note":"Ca. 107°, NH₃"},{"label":"Vinklet","note":"Ca. 104,5°, H₂O"}]},{"label":"Polaritet","children":[{"label":"Polare bindinger","note":"Ulik elektronegativitet"},{"label":"Symmetri","note":"Symmetriske molekyler kan være upolare, som CO₂"},{"label":"Polart molekyl","note":"Har en positiv og en negativ ende, som H₂O"}]},{"label":"Intermolekylære krefter","children":[{"label":"London-krefter","note":"Mellom alle molekyler, øker med størrelse"},{"label":"Dipol-dipol-krefter","note":"Mellom polare molekyler"},{"label":"Hydrogenbindinger","note":"H bundet til N, O eller F"},{"label":"Kokepunkt","note":"Sterkere krefter gir høyere kokepunkt"}]},{"label":"Stoffers struktur","children":[{"label":"Ionegitter","note":"Høyt smeltepunkt, sprøtt"},{"label":"Molekylære stoffer","note":"Lavt smelte- og kokepunkt"},{"label":"Kovalente nettverk","note":"Diamant og kvarts, svært hardt"},{"label":"Metaller","note":"Leder strøm, kan formes"}]}]}'::jsonb)
on conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;
delete from public.flashcards where tema_id = 'kjemi-1:kjemisk-binding';
insert into public.flashcards (tema_id, begrep, forklaring, sortering) values
  ('kjemi-1:kjemisk-binding', 'Kjemisk binding', 'Elektrostatisk tiltrekning som holder atomer eller ioner sammen.', 0),
  ('kjemi-1:kjemisk-binding', 'Ionebinding', 'Binding mellom positive og negative ioner. Dannes typisk når et metall gir elektroner til et ikke-metall.', 1),
  ('kjemi-1:kjemisk-binding', 'Ionegitter', 'Regelmessig tredimensjonalt mønster av positive og negative ioner, som i natriumklorid.', 2),
  ('kjemi-1:kjemisk-binding', 'Kovalent binding', 'Binding der to atomer deler ett eller flere elektronpar. Vanlig mellom ikke-metaller.', 3),
  ('kjemi-1:kjemisk-binding', 'Dobbeltbinding', 'Kovalent binding der to atomer deler to elektronpar, altså fire elektroner.', 4),
  ('kjemi-1:kjemisk-binding', 'Upolar kovalent binding', 'Kovalent binding der elektronene deles likt fordi atomene har lik elektronegativitet, for eksempel i H₂.', 5),
  ('kjemi-1:kjemisk-binding', 'Polar kovalent binding', 'Kovalent binding der elektronene trekkes mot det mest elektronegative atomet, slik at det oppstår delladninger δ+ og δ−.', 6),
  ('kjemi-1:kjemisk-binding', 'Delladning (δ+ og δ−)', 'Små positive eller negative ladninger på atomene i en polar binding. Ikke hele ladninger, som hos ioner.', 7),
  ('kjemi-1:kjemisk-binding', 'Metallbinding', 'Binding der positive metallioner holdes sammen av et hav av frie valenselektroner.', 8),
  ('kjemi-1:kjemisk-binding', 'Lewisstruktur', 'Tegning av et molekyl der valenselektronene vises som bindingsstreker og frie elektronpar.', 9),
  ('kjemi-1:kjemisk-binding', 'Fritt elektronpar', 'Et par valenselektroner som ikke inngår i en binding. Påvirker formen på molekylet.', 10),
  ('kjemi-1:kjemisk-binding', 'Oktettregelen', 'Atomer i hovedgruppene har en tendens til å få åtte elektroner i ytterskallet når de binder seg. Hydrogen får to.', 11),
  ('kjemi-1:kjemisk-binding', 'VSEPR-modellen', 'Modell som forutsier formen på molekyler ut fra at elektronparene rundt sentralatomet frastøter hverandre og plasserer seg lengst mulig fra hverandre.', 12),
  ('kjemi-1:kjemisk-binding', 'Lineær form', 'Molekylform med bindingsvinkel 180°, for eksempel CO₂.', 13),
  ('kjemi-1:kjemisk-binding', 'Plan trigonal form', 'Tre elektronområder i samme plan med 120° mellom seg, for eksempel BF₃.', 14),
  ('kjemi-1:kjemisk-binding', 'Tetraedrisk form', 'Fire elektronområder med 109,5° mellom seg, for eksempel CH₄.', 15),
  ('kjemi-1:kjemisk-binding', 'Trigonal pyramidal form', 'Tre bindinger og ett fritt elektronpar rundt sentralatomet, for eksempel NH₃ (omtrent 107°).', 16),
  ('kjemi-1:kjemisk-binding', 'Vinklet form', 'To bindinger og to frie elektronpar rundt sentralatomet, for eksempel H₂O (omtrent 104,5°).', 17),
  ('kjemi-1:kjemisk-binding', 'Polart molekyl', 'Molekyl med en positiv og en negativ ende fordi delladningene ikke opphever hverandre, for eksempel H₂O.', 18),
  ('kjemi-1:kjemisk-binding', 'Intermolekylære krefter', 'Tiltrekningskrefter mellom molekyler. Mye svakere enn bindingene inne i molekylene, men avgjør smelte- og kokepunkt.', 19),
  ('kjemi-1:kjemisk-binding', 'London-krefter', 'Svake krefter som virker mellom alle molekyler, på grunn av midlertidige dipoler. Blir sterkere jo større molekylet er.', 20),
  ('kjemi-1:kjemisk-binding', 'Dipol-dipol-krefter', 'Tiltrekning mellom den positive enden av ett polart molekyl og den negative enden av et annet.', 21),
  ('kjemi-1:kjemisk-binding', 'Hydrogenbinding', 'Sterk dipolkraft mellom et H-atom bundet til N, O eller F og et fritt elektronpar på N, O eller F i et annet molekyl.', 22),
  ('kjemi-1:kjemisk-binding', 'Kovalent nettverk', 'Stoff der atomene er bundet kovalent gjennom hele krystallen, som diamant og kvarts. Svært hardt og høyt smeltepunkt.', 23);
delete from public.quiz_sporsmal where tema_id = 'kjemi-1:kjemisk-binding';
insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values
  ('kjemi-1:kjemisk-binding', 'q01', 'flervalg', 'Hvilken bindingstype finnes i natriumklorid (NaCl)?', array['Upolar kovalent binding', 'Metallbinding', 'Ionebinding', 'Hydrogenbinding']::text[], 2, 'Natrium er et metall og klor et ikke-metall. Natrium gir fra seg et elektron til klor, og ionene Na⁺ og Cl⁻ holdes sammen i et ionegitter.', true, true, 0),
  ('kjemi-1:kjemisk-binding', 'q02', 'flervalg', 'Hvorfor leder fast natriumklorid ikke strøm, mens smeltet natriumklorid gjør det?', array['I fast stoff sitter ionene fast i gitteret', 'Fast natriumklorid inneholder ingen ioner', 'Smeltet natriumklorid inneholder frie elektroner', 'Fast natriumklorid er et metall']::text[], 0, 'For å lede strøm må ladde partikler kunne bevege seg. I fast stoff er ionene låst i gitteret. Når stoffet smelter eller løses i vann, kan ionene bevege seg fritt.', true, true, 1),
  ('kjemi-1:kjemisk-binding', 'q03', 'flervalg', 'Hvilket molekyl har en upolar kovalent binding?', array['HCl', 'H₂O', 'NH₃', 'Cl₂']::text[], 3, 'I Cl₂ er begge atomene like, med lik elektronegativitet, så elektronene deles helt likt. I de andre molekylene er atomene ulike og bindingene polare.', true, true, 2),
  ('kjemi-1:kjemisk-binding', 'q04', 'flervalg', 'Hvilken form har et metanmolekyl (CH₄)?', array['Plan trigonal', 'Tetraedrisk', 'Lineær', 'Vinklet']::text[], 1, 'Karbon har fire bindinger og ingen frie elektronpar. Fire elektronområder plasserer seg lengst mulig fra hverandre i en tetraeder, med 109,5° mellom bindingene.', true, true, 3),
  ('kjemi-1:kjemisk-binding', 'q05', 'flervalg', 'Hvorfor er vannmolekylet vinklet og ikke lineært?', array['Hydrogenatomene tiltrekker hverandre', 'Oksygen danner to dobbeltbindinger', 'Oksygen har to frie elektronpar som skyver bindingene sammen', 'Vannmolekylene danner hydrogenbindinger']::text[], 2, 'Oksygen har to bindinger og to frie elektronpar, altså fire elektronområder. De frie parene tar mye plass og presser bindingene sammen til omtrent 104,5°.', true, true, 4),
  ('kjemi-1:kjemisk-binding', 'q06', 'flervalg', 'CO₂ har polare bindinger. Hvorfor er molekylet likevel upolart?', array['Molekylet er lineært, så dipolene opphever hverandre', 'Karbon og oksygen har lik elektronegativitet', 'Bindingene i CO₂ er ioniske', 'CO₂ er en gass ved romtemperatur']::text[], 0, 'Begge C=O-bindingene er polare, men de peker i motsatt retning med 180° mellom seg. Da opphever dipolene hverandre, og molekylet får ingen positiv og negativ ende.', true, true, 5),
  ('kjemi-1:kjemisk-binding', 'q07', 'flervalg', 'Hvilken type kraft virker mellom alle molekyler?', array['Hydrogenbindinger', 'London-krefter', 'Dipol-dipol-krefter', 'Ionebindinger']::text[], 1, 'London-krefter skyldes midlertidige skjevheter i elektronskyen og finnes mellom alle molekyler, også upolare. De andre kreftene krever polare molekyler eller ioner.', true, false, 6),
  ('kjemi-1:kjemisk-binding', 'q08', 'flervalg', 'Hvilket av disse stoffene danner hydrogenbindinger mellom molekylene?', array['CH₄', 'H₂S', 'Cl₂', 'NH₃']::text[], 3, 'Hydrogenbindinger krever H bundet til N, O eller F. I NH₃ er hydrogen bundet til nitrogen, og nitrogen har et fritt elektronpar som kan tiltrekke H i et annet molekyl.', true, true, 7),
  ('kjemi-1:kjemisk-binding', 'q09', 'flervalg', 'Hvorfor har vann (H₂O) mye høyere kokepunkt enn hydrogensulfid (H₂S)?', array['Vannmolekylene danner hydrogenbindinger', 'Vannmolekylet er større', 'Hydrogensulfid er en ioneforbindelse', 'Vann er et kovalent nettverk']::text[], 0, 'Oksygen er svært elektronegativt, så vann danner hydrogenbindinger. Svovel er mindre elektronegativt, og H₂S har bare svakere krefter mellom molekylene. Derfor koker vann ved 100 °C og H₂S langt under 0 °C.', true, true, 8),
  ('kjemi-1:kjemisk-binding', 'q10', 'flervalg', 'Hva kjennetegner metallbinding?', array['Delte elektronpar mellom to bestemte atomer', 'Positive og negative ioner i et gitter', 'Positive metallioner i et hav av frie elektroner', 'Hydrogen bundet til oksygen']::text[], 2, 'I metaller deler alle atomene valenselektronene sine i et felles elektronhav. De frie elektronene gjør at metaller leder strøm og varme.', true, false, 9),
  ('kjemi-1:kjemisk-binding', 'q11', 'flervalg', 'Hvilket av halogenene har høyest kokepunkt?', array['F₂', 'Cl₂', 'Br₂', 'I₂']::text[], 3, 'Halogenmolekylene er upolare, så bare London-krefter virker mellom dem. Kreftene blir sterkere med flere elektroner og større molekyler, og I₂ er størst.', true, true, 10),
  ('kjemi-1:kjemisk-binding', 'q12', 'flervalg', 'Hvor mange frie elektronpar har nitrogenatomet i ammoniakk (NH₃)?', array['Ingen', 'Ett', 'To', 'Tre']::text[], 1, 'Nitrogen har fem valenselektroner. Tre brukes i bindingene til hydrogen, og de to siste danner ett fritt elektronpar. Det gir molekylet trigonal pyramidal form.', true, true, 11),
  ('kjemi-1:kjemisk-binding', 'm01', 'sant-usant', 'Diamant har svært høyt smeltepunkt fordi atomene er bundet sammen med kovalente bindinger gjennom hele krystallen.', array['Sant', 'Usant']::text[], 0, 'For å smelte diamant må kovalente bindinger brytes, ikke bare svake krefter mellom molekyler. Det krever svært mye energi.', false, true, 12),
  ('kjemi-1:kjemisk-binding', 'm02', 'flervalg', 'Hvilken bindingsvinkel har et tetraedrisk molekyl?', array['90°', '109,5°', '120°', '180°']::text[], 1, 'Fire elektronområder kommer lengst fra hverandre når de peker mot hjørnene i en tetraeder. Vinkelen mellom dem blir 109,5°.', false, true, 13),
  ('kjemi-1:kjemisk-binding', 'm03', 'sant-usant', 'En hydrogenbinding er en kovalent binding mellom to hydrogenatomer.', array['Sant', 'Usant']::text[], 1, 'En hydrogenbinding er en kraft mellom molekyler: et H-atom bundet til N, O eller F tiltrekkes av et fritt elektronpar i et annet molekyl. Den er mye svakere enn en kovalent binding.', false, true, 14),
  ('kjemi-1:kjemisk-binding', 'm04', 'flervalg', 'Hvilken form har bortrifluorid (BF₃)?', array['Trigonal pyramidal', 'Tetraedrisk', 'Plan trigonal', 'Vinklet']::text[], 2, 'Bor har tre bindinger og ingen frie elektronpar. Tre elektronområder legger seg i samme plan med 120° mellom seg.', false, true, 15),
  ('kjemi-1:kjemisk-binding', 'm05', 'flervalg', 'Hvilken av disse bindingene er mest polar?', array['H–H', 'C–H', 'O–H', 'H–F']::text[], 3, 'Fluor er det mest elektronegative grunnstoffet, så forskjellen i elektronegativitet er størst i H–F. Da trekkes elektronene mest skjevt.', false, true, 16),
  ('kjemi-1:kjemisk-binding', 'm06', 'sant-usant', 'Metaller leder strøm fordi valenselektronene kan bevege seg fritt gjennom metallet.', array['Sant', 'Usant']::text[], 0, 'I metallbinding deler atomene valenselektronene i et elektronhav. Når det kobles til en spenning, beveger elektronene seg og fører strøm.', false, true, 17),
  ('kjemi-1:kjemisk-binding', 'm07', 'flervalg', 'Hvor mange elektroner deles i en dobbeltbinding?', array['2', '4', '6', '8']::text[], 1, 'En dobbeltbinding består av to delte elektronpar, altså fire elektroner.', false, true, 18),
  ('kjemi-1:kjemisk-binding', 'm08', 'sant-usant', 'Ioneforbindelser har som regel lavt smeltepunkt.', array['Sant', 'Usant']::text[], 1, 'Tiltrekningen mellom ionene i et gitter er sterk, så ioneforbindelser har som regel høyt smeltepunkt. Natriumklorid smelter først ved rundt 800 °C.', false, true, 19);
insert into public.miniprover (tema_id, minutter) values
  ('kjemi-1:kjemisk-binding', 20)
on conflict (tema_id) do update set minutter = excluded.minutter;

-- Kjemi 1: Formler og navnsetting
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('kjemi-1:formler-og-navnsetting', 'kjemi-1', 'formler-og-navnsetting', 'Formler og navnsetting', 'Hvordan du skriver kjemiske formler og gir navn til ioneforbindelser, molekylforbindelser, syrer og hydrater.', array[1]::int[], 2, 'utkast', array['Læreplanen sier ikke direkte om enkel organisk navnsetting (alkaner, alkoholer osv.) hører til Kjemi 1. Vurder om det trengs et eget tema for det.', 'Skrivemåten for sammensatte navn varierer litt mellom læreverk (for eksempel «kobber(II)sulfatpentahydrat» med eller uten bindestrek).']::text[], false, now())
on conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,
  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,
  publisert = excluded.publisert, oppdatert = excluded.oppdatert;
insert into public.tema_innhold (tema_id, sammendrag, tankekart) values
  ('kjemi-1:formler-og-navnsetting', '## Kjemiske formler

En kjemisk formel viser hvilke grunnstoffer et stoff består av, og i hvilket forhold. **Molekylformelen** viser det faktiske antallet atomer i ett molekyl, for eksempel C₆H₁₂O₆ for glukose. Den **empiriske formelen** viser det enkleste heltallsforholdet mellom atomene, CH₂O for glukose. En **strukturformel** viser i tillegg hvordan atomene er bundet sammen.

I reaksjonslikninger skriver vi ofte et **tilstandssymbol** bak formelen: (s) for fast stoff, (l) for væske, (g) for gass og (aq) for løst i vann.

## Ioneforbindelser

Navnet på en ioneforbindelse består av kationet først og anionet etterpå. Kationet får samme navn som metallet, mens enkle anioner får endelsen **-id**: klorid (Cl⁻), oksid (O²⁻), sulfid (S²⁻) og nitrid (N³⁻). NaCl heter altså natriumklorid.

For å finne formelen må de positive og negative ladningene gå opp i null. Kalsium danner Ca²⁺ og klor danner Cl⁻, så det trengs to kloridioner: CaCl₂. Aluminiumoksid blir Al₂O₃, fordi 2 · (+3) + 3 · (−2) = 0.

Mange overgangsmetaller kan danne ioner med ulik ladning. Da skriver vi ladningen med **romertall** i parentes: jern(II)klorid er FeCl₂, og jern(III)klorid er FeCl₃.

## Sammensatte ioner

Noen ioner består av flere atomer. De vanligste bør du kunne utenat:

- hydroksid OH⁻, nitrat NO₃⁻, acetat CH₃COO⁻ og hydrogenkarbonat HCO₃⁻
- sulfat SO₄²⁻ og karbonat CO₃²⁻
- fosfat PO₄³⁻
- ammonium NH₄⁺, det eneste positive ionet i listen

Trengs det mer enn ett sammensatt ion i formelen, settes det i parentes. Kalsiumnitrat er Ca(NO₃)₂, og ammoniumsulfat er (NH₄)₂SO₄.

## Molekylforbindelser

Forbindelser mellom ikke-metaller får navn med **greske tallprefikser** som forteller hvor mange atomer det er av hvert slag: mono (1), di (2), tri (3), tetra (4), penta (5) og heksa (6). CO heter karbonmonoksid og CO₂ karbondioksid. Mono sløyfes foran det første grunnstoffet. Prefiksene brukes ikke for ioneforbindelser: CaCl₂ heter kalsiumklorid, ikke kalsiumdiklorid.

## Syrer og hydrater

Noen vanlige syrer har egne navn: HCl løst i vann heter **saltsyre**, HNO₃ **salpetersyre**, H₂SO₄ **svovelsyre**, H₃PO₄ **fosforsyre** og CH₃COOH **eddiksyre**.

Et **hydrat** er et salt med vannmolekyler bundet inn i krystallen. Blått kobbersulfat er kobber(II)sulfatpentahydrat, CuSO₄ · 5H₂O. Varmer du det opp, forsvinner vannet og saltet blir hvitt.', '{"label":"Formler og navnsetting","children":[{"label":"Formeltyper","children":[{"label":"Molekylformel","note":"Faktisk antall atomer, C₆H₁₂O₆"},{"label":"Empirisk formel","note":"Enkleste forhold, CH₂O"},{"label":"Strukturformel","note":"Viser bindingene"},{"label":"Tilstandssymboler","note":"(s), (l), (g), (aq)"}]},{"label":"Ioneforbindelser","children":[{"label":"Kation først","note":"Metallets navn"},{"label":"Anion etterpå","note":"Enkle anioner får -id"},{"label":"Ladningsbalanse","note":"Summen av ladningene = 0"},{"label":"Romertall","note":"Metaller med flere mulige ladninger, jern(III)"}]},{"label":"Sammensatte ioner","children":[{"label":"OH⁻","note":"Hydroksid"},{"label":"NO₃⁻","note":"Nitrat"},{"label":"SO₄²⁻","note":"Sulfat"},{"label":"CO₃²⁻","note":"Karbonat"},{"label":"HCO₃⁻","note":"Hydrogenkarbonat"},{"label":"PO₄³⁻","note":"Fosfat"},{"label":"NH₄⁺","note":"Ammonium"},{"label":"CH₃COO⁻","note":"Acetat"}]},{"label":"Molekylforbindelser","children":[{"label":"Greske prefikser","note":"Mono, di, tri, tetra, penta, heksa"},{"label":"CO","note":"Karbonmonoksid"},{"label":"CO₂","note":"Karbondioksid"},{"label":"SO₃","note":"Svoveltrioksid"},{"label":"CCl₄","note":"Karbontetraklorid"}]},{"label":"Syrer","children":[{"label":"Saltsyre","note":"HCl(aq)"},{"label":"Salpetersyre","note":"HNO₃"},{"label":"Svovelsyre","note":"H₂SO₄"},{"label":"Fosforsyre","note":"H₃PO₄"},{"label":"Eddiksyre","note":"CH₃COOH"}]},{"label":"Hydrater","children":[{"label":"Krystallvann","note":"Vann bundet inn i saltkrystallen"},{"label":"CuSO₄ · 5H₂O","note":"Kobber(II)sulfatpentahydrat, blått"}]}]}'::jsonb)
on conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;
delete from public.flashcards where tema_id = 'kjemi-1:formler-og-navnsetting';
insert into public.flashcards (tema_id, begrep, forklaring, sortering) values
  ('kjemi-1:formler-og-navnsetting', 'Molekylformel', 'Viser det faktiske antallet atomer av hvert grunnstoff i ett molekyl, for eksempel C₆H₁₂O₆.', 0),
  ('kjemi-1:formler-og-navnsetting', 'Empirisk formel', 'Viser det enkleste heltallsforholdet mellom atomene i et stoff, for eksempel CH₂O for glukose.', 1),
  ('kjemi-1:formler-og-navnsetting', 'Strukturformel', 'Viser hvilke atomer som er bundet til hverandre, og med hvilke bindinger.', 2),
  ('kjemi-1:formler-og-navnsetting', 'Tilstandssymboler', '(s) fast stoff, (l) væske, (g) gass, (aq) løst i vann.', 3),
  ('kjemi-1:formler-og-navnsetting', 'Endelsen -id', 'Brukes for enkle anioner: klorid Cl⁻, oksid O²⁻, sulfid S²⁻, nitrid N³⁻, bromid Br⁻, jodid I⁻.', 4),
  ('kjemi-1:formler-og-navnsetting', 'Romertall i navn', 'Viser ladningen på metallionet når metallet kan ha flere ladninger, for eksempel jern(III)klorid = FeCl₃.', 5),
  ('kjemi-1:formler-og-navnsetting', 'Hydroksid', 'OH⁻', 6),
  ('kjemi-1:formler-og-navnsetting', 'Nitrat', 'NO₃⁻', 7),
  ('kjemi-1:formler-og-navnsetting', 'Sulfat', 'SO₄²⁻', 8),
  ('kjemi-1:formler-og-navnsetting', 'Karbonat', 'CO₃²⁻', 9),
  ('kjemi-1:formler-og-navnsetting', 'Hydrogenkarbonat', 'HCO₃⁻', 10),
  ('kjemi-1:formler-og-navnsetting', 'Fosfat', 'PO₄³⁻', 11),
  ('kjemi-1:formler-og-navnsetting', 'Ammonium', 'NH₄⁺ – et positivt sammensatt ion.', 12),
  ('kjemi-1:formler-og-navnsetting', 'Acetat', 'CH₃COO⁻ – anionet fra eddiksyre.', 13),
  ('kjemi-1:formler-og-navnsetting', 'Permanganat', 'MnO₄⁻ – finnes i kaliumpermanganat, KMnO₄.', 14),
  ('kjemi-1:formler-og-navnsetting', 'Greske tallprefikser', 'Mono 1, di 2, tri 3, tetra 4, penta 5, heksa 6. Brukes i navn på molekylforbindelser, ikke ioneforbindelser.', 15),
  ('kjemi-1:formler-og-navnsetting', 'Karbonmonoksid', 'CO – giftig gass som dannes ved ufullstendig forbrenning.', 16),
  ('kjemi-1:formler-og-navnsetting', 'Saltsyre', 'HCl løst i vann.', 17),
  ('kjemi-1:formler-og-navnsetting', 'Salpetersyre', 'HNO₃', 18),
  ('kjemi-1:formler-og-navnsetting', 'Svovelsyre', 'H₂SO₄', 19),
  ('kjemi-1:formler-og-navnsetting', 'Fosforsyre', 'H₃PO₄', 20),
  ('kjemi-1:formler-og-navnsetting', 'Hydrat', 'Salt med vannmolekyler bundet inn i krystallen, for eksempel CuSO₄ · 5H₂O.', 21);
delete from public.quiz_sporsmal where tema_id = 'kjemi-1:formler-og-navnsetting';
insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values
  ('kjemi-1:formler-og-navnsetting', 'q01', 'flervalg', 'Hva er formelen for kalsiumklorid?', array['CaCl', 'CaCl₂', 'Ca₂Cl', 'CaCl₃']::text[], 1, 'Kalsium danner Ca²⁺ og klor danner Cl⁻. For at ladningene skal gå opp i null, trengs to kloridioner per kalsiumion.', true, true, 0),
  ('kjemi-1:formler-og-navnsetting', 'q02', 'flervalg', 'Hva heter Fe₂O₃?', array['Jernoksid(II)', 'Dijerntrioksid', 'Jern(II)oksid', 'Jern(III)oksid']::text[], 3, 'Tre oksidioner gir ladningen 3 · (−2) = −6. Den må balanseres av to jernioner med +3 hver, så det er jern(III). Greske prefikser brukes ikke for ioneforbindelser.', true, true, 1),
  ('kjemi-1:formler-og-navnsetting', 'q03', 'flervalg', 'Hva er formelen for aluminiumoksid?', array['Al₂O₃', 'AlO', 'Al₃O₂', 'AlO₃']::text[], 0, 'Aluminium danner Al³⁺ og oksygen O²⁻. Minste felles multiplum av 3 og 2 er 6: to Al³⁺ gir +6 og tre O²⁻ gir −6.', true, true, 2),
  ('kjemi-1:formler-og-navnsetting', 'q04', 'flervalg', 'Hvilket ion er sulfat?', array['SO₃²⁻', 'S²⁻', 'SO₄²⁻', 'HSO₄⁻']::text[], 2, 'Sulfat er SO₄²⁻. SO₃²⁻ heter sulfitt, S²⁻ er sulfid og HSO₄⁻ er hydrogensulfat.', true, true, 3),
  ('kjemi-1:formler-og-navnsetting', 'q05', 'flervalg', 'Hva heter SO₃?', array['Svovelsulfitt', 'Monosvoveltrioksid', 'Svoveloksid', 'Svoveltrioksid']::text[], 3, 'SO₃ er en molekylforbindelse mellom to ikke-metaller, så vi bruker greske prefikser. Tre oksygenatomer gir «trioksid», og «mono» sløyfes foran det første grunnstoffet.', true, false, 4),
  ('kjemi-1:formler-og-navnsetting', 'q06', 'flervalg', 'Hva er formelen for ammoniumkarbonat?', array['NH₄CO₃', '(NH₄)₂CO₃', 'NH₄(CO₃)₂', 'NH₃CO₃']::text[], 1, 'Ammonium er NH₄⁺ og karbonat er CO₃²⁻. Det trengs to ammoniumioner for å balansere ladningen, og de settes i parentes.', true, true, 5),
  ('kjemi-1:formler-og-navnsetting', 'q07', 'flervalg', 'Hvorfor står det romertall i navnet kobber(II)oksid, men ikke i natriumoksid?', array['Kobber er et ikke-metall', 'Natrium er mer reaktivt enn kobber', 'Kobber kan danne ioner med ulik ladning', 'Romertallet viser antall oksygenatomer']::text[], 2, 'Kobber kan danne både Cu⁺ og Cu²⁺, så navnet må vise hvilket ion det er. Natrium danner bare Na⁺, så det trengs ikke.', true, true, 6),
  ('kjemi-1:formler-og-navnsetting', 'q08', 'flervalg', 'Hva betyr tilstandssymbolet (aq)?', array['Løst i vann', 'Fast stoff', 'Gass', 'Væske']::text[], 0, '(aq) kommer av latin «aqua», vann. Stoffet er løst i vann, for eksempel NaCl(aq).', true, false, 7),
  ('kjemi-1:formler-og-navnsetting', 'q09', 'flervalg', 'Hva er formelen for natriumhydrogenkarbonat (natron)?', array['NaHCO₃', 'Na₂CO₃', 'NaHCO₂', 'Na(OH)CO₃']::text[], 0, 'Hydrogenkarbonat er HCO₃⁻ med ladning −1, så det trengs bare ett natriumion. Na₂CO₃ er natriumkarbonat.', true, true, 8),
  ('kjemi-1:formler-og-navnsetting', 'q10', 'flervalg', 'Hva heter CCl₄?', array['Karbonklorid', 'Klorkarbon', 'Karbontriklorid', 'Karbontetraklorid']::text[], 3, 'Karbon og klor er ikke-metaller, så vi bruker greske prefikser. Fire kloratomer gir «tetraklorid».', true, true, 9),
  ('kjemi-1:formler-og-navnsetting', 'q11', 'flervalg', 'Hva er den empiriske formelen for glukose, C₆H₁₂O₆?', array['C₆H₁₂O₆', 'CH₂O', 'C₂H₄O₂', 'CHO']::text[], 1, 'Alle tallene i C₆H₁₂O₆ kan deles på 6. Det enkleste heltallsforholdet er 1 : 2 : 1, altså CH₂O.', true, true, 10),
  ('kjemi-1:formler-og-navnsetting', 'q12', 'flervalg', 'Hva er formelen for magnesiumnitrid?', array['MgN', 'Mg₂N₃', 'Mg₃N₂', 'MgN₂']::text[], 2, 'Magnesium danner Mg²⁺ og nitrogen N³⁻. Tre Mg²⁺ gir +6 og to N³⁻ gir −6, så formelen blir Mg₃N₂.', true, true, 11),
  ('kjemi-1:formler-og-navnsetting', 'm01', 'flervalg', 'Hva heter HNO₃ løst i vann?', array['Saltsyre', 'Svovelsyre', 'Salpetersyre', 'Fosforsyre']::text[], 2, 'HNO₃ er salpetersyre. Saltsyre er HCl, svovelsyre H₂SO₄ og fosforsyre H₃PO₄.', false, true, 12),
  ('kjemi-1:formler-og-navnsetting', 'm02', 'sant-usant', 'Navnet på et enkelt anion ender på -id, for eksempel klorid og oksid.', array['Sant', 'Usant']::text[], 0, 'Anioner som består av ett atom, får endelsen -id: klorid, oksid, sulfid, nitrid, bromid og så videre.', false, true, 13),
  ('kjemi-1:formler-og-navnsetting', 'm03', 'flervalg', 'Hva er formelen for kaliumpermanganat?', array['KMnO₄', 'K₂MnO₄', 'KMn₂O₄', 'KMnO₃']::text[], 0, 'Permanganat er MnO₄⁻ med ladning −1, og kalium danner K⁺. Da trengs ett av hvert.', false, true, 14),
  ('kjemi-1:formler-og-navnsetting', 'm04', 'sant-usant', 'I navn på ioneforbindelser bruker vi greske tallprefikser som di- og tri-.', array['Sant', 'Usant']::text[], 1, 'Prefiksene brukes bare for molekylforbindelser mellom ikke-metaller. For ioneforbindelser følger antallet av ladningene, så CaCl₂ heter kalsiumklorid.', false, true, 15),
  ('kjemi-1:formler-og-navnsetting', 'm05', 'flervalg', 'Hvilken formel og ladning har fosfationet?', array['PO₄⁻', 'PO₄²⁻', 'PO₄³⁻', 'PO₃³⁻']::text[], 2, 'Fosfat er PO₄³⁻. Det er anionet i fosforsyre, H₃PO₄, som kan avgi tre protoner.', false, true, 16),
  ('kjemi-1:formler-og-navnsetting', 'm06', 'sant-usant', 'CuSO₄ · 5H₂O er et hydrat, der vannmolekyler er bundet inn i krystallen.', array['Sant', 'Usant']::text[], 0, 'Punktet i formelen betyr at fem vannmolekyler per formelenhet er bundet i krystallen. Når saltet varmes opp, avgis vannet.', false, true, 17),
  ('kjemi-1:formler-og-navnsetting', 'm07', 'flervalg', 'Hva heter Cu₂O?', array['Kobber(II)oksid', 'Kobber(I)oksid', 'Dikobberoksid', 'Kobberoksid(II)']::text[], 1, 'Oksid har ladning −2, og den balanseres av to kobberioner. Hvert av dem må da ha ladning +1, altså kobber(I).', false, true, 18),
  ('kjemi-1:formler-og-navnsetting', 'm08', 'flervalg', 'Hva er formelen for jern(II)sulfat?', array['Fe₂SO₄', 'Fe(SO₄)₂', 'FeSO₄', 'Fe₂(SO₄)₃']::text[], 2, 'Jern(II) er Fe²⁺ og sulfat er SO₄²⁻. Ladningene er like store, så det trengs ett av hvert. Fe₂(SO₄)₃ er jern(III)sulfat.', false, true, 19);
insert into public.miniprover (tema_id, minutter) values
  ('kjemi-1:formler-og-navnsetting', 20)
on conflict (tema_id) do update set minutter = excluded.minutter;

-- Kjemi 1: Stoffmengde og støkiometri
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('kjemi-1:stoffmengde-og-stokiometri', 'kjemi-1', 'stoffmengde-og-stokiometri', 'Stoffmengde og støkiometri', 'Mol, molar masse og balanserte reaksjonslikninger – og hvordan du regner ut hvor mye som reagerer og dannes.', array[4, 8]::int[], 3, 'sjekkes', array['Molvolum: læreverk bruker ulike standardbetingelser (22,4 L/mol ved 0 °C og 1 atm, 22,7 L/mol ved 0 °C og 1 bar, 24,5 L/mol ved 25 °C og 1 atm). Sjekk hvilke verdier læreboka og eksamensformelarket bruker.', 'Atommassene er avrundet til to desimaler (H 1,01, C 12,01, O 16,00, S 32,07). Svarene kan avvike litt i siste siffer hvis tabellen i læreboka har andre verdier.']::text[], false, now())
on conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,
  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,
  publisert = excluded.publisert, oppdatert = excluded.oppdatert;
insert into public.tema_innhold (tema_id, sammendrag, tankekart) values
  ('kjemi-1:stoffmengde-og-stokiometri', '## Mol – kjemikerens tellemål

Atomer og molekyler er så små at vi teller dem i **mol**. Én mol er 6,022 · 10²³ partikler. Dette tallet kalles **Avogadros konstant** (N_A). Stoffmengden n måles i mol, og antall partikler er N = n · N_A.

## Molar masse

**Molar masse** (M) er massen av én mol av et stoff, målt i g/mol. Du finner den ved å legge sammen atommassene fra periodesystemet. For vann blir M(H₂O) = 2 · 1,01 + 16,00 = 18,02 g/mol. Sammenhengen mellom masse, stoffmengde og molar masse er:

**n = m / M**

36,0 g vann er altså 36,0 g / 18,02 g/mol = 2,00 mol.

## Balanserte reaksjonslikninger

I en kjemisk reaksjon blir atomene omorganisert, men ingen atomer forsvinner eller oppstår. Derfor må det være like mange atomer av hvert grunnstoff på begge sider av pilen. Dette er **loven om massebevaring**. Vi balanserer ved å endre **koeffisientene** foran formlene, aldri de små tallene inne i formlene.

2H₂(g) + O₂(g) → 2H₂O(l)

Koeffisientene gir **molforholdet**: 2 mol hydrogen reagerer med 1 mol oksygen og gir 2 mol vann.

## Støkiometriske beregninger

De fleste oppgaver løses i tre trinn:

- Regn om fra masse til stoffmengde med n = m / M.
- Bruk molforholdet fra den balanserte likningen.
- Regn tilbake til masse med m = n · M.

Eksempel: Hvor mye vann dannes av 4,04 g hydrogen? n(H₂) = 4,04 g / 2,02 g/mol = 2,00 mol. Molforholdet mellom H₂ og H₂O er 1 : 1, så n(H₂O) = 2,00 mol og m(H₂O) = 2,00 mol · 18,02 g/mol = 36,0 g.

## Begrensende reaktant og utbytte

Ofte er det ikke nøyaktig nok av alle reaktantene. Stoffet som brukes opp først, er den **begrensende reaktanten**, og det bestemmer hvor mye produkt som kan dannes. Resten er i **overskudd**. Mengden produkt vi regner oss fram til, kalles det **teoretiske utbyttet**. I praksis får vi nesten alltid mindre, blant annet på grunn av søl, bireaksjoner og reaksjoner som ikke går helt fram.

**Utbytte i prosent = faktisk utbytte / teoretisk utbytte · 100 %**

## Gasser

For gasser er det ofte praktisk å regne med volum. Ved 0 °C og 1 atm har én mol av en gass et volum på omtrent 22,4 L. Ved 25 °C og 1 atm er molvolumet omtrent 24,5 L.

## Gjeldende siffer

Et svar skal ikke oppgis mer nøyaktig enn målingene det bygger på. Ved ganging og deling får svaret like mange gjeldende siffer som tallet med færrest gjeldende siffer.', '{"label":"Stoffmengde og støkiometri","children":[{"label":"Mol","children":[{"label":"Avogadros konstant","note":"6,022 · 10²³ mol⁻¹"},{"label":"Antall partikler","note":"N = n · N_A"}]},{"label":"Molar masse","children":[{"label":"g/mol","note":"Summen av atommassene"},{"label":"n = m / M","note":"Fra masse til mol"},{"label":"m = n · M","note":"Fra mol til masse"}]},{"label":"Reaksjonslikninger","children":[{"label":"Massebevaring","note":"Like mange atomer på hver side"},{"label":"Koeffisienter","note":"Endres ved balansering"},{"label":"Molforhold","note":"Gitt av koeffisientene"}]},{"label":"Beregninger","children":[{"label":"1. Masse → mol","note":"n = m / M"},{"label":"2. Molforhold","note":"Fra den balanserte likningen"},{"label":"3. Mol → masse","note":"m = n · M"}]},{"label":"Begrensende reaktant","children":[{"label":"Brukes opp først","note":"Bestemmer mengden produkt"},{"label":"Overskudd","note":"Blir til overs"}]},{"label":"Utbytte","children":[{"label":"Teoretisk","note":"Beregnet maksimum"},{"label":"Faktisk","note":"Det du får i praksis"},{"label":"Prosent","note":"Faktisk / teoretisk · 100 %"}]},{"label":"Gasser","children":[{"label":"Molvolum ved 0 °C","note":"22,4 L/mol (1 atm)"},{"label":"Molvolum ved 25 °C","note":"24,5 L/mol (1 atm)"}]},{"label":"Gjeldende siffer","children":[{"label":"Ganging og deling","note":"Færrest gjeldende siffer bestemmer"}]}]}'::jsonb)
on conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;
delete from public.flashcards where tema_id = 'kjemi-1:stoffmengde-og-stokiometri';
insert into public.flashcards (tema_id, begrep, forklaring, sortering) values
  ('kjemi-1:stoffmengde-og-stokiometri', 'Mol', 'Enheten for stoffmengde. Én mol er 6,022 · 10²³ partikler.', 0),
  ('kjemi-1:stoffmengde-og-stokiometri', 'Stoffmengde (n)', 'Mengden av et stoff målt i antall partikler, oppgitt i mol.', 1),
  ('kjemi-1:stoffmengde-og-stokiometri', 'Avogadros konstant (N_A)', '6,022 · 10²³ mol⁻¹ – antall partikler i én mol.', 2),
  ('kjemi-1:stoffmengde-og-stokiometri', 'Atommasse (u)', 'Massen av et atom i atommasseenheter. 1 u er 1/12 av massen til et karbon-12-atom.', 3),
  ('kjemi-1:stoffmengde-og-stokiometri', 'Molar masse (M)', 'Massen av én mol av et stoff, i g/mol. Summen av atommassene i formelen.', 4),
  ('kjemi-1:stoffmengde-og-stokiometri', 'n = m / M', 'Stoffmengde = masse delt på molar masse. Omformet: m = n · M.', 5),
  ('kjemi-1:stoffmengde-og-stokiometri', 'Loven om massebevaring', 'Den samlede massen er den samme før og etter en kjemisk reaksjon, fordi ingen atomer forsvinner eller oppstår.', 6),
  ('kjemi-1:stoffmengde-og-stokiometri', 'Koeffisient', 'Tallet foran en formel i en reaksjonslikning. Viser hvor mange mol (eller partikler) av stoffet som inngår.', 7),
  ('kjemi-1:stoffmengde-og-stokiometri', 'Balansert reaksjonslikning', 'Likning med like mange atomer av hvert grunnstoff og lik total ladning på begge sider av pilen.', 8),
  ('kjemi-1:stoffmengde-og-stokiometri', 'Molforhold', 'Forholdet mellom stoffmengdene i en reaksjon, gitt av koeffisientene i den balanserte likningen.', 9),
  ('kjemi-1:stoffmengde-og-stokiometri', 'Reaktant', 'Stoff som forbrukes i en reaksjon. Står til venstre for pilen.', 10),
  ('kjemi-1:stoffmengde-og-stokiometri', 'Produkt', 'Stoff som dannes i en reaksjon. Står til høyre for pilen.', 11),
  ('kjemi-1:stoffmengde-og-stokiometri', 'Støkiometri', 'Beregning av mengdeforholdene mellom stoffene som reagerer og dannes i kjemiske reaksjoner.', 12),
  ('kjemi-1:stoffmengde-og-stokiometri', 'Begrensende reaktant', 'Reaktanten som brukes opp først og dermed bestemmer hvor mye produkt som kan dannes.', 13),
  ('kjemi-1:stoffmengde-og-stokiometri', 'Overskudd', 'Reaktant som er til stede i større mengde enn det som trengs, og som blir igjen etter reaksjonen.', 14),
  ('kjemi-1:stoffmengde-og-stokiometri', 'Teoretisk utbytte', 'Den største mengden produkt som kan dannes, beregnet ut fra den begrensende reaktanten.', 15),
  ('kjemi-1:stoffmengde-og-stokiometri', 'Utbytte i prosent', 'Faktisk utbytte delt på teoretisk utbytte, ganget med 100 %.', 16),
  ('kjemi-1:stoffmengde-og-stokiometri', 'Molvolum', 'Volumet av én mol gass. Omtrent 22,4 L ved 0 °C og 1 atm, og omtrent 24,5 L ved 25 °C og 1 atm.', 17),
  ('kjemi-1:stoffmengde-og-stokiometri', 'Masseprosent', 'Massen av ett grunnstoff (eller stoff) delt på totalmassen, ganget med 100 %.', 18),
  ('kjemi-1:stoffmengde-og-stokiometri', 'Gjeldende siffer', 'Sifrene i et måltall som er sikre, pluss det første usikre. Ved ganging og deling bestemmer tallet med færrest gjeldende siffer nøyaktigheten i svaret.', 19);
delete from public.quiz_sporsmal where tema_id = 'kjemi-1:stoffmengde-og-stokiometri';
insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values
  ('kjemi-1:stoffmengde-og-stokiometri', 'q01', 'flervalg', 'Hvor mange mol er 36,0 g vann (M = 18,02 g/mol)?', array['0,500 mol', '1,00 mol', '2,00 mol', '648 mol']::text[], 2, 'n = m / M = 36,0 g / 18,02 g/mol = 2,00 mol. Svaret 648 får du hvis du ganger i stedet for å dele.', true, true, 0),
  ('kjemi-1:stoffmengde-og-stokiometri', 'q02', 'flervalg', 'Hva er den molare massen til karbondioksid, CO₂?', array['28,01 g/mol', '44,01 g/mol', '32,00 g/mol', '60,01 g/mol']::text[], 1, 'M(CO₂) = 12,01 + 2 · 16,00 = 44,01 g/mol. 28,01 g/mol er molar masse til CO.', true, true, 1),
  ('kjemi-1:stoffmengde-og-stokiometri', 'q03', 'flervalg', 'Hvor mange molekyler er det i 0,50 mol oksygengass (O₂)?', array['3,0 · 10²³', '6,0 · 10²³', '1,2 · 10²⁴', '3,0 · 10²²']::text[], 0, 'N = n · N_A = 0,50 mol · 6,022 · 10²³ mol⁻¹ = 3,0 · 10²³ molekyler. (Antall oksygenatomer er dobbelt så stort.)', true, true, 2),
  ('kjemi-1:stoffmengde-og-stokiometri', 'q04', 'flervalg', 'Hvilke koeffisienter balanserer likningen __ Al + __ O₂ → __ Al₂O₃?', array['2, 3, 1', '2, 1, 1', '4, 6, 2', '4, 3, 2']::text[], 3, '4Al + 3O₂ → 2Al₂O₃ gir 4 aluminiumatomer og 6 oksygenatomer på hver side. Med 2, 3, 1 blir det 6 oksygenatomer til venstre, men bare 3 til høyre.', true, true, 3),
  ('kjemi-1:stoffmengde-og-stokiometri', 'q05', 'flervalg', 'I reaksjonen 2H₂ + O₂ → 2H₂O: Hvor mange mol O₂ trengs for å reagere med 6 mol H₂?', array['2 mol', '3 mol', '6 mol', '12 mol']::text[], 1, 'Molforholdet H₂ : O₂ er 2 : 1. Da trengs halvparten så mange mol oksygen som hydrogen: 6 / 2 = 3 mol.', true, true, 4),
  ('kjemi-1:stoffmengde-og-stokiometri', 'q06', 'flervalg', '2 mol H₂ blandes med 2 mol O₂ og reagerer etter 2H₂ + O₂ → 2H₂O. Hva er den begrensende reaktanten?', array['O₂', 'Begge brukes opp samtidig', 'H₂', 'Vann']::text[], 2, '2 mol H₂ trenger bare 1 mol O₂. Hydrogenet brukes opp først og er begrensende, mens 1 mol O₂ blir til overs.', true, true, 5),
  ('kjemi-1:stoffmengde-og-stokiometri', 'q07', 'flervalg', 'Det teoretiske utbyttet er 20,0 g, men du får 15,0 g produkt. Hva er utbyttet i prosent?', array['75,0 %', '133 %', '25,0 %', '15,0 %']::text[], 0, 'Utbytte = 15,0 g / 20,0 g · 100 % = 75,0 %. Et utbytte over 100 % betyr at produktet er urent, for eksempel fuktig.', true, true, 6),
  ('kjemi-1:stoffmengde-og-stokiometri', 'q08', 'flervalg', 'Hva er massen av 0,250 mol natriumklorid (M = 58,44 g/mol)?', array['233,8 g', '0,00428 g', '58,4 g', '14,6 g']::text[], 3, 'm = n · M = 0,250 mol · 58,44 g/mol = 14,6 g.', true, true, 7),
  ('kjemi-1:stoffmengde-og-stokiometri', 'q09', 'flervalg', 'Hva sier loven om massebevaring?', array['Den samlede massen er den samme før og etter reaksjonen', 'Antall molekyler er det samme før og etter reaksjonen', 'Antall mol er det samme før og etter reaksjonen', 'Gasser som dannes, har ingen masse']::text[], 0, 'Atomene omorganiseres, men forsvinner ikke. Antall molekyler og antall mol kan derimot endre seg, som i 2H₂ + O₂ → 2H₂O, der 3 mol blir til 2 mol.', true, false, 8),
  ('kjemi-1:stoffmengde-og-stokiometri', 'q10', 'flervalg', 'Hvor mange masseprosent karbon er det i CO₂ (M = 44,01 g/mol)?', array['33,3 %', '27,3 %', '72,7 %', '50,0 %']::text[], 1, '12,01 g / 44,01 g · 100 % = 27,3 %. 33,3 % er andelen karbonatomer (1 av 3), men atomene har ulik masse.', true, true, 9),
  ('kjemi-1:stoffmengde-og-stokiometri', 'q11', 'flervalg', 'Hvor stort volum har 2,00 mol gass ved 0 °C og 1 atm?', array['22,4 L', '11,2 L', '44,8 L', '49,0 L']::text[], 2, 'Ved 0 °C og 1 atm er molvolumet 22,4 L/mol. V = 2,00 mol · 22,4 L/mol = 44,8 L. 49,0 L ville vært svaret ved 25 °C.', true, false, 10),
  ('kjemi-1:stoffmengde-og-stokiometri', 'q12', 'flervalg', 'Hvor mange gram CO₂ dannes når 1,00 mol metan brenner fullstendig? (CH₄ + 2O₂ → CO₂ + 2H₂O)', array['16,0 g', '22,0 g', '88,0 g', '44,0 g']::text[], 3, 'Molforholdet CH₄ : CO₂ er 1 : 1, så det dannes 1,00 mol CO₂. m = 1,00 mol · 44,01 g/mol = 44,0 g.', true, true, 11),
  ('kjemi-1:stoffmengde-og-stokiometri', 'm01', 'sant-usant', 'Én mol av et stoff inneholder omtrent 6,022 · 10²³ partikler.', array['Sant', 'Usant']::text[], 0, 'Det er Avogadros konstant, og det gjelder uansett hvilket stoff det er.', false, true, 12),
  ('kjemi-1:stoffmengde-og-stokiometri', 'm02', 'flervalg', 'Hva er den molare massen til svovelsyre, H₂SO₄?', array['49,0 g/mol', '98,1 g/mol', '96,1 g/mol', '82,1 g/mol']::text[], 1, 'M = 2 · 1,01 + 32,07 + 4 · 16,00 = 98,1 g/mol.', false, true, 13),
  ('kjemi-1:stoffmengde-og-stokiometri', 'm03', 'sant-usant', 'Koeffisientene i en balansert reaksjonslikning viser forholdet mellom antall mol av stoffene.', array['Sant', 'Usant']::text[], 0, 'Koeffisientene gir molforholdet. De gir ikke masseforholdet, fordi stoffene har ulik molar masse.', false, true, 14),
  ('kjemi-1:stoffmengde-og-stokiometri', 'm04', 'flervalg', 'Hvilken formel gir stoffmengden n ut fra masse m og molar masse M?', array['n = m · M', 'n = M / m', 'n = m / M', 'n = m + M']::text[], 2, 'Molar masse har enheten g/mol. Deler du massen i gram på g/mol, får du mol: n = m / M.', false, true, 15),
  ('kjemi-1:stoffmengde-og-stokiometri', 'm05', 'sant-usant', 'Det teoretiske utbyttet er alltid mindre enn det faktiske utbyttet.', array['Sant', 'Usant']::text[], 1, 'Det er omvendt. Det teoretiske utbyttet er det største som kan dannes, og i praksis får vi som regel mindre.', false, true, 16),
  ('kjemi-1:stoffmengde-og-stokiometri', 'm06', 'flervalg', 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O. Hvor mange mol vann dannes fra 2,0 mol propan?', array['4,0 mol', '2,0 mol', '6,0 mol', '8,0 mol']::text[], 3, 'Molforholdet C₃H₈ : H₂O er 1 : 4. Da gir 2,0 mol propan 2,0 · 4 = 8,0 mol vann.', false, true, 17),
  ('kjemi-1:stoffmengde-og-stokiometri', 'm07', 'flervalg', 'Hvor mange mol er 10,0 g kalsiumkarbonat, CaCO₃ (M = 100,1 g/mol)?', array['0,100 mol', '1,00 mol', '10,0 mol', '1001 mol']::text[], 0, 'n = m / M = 10,0 g / 100,1 g/mol = 0,0999 mol, som avrundes til 0,100 mol.', false, true, 18),
  ('kjemi-1:stoffmengde-og-stokiometri', 'm08', 'sant-usant', 'Den begrensende reaktanten er stoffet som brukes opp først og bestemmer hvor mye produkt som kan dannes.', array['Sant', 'Usant']::text[], 0, 'Når den begrensende reaktanten er brukt opp, stopper reaksjonen, selv om det er andre reaktanter igjen.', false, true, 19);
insert into public.miniprover (tema_id, minutter) values
  ('kjemi-1:stoffmengde-og-stokiometri', 20)
on conflict (tema_id) do update set minutter = excluded.minutter;

-- Kjemi 1: Reaksjonstyper og redoks
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('kjemi-1:reaksjonstyper-og-redoks', 'kjemi-1', 'reaksjonstyper-og-redoks', 'Reaksjonstyper og redoks', 'Fellingsreaksjoner, syre-base-reaksjoner og redoksreaksjoner – hvordan du kjenner dem igjen og bruker oksidasjonstall.', array[8]::int[], 4, 'utkast', array['Elektrokjemi (galvaniske celler og elektrolyse) er holdt utenfor, fordi det ikke nevnes i kompetansemålene for Kjemi 1. Sjekk mot læreboka om det likevel bør være med.', 'Løselighetsreglene er forenklede tommelfingerregler.']::text[], false, now())
on conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,
  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,
  publisert = excluded.publisert, oppdatert = excluded.oppdatert;
insert into public.tema_innhold (tema_id, sammendrag, tankekart) values
  ('kjemi-1:reaksjonstyper-og-redoks', '## Å kjenne igjen en reaksjon

Når stoffer reagerer, ser vi ofte tegn på det: det dannes et fast stoff (et **bunnfall**), det bobler av gass, fargen endres, eller blandingen blir varm eller kald. Observasjonene hjelper oss å avgjøre hvilken **reaksjonstype** det er. De tre viktigste i Kjemi 1 er fellingsreaksjoner, syre-base-reaksjoner og redoksreaksjoner.

## Fellingsreaksjoner

Når vi blander to løsninger av løselige salter, kan det dannes et **tungtløselig salt** som felles ut som bunnfall. Sølvnitrat og natriumklorid gir hvitt sølvklorid:

Ag⁺(aq) + Cl⁻(aq) → AgCl(s)

Dette er en **ionelikning**. Na⁺ og NO₃⁻ er i løsningen hele tiden uten å reagere. De kalles **tilskuerioner** og tas ikke med.

Noen tommelfingerregler: Alle nitrater og alle salter med alkalimetallioner eller ammonium er løselige. De fleste klorider er løselige, men ikke sølvklorid og blyklorid. De fleste karbonater, fosfater og hydroksider er tungtløselige. Bariumsulfat er et eksempel på et tungtløselig sulfat.

## Syre-base-reaksjoner

I en syre-base-reaksjon overføres et proton (H⁺) fra en syre til en base. Når en sterk syre reagerer med en sterk base, kalles det **nøytralisering**:

H₃O⁺(aq) + OH⁻(aq) → 2H₂O(l)

Dette lærer du mer om i temaet om syrer og baser.

## Redoksreaksjoner

I en redoksreaksjon overføres **elektroner**. **Oksidasjon** betyr at et stoff avgir elektroner, og **reduksjon** betyr at et stoff tar opp elektroner. Det ene skjer aldri uten det andre. Legger vi en sinkbit i en løsning med kobberioner, skjer dette:

Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s)

Sink oksideres og er **reduksjonsmiddel**, fordi den gir elektroner til kobberionene. Kobberionene reduseres og er **oksidasjonsmiddel**. Reaksjonen kan deles i to **halvreaksjoner**: Zn → Zn²⁺ + 2e⁻ og Cu²⁺ + 2e⁻ → Cu. Forbrenning er også en redoksreaksjon: karbonet i brenselet oksideres, og oksygenet reduseres.

## Oksidasjonstall

For å holde oversikt over elektronene bruker vi **oksidasjonstall**:

- Et grunnstoff i fri form har oksidasjonstall 0.
- Et enatomig ion har oksidasjonstall lik ladningen.
- Oksygen har vanligvis −2 og hydrogen vanligvis +1.
- Summen er 0 i en nøytral forbindelse og lik ladningen i et sammensatt ion.

Øker oksidasjonstallet, er stoffet oksidert. Minker det, er stoffet redusert. I SO₄²⁻ har svovel oksidasjonstall +6, fordi x + 4 · (−2) = −2.

## Spenningsrekka

Metaller kan ordnes etter hvor lett de avgir elektroner. **Spenningsrekka** viser at uedle metaller som sink og jern oksideres lettere enn edle metaller som kobber, sølv og gull. Et metall kan redusere ionene til et edlere metall. Derfor blir en jernspiker dekket av kobber i en løsning med kobberioner, mens en kobberbit i en løsning med jernioner forblir uforandret.', '{"label":"Reaksjonstyper og redoks","children":[{"label":"Tegn på reaksjon","children":[{"label":"Bunnfall","note":"Tyder på fellingsreaksjon"},{"label":"Gassbobler"},{"label":"Fargeendring"},{"label":"Temperaturendring","note":"Varme avgis eller tas opp"}]},{"label":"Fellingsreaksjoner","children":[{"label":"Tungtløselige salter","note":"AgCl, BaSO₄, CaCO₃"},{"label":"Ionelikning","note":"Ag⁺ + Cl⁻ → AgCl"},{"label":"Tilskuerioner","note":"Reagerer ikke"},{"label":"Løselighetsregler","note":"Nitrater og alkalimetallsalter er løselige"}]},{"label":"Syre-base-reaksjoner","children":[{"label":"Protonoverføring","note":"H⁺ fra syre til base"},{"label":"Nøytralisering","note":"H₃O⁺ + OH⁻ → 2H₂O"}]},{"label":"Redoksreaksjoner","children":[{"label":"Oksidasjon","note":"Avgir elektroner"},{"label":"Reduksjon","note":"Tar opp elektroner"},{"label":"Oksidasjonsmiddel","note":"Tar opp elektroner, blir redusert"},{"label":"Reduksjonsmiddel","note":"Gir elektroner, blir oksidert"},{"label":"Halvreaksjoner","note":"Zn → Zn²⁺ + 2e⁻"},{"label":"Forbrenning","note":"Brenselet oksideres"}]},{"label":"Oksidasjonstall","children":[{"label":"Fri form","note":"0"},{"label":"Enatomig ion","note":"Lik ladningen"},{"label":"Oksygen","note":"Vanligvis −2"},{"label":"Hydrogen","note":"Vanligvis +1"},{"label":"Summen","note":"0, eller ionets ladning"}]},{"label":"Spenningsrekka","children":[{"label":"Uedle metaller","note":"Zn, Fe – oksideres lett"},{"label":"Edle metaller","note":"Cu, Ag, Au – oksideres vanskelig"},{"label":"Metall + ioner","note":"Uedelt metall reduserer ioner av edlere metall"}]}]}'::jsonb)
on conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;
delete from public.flashcards where tema_id = 'kjemi-1:reaksjonstyper-og-redoks';
insert into public.flashcards (tema_id, begrep, forklaring, sortering) values
  ('kjemi-1:reaksjonstyper-og-redoks', 'Fellingsreaksjon', 'Reaksjon der ioner i løsning danner et tungtløselig salt som felles ut som bunnfall.', 0),
  ('kjemi-1:reaksjonstyper-og-redoks', 'Bunnfall', 'Fast stoff som dannes i en løsning og etter hvert synker til bunns.', 1),
  ('kjemi-1:reaksjonstyper-og-redoks', 'Tungtløselig salt', 'Salt som løser seg svært lite i vann, for eksempel AgCl, BaSO₄ og CaCO₃.', 2),
  ('kjemi-1:reaksjonstyper-og-redoks', 'Ionelikning', 'Reaksjonslikning som bare viser ionene og stoffene som faktisk reagerer, for eksempel Ag⁺ + Cl⁻ → AgCl.', 3),
  ('kjemi-1:reaksjonstyper-og-redoks', 'Tilskuerion', 'Ion som er til stede i løsningen, men ikke deltar i reaksjonen. Tas ikke med i ionelikningen.', 4),
  ('kjemi-1:reaksjonstyper-og-redoks', 'Syre-base-reaksjon', 'Reaksjon der et proton (H⁺) overføres fra en syre til en base.', 5),
  ('kjemi-1:reaksjonstyper-og-redoks', 'Nøytralisering', 'Reaksjon mellom en syre og en base. For sterk syre og sterk base: H₃O⁺ + OH⁻ → 2H₂O.', 6),
  ('kjemi-1:reaksjonstyper-og-redoks', 'Redoksreaksjon', 'Reaksjon der elektroner overføres fra ett stoff til et annet. Består av en oksidasjon og en reduksjon.', 7),
  ('kjemi-1:reaksjonstyper-og-redoks', 'Oksidasjon', 'Et stoff avgir elektroner. Oksidasjonstallet øker.', 8),
  ('kjemi-1:reaksjonstyper-og-redoks', 'Reduksjon', 'Et stoff tar opp elektroner. Oksidasjonstallet minker.', 9),
  ('kjemi-1:reaksjonstyper-og-redoks', 'Oksidasjonsmiddel', 'Stoff som tar opp elektroner fra et annet stoff, og som selv blir redusert.', 10),
  ('kjemi-1:reaksjonstyper-og-redoks', 'Reduksjonsmiddel', 'Stoff som gir fra seg elektroner til et annet stoff, og som selv blir oksidert.', 11),
  ('kjemi-1:reaksjonstyper-og-redoks', 'Halvreaksjon', 'Den ene halvdelen av en redoksreaksjon, med elektronene skrevet ut, for eksempel Zn → Zn²⁺ + 2e⁻.', 12),
  ('kjemi-1:reaksjonstyper-og-redoks', 'Oksidasjonstall', 'Tenkt ladning et atom ville hatt hvis alle bindingene var ioniske. Brukes for å holde styr på elektronoverføringer.', 13),
  ('kjemi-1:reaksjonstyper-og-redoks', 'Oksidasjonstall i fri form', 'Et grunnstoff som ikke er bundet til andre grunnstoffer, som Fe, O₂ eller Cl₂, har oksidasjonstall 0.', 14),
  ('kjemi-1:reaksjonstyper-og-redoks', 'Oksidasjonstall for O og H', 'Oksygen har vanligvis −2 og hydrogen vanligvis +1 i forbindelser.', 15),
  ('kjemi-1:reaksjonstyper-og-redoks', 'Summen av oksidasjonstall', 'Er 0 i en nøytral forbindelse og lik ionets ladning i et sammensatt ion.', 16),
  ('kjemi-1:reaksjonstyper-og-redoks', 'Spenningsrekka', 'Metallene ordnet etter hvor lett de avgir elektroner. Et metall kan redusere ionene til metaller som står etter det i rekka.', 17),
  ('kjemi-1:reaksjonstyper-og-redoks', 'Uedelt metall', 'Metall som lett avgir elektroner og oksideres, for eksempel sink, jern og magnesium.', 18),
  ('kjemi-1:reaksjonstyper-og-redoks', 'Edelt metall', 'Metall som vanskelig oksideres, for eksempel kobber, sølv og gull.', 19),
  ('kjemi-1:reaksjonstyper-og-redoks', 'Forbrenning', 'Redoksreaksjon der et stoff reagerer med oksygen og avgir energi. Karbonet i brenselet oksideres og oksygenet reduseres.', 20);
delete from public.quiz_sporsmal where tema_id = 'kjemi-1:reaksjonstyper-og-redoks';
insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values
  ('kjemi-1:reaksjonstyper-og-redoks', 'q01', 'flervalg', 'Du blander sølvnitrat og natriumklorid, og det dannes et hvitt bunnfall. Hvilken reaksjonstype er dette?', array['Fellingsreaksjon', 'Redoksreaksjon', 'Syre-base-reaksjon', 'Forbrenning']::text[], 0, 'Sølvioner og kloridioner danner det tungtløselige saltet sølvklorid, som felles ut som bunnfall.', true, true, 0),
  ('kjemi-1:reaksjonstyper-og-redoks', 'q02', 'flervalg', 'Hvilke ioner er tilskuerioner når AgNO₃(aq) og NaCl(aq) blandes?', array['Ag⁺ og Cl⁻', 'Na⁺ og Cl⁻', 'Ag⁺ og NO₃⁻', 'Na⁺ og NO₃⁻']::text[], 3, 'Ag⁺ og Cl⁻ reagerer og danner AgCl(s). Na⁺ og NO₃⁻ blir værende i løsningen uten å reagere.', true, true, 1),
  ('kjemi-1:reaksjonstyper-og-redoks', 'q03', 'flervalg', 'Hva er oksidasjon?', array['At et stoff tar opp elektroner', 'At et stoff avgir elektroner', 'At et stoff tar opp protoner', 'At et stoff avgir protoner']::text[], 1, 'Oksidasjon er avgivelse av elektroner, og da øker oksidasjonstallet. Overføring av protoner hører til syre-base-reaksjoner.', true, true, 2),
  ('kjemi-1:reaksjonstyper-og-redoks', 'q04', 'flervalg', 'Hva er oksidasjonstallet til svovel i sulfationet, SO₄²⁻?', array['+4', '−2', '+6', '+8']::text[], 2, 'Fire oksygenatomer gir 4 · (−2) = −8. Summen skal være ionets ladning, −2, så svovel må ha +6.', true, true, 3),
  ('kjemi-1:reaksjonstyper-og-redoks', 'q05', 'flervalg', 'I reaksjonen Zn + Cu²⁺ → Zn²⁺ + Cu: Hva er reduksjonsmiddelet?', array['Cu²⁺', 'Zn', 'Zn²⁺', 'Cu']::text[], 1, 'Sink gir fra seg to elektroner til kobberionet. Stoffet som gir fra seg elektroner, er reduksjonsmiddel, og det blir selv oksidert.', true, true, 4),
  ('kjemi-1:reaksjonstyper-og-redoks', 'q06', 'flervalg', 'Hva er oksidasjonstallet til et grunnstoff i fri form, som O₂ eller Fe?', array['0', '+1', '−2', 'Det avhenger av grunnstoffet']::text[], 0, 'Atomer i et grunnstoff i fri form er bare bundet til like atomer, så ingen trekker elektronene mer til seg. Oksidasjonstallet er alltid 0.', true, false, 5),
  ('kjemi-1:reaksjonstyper-og-redoks', 'q07', 'flervalg', 'Hvilken ionelikning viser nøytralisering mellom en sterk syre og en sterk base?', array['Na⁺ + Cl⁻ → NaCl', '2H₂ + O₂ → 2H₂O', 'Ag⁺ + Cl⁻ → AgCl', 'H₃O⁺ + OH⁻ → 2H₂O']::text[], 3, 'Syren gir H₃O⁺ og basen gir OH⁻ i løsningen. De reagerer til vann, mens de andre ionene er tilskuerioner.', true, true, 6),
  ('kjemi-1:reaksjonstyper-og-redoks', 'q08', 'flervalg', 'Hva skjer med oksidasjonstallet til et stoff som blir redusert?', array['Det øker', 'Det er uendret', 'Det minker', 'Det blir alltid 0']::text[], 2, 'Reduksjon er opptak av negativt ladde elektroner. Da blir oksidasjonstallet lavere.', true, true, 7),
  ('kjemi-1:reaksjonstyper-og-redoks', 'q09', 'flervalg', 'Hvilket av disse saltene er tungtløselig i vann?', array['NaNO₃', 'KCl', 'BaSO₄', 'NH₄Cl']::text[], 2, 'Bariumsulfat er tungtløselig. Nitrater og salter med alkalimetallioner eller ammonium er løselige.', true, false, 8),
  ('kjemi-1:reaksjonstyper-og-redoks', 'q10', 'flervalg', 'En jernspiker legges i en løsning av kobber(II)sulfat og blir dekket av kobber. Hva har skjedd?', array['Kobber er oksidert', 'Jern er oksidert og kobberioner redusert', 'Det er en fellingsreaksjon', 'Jern er redusert']::text[], 1, 'Jern er mindre edelt enn kobber og gir elektroner til Cu²⁺: Fe + Cu²⁺ → Fe²⁺ + Cu. Jern oksideres og kobberionene reduseres til kobbermetall.', true, true, 9),
  ('kjemi-1:reaksjonstyper-og-redoks', 'q11', 'flervalg', 'Hva er oksidasjonstallet til mangan i kaliumpermanganat, KMnO₄?', array['+7', '+4', '+2', '−1']::text[], 0, 'Kalium har +1 og fire oksygenatomer har til sammen −8. For at summen skal bli 0, må mangan ha +7.', true, true, 10),
  ('kjemi-1:reaksjonstyper-og-redoks', 'q12', 'flervalg', 'Hvorfor er forbrenning av metan (CH₄ + 2O₂ → CO₂ + 2H₂O) en redoksreaksjon?', array['Det dannes vann', 'Det frigjøres varme', 'Metan er en gass', 'Karbon oksideres og oksygen reduseres']::text[], 3, 'Karbon går fra −4 i CH₄ til +4 i CO₂ og blir oksidert. Oksygen går fra 0 i O₂ til −2 og blir redusert.', true, true, 11),
  ('kjemi-1:reaksjonstyper-og-redoks', 'm01', 'sant-usant', 'Oksidasjonsmiddelet tar opp elektroner og blir selv redusert.', array['Sant', 'Usant']::text[], 0, 'Oksidasjonsmiddelet oksiderer et annet stoff ved å ta elektronene fra det. Da blir det selv redusert.', false, true, 12),
  ('kjemi-1:reaksjonstyper-og-redoks', 'm02', 'flervalg', 'Hva er oksidasjonstallet til nitrogen i ammoniakk, NH₃?', array['+3', '−3', '0', '+5']::text[], 1, 'Tre hydrogenatomer har til sammen +3. Summen skal være 0, så nitrogen har −3.', false, true, 13),
  ('kjemi-1:reaksjonstyper-og-redoks', 'm03', 'sant-usant', 'Alle nitrater er løselige i vann.', array['Sant', 'Usant']::text[], 0, 'Nitrater er løselige, uansett hvilket kation de er sammen med. Derfor brukes for eksempel sølvnitrat når man vil ha sølvioner i løsning.', false, true, 14),
  ('kjemi-1:reaksjonstyper-og-redoks', 'm04', 'flervalg', 'Hvilken observasjon tyder mest på en fellingsreaksjon?', array['Løsningen blir varm', 'Det dannes gassbobler', 'Det dannes et fast stoff i løsningen', 'Løsningen lukter sterkt']::text[], 2, 'I en fellingsreaksjon dannes et tungtløselig salt som blir synlig som et fast stoff, ofte uklart eller farget, i løsningen.', false, true, 15),
  ('kjemi-1:reaksjonstyper-og-redoks', 'm05', 'flervalg', 'Hva er oksidasjonstallet til klor i HClO?', array['+1', '−1', '+3', '0']::text[], 0, 'Hydrogen har +1 og oksygen −2. For at summen skal bli 0, må klor ha +1.', false, true, 16),
  ('kjemi-1:reaksjonstyper-og-redoks', 'm06', 'sant-usant', 'I en redoksreaksjon er antall elektroner som avgis, lik antall elektroner som tas opp.', array['Sant', 'Usant']::text[], 0, 'Elektroner kan ikke forsvinne eller oppstå. Alle elektronene reduksjonsmiddelet avgir, tas opp av oksidasjonsmiddelet.', false, true, 17),
  ('kjemi-1:reaksjonstyper-og-redoks', 'm07', 'flervalg', 'Hvilken halvreaksjon viser en oksidasjon?', array['Cu²⁺ + 2e⁻ → Cu', 'Cl₂ + 2e⁻ → 2Cl⁻', 'Fe → Fe²⁺ + 2e⁻', 'O₂ + 4e⁻ → 2O²⁻']::text[], 2, 'Ved oksidasjon avgis elektroner, så elektronene står på høyre side. Jern går fra 0 til +2.', false, true, 18),
  ('kjemi-1:reaksjonstyper-og-redoks', 'm08', 'sant-usant', 'Et edelt metall som gull oksideres lettere enn et uedelt metall som sink.', array['Sant', 'Usant']::text[], 1, 'Det er omvendt. Uedle metaller som sink avgir elektroner lett, mens edle metaller som gull nesten ikke oksideres. Derfor ruster ikke gull.', false, true, 19);
insert into public.miniprover (tema_id, minutter) values
  ('kjemi-1:reaksjonstyper-og-redoks', 20)
on conflict (tema_id) do update set minutter = excluded.minutter;

-- Kjemi 1: Løsninger, konsentrasjon og løselighet
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('kjemi-1:losninger-og-konsentrasjon', 'kjemi-1', 'losninger-og-konsentrasjon', 'Løsninger, konsentrasjon og løselighet', 'Hvordan du regner med konsentrasjon, lager og fortynner løsninger, og hva som avgjør om et stoff løser seg.', array[9, 14]::int[], 5, 'utkast', array['ppm er definert som mg per kg (masse). Noen læreverk bruker mg/L for vannløsninger, som er tilnærmet det samme for fortynnede løsninger.']::text[], false, now())
on conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,
  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,
  publisert = excluded.publisert, oppdatert = excluded.oppdatert;
insert into public.tema_innhold (tema_id, sammendrag, tankekart) values
  ('kjemi-1:losninger-og-konsentrasjon', '## Løsninger

En **løsning** er en jevn blanding av et **løst stoff** og et **løsemiddel**. Når vann er løsemiddelet, kaller vi det en vandig løsning og skriver (aq) bak formelen.

## Konsentrasjon

Konsentrasjon forteller hvor mye løst stoff det er i en bestemt mengde løsning. I kjemi bruker vi oftest **stoffmengdekonsentrasjon**:

**c = n / V**

Enheten er mol/L. Løser du 0,500 mol NaCl i vann og fyller opp til 250 mL, blir c = 0,500 mol / 0,250 L = 2,00 mol/L.

Andre enheter er **masseprosent** (gram stoff per 100 gram løsning), **volumprosent** (brukes for alkohol i drikker), **g/L** og **ppm** eller **ppb** for svært små mengder. 1 ppm er 1 mg per kg, og for fortynnede vannløsninger tilsvarer det omtrent 1 mg per liter.

Salter løses som ioner. I 0,10 mol/L CaCl₂ er konsentrasjonen av kloridioner 0,20 mol/L, fordi hver formelenhet gir to Cl⁻.

## Lage og fortynne løsninger

For å lage en løsning med nøyaktig konsentrasjon veier du opp stoffet, løser det i litt vann og fyller opp til merket i en **målekolbe**. Ved **fortynning** tilsetter du mer løsemiddel. Stoffmengden av det løste stoffet endres ikke, og derfor gjelder:

**c₁ · V₁ = c₂ · V₂**

50,0 mL 2,00 mol/L saltsyre fortynnet til 500 mL gir altså 0,200 mol/L.

## Løselighet

**Løseligheten** er hvor mye av et stoff som kan løses i en bestemt mengde løsemiddel ved en gitt temperatur. En løsning som ikke kan løse mer av stoffet, er **mettet**.

Om et stoff løser seg, avhenger av kreftene mellom partiklene. Regelen **likt løser likt** sier at polare stoffer og ioneforbindelser løses i polare løsemidler som vann, mens upolare stoffer løses i upolare løsemidler som heksan. Derfor blander olje og vann seg ikke.

## Ladning og polaritet

Når et salt løses i vann, vender vannmolekylene den negative enden (oksygen) mot kationene og den positive enden (hydrogen) mot anionene. Ionene blir omgitt av vannmolekyler, eller **hydratisert**. Saltet løses bare hvis tiltrekningen fra vannet er sterk nok til å bryte opp ionegitteret. Ioner med høy ladning holdes ofte hardt i gitteret, og mange salter med toverdige eller treverdige ioner, som CaCO₃ og Ca₃(PO₄)₂, er tungtløselige.

Molekyler med OH-grupper, som etanol og sukker, løses godt i vann fordi de danner hydrogenbindinger med vannmolekylene. Jo lengre den upolare karbonkjeden er, desto dårligere løses stoffet.

## Temperatur

De fleste faste stoffer løses bedre i varmt vann enn i kaldt. For gasser er det omvendt: de løses dårligere jo varmere vannet er. Derfor mister brus kullsyren raskere når den er varm, og varmt vann inneholder mindre oksygen for fisken.', '{"label":"Løsninger og konsentrasjon","children":[{"label":"Løsninger","children":[{"label":"Løst stoff","note":"Stoffet som løses"},{"label":"Løsemiddel","note":"Oftest vann"},{"label":"Vandig løsning","note":"Skrives (aq)"}]},{"label":"Konsentrasjon","children":[{"label":"c = n / V","note":"mol/L"},{"label":"Masseprosent","note":"g per 100 g løsning"},{"label":"Volumprosent","note":"Alkohol i drikker"},{"label":"g/L","note":"Massekonsentrasjon"},{"label":"ppm og ppb","note":"Svært små mengder"},{"label":"Ionekonsentrasjon","note":"CaCl₂ gir dobbelt så mye Cl⁻"}]},{"label":"Lage løsninger","children":[{"label":"Veie opp","note":"m = n · M"},{"label":"Målekolbe","note":"Fyll opp til merket"}]},{"label":"Fortynning","children":[{"label":"c₁ · V₁ = c₂ · V₂","note":"Stoffmengden er uendret"}]},{"label":"Løselighet","children":[{"label":"Mettet løsning","note":"Kan ikke løse mer"},{"label":"Likt løser likt","note":"Polart i polart, upolart i upolart"},{"label":"Hydratisering","note":"Vannmolekyler omgir ionene"}]},{"label":"Hva påvirker løseligheten","children":[{"label":"Ladning","note":"Høy ladning gir ofte tungtløselige salter"},{"label":"Polaritet","note":"OH-grupper løses godt i vann"},{"label":"Temperatur – faste stoffer","note":"Løses oftest bedre når det er varmt"},{"label":"Temperatur – gasser","note":"Løses dårligere når det er varmt"}]}]}'::jsonb)
on conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;
delete from public.flashcards where tema_id = 'kjemi-1:losninger-og-konsentrasjon';
insert into public.flashcards (tema_id, begrep, forklaring, sortering) values
  ('kjemi-1:losninger-og-konsentrasjon', 'Løsning', 'Jevn blanding av et løst stoff og et løsemiddel.', 0),
  ('kjemi-1:losninger-og-konsentrasjon', 'Løst stoff', 'Stoffet som løses, for eksempel salt i saltvann.', 1),
  ('kjemi-1:losninger-og-konsentrasjon', 'Løsemiddel', 'Stoffet som det løste stoffet fordeles i, oftest vann.', 2),
  ('kjemi-1:losninger-og-konsentrasjon', 'Stoffmengdekonsentrasjon (c)', 'Stoffmengde per volum løsning, c = n / V. Enhet mol/L.', 3),
  ('kjemi-1:losninger-og-konsentrasjon', 'Masseprosent', 'Massen av løst stoff delt på massen av hele løsningen, ganget med 100 %.', 4),
  ('kjemi-1:losninger-og-konsentrasjon', 'Volumprosent', 'Volumet av løst stoff delt på volumet av løsningen, ganget med 100 %. Brukes for eksempel for alkohol i drikker.', 5),
  ('kjemi-1:losninger-og-konsentrasjon', 'Massekonsentrasjon', 'Massen av løst stoff per volum løsning, for eksempel g/L eller mg/L.', 6),
  ('kjemi-1:losninger-og-konsentrasjon', 'ppm', 'Parts per million, milliontedeler. 1 ppm = 1 mg per kg, omtrent 1 mg per liter for fortynnede vannløsninger.', 7),
  ('kjemi-1:losninger-og-konsentrasjon', 'ppb', 'Parts per billion, milliardtedeler. 1 ppb = 1 µg per kg. Brukes for svært små mengder, som miljøgifter.', 8),
  ('kjemi-1:losninger-og-konsentrasjon', 'Ionekonsentrasjon', 'Konsentrasjonen av hvert ion etter at et salt er løst. I 0,10 mol/L CaCl₂ er [Cl⁻] = 0,20 mol/L.', 9),
  ('kjemi-1:losninger-og-konsentrasjon', 'Målekolbe', 'Kolbe med et merke på halsen som viser et nøyaktig volum. Brukes for å lage løsninger med nøyaktig konsentrasjon.', 10),
  ('kjemi-1:losninger-og-konsentrasjon', 'Fortynning', 'Å tilsette mer løsemiddel slik at konsentrasjonen blir lavere. Stoffmengden av løst stoff er uendret.', 11),
  ('kjemi-1:losninger-og-konsentrasjon', 'c₁ · V₁ = c₂ · V₂', 'Fortynningsformelen. Stoffmengden før fortynning er lik stoffmengden etter.', 12),
  ('kjemi-1:losninger-og-konsentrasjon', 'Løselighet', 'Hvor mye av et stoff som kan løses i en gitt mengde løsemiddel ved en bestemt temperatur.', 13),
  ('kjemi-1:losninger-og-konsentrasjon', 'Mettet løsning', 'Løsning som ikke kan løse mer av stoffet ved den temperaturen.', 14),
  ('kjemi-1:losninger-og-konsentrasjon', 'Likt løser likt', 'Polare stoffer og ioneforbindelser løses i polare løsemidler, upolare stoffer i upolare løsemidler.', 15),
  ('kjemi-1:losninger-og-konsentrasjon', 'Hydratisering', 'At ioner eller polare molekyler blir omgitt av vannmolekyler når de løses i vann.', 16),
  ('kjemi-1:losninger-og-konsentrasjon', 'Polart løsemiddel', 'Løsemiddel med polare molekyler, for eksempel vann og etanol. Løser salter og polare stoffer.', 17),
  ('kjemi-1:losninger-og-konsentrasjon', 'Upolart løsemiddel', 'Løsemiddel med upolare molekyler, for eksempel heksan. Løser fett, olje og andre upolare stoffer.', 18),
  ('kjemi-1:losninger-og-konsentrasjon', 'Gassers løselighet', 'Gasser løses dårligere i vann når temperaturen øker, stikk motsatt av de fleste faste stoffer.', 19);
delete from public.quiz_sporsmal where tema_id = 'kjemi-1:losninger-og-konsentrasjon';
insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values
  ('kjemi-1:losninger-og-konsentrasjon', 'q01', 'flervalg', '0,500 mol NaCl løses i vann til 250 mL løsning. Hva er konsentrasjonen?', array['0,125 mol/L', '0,500 mol/L', '1,00 mol/L', '2,00 mol/L']::text[], 3, 'c = n / V = 0,500 mol / 0,250 L = 2,00 mol/L. Husk å gjøre om mL til L.', true, true, 0),
  ('kjemi-1:losninger-og-konsentrasjon', 'q02', 'flervalg', 'Hvor mange gram NaCl (M = 58,44 g/mol) trenger du for å lage 500 mL av en 0,100 mol/L løsning?', array['29,2 g', '2,92 g', '5,84 g', '0,0500 g']::text[], 1, 'n = c · V = 0,100 mol/L · 0,500 L = 0,0500 mol. m = n · M = 0,0500 mol · 58,44 g/mol = 2,92 g.', true, true, 1),
  ('kjemi-1:losninger-og-konsentrasjon', 'q03', 'flervalg', '50,0 mL 2,00 mol/L saltsyre fortynnes til 500 mL. Hva blir konsentrasjonen?', array['0,200 mol/L', '0,0200 mol/L', '20,0 mol/L', '1,00 mol/L']::text[], 0, 'c₂ = c₁ · V₁ / V₂ = 2,00 mol/L · 50,0 mL / 500 mL = 0,200 mol/L. Volumet ble ti ganger så stort, så konsentrasjonen ble en tidel.', true, true, 2),
  ('kjemi-1:losninger-og-konsentrasjon', 'q04', 'flervalg', 'Hva er konsentrasjonen av kloridioner i en 0,10 mol/L løsning av CaCl₂?', array['0,050 mol/L', '0,10 mol/L', '0,20 mol/L', '0,30 mol/L']::text[], 2, 'Hver formelenhet CaCl₂ gir ett Ca²⁺ og to Cl⁻. Da blir [Cl⁻] = 2 · 0,10 mol/L = 0,20 mol/L.', true, true, 3),
  ('kjemi-1:losninger-og-konsentrasjon', 'q05', 'flervalg', 'Hvorfor løses jod (I₂) dårlig i vann, men godt i heksan?', array['Jod er en ioneforbindelse', 'Jod reagerer kjemisk med heksan', 'Jod og heksan er begge upolare', 'Heksan er mer polart enn vann']::text[], 2, 'Likt løser likt. I₂ er et upolart molekyl og løses derfor i det upolare løsemiddelet heksan, men dårlig i det polare vannet.', true, true, 4),
  ('kjemi-1:losninger-og-konsentrasjon', 'q06', 'flervalg', 'Hva skjer med løseligheten til oksygengass i vann når temperaturen øker?', array['Den øker', 'Den er uendret', 'Den øker først og minker så', 'Den minker']::text[], 3, 'Gasser løses dårligere i varmt vann. Derfor kan det bli for lite oksygen for fisk i varme sommerperioder.', true, true, 5),
  ('kjemi-1:losninger-og-konsentrasjon', 'q07', 'flervalg', 'Hva er en mettet løsning?', array['En løsning som ikke kan løse mer av stoffet ved den temperaturen', 'En løsning med høy konsentrasjon', 'En løsning uten løst stoff', 'En løsning med flere løste stoffer']::text[], 0, 'En mettet løsning inneholder så mye løst stoff som det er mulig å løse ved den temperaturen. Tilsetter du mer, blir det liggende uløst.', true, false, 6),
  ('kjemi-1:losninger-og-konsentrasjon', 'q08', 'flervalg', '20 g sukker løses i 180 g vann. Hva er masseprosenten sukker i løsningen?', array['11 %', '10 %', '20 %', '90 %']::text[], 1, 'Løsningen veier 20 g + 180 g = 200 g. Masseprosent = 20 g / 200 g · 100 % = 10 %. Deler du bare på vannets masse, får du feil svar, 11 %.', true, true, 7),
  ('kjemi-1:losninger-og-konsentrasjon', 'q09', 'flervalg', 'Hvilket utstyr bør du bruke for å lage en løsning med nøyaktig konsentrasjon?', array['Begerglass', 'Målekolbe', 'Erlenmeyerkolbe', 'Reagensrør']::text[], 1, 'En målekolbe har et merke som viser et nøyaktig volum. Skalaen på begerglass og erlenmeyerkolber er bare omtrentlig.', true, false, 8),
  ('kjemi-1:losninger-og-konsentrasjon', 'q10', 'flervalg', 'Hva betyr «likt løser likt»?', array['Polare stoffer løses i polare løsemidler, og upolare i upolare', 'Alle stoffer løses best i vann', 'Like mengder stoff og løsemiddel gir best løsning', 'Salter løses best i olje']::text[], 0, 'Et stoff løses når kreftene mellom stoffet og løsemiddelet ligner kreftene i hvert av dem. Polare stoffer passer med polare løsemidler, upolare med upolare.', true, true, 9),
  ('kjemi-1:losninger-og-konsentrasjon', 'q11', 'flervalg', 'Hvorfor løses etanol (C₂H₅OH) godt i vann?', array['Etanol er en ioneforbindelse', 'Etanol er upolart', 'Etanol har lavt kokepunkt', 'OH-gruppen danner hydrogenbindinger med vann']::text[], 3, 'OH-gruppen i etanol kan danne hydrogenbindinger med vannmolekylene, og karbonkjeden er kort. Derfor blandes etanol og vann i alle forhold.', true, true, 10),
  ('kjemi-1:losninger-og-konsentrasjon', 'q12', 'flervalg', 'En vannprøve inneholder 5 mg bly per kg vann. Hva er det i ppm?', array['5 ppb', '0,5 ppm', '5 ppm', '5 %']::text[], 2, '1 ppm er 1 mg per kg, så 5 mg per kg er 5 ppm.', true, true, 11),
  ('kjemi-1:losninger-og-konsentrasjon', 'm01', 'sant-usant', 'Formelen c₁ · V₁ = c₂ · V₂ gjelder ved fortynning fordi stoffmengden av det løste stoffet ikke endres.', array['Sant', 'Usant']::text[], 0, 'Ved fortynning tilsettes bare løsemiddel. n = c · V er den samme før og etter.', false, true, 12),
  ('kjemi-1:losninger-og-konsentrasjon', 'm02', 'flervalg', 'Hvor mange mol HCl er det i 25,0 mL 0,200 mol/L saltsyre?', array['0,00500 mol', '5,00 mol', '0,0800 mol', '0,125 mol']::text[], 0, 'n = c · V = 0,200 mol/L · 0,0250 L = 0,00500 mol.', false, true, 13),
  ('kjemi-1:losninger-og-konsentrasjon', 'm03', 'sant-usant', 'De fleste faste stoffer løses bedre i varmt vann enn i kaldt vann.', array['Sant', 'Usant']::text[], 0, 'For de fleste faste stoffer øker løseligheten med temperaturen. Du kan for eksempel løse mye mer sukker i varm te enn i kald.', false, true, 14),
  ('kjemi-1:losninger-og-konsentrasjon', 'm04', 'flervalg', 'Hva er enheten for stoffmengdekonsentrasjon?', array['g/mol', 'mol/L', 'mol/g', 'L/mol']::text[], 1, 'c = n / V, altså mol delt på liter. g/mol er enheten for molar masse.', false, true, 15),
  ('kjemi-1:losninger-og-konsentrasjon', 'm05', 'sant-usant', 'Olje løser seg godt i vann fordi begge er væsker.', array['Sant', 'Usant']::text[], 1, 'Olje er upolart og vann er polart. Etter regelen likt løser likt blander de seg ikke.', false, true, 16),
  ('kjemi-1:losninger-og-konsentrasjon', 'm06', 'flervalg', '100 mL 1,0 mol/L NaOH skal fortynnes til 0,10 mol/L. Hvor mye vann må du tilsette?', array['100 mL', '1000 mL', '900 mL', '90 mL']::text[], 2, 'V₂ = c₁ · V₁ / c₂ = 1,0 · 100 mL / 0,10 = 1000 mL. Du har allerede 100 mL, så du må tilsette 900 mL vann.', false, true, 17),
  ('kjemi-1:losninger-og-konsentrasjon', 'm07', 'flervalg', 'Hva kalles det når vannmolekyler omgir ionene i en løsning?', array['Felling', 'Hydratisering', 'Nøytralisering', 'Destillasjon']::text[], 1, 'Når ioner blir omgitt av vannmolekyler, sier vi at de er hydratisert. Det er tiltrekningen mellom ionene og vannet som gjør at salter kan løses.', false, true, 18),
  ('kjemi-1:losninger-og-konsentrasjon', 'm08', 'sant-usant', 'En fortynnet vannløsning med 1 ppm av et stoff inneholder omtrent 1 mg stoff per liter.', array['Sant', 'Usant']::text[], 0, '1 ppm er 1 mg per kg. En liter fortynnet vannløsning veier omtrent 1 kg, så det blir omtrent 1 mg per liter.', false, true, 19);
insert into public.miniprover (tema_id, minutter) values
  ('kjemi-1:losninger-og-konsentrasjon', 20)
on conflict (tema_id) do update set minutter = excluded.minutter;

-- Kjemi 1: Syrer, baser og pH
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('kjemi-1:syrer-baser-og-ph', 'kjemi-1', 'syrer-baser-og-ph', 'Syrer, baser og pH', 'Protolyse, sterke og svake syrer, pH-skalaen og hvordan du regner ut pH for sterke syrer og baser.', array[15]::int[], 6, 'utkast', array['Syrekonstanten Ka er bare nevnt kvalitativt. pH-beregning for svake syrer og buffere hører vanligvis til Kjemi 2 – sjekk at avgrensningen stemmer med læreboka.']::text[], false, now())
on conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,
  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,
  publisert = excluded.publisert, oppdatert = excluded.oppdatert;
insert into public.tema_innhold (tema_id, sammendrag, tankekart) values
  ('kjemi-1:syrer-baser-og-ph', '## Syrer og baser etter Brønsted

Etter Brønsteds definisjon er en **syre** et stoff som gir fra seg et proton (H⁺), og en **base** et stoff som tar opp et proton. En reaksjon der et proton overføres, kalles en **protolyse**. Når hydrogenklorid løses i vann, gir det et proton til vannet:

HCl(g) + H₂O(l) → H₃O⁺(aq) + Cl⁻(aq)

H₃O⁺ kalles et **oksoniumion**, og det er dette ionet som gjør løsningen sur.

Når en syre har gitt fra seg et proton, blir resten en base. NH₄⁺ og NH₃ er et **korresponderende syre-base-par**, og det samme er HCl og Cl⁻. Et stoff som både kan gi fra seg og ta opp protoner, kalles en **amfolytt**. Vann er det viktigste eksemplet.

## Sterke og svake syrer

En **sterk syre** protolyseres fullstendig i vann, altså gir nesten alle syremolekylene fra seg protonet. Saltsyre, salpetersyre og svovelsyre er sterke syrer. En **svak syre**, som eddiksyre, protolyseres bare delvis, og det innstiller seg en likevekt:

CH₃COOH + H₂O ⇌ H₃O⁺ + CH₃COO⁻

Hvor svak syren er, uttrykkes med **syrekonstanten** Ka. Jo mindre Ka, desto svakere syre. Eddiksyre har Ka ≈ 1,8 · 10⁻⁵. Ved samme konsentrasjon gir en svak syre derfor høyere pH enn en sterk syre. Tilsvarende er hydroksidionet, OH⁻, en **sterk base**, mens ammoniakk er en **svak base**.

## Vann og pH

Vann protolyseres litt med seg selv: 2H₂O ⇌ H₃O⁺ + OH⁻. Ved 25 °C er produktet av konsentrasjonene alltid

**Kw = [H₃O⁺] · [OH⁻] = 1,0 · 10⁻¹⁴**

I rent vann er [H₃O⁺] = [OH⁻] = 1,0 · 10⁻⁷ mol/L. For å slippe å regne med så små tall bruker vi **pH**:

**pH = −log[H₃O⁺]**

Ved 25 °C er pH 7 nøytralt, pH under 7 surt og pH over 7 basisk. Skalaen er logaritmisk: Når pH synker med 1, blir [H₃O⁺] ti ganger så stor. Tilsvarende er pOH = −log[OH⁻], og ved 25 °C er pH + pOH = 14.

For en sterk syre er [H₃O⁺] lik syrekonsentrasjonen. 0,010 mol/L HCl gir pH = −log(0,010) = 2. For 0,0010 mol/L NaOH er pOH = 3, og da er pH = 14 − 3 = 11.

## Indikatorer

En **syre-base-indikator** er et fargestoff som skifter farge ved en bestemt pH. Bromtymolblått er gult i sur løsning og blått i basisk, mens fenolftalein er fargeløs i sur løsning og rosa i basisk. Med et **pH-meter** kan du måle pH mer nøyaktig.

## Typiske reaksjoner

Syrer reagerer med uedle metaller som magnesium og sink, og da dannes hydrogengass. Med karbonater dannes karbondioksid, som bruser. En syre og en base nøytraliserer hverandre og danner vann og et salt.', '{"label":"Syrer, baser og pH","children":[{"label":"Brønsted","children":[{"label":"Syre","note":"Protongiver"},{"label":"Base","note":"Protonmottaker"},{"label":"Protolyse","note":"Overføring av H⁺"},{"label":"Korresponderende par","note":"NH₄⁺/NH₃, HCl/Cl⁻"},{"label":"Amfolytt","note":"H₂O, HCO₃⁻"}]},{"label":"Sterke og svake","children":[{"label":"Sterke syrer","note":"HCl, HNO₃, H₂SO₄"},{"label":"Svake syrer","note":"CH₃COOH, H₂CO₃, HF"},{"label":"Sterke baser","note":"OH⁻ fra NaOH, KOH"},{"label":"Svake baser","note":"NH₃"},{"label":"Syrekonstant Ka","note":"Liten Ka = svak syre"}]},{"label":"Vann","children":[{"label":"Autoprotolyse","note":"2H₂O ⇌ H₃O⁺ + OH⁻"},{"label":"Kw","note":"1,0 · 10⁻¹⁴ ved 25 °C"}]},{"label":"pH","children":[{"label":"pH = −log[H₃O⁺]"},{"label":"Skalaen","note":"< 7 surt, 7 nøytralt, > 7 basisk"},{"label":"Logaritmisk","note":"1 pH-enhet = faktor 10"},{"label":"pOH","note":"pH + pOH = 14"}]},{"label":"Indikatorer","children":[{"label":"Bromtymolblått","note":"Gul – grønn – blå"},{"label":"Fenolftalein","note":"Fargeløs – rosa"},{"label":"pH-meter","note":"Nøyaktig måling"}]},{"label":"Reaksjoner","children":[{"label":"Med uedle metaller","note":"Gir hydrogengass"},{"label":"Med karbonater","note":"Gir karbondioksid"},{"label":"Nøytralisering","note":"Syre + base → salt + vann"}]}]}'::jsonb)
on conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;
delete from public.flashcards where tema_id = 'kjemi-1:syrer-baser-og-ph';
insert into public.flashcards (tema_id, begrep, forklaring, sortering) values
  ('kjemi-1:syrer-baser-og-ph', 'Syre (Brønsted)', 'Stoff som gir fra seg et proton (H⁺).', 0),
  ('kjemi-1:syrer-baser-og-ph', 'Base (Brønsted)', 'Stoff som tar opp et proton (H⁺).', 1),
  ('kjemi-1:syrer-baser-og-ph', 'Protolyse', 'Reaksjon der et proton overføres fra en syre til en base, for eksempel HCl + H₂O → H₃O⁺ + Cl⁻.', 2),
  ('kjemi-1:syrer-baser-og-ph', 'Oksoniumion', 'H₃O⁺ – vannmolekyl som har tatt opp et proton. Gjør løsninger sure.', 3),
  ('kjemi-1:syrer-baser-og-ph', 'Korresponderende syre-base-par', 'En syre og basen den blir når den gir fra seg et proton, for eksempel NH₄⁺/NH₃ og CH₃COOH/CH₃COO⁻.', 4),
  ('kjemi-1:syrer-baser-og-ph', 'Amfolytt', 'Stoff som både kan virke som syre og som base, for eksempel H₂O og HCO₃⁻.', 5),
  ('kjemi-1:syrer-baser-og-ph', 'Sterk syre', 'Syre som protolyseres fullstendig i vann, for eksempel HCl, HNO₃ og H₂SO₄.', 6),
  ('kjemi-1:syrer-baser-og-ph', 'Svak syre', 'Syre som bare protolyseres delvis i vann, for eksempel eddiksyre og karbonsyre.', 7),
  ('kjemi-1:syrer-baser-og-ph', 'Sterk base', 'Base som tar opp protoner fullstendig. Hydroksidionet, OH⁻, fra for eksempel NaOH og KOH.', 8),
  ('kjemi-1:syrer-baser-og-ph', 'Svak base', 'Base som bare delvis tar opp protoner fra vann, for eksempel ammoniakk (NH₃).', 9),
  ('kjemi-1:syrer-baser-og-ph', 'Syrekonstant (Ka)', 'Likevektskonstanten for protolysen av en syre. Jo mindre Ka, desto svakere syre.', 10),
  ('kjemi-1:syrer-baser-og-ph', 'Autoprotolyse', 'Vann protolyseres litt med seg selv: 2H₂O ⇌ H₃O⁺ + OH⁻.', 11),
  ('kjemi-1:syrer-baser-og-ph', 'Kw', 'Vannets ionekonstant: [H₃O⁺] · [OH⁻] = 1,0 · 10⁻¹⁴ ved 25 °C.', 12),
  ('kjemi-1:syrer-baser-og-ph', 'pH', 'pH = −log[H₃O⁺]. Under 7 er surt, 7 er nøytralt og over 7 er basisk (ved 25 °C).', 13),
  ('kjemi-1:syrer-baser-og-ph', 'pOH', 'pOH = −log[OH⁻]. Ved 25 °C er pH + pOH = 14.', 14),
  ('kjemi-1:syrer-baser-og-ph', 'Nøytral løsning', 'Løsning der [H₃O⁺] = [OH⁻]. Ved 25 °C er pH = 7.', 15),
  ('kjemi-1:syrer-baser-og-ph', 'Logaritmisk skala', 'Når pH endres med 1, endres [H₃O⁺] med en faktor 10.', 16),
  ('kjemi-1:syrer-baser-og-ph', 'Syre-base-indikator', 'Fargestoff som skifter farge ved en bestemt pH.', 17),
  ('kjemi-1:syrer-baser-og-ph', 'Bromtymolblått', 'Indikator som er gul i sur løsning, grønn nær nøytral og blå i basisk løsning.', 18),
  ('kjemi-1:syrer-baser-og-ph', 'Fenolftalein', 'Indikator som er fargeløs i sur og nøytral løsning og rosa i basisk løsning.', 19),
  ('kjemi-1:syrer-baser-og-ph', 'Syre + uedelt metall', 'Gir et salt og hydrogengass, for eksempel Mg + 2HCl → MgCl₂ + H₂.', 20),
  ('kjemi-1:syrer-baser-og-ph', 'Syre + karbonat', 'Gir et salt, vann og karbondioksid, som bruser.', 21);
delete from public.quiz_sporsmal where tema_id = 'kjemi-1:syrer-baser-og-ph';
insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values
  ('kjemi-1:syrer-baser-og-ph', 'q01', 'flervalg', 'Hva er en syre ifølge Brønsted?', array['En protonmottaker', 'En protongiver', 'En elektrongiver', 'Et stoff som inneholder OH⁻']::text[], 1, 'En Brønsted-syre gir fra seg et proton (H⁺) til en base. Basen er protonmottakeren.', true, true, 0),
  ('kjemi-1:syrer-baser-og-ph', 'q02', 'flervalg', 'Hva er pH i 0,010 mol/L saltsyre?', array['1', '12', '2', '0,010']::text[], 2, 'Saltsyre er en sterk syre, så [H₃O⁺] = 0,010 mol/L. pH = −log(0,010) = 2.', true, true, 1),
  ('kjemi-1:syrer-baser-og-ph', 'q03', 'flervalg', 'Hva er den korresponderende basen til ammoniumionet, NH₄⁺?', array['NH₃', 'NH₄OH', 'NH₂⁻', 'H₃O⁺']::text[], 0, 'Når NH₄⁺ gir fra seg et proton, blir det igjen NH₃. De to utgjør et korresponderende syre-base-par.', true, true, 2),
  ('kjemi-1:syrer-baser-og-ph', 'q04', 'flervalg', 'Løsning A har pH 3 og løsning B har pH 5. Hvor mange ganger større er [H₃O⁺] i A enn i B?', array['2', '15', '20', '100']::text[], 3, 'pH-skalaen er logaritmisk. En forskjell på 2 pH-enheter betyr en faktor 10 · 10 = 100.', true, true, 3),
  ('kjemi-1:syrer-baser-og-ph', 'q05', 'flervalg', 'Hva er pH i 0,0010 mol/L NaOH ved 25 °C?', array['3', '7', '10', '11']::text[], 3, '[OH⁻] = 0,0010 mol/L gir pOH = 3. Ved 25 °C er pH = 14 − pOH = 11.', true, true, 4),
  ('kjemi-1:syrer-baser-og-ph', 'q06', 'flervalg', 'Hvorfor har 0,10 mol/L eddiksyre høyere pH enn 0,10 mol/L saltsyre?', array['Eddiksyre er en svak syre som bare protolyseres delvis', 'Eddiksyre er egentlig en base', 'Eddiksyre har større molar masse', 'Saltsyre inneholder mindre vann']::text[], 0, 'Bare en liten del av eddiksyremolekylene gir fra seg protonet, så [H₃O⁺] blir mye lavere enn i saltsyre med samme konsentrasjon. Lavere [H₃O⁺] gir høyere pH.', true, true, 5),
  ('kjemi-1:syrer-baser-og-ph', 'q07', 'flervalg', 'Hvilket av disse stoffene er en amfolytt?', array['HCl', 'NaOH', 'H₂O', 'Cl⁻']::text[], 2, 'Vann kan gi fra seg et proton og bli OH⁻, eller ta opp et proton og bli H₃O⁺. Det virker altså både som syre og som base.', true, false, 6),
  ('kjemi-1:syrer-baser-og-ph', 'q08', 'flervalg', 'Hva er [H₃O⁺] i en løsning med pH 4?', array['4 mol/L', '1,0 · 10⁻⁴ mol/L', '1,0 · 10⁻¹⁰ mol/L', '0,4 mol/L']::text[], 1, '[H₃O⁺] = 10 opphøyd i −pH, altså 10⁻⁴ mol/L. 1,0 · 10⁻¹⁰ mol/L er [OH⁻] i den samme løsningen.', true, true, 7),
  ('kjemi-1:syrer-baser-og-ph', 'q09', 'flervalg', 'Hva er verdien av vannets ionekonstant, Kw, ved 25 °C?', array['1,0 · 10⁻¹⁴', '1,0 · 10⁻⁷', '7', '14']::text[], 0, 'Kw = [H₃O⁺] · [OH⁻] = 1,0 · 10⁻¹⁴ ved 25 °C. I rent vann er hver av konsentrasjonene 1,0 · 10⁻⁷ mol/L.', true, true, 8),
  ('kjemi-1:syrer-baser-og-ph', 'q10', 'flervalg', 'Bromtymolblått blir gult i en løsning. Hva sier det om løsningen?', array['Den er basisk', 'Den er nøytral', 'Den inneholder et metall', 'Den er sur']::text[], 3, 'Bromtymolblått er gult i sur løsning, grønt rundt nøytral og blått i basisk løsning.', true, false, 9),
  ('kjemi-1:syrer-baser-og-ph', 'q11', 'flervalg', 'Hvilken av disse syrene er en sterk syre?', array['Eddiksyre', 'Salpetersyre', 'Karbonsyre', 'Flussyre (HF)']::text[], 1, 'Salpetersyre, HNO₃, protolyseres fullstendig i vann. Eddiksyre, karbonsyre og flussyre er svake syrer.', true, true, 10),
  ('kjemi-1:syrer-baser-og-ph', 'q12', 'flervalg', 'Hvilken gass dannes når saltsyre reagerer med magnesium?', array['Oksygen', 'Karbondioksid', 'Hydrogen', 'Klor']::text[], 2, 'Mg + 2HCl → MgCl₂ + H₂. Magnesium er et uedelt metall som reduserer H⁺ til hydrogengass.', true, true, 11),
  ('kjemi-1:syrer-baser-og-ph', 'm01', 'sant-usant', 'En base er et stoff som tar opp protoner.', array['Sant', 'Usant']::text[], 0, 'Etter Brønsteds definisjon er en base en protonmottaker, for eksempel NH₃, som tar opp H⁺ og blir NH₄⁺.', false, true, 12),
  ('kjemi-1:syrer-baser-og-ph', 'm02', 'flervalg', 'Hvilken likning viser protolysen av hydrogenklorid i vann?', array['HCl + H₂O → H₃O⁺ + Cl⁻', 'HCl + H₂O → HClO + H₂', 'HCl + H₂O → OH⁻ + H₂Cl⁺', 'HCl → H + Cl']::text[], 0, 'HCl gir et proton til vannmolekylet. Da dannes oksoniumionet H₃O⁺ og kloridionet Cl⁻.', false, true, 13),
  ('kjemi-1:syrer-baser-og-ph', 'm03', 'sant-usant', 'Ved 25 °C er pH + pOH = 14.', array['Sant', 'Usant']::text[], 0, 'Det følger av Kw = [H₃O⁺] · [OH⁻] = 1,0 · 10⁻¹⁴. Tar du −log på begge sider, får du pH + pOH = 14.', false, true, 14),
  ('kjemi-1:syrer-baser-og-ph', 'm04', 'flervalg', 'Hva er den korresponderende syren til hydroksidionet, OH⁻?', array['O²⁻', 'H₃O⁺', 'H₂O', 'H₂O₂']::text[], 2, 'Når OH⁻ tar opp et proton, blir det H₂O. Vann er altså den korresponderende syren til OH⁻.', false, true, 15),
  ('kjemi-1:syrer-baser-og-ph', 'm05', 'sant-usant', 'En løsning med pH 9 er sur.', array['Sant', 'Usant']::text[], 1, 'pH over 7 betyr at løsningen er basisk (ved 25 °C). Sure løsninger har pH under 7.', false, true, 16),
  ('kjemi-1:syrer-baser-og-ph', 'm06', 'flervalg', 'Hva er pH i en løsning der [H₃O⁺] = 1,0 · 10⁻⁹ mol/L?', array['9', '5', '−9', '14']::text[], 0, 'pH = −log(1,0 · 10⁻⁹) = 9. Løsningen er basisk.', false, true, 17),
  ('kjemi-1:syrer-baser-og-ph', 'm07', 'flervalg', 'Hvilken indikator er fargeløs i sur løsning og rosa i basisk?', array['Bromtymolblått', 'Lakmus', 'Metyloransje', 'Fenolftalein']::text[], 3, 'Fenolftalein er fargeløs under omtrent pH 8 og blir rosa i basisk løsning. Den brukes mye ved titrering av syre med sterk base.', false, true, 18),
  ('kjemi-1:syrer-baser-og-ph', 'm08', 'sant-usant', 'Ammoniakk, NH₃, er en svak base.', array['Sant', 'Usant']::text[], 0, 'Bare en liten del av ammoniakkmolekylene tar opp et proton fra vann: NH₃ + H₂O ⇌ NH₄⁺ + OH⁻.', false, true, 19);
insert into public.miniprover (tema_id, minutter) values
  ('kjemi-1:syrer-baser-og-ph', 20)
on conflict (tema_id) do update set minutter = excluded.minutter;

-- Kjemi 1: Energi og entalpi
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('kjemi-1:energi-og-entalpi', 'kjemi-1', 'energi-og-entalpi', 'Energi og entalpi', 'Eksoterme og endoterme reaksjoner, entalpiendring, bindingsenergi, Hess'' lov og kalorimetri.', array[4, 12]::int[], 7, 'utkast', array['Bindingsenergiene er gjennomsnittsverdier. Tabellen i læreboka kan ha verdier som avviker med noen kJ/mol.', 'Entropi og Gibbs fri energi er utelatt, fordi kompetansemålet bare nevner entalpi. Sjekk mot læreboka.']::text[], false, now())
on conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,
  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,
  publisert = excluded.publisert, oppdatert = excluded.oppdatert;
insert into public.tema_innhold (tema_id, sammendrag, tankekart) values
  ('kjemi-1:energi-og-entalpi', '## Energi i kjemiske reaksjoner

Alle kjemiske reaksjoner gir energiendringer. Det må tilføres energi for å bryte bindingene i reaktantene, og det frigjøres energi når nye bindinger dannes i produktene. Om reaksjonen totalt avgir eller tar opp energi, avhenger av hvilke bindinger som er sterkest.

## Entalpi

**Entalpi** (H) er et mål på den kjemiske energien i et stoff ved konstant trykk. Vi kan ikke måle H direkte, men vi kan måle **entalpiendringen** i en reaksjon:

**ΔH = H(produkter) − H(reaktanter)**

- I en **eksoterm** reaksjon avgis varme til omgivelsene, som blir varmere. Produktene har lavere entalpi enn reaktantene, og ΔH er negativ.
- I en **endoterm** reaksjon tas varme opp fra omgivelsene, som blir kaldere. ΔH er positiv.

Forbrenning og nøytralisering er eksoterme. Fotosyntese og oppløsning av ammoniumnitrat i vann, som i kuldeposer, er endoterme.

## Termokjemiske likninger

En termokjemisk likning viser ΔH sammen med reaksjonslikningen:

CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(l)   ΔH = −890 kJ

ΔH gjelder for stoffmengdene i likningen. Brenner 2 mol metan, avgis 1780 kJ. Snur vi likningen, skifter ΔH fortegn.

## Bindingsenergi

Med gjennomsnittlige **bindingsenergier** kan vi anslå ΔH: energien som trengs for å bryte bindingene, minus energien som frigjøres når de nye bindingene dannes. For H₂ + Cl₂ → 2HCl brytes én H–H-binding (436 kJ/mol) og én Cl–Cl-binding (242 kJ/mol), og det dannes to H–Cl-bindinger (431 kJ/mol hver). Da blir ΔH ≈ 678 kJ − 862 kJ = −184 kJ, og reaksjonen er eksoterm.

## Hess'' lov

**Hess'' lov** sier at entalpiendringen for en reaksjon er den samme uansett hvilken vei reaksjonen går. Derfor kan vi snu, gange opp og legge sammen kjente termokjemiske likninger for å finne ΔH for reaksjoner som er vanskelige å måle direkte.

**Standard dannelsesentalpi** (ΔHf°) er entalpiendringen når 1 mol av et stoff dannes fra grunnstoffene i standardtilstand. For grunnstoffer i standardtilstand er den 0. Da gjelder:

**ΔH° = ΣΔHf°(produkter) − ΣΔHf°(reaktanter)**

## Kalorimetri

I et **kalorimeter** måler vi temperaturendringen i vann og regner ut hvor mye varme som er avgitt eller tatt opp:

**q = m · c · ΔT**

For vann er c = 4,18 J/(g · °C). Blir 100 g vann 5,0 °C varmere, har vannet tatt opp 100 g · 4,18 J/(g · °C) · 5,0 °C = 2090 J, altså 2,09 kJ. Deler vi på stoffmengden som reagerte, får vi ΔH i kJ/mol. Husk fortegnet: varmer reaksjonen opp vannet, er den eksoterm og ΔH negativ.', '{"label":"Energi og entalpi","children":[{"label":"Bindinger","children":[{"label":"Bryte bindinger","note":"Krever energi"},{"label":"Danne bindinger","note":"Frigjør energi"}]},{"label":"Entalpi","children":[{"label":"H","note":"Kjemisk energi ved konstant trykk"},{"label":"ΔH","note":"H(produkter) − H(reaktanter)"},{"label":"Entalpidiagram","note":"Viser nivåene før og etter"}]},{"label":"Eksoterm og endoterm","children":[{"label":"Eksoterm","note":"ΔH < 0, avgir varme","children":[{"label":"Forbrenning"},{"label":"Nøytralisering"}]},{"label":"Endoterm","note":"ΔH > 0, tar opp varme","children":[{"label":"Fotosyntese"},{"label":"Kuldepose"}]}]},{"label":"Termokjemiske likninger","children":[{"label":"Snu likningen","note":"ΔH skifter fortegn"},{"label":"Gange likningen","note":"ΔH ganges likt"}]},{"label":"Beregne ΔH","children":[{"label":"Bindingsenergier","note":"Brutt − dannet"},{"label":"Hess'' lov","note":"Samme ΔH uansett vei"},{"label":"Dannelsesentalpier","note":"Produkter − reaktanter"}]},{"label":"Kalorimetri","children":[{"label":"q = m · c · ΔT"},{"label":"c for vann","note":"4,18 J/(g · °C)"},{"label":"ΔH per mol","note":"Varme delt på stoffmengde"}]}]}'::jsonb)
on conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;
delete from public.flashcards where tema_id = 'kjemi-1:energi-og-entalpi';
insert into public.flashcards (tema_id, begrep, forklaring, sortering) values
  ('kjemi-1:energi-og-entalpi', 'Entalpi (H)', 'Mål på den kjemiske energien i et stoff ved konstant trykk. Bare endringen, ΔH, kan måles.', 0),
  ('kjemi-1:energi-og-entalpi', 'Entalpiendring (ΔH)', 'ΔH = H(produkter) − H(reaktanter). Oppgis i kJ eller kJ/mol.', 1),
  ('kjemi-1:energi-og-entalpi', 'Eksoterm reaksjon', 'Reaksjon som avgir varme til omgivelsene. ΔH < 0.', 2),
  ('kjemi-1:energi-og-entalpi', 'Endoterm reaksjon', 'Reaksjon som tar opp varme fra omgivelsene. ΔH > 0.', 3),
  ('kjemi-1:energi-og-entalpi', 'System og omgivelser', 'Systemet er stoffene som reagerer. Omgivelsene er alt rundt, for eksempel vannet og begeret.', 4),
  ('kjemi-1:energi-og-entalpi', 'Termokjemisk likning', 'Balansert reaksjonslikning med tilstandssymboler og ΔH for stoffmengdene i likningen.', 5),
  ('kjemi-1:energi-og-entalpi', 'Å bryte bindinger', 'Krever alltid energi – er endotermt.', 6),
  ('kjemi-1:energi-og-entalpi', 'Å danne bindinger', 'Frigjør alltid energi – er eksotermt.', 7),
  ('kjemi-1:energi-og-entalpi', 'Bindingsenergi', 'Energien som trengs for å bryte 1 mol av en bestemt binding i gassfase, for eksempel 436 kJ/mol for H–H.', 8),
  ('kjemi-1:energi-og-entalpi', 'ΔH fra bindingsenergier', 'ΔH ≈ sum av bindingsenergier som brytes − sum av bindingsenergier som dannes.', 9),
  ('kjemi-1:energi-og-entalpi', 'Entalpidiagram', 'Diagram som viser entalpien til reaktanter og produkter. Ved eksoterm reaksjon ligger produktene lavest.', 10),
  ('kjemi-1:energi-og-entalpi', 'Hess'' lov', 'ΔH for en reaksjon er den samme uansett hvilken vei eller hvor mange trinn reaksjonen går i.', 11),
  ('kjemi-1:energi-og-entalpi', 'Snu en termokjemisk likning', 'ΔH skifter fortegn.', 12),
  ('kjemi-1:energi-og-entalpi', 'Gange en termokjemisk likning', 'ΔH ganges med det samme tallet.', 13),
  ('kjemi-1:energi-og-entalpi', 'Standard dannelsesentalpi (ΔHf°)', 'Entalpiendringen når 1 mol av et stoff dannes fra grunnstoffene i standardtilstand. Er 0 for grunnstoffer i standardtilstand.', 14),
  ('kjemi-1:energi-og-entalpi', 'Forbrenningsentalpi', 'ΔH når 1 mol av et stoff brenner fullstendig i oksygen. Alltid negativ.', 15),
  ('kjemi-1:energi-og-entalpi', 'Kalorimeter', 'Isolert beholder der man måler temperaturendringen i vann for å bestemme varmen i en reaksjon.', 16),
  ('kjemi-1:energi-og-entalpi', 'q = m · c · ΔT', 'Varme = masse · spesifikk varmekapasitet · temperaturendring.', 17),
  ('kjemi-1:energi-og-entalpi', 'Spesifikk varmekapasitet (c)', 'Varmen som trengs for å varme 1 g av et stoff 1 °C. For vann er c = 4,18 J/(g · °C).', 18),
  ('kjemi-1:energi-og-entalpi', 'Kuldepose', 'Pose der et salt, for eksempel ammoniumnitrat, løses i vann i en endoterm prosess, slik at posen blir kald.', 19);
delete from public.quiz_sporsmal where tema_id = 'kjemi-1:energi-og-entalpi';
insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values
  ('kjemi-1:energi-og-entalpi', 'q01', 'flervalg', 'Hva betyr det at ΔH for en reaksjon er negativ?', array['Reaksjonen er endoterm og tar opp varme', 'Reaksjonen kan ikke skje', 'Reaksjonen er eksoterm og avgir varme', 'Temperaturen i omgivelsene synker']::text[], 2, 'Negativ ΔH betyr at produktene har lavere entalpi enn reaktantene. Forskjellen avgis som varme, og omgivelsene blir varmere.', true, true, 0),
  ('kjemi-1:energi-og-entalpi', 'q02', 'flervalg', 'Hva skjer energimessig når kjemiske bindinger brytes?', array['Det krever energi', 'Det frigjøres energi', 'Det skjer ingen energiendring', 'Det dannes nye atomer']::text[], 0, 'Atomene i en binding tiltrekker hverandre, så det må tilføres energi for å skille dem. Energi frigjøres først når nye bindinger dannes.', true, false, 1),
  ('kjemi-1:energi-og-entalpi', 'q03', 'flervalg', 'Et salt løses i vann, og begerglasset blir kaldt. Hva slags prosess er dette?', array['Eksoterm, ΔH < 0', 'Verken eksoterm eller endoterm', 'En redoksreaksjon', 'Endoterm, ΔH > 0']::text[], 3, 'Prosessen tar opp varme fra omgivelsene, altså fra vannet og glasset, som derfor blir kalde. Det er endotermt, og ΔH er positiv.', true, true, 2),
  ('kjemi-1:energi-og-entalpi', 'q04', 'flervalg', 'CH₄ + 2O₂ → CO₂ + 2H₂O, ΔH = −890 kJ. Hvor mye varme avgis når 2 mol metan brenner?', array['890 kJ', '1780 kJ', '445 kJ', '3560 kJ']::text[], 1, 'ΔH gjelder for 1 mol metan, slik likningen står. Dobbelt så mye metan gir dobbelt så mye varme: 2 · 890 kJ = 1780 kJ.', true, true, 3),
  ('kjemi-1:energi-og-entalpi', 'q05', 'flervalg', '100 g vann blir 5,0 °C varmere. Hvor mye varme har vannet tatt opp? (c = 4,18 J/(g · °C))', array['2,09 kJ', '20,9 kJ', '0,418 kJ', '2090 kJ']::text[], 0, 'q = m · c · ΔT = 100 g · 4,18 J/(g · °C) · 5,0 °C = 2090 J = 2,09 kJ.', true, true, 4),
  ('kjemi-1:energi-og-entalpi', 'q06', 'flervalg', 'Reaksjonen A → B har ΔH = −100 kJ. Hva er ΔH for B → A?', array['−100 kJ', '0 kJ', '+100 kJ', '−200 kJ']::text[], 2, 'Når en likning snus, skifter ΔH fortegn. Den energien som avgis den ene veien, må tilføres den andre veien.', true, true, 5),
  ('kjemi-1:energi-og-entalpi', 'q07', 'flervalg', 'Hva sier Hess'' lov?', array['Energi kan verken skapes eller forsvinne', 'Reaksjonsfarten øker med temperaturen', 'Varmen i en reaksjon avhenger av hvilken vei den går', 'ΔH er den samme uansett hvilken vei reaksjonen går']::text[], 3, 'Entalpi er en tilstandsfunksjon: ΔH avhenger bare av start og slutt, ikke av mellomtrinnene. Derfor kan termokjemiske likninger legges sammen.', true, true, 6),
  ('kjemi-1:energi-og-entalpi', 'q08', 'flervalg', 'Bindingsenergier: H–H 436 kJ/mol, Cl–Cl 242 kJ/mol, H–Cl 431 kJ/mol. Hva er omtrent ΔH for H₂ + Cl₂ → 2HCl?', array['+247 kJ', '−184 kJ', '−247 kJ', '+184 kJ']::text[], 1, 'Bindinger som brytes: 436 + 242 = 678 kJ. Bindinger som dannes: 2 · 431 = 862 kJ. ΔH ≈ 678 − 862 = −184 kJ.', true, true, 7),
  ('kjemi-1:energi-og-entalpi', 'q09', 'flervalg', 'Hvilken av disse prosessene er endoterm?', array['Forbrenning av ved', 'Nøytralisering av syre med base', 'Kondensasjon av vanndamp', 'Fotosyntese']::text[], 3, 'I fotosyntesen tas energi fra sollyset opp og lagres i glukose. Forbrenning, nøytralisering og kondensasjon avgir varme.', true, false, 8),
  ('kjemi-1:energi-og-entalpi', 'q10', 'flervalg', 'Hva er standard dannelsesentalpi for oksygengass, O₂(g)?', array['−286 kJ/mol', '0 kJ/mol', '+100 kJ/mol', 'Den kan ikke bestemmes']::text[], 1, 'O₂(g) er et grunnstoff i standardtilstand. Da skal ingenting dannes, og dannelsesentalpien er per definisjon 0.', true, true, 9),
  ('kjemi-1:energi-og-entalpi', 'q11', 'flervalg', 'Hvorfor er forbrenning eksoterm?', array['Det trengs energi for å tenne på', 'Det dannes gasser', 'Bindingene som dannes, er sterkere enn bindingene som brytes', 'Oksygen er et grunnstoff']::text[], 2, 'Når bindingene i CO₂ og H₂O dannes, frigjøres mer energi enn det som trengs for å bryte bindingene i brenselet og oksygenet. Overskuddet avgis som varme.', true, true, 10),
  ('kjemi-1:energi-og-entalpi', 'q12', 'flervalg', '0,050 mol av et stoff reagerer i et kalorimeter og avgir 2,5 kJ. Hva er ΔH per mol?', array['−50 kJ/mol', '+50 kJ/mol', '−0,125 kJ/mol', '−125 kJ/mol']::text[], 0, '2,5 kJ / 0,050 mol = 50 kJ/mol. Reaksjonen avgir varme, så ΔH er negativ: −50 kJ/mol.', true, true, 11),
  ('kjemi-1:energi-og-entalpi', 'm01', 'sant-usant', 'I en eksoterm reaksjon har produktene lavere entalpi enn reaktantene.', array['Sant', 'Usant']::text[], 0, 'Energien som avgis til omgivelsene, er forskjellen mellom reaktantenes og produktenes entalpi. Derfor er ΔH negativ.', false, true, 12),
  ('kjemi-1:energi-og-entalpi', 'm02', 'flervalg', 'C + O₂ → CO₂ har ΔH = −394 kJ, og CO + ½O₂ → CO₂ har ΔH = −283 kJ. Hva er ΔH for C + ½O₂ → CO?', array['−677 kJ', '−111 kJ', '+111 kJ', '−394 kJ']::text[], 1, 'Snu den andre likningen (CO₂ → CO + ½O₂, ΔH = +283 kJ) og legg den til den første: −394 kJ + 283 kJ = −111 kJ.', false, true, 13),
  ('kjemi-1:energi-og-entalpi', 'm03', 'sant-usant', 'Det krever energi å danne kjemiske bindinger.', array['Sant', 'Usant']::text[], 1, 'Det er omvendt. Å danne bindinger frigjør energi, mens å bryte dem krever energi.', false, true, 14),
  ('kjemi-1:energi-og-entalpi', 'm04', 'flervalg', 'Hvilken enhet har spesifikk varmekapasitet?', array['J/(g · °C)', 'kJ/mol', 'J · g', '°C/J']::text[], 0, 'Spesifikk varmekapasitet er varmen per gram per grad, altså J/(g · °C). For vann er den 4,18 J/(g · °C).', false, true, 15),
  ('kjemi-1:energi-og-entalpi', 'm05', 'sant-usant', 'En kuldepose virker fordi et salt løses i vann i en endoterm prosess.', array['Sant', 'Usant']::text[], 0, 'Når for eksempel ammoniumnitrat løses i vann, tas varme opp fra omgivelsene. Posen og det den ligger mot, blir kalde.', false, true, 16),
  ('kjemi-1:energi-og-entalpi', 'm06', 'flervalg', 'Hvor ligger produktene i et entalpidiagram for en endoterm reaksjon?', array['Lavere enn reaktantene', 'På samme nivå som reaktantene', 'Høyere enn reaktantene', 'Alltid under null']::text[], 2, 'I en endoterm reaksjon tas energi opp, så produktene får høyere entalpi enn reaktantene.', false, true, 17),
  ('kjemi-1:energi-og-entalpi', 'm07', 'flervalg', '200 g vann blir 3,0 °C varmere. Hvor mye varme er tatt opp? (c = 4,18 J/(g · °C))', array['25 kJ', '0,60 kJ', '250 kJ', '2,5 kJ']::text[], 3, 'q = 200 g · 4,18 J/(g · °C) · 3,0 °C = 2508 J ≈ 2,5 kJ.', false, true, 18),
  ('kjemi-1:energi-og-entalpi', 'm08', 'sant-usant', 'Hvis en termokjemisk likning ganges med 2, blir også ΔH dobbelt så stor.', array['Sant', 'Usant']::text[], 0, 'Dobbelt så store stoffmengder gir dobbelt så stor energiendring.', false, true, 19);
insert into public.miniprover (tema_id, minutter) values
  ('kjemi-1:energi-og-entalpi', 20)
on conflict (tema_id) do update set minutter = excluded.minutter;

-- Kjemi 1: Reaksjonsfart og likevekt
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('kjemi-1:reaksjonsfart-og-likevekt', 'kjemi-1', 'reaksjonsfart-og-likevekt', 'Reaksjonsfart og likevekt', 'Kollisjonsteori, faktorer som påvirker reaksjonsfarten, kjemisk likevekt og Le Châteliers prinsipp.', array[5, 13]::int[], 8, 'utkast', array['Regelen om at 10 °C høyere temperatur dobler farten er bare omtrentlig og gjelder mange, men ikke alle reaksjoner.', 'Likevektskonstanten K er tatt med. Noen læreverk regner med K først i Kjemi 2 – sjekk avgrensningen.']::text[], false, now())
on conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,
  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,
  publisert = excluded.publisert, oppdatert = excluded.oppdatert;
insert into public.tema_innhold (tema_id, sammendrag, tankekart) values
  ('kjemi-1:reaksjonsfart-og-likevekt', '## Reaksjonsfart

**Reaksjonsfarten** forteller hvor raskt reaktantene brukes opp eller produktene dannes, for eksempel målt som endring i konsentrasjon per sekund. En eksplosjon er over på en brøkdel av et sekund, mens rusting kan ta mange år.

## Kollisjonsteori

**Kollisjonsteorien** forklarer hvorfor reaksjoner har ulik fart. For at to partikler skal reagere, må de

- kollidere,
- ha nok energi til å komme over **aktiveringsenergien** (Ea),
- treffe hverandre med riktig orientering.

Bare en liten del av kollisjonene fører til reaksjon. Alt som gir flere vellykkede kollisjoner per sekund, øker reaksjonsfarten.

## Hva påvirker reaksjonsfarten?

- **Konsentrasjon**: Flere partikler i samme volum gir flere kollisjoner. For gasser gir høyere trykk samme effekt.
- **Temperatur**: Partiklene beveger seg raskere, og en større andel av dem har energi over aktiveringsenergien. For mange reaksjoner blir farten omtrent doblet når temperaturen øker med 10 °C.
- **Overflate**: Et finfordelt fast stoff har større overflate, så flere partikler kan kollidere samtidig. Melstøv kan eksplodere, mens en brødskive brenner rolig.
- **Katalysator**: En katalysator gir en annen reaksjonsvei med lavere aktiveringsenergi. Den blir ikke brukt opp og endrer ikke ΔH. **Enzymer** er katalysatorer i levende organismer, og katalysatoren i en bil gjør giftige avgasser om til mindre skadelige stoffer.

## Kjemisk likevekt

Mange reaksjoner kan gå begge veier, og vi skriver dem med dobbeltpil, ⇌. Når en slik reaksjon starter, går foroverreaksjonen raskt. Etter hvert som det dannes produkter, øker farten på bakoverreaksjonen. Til slutt går de to reaksjonene like fort, og konsentrasjonene endrer seg ikke lenger. Da har systemet nådd **kjemisk likevekt**.

Likevekten er **dynamisk**: reaksjonene går hele tiden, men like raskt begge veier. Konsentrasjonene er konstante, men ikke nødvendigvis like store.

Forholdet ved likevekt beskrives av **likevektskonstanten** K. For N₂ + 3H₂ ⇌ 2NH₃ er K = [NH₃]² / ([N₂] · [H₂]³). En stor K betyr at det er mest produkter ved likevekt. K endres bare når temperaturen endres.

## Le Châteliers prinsipp

Hvis en likevekt forstyrres, forskyver den seg slik at den motvirker endringen.

- Tilsetter vi mer reaktant, forskyves likevekten mot høyre, mot produktene.
- Øker vi trykket, forskyves likevekten mot siden med færrest gassmolekyler.
- Øker vi temperaturen, forskyves likevekten i den endoterme retningen.
- En katalysator forskyver ikke likevekten. Den gjør bare at likevekten nås raskere.

Et eksempel er likevekten mellom brun NO₂ og fargeløs N₂O₄: 2NO₂ ⇌ N₂O₄, der foroverreaksjonen er eksoterm. Varmer du blandingen, blir den mer brun, fordi likevekten forskyves i den endoterme retningen, mot NO₂.', '{"label":"Reaksjonsfart og likevekt","children":[{"label":"Kollisjonsteori","children":[{"label":"Kollisjon","note":"Partiklene må møtes"},{"label":"Aktiveringsenergi","note":"Nok energi"},{"label":"Orientering","note":"Riktig vei"}]},{"label":"Faktorer som øker farten","children":[{"label":"Konsentrasjon og trykk","note":"Flere kollisjoner"},{"label":"Temperatur","note":"Flere partikler over Ea"},{"label":"Overflate","note":"Finfordelt stoff"},{"label":"Katalysator","note":"Lavere aktiveringsenergi","children":[{"label":"Enzymer","note":"I levende organismer"},{"label":"Bilkatalysator","note":"Renser avgasser"}]}]},{"label":"Kjemisk likevekt","children":[{"label":"Reversibel reaksjon","note":"⇌"},{"label":"Dynamisk","note":"Like fort begge veier"},{"label":"Konstante konsentrasjoner","note":"Men ikke nødvendigvis like"},{"label":"Likevektskonstant K","note":"Stor K: mest produkter"}]},{"label":"Le Châteliers prinsipp","children":[{"label":"Konsentrasjon","note":"Mer reaktant: mot høyre"},{"label":"Trykk","note":"Mot færrest gassmolekyler"},{"label":"Temperatur","note":"Varme: i endoterm retning"},{"label":"Katalysator","note":"Ingen forskyvning"}]},{"label":"Eksempler","children":[{"label":"Haber–Bosch","note":"N₂ + 3H₂ ⇌ 2NH₃"},{"label":"NO₂ og N₂O₄","note":"Brun ⇌ fargeløs"}]}]}'::jsonb)
on conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;
delete from public.flashcards where tema_id = 'kjemi-1:reaksjonsfart-og-likevekt';
insert into public.flashcards (tema_id, begrep, forklaring, sortering) values
  ('kjemi-1:reaksjonsfart-og-likevekt', 'Reaksjonsfart', 'Hvor raskt reaktanter brukes opp eller produkter dannes, for eksempel endring i konsentrasjon per sekund.', 0),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'Kollisjonsteorien', 'Partikler reagerer bare når de kolliderer med nok energi og riktig orientering.', 1),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'Aktiveringsenergi (Ea)', 'Den minste energien partiklene må ha når de kolliderer, for at reaksjonen skal skje.', 2),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'Konsentrasjon og fart', 'Høyere konsentrasjon gir flere kollisjoner per sekund og dermed høyere reaksjonsfart.', 3),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'Temperatur og fart', 'Høyere temperatur gir raskere partikler og flere kollisjoner med energi over aktiveringsenergien.', 4),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'Overflate og fart', 'Finfordelte faste stoffer har større overflate, gir flere kollisjoner og reagerer raskere.', 5),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'Katalysator', 'Stoff som øker reaksjonsfarten ved å gi en reaksjonsvei med lavere aktiveringsenergi, uten selv å bli brukt opp.', 6),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'Enzym', 'Protein som virker som katalysator i levende organismer.', 7),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'Reversibel reaksjon', 'Reaksjon som kan gå begge veier. Skrives med dobbeltpil, ⇌.', 8),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'Kjemisk likevekt', 'Tilstanden der forover- og bakoverreaksjonen går like fort, slik at konsentrasjonene holder seg konstante.', 9),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'Dynamisk likevekt', 'Reaksjonene går hele tiden begge veier ved likevekt. Det er bare den samlede endringen som er null.', 10),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'Likevektskonstant (K)', 'Forholdet mellom produkt- og reaktantkonsentrasjonene ved likevekt, opphøyd i koeffisientene. Avhenger bare av temperaturen.', 11),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'Stor og liten K', 'Stor K: mest produkter ved likevekt. Liten K: mest reaktanter ved likevekt.', 12),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'Le Châteliers prinsipp', 'Når en likevekt forstyrres, forskyver den seg slik at den motvirker forstyrrelsen.', 13),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'Tilsette reaktant', 'Likevekten forskyves mot høyre, mot produktene.', 14),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'Fjerne produkt', 'Likevekten forskyves mot høyre, slik at mer produkt dannes.', 15),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'Øke trykket', 'Likevekten forskyves mot siden med færrest gassmolekyler.', 16),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'Øke temperaturen', 'Likevekten forskyves i den endoterme retningen, og K endres.', 17),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'Katalysator og likevekt', 'En katalysator forskyver ikke likevekten, men gjør at den innstiller seg raskere.', 18),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'Haber–Bosch-prosessen', 'Industriell produksjon av ammoniakk: N₂ + 3H₂ ⇌ 2NH₃. Høyt trykk og en jernkatalysator gir godt utbytte med brukbar fart.', 19);
delete from public.quiz_sporsmal where tema_id = 'kjemi-1:reaksjonsfart-og-likevekt';
insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values
  ('kjemi-1:reaksjonsfart-og-likevekt', 'q01', 'flervalg', 'Hva er aktiveringsenergi?', array['Energien som frigjøres i reaksjonen', 'Energien som er lagret i produktene', 'Farten reaksjonen går med', 'Den minste energien som trengs for at en kollisjon skal føre til reaksjon']::text[], 3, 'Aktiveringsenergien er en energiterskel. Bare partikler som kolliderer med minst så mye energi, kan reagere.', true, true, 0),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'q02', 'flervalg', 'Hvorfor går de fleste reaksjoner raskere ved høyere temperatur?', array['Aktiveringsenergien blir lavere', 'Flere partikler har nok energi, og de kolliderer oftere', 'Likevekten forskyves mot produktene', 'Det dannes en katalysator']::text[], 1, 'Høyere temperatur endrer ikke aktiveringsenergien, men en større andel av partiklene får energi over den. De beveger seg også raskere og kolliderer oftere.', true, true, 1),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'q03', 'flervalg', 'Hvorfor reagerer sinkpulver raskere med saltsyre enn en sinkbit med samme masse?', array['Pulveret er varmere', 'Pulveret er et annet stoff', 'Pulveret har større overflate, så det blir flere kollisjoner', 'Pulveret har lavere ΔH']::text[], 2, 'Når sinken er finfordelt, er mange flere sinkatomer i kontakt med syren samtidig. Det gir flere kollisjoner per sekund.', true, true, 2),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'q04', 'flervalg', 'Hva gjør en katalysator?', array['Senker aktiveringsenergien og øker farten uten å bli brukt opp', 'Forskyver likevekten mot produktene', 'Gjør ΔH mer negativ', 'Blir omdannet til produkt']::text[], 0, 'Katalysatoren gir reaksjonen en annen vei med lavere aktiveringsenergi. Den er uforandret når reaksjonen er ferdig, og den endrer verken ΔH eller likevekten.', true, true, 3),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'q05', 'flervalg', 'Hva kjennetegner kjemisk likevekt?', array['Forover- og bakoverreaksjonen går like fort', 'Reaksjonen har stoppet helt', 'Konsentrasjonene av reaktanter og produkter er like store', 'Alle reaktantene er brukt opp']::text[], 0, 'Ved likevekt går reaksjonene fortsatt, men like fort begge veier. Konsentrasjonene er derfor konstante, men de trenger ikke være like store.', true, true, 4),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'q06', 'flervalg', 'N₂(g) + 3H₂(g) ⇌ 2NH₃(g). Hva skjer med likevekten hvis trykket økes?', array['Den forskyves mot venstre', 'Ingenting skjer', 'Den forskyves mot høyre', 'Reaksjonen stopper']::text[], 2, 'Til venstre er det 4 gassmolekyler, til høyre 2. Økt trykk forskyver likevekten mot siden med færrest gassmolekyler, altså mot NH₃.', true, true, 5),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'q07', 'flervalg', '2NO₂ (brun) ⇌ N₂O₄ (fargeløs). Foroverreaksjonen er eksoterm. Hva skjer når blandingen varmes opp?', array['Den blir mer fargeløs', 'Den blir mer brun', 'Fargen endres ikke', 'Den blir blå']::text[], 1, 'Oppvarming forskyver likevekten i den endoterme retningen. Her er det bakoverreaksjonen, så det dannes mer brun NO₂.', true, true, 6),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'q08', 'flervalg', 'Hva skjer med en likevekt når det tilsettes en katalysator?', array['Den forskyves mot høyre', 'Den forskyves mot venstre', 'K blir større', 'Den forskyves ikke, men nås raskere']::text[], 3, 'Katalysatoren senker aktiveringsenergien like mye for forover- og bakoverreaksjonen. Begge blir raskere, så likevekten nås fortere, men den ligger på samme sted.', true, true, 7),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'q09', 'flervalg', 'Hva er likevektsuttrykket for N₂ + 3H₂ ⇌ 2NH₃?', array['K = [N₂][H₂]³ / [NH₃]²', 'K = [NH₃] / ([N₂][H₂])', 'K = [NH₃]² / ([N₂][H₂]³)', 'K = 2[NH₃] / (3[H₂][N₂])']::text[], 2, 'Produktene står over brøkstreken og reaktantene under. Koeffisientene blir eksponenter, ikke faktorer.', true, true, 8),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'q10', 'flervalg', 'Hva betyr det at likevektskonstanten K er svært stor?', array['Reaksjonen går svært raskt', 'Det er mest reaktanter ved likevekt', 'Reaksjonen er endoterm', 'Det er mest produkter ved likevekt']::text[], 3, 'Produktene står over brøkstreken i K. Stor K betyr at produktkonsentrasjonene er store i forhold til reaktantkonsentrasjonene. K sier ingenting om farten.', true, true, 9),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'q11', 'flervalg', 'Hva sier kollisjonsteorien?', array['Partiklene må kollidere med nok energi og riktig orientering for å reagere', 'Alle kollisjoner fører til reaksjon', 'Bare gasser kan reagere', 'Partiklene må ha samme masse for å reagere']::text[], 0, 'De fleste kollisjoner fører ikke til reaksjon. Partiklene må ha minst aktiveringsenergien og treffe hverandre riktig vei.', true, false, 10),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'q12', 'flervalg', 'Hva er et enzym?', array['En type syre', 'En biologisk katalysator', 'Et produkt av forbrenning', 'En likevektskonstant']::text[], 1, 'Enzymer er proteiner som katalyserer reaksjoner i levende organismer, for eksempel nedbrytingen av stivelse i munnen.', true, false, 11),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'm01', 'sant-usant', 'Ved likevekt er konsentrasjonene av reaktanter og produkter alltid like store.', array['Sant', 'Usant']::text[], 1, 'Ved likevekt er konsentrasjonene konstante, men de kan være svært ulike. Det er farten på forover- og bakoverreaksjonen som er lik.', false, true, 12),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'm02', 'flervalg', 'Du fjerner NH₃ fra likevekten N₂ + 3H₂ ⇌ 2NH₃. Hva skjer?', array['Likevekten forskyves mot venstre', 'Likevekten forskyves mot høyre', 'K blir mindre', 'Ingenting skjer']::text[], 1, 'Systemet motvirker endringen ved å lage mer av det som ble fjernet. Likevekten forskyves mot høyre, og det dannes mer NH₃.', false, true, 13),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'm03', 'sant-usant', 'En katalysator endrer ΔH for en reaksjon.', array['Sant', 'Usant']::text[], 1, 'Katalysatoren endrer bare veien reaksjonen går, altså aktiveringsenergien. Start- og sluttnivået er det samme, så ΔH er uendret.', false, true, 14),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'm04', 'flervalg', 'Hvilken endring øker IKKE farten på reaksjonen mellom marmor og saltsyre?', array['Høyere temperatur', 'Mindre marmorbiter', 'Mer konsentrert syre', 'Et større begerglass med den samme løsningen']::text[], 3, 'Et større begerglass endrer ikke konsentrasjonen, temperaturen eller overflaten, så antall kollisjoner per sekund blir det samme.', false, true, 15),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'm05', 'sant-usant', 'Kjemisk likevekt er dynamisk: reaksjonene går hele tiden begge veier.', array['Sant', 'Usant']::text[], 0, 'Molekylene reagerer hele tiden fram og tilbake. Fordi farten er lik begge veier, ser det ut som ingenting skjer.', false, true, 16),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'm06', 'flervalg', 'Likevekten A(g) ⇌ B(g) er endoterm mot høyre. Hvordan kan du få mer B?', array['Senke temperaturen', 'Øke temperaturen', 'Tilsette en katalysator', 'Øke trykket']::text[], 1, 'Økt temperatur forskyver likevekten i den endoterme retningen, her mot B. Trykket har ingen virkning fordi det er like mange gassmolekyler på begge sider.', false, true, 17),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'm07', 'flervalg', 'Hvilken størrelse endrer en katalysator?', array['ΔH', 'Likevektskonstanten K', 'Aktiveringsenergien', 'Konsentrasjonene ved likevekt']::text[], 2, 'En katalysator senker aktiveringsenergien. ΔH, K og likevektskonsentrasjonene er de samme med og uten katalysator.', false, true, 18),
  ('kjemi-1:reaksjonsfart-og-likevekt', 'm08', 'sant-usant', 'Likevektskonstanten K endres når temperaturen endres.', array['Sant', 'Usant']::text[], 0, 'K avhenger av temperaturen. Endringer i konsentrasjon eller trykk forskyver likevekten, men K er den samme så lenge temperaturen er uendret.', false, true, 19);
insert into public.miniprover (tema_id, minutter) values
  ('kjemi-1:reaksjonsfart-og-likevekt', 20)
on conflict (tema_id) do update set minutter = excluded.minutter;

-- Kjemi 1: Titrering og spektroskopi
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('kjemi-1:titrering-og-spektroskopi', 'kjemi-1', 'titrering-og-spektroskopi', 'Titrering og spektroskopi', 'Hvordan kjemikere bestemmer konsentrasjoner med titrering, og hvordan lys og spektre avslører hva et stoff består av.', array[2, 10, 11]::int[], 9, 'sjekkes', array['«Gravimetrisk titreranalyse» er tolket som titrering der mengden titrerløsning bestemmes ved veiing. Sjekk at tolkningen stemmer med læreboka.', 'Utvalget av spektroskopiske metoder (spektrofotometri, IR og massespektrometri) bør sjekkes mot læreboka. NMR er utelatt.', 'Flammefarger beskrives litt ulikt i ulike kilder (for eksempel «grønn» eller «blågrønn» for kobber).']::text[], false, now())
on conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,
  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,
  publisert = excluded.publisert, oppdatert = excluded.oppdatert;
insert into public.tema_innhold (tema_id, sammendrag, tankekart) values
  ('kjemi-1:titrering-og-spektroskopi', '## Titrering

Ved **titrering** finner vi den ukjente konsentrasjonen i en prøve ved å tilsette en løsning med kjent konsentrasjon, en **titrerløsning**, til reaksjonen er fullført. Titrerløsningen tilsettes fra en **byrette**, mens prøven står i en erlenmeyerkolbe. **Ekvivalenspunktet** er der stoffene har reagert i nøyaktig det forholdet som reaksjonslikningen viser. En **indikator** skifter farge i **endepunktet**, som bør ligge så nær ekvivalenspunktet som mulig.

I **volumetrisk titrering** måler vi volumet av titrerløsningen med byretten. I **gravimetrisk titrering** bestemmer vi mengden titrerløsning ved å veie den. Veiing er ofte mer nøyaktig enn å lese av et volum.

## Beregning

25,0 mL saltsyre titreres med 0,100 mol/L NaOH, og det går med 20,0 mL. Da er n(NaOH) = 0,100 mol/L · 0,0200 L = 0,00200 mol. Molforholdet mellom HCl og NaOH er 1 : 1, så n(HCl) = 0,00200 mol og c(HCl) = 0,00200 mol / 0,0250 L = 0,0800 mol/L.

## Syre-base-titrering og redokstitrering

En **titrerkurve** viser pH mot tilsatt volum. Når en sterk syre titreres med en sterk base, er pH omtrent 7 i ekvivalenspunktet. Titreres en svak syre, som eddiksyre, med en sterk base, ligger ekvivalenspunktet i basisk område. Da passer fenolftalein bedre enn bromtymolblått. I en **redokstitrering** overføres elektroner i stedet for protoner. Kaliumpermanganat er sterkt fiolett og virker som sin egen indikator.

## Usikkerhet og feilkilder

Alle målinger har usikkerhet. **Tilfeldige feil**, som små forskjeller når du leser av byretten, gjør at resultatene spriker. Vi reduserer dem ved å ta flere **parallelle titreringer** og regne gjennomsnitt. **Systematiske feil**, som en titrerløsning med feil konsentrasjon, trekker alle resultatene i samme retning og forsvinner ikke med flere forsøk.

## Atomspektre

Elektronene i et atom kan bare ha bestemte energier. Når et atom får tilført energi, for eksempel i en flamme, hopper elektroner opp til høyere energinivåer. Når de faller tilbake, sender de ut lys med en energi som tilsvarer forskjellen mellom nivåene. Jo større energiforskjell, desto kortere bølgelengde. Lyset gir et **linjespekter**, og fordi energinivåene er forskjellige for hvert grunnstoff, har hvert grunnstoff sitt eget spekter. Det brukes i **flammeprøver**: natrium gir gul flamme, kalium lilla og kobber grønn. Sendes hvitt lys gjennom en gass, absorberes de samme bølgelengdene, og vi får mørke linjer i et **absorpsjonsspekter**.

## Spektroskopiske metoder

- **Spektrofotometri**: Et farget stoff absorberer lys. Etter **Beer–Lamberts lov** er absorbansen proporsjonal med konsentrasjonen. Med en standardkurve laget av løsninger med kjent konsentrasjon kan vi bestemme ukjente konsentrasjoner.
- **IR-spektroskopi**: Bindinger i molekyler vibrerer og absorberer infrarødt lys ved bestemte bølgelengder. IR-spekteret viser hvilke bindinger og funksjonelle grupper et molekyl har, for eksempel O–H og C=O.
- **Massespektrometri**: Molekylene gjøres om til ioner og sorteres etter masse. Det gir molekylmassen og informasjon om hvilke biter molekylet består av.', '{"label":"Titrering og spektroskopi","children":[{"label":"Titrering","children":[{"label":"Byrette","note":"Tilsetter titrerløsningen"},{"label":"Ekvivalenspunkt","note":"Riktig støkiometrisk forhold"},{"label":"Endepunkt","note":"Indikatoren skifter farge"},{"label":"Volumetrisk","note":"Måler volum"},{"label":"Gravimetrisk","note":"Veier titrerløsningen"}]},{"label":"Typer titrering","children":[{"label":"Syre-base","note":"Titrerkurve, pH-sprang"},{"label":"Redoks","note":"For eksempel med KMnO₄"}]},{"label":"Beregning","children":[{"label":"n = c · V","note":"Titrerløsningen"},{"label":"Molforhold","note":"Fra reaksjonslikningen"},{"label":"c = n / V","note":"Prøven"}]},{"label":"Usikkerhet","children":[{"label":"Tilfeldige feil","note":"Resultatene spriker"},{"label":"Systematiske feil","note":"Alle resultater skjeve samme vei"},{"label":"Parallelle titreringer","note":"Gjennomsnitt"}]},{"label":"Atomspektre","children":[{"label":"Energinivåer","note":"Bestemte energier"},{"label":"Emisjonsspekter","note":"Lyse linjer"},{"label":"Absorpsjonsspekter","note":"Mørke linjer"},{"label":"Flammeprøve","note":"Na gul, K lilla, Cu grønn"}]},{"label":"Spektroskopiske metoder","children":[{"label":"Spektrofotometri","note":"Beer–Lamberts lov, standardkurve"},{"label":"IR-spektroskopi","note":"Bindinger og funksjonelle grupper"},{"label":"Massespektrometri","note":"Molekylmasse og bruddstykker"}]}]}'::jsonb)
on conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;
delete from public.flashcards where tema_id = 'kjemi-1:titrering-og-spektroskopi';
insert into public.flashcards (tema_id, begrep, forklaring, sortering) values
  ('kjemi-1:titrering-og-spektroskopi', 'Titrering', 'Metode for å bestemme en ukjent konsentrasjon ved å tilsette en løsning med kjent konsentrasjon til reaksjonen er fullført.', 0),
  ('kjemi-1:titrering-og-spektroskopi', 'Titrerløsning', 'Løsningen med kjent konsentrasjon som tilsettes fra byretten.', 1),
  ('kjemi-1:titrering-og-spektroskopi', 'Byrette', 'Langt glassrør med skala og kran, brukt til å tilsette titrerløsning og lese av volumet nøyaktig.', 2),
  ('kjemi-1:titrering-og-spektroskopi', 'Ekvivalenspunkt', 'Punktet der stoffene har reagert i nøyaktig det forholdet som reaksjonslikningen viser.', 3),
  ('kjemi-1:titrering-og-spektroskopi', 'Endepunkt', 'Punktet der indikatoren skifter farge. Bør ligge så nær ekvivalenspunktet som mulig.', 4),
  ('kjemi-1:titrering-og-spektroskopi', 'Volumetrisk titrering', 'Titrering der mengden titrerløsning bestemmes ved å måle volum, med byrette.', 5),
  ('kjemi-1:titrering-og-spektroskopi', 'Gravimetrisk titrering', 'Titrering der mengden titrerløsning bestemmes ved veiing. Ofte mer nøyaktig enn volummåling.', 6),
  ('kjemi-1:titrering-og-spektroskopi', 'Titrerkurve', 'Graf som viser pH mot volum tilsatt titrerløsning. Har et bratt sprang rundt ekvivalenspunktet.', 7),
  ('kjemi-1:titrering-og-spektroskopi', 'Redokstitrering', 'Titrering basert på en redoksreaksjon, for eksempel med kaliumpermanganat, som også er sin egen indikator.', 8),
  ('kjemi-1:titrering-og-spektroskopi', 'Tilfeldig feil', 'Usikkerhet som gjør at gjentatte målinger spriker litt. Reduseres ved å ta flere parallelle målinger.', 9),
  ('kjemi-1:titrering-og-spektroskopi', 'Systematisk feil', 'Feil som trekker alle resultatene i samme retning, for eksempel en titrerløsning med feil konsentrasjon.', 10),
  ('kjemi-1:titrering-og-spektroskopi', 'Parallelle målinger', 'Å gjenta det samme forsøket flere ganger og bruke gjennomsnittet, for å redusere tilfeldige feil.', 11),
  ('kjemi-1:titrering-og-spektroskopi', 'Energinivå', 'Bestemt energi et elektron i et atom kan ha. Elektronene kan bare ha slike bestemte energier.', 12),
  ('kjemi-1:titrering-og-spektroskopi', 'Emisjonsspekter', 'Lyse linjer ved bestemte bølgelengder. Oppstår når elektroner faller til lavere energinivåer og sender ut lys.', 13),
  ('kjemi-1:titrering-og-spektroskopi', 'Absorpsjonsspekter', 'Mørke linjer i et ellers sammenhengende spekter. Oppstår når atomer tar opp lys med bestemte bølgelengder.', 14),
  ('kjemi-1:titrering-og-spektroskopi', 'Flammeprøve', 'Metode for å påvise metaller ut fra flammefargen, for eksempel natrium (gul), kalium (lilla) og kobber (grønn).', 15),
  ('kjemi-1:titrering-og-spektroskopi', 'Bølgelengde og energi', 'Jo kortere bølgelengde, desto høyere energi har lyset.', 16),
  ('kjemi-1:titrering-og-spektroskopi', 'Spektrofotometri', 'Måling av hvor mye lys en løsning absorberer, for å bestemme konsentrasjonen av et stoff.', 17),
  ('kjemi-1:titrering-og-spektroskopi', 'Beer–Lamberts lov', 'Absorbansen er proporsjonal med konsentrasjonen av stoffet som absorberer lyset.', 18),
  ('kjemi-1:titrering-og-spektroskopi', 'Standardkurve', 'Graf av målt verdi, for eksempel absorbans, mot kjente konsentrasjoner. Brukes til å finne ukjente konsentrasjoner.', 19),
  ('kjemi-1:titrering-og-spektroskopi', 'IR-spektroskopi', 'Metode som viser hvilke bindinger og funksjonelle grupper et molekyl har, ut fra hvilket infrarødt lys det absorberer.', 20),
  ('kjemi-1:titrering-og-spektroskopi', 'Massespektrometri', 'Metode der molekyler gjøres om til ioner og sorteres etter masse. Gir molekylmasse og informasjon om oppbygningen.', 21);
delete from public.quiz_sporsmal where tema_id = 'kjemi-1:titrering-og-spektroskopi';
insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values
  ('kjemi-1:titrering-og-spektroskopi', 'q01', 'flervalg', 'Hva er ekvivalenspunktet i en titrering?', array['Punktet der indikatoren skifter farge', 'Punktet der stoffene har reagert i det forholdet reaksjonslikningen viser', 'Punktet der pH er 0', 'Punktet der titreringen starter']::text[], 1, 'Ekvivalenspunktet bestemmes av støkiometrien. Endepunktet, der indikatoren skifter farge, er det vi observerer, og det bør ligge nær ekvivalenspunktet.', true, true, 0),
  ('kjemi-1:titrering-og-spektroskopi', 'q02', 'flervalg', 'Hvilket utstyr brukes til å tilsette titrerløsningen nøyaktig?', array['Begerglass', 'Målesylinder', 'Reagensrør', 'Byrette']::text[], 3, 'Byretten har kran og en fin skala, så du kan tilsette dråpe for dråpe og lese av volumet med to desimaler.', true, true, 1),
  ('kjemi-1:titrering-og-spektroskopi', 'q03', 'flervalg', '25,0 mL saltsyre titreres med 0,100 mol/L NaOH, og det går med 20,0 mL. Hva er konsentrasjonen av saltsyren?', array['0,0800 mol/L', '0,125 mol/L', '0,100 mol/L', '0,0500 mol/L']::text[], 0, 'n(NaOH) = 0,100 mol/L · 0,0200 L = 0,00200 mol. Forholdet er 1 : 1, så c(HCl) = 0,00200 mol / 0,0250 L = 0,0800 mol/L.', true, true, 2),
  ('kjemi-1:titrering-og-spektroskopi', 'q04', 'flervalg', 'Hvorfor passer fenolftalein godt når eddiksyre titreres med natronlut?', array['Den er den billigste indikatoren', 'Den virker bare i sure løsninger', 'Ekvivalenspunktet ligger i basisk område', 'Den reagerer med eddiksyre']::text[], 2, 'Når en svak syre titreres med en sterk base, har løsningen pH over 7 i ekvivalenspunktet. Fenolftalein skifter farge i basisk område og treffer derfor godt.', true, true, 3),
  ('kjemi-1:titrering-og-spektroskopi', 'q05', 'flervalg', 'Hva kjennetegner gravimetrisk titrering?', array['Man veier et bunnfall som dannes', 'Man måler pH med pH-meter', 'Mengden titrerløsning bestemmes ved veiing', 'Man bruker ingen indikator']::text[], 2, 'I gravimetrisk titrering veier man hvor mye titrerløsning som er tilsatt, i stedet for å lese av et volum på en byrette.', true, false, 4),
  ('kjemi-1:titrering-og-spektroskopi', 'q06', 'flervalg', 'Hva skjer når et elektron faller fra et høyere til et lavere energinivå?', array['Atomet tar opp lys', 'Atomet sender ut lys med en bestemt energi', 'Atomet blir til et ion', 'Atomkjernen endres']::text[], 1, 'Energiforskjellen mellom nivåene sendes ut som lys. Fordi nivåene har bestemte energier, får lyset bestemte bølgelengder.', true, true, 5),
  ('kjemi-1:titrering-og-spektroskopi', 'q07', 'flervalg', 'Hvorfor har hvert grunnstoff sitt eget linjespekter?', array['Alle grunnstoffer har det samme spekteret', 'Grunnstoffene har ulik farge i fast form', 'Grunnstoffene har ulikt antall nøytroner', 'Energinivåene er forskjellige for hvert grunnstoff']::text[], 3, 'Energinivåene avhenger av kjerneladningen og elektronene, som er unike for hvert grunnstoff. Da blir også energiforskjellene, og dermed linjene i spekteret, unike.', true, true, 6),
  ('kjemi-1:titrering-og-spektroskopi', 'q08', 'flervalg', 'Hvilken flammefarge gir natrium?', array['Gul', 'Lilla', 'Grønn', 'Blå']::text[], 0, 'Natrium gir en sterk gul flamme. Kalium gir lilla og kobber grønn flamme.', true, true, 7),
  ('kjemi-1:titrering-og-spektroskopi', 'q09', 'flervalg', 'Hva sier Beer–Lamberts lov?', array['Absorbansen er omvendt proporsjonal med konsentrasjonen', 'Absorbansen er proporsjonal med konsentrasjonen', 'Lys med kort bølgelengde har lav energi', 'Fargen på en løsning avhenger av temperaturen']::text[], 1, 'Dobbelt så høy konsentrasjon gir dobbelt så høy absorbans. Det gjør at vi kan bruke en rett standardkurve for å finne ukjente konsentrasjoner.', true, true, 8),
  ('kjemi-1:titrering-og-spektroskopi', 'q10', 'flervalg', 'Hva kan IR-spektroskopi brukes til?', array['Å finne hvilke bindinger og funksjonelle grupper et molekyl har', 'Å måle pH i en løsning', 'Å bestemme massen til et molekyl', 'Å måle temperaturen i en reaksjon']::text[], 0, 'Ulike bindinger, som O–H og C=O, absorberer infrarødt lys ved ulike bølgelengder. Toppene i spekteret avslører derfor hvilke grupper som finnes.', true, false, 9),
  ('kjemi-1:titrering-og-spektroskopi', 'q11', 'flervalg', 'Hvilken av disse er en systematisk feil?', array['Du leser av byretten litt ulikt fra gang til gang', 'Temperaturen i rommet varierer litt', 'Du tilsetter noen dråper for mye i én av titreringene', 'Titrerløsningen har feil konsentrasjon i alle titreringene']::text[], 3, 'En feil konsentrasjon i titrerløsningen påvirker alle resultatene likt og forsvinner ikke med flere parallelle titreringer. De andre feilene er tilfeldige.', true, true, 10),
  ('kjemi-1:titrering-og-spektroskopi', 'q12', 'flervalg', 'Hva brukes massespektrometri til?', array['Å måle fargen på en løsning', 'Å finne ut hvilke bindinger et molekyl har', 'Å bestemme massen til molekyler og bitene de består av', 'Å måle pH']::text[], 2, 'I et massespektrometer blir molekylene til ioner som sorteres etter masse. Det gir molekylmassen og et mønster av bruddstykker.', true, true, 11),
  ('kjemi-1:titrering-og-spektroskopi', 'm01', 'sant-usant', 'Endepunktet er der indikatoren skifter farge, og det bør ligge nær ekvivalenspunktet.', array['Sant', 'Usant']::text[], 0, 'Indikatoren velges slik at fargeomslaget skjer der pH endrer seg raskt, like ved ekvivalenspunktet.', false, true, 12),
  ('kjemi-1:titrering-og-spektroskopi', 'm02', 'flervalg', '10,0 mL 0,200 mol/L NaOH nøytraliserer 20,0 mL eddiksyre. Hva er konsentrasjonen av eddiksyren?', array['0,400 mol/L', '0,100 mol/L', '0,200 mol/L', '0,0100 mol/L']::text[], 1, 'n(NaOH) = 0,200 mol/L · 0,0100 L = 0,00200 mol. Med forhold 1 : 1 blir c = 0,00200 mol / 0,0200 L = 0,100 mol/L.', false, true, 13),
  ('kjemi-1:titrering-og-spektroskopi', 'm03', 'sant-usant', 'Lys med kort bølgelengde har mer energi enn lys med lang bølgelengde.', array['Sant', 'Usant']::text[], 0, 'Energien til lyset øker når bølgelengden blir kortere. Fiolett lys har derfor mer energi enn rødt.', false, true, 14),
  ('kjemi-1:titrering-og-spektroskopi', 'm04', 'flervalg', 'Omtrent hvilken pH har løsningen i ekvivalenspunktet når saltsyre titreres med natronlut?', array['Omtrent 7', 'Omtrent 3', 'Omtrent 10', 'Omtrent 1']::text[], 0, 'Sterk syre og sterk base gir et nøytralt salt (NaCl) og vann, så pH er omtrent 7 i ekvivalenspunktet.', false, true, 15),
  ('kjemi-1:titrering-og-spektroskopi', 'm05', 'sant-usant', 'For et grunnstoff ligger de mørke linjene i absorpsjonsspekteret ved de samme bølgelengdene som de lyse linjene i emisjonsspekteret.', array['Sant', 'Usant']::text[], 0, 'Begge spektrene skyldes de samme energiforskjellene mellom energinivåene, bare at lyset tas opp i det ene og sendes ut i det andre.', false, true, 16),
  ('kjemi-1:titrering-og-spektroskopi', 'm06', 'flervalg', 'Hvorfor tar man flere parallelle titreringer?', array['For å bruke opp løsningen', 'Fordi indikatoren ellers ikke virker', 'For å redusere betydningen av tilfeldige feil', 'For å fjerne systematiske feil']::text[], 2, 'Gjennomsnittet av flere målinger påvirkes mindre av tilfeldige feil. Systematiske feil blir derimot ikke borte av at man gjentar forsøket.', false, true, 17),
  ('kjemi-1:titrering-og-spektroskopi', 'm07', 'flervalg', 'Hvordan kan du bestemme konsentrasjonen av et farget stoff med et spektrofotometer?', array['Ved å måle pH', 'Ved å lage en standardkurve av absorbans mot kjente konsentrasjoner', 'Ved å veie løsningen', 'Ved å måle kokepunktet']::text[], 1, 'Du måler absorbansen for løsninger med kjent konsentrasjon og lager en standardkurve. Så leser du av den ukjente konsentrasjonen ut fra absorbansen til prøven.', false, true, 18),
  ('kjemi-1:titrering-og-spektroskopi', 'm08', 'sant-usant', 'Kaliumpermanganat kan brukes i redokstitrering uten egen indikator, fordi det er sterkt fiolett.', array['Sant', 'Usant']::text[], 0, 'Permanganat blir fargeløst når det reagerer. Når alt er reagert, gir første dråpe i overskudd en svak fiolett farge som viser endepunktet.', false, true, 19);
insert into public.miniprover (tema_id, minutter) values
  ('kjemi-1:titrering-og-spektroskopi', 20)
on conflict (tema_id) do update set minutter = excluded.minutter;

-- Kjemi 1: Grønn kjemi
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('kjemi-1:gronn-kjemi', 'kjemi-1', 'gronn-kjemi', 'Grønn kjemi', 'Prinsippene for grønn kjemi, atomøkonomi og E-faktor, og hvordan kjemi kan bidra til bærekraftig utvikling.', array[16, 17]::int[], 10, 'utkast', array['Prinsippene er gjengitt fritt og gruppert i hovedtanker, ikke som Anastas og Warners nummererte liste. Sjekk om læreboka forventer at elevene kan alle tolv med nummer.']::text[], false, now())
on conflict (id) do update set navn = excluded.navn, intro = excluded.intro, kompetansemaal = excluded.kompetansemaal,
  sortering = excluded.sortering, status = excluded.status, merknader = excluded.merknader,
  publisert = excluded.publisert, oppdatert = excluded.oppdatert;
insert into public.tema_innhold (tema_id, sammendrag, tankekart) values
  ('kjemi-1:gronn-kjemi', '## Hva er grønn kjemi?

**Grønn kjemi** handler om å utforme kjemiske produkter og prosesser slik at bruken og dannelsen av farlige stoffer blir så liten som mulig. I stedet for å rydde opp etter forurensning prøver man å hindre at den oppstår. De amerikanske kjemikerne Paul Anastas og John Warner samlet ideene i **tolv prinsipper for grønn kjemi** i 1998.

## Prinsippene

Prinsippene kan samles i noen hovedtanker:

- **Forebygg avfall.** Det er bedre å unngå avfall enn å behandle det etterpå.
- **Utnytt atomene.** Mest mulig av reaktantene bør ende i produktet, og unødvendige mellomtrinn bør unngås.
- **Bruk og lag tryggere stoffer.** Velg reaktanter, løsemidler og produkter som er minst mulig giftige. Vann eller superkritisk CO₂ kan ofte erstatte skadelige organiske løsemidler.
- **Spar energi.** Reaksjonene bør helst gå ved romtemperatur og vanlig trykk.
- **Bruk fornybare råstoffer**, for eksempel stivelse og cellulose fra planter i stedet for olje.
- **Bruk katalysatorer.** De gjør reaksjoner raskere ved lavere temperatur og kan brukes om igjen i stedet for å bli avfall.
- **Lag nedbrytbare produkter** som brytes ned til ufarlige stoffer etter bruk.
- **Overvåk og forebygg ulykker.** Mål underveis i prosessen, og velg stoffer og betingelser som gir liten risiko for brann, eksplosjon og utslipp.

## Atomøkonomi

**Atomøkonomi** viser hvor stor del av reaktantenes masse som ender i det ønskede produktet:

**Atomøkonomi = M(ønsket produkt) / sum av M(reaktanter) · 100 %**

Koeffisientene i likningen tas med. Når kalsiumkarbonat varmes opp til kalsiumoksid, CaCO₃ → CaO + CO₂, blir atomøkonomien 56,1 / 100,1 · 100 % ≈ 56 %. Resten av massen blir CO₂. I en addisjonsreaksjon, der alle atomene havner i ett produkt, er atomøkonomien 100 %.

## Utbytte og E-faktor

Utbyttet forteller hvor mye produkt du fikk sammenlignet med det teoretiske. Det sier ikke noe om hvor mye avfall som dannes. En reaksjon kan ha 95 % utbytte og likevel gi mye biprodukter. Derfor bruker kjemikere også **E-faktoren**:

**E-faktor = masse avfall / masse produkt**

Jo lavere E-faktor, desto mindre avfall. I legemiddelindustrien kan E-faktoren være høy, fordi det brukes mange reaksjonstrinn og mye løsemiddel.

## Grønn kjemi og bærekraft

**Bærekraftig utvikling** betyr å dekke dagens behov uten å ødelegge mulighetene for at kommende generasjoner skal kunne dekke sine. Grønn kjemi bidrar ved å spare råstoffer og energi, redusere utslipp og lage produkter som ikke hoper seg opp i naturen.

Samtidig må løsningene vurderes kritisk. Et produkt laget av planter er ikke automatisk bærekraftig hvis dyrkingen krever mye areal, vann og gjødsel. En **livsløpsanalyse** ser på hele livet til et produkt, fra råstoff til avfall, før man konkluderer.', '{"label":"Grønn kjemi","children":[{"label":"Hva det er","children":[{"label":"Unngå farlige stoffer","note":"Hindre i stedet for å rydde opp"},{"label":"Tolv prinsipper","note":"Anastas og Warner, 1998"}]},{"label":"Mindre avfall","children":[{"label":"Forebygg avfall","note":"Prinsipp 1"},{"label":"Atomøkonomi","note":"Mest mulig ender i produktet"},{"label":"Færre trinn","note":"Mindre tap og avfall"},{"label":"E-faktor","note":"Avfall / produkt"}]},{"label":"Tryggere stoffer","children":[{"label":"Mindre giftige reaktanter"},{"label":"Tryggere løsemidler","note":"Vann, superkritisk CO₂"},{"label":"Nedbrytbare produkter","note":"Hoper seg ikke opp i naturen"}]},{"label":"Energi og råstoff","children":[{"label":"Romtemperatur og vanlig trykk","note":"Sparer energi"},{"label":"Fornybare råstoffer","note":"Stivelse, cellulose"},{"label":"Katalysatorer","note":"Lavere temperatur, brukes om igjen"}]},{"label":"Sikkerhet","children":[{"label":"Sanntidsanalyse","note":"Mål underveis"},{"label":"Forebygg ulykker","note":"Brann, eksplosjon, utslipp"}]},{"label":"Bærekraft","children":[{"label":"Bærekraftig utvikling","note":"Dagens behov uten å ødelegge for framtiden"},{"label":"Livsløpsanalyse","note":"Fra råstoff til avfall"},{"label":"Kritisk vurdering","note":"Plantebasert er ikke automatisk bærekraftig"}]}]}'::jsonb)
on conflict (tema_id) do update set sammendrag = excluded.sammendrag, tankekart = excluded.tankekart;
delete from public.flashcards where tema_id = 'kjemi-1:gronn-kjemi';
insert into public.flashcards (tema_id, begrep, forklaring, sortering) values
  ('kjemi-1:gronn-kjemi', 'Grønn kjemi', 'Å utforme kjemiske produkter og prosesser slik at bruken og dannelsen av farlige stoffer blir så liten som mulig.', 0),
  ('kjemi-1:gronn-kjemi', 'De tolv prinsippene', 'Retningslinjer for grønn kjemi, formulert av Paul Anastas og John Warner i 1998.', 1),
  ('kjemi-1:gronn-kjemi', 'Forebygge avfall', 'Det første prinsippet: Det er bedre å unngå avfall enn å behandle eller rydde opp etterpå.', 2),
  ('kjemi-1:gronn-kjemi', 'Atomøkonomi', 'Andelen av reaktantenes masse som ender i det ønskede produktet: M(produkt) / sum M(reaktanter) · 100 %.', 3),
  ('kjemi-1:gronn-kjemi', 'Addisjonsreaksjon og atomøkonomi', 'Når alle atomene i reaktantene havner i ett produkt, er atomøkonomien 100 %.', 4),
  ('kjemi-1:gronn-kjemi', 'Biprodukt', 'Stoff som dannes i tillegg til det ønskede produktet, og som ofte blir avfall.', 5),
  ('kjemi-1:gronn-kjemi', 'E-faktor', 'Masse avfall delt på masse produkt. Jo lavere, desto grønnere prosess.', 6),
  ('kjemi-1:gronn-kjemi', 'Utbytte og atomøkonomi', 'Utbyttet sier hvor mye produkt du fikk. Atomøkonomien sier hvor mye av reaktantene som i det hele tatt kan bli produkt.', 7),
  ('kjemi-1:gronn-kjemi', 'Tryggere løsemidler', 'Å erstatte giftige eller brannfarlige løsemidler med for eksempel vann, etanol eller superkritisk CO₂.', 8),
  ('kjemi-1:gronn-kjemi', 'Superkritisk CO₂', 'CO₂ under høyt trykk og over en viss temperatur, der det oppfører seg både som gass og væske. Brukes som løsemiddel, for eksempel til å fjerne koffein fra kaffe.', 9),
  ('kjemi-1:gronn-kjemi', 'Energieffektivitet', 'Å gjennomføre reaksjoner ved romtemperatur og vanlig trykk når det er mulig, for å spare energi.', 10),
  ('kjemi-1:gronn-kjemi', 'Fornybart råstoff', 'Råstoff som fornyes i naturen, for eksempel stivelse og cellulose fra planter, i motsetning til olje, kull og gass.', 11),
  ('kjemi-1:gronn-kjemi', 'Katalyse i grønn kjemi', 'Katalysatorer gir raskere reaksjoner ved lavere temperatur og kan brukes om igjen, slik at det blir mindre avfall og energibruk.', 12),
  ('kjemi-1:gronn-kjemi', 'Nedbrytbare produkter', 'Produkter som brytes ned til ufarlige stoffer i naturen etter bruk, i stedet for å hope seg opp.', 13),
  ('kjemi-1:gronn-kjemi', 'Færre reaksjonstrinn', 'Hvert trinn gir tap, avfall og energibruk. Prosesser med færre trinn er som regel grønnere.', 14),
  ('kjemi-1:gronn-kjemi', 'Sanntidsanalyse', 'Å måle underveis i en prosess, slik at man kan stoppe dannelse av farlige stoffer før de oppstår.', 15),
  ('kjemi-1:gronn-kjemi', 'Sikrere kjemi', 'Å velge stoffer og betingelser som gir minst mulig risiko for brann, eksplosjon og utslipp.', 16),
  ('kjemi-1:gronn-kjemi', 'Bærekraftig utvikling', 'Utvikling som dekker dagens behov uten å ødelegge mulighetene for at kommende generasjoner skal kunne dekke sine.', 17),
  ('kjemi-1:gronn-kjemi', 'Livsløpsanalyse', 'Vurdering av miljøbelastningen til et produkt gjennom hele livet, fra råstoff og produksjon til bruk og avfall.', 18);
delete from public.quiz_sporsmal where tema_id = 'kjemi-1:gronn-kjemi';
insert into public.quiz_sporsmal (tema_id, nokkel, type, tekst, alternativer, riktig, forklaring, i_quiz, i_miniprove, sortering) values
  ('kjemi-1:gronn-kjemi', 'q01', 'flervalg', 'Hva er hovedmålet med grønn kjemi?', array['Å redusere bruk og dannelse av farlige stoffer i kjemiske prosesser og produkter', 'Å bruke flere grønne fargestoffer', 'Å øke produksjonen uansett miljøkostnad', 'Å erstatte all kjemi med biologi']::text[], 0, 'Grønn kjemi handler om å designe prosesser og produkter slik at forurensning og farlige stoffer unngås fra starten av.', true, true, 0),
  ('kjemi-1:gronn-kjemi', 'q02', 'flervalg', 'Hvem formulerte de tolv prinsippene for grønn kjemi?', array['Dmitrij Mendelejev', 'Gro Harlem Brundtland', 'Paul Anastas og John Warner', 'Henri Le Châtelier']::text[], 2, 'Anastas og Warner publiserte de tolv prinsippene i 1998. Brundtland er kjent for definisjonen av bærekraftig utvikling.', true, false, 1),
  ('kjemi-1:gronn-kjemi', 'q03', 'flervalg', 'Hva måler atomøkonomi?', array['Hvor raskt en reaksjon går', 'Hvor mye energi en reaksjon krever', 'Hvor mye produkt du faktisk fikk', 'Hvor stor andel av reaktantenes masse som ender i det ønskede produktet']::text[], 3, 'Atomøkonomien regnes ut fra reaksjonslikningen. Den viser hvor mye av reaktantene som i beste fall kan bli til ønsket produkt.', true, true, 2),
  ('kjemi-1:gronn-kjemi', 'q04', 'flervalg', 'Hva er atomøkonomien for CaCO₃ → CaO + CO₂? (M(CaCO₃) = 100,1 g/mol, M(CaO) = 56,1 g/mol)', array['44,0 %', '56,0 %', '100 %', '78,5 %']::text[], 1, 'Atomøkonomi = 56,1 / 100,1 · 100 % = 56,0 %. De resterende 44 % av massen ender som CO₂.', true, true, 3),
  ('kjemi-1:gronn-kjemi', 'q05', 'flervalg', 'Hvilken type reaksjon har 100 % atomøkonomi?', array['En reaksjon som gir et biprodukt', 'En addisjonsreaksjon der alle atomene havner i ett produkt', 'En forbrenning', 'En fellingsreaksjon med tilskuerioner']::text[], 1, 'Når alle reaktantatomene blir en del av det ønskede produktet, går ingenting til biprodukter, og atomøkonomien er 100 %.', true, true, 4),
  ('kjemi-1:gronn-kjemi', 'q06', 'flervalg', 'Hva er E-faktoren?', array['Energiforbruket i en prosess', 'Utbyttet i prosent', 'Antall reaksjonstrinn', 'Masse avfall per masse produkt']::text[], 3, 'E-faktoren er masse avfall delt på masse produkt. Den tar med alt avfall, også løsemidler, og jo lavere den er, desto bedre.', true, true, 5),
  ('kjemi-1:gronn-kjemi', 'q07', 'flervalg', 'Hvorfor er katalysatorer viktige i grønn kjemi?', array['De gir raskere reaksjoner ved lavere temperatur og kan brukes om igjen', 'De gjør ΔH større', 'De forbrukes og blir til avfall', 'De gjør reaktantene unødvendige']::text[], 0, 'Katalysatorer sparer energi fordi reaksjonen kan gå ved lavere temperatur, og de blir ikke brukt opp. Det gir mindre avfall enn reagenser som forbrukes.', true, true, 6),
  ('kjemi-1:gronn-kjemi', 'q08', 'flervalg', 'Hva er et fornybart råstoff?', array['Råolje', 'Kull', 'Råstoff som fornyes i naturen, for eksempel fra planter', 'Metallmalm fra gruver']::text[], 2, 'Fornybare råstoffer, som stivelse og cellulose fra planter, dannes på nytt i løpet av kort tid. Olje, kull og malm tar millioner av år å danne.', true, true, 7),
  ('kjemi-1:gronn-kjemi', 'q09', 'flervalg', 'En prosess gir 3 kg avfall for hver kg produkt. Hva er E-faktoren?', array['0,33', '4', '1', '3']::text[], 3, 'E-faktor = masse avfall / masse produkt = 3 kg / 1 kg = 3.', true, true, 8),
  ('kjemi-1:gronn-kjemi', 'q10', 'flervalg', 'Hvorfor sier prinsippene at det er bedre å forebygge avfall enn å behandle det?', array['Det er tryggere og billigere å unngå avfall enn å rydde opp etterpå', 'Avfall er aldri farlig', 'Det er forbudt å behandle avfall', 'Avfall kan ikke behandles']::text[], 0, 'Avfall som aldri dannes, trenger verken lagring, transport eller rensing, og det kan heller ikke lekke ut i naturen.', true, false, 9),
  ('kjemi-1:gronn-kjemi', 'q11', 'flervalg', 'Hvilket løsemiddel er et grønnere valg i mange prosesser?', array['Benzen', 'Klorerte løsemidler', 'Vann eller superkritisk CO₂', 'Kvikksølv']::text[], 2, 'Vann og superkritisk CO₂ er lite giftige og ikke brannfarlige. Benzen og mange klorerte løsemidler er helse- og miljøskadelige.', true, true, 10),
  ('kjemi-1:gronn-kjemi', 'q12', 'flervalg', 'En reaksjon har 95 % utbytte, men lav atomøkonomi. Hva betyr det?', array['Prosessen er helt grønn', 'Mye av reaktantene blir likevel til biprodukter og avfall', 'Reaksjonen går for sakte', 'Produktet er urent']::text[], 1, 'Høyt utbytte betyr at du fikk nesten alt produktet som var mulig. Lav atomøkonomi betyr at mye av massen uansett blir biprodukter. Begge må vurderes.', true, true, 11),
  ('kjemi-1:gronn-kjemi', 'm01', 'sant-usant', 'Høyt utbytte betyr alltid at en prosess gir lite avfall.', array['Sant', 'Usant']::text[], 1, 'Utbyttet sier bare hvor mye produkt du fikk av det som var mulig. Prosessen kan likevel gi mye biprodukter og brukt løsemiddel.', false, true, 12),
  ('kjemi-1:gronn-kjemi', 'm02', 'flervalg', 'Hva er atomøkonomien for C₂H₄ + H₂O → C₂H₅OH?', array['50 %', '78 %', '100 %', '64 %']::text[], 2, 'Alle atomene i eten og vann havner i etanol, og det dannes ingen biprodukter. Atomøkonomien er 100 %.', false, true, 13),
  ('kjemi-1:gronn-kjemi', 'm03', 'sant-usant', 'Grønn kjemi handler blant annet om å lage produkter som brytes ned til ufarlige stoffer etter bruk.', array['Sant', 'Usant']::text[], 0, 'Ett av prinsippene er å designe produkter som brytes ned i naturen, slik at de ikke hoper seg opp som miljøgifter.', false, true, 14),
  ('kjemi-1:gronn-kjemi', 'm04', 'flervalg', 'Hvilket av disse er IKKE et prinsipp i grønn kjemi?', array['Bruke fornybare råstoffer', 'Bruke katalysatorer', 'Maksimere atomøkonomien', 'Bruke så høy temperatur som mulig']::text[], 3, 'Høy temperatur krever mye energi. Grønn kjemi anbefaler tvert imot å gjennomføre reaksjoner ved romtemperatur og vanlig trykk når det er mulig.', false, true, 15),
  ('kjemi-1:gronn-kjemi', 'm05', 'sant-usant', 'Det er i tråd med grønn kjemi å gjennomføre reaksjoner ved romtemperatur og vanlig trykk.', array['Sant', 'Usant']::text[], 0, 'Oppvarming og høyt trykk krever energi. Å unngå det sparer energi og reduserer risikoen for ulykker.', false, true, 16),
  ('kjemi-1:gronn-kjemi', 'm06', 'flervalg', 'Hva er bærekraftig utvikling?', array['Utvikling som dekker dagens behov uten å ødelegge mulighetene for kommende generasjoner', 'Økonomisk vekst uten grenser', 'Å slutte helt å bruke kjemikalier', 'Utvikling som bare tar hensyn til miljøet']::text[], 0, 'Bærekraftig utvikling tar hensyn til både miljø, økonomi og samfunn, slik at også de som kommer etter oss, kan dekke sine behov.', false, true, 17),
  ('kjemi-1:gronn-kjemi', 'm07', 'flervalg', 'Hvorfor er en syntese med færre reaksjonstrinn ofte grønnere?', array['Den gir mer avfall', 'Den gir mindre tap, avfall og energibruk', 'Den gir høyere E-faktor', 'Den krever flere løsemidler']::text[], 1, 'Hvert trinn gir tap av stoff, bruk av løsemiddel og energi. Færre trinn betyr derfor som regel mindre avfall og lavere E-faktor.', false, true, 18),
  ('kjemi-1:gronn-kjemi', 'm08', 'sant-usant', 'En lav E-faktor betyr at prosessen gir mye avfall.', array['Sant', 'Usant']::text[], 1, 'Det er omvendt. E-faktoren er avfall delt på produkt, så en lav verdi betyr lite avfall per kilo produkt.', false, true, 19);
insert into public.miniprover (tema_id, minutter) values
  ('kjemi-1:gronn-kjemi', 20)
on conflict (tema_id) do update set minutter = excluded.minutter;

commit;
