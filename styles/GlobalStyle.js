// farver og styls for appen
import { StyleSheet } from "react-native";

export const Farver = {
  baggrund: "#F2F4F7",
  kort: "#FFFFFF",
  primær: "#1B9C64",
  primærMørk: "#147950",
  tekst: "#111827",
  svagTekst: "#6B7280",
  kant: "#E5E7EB",
  rød: "#D64545",
  gul: "#E3A008",
  blå: "#2563EB",
};

export const GlobalStyle = StyleSheet.create({
  // Layout
  container: { flex: 1, backgroundColor: Farver.baggrund },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  række: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },

  // Tekst
  overskrift: { fontSize: 24, fontWeight: "700", color: Farver.tekst },
  underoverskrift: { fontSize: 14, color: Farver.svagTekst, marginTop: 4 },
  titel: { fontSize: 17, fontWeight: "600", color: Farver.tekst, marginBottom: 4 },
  etiket: { fontWeight: "600", color: Farver.tekst, marginBottom: 6 },
  værdi: { color: Farver.tekst, fontSize: 15 },
  svag: { color: Farver.svagTekst, fontSize: 13 },

  // Kort med skygge
  kort: {
    backgroundColor: Farver.kort,
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    // iOS-skygge
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    // Android-skygge
  },

  // Header øverst på skærmene
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },

  // Inputfelter
  input: {
    borderWidth: 1,
    borderColor: Farver.kant,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Farver.kort,
    fontSize: 15,
    color: Farver.tekst,
  },

  // Række med typen af pant og et talfelt (Opret pant)
  pantRække: {
    backgroundColor: Farver.kort,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Farver.kant,
    padding: 12,
    marginBottom: 10,
  },
  lilleInput: { width: 72, textAlign: "center", marginLeft: 12 },

  //  Pant Detaljerne
  typeRække: { paddingVertical: 6 },

  // Status-badge (Ledig / Reserveret / Afhentet)
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeTekst: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },

  // Grøn boks der viser 50/50-fordelingen
  splitBoks: {
    backgroundColor: "#E8F6EF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  splitBeløb: { fontSize: 28, fontWeight: "700", color: Farver.primær },

  // Nøgletal på profilen
  nøgletal: { flex: 1, alignItems: "center" },
  nøgletalVærdi: { fontSize: 22, fontWeight: "700", color: Farver.primær },
  nøgletalTekst: { fontSize: 12, color: Farver.svagTekst, textAlign: "center", marginTop: 2 },

  // Knapper (bruges af KnapKomponent)
  knap: {
    backgroundColor: Farver.primær,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  knapTekst: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  knapSekundær: { backgroundColor: Farver.kort, borderWidth: 1, borderColor: Farver.kant },
  knapSekundærTekst: { color: Farver.tekst },
  knapFarlig: { backgroundColor: Farver.rød },
  knapSlukket: { backgroundColor: Farver.kant },
  knapSlukketTekst: { color: Farver.svagTekst },
});

// Vælg farve til status-badgen
export const statusFarve = (status) => {
  if (status === "Ledig") return Farver.primær;
  if (status === "Reserveret") return Farver.gul;
  return Farver.svagTekst;
};
