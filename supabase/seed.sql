-- Generert av `npm run content:seed` fra content/. Ikke rediger for hånd.
-- Temaer publiseres uansett status (--publiser-utkast).

begin;

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
  ('matematikk-8', '8', 'Matematikk', null, null, '[]'::jsonb, 1),
  ('engelsk-8', '8', 'Engelsk', null, null, '[]'::jsonb, 2),
  ('naturfag-8', '8', 'Naturfag', null, null, '[]'::jsonb, 3),
  ('samfunnsfag-8', '8', 'Samfunnsfag', null, null, '[]'::jsonb, 4),
  ('krle-8', '8', 'KRLE', null, null, '[]'::jsonb, 5),
  ('tysk-8', '8', 'Tysk', null, null, '[]'::jsonb, 6),
  ('fransk-8', '8', 'Fransk', null, null, '[]'::jsonb, 7),
  ('spansk-8', '8', 'Spansk', null, null, '[]'::jsonb, 8),
  ('arbeidslivsfag-8', '8', 'Arbeidslivsfag', null, null, '[]'::jsonb, 9),
  ('norsk-9', '9', 'Norsk', null, null, '[]'::jsonb, 0),
  ('matematikk-9', '9', 'Matematikk', null, null, '[]'::jsonb, 1),
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
  ('kjemi-1', 'vg2', 'Kjemi 1', 'KJE01-02', 'https://www.udir.no/lk20/kje01-02/kompetansemaal-og-vurdering/kv532', '[{"nr":1,"kort":"Kjemisk terminologi og navnsetting"},{"nr":2,"kort":"Forsøk, usikkerhet og feilkilder"},{"nr":3,"kort":"Sikkerhetsdatablad og HMS"},{"nr":4,"kort":"Data, simuleringer og beregninger"},{"nr":5,"kort":"Modeller, styrker og begrensninger"},{"nr":6,"kort":"Periodesystemet og periodiske trender"},{"nr":7,"kort":"Kjemisk binding, molekylgeometri og struktur"},{"nr":8,"kort":"Beregninger på reaksjoner og reaksjonstyper"},{"nr":9,"kort":"Konsentrasjon og ulike enheter"},{"nr":10,"kort":"Volumetrisk og gravimetrisk titreranalyse"},{"nr":11,"kort":"Atomets oppbygning, spektre og spektroskopi"},{"nr":12,"kort":"Entalpi og entalpiendringer"},{"nr":13,"kort":"Kollisjonsteori, reaksjonsfart og likevekt"},{"nr":14,"kort":"Løselighet: ladning, polaritet og temperatur"},{"nr":15,"kort":"Syre, base, protolyse og pH"},{"nr":16,"kort":"Grønn kjemi og bærekraft"},{"nr":17,"kort":"Kilder og kildekritikk"}]'::jsonb, 5),
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

-- Kjemi 1 (vg2) -----------------------------------------------------

delete from public.temaer where fag_id = 'kjemi-1' and slug not in ('atomet-og-periodesystemet', 'kjemisk-binding', 'formler-og-navnsetting', 'stoffmengde-og-stokiometri', 'reaksjonstyper-og-redoks', 'losninger-og-konsentrasjon', 'syrer-baser-og-ph', 'energi-og-entalpi', 'reaksjonsfart-og-likevekt', 'titrering-og-spektroskopi', 'gronn-kjemi');

-- Atomet og periodesystemet
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('kjemi-1:atomet-og-periodesystemet', 'kjemi-1', 'atomet-og-periodesystemet', 'Atomet og periodesystemet', 'Hvordan atomer er bygd opp, hvordan elektronene er ordnet, og hvorfor periodesystemet viser tydelige mønstre.', array[5, 6]::int[], 0, 'utkast', '{}'::text[], true, now())
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

-- Kjemisk binding og molekylgeometri
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('kjemi-1:kjemisk-binding', 'kjemi-1', 'kjemisk-binding', 'Kjemisk binding og molekylgeometri', 'Ionebinding, kovalent binding og metallbinding, formen på molekyler og kreftene som virker mellom dem.', array[5, 7]::int[], 1, 'utkast', array['Læreverk bruker litt ulike navn på molekylformene (for eksempel «plan trigonal» eller «plan trekantet»). Sjekk at navnene stemmer med læreboka elevene bruker.']::text[], true, now())
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

-- Formler og navnsetting
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('kjemi-1:formler-og-navnsetting', 'kjemi-1', 'formler-og-navnsetting', 'Formler og navnsetting', 'Hvordan du skriver kjemiske formler og gir navn til ioneforbindelser, molekylforbindelser, syrer og hydrater.', array[1]::int[], 2, 'utkast', array['Læreplanen sier ikke direkte om enkel organisk navnsetting (alkaner, alkoholer osv.) hører til Kjemi 1. Vurder om det trengs et eget tema for det.', 'Skrivemåten for sammensatte navn varierer litt mellom læreverk (for eksempel «kobber(II)sulfatpentahydrat» med eller uten bindestrek).']::text[], true, now())
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

