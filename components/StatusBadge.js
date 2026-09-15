// Status-markartet på hvert opslag
import React from "react";
import { View, Text } from "react-native";
import { GlobalStyle as GS, statusFarve } from "../styles/GlobalStyle";

export default function StatusBadge({ status }) {
  return (
    <View style={[GS.badge, { backgroundColor: statusFarve(status) }]}>
      <Text style={GS.badgeTekst}>{status}</Text>
    </View>
  );
}
