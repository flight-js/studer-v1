// Bygger trinnet «Påbygg» (Vg3 påbygging til generell studiekompetanse) av
// temaer vi allerede har, etter Udirs kompetansemål for påbygg:
//
//   Norsk (NOR01-08 KV1115)        = målene for Vg2 + Vg3 studieforberedende, ordrett
//   Historie (HIS01-03 KV86)       = utvalg av Vg2/Vg3-målene, noen slått sammen
//   Matematikk 2P-Y (MAT06-04 KV47) = mål fra 1P og 2P, ordrett
//   Naturfag (NAT01-05 KV1090)     = 10 av de 16 målene i Vg1 studieforberedende, ordrett
//
// Hvert tema kopieres med fagId/trinnId for påbygg og kompetansemålnumrene i
// påbyggplanen (KILDER under – én linje per tema, så koblingen kan sjekkes).
// Temaer med mål som ikke er i påbygg, er utelatt. Naturfagtemaet om metode
// er kortet ned (eget forsøk, risikovurdering og avfall er ikke med i påbygg).
// Kompetansemålene hentes fra scripts/innhold/lk20/ (lk20-hent.mjs).
//
//   node scripts/innhold/lag-pabygg.mjs
//
// Kan kjøres på nytt: temaene skrives på nytt, et eksisterende
// repetisjonstema (npm run content:repetisjon) beholdes.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROT = fileURLToPath(new URL("../../", import.meta.url));
const INNHOLD = join(ROT, "content");
const LK20 = join(ROT, "scripts/innhold/lk20");
const TRINN = { id: "pabygg", navn: "Påbygg", skoleniva: "vgs" };
const les = (fil) => JSON.parse(readFileSync(fil, "utf8"));