-- Stoffmengde og støkiometri
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('kjemi-1:stoffmengde-og-stokiometri', 'kjemi-1', 'stoffmengde-og-stokiometri', 'Stoffmengde og støkiometri', 'Mol, molar masse og balanserte reaksjonslikninger – og hvordan du regner ut hvor mye som reagerer og dannes.', array[4, 8]::int[], 3, 'sjekkes', array['Molvolum: læreverk bruker ulike standardbetingelser (22,4 L/mol ved 0 °C og 1 atm, 22,7 L/mol ved 0 °C og 1 bar, 24,5 L/mol ved 25 °C og 1 atm). Sjekk hvilke verdier læreboka og eksamensformelarket bruker.', 'Atommassene er avrundet til to desimaler (H 1,01, C 12,01, O 16,00, S 32,07). Svarene kan avvike litt i siste siffer hvis tabellen i læreboka har andre verdier.']::text[], true, now())
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

-- Reaksjonstyper og redoks
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('kjemi-1:reaksjonstyper-og-redoks', 'kjemi-1', 'reaksjonstyper-og-redoks', 'Reaksjonstyper og redoks', 'Fellingsreaksjoner, syre-base-reaksjoner og redoksreaksjoner – hvordan du kjenner dem igjen og bruker oksidasjonstall.', array[8]::int[], 4, 'utkast', array['Elektrokjemi (galvaniske celler og elektrolyse) er holdt utenfor, fordi det ikke nevnes i kompetansemålene for Kjemi 1. Sjekk mot læreboka om det likevel bør være med.', 'Løselighetsreglene er forenklede tommelfingerregler.']::text[], true, now())
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

-- Løsninger, konsentrasjon og løselighet
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('kjemi-1:losninger-og-konsentrasjon', 'kjemi-1', 'losninger-og-konsentrasjon', 'Løsninger, konsentrasjon og løselighet', 'Hvordan du regner med konsentrasjon, lager og fortynner løsninger, og hva som avgjør om et stoff løser seg.', array[9, 14]::int[], 5, 'utkast', array['ppm er definert som mg per kg (masse). Noen læreverk bruker mg/L for vannløsninger, som er tilnærmet det samme for fortynnede løsninger.']::text[], true, now())
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

-- Syrer, baser og pH
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('kjemi-1:syrer-baser-og-ph', 'kjemi-1', 'syrer-baser-og-ph', 'Syrer, baser og pH', 'Protolyse, sterke og svake syrer, pH-skalaen og hvordan du regner ut pH for sterke syrer og baser.', array[15]::int[], 6, 'utkast', array['Syrekonstanten Ka er bare nevnt kvalitativt. pH-beregning for svake syrer og buffere hører vanligvis til Kjemi 2 – sjekk at avgrensningen stemmer med læreboka.']::text[], true, now())
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

-- Energi og entalpi
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('kjemi-1:energi-og-entalpi', 'kjemi-1', 'energi-og-entalpi', 'Energi og entalpi', 'Eksoterme og endoterme reaksjoner, entalpiendring, bindingsenergi, Hess'' lov og kalorimetri.', array[4, 12]::int[], 7, 'utkast', array['Bindingsenergiene er gjennomsnittsverdier. Tabellen i læreboka kan ha verdier som avviker med noen kJ/mol.', 'Entropi og Gibbs fri energi er utelatt, fordi kompetansemålet bare nevner entalpi. Sjekk mot læreboka.']::text[], true, now())
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

-- Reaksjonsfart og likevekt
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('kjemi-1:reaksjonsfart-og-likevekt', 'kjemi-1', 'reaksjonsfart-og-likevekt', 'Reaksjonsfart og likevekt', 'Kollisjonsteori, faktorer som påvirker reaksjonsfarten, kjemisk likevekt og Le Châteliers prinsipp.', array[5, 13]::int[], 8, 'utkast', array['Regelen om at 10 °C høyere temperatur dobler farten er bare omtrentlig og gjelder mange, men ikke alle reaksjoner.', 'Likevektskonstanten K er tatt med. Noen læreverk regner med K først i Kjemi 2 – sjekk avgrensningen.']::text[], true, now())
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

-- Titrering og spektroskopi
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('kjemi-1:titrering-og-spektroskopi', 'kjemi-1', 'titrering-og-spektroskopi', 'Titrering og spektroskopi', 'Hvordan kjemikere bestemmer konsentrasjoner med titrering, og hvordan lys og spektre avslører hva et stoff består av.', array[2, 10, 11]::int[], 9, 'sjekkes', array['«Gravimetrisk titreranalyse» er tolket som titrering der mengden titrerløsning bestemmes ved veiing. Sjekk at tolkningen stemmer med læreboka.', 'Utvalget av spektroskopiske metoder (spektrofotometri, IR og massespektrometri) bør sjekkes mot læreboka. NMR er utelatt.', 'Flammefarger beskrives litt ulikt i ulike kilder (for eksempel «grønn» eller «blågrønn» for kobber).']::text[], true, now())
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

-- Grønn kjemi
insert into public.temaer (id, fag_id, slug, navn, intro, kompetansemaal, sortering, status, merknader, publisert, oppdatert) values
  ('kjemi-1:gronn-kjemi', 'kjemi-1', 'gronn-kjemi', 'Grønn kjemi', 'Prinsippene for grønn kjemi, atomøkonomi og E-faktor, og hvordan kjemi kan bidra til bærekraftig utvikling.', array[16, 17]::int[], 10, 'utkast', array['Prinsippene er gjengitt fritt og gruppert i hovedtanker, ikke som Anastas og Warners nummererte liste. Sjekk om læreboka forventer at elevene kan alle tolv med nummer.']::text[], true, now())
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
