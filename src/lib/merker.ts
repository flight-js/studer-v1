// Merker eleven tjener ved å øve – de kan ikke kjøpes. Databasen regner ut
// fremgangen og deler dem ut (merke_fremgang og mine_merker i
// supabase/migrations/20261109120000_konkurranse.sql); nøklene og målene må
// stemme med den. Et tjent merke ligger i eiendeler og kan vises ved navnet på
// rangeringene, som de kjøpte merkene (ikonene står i Navnemerke.tsx).

export type Tjentmerke = {
  id: string;
  navn: string;
  krav: string; // hva som skal til, vist før merket er tjent
  enhet: string; // til fremgangen: «3 av 7 dager»
};

export const MERKER: Tjentmerke[] = [
  { id: "merke-uke", navn: "En uke på rad", krav: "Øv sju dager på rad.", enhet: "dager" },
  { id: "merke-maaned", navn: "En måned på rad", krav: "Øv 30 dager på rad.", enhet: "dager" },
  { id: "merke-kort", navn: "100 kort", krav: "Øv på 100 ulike flashcards.", enhet: "kort" },
  { id: "merke-tusen", navn: "1000 kort", krav: "Øv på 1000 ulike flashcards.", enhet: "kort" },
  { id: "merke-rekord", navn: "Første rekord", krav: "Slå din egen beste tid i formelmatch.", enhet: "rekorder" },
  { id: "merke-feilfri", navn: "Alt riktig", krav: "Få alt riktig på en quiz.", enhet: "quizer" },
  { id: "merke-temaer", navn: "Ti temaer", krav: "Øv i ti ulike temaer.", enhet: "temaer" },
  { id: "merke-prove", navn: "Første miniprøve", krav: "Fullfør en miniprøve.", enhet: "miniprøver" },
  { id: "merke-gave", navn: "Gavmild", krav: "Gi en venn en gratis uke, og vennen løser den inn.", enhet: "gaver" },
];

export const TJENTE = new Set(MERKER.map((m) => m.id));
export const merkenavn = (id: string) => MERKER.find((m) => m.id === id)?.navn ?? null;
