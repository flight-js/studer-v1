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

- **Poeng for læring, ikke for aktivitet i seg selv.** Fullført bunke, quiz,
  miniprøve og formelmatch gir poeng, med mer for bedre resultat.
- **Ingen «liv» og ingen straff for feil.** Studer er en betalt tjeneste, og
  feil er en del av å lære.
- **Tak:** hver øving gir poeng én gang per døgn, og maks 150 poeng per døgn.
  Det hindrer farming og gjør ligaene rettferdige.
- **Skoleliga etter snitt per elev**, ikke sum, så små skoler kan vinne.
- **Ingen trekninger eller tilfeldige premier** (se juridisk nedenfor).

## Poengregler

| Øving | Poeng |
| --- | --- |
| Fullført flashcardbunke (alle kort kan) | 10 |
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
| Skoler fra NSR | `scripts/hent-skoler.mjs` (`npm run skoler`) → `supabase/skoler.sql` (1 658 skoler) |
| Typer | `src/lib/database.types.ts` (lagt inn for hånd – generer på nytt etter migrasjonen) |
| Bibliotek | `src/lib/konkurranse.ts` – med eksempeldata når migrasjonen ikke er kjørt |
| Sider | `/konkurranse` (poeng, ukeliste, skoleliste, regler) og `/belonninger` (innløsning, kodene dine) |
| Konto | Kallenavn, skole og «Vis meg på rangeringene» (`components/konkurranse/Konkurranseprofil.tsx`) |
| Formelmatch | Runden starter og slutter på serveren; resultatskjermen viser topplista for temaet |
| Varsel | «+12 poeng» nederst på skjermen etter øvinger (`components/Poengvarsel.tsx`) |
| Startsiden | Poengbrikke i menyen (skjult i produksjon til konkurransen er satt opp) |
| Juridisk | Utkast til punkt 9 i vilkårene og avsnitt i personvernerklæringen |

Uten migrasjonen viser sidene tydelig merkede eksempeldata (oppdiktede
kallenavn, skoler og partnere), så de kan prøves. Topplista i formelmatch og
poengbrikka på startsiden vises ikke i produksjon før databasen er klar.

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
- **Personvern.** Synlighet på rangeringer er av som standard. Bare kallenavn
  og skole vises, aldri navn eller e-post. Vurder en DPIA (personvernkonse-
  kvensvurdering) fordi brukerne er mindreårige, og oppdater datoene i
  personvernerklæringen og vilkårene når teksten publiseres.
- **Kallenavn.** Formatet sjekkes, men ikke innholdet. Legg inn en enkel
  filtrering og en «Rapporter kallenavn»-mulighet før lansering.
- **Partnere.** Det finnes ingen avtaler ennå. Sidene viser «Belønningene
  kommer snart» til ekte belønninger er lagt inn. Ikke vis logoer eller navn på
  partnere uten avtale.

## Lansering, steg for steg

1. Kjør migrasjonen og `supabase/skoler.sql` (Supabase SQL Editor).
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
