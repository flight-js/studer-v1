// Engangsrydding av formlene fra lag-formler.mjs (26.10.2026), gått gjennom for
// hånd: regneeksempler med bestemte tall, betingelser som «f′(x) = 0» og
// programlinjer som «v = v + a · dt» er ikke formler eleven skal koble.
// «*» fjerner alle formlene i temaet. Kjøres med node fra repo-roten.
//
// Runde 2 (samme dag): formler med bare et funksjonsnavn til venstre (f(x), N(t),
// r(t)) tas ut automatisk, og «y = …» der y bare er funksjonsverdien, for hånd.
// «y» som koordinat (y = r sin t, y = v₀ᵧ · t − ½ · g · t²) får stå.

import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { harGeneriskVenstreside, normaliserFormel } from "../lib/pensum-rader.mjs";

const FJERN = {
  "matematikk-8/monstre-og-algebra": ["3(x + 2) = 3x + 6", "4a + 2a = 6a"],
  "matematikk-8/funksjoner": ["y = 2x + 100"],
  "matematikk-10/regneregler-og-algebra": [
    "−2(3x − 5) = −6x + 10",
    "(x + 2)(x + 5) = x² + 7x + 10",
    "6x + 9 = 3(2x + 3)",
    "x² − 4x = x(x − 4)",
    "(4x + 8)/4 = x + 2",
    "n + (n + 1) = 2n + 1",
    "3x + 5x = 8x",
  ],
  "matematikk-10/modellering": ["*"],
  "matematikk-10/python-i-matematikk": ["*"],
  "matematikk-1p/formler-og-variabler": ["P = 50 + 15x", "K = 150n + 50"],
  "matematikk-1p/funksjoner-og-grafer": ["f(x) = 0"],
  "matematikk-1p/matematisk-modellering": ["*"],
  "matematikk-1t/andregradslikninger": ["ax² + bx + c = 0"],
  "matematikk-1t/vekstfart-og-derivasjon": ["f′(x) = 0"],
  "matematikk-1t/sinus-og-cosinussetningen": ["½ · b · c · sin A = ½ · a · c · sin B"],
  "matematikk-1t/bevis-og-programmering": ["2m + 2n = 2(m + n)", "3n + 3 = 3(n + 1)", "n + (n + 1) + (n + 2) = 3(n + 1)"],
  "matematikk-1t/modellering": ["*"],
  "naturfag-vg1/programmering-og-modellering": ["v = v + a · dt", "s = s + v · dt"],
  "naturfag-pabygg/programmering-og-modellering": ["v = v + a · dt", "s = s + v · dt"],
  "naturfag-vg1/arv-og-evolusjon": ["*"],
  "fysikk-1/rettlinjet-bevegelse": ["t = v₀/g"],
  "fysikk-1/krefter-og-newtons-lover": ["N − mg = ma", "N = m(g + a)", "ΣF = 0"],
  "fysikk-1/varme-og-temperatur": ["T = t + 273"],
  "kjemi-1/syrer-baser-og-ph": ["[H₃O⁺] = [OH⁻]"],
  "kjemi-1/reaksjonsfart-og-likevekt": ["*"],
  "matematikk-2p/prosent-vekstfaktor-og-regneark": ["*"],
  "matematikk-r1/grenseverdier": ["*"],
  "matematikk-r1/den-deriverte": ["f′(a) = 2a"],
  "matematikk-r1/funksjonsdrofting": ["*"],
  "matematikk-r1/eksponentiell-og-logistisk-vekst": ["N = K/2"],
  "matematikk-r1/modellering-og-optimering": ["*"],
  "matematikk-r1/vektorer": ["u⃗ · v⃗ = 0"],
  "matematikk-r1/parameterframstillinger": ["r⃗ = [a, b]", "v⃗ = [a, b]"],
  "matematikk-s1/algebra-og-resonnement": ["2m + 2n + 2 = 2(m + n + 1)", "3n + 3 = 3(n + 1)"],
  "matematikk-s1/grenseverdier-og-kontinuitet": ["y = L"],
  "matematikk-s1/funksjonsanalyse-med-derivasjon": ["*"],
  "matematikk-s1/okonomisk-optimering": ["f′(x) = 0"],
  "matematikk-s1/modellering-med-samfunnsdata": ["*"],
  "teknologi-og-forskningslare-1/sensorer-og-signaler": ["*"],
  "fysikk-2/forsok-usikkerhet-og-forskningssamarbeid": ["*"],
  "fysikk-2/bevegelse-i-to-dimensjoner": ["y = v₀ᵧt − ½gt²"],
  "fysikk-2/sirkelbevegelse": ["mg + N = mv² / r", "v = √(gr)", "N − mg = mv² / r"],
  "fysikk-2/elektriske-felt": ["v = √(2eU / m)"],
  "fysikk-2/elektromagnetisk-induksjon": ["|ε| = N · ΔΦ / Δt", "Δt = N · ΔΦ / |ε|", "v = ε / (B · l)"],
  "kjemi-2/ph-beregninger": ["[H₃O⁺] = [OH⁻]"],
  "kjemi-2/buffere": ["pH = pKa", "[A⁻] = [HA]"],
  "kjemi-2/loselighet": ["*"],
  "matematikk-r2/rekursjon-og-programmering": [
    "aₙ = aₙ₋₁ + 4",
    "Bₙ = 1,05 · Bₙ₋₁ − 20 000",
    "aₙ = 4n − 1",
    "Bₙ = 200 000 · 1,05ⁿ − 20 000(1,05ⁿ − 1)/0,05",
  ],
  "matematikk-r2/integral-som-grenseverdi": ["Σ (i/n)² · (1/n) = (1/n³) · n(n + 1)(2n + 1)/6"],
  "matematikk-r2/modellering-med-reelle-datasett": ["T(t) = 20 + 70 · e^(−0,05t)"],
  "matematikk-r2/analyse-av-modeller": ["f′(x) = 0"],
  "matematikk-r2/omdreiningslegemer": ["π ∫₀ʰ (f(x))² dx = V/2"],
  "matematikk-r2/parameterframstillinger-og-bevegelse": ["r(t) = [cos t, sin t, t/2]"],
  "matematikk-r2/vektorer-i-rommet": ["u · v = 0"],
  "matematikk-r2/radianer-og-trigonometriske-funksjoner": ["y = d"],
  "matematikk-r2/bevis-og-induksjon": [
    "1 + 3 + … + (2k − 1) = k²",
    "2m + 1 + 2n + 1 = 2(m + n + 1)",
    "n² = 4k² + 4k + 1",
    "2q² = p²",
    "p = 2k",
    "q² = 2k²",
  ],
  "matematikk-s2/rekursjon-og-programmering": ["*"],
  "matematikk-s2/eksponentiell-og-logistisk-vekst": ["T = ln 2/|k| når k < 0", "N = K/2"],
  "matematikk-s2/funksjonsanalyse-med-integrasjon": ["*"],
  "matematikk-s2/grensekostnad-og-grenseinntekt": ["O′(x) = 0"],
  "matematikk-s2/normalfordelingen": ["μ = 0", "σ = 1"],
  "matematikk-2py/prosent-vekstfaktor-og-regneark": ["*"],
  "matematikk-2py/formler-og-variabler": ["P = 50 + 15x", "K = 150n + 50"],
  "matematikk-2py/funksjoner-og-grafer": ["f(x) = −x² + 6x", "f(x) = 0"],
  "matematikk-2py/matematisk-modellering": ["*"],
  // Runde 2
  "matematikk-10/lineaere-funksjoner": ["y = ax"],
  "matematikk-1p/proporsjonalitet": ["y = k · x", "y = k/x"],
  "matematikk-2py/proporsjonalitet": ["y = k · x", "y = k/x"],
  "matematikk-r2/analyse-av-modeller": ["y = C · e^(kx)"],
};

