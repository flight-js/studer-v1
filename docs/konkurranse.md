# Konkurranse på Studer (utkast, november 2026)

Poeng for øving, rangeringer (elever, skoler og formelmatch-tider) og
belønninger som kan løses inn hos partnere. Bygd som utkast på branchen
`utkast-november` – ingenting er kjørt mot produksjonsdatabasen.

## Bakgrunn: hva konkurrentene gjør

**Gizmo** (gizmo.ai, over 13 millioner brukere etter egne tall) gjør øving om
til et spill:

- XP, nivåer, ligaer, daglige streaker og «liv» som går tapt ved feil svar
  (livene er en del av betalingsmuren i gratisversjonen)
- rangeringslister og live quizspill mot venner med en kode
- samleobjekter («monster eggs») som gir XP-bonus

Kilder: tredjepartsomtaler (techraisal.com, screensdesign.com, itechguides.com)
og pressedekning av Series A-runden. Gizmos egen forside beskriver ikke
mekanikken. At man kan velge skole og konkurrere med skoler, er brukerens egen
beskrivelse og er ikke bekreftet i kildene.

**Tise** har poeng som vises under profilen («Rewards») og kan brukes til
rabatter, tilbud og prøveperioder hos partnere. Poengene er lojalitetspoeng uten
pengeverdi, kan ikke overføres og utløper etter en tid. Brukeren ønsket samme
måte å løse inn på, men andre måter å tjene poeng på.

## Hva Studer gjør annerledes

- **Poeng for læring, ikke for aktivitet i seg selv.** Quiz, miniprøve og
  formelmatch gir poeng, med mer for bedre resultat. Flashcards gir ikke poeng,
  fordi eleven selv svarer «Kan dette» – det kan ikke sjekkes.
- **Fornavn, eller kallenavn.** Eleven velger skole (i velkomststegene, på
  startsiden eller under Konto). Rangeringene viser fornavn og skole. Krysser
  eleven av for «Ikke vis fornavnet mitt på rangeringene», glir et felt for
  kallenavn fram, og kallenavnet vises i stedet. Uten kallenavn vises eleven
  ikke for andre (bare for seg selv, som «Deg»). Se «Kallenavn» under.
- **Ingen «liv» og ingen straff for feil.** Studer er en betalt tjeneste, og
  feil er en del av å lære.
- **Tak:** hver øving gir poeng én gang per døgn, og maks 150 poeng per døgn.
  Det hindrer farming og gjør ligaene rettferdige.
- **Skoleliga etter snitt per elev**, ikke sum, så små skoler kan vinne.
- **Ingen trekninger eller tilfeldige premier** (se juridisk nedenfor).

## Poengregler

| Øving | Poeng |
| --- | --- |
| Flashcards | 0 (eleven svarer selv) |
| Quizrunde | 10 + opptil 5 etter andel riktige |
| Miniprøve | 15 + opptil 10 etter resultat |
| Formelmatch-runde | 10 |
| Dagens første øving | 5 + 1 per dag på rad (maks 15) |
| Tak per døgn | 150 |

Poengene tildeles i `gi_poeng()`, som bare kalles av `lagre_resultat()` og
`avslutt_formelmatch()`. Eleven kan aldri skrive poeng selv.

## Det som er bygd

