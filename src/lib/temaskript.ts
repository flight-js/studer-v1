// Lys og mørk modus: nøkkelen valget lagres under, og skriptet som setter
// data-tema="lys"|"mork" på <html> før siden tegnes (app/layout.tsx), så
// den ikke blinker hvit i mørk modus. Følger systemet når valget er
// «system». Egen fil uten React, så rot-layouten (serveren) kan bruke den.
// Må stemme med settTema i lib/tema.ts.

export const TEMA_NOKKEL = "studer-tema";

export const temaskript = `try{var m=matchMedia("(prefers-color-scheme: dark)"),s=function(){var v=localStorage.getItem(${JSON.stringify(TEMA_NOKKEL)});document.documentElement.dataset.tema=v==="mork"||(v!=="lys"&&m.matches)?"mork":"lys"};s();m.addEventListener("change",s)}catch(e){}`;
