// Prædefineret data og hjælpe funktioner.
import PANT_DATA from "./pantData.json";

// prædefineret login
export const BRUGER = {
  navn: "Vincent",
  adresse: "Vesterbrogade 88, 1620 København V",
};

// De tre panttyper, og hvad de koster pr. styk
export const PANT_TYPER = {
  pantA: { navn: "Pant A", værdi: 1, forklaring: "Dåser og små flasker" },
  pantB: { navn: "Pant B", værdi: 1.5, forklaring: "Glasflasker" },
  pantC: { navn: "Pant C", værdi: 3, forklaring: "Store plastflasker" },
};

// De tre forskellige statuser
export const STATUS = {
  ledig: "Ledig",
  reserveret: "Reserveret",
  afhentet: "Afhentet",
};

// Startdata til app'en (læses fra JSON-filen)
export const PANT_OPSLAG = PANT_DATA;

// antal pant i posen
export const beregnAntal = (opslag) =>
  Object.keys(PANT_TYPER).reduce(
    (sum, nøgle) => sum + Number(opslag?.[nøgle] || 0),
    0
  );

// Posens indhold og total
export const beregnBeloeb = (opslag) =>
  Object.keys(PANT_TYPER).reduce(
    (sum, nøgle) => sum + Number(opslag?.[nøgle] || 0) * PANT_TYPER[nøgle].værdi,
    0
  );

// prisen divideret i to, da begge får 50% hver.
export const beregnSplit = (opslag) => beregnBeloeb(opslag) / 2;

// Beløbet 
export const visKroner = (beløb) => {
  const tal = Math.round(Number(beløb || 0) * 100) / 100;
  const tekst = Number.isInteger(tal) ? String(tal) : tal.toFixed(2).replace(".", ",");
  return `${tekst} kr.`;
};