| Del | Filer |
| --- | --- |
| Database | `supabase/migrations/20261109120000_konkurranse.sql` (ikke kjørt) |
| Skoler fra NSR | `scripts/hent-skoler.mjs` (`npm run skoler`) → `public/skoler.json` (søket) og `supabase/skoler.sql` (tabellen) – se «Skolelista» under |
| Typer | `src/lib/database.types.ts` (lagt inn for hånd – generer på nytt etter migrasjonen) |
| Bibliotek | `src/lib/konkurranse.ts` – med eksempeldata når migrasjonen ikke er kjørt |
| Sider | `/konkurranse` (poeng, ukeliste, skoleliste, regler) og `/belonninger` (innløsning, kodene dine) |
| Velkommen | `/velkommen` rett etter registrering: trinn, skole og preferanser (utseende, fornavn eller kallenavn) |
| Startsiden | «Hvilken skole går du på?»-kort til skolen er valgt (`VelgSkoleKort.tsx`), poengbrikke i menyen |
| Konto | Skole og «Ikke vis fornavnet mitt på rangeringene» med kallenavn (`components/konkurranse/Konkurranseprofil.tsx`) |
| Kallenavn | Ordlister i `src/lib/kallenavn.ts`, serverfunksjonen `supabase/functions/kallenavn` (ordlister + språkmodell, eneste vei til kolonnen) og `kallenavn_feil` i databasen |
| Formelmatch | Runden starter og slutter på serveren; resultatskjermen viser topplista for temaet |
| Varsel | «+12 poeng» nederst på skjermen etter øvinger (`components/Poengvarsel.tsx`) |
| Juridisk | Utkast til punkt 9 i vilkårene og avsnitt i personvernerklæringen |

Uten migrasjonen viser sidene tydelig merkede eksempeldata (oppdiktede navn,
skoler og partnere), så de kan prøves. Skolevelgeren søker likevel i den ekte
skolelista, men skolen lagres ikke før migrasjonen er kjørt. Topplista i formelmatch, poengbrikka og
skolekortet på startsiden og skolesteget i velkomststegene vises ikke i
produksjon før databasen er klar.

## Skolelista

Alle aktive skoler med ungdomstrinn og alle videregående skoler i Norge,
offentlige og private, fra Nasjonalt skoleregister (NSR, Udir, fritt
tilgjengelig under NLOD). Per 9. november 2026: **1 683 skoler** – 1 187 med
ungdomstrinn, 500 videregående (noen har begge) og 23 der trinnene ikke er
registrert.

- `npm run skoler` henter alt på nytt (cirka 3 minutter) og skriver to filer med
  de samme skolene: `public/skoler.json`, som skolevelgeren søker i, og
  `supabase/skoler.sql`, som fyller tabellen `skoler` (`profiles.skole_id`
  peker dit). Kjør skriptet en gang i året eller når noen savner skolen sin, og
  kjør `skoler.sql` på nytt i Supabase etterpå. Den oppdaterer eksisterende
  skoler og legger til nye, men sletter ikke nedlagte, så ingen mister skolen
  sin.
- Søket skjer i nettleseren: lista (cirka 25 kB komprimert) lastes ned når
  søkefeltet får fokus. Hvert ord må finnes i navnet eller kommunen, uten å
  bry seg om store/små bokstaver eller aksenter (karasjok finner Kárášjohka), og
  «vgs» finner «videregående skole». Treff der navnet begynner med søket, kommer
  først.
- Navnene ryddes for juridiske tillegg («Stiftelsen …», «… AS», «… Sti»,
  «avd Undervisning»). Avdelinger med stedsnavn beholdes. Skoler som står dobbelt
  i registeret (samme navn og kommune), slås sammen.
- Rene barneskoler og voksenopplæring er ikke med. Rundt 90 grunnskoler mangler
  trinn i NSR. Av dem tas de som ser ut som skoler med ansatte med (heller en
  barneskole for mye enn en ungdomsskole som mangler). Administrasjon, tiltak og
  enheter uten ansatte holdes utenfor. Skriptet skriver ut begge listene.

## Studers egne belønninger

Krever ingen partner og legges inn med migrasjonen (prisene kan endres der
eller senere med `update public.belonninger set poengpris = …`). Til
sammenligning tjener en elev som øver hver dag, rundt 50–150 poeng per dag.

| Belønning | Poeng | Slik virker den |
| --- | --- | --- |
| En gratis uke | 2 500 | Kreditt i Stripe som trekkes fra neste betaling: 59 kr × 7/30 ≈ 13,77 kr (måned) eller 499 kr × 7/365 ≈ 9,57 kr (år) |
| Gi en venn en gratis uke | 800 | Eleven skriver vennens e-postadresse, og Studer sender vennen en e-post. Vennen får én uke kreditt når hen starter sitt første abonnement med den adressen |
| Blå / grønn flamme | 400 | Flammen i rekka (quiz, formelmatch) får ny farge |
| Regnbueflamme | 1 200 | Flammen skifter farge |
| Stjerne- / fjærkonfetti | 600 | Konfettien på resultatskjermene og ved innløsning |
| Fjærpenn / lyspære / stjerne ved navnet | 500 | Vises ved navnet på ukelista og topplistene |

