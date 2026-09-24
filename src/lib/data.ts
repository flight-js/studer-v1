// Innholdsdata for Studer – v1 (kun Kjemi 1 / Kjemiske reaksjoner har ekte innhold,
// resten er navigerbart, men markert som "Kommer snart").

export type Fag = {
  id: string;
  name: string;
  temaCount: number;
};

export type Trinn = {
  id: string;
  label: string;
  fag: Fag[];
};

export type Tema = {
  fagId: string;
  name: string;
  progress: number;
  live: boolean;
};

export const trinnListe: Trinn[] = [
  {
    id: "8",
    label: "8. trinn",
    fag: [
      { id: "m8", name: "Matematikk", temaCount: 9 },
      { id: "n8", name: "Naturfag", temaCount: 8 },
      { id: "sf8", name: "Samfunnsfag", temaCount: 6 },
    ],
  },
  {
    id: "9",
    label: "9. trinn",
    fag: [
      { id: "m9", name: "Matematikk", temaCount: 9 },
      { id: "n9", name: "Naturfag", temaCount: 8 },
      { id: "sf9", name: "Samfunnsfag", temaCount: 6 },
    ],
  },
  {
    id: "10",
    label: "10. trinn",
    fag: [
      { id: "m10", name: "Matematikk", temaCount: 9 },
      { id: "n10", name: "Naturfag", temaCount: 8 },
      { id: "sf10", name: "Samfunnsfag", temaCount: 6 },
    ],
  },
  {
    id: "vg1",
    label: "Vg1",
    fag: [
      { id: "naturfag", name: "Naturfag", temaCount: 8 },
      { id: "matte1t", name: "Matematikk 1T", temaCount: 10 },
      { id: "samf", name: "Samfunnskunnskap", temaCount: 6 },
    ],
  },
  {
    id: "vg2",
    label: "Vg2",
    fag: [
      { id: "kjemi1", name: "Kjemi 1", temaCount: 9 },
      { id: "r1", name: "Matematikk R1", temaCount: 11 },
      { id: "historie", name: "Historie", temaCount: 7 },
      { id: "rettslare", name: "Rettslære 1", temaCount: 8 },
      { id: "fysikk1", name: "Fysikk 1", temaCount: 9 },
      { id: "sok", name: "Samfunnsøkonomi 1", temaCount: 6 },
    ],
  },
  {
    id: "vg3",
    label: "Vg3",
    fag: [
      { id: "kjemi2", name: "Kjemi 2", temaCount: 8 },
      { id: "r2", name: "Matematikk R2", temaCount: 10 },
      { id: "psyk2", name: "Psykologi 2", temaCount: 7 },
    ],
  },
];

export const temaByFag: Record<string, Tema[]> = {
  kjemi1: [
    { fagId: "kjemi1", name: "Kjemiske reaksjoner", progress: 60, live: true },
    { fagId: "kjemi1", name: "Organisk kjemi", progress: 0, live: false },
    { fagId: "kjemi1", name: "Syrer og baser", progress: 0, live: false },
    { fagId: "kjemi1", name: "Redoksreaksjoner", progress: 0, live: false },
  ],
  r1: [
    { fagId: "r1", name: "Derivasjon", progress: 0, live: false },
    { fagId: "r1", name: "Vektorer", progress: 0, live: false },
  ],
  historie: [
    { fagId: "historie", name: "Den kalde krigen", progress: 0, live: false },
  ],
  rettslare: [
    { fagId: "rettslare", name: "Avtaleinngåelse", progress: 0, live: false },
  ],
  fysikk1: [
    { fagId: "fysikk1", name: "Bevegelse og krefter", progress: 0, live: false },
  ],
  sok: [
    { fagId: "sok", name: "Tilbud og etterspørsel", progress: 0, live: false },
  ],
};

export const subjectChips = [
  "Matematikk R1",
  "Kjemi 1",
  "Fysikk 1",
  "Historie",
  "Rettslære 1",
  "Samfunnsøkonomi 1",
  "Norsk",
  "Engelsk",
  "Biologi 1",
  "Psykologi 1",
];

// Kjemiske reaksjoner – eneste temaet med ekte innhold i v1.

export type QuizQuestion = {
  text: string;
  options: string[];
  correct: number;
  explain: string;
};

export const kjemiskeReaksjonerQuiz: QuizQuestion[] = [
  {
    text: "Hva kalles en reaksjon der energi frigjøres til omgivelsene?",
    options: [
      "Eksoterm reaksjon",
      "Endoterm reaksjon",
      "Katalytisk reaksjon",
      "Reversibel reaksjon",
    ],
    correct: 0,
    explain:
      "Riktig! I en eksoterm reaksjon frigjøres energi, oftest som varme, til omgivelsene.",
  },
  {
    text: "Hva gjør en katalysator med reaksjonsfarten?",
    options: [
      "Senker den",
      "Øker den, uten selv å bli forbrukt",
      "Stopper reaksjonen",
      "Endrer produktet",
    ],
    correct: 1,
    explain:
      "Riktig! En katalysator øker reaksjonsfarten ved å senke aktiveringsenergien, og forbrukes ikke selv.",
  },
  {
    text: "Hva menes med kjemisk likevekt?",
    options: [
      "Reaksjonen har stoppet helt",
      "Forover- og bakoverreaksjonen skjer like raskt",
      "Alle reaktanter er brukt opp",
      "Temperaturen er konstant",
    ],
    correct: 1,
    explain:
      "Riktig! Ved likevekt skjer forover- og bakoverreaksjonen med samme hastighet, så konsentrasjonene endrer seg ikke.",
  },
  {
    text: "Hva menes med aktiveringsenergi?",
    options: [
      "Energien som frigjøres i en reaksjon",
      "Den minste energimengden som trengs for at en reaksjon skal starte",
      "Energien i sluttproduktet",
      "Varmen omgivelsene har fra før",
    ],
    correct: 1,
    explain:
      "Riktig! Aktiveringsenergien er «terskelen» reaktantene må over for at reaksjonen skal komme i gang.",
  },
];

export type Flashcard = { term: string; def: string };

export const kjemiskeReaksjonerCards: Flashcard[] = [
  {
    term: "Eksoterm reaksjon",
    def: "En reaksjon som avgir energi, oftest som varme, til omgivelsene.",
  },
  {
    term: "Endoterm reaksjon",
    def: "En reaksjon som tar opp energi fra omgivelsene, ofte som varme.",
  },
  {
    term: "Katalysator",
    def: "Et stoff som øker reaksjonsfarten ved å senke aktiveringsenergien, uten selv å bli forbrukt.",
  },
  {
    term: "Aktiveringsenergi",
    def: "Den minste energimengden som trengs for at en reaksjon skal starte.",
  },
  {
    term: "Kjemisk likevekt",
    def: "Tilstanden der forover- og bakoverreaksjonen skjer like raskt, slik at konsentrasjonene holder seg konstante.",
  },
  {
    term: "Reaksjonsfart",
    def: "Hvor raskt reaktanter omdannes til produkter, målt som endring i konsentrasjon per tidsenhet.",
  },
];
