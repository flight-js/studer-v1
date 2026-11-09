// Kallenavn på rangeringene (for elever som ikke vil vise fornavnet).
//
// Sjekken her gir svar mens eleven skriver. Databasen gjør den samme sjekken
// når kallenavnet lagres (public.kallenavn_feil i migrasjonen
// 20261109120000_konkurranse.sql), så den kan ikke omgås. Endrer du ordlistene
// her, endre dem der også. Er de ulike, gjelder databasens svar.
//
// Ingen filter er perfekt. Målet er å stoppe banneord, seksuelle ord og
// slurs på norsk og engelsk, også skrevet med mellomrom, tegn, tall for
// bokstaver («sh1t») og forlengede bokstaver («fuuuck»), uten å stoppe vanlige
// navn og ord («Fagnerd», «Thoresen», «Spikkestad», «Nigel»).

// Ord som ikke kan stå noe sted i kallenavnet, heller ikke inni andre ord.
// Skrevet slik normaliser() skriver dem: æ = ae, ø = o, å = a, uten doble vokaler.
const DELORD = [
  // engelsk
  "fuck", "fuk", "fvck", "phuck", "phuk", "shit", "cunt", "bitch", "biatch", "whore", "slut", "nigg", "faggot", "fagot", "retard",
  "tranny", "shemale", "porn", "penis", "vagina", "dildo", "wank", "cumshot", "blowjob", "handjob", "motherf",
  "asshole", "arsehole", "dumbass", "jackass", "dickhead", "pussy", "milf", "chink", "gook", "wetback", "beaner",
  "towelhead", "killyourself", "hitler", "siegheil", "whitepower", "kkk", "nazist", "terrorist", "pedofil",
  // norsk
  "faen", "helvete", "jaevl", "jaevel", "javla", "satan", "dritt", "fitte", "fitta", "knull", "rasshol", "homse", "soperk",
  "neger", "pakkis", "svarting", "sigoyner", "voldt", "hestkuk", "kukhue", "horunge", "horebukk", "piss",
  "mongis", "spasser", "drepdeg",
  // utgir seg for Studer
  "admin", "moderator", "studerno",
];

// Ord som ikke kan begynne et ord (norske sammensetninger: «kukhue», «horebukk»).
const FORSTAVELSER = ["kuk", "pikk", "hore", "pule", "runk", "raev", "fitt", "pedo", "rapist"];

// Korte ord som bare stoppes som egne ord – de finnes inni vanlige ord
// («ass» i «Kasse», «cock» i «Hancock», «nazi» i «Nazir»).
const HELORD = [
  "ass", "cum", "tit", "tits", "sex", "sexy", "anal", "anus", "boob", "boobs", "nude", "nudes", "naken", "pupper",
  "cock", "dick", "homo", "kys", "rape", "spic", "kike", "coon", "dyke", "fag", "fags", "paki", "mongo", "nazi",
  "nazis", "heil", "niga", "nigr", "horny",
  // utgir seg for Studer, eller ser ut som navnet for skjulte elever
  "studer", "support", "deg",
];

// Tall og tegn som brukes i stedet for bokstaver.
const TALL: Record<string, string> = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "8": "b" };

export const KALLENAVN_MAKS = 20;

// Latinske bokstaver, også æøå, aksenter og samiske bokstaver. Bare latinske,
// så kyrilliske bokstaver som ligner («с» for «c») ikke kan lure ordlistene.
// Samme områder som i databasen, som ikke kan stole på lokale-innstillingene.
const BOKSTAV = "A-Za-zÀ-ÖØ-öø-ÿĀ-ž";
const TILLATT = new RegExp(`^[${BOKSTAV}0-9 _-]+$`);
const BOKSTAVER = new RegExp(`[${BOKSTAV}]`, "g");

// Mellomrom ryddet: det som faktisk lagres.
export const ryddKallenavn = (tekst: string) => tekst.trim().replace(/\s+/g, " ");

// Små bokstaver a–z: æøå skrevet ut, aksenter fjernet, tall som bokstaver.
// «MatteKuk» deles i to ord, så «kuk» blir et eget ord.
function normaliser(tekst: string) {
  return tekst
    .replace(/([a-zæøå])([A-ZÆØÅ])/g, "$1 $2")
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[0134578]/g, (t) => TALL[t]);
}

// Forlengede bokstaver: vokaler til én («fuuuck»), konsonanter til høyst to
// («fuckkk»), så doble konsonanter som i «fitte» og «pikk» står igjen.
const kort = (s: string) => s.replace(/([aeiouy])\1+/g, "$1").replace(/([b-df-hj-np-tv-xz])\1{2,}/g, "$1$1");

// null når kallenavnet er greit, ellers hva som er galt (vises til eleven).
export function kallenavnFeil(tekst: string): string | null {
  const v = ryddKallenavn(tekst);
  if (v.length < 2 || v.length > KALLENAVN_MAKS) return `Kallenavnet må ha 2–${KALLENAVN_MAKS} tegn.`;
  if (!TILLATT.test(v)) return "Bruk bare bokstaver, tall, mellomrom, - og _.";
  if ((v.match(BOKSTAVER) ?? []).length < 2) return "Kallenavnet må ha minst to bokstaver.";

  const n = normaliser(v);
  const tett = n.replace(/[^a-z]/g, "");
  const tette = [tett, kort(tett)];
  const ord = n.split(/[^a-z]+/).filter(Boolean);
  const alleOrd = [...ord, ...ord.map(kort)];

  const stygt =
    /1488/.test(v) ||
    DELORD.some((d) => tette.some((t) => t.includes(d))) ||
    FORSTAVELSER.some((f) => alleOrd.some((o) => o.startsWith(f))) ||
    HELORD.some((h) => alleOrd.includes(h));
  return stygt ? "Det kallenavnet kan ikke brukes. Velg et annet." : null;
}