// [kildefil under content/, påbyggmål temaet dekker]
const FAG = [
  {
    id: "norsk-pabygg",
    navn: "Norsk",
    kode: "NOR01-08",
    kv: "KV1115",
    // Påbyggmål 1–9 = Vg2-målene 1–9, påbyggmål 10–19 = Vg3-målene 1–10.
    kilder: [
      ["vg2/norsk-vg2/01-norron-litteratur.json", [1]],
      ["vg2/norsk-vg2/02-renessanse-barokk-og-opplysningstid.json", [2]],
      ["vg2/norsk-vg2/03-romantikken.json", [3, 2]],
      ["vg2/norsk-vg2/04-retorisk-situasjon.json", [4]],
      ["vg2/norsk-vg2/05-fagartikkel-om-tekster-i-kontekst.json", [5, 6]],
      ["vg2/norsk-vg2/06-muntlig-framforing.json", [7]],
      ["vg2/norsk-vg2/07-nordiske-sprak-og-norront.json", [8]],
      ["vg2/norsk-vg2/08-sprakhistorie-og-sprakstriden.json", [9]],
      ["vg3/norsk-vg3/01-realismen.json", [10, 11]],
      ["vg3/norsk-vg3/02-naturalismen-og-nyromantikken.json", [10, 11]],
      ["vg3/norsk-vg3/03-mellomkrigstiden.json", [10, 11]],
      ["vg3/norsk-vg3/04-modernismen-etter-1945.json", [10, 11]],
      ["vg3/norsk-vg3/05-samtidslitteratur.json", [10]],
      ["vg3/norsk-vg3/06-essay.json", [12]],
      ["vg3/norsk-vg3/07-litterar-tolkning-og-sammenligning.json", [13]],
      ["vg3/norsk-vg3/08-retorisk-analyse-av-sakprosa.json", [16]],
      ["vg3/norsk-vg3/09-sammensatte-tekster.json", [14]],
      ["vg3/norsk-vg3/10-fagartikkel-og-kildebruk.json", [18, 17]],
      ["vg3/norsk-vg3/11-muntlig-fordypning.json", [15]],
      ["vg3/norsk-vg3/12-talesprak-i-endring.json", [19]],
    ],
  },
  {
    id: "historie-pabygg",
    navn: "Historie",
    kode: "HIS01-03",
    kv: "KV86",
    // Utelatt: Vg2 «Historie som fag: kilder og periodisering» (periodisering
    // er ikke med; kildearbeid dekkes av Vg3 «Historisk metode»), Vg2
    // «Kommunikasjon og kulturmøter» og Vg3 «Mennesket, naturen og ressursene».
    kilder: [
      ["vg3/historie-vg3/01-historiebruk-og-fortolkning.json", [1, 3]],
      ["vg3/historie-vg3/02-historisk-metode-og-framstillinger.json", [4, 6]],
      ["vg3/historie-vg3/03-personer-og-handlingsrom.json", [5, 17]],
      ["vg3/historie-vg3/04-brudd-og-kontinuitet.json", [2]],
      ["vg2/historie-vg2/02-minnekultur.json", [3]],
      ["vg2/historie-vg2/03-mat-og-naturressurser.json", [7]],
      ["vg2/historie-vg2/04-demografiske-endringer.json", [8]],
      ["vg2/historie-vg2/05-handel-og-okonomi.json", [9]],
      ["vg2/historie-vg2/06-demokrati-for-og-na.json", [10]],
      ["vg2/historie-vg2/08-makt-og-legitimitet.json", [10]],
      ["vg2/historie-vg2/09-religion-og-makt.json", [11]],
      ["vg3/historie-vg3/05-ideologier-og-politiske-omveltninger.json", [12]],
      ["vg3/historie-vg3/06-teknologiske-omveltninger.json", [13]],
      ["vg3/historie-vg3/07-migrasjon-og-kulturmoter.json", [14]],
      ["vg3/historie-vg3/08-kolonialisme-og-imperialisme.json", [15]],
      ["vg3/historie-vg3/09-verdenskrigene-og-fred.json", [16]],
      ["vg3/historie-vg3/10-undertrykkelse-og-folkemord.json", [18]],
      ["vg3/historie-vg3/11-nasjonal-identitet.json", [19]],
      ["vg3/historie-vg3/12-myndiggjoring-og-frigjoring.json", [20]],
      ["vg3/historie-vg3/13-velferdsstaten.json", [21]],
    ],
  },
  {
    id: "matematikk-2py",
    navn: "Matematikk 2P-Y",
    kode: "MAT06-04",
    kv: "KV47",
    // Utelatt (ikke i 2P-Y): 1P promille, rente og lån, sammensatte
    // måleenheter; 2P indeks og reallønn, lån og kredittkort, likninger,
    // formlikhet.
    kilder: [
      ["vg1/matematikk-1p/01-potenser-og-standardform.json", [8]],
      ["vg2/matematikk-2p/01-prosent-vekstfaktor-og-regneark.json", [7]],
      ["vg1/matematikk-1p/04-proporsjonalitet.json", [5]],
      ["vg1/matematikk-1p/06-formler-og-variabler.json", [6, 4]],
      ["vg1/matematikk-1p/07-funksjoner-og-grafer.json", [10]],
      ["vg1/matematikk-1p/08-matematisk-modellering.json", [9, 1, 4]],
      ["vg2/matematikk-2p/05-sentralmal-og-spredningsmal.json", [3]],
      ["vg2/matematikk-2p/06-statistikk-analyse-og-presentasjon.json", [2]],
    ],
  },
  {
    id: "naturfag-pabygg",
    navn: "Naturfag",
    kode: "NAT01-05",
    kv: "KV1090",
    // Utelatt (ikke i påbygg): kjemiske bindinger, karbonforbindelser,
    // kosthold og helse.
    kilder: [
      ["vg1/naturfag-vg1/01-naturvitenskapelig-metode.json", [1], kortNedMetode],
      ["vg1/naturfag-vg1/02-programmering-og-modellering.json", [2]],
      ["vg1/naturfag-vg1/05-universets-opprinnelse.json", [3]],
      ["vg1/naturfag-vg1/04-straling.json", [4]],
      ["vg1/naturfag-vg1/03-bolger-og-tradlos-kommunikasjon.json", [5, 6]],
      ["vg1/naturfag-vg1/10-arv-og-evolusjon.json", [7, 8]],
      ["vg1/naturfag-vg1/11-bioteknologi.json", [9]],
      ["vg1/naturfag-vg1/08-miljogifter.json", [10]],
    ],
  },
];

