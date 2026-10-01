// Format for studieinnholdet slik det skrives og gjennomgås i git.
//
// Filene her er arbeidskopien – de bygges ikke inn i nettsiden. Pensum lagres
// i Supabase: `npm run content:seed` gjør dem om til supabase/seed.sql
// (tabellene er definert i supabase/migrations/).
//
// Flashcard og QuizQuestion bruker samme feltnavn som src/lib/data.ts
// (term/def, text/options/correct/explain). Nye felt har norske navn, som
// resten av domenet (Fag, Trinn, Tema).
//
// Filstruktur:
//   content/katalog.json               – alle trinn og fag (Katalog)
//   content/<trinnId>/<fagId>/_fag.json – læreplan og temarekkefølge (FagContent)
//   content/<trinnId>/<fagId>/01-<tema-id>.json – ett tema per fil (TemaContent)

export type Katalog = {
  trinn: {
    id: string; // "8", "9", "10", "vg1", "vg2", "vg3"
    navn: string;
    skoleniva: "ungdomsskole" | "vgs";
    fag: { id: string; navn: string }[];
  }[];
};

// Satt av nivåsjekken (`npm run content:niva`). Mangler feltet, er det kjerne –
// noe nesten alle klasser lærer i temaet. Øvingene tar kjernestoffet først og
// merker resten «Ekstra».
//   eksempel  – ett av flere mulige eksempler; mange klasser lærer temaet uten det
//   over-niva – mer avansert enn det trinnet forventer
export type Niva = "eksempel" | "over-niva";

export type Flashcard = {
  term: string;
  def: string;
  niva?: Niva;
};

export type QuizQuestion = {
  id: string; // unikt innen temaet, f.eks. "q01"
  text: string;
  options: string[]; // alltid 4 alternativer
  correct: number; // indeks i options (0–3)
  explain: string; // forklarer hvorfor svaret er riktig – aldri «Riktig!» først
  niva?: Niva;
};

export type TrueFalseQuestion = {
  id: string;
  type: "sant-usant";
  text: string; // en påstand
  correct: boolean;
  explain: string;
  niva?: Niva;
};

export type MiniproveQuestion =
  | ({ type: "flervalg" } & QuizQuestion)
  | TrueFalseQuestion;

// Skriveoppgave: eleven skriver svaret selv, og KI retter det mot fasiten og
// kriteriene (0, ½ eller 1 poeng). Lages med `npm run content:skriv`.
export type Skriveoppgave = {
  id: string; // "s01", unikt innen temaet
  text: string; // spørsmålet, kan besvares med 1–4 setninger
  fasit: string; // et fullgodt svar på elevens nivå, 1–3 setninger
  kriterier: string[]; // 1–3 punkter som må være med for fullt poeng
  niva?: Niva;
};

export type Miniprove = {
  minutter: number;
  quizRefs: string[]; // id-er fra temaets quiz som også inngår i prøven
  ekstra: MiniproveQuestion[]; // nye spørsmål som bare finnes i prøven
  // Totalt (quizRefs + ekstra) skal være 15–20 spørsmål.
  // Prøven trekker 5 raske spørsmål (helst fra ekstra) og 5 skriveoppgaver.
  skriv?: Skriveoppgave[]; // 6–10
};

// Tankekart: roten er temaet, greinene er deltemaer, bladene er begreper.
export type MindmapNode = {
  label: string;
  note?: string; // kort forklaring, vises ved klikk/hover
  children?: MindmapNode[];
};

export type Kvalitet = {
  // utkast   – skrevet, ikke gjennomgått av et menneske
  // sjekkes  – inneholder påstander som bør dobbeltsjekkes (se merknader)
  // godkjent – gjennomgått av lærer/produkteier
  status: "utkast" | "sjekkes" | "godkjent";
  merknader: string[];
  nivasjekk?: string; // dato for siste nivåsjekk, «2026-09-29»
  alternativer?: string; // dato feilsvarene sist ble forbedret (npm run content:alternativer)
};

export type TemaContent = {
  id: string; // slug, unik innen faget
  fagId: string;
  trinnId: string;
  name: string;
  intro: string; // én setning som beskriver temaet
  kompetansemaal: number[]; // nummer i fagets kompetansemål-liste (se _fag.json)
  sammendrag: string; // 300–600 ord. Avsnitt skilles med tom linje, «## » gir mellomtittel, **fet**
  flashcards: Flashcard[]; // 8–25, helst minst 8 kjernebegreper
  quiz: QuizQuestion[]; // 10–15
  mindmap: MindmapNode;
  miniprove: Miniprove;
  kvalitet: Kvalitet;
};

export type FagContent = {
  id: string; // samme id som i katalog.json, f.eks. "kjemi-1"
  trinnId: string;
  name: string;
  lareplan: {
    kode: string; // Udirs læreplankode, f.eks. "KJE01-02"
    url: string;
    // Kompetansemålene i Udirs rekkefølge. «tekst» er Udirs ordlyd (læreplanen
    // er forskrift og kan gjengis); «kort» er en valgfri egen kortversjon.
    kompetansemaal: { nr: number; tekst: string; kort?: string }[];
  };
  temaer: string[]; // tema-id-er i anbefalt rekkefølge
};
