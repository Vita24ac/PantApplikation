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

// Hvor langt væk et opslag højst må være, før vi kalder det "i nærheden"
export const MAKS_AFSTAND_KM = 5;

// Afstanden i km mellem to punkter på jorden (haversine-formlen).
// Vi bruger den til at finde de pantposer, der ligger tættest på brugeren.
export const beregnAfstand = (minPosition, opslag) => {
  if (!minPosition || opslag?.breddegrad == null || opslag?.længdegrad == null) {
    return null; // vi mangler enten brugerens eller opslagets placering
  }

  const jordensRadius = 6371; // i km
  const tilRadianer = (grader) => (grader * Math.PI) / 180;

  const forskelBredde = tilRadianer(opslag.breddegrad - minPosition.breddegrad);
  const forskelLængde = tilRadianer(opslag.længdegrad - minPosition.længdegrad);

  const a =
    Math.sin(forskelBredde / 2) ** 2 +
    Math.cos(tilRadianer(minPosition.breddegrad)) *
      Math.cos(tilRadianer(opslag.breddegrad)) *
      Math.sin(forskelLængde / 2) ** 2;

  return jordensRadius * 2 * Math.asin(Math.sqrt(a));
};

// Afstanden skrevet pænt op, fx "450 m" eller "2,3 km"
export const visAfstand = (km) => {
  if (km == null) return "Ukendt afstand";
  if (km < 1) return `${Math.round(km * 1000)} m væk`;
  return `${km.toFixed(1).replace(".", ",")} km væk`;
};
