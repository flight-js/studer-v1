import Link from "next/link";
import { Avsnitt, Dokument } from "@/components/Dokument";
import { ALDERSGRENSE, KONTAKT_EPOST, VILKAR_OPPDATERT, driverTekst } from "@/lib/juridisk";
import { PRIS, PROVEDAGER } from "@/lib/priser";
import { sideMetadata } from "@/lib/seo";

export const metadata = sideMetadata({
  tittel: "Bruksvilkår",
  googleTittel: "Bruksvilkår for Studer",
  beskrivelse: "Vilkårene for å bruke Studer: konto, abonnement, prøveperiode, angrerett og regler for bruk.",
  sti: "/vilkar",
  indekser: true,
});

export default function Vilkar() {
  const epost = <a href={`mailto:${KONTAKT_EPOST}`}>{KONTAKT_EPOST}</a>;
  return (
    <Dokument
      tittel="Bruksvilkår"
      oppdatert={VILKAR_OPPDATERT}
      kortFortalt={[
        "Studer er en øvingstjeneste for elever fra 8. trinn til Vg3, også påbygging til generell studiekompetanse.",
        `Du må være minst ${ALDERSGRENSE} år. Er du under 18, trenger du lov fra en forelder for å kjøpe abonnement.`,
        `De første ${PROVEDAGER} dagene er gratis. Avslutter du før prøveperioden er over, betaler du ingenting.`,
        "Du kan avslutte abonnementet når som helst under Min konto.",
        "Innholdet og svarene fra AI-hjelpen kan inneholde feil. Sjekk med læreboka og læreren når noe er viktig.",
      ]}
    >
      <Avsnitt nr={1} tittel="Om Studer">
        <p>
          Studer (studer.no) drives av {driverTekst()}. Studer har flashcards, quiz, miniprøver, sammendrag og AI-hjelp
          for fagene på ungdomsskolen og studiespesialisering, bygd på læreplanene (LK20). Studer er et hjelpemiddel til
          egen øving og erstatter ikke undervisningen.
        </p>
        <p>
          Når du lager konto, godtar du disse vilkårene. Hvordan vi behandler opplysninger om deg, står i{" "}
          <Link href="/personvern">personvernerklæringen</Link>.
        </p>
      </Avsnitt>

      <Avsnitt nr={2} tittel="Kontoen din">
        <ul>
          <li>Du må være minst {ALDERSGRENSE} år for å lage konto.</li>
          <li>Opplysningene du oppgir, skal være riktige.</li>
          <li>Kontoen er personlig. Ikke del innloggingen med andre.</li>
          <li>Hold passordet hemmelig, og si fra til oss hvis du tror noen andre har brukt kontoen din.</li>
          <li>
            Du kan slette kontoen når som helst under <Link href="/konto">Min konto</Link>.
          </li>
        </ul>
      </Avsnitt>

      <Avsnitt nr={3} tittel="Abonnement og betaling">
        <p>
          Øvingene og AI-hjelpen krever abonnement. Abonnementet koster {PRIS.maned} kr per måned eller {PRIS.ar} kr per
          år. Gjeldende priser står alltid på studer.no og på betalingssiden.
        </p>
        <ul>
          <li>
            Du betaler med kort eller en annen betalingsmåte som vises på betalingssiden. Betalingen håndteres av Stripe.
          </li>
          <li>
            Abonnementet fornyes automatisk hver måned eller hvert år, til du avslutter det. Du blir belastet ved
            starten av hver periode.
          </li>
          <li>
            Er du under 18 år, må en forelder eller foresatt ha godkjent kjøpet.
          </li>
          <li>
            Endrer vi prisen, varsler vi deg minst 30 dager før. Den nye prisen gjelder fra neste periode, og du kan
            avslutte før den begynner å gjelde.
          </li>
        </ul>
      </Avsnitt>

      <Avsnitt nr={4} tittel="Prøveperiode">
        <p>
          Første gang du tegner abonnement, får du {PROVEDAGER} dager gratis. Du registrerer et betalingskort, men blir
          først belastet når prøveperioden er over. Avslutter du før det, betaler du ingenting.
        </p>
        <p>
          Hver person kan bare få én prøveperiode. For å sikre dette kontrollerer vi e-postadressen og betalingskortet,
          som beskrevet i personvernerklæringen. En prøveperiode som bryter denne regelen, blir avsluttet uten at du blir
          belastet.
        </p>
      </Avsnitt>

      <Avsnitt nr={5} tittel="Avslutte abonnementet">
        <p>
          Du kan avslutte når som helst under <Link href="/konto">Min konto</Link> → Administrer abonnement. Du beholder
          tilgangen ut perioden du har betalt for, og abonnementet fornyes ikke igjen. Du får ikke penger tilbake for en
          periode som har begynt, med mindre du bruker angreretten eller det er feil ved tjenesten.
        </p>
      </Avsnitt>

      <Avsnitt nr={6} tittel="Angrerett">
        <p>
          Du har 14 dagers angrerett etter angrerettloven fra du inngår avtalen. Med prøveperiode blir du ikke belastet
          hvis du avslutter i løpet av de første {PROVEDAGER} dagene.
        </p>
        <p>
          Betaler du uten prøveperiode, fordi du har hatt det før, kan du likevel angre innen 14 dager. Siden du får
          tilgang med en gang, trekker vi fra et beløp for dagene du har hatt tilgang, og betaler tilbake resten innen 14
          dager. For å angre, skriv til {epost}.
        </p>
      </Avsnitt>

      <Avsnitt nr={7} tittel="Regler for bruk">
        <p>Studer er for din egen læring. Du skal ikke:</p>
        <ul>
          <li>kopiere, dele eller selge innholdet i Studer i større omfang</li>
          <li>hente ut innhold automatisk, for eksempel med roboter eller skript</li>
          <li>prøve å komme rundt låser, grenser eller sikkerhet</li>
          <li>bruke AI-hjelpen til annet enn skolearbeid, eller prøve å få den til å lage skadelig innhold</li>
          <li>skrive personopplysninger om andre i AI-hjelpen, rapporter eller forslag</li>
        </ul>
        <p>Bryter du reglene, kan vi stenge kontoen din.</p>
      </Avsnitt>

      <Avsnitt nr={8} tittel="AI-hjelp og retting">
        <p>
          Svarene fra AI-hjelpen og rettingen av skriveoppgaver lages automatisk av en språkmodell, og de kan være feil.
          Poengene i miniprøven er en pekepinn på hvordan du ligger an, ikke en karakter. For at tjenesten skal fungere
          for alle, er det en grense for hvor mye AI-hjelpen kan brukes per dag.
        </p>
      </Avsnitt>

      <div id="poeng" className="scroll-mt-24">
        <Avsnitt nr={9} tittel="Poeng, konkurranse og belønninger">
          <p>
            Du får poeng når du øver i Studer, etter reglene som står på siden Konkurranse. Hver øving gir poeng høyst
            én gang per døgn, og det er et tak på hvor mange poeng du kan få per dag. Ny personlig rekord i formelmatch
            gir bonuspoeng som ikke teller mot taket, høyst tre ganger per dag.
          </p>
          <ul>
            <li>Poengene har ingen pengeverdi. De kan ikke kjøpes, selges, overføres til andre eller veksles i penger.</li>
            <li>
              Poengene kan løses inn i belønninger så lenge det finnes belønninger. Kontoen må være minst en uke gammel.
            </li>
            <li>
              Gratis tid gjør at perioden du er i, varer like mange dager lenger, så neste betaling og betalingene
              etter den kommer like mange dager senere. Gratis tid kan løses inn én gang i måneden mens abonnementet
              fortsetter, og kan ikke byttes i penger.
            </li>
            <li>
              Gir du en venn en gratis uke, skriver du vennens e-postadresse, og vi sender vennen én e-post med
              fornavnet ditt. Lager vennen konto med den adressen og løser inn gaven, får hen tilgang til alt i en
              uke uten å legge inn betalingsmåte, hvis hen ikke har hatt abonnement eller prøveperiode før. Hver person
              kan bare få én gave. Du kan ha høyst tre ubrukte gaver om gangen, og brukes en gave ikke innen 60 dager,
              får du poengene tilbake. Send bare gaver til folk du kjenner.
            </li>
            <li>
              Ting i appen (som flammefarger, konfetti og merker ved navnet) er dine så lenge du har kontoen, men har
              ingen verdi utenfor Studer.
            </li>
            <li>
              En rekke-frys brukes av seg selv natten etter en dag du ikke har øvd, hvis du hadde dager på rad. Du
              kan ha høyst to om gangen, og en brukt frys kommer ikke tilbake. Merker du tjener ved å øve, kan ikke
              kjøpes eller byttes, og kan tas bort hvis de er oppnådd ved juks.
            </li>
            <li>
              Belønninger fra samarbeidspartnere har egne vilkår fra partneren og kan løses inn én gang per person.
            </li>
            <li>
              Velger du skole, er du med i skolekonkurransen, som bare viser tall per skole. På rangeringene vises
              fornavnet ditt, eller et kallenavn hvis du har valgt å skjule fornavnet.
            </li>
            <li>
              Kallenavnet kan ikke være støtende, for eksempel banneord, seksuelle ord, slurs eller hets, og kan ikke
              utgi seg for å være Studer eller noen andre. Studer kan fjerne et kallenavn som bryter med dette.
            </li>
            <li>
              Juks, for eksempel automatiske svar eller flere kontoer for å samle poeng, kan gi tap av poeng, fjerning
              fra rangeringene og at kontoen stenges.
            </li>
            <li>
              Sletter du kontoen, forsvinner poengene. Vi kan endre reglene for poeng og belønninger, og hvis vi
              avslutter ordningen, sier vi fra i god tid, så du kan bruke poengene dine.
            </li>
          </ul>
        </Avsnitt>
      </div>

      <Avsnitt nr={10} tittel="Innhold og rettigheter">
        <p>
          Tekstene, kortene, spørsmålene og utseendet i Studer tilhører oss. Du kan bruke dem til din egen læring.
          Kompetansemålene er hentet fra læreplanene til Utdanningsdirektoratet.
        </p>
        <p>
          Rapporter og forslag du sender oss, kan vi bruke fritt til å gjøre Studer bedre.
        </p>
      </Avsnitt>

      <Avsnitt nr={11} tittel="Feil, drift og ansvar">
        <p>
          Vi jobber for at innholdet skal være riktig og følge læreplanene. En del av innholdet er laget med hjelp av KI,
          og ikke alt er gjennomgått av lærere, så det kan inneholde feil. Finner du en feil, bruk «Rapporter»-knappen.
          Vi kan ikke garantere et bestemt resultat på prøver eller eksamen.
        </p>
        <p>
          Vi prøver å holde Studer tilgjengelig hele tiden, men det kan bli avbrudd, for eksempel ved vedlikehold. Er
          tjenesten nede i lengre tid, ta kontakt. Rettighetene du har etter ufravikelig forbrukerlovgivning, som
          digitalytelsesloven, gjelder uansett.
        </p>
        <p>
          Legger vi ned Studer, varsler vi minst 30 dager før og betaler tilbake for tid du har betalt for, men ikke
          fått brukt.
        </p>
      </Avsnitt>

      <Avsnitt nr={12} tittel="Endringer i vilkårene">
        <p>
          Vi kan endre vilkårene. Større endringer varsler vi om på e-post eller i Studer minst 30 dager før de gjelder.
        </p>
      </Avsnitt>

      <Avsnitt nr={13} tittel="Spørsmål og uenighet">
        <p>
          Norsk lov gjelder for avtalen. Er du misfornøyd, skriv til {epost}, så prøver vi å finne en løsning. Kommer vi
          ikke til enighet, kan du få hjelp av{" "}
          <a href="https://www.forbrukerradet.no" rel="noopener noreferrer">
            Forbrukerrådet
          </a>
          .
        </p>
      </Avsnitt>
    </Dokument>
  );
}
