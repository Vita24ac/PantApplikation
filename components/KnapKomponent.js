// Genbrugelig knappekompnent 
import React from "react";
import { Pressable, Text } from "react-native";
import { GlobalStyle as GS } from "../styles/GlobalStyle";

export default function KnapKomponent({ title, onPress, variant, disabled }) {
  // variant bestemmer udseendet: "primær" (standard) (grøn), "sekundær" (hvid) eller "farlig" (rød farve - viser at en kritisk handling skal til at ske)
  const knapStyle = [
    GS.knap,
    variant === "sekundær" && GS.knapSekundær,
    variant === "farlig" && GS.knapFarlig, 
    disabled && GS.knapSlukket,
  ];

  const tekstStyle = [
    GS.knapTekst,
    variant === "sekundær" && GS.knapSekundærTekst,
    disabled && GS.knapSlukketTekst,
  ];

  return (
    <Pressable style={knapStyle} onPress={onPress} disabled={disabled}>
      <Text style={tekstStyle}>{title}</Text>
    </Pressable>
  );
}