- **Gratis tid** (typen `kreditt`) går gjennom serverfunksjonen `betaling`
  (`handling: "kreditt"`): poengene trekkes i databasen (`kreditt_start`),
  kreditten legges på kunden i Stripe, og feiler Stripe, gis poengene
  tilbake (`kreditt_angre`). Én gang per 30 dager, bare med et aktivt
  abonnement som ikke avsluttes. Kreditt, ikke forlenget prøveperiode: et
  abonnement som går over til «trialing», ville blitt stoppet av
  prøveperiodesjekken i `stripe-webhook`.
- **Gaver til venner** (typen `venn`) går gjennom serverfunksjonen
  `vennegave`: poengene trekkes (`vennegave_lag`), e-posten sendes med SMTP
  fra e-postserveren til studer.no, og feiler den, gis poengene tilbake
  (`vennegave_angre`). E-posten har fast tekst – eleven kan ikke skrive en
  egen melding – og bare fornavnet (bokstaver) fra eleven. Ingen kode: gaven
  er knyttet til e-postadressen, og `betaling` bruker den automatisk når noen
  med den adressen (bekreftet) starter sitt første abonnement
  (`vennegave_bruk`); `/abonnement` viser «Ingrid har gitt deg en gratis uke»
  før betaling. Høyst tre ubrukte gaver om gangen, ikke til seg selv, én gave
  per mottaker. Brukes ikke gaven innen 60 dager, eller har vennen brukt en
  annen gave, får giveren poengene tilbake, og adressen skjules
  (`in•••@eksempel.no`) når gaven er ferdig (`vennegaver_rydd`, pg_cron hver
  natt). Svaret sier aldri om adressen har konto hos Studer.
- **Ting** (typen `ting`): eies i `eiendeler`, velges i `profiles`
  (`valgt_flamme`, `valgt_konfetti`, `valgt_merke`); databasen sjekker at
  eleven eier det som velges. Katalogen står i `src/lib/utseende.ts`. Kan
  prøves på belønningssiden før kjøp.
- Testet i PGlite: ny konto sperres, ting kan kjøpes én gang og bare tas i
  bruk av eieren, reglene for gaver til venner (adresse, tre om gangen, ikke
  til seg selv, ubekreftet e-post, eldste gave brukes, poeng tilbake én gang
  ved sendefeil og når gaven går ut, adressen skjules), én gratis tid per
  måned og at poengene gis tilbake nøyaktig én gang når Stripe feiler.
  Stripe-kallene og e-postsendingen er typesjekket, men ikke kjørt (krever
  testnøkler og SMTP-passord).

## Kallenavn

For elever som skjuler fornavnet. Svært få rapporterer et stygt navn, så
filteret må stoppe dem selv. Derfor tre lag:

1. **Ordlistene i appen** (`src/lib/kallenavn.ts`) gir svar mens eleven
   skriver.
2. **Serverfunksjonen `kallenavn`** (`supabase/functions/kallenavn`) er
   eneste vei til `profiles.kallenavn` – eleven har ikke lov til å oppdatere
   kolonnen selv. Den kjører ordlistene (`kallenavn_feil` i databasen) og lar
   så en språkmodell vurdere navnet. Modellen fanger det lister ikke kan: nye
   skrivemåter, andre språk («Merde», «Puta»), hets mot personer («Kari er
   feit»), hentydninger («Big D Energy»), rus, fulle navn (kan være en annen
   elev), kontaktinfo («finn meg på sc») og navn som utgir seg for lærere eller
   kjente personer. Instruksjonene står i `prompt.ts`: streng, og i tvil avvises
   navnet.
3. **Databasen** sjekker ordlistene en gang til når navnet lagres (trigger på
   `profiles`).