// Metodetemaet fra Vg1 dekker også «selvvalgt problemstilling» og
// «risikovurdere egne forsøk og håndtere avfallet», som ikke er med i
// påbygg. Påbyggmål 1: «drøfte hvordan utvikling av naturvitenskapelige
// hypoteser, modeller og teorier bidrar til at vi kan forstå og forklare verden».
function kortNedMetode(t) {
  const ut = (liste, ider) => liste.filter((x) => !ider.includes(x.id));
  const deler = t.sammendrag.split(/\n(?=## )/);
  const behold = deler.filter((d) => !/^## (Eget forsøk|Risikovurdering|Avfall)/.test(d));
  if (deler.length - behold.length !== 3) throw new Error("metodetemaet: fant ikke de tre delene som skal ut");
  behold.push(
    [
      "## Hvordan modeller og teorier hjelper oss",
      "",
      "Hypoteser, modeller og teorier gjør det mulig å **forklare** det vi har observert og **forutsi** det som vil skje. **Klimamodeller** brukes til å beregne hvordan temperaturen kan endre seg ved ulike utslipp. **Evolusjonsteorien** forklarer hvorfor arter er i slekt, og hvorfor bakterier kan bli **resistente** mot antibiotika.",
      "",
      "Samtidig har alle modeller **begrensninger**: De forenkler virkeligheten og gjelder bare under visse forutsetninger. Når vi drøfter en modell, spør vi derfor hva den forklarer godt, hva den utelater, og hvor sikre resultatene er.",
    ].join("\n"),
  );
  const fjernBegreper = ["Risikovurdering", "Sikkerhetsdatablad", "Avtrekksskap", "Tungmetallavfall"];
  if (t.flashcards.filter((f) => fjernBegreper.includes(f.term)).length !== 4) throw new Error("metodetemaet: begrepene");
  const quiz = ut(t.quiz, ["q07", "q10"]);
  quiz.push(
    {
      id: "q11",
      text: "Hva gjør det mulig for forskere å forutsi framtidens klima?",
      options: [
        "Måleserier som bare viser dagens temperatur",
        "Fagfellevurdering av gamle værmeldinger",
        "Klimamodeller basert på fysiske lover og data",
        "Observasjoner av været fra én enkelt dag",
      ],
      correct: 2,
      explain: "Klimamodeller bygger på fysiske lover og målinger og kan beregne hvordan klimaet endrer seg ved ulike utslipp.",
    },
    {
      id: "q12",
      text: "Hva bør du spørre om når du drøfter en naturvitenskapelig modell?",
      options: [
        "Om modellen er laget av en kjent forsker",
        "Hva modellen forklarer, og hva den utelater",
        "Om modellen er laget på en datamaskin",
        "Hvor mange ganger modellen er tegnet",
      ],
      correct: 1,
      explain: "Alle modeller forenkler. En god drøfting vurderer hva modellen forklarer, hvilke begrensninger den har og hvor sikre resultatene er.",
    },
  );
  const ekstra = ut(t.miniprove.ekstra, ["m04", "m06", "m07"]);
  ekstra.push({
    id: "m08",
    type: "flervalg",
    text: "Hvordan forklarer evolusjonsteorien at bakterier blir resistente mot antibiotika?",
    options: [
      "De som tåler stoffet, overlever og formerer seg",
      "Stoffet gjør hver bakterie sterkere over tid",
      "Bakteriene lærer seg å unngå stoffet bevisst",
      "Stoffet gir alle bakteriene det samme nye genet",
    ],
    correct: 0,
    explain: "Naturlig utvalg: Bakterier som tilfeldigvis tåler antibiotika, overlever og får flere etterkommere.",
  });
  return {
    ...t,
    id: "hypoteser-modeller-og-teorier",
    name: "Hypoteser, modeller og teorier",
    intro:
      "Hvordan naturvitenskapen arbeider med hypoteser, forsøk, modeller og teorier, og hvordan dette hjelper oss å forstå, forklare og forutsi.",
    sammendrag: behold.join("\n"),
    flashcards: [
      ...t.flashcards.filter((f) => !fjernBegreper.includes(f.term)),
      { term: "Klimamodell", def: "Modell som beregner hvordan klimaet kan endre seg, basert på fysiske lover og data." },
    ],
    quiz,
    mindmap: {
      ...t.mindmap,
      children: [
        ...t.mindmap.children.filter((g) => g.label !== "Sikkerhet"),
        { label: "Bruk", children: [{ label: "Forklare" }, { label: "Forutsi" }, { label: "Begrensninger" }] },
      ],
    },
    miniprove: {
      ...t.miniprove,
      quizRefs: ["q01", "q02", "q03", "q04", "q05", "q06", "q08", "q09", "q11", "q12"],
      ekstra,
      skriv: ut(t.miniprove.skriv, ["s07"]),
    },
  };
}

const katalog = les(join(INNHOLD, "katalog.json"));
for (const fag of FAG) {
  const plan = les(join(LK20, `${fag.kode}.json`));
  const sett = plan.sett.find((s) => s.kode === fag.kv);
  if (!sett) throw new Error(`${fag.kode}: fant ikke ${fag.kv}`);
  const mappe = join(INNHOLD, TRINN.id, fag.id);
  mkdirSync(mappe, { recursive: true });

  // Behold et repetisjonstema som allerede er laget; resten skrives på nytt.
  const repetisjon = existsSync(mappe) ? readdirSync(mappe).find((f) => /^\d+-repetisjon\.json$/.test(f)) : null;
  for (const f of readdirSync(mappe)) if (/^\d+-.*\.json$/.test(f) && f !== repetisjon) rmSync(join(mappe, f));

  const temaer = [];
  const dekket = new Set();
  fag.kilder.forEach(([kilde, maal, endre], i) => {
    for (const m of maal) {
      if (!(m >= 1 && m <= sett.maal.length)) throw new Error(`${fag.id}: mål ${m} finnes ikke`);
      dekket.add(m);
    }
    let tema = les(join(INNHOLD, kilde));
    if (endre) tema = endre(tema);
    tema = { ...tema, fagId: fag.id, trinnId: TRINN.id, kompetansemaal: maal };
    if (temaer.includes(tema.id)) throw new Error(`${fag.id}: to temaer med id ${tema.id}`);
    temaer.push(tema.id);
    writeFileSync(join(mappe, `${String(i + 1).padStart(2, "0")}-${tema.id}.json`), JSON.stringify(tema, null, 2) + "\n");
  });
  const mangler = sett.maal.map((_, i) => i + 1).filter((m) => !dekket.has(m));
  if (mangler.length) throw new Error(`${fag.id}: kompetansemål uten tema: ${mangler.join(", ")}`);

  if (repetisjon) {
    // Repetisjonstemaet skal stå sist; nummeret følger antall temaer.
    const nytt = `${String(temaer.length + 1).padStart(2, "0")}-repetisjon.json`;
    if (nytt !== repetisjon) {
      writeFileSync(join(mappe, nytt), readFileSync(join(mappe, repetisjon)));
      rmSync(join(mappe, repetisjon));
    }
    temaer.push("repetisjon");
  }

  writeFileSync(
    join(mappe, "_fag.json"),
    JSON.stringify(
      {
        id: fag.id,
        trinnId: TRINN.id,
        name: fag.navn,
        lareplan: {
          kode: fag.kode,
          url: `https://www.udir.no/lk20/${fag.kode.toLowerCase()}/kompetansemaal-og-vurdering/${fag.kv.toLowerCase()}`,
          kompetansemaal: sett.maal.map((tekst, i) => ({ nr: i + 1, tekst })),
        },
        temaer,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(`${fag.id}: ${temaer.length} temaer, alle ${sett.maal.length} kompetansemål dekket`);
}

// Påbygg står rett etter Vg3 i katalogen.
const trinn = { ...TRINN, fag: FAG.map((f) => ({ id: f.id, navn: f.navn })) };
const finnes = katalog.trinn.findIndex((t) => t.id === TRINN.id);
if (finnes >= 0) katalog.trinn[finnes] = trinn;
else katalog.trinn.splice(katalog.trinn.findIndex((t) => t.id === "vg3") + 1, 0, trinn);
// Samme formatering som før: hvert fag på én linje.
const katalogTekst = JSON.stringify(katalog, null, 2).replace(
  /\{\s+"id": ("[^"]*"),\s+"navn": ("[^"]*")\s+\}/g,
  "{ \"id\": $1, \"navn\": $2 }",
);
writeFileSync(join(INNHOLD, "katalog.json"), katalogTekst + "\n");
console.log("katalog.json: Påbygg etter Vg3");
