// Tipsene som vises i appen (se components/Tips.tsx), samlet her så de er
// lette å endre. Hver side viser det første tipset i lista som eleven ikke har
// sett. id må være unik og aldri gjenbrukes – den huskes i nettleseren.
// bare: vis tipset bare på berøringsskjerm eller bare med mus.
//
// Tipsene må stemme med appen. Endres en funksjon, endres tipset også.

export type Tips = { id: string; tekst: React.ReactNode; bare?: "beroring" | "mus" };

const sporAi: Tips = {
  id: "spor-ai",
  tekst: "Står du fast? «Spør AI» nederst til høyre forklarer det du lurer på i temaet, på en annen måte.",
};

export const TIPS = {
  hjem: [
    {
      id: "a-repetere",
      tekst:
        "Studer husker hva du kan. Det du bommer på, kommer tilbake dagen etter, og det du kan, kommer sjeldnere og sjeldnere. Du finner det under «I dag» her på startsiden.",
    },
    {
      id: "repetisjon",
      tekst:
        "Siste tema i hvert fag er «Repetisjon av hele faget». Der står det viktigste fra alle temaene samlet – fint før tentamen og eksamen.",
    },
    {
      id: "hjemskjerm",
      bare: "beroring",
      tekst:
        "Legg Studer på hjemskjermen, så er den ett trykk unna. I Safari trykker du Del-knappen og velger «Legg til på Hjem-skjerm». I Chrome finner du det i menyen.",
    },
    {
      id: "mork-modus",
      tekst: "Liker du mørk skjerm? Nederst på siden velger du lys, mørk eller det samme som telefonen eller PC-en.",
    },
  ],
  fag: [
    {
      id: "prosent",
      tekst:
        "Prosenten ved hvert tema regnes ut fra de beste resultatene dine i flashcards, quiz og miniprøve. Får du alt riktig i alle tre, står det 100 %.",
    },
  ],
  tema: [sporAi],
  sammendrag: [
    { id: "tankekart", tekst: "Trykk «Tankekart» øverst for å se hele temaet på ett blikk." },
    sporAi,
  ],
  flashcards: [
    {
      id: "kan-ikke-enna",
      tekst: "Trykker du «Kan ikke ennå», kommer kortet tilbake senere i bunken. Bunken er ferdig når du kan alle.",
    },
    { id: "rapporter", tekst: "Ser du en feil? Trykk «Rapporter» og si hva som er galt, så retter vi det." },
  ],
  quiz: [
    { id: "forklar-med-ai", tekst: "Svarer du feil, kan du trykke «Forklar med AI» og få forklart hvorfor." },
    { id: "rapporter", tekst: "Ser du en feil? Trykk «Rapporter» og si hva som er galt, så retter vi det." },
  ],
  quizEkstra: [
    {
      id: "ekstra",
      tekst: "Spørsmål merket «Ekstra» er stoff ikke alle klasser lærer. Spør læreren om det kommer på prøven.",
    },
  ],
  miniprove: [
    {
      id: "miniprove-ny",
      tekst: "Spørsmålene trekkes på nytt hver gang, så miniprøven blir litt annerledes neste gang du tar den.",
    },
  ],
  // I et vanlig tema. (Det gamle tipset «formelutvalg» er erstattet av disse.)
  formelmatch: [
    {
      id: "flere-temaer",
      tekst:
        "Vil du øve på formler fra flere temaer samtidig? Gå til «Repetisjon av hele faget» sist i faget, og velg temaene under «Velg formler».",
    },
    {
      id: "formelutvalg-topp",
      tekst:
        "Under «Velg formler» kan du øve på bare noen av formlene. Topplista teller bare runder med alle formlene, så alle konkurrerer på det samme.",
    },
  ],
  // I «Repetisjon av hele faget».
  formelmatchFaget: [
    {
      id: "faget-temaer",
      tekst:
        "Under «Velg formler» velger du hvilke temaer formlene skal komme fra. Topplista for hele faget teller bare runder med alle temaene.",
    },
  ],
} satisfies Record<string, Tips[]>;