Kan modellen ikke sjekke navnet (feil, tidsavbrudd eller ikke satt opp),
lagres det **ikke** – eleven får «Prøv igjen om litt». Uendrede navn sjekkes
ikke på nytt. Grenser: 10 sjekker per elev per døgn og 5 000 for hele appen
(`AI_GRENSE_KALLENAVN`, `AI_GRENSE_KALLENAVN_TOTALT`), så ingen kan prøve seg
fram eller drive opp kostnaden med mange kontoer. Kallenavnet logges aldri,
og OpenAI lagrer det ikke (`store: false`). Krever innlogging, ikke abonnement
(kallenavnet velges i velkomststegene).

**Regler:** 2–20 tegn, bare latinske bokstaver (også æøå, aksenter og samiske
bokstaver), tall, mellomrom, - og _, minst to bokstaver og høyst fire tall på
rad (ikke telefonnumre).

**Ordlistene:**

- Tre lister: ord som ikke kan stå noe sted («fuck», «faen», «neger»,
  «snapchat»), forstavelser som ikke kan begynne et ord (norske
  sammensetninger som «kukhue» og «horebukk»), og korte ord som bare stoppes
  alene («ass», «cock», «nazi», «snap», «fakk» – de finnes inni vanlige ord som
  «Kasse», «Hancock», «Nazir», «Snapper» og «Fakkel»). Dekker banning,
  seksuelle ord, slurs, rus, ekstremisme, selvmord, kontaktinfo og navn som
  utgir seg for Studer («admin», «moderator», og «Deg», som er navnet skjulte
  elever ser seg selv med).
- Omveier som fanges: store/små bokstaver, tegn og mellomrom imellom, tall for
  bokstaver («sh1t»), forlengede bokstaver («fuuuck»), ord gjemt i camelCase
  («MatteKuk») og kyrilliske bokstaver som ligner latinske (bare latinske er
  lov).
- Kjente feiltreff (stoppes selv om de er uskyldige): Scunthorpe, Pussycat,
  Shitake, Kukkonen, Faenza og feilstavingen «Fittness».
- **Endre ordlistene:** i `kallenavn.ts`, og kjør `npm run kallenavn:sql`, som
  skriver dem inn i databasefunksjonene i migrasjonen. Er migrasjonen allerede
  kjørt, gir `node scripts/kallenavn-sql.mjs --ny` SQL-en til en ny migrasjon.

**Testet:**

- Ordlistene: 95 navn som skal godtas, 107 som skal stoppes og 9 ugyldige, 0
  feil. Databaseversjonen ga samme svar som appen for alle 229 navnene
  (PGlite, Postgres 17 med C-lokale – bokstavområdene er skrevet ut i SQL-en
  fordi `[[:alpha:]]` og `lower()` ikke kjenner æøå med C-lokale). Triggeren,
  rangeringsnavnet og grensene er også testet der.
- Språkmodellen: **ikke testet ennå** (krever AI_API_KEY). Kjør
  `npm run ai:kallenavn-test` før lansering – 35 navn, både harmløse og slike
  ordlistene ikke fanger. Juster `prompt.ts` hvis den avviser vanlige navn
  eller slipper gjennom stygge.

## Juks: hva som stoppes, og hva som ikke stoppes

Stoppes:

- Poeng kan ikke skrives direkte. Resultater sjekkes (gyldig tema, tilgang,
  0 ≤ resultat ≤ antall).
- Taket på 150 per døgn og én gang per øving begrenser hva juks kan gi.
- Formelmatch-tid kan ikke oppgis kortere enn tiden serveren har målt (minus
  3 sekunder), og under 0,6 sekunder per par teller ikke. Bare runder med alle
  formlene teller på topplista.
- Innløsning: kontoen må være minst en uke gammel, én kode per belønning per
  person, og en lås hindrer dobbeltbruk av samme poeng.
- Poeng krever tilgang (abonnement eller prøveperiode med kortsjekk).

Stoppes ikke:

- En elev som kjenner API-et, kan rapportere toppresultater i quiz og
  miniprøve uten å svare – men aldri mer enn taket.
