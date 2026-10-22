// Muliggør opslag på listen
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StatusBadge from "./StatusBadge";
import { GlobalStyle as GS, Farver } from "../styles/GlobalStyle";
import { beregnAntal, beregnBeloeb, beregnSplit, visKroner } from "../data/const";

export default function PantKort({ opslag, onPress, afstand }) {
  return (
    <TouchableOpacity style={GS.kort} onPress={onPress}>
      <View style={GS.række}>
        <Text style={GS.titel}>
          {opslag.navn} {opslag.ejer ? "(dig)" : ""}
        </Text>
        <StatusBadge status={opslag.status} />
      </View>

      <View style={[GS.række, { justifyContent: "flex-start", marginBottom: 6 }]}>
        <Ionicons name="location-outline" size={14} color={Farver.svagTekst} />
        <Text style={[GS.svag, { marginLeft: 4 }]}>
          {opslag.adresse}
        </Text>
      </View>

      {/* Afstanden vises kun på "I nærheden"-skærmen, hvor vi kender brugerens placering */}
      {afstand ? (
        <Text style={[GS.svag, { marginBottom: 6 }]}>{afstand}</Text>
      ) : null}

      <Text style={GS.værdi}>
        {beregnAntal(opslag)} stk. pant • {visKroner(beregnBeloeb(opslag))}
      </Text>
      <Text style={GS.svag}>
        A: {opslag.pantA || 0} • B: {opslag.pantB || 0} • C: {opslag.pantC || 0}
      </Text>
      <Text style={[GS.værdi, { marginTop: 4, color: Farver.primær, fontWeight: "600" }]}>
        Du får {visKroner(beregnSplit(opslag))} for at hente den
      </Text>
    </TouchableOpacity>
  );
}
