// Hvem som står bak Studer. Brukes i bruksvilkårene og personvernerklæringen.
//
// TODO før lansering: sett DRIVER til navnet ungdomsbedriften er registrert
// med hos Ungt Entreprenørskap, og SKOLE til skolen den hører til.
export const DRIVER = "Studer UB";
export const SKOLE: string | null = null;
export const KONTAKT_EPOST = "kontakt@studer.no";

// Endre når vilkårene eller personvernerklæringen endres.
export const VILKAR_OPPDATERT = "30. september 2026";
export const PERSONVERN_OPPDATERT = "30. september 2026";

export const ALDERSGRENSE = 13;

export const driverTekst = () =>
  `${DRIVER}, en ungdomsbedrift registrert hos Ungt Entreprenørskap Norge${SKOLE ? ` ved ${SKOLE}` : ""}`;