- Et skript kan spille formelmatch raskt, men aldri raskere enn sanntid og
  0,6 sekunder per par.

Anbefalt før belønninger med høy verdi: følg med på uvanlige mønstre (maks
poeng hver dag, mange raske formelmatch-tider), og ha en enkel rutine for å
fjerne poeng (`grunn = 'korrigering'`).

## Juridisk og personvern (må vurderes før lansering)

- **Markedsføring mot barn og unge.** Belønninger fra merkevarer til
  13–19-åringer er markedsføring rettet mot mindreårige. Følg
  markedsføringsloven og Forbrukertilsynets veiledning: ingen alkohol,
  tobakk/snus, energidrikk, pengespill, kosmetiske inngrep eller kredittkjøp,
  og ikke press til å kjøpe.
- **Ingen lotteri.** Tilfeldige premier eller trekninger kan kreve tillatelse
  etter lotteriloven. Belønningene er derfor faste og kjøpes med poeng.
- **Personvern.** Fornavnet vises på rangeringene som standard (brukerens valg,
  november 2026); eleven kan skjule det og bruke kallenavn eller ingenting.
  Brukerne er 13–19 år, og personvernforordningen krever personvern som
  standard (art. 25). Valget vises derfor allerede i velkomststegene, men det
  bør vurderes juridisk før lansering om fornavn kan være på som standard.
  Skolekonkurransen teller alle med valgt skole, men viser bare tall per skole
  og krever minst tre elever. Vurder en DPIA (personvernkonsekvensvurdering),
  og oppdater datoene i personvernerklæringen og vilkårene når teksten
  publiseres.
- **Kallenavn.** Filteret er hovedvernet (se «Kallenavn»), fordi få
  rapporterer. Ha likevel en rutine for å fjerne et navn som skulle slippe
  gjennom (`update profiles set kallenavn = null where id = …` med
  service_role).
- **Gaver til venner på e-post.** E-post med tilbud til noen som ikke har
  samtykket, er markedsføring etter markedsføringsloven § 15. «Tips en
  venn»-løsninger er vanligvis greie når eleven selv velger mottakeren og
  sender én e-post, uten å få noe for det (her betaler eleven med poeng i
  stedet), og det står hvem som sendte. Sjekk Forbrukertilsynets veiledning før
  lansering. Mottakerne kan være under 18, så e-posten er nøktern og har ingen
  reklame utover gaven.
- **Partnere.** Det finnes ingen avtaler ennå. Sidene viser «Belønningene
  kommer snart» til ekte belønninger er lagt inn. Ikke vis logoer eller navn på
  partnere uten avtale.

## Lansering, steg for steg

1. Kjør migrasjonen og `supabase/skoler.sql` (Supabase SQL Editor), og last opp
   serverfunksjonene `kallenavn` (AI_API_KEY finnes allerede fra «chat»),
   `vennegave` og `betaling`. Kjør `npm run ai:kallenavn-test` først.
   `vennegave` trenger hemmelighetene `SMTP_VERT` (for eksempel
   mail.studer.no), `SMTP_BRUKER` (for eksempel kontakt@studer.no) og
   `SMTP_PASSORD`. Send en gave til deg selv på en annen adresse først, og
   sjekk at e-posten ikke havner i søppelposten (SPF og DKIM for studer.no).
2. Generer `database.types.ts` på nytt og sjekk at det bygger.
3. Test med en testkonto: poeng etter øving, tak, formelmatch-tid, ligaer.
4. Legg inn ekte belønninger og koder (se nederst i migrasjonen).
5. Oppdater datoene i vilkårene og personvernerklæringen.
6. Last opp frontenden.

## Ideer til neste runde

- Poeng for fullført «I dag»-repetisjon.
- Live-dueller i formelmatch eller quiz med kode, mot en venn (som Gizmo Live).
- Ukesutfordringer per fag og klasseligaer som lærere kan lage.
- Merker for milepæler (for eksempel 30 dager på rad).
- Utløp av poeng etter en periode, som hos Tise, hvis belønningene trenger det.