const ROOT = "content";
const igjen = new Map(Object.entries(FJERN).map(([k, v]) => [k, new Set(v)]));
const dirs = (p) => readdirSync(p).filter((d) => statSync(join(p, d)).isDirectory());
for (const tr of dirs(ROOT))
  for (const fag of dirs(join(ROOT, tr)))
    for (const fil of readdirSync(join(ROOT, tr, fag)).filter((f) => /^\d{2}-.+\.json$/.test(f))) {
      const sti = join(ROOT, tr, fag, fil);
      const t = JSON.parse(readFileSync(sti, "utf8"));
      const nokkel = `${fag}/${t.id}`;
      const fjern = FJERN[nokkel];
      if (!t.formler?.length || (!fjern && !t.formler.some(harGeneriskVenstreside))) continue;
      const alle = fjern?.includes("*");
      const ut = new Set((fjern ?? []).map((f) => normaliserFormel(f)));
      const for_ = t.formler.length;
      const finnes = new Set(t.formler.map((f) => normaliserFormel(`${f.venstre}=${f.hoyre}`)));
      for (const f of fjern ?? []) if (f === "*" || finnes.has(normaliserFormel(f))) igjen.get(nokkel).delete(f);
      t.formler = alle
        ? []
        : t.formler.filter((f) => !ut.has(normaliserFormel(`${f.venstre}=${f.hoyre}`)) && !harGeneriskVenstreside(f));
      if (t.formler.length === for_) continue;
      writeFileSync(sti, JSON.stringify(t, null, 2) + "\n");
      console.log(`${nokkel}: ${for_} → ${t.formler.length}`);
    }
// Sjekk at hver formel på lista faktisk fantes (skrivefeil i lista).
for (const [k, v] of igjen) if (v.size) console.log(`! fant ikke i ${k}: ${[...v].join(" | ")}`);
