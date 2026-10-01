import Link from "next/link";
import { Avsnitt, Dokument } from "@/components/Dokument";
import { ALDERSGRENSE, KONTAKT_EPOST, PERSONVERN_OPPDATERT, driverTekst } from "@/lib/juridisk";
import { PROVEDAGER } from "@/lib/priser";
import { sideMetadata } from "@/lib/seo";

export const metadata = sideMetadata({
  tittel: "Personvernerklæring",
  googleTittel: "Personvernerklæring for Studer",
  beskrivelse: "Hvilke opplysninger Studer behandler om deg, hvorfor, hvem vi deler dem med, og hvordan du sletter kontoen din.",
  sti: "/personvern",
  indekser: true,
});

// Må stemme med det appen faktisk gjør. Endrer du noe om lagring, deling eller
// lagringstid (se supabase/migrations og supabase/functions), oppdater teksten
// og PERSONVERN_OPPDATERT i lib/juridisk.ts.
export default function Personvern() {
  const epost = <a href={`mailto:${KONTAKT_EPOST}`}>{KONTAKT_EPOST}</a>;
  return (
    <Dokument
      tittel="Personvernerklæring"
      oppdatert={PERSONVERN_OPPDATERT}
      kortFortalt={[
        "Vi samler bare inn det vi trenger for å gi deg konto, øvinger og abonnement.",
        "Vi selger aldri opplysninger om deg, og vi viser ikke reklame.",
        "Vi bruker ingen verktøy for sporing eller analyse.",
        <>
          Du kan slette kontoen din selv under <Link href="/konto" className="text-primary font-medium">Min konto</Link>. Da
          slettes nesten alt med en gang.
        </>,
        <>Har du spørsmål, skriv til {epost}.</>,
      ]}
    >
      <Avsnitt nr={1} tittel="Hvem som er ansvarlig">
        <p>
          Studer (studer.no) drives av {driverTekst()}. Vi er behandlingsansvarlige for personopplysningene som
          behandles når du bruker Studer. Du når oss på {epost}.
        </p>
      </Avsnitt>

      <Avsnitt nr={2} tittel="Hva vi behandler, og hvorfor">
        <p>
          <strong>Kontoen din.</strong> E-postadresse, fornavn, passord og når kontoen ble laget. Passordet lagres
          kryptert, så vi kan ikke se det. Vi bruker dette for å logge deg inn og vise deg din egen fremdrift.
          Grunnlaget er avtalen med deg (personvernforordningen artikkel 6 nr. 1 bokstav b).
        </p>
        <p>
          <strong>Øving og fremdrift.</strong> Resultatene dine i flashcards, quiz og miniprøver, og når du øvde sist,
          så du kan se hvor langt du har kommet. Grunnlaget er avtalen med deg.
        </p>
        <p>
          <strong>AI-hjelp og retting av skriveoppgaver.</strong> Det du skriver til AI-hjelpen, og svarene dine på
          skriveoppgavene i miniprøven, sendes til OpenAI for å lage svar og retting. Vi lagrer ikke samtalene eller
          svarene dine. Vi lagrer bare poengsummen fra miniprøven, og hvor mange meldinger og rettinger du har brukt per
          dag, slik at ingen kan misbruke tjenesten. Grunnlaget er avtalen med deg, og for tellerne vår berettigede
          interesse i å hindre misbruk (artikkel 6 nr. 1 bokstav f). Ikke skriv personopplysninger, som fullt navn,
          telefonnummer eller helseopplysninger, til AI-hjelpen.
        </p>
        <p>
          <strong>Abonnement og betaling.</strong> Hvilket abonnement du har, når det fornyes eller avsluttes, og en
          kunde-ID fra betalingsløsningen Stripe. Kortnummeret ditt håndteres av Stripe, og vi ser det aldri.
          Grunnlaget er avtalen med deg, og for regnskapet bokføringsloven (artikkel 6 nr. 1 bokstav c).
        </p>
        <p>
          <strong>Kontroll av prøveperioden.</strong> Hver person skal bare få én gratis prøveperiode på {PROVEDAGER}{" "}
          dager. Derfor lagrer vi en kryptografisk sjekksum av e-postadressen din og et kortfingeravtrykk fra Stripe.
          Kortfingeravtrykket er en kode som kjenner igjen samme kort, men som ikke er kortnummeret. Dette blir liggende
          også etter at kontoen er slettet, i inntil 2 år. Grunnlaget er vår berettigede interesse i å hindre misbruk av
          prøveperioden.
        </p>
        <p>
          <strong>Rapporter og forslag.</strong> Når du rapporterer et kort eller et spørsmål, eller sender oss et
          forslag, lagrer vi det sammen med kontoen din. Vi bruker det til å rette feil og gjøre Studer bedre.
          Grunnlaget er vår berettigede interesse i å forbedre tjenesten.
        </p>
        <p>
          <strong>E-post til oss.</strong> Det du skriver når du kontakter oss, bruker vi for å svare deg.
        </p>
        <p>
          <strong>Tekniske data.</strong> IP-adresse, nettlesertype og tidspunkter lagres en kort tid i serverloggene
          til leverandørene våre, for drift og sikkerhet. Grunnlaget er vår berettigede interesse i å holde tjenesten
          trygg og i gang.
        </p>
      </Avsnitt>

      <Avsnitt nr={3} tittel="Hvem vi deler opplysninger med">
        <p>
          Vi selger aldri opplysninger om deg. Vi bruker disse leverandørene, som behandler opplysninger på våre vegne
          etter en databehandleravtale:
        </p>
        <ul>
          <li>
            <strong>Supabase</strong>: database, innlogging og serverfunksjoner. Serverne står i USA.
          </li>
          <li>
            <strong>Vercel</strong>: driften av nettsiden.
          </li>
          <li>
            <strong>OpenAI</strong>: AI-hjelpen og rettingen av skriveoppgaver. OpenAI bruker ikke opplysningene til å
            trene modellene sine, og kan lagre dem i inntil 30 dager for å oppdage misbruk før de slettes.
          </li>
          <li>
            <strong>domene.no</strong>: e-posten vår, når du skriver til oss.
          </li>
        </ul>
        <p>
          <strong>Stripe</strong> håndterer betalingen og er selv ansvarlig for betalingsopplysningene. Les mer i{" "}
          <a href="https://stripe.com/no/privacy" rel="noopener noreferrer">
            Stripes personvernerklæring
          </a>
          .
        </p>
      </Avsnitt>

      <Avsnitt nr={4} tittel="Overføring ut av EØS">
        <p>
          Supabase, Vercel, OpenAI og Stripe er amerikanske selskaper, og opplysninger kan bli lagret eller behandlet i
          USA. Overføringen skjer på grunnlag av EU-kommisjonens standard personvernbestemmelser (Standard Contractual
          Clauses) og/eller EU–US Data Privacy Framework, som skal sikre at opplysningene er like godt beskyttet som i
          Norge.
        </p>
      </Avsnitt>

      <Avsnitt nr={5} tittel="Hvor lenge vi lagrer">
        <ul>
          <li>
            <strong>Kontoen og alt som hører til den</strong> (profil, fremdrift, rapporter og forslag): til du sletter
            kontoen. Da slettes det med en gang.
          </li>
          <li>
            <strong>Tellerne for AI-bruk</strong>: slettes etter 90 dager.
          </li>
          <li>
            <strong>Kontrollen av prøveperioden</strong> (sjekksum og kortfingeravtrykk): slettes etter 2 år.
          </li>
          <li>
            <strong>Betalingsopplysninger hos Stripe</strong>: så lenge bokføringsloven krever, normalt 5 år.
          </li>
          <li>
            <strong>Serverlogger</strong>: noen dager.
          </li>
        </ul>
      </Avsnitt>

      <Avsnitt nr={6} tittel="Barn og unge">
        <p>
          Du må være minst {ALDERSGRENSE} år for å lage konto på Studer. Er du under 18 år, må en forelder eller foresatt
          godkjenne at du kjøper abonnement.
        </p>
      </Avsnitt>

      <Avsnitt nr={7} tittel="Informasjonskapsler og lagring i nettleseren">
        <p>
          Vi bruker ingen informasjonskapsler for sporing, reklame eller analyse. Innloggingen din lagres i nettleseren
          (lokal lagring), så du slipper å logge inn hver gang. På betalingssiden bruker Stripe nødvendige
          informasjonskapsler for å hindre svindel.
        </p>
      </Avsnitt>

      <Avsnitt nr={8} tittel="Sikkerhet">
        <p>
          All trafikk til og fra Studer er kryptert (HTTPS). Hver bruker kan bare se sine egne opplysninger, og bare de
          som drifter Studer har tilgang til databasen.
        </p>
      </Avsnitt>

      <Avsnitt nr={9} tittel="Rettighetene dine">
        <p>Du har rett til å:</p>
        <ul>
          <li>få vite hvilke opplysninger vi har om deg (innsyn)</li>
          <li>få rettet feil</li>
          <li>få opplysningene slettet</li>
          <li>få en kopi av opplysningene i et vanlig filformat (dataportabilitet)</li>
          <li>protestere mot behandling vi gjør på grunnlag av berettiget interesse, og be om begrenset behandling</li>
        </ul>
        <p>
          Du sletter kontoen selv under <Link href="/konto">Min konto</Link>, nederst på siden. For alt annet, skriv til{" "}
          {epost}. Vi svarer innen 30 dager.
        </p>
        <p>
          Mener du at vi behandler opplysningene dine i strid med loven, kan du klage til{" "}
          <a href="https://www.datatilsynet.no" rel="noopener noreferrer">
            Datatilsynet
          </a>
          .
        </p>
      </Avsnitt>

      <Avsnitt nr={10} tittel="Endringer">
        <p>
          Vi oppdaterer personvernerklæringen når vi endrer hvordan vi behandler opplysninger. Større endringer varsler vi
          om på e-post eller i Studer før de gjelder.
        </p>
      </Avsnitt>
    </Dokument>
  );
}
