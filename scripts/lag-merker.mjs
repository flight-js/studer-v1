// Lager favicon, Apple-ikoner og delingsbildet fra logofilene i public/merke/:
//   studer-ikon.svg            app-ikonet (S med fjærpenn på mørk flate)
//   studer-ordmerke.svg        ordmerket «studer» med fjærpenn, mørkt
//   studer-ordmerke-hvit.svg   samme, hvitt (til mørke flater utenfor nettsiden)
//
//   npm run merker
//
// Kjør på nytt hvis logofilene byttes. Ordmerket på selve nettsiden bruker
// studer-ordmerke.svg direkte (se .logo-ordmerke i globals.css), så det trenger
// ingen kjøring.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const rot = new URL("../", import.meta.url);
const fil = (sti) => fileURLToPath(new URL(sti, rot));
const ikon = readFileSync(fil("public/merke/studer-ikon.svg"), "utf8");
const ordmerke = readFileSync(fil("public/merke/studer-ordmerke.svg"), "utf8");

// 1. Favicon: ikonet som det er (avrundede hjørner).
writeFileSync(fil("src/app/icon.svg"), ikon);

// 2. Apple-ikoner (180 × 180): uten avrundede hjørner og uten gjennomsiktighet –
//    iOS runder av hjørnene selv.
const firkant = Buffer.from(ikon.replace(/<rect width="64" height="64" rx="16"/, '<rect width="64" height="64"'));
for (const ut of ["src/app/apple-icon.png", "public/apple-touch-icon.png"]) {
  await sharp(firkant, { density: 72 * (180 / 64) * 2 })
    .resize(180, 180)
    .flatten({ background: "#1b1a2e" })
    .png({ compressionLevel: 9 })
    .toFile(fil(ut));
}

// 3. Delingsbildet (1200 × 630): ordmerket øverst til venstre. Det gamle
//    ordmerket dekkes med bakgrunnsfargen først, så kjøringen kan gjentas.
//    Bokstavene skal stå der det gamle ordet sto: x 73–214, grunnlinje y 107.
const [vbX, vbY, vbB, vbH] = ordmerke.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
const BOKSTAV_VENSTRE = 3.22; // venstre kant av «s» i viewBox
const BOKSTAV_HOYRE = 260.08; // høyre kant av «r»
const GRUNNLINJE = 77.04;
const skala = (214 - 73) / (BOKSTAV_HOYRE - BOKSTAV_VENSTRE);
const x = 73 - (BOKSTAV_VENSTRE - vbX) * skala;
const y = 107 - (GRUNNLINJE - vbY) * skala;
const innhold = ordmerke.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
const lag = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect x="60" y="56" width="180" height="62" fill="#f7f4ee"/>
  <svg x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${(vbB * skala).toFixed(2)}" height="${(vbH * skala).toFixed(2)}" viewBox="${vbX} ${vbY} ${vbB} ${vbH}">${innhold}</svg>
</svg>`);
const delingsbilde = fil("public/delingsbilde.png");
const gammelt = await sharp(delingsbilde).toBuffer();
await sharp(gammelt).composite([{ input: lag, top: 0, left: 0 }]).png({ compressionLevel: 9 }).toFile(delingsbilde);

console.log("Laget src/app/icon.svg, src/app/apple-icon.png, public/apple-touch-icon.png og public/delingsbilde.png.");
