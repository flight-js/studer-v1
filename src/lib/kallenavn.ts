// Kallenavn på rangeringene (for elever som ikke vil vise fornavnet).
//
// Tre lag, så ingen må rapportere et stygt navn for at det skal bort:
// 1. Ordlistene her gir svar mens eleven skriver.
// 2. Serverfunksjonen «kallenavn» (supabase/functions/kallenavn) kjører de
//    samme ordlistene og lar så en språkmodell vurdere navnet – den fanger det
//    lister ikke kan: nye skrivemåter, andre språk, hets mot personer,
//    hentydninger, fulle navn og kontaktinfo. Bare funksjonen kan lagre
//    kallenavnet; eleven kan ikke skrive det direkte i databasen.
// 3. Databasen sjekker ordlistene en gang til når navnet lagres
//    (public.kallenavn_feil i migrasjonen 20261109120000_konkurranse.sql).
// Endrer du ordlistene her, endre dem der også (scripts/kallenavn-sql.mjs).
//
// Ordlistene stopper banneord, seksuelle ord, slurs, rus, ekstremisme og
// kontaktinfo på norsk og engelsk, også skrevet med mellomrom, tegn, tall for
// bokstaver («sh1t») og forlengede bokstaver («fuuuck»), uten å stoppe vanlige
// navn og ord («Fagnerd», «Thoresen», «Spikkestad», «Nigel»).

// Ord som ikke kan stå noe sted i kallenavnet, heller ikke inni andre ord.
// Skrevet slik normaliser() skriver dem: æ = ae, ø = o, å = a, uten doble vokaler.
const DELORD = [
  // engelsk
  "fuck", "fuk", "fvck", "phuck", "phuk", "shit", "cunt", "bitch", "biatch", "whore", "slut", "nigg", "faggot", "fagot", "retard",
  "tranny", "shemale", "porn", "penis", "vagina", "dildo", "wank", "cumshot", "blowjob", "handjob", "motherf",
  "asshole", "arsehole", "dumbass", "jackass", "dickhead", "pussy", "milf", "chink", "gook", "wetback", "beaner",
  "towelhead", "killyourself", "hitler", "siegheil", "whitepower", "whitepride", "skinhead", "swastika", "kkk",
  "nazist", "terrorist", "jihad", "taliban", "pedofil", "suicide", "cocaine",
  // norsk
  "faen", "fakking", "helvete", "haelvete", "jaevl", "jaevel", "javla", "satan", "dritt", "sjit", "fitte", "fitta",
  "knull", "rasshol", "homse", "soperk", "neger", "pakkis", "svarting", "sigoyner", "voldt", "hestkuk", "kukhue",
  "horunge", "horebukk", "piss", "mongis", "spasser", "drepdeg", "hakekors", "selvmord", "kokain", "narkoman",
  // kontaktinfo («snap ola2010»): elever skal ikke kunne dele den på rangeringene
  "snapchat", "instagram", "whatsapp", "telegram", "discord", "onlyfans", "tiktok",
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
  "nazis", "heil", "niga", "nigr", "horny", "weed", "meth", "heroin", "drug", "drugs", "hasj", "mord", "murder", "fakk",
  // kontaktinfo
  "snap", "insta", "kik",
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
  // Telefonnumre og lignende: høyst fire sifre på rad («Ola2010» er greit).
  if (/[0-9]{5}/.test(v)) return "Bruk høyst fire tall på rad.";

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
