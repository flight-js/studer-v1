import Link from "next/link";
import { TELLING } from "@/lib/forsidedata";
import { ALDERSGRENSE, KONTAKT_EPOST, driverTekst } from "@/lib/juridisk";
import { ARLIG_SPARING, PRIS, PROVEDAGER } from "@/lib/priser";

// Spørsmål og svar: hele lista står på /hjelp, og et utvalg står på forsiden.
// Svarene må stemme med appen, bruksvilkårene og personvernerklæringen –
// endres noe der, endres det her også.

export type Sporsmal = { id: string; sporsmal: string; svar: React.ReactNode };

const epost = <a href={`mailto:${KONTAKT_EPOST}`}>{KONTAKT_EPOST}</a>;

export const SPORSMAL: { tittel: string; liste: Sporsmal[] }[] = [
  {
    tittel: "Om Studer",
    liste: [
      {
        id: "hva-er-studer",
        sporsmal: "Hva er Studer?",
        svar: (
          <p>
            Studer er et sted å øve til prøver. Hvert tema i hvert fag har flashcards, quiz og en miniprøve, og et
            sammendrag og et tankekart du kan lese først. Står du fast, kan du spørre AI-hjelpen om temaet.
          </p>
        ),
      },
      {
        id: "fag",
        sporsmal: "Hvilke fag finnes?",
        svar: (
          <p>
            {TELLING.fag} fag fra 8. trinn til Vg3, og påbygg. På videregående er det fellesfagene og de
            studieforberedende programfagene. <Link href="/fag">Se alle fagene</Link>. Mangler faget ditt, kan du{" "}
            <Link href="/forslag">sende oss et forslag</Link>.
          </p>
        ),
      },
      {
        id: "laereplan",
        sporsmal: "Følger innholdet læreplanen?",
        svar: (
          <p>
            Ja. Hvert tema er bygd på kompetansemålene i læreplanen (LK20) for faget og trinnet. Skolene velger ulike
            eksempler og går ulikt i dybden, så det ikke alle klasser lærer, er merket «Ekstra». Spør læreren hva som
            kommer på prøven.
          </p>
        ),
      },
      {
        id: "innhold",
        sporsmal: "Hvem har laget innholdet?",
        svar: (
          <p>
            Vi i Studer, etter læreplanene fra Utdanningsdirektoratet. En del av det er laget med hjelp av KI, og ikke
            alt er gjennomgått av lærere, så det kan finnes feil. Sjekk med læreboka når noe er viktig.
          </p>
        ),
      },
      {
        id: "feil",
        sporsmal: "Hva gjør jeg hvis noe er feil?",
        svar: (
          <p>
            Trykk «Rapporter» på kortet eller spørsmålet i flashcards, quiz eller miniprøven, og skriv hva som er galt.
            Vi leser rapportene og retter feilene vi finner.
          </p>
        ),
      },
      {
        id: "mobil",
        sporsmal: "Funker Studer på mobilen?",
        svar: (
          <p>
            Ja. Studer funker i nettleseren på mobil, nettbrett og PC, så du trenger ikke laste ned noe. Logg inn med
            samme konto, så har du alt med deg på alle enhetene.
          </p>
        ),
      },
      {
        id: "hvem",
        sporsmal: "Hvem står bak Studer?",
        svar: <p>Studer drives av {driverTekst()}.</p>,
      },
    ],
  },
  {
    tittel: "Pris og abonnement",
    liste: [
      {
        id: "pris",
        sporsmal: "Hva koster Studer?",
        svar: (
          <p>
            {PRIS.maned} kr i måneden eller {PRIS.ar} kr i året. Med årlig betaling sparer du {ARLIG_SPARING} kr. Ett
            abonnement gir tilgang til alle fag og alle trinn.
          </p>
        ),
      },
      {
        id: "proveperiode",
        sporsmal: "Hvordan funker prøveperioden?",
        svar: (
          <p>
            Første gang du tegner abonnement, får du {PROVEDAGER} dager gratis. Du legger inn et kort, men blir ikke
            belastet før prøveperioden er over. Avslutter du før det, betaler du ingenting – ellers fortsetter
            abonnementet med planen du valgte. Du får prøveperioden én gang per person og per kort.
          </p>
        ),
      },
      {
        id: "avslutte",
        sporsmal: "Hvordan avslutter jeg abonnementet?",
        svar: (
          <p>
            Gå til <Link href="/konto">Min konto</Link> → Administrer abonnement og trykk «Avslutt abonnementet». Du
            beholder tilgangen ut perioden du har betalt for, eller ut prøveperioden, og blir ikke belastet igjen.
          </p>
        ),
      },
      {
        id: "betale",
        sporsmal: "Hvordan kan jeg betale?",
        svar: (
          <p>
            Med kort, eller med Apple Pay eller Google Pay hvis telefonen eller nettleseren din har det. Betalingen
            håndteres av Stripe, og vi ser aldri kortnummeret ditt.
          </p>
        ),
      },
      {
        id: "under-18",
        sporsmal: "Jeg er under 18. Kan jeg kjøpe abonnement?",
        svar: (
          <p>
            Du må være minst {ALDERSGRENSE} år for å lage konto. Er du under 18, må en forelder eller foresatt godkjenne
            kjøpet, og det er lurt at de legger inn kortet selv.
          </p>
        ),
      },
      {
        id: "angre",
        sporsmal: "Kan jeg angre kjøpet?",
        svar: (
          <p>
            Ja, du har 14 dagers angrerett. Har du prøveperiode, avslutter du bare før den er over. Har du betalt med en
            gang fordi du har hatt prøveperiode før, skriv til {epost} innen 14 dager. Da trekker vi fra dagene du har
            hatt tilgang, og betaler tilbake resten. Les mer i <Link href="/vilkar#del-6">bruksvilkårene</Link>.
          </p>
        ),
      },
    ],
  },
  {
    tittel: "Øvingene",
    liste: [
      {
        id: "ai-hjelp",
        sporsmal: "Hva kan AI-hjelpen?",
        svar: (
          <p>
            På hvert tema kan du stille spørsmål og få ting forklart på en annen måte. Den svarer bare på spørsmål om
            faget. Svarene lages av en språkmodell og kan være feil, og det er en grense for hvor mye den kan brukes per
            dag.
          </p>
        ),
      },
      {
        id: "miniprove",
        sporsmal: "Hvordan rettes miniprøven?",
        svar: (
          <p>
            De raske spørsmålene rettes med en gang. Skriveoppgavene rettes av KI, som gir poeng, en tilbakemelding og
            et forslag til svar. Poengene er en pekepinn på hvordan du ligger an, ikke en karakter.
          </p>
        ),
      },
      {
        id: "ekstra",
        sporsmal: "Hva betyr «Ekstra»?",
        svar: (
          <p>
            At ikke alle klasser lærer dette. Det kan være eksempler som skolene velger ulikt, eller stoff som går litt
            over nivået for trinnet. Øv på det hvis klassen din har hatt det, eller hvis du vil lenger.
          </p>
        ),
      },
    ],
  },
  {
    tittel: "Konto og personvern",
    liste: [
      {
        id: "passord",
        sporsmal: "Jeg har glemt passordet.",
        svar: (
          <p>
            Trykk «Glemt passordet?» på <Link href="/logg-inn">innloggingssiden</Link>. Du får en kode på e-post, og
            med den kan du lage et nytt passord.
          </p>
        ),
      },
      {
        id: "personvern",
        sporsmal: "Hva lagrer dere om meg?",
        svar: (
          <p>
            Bare det vi trenger for å gi deg konto, øvinger og abonnement. Vi selger aldri opplysninger om deg, viser
            ikke reklame og bruker ingen verktøy for sporing. Alt står i{" "}
            <Link href="/personvern">personvernerklæringen</Link>.
          </p>
        ),
      },
      {
        id: "slette",
        sporsmal: "Hvordan sletter jeg kontoen?",
        svar: (
          <p>
            Under <Link href="/konto">Min konto</Link> → Slett konto. Har du abonnement, avsluttes det samtidig, og
            nesten alt om deg slettes med en gang.
          </p>
        ),
      },
      {
        id: "mork-modus",
        sporsmal: "Finnes det mørk modus?",
        svar: (
          <p>
            Ja. Studer følger innstillingen på telefonen eller PC-en, men du kan velge lys eller mørk selv nederst på
            siden eller under Min konto → Utseende.
          </p>
        ),
      },
    ],
  },
];

const ALLE = SPORSMAL.flatMap((g) => g.liste);

// Det folk lurer på før de prøver.
export const FORSIDE_SPORSMAL = ["proveperiode", "avslutte", "laereplan", "ai-hjelp", "under-18", "mobil"].map(
  (id) => ALLE.find((s) => s.id === id)!,
);
