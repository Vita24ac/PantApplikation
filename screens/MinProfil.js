// Overblik over dine egne opslag og hvor meget du har tjent
import React, { useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import StatusBadge from "../components/StatusBadge";
import KnapKomponent from "../components/KnapKomponent";
import { GlobalStyle as GS, Farver } from "../styles/GlobalStyle";
import { PantContext } from "../data/PantContext";
import { BRUGER, STATUS, beregnAntal, beregnSplit, visKroner } from "../data/const";

export default function MinProfil({ navigation }) {
  const { pantListe } = useContext(PantContext);

  // viser kun mine opslag
  const mineOpslag = pantListe.filter((opslag) => opslag.ejer);

  // Alt der er afleveret, har givet mig 50% - enten som ejer eller som henter
  const afhentede = pantListe.filter((opslag) => opslag.status === STATUS.afhentet);
  const tjent = afhentede.reduce((sum, opslag) => sum + beregnSplit(opslag), 0);

  // Åbner opslaget i hjem-fanen
  const åbnOpslag = (id) =>
    navigation.navigate("Hjem", { screen: "Pant Detaljer", params: { id: id } });

  return (
    <SafeAreaView style={GS.container}>
      <ScrollView contentContainerStyle={GS.skærmIndhold}>
        <View style={[GS.række, { justifyContent: "flex-start", marginBottom: 16 }]}>
          <Ionicons name="person-circle-outline" size={52} color={Farver.primær} />
          <View style={{ marginLeft: 10 }}>
            <Text style={GS.overskrift}>{BRUGER.navn}</Text>
            <Text style={GS.underoverskrift}>{BRUGER.adresse}</Text>
          </View>
        </View>

        <View style={[GS.kort, GS.række]}>
          <View style={GS.nøgletal}>
            <Text style={GS.nøgletalVærdi}>{mineOpslag.length}</Text>
            <Text style={GS.nøgletalTekst}>Mine opslag</Text>
          </View>
          <View style={GS.nøgletal}>
            <Text style={GS.nøgletalVærdi}>{afhentede.length}</Text>
            <Text style={GS.nøgletalTekst}>Afleveret</Text>
          </View>
          <View style={GS.nøgletal}>
            <Text style={GS.nøgletalVærdi}>{visKroner(tjent)}</Text>
            <Text style={GS.nøgletalTekst}>Tjent i alt</Text>
          </View>
        </View>

        <Text style={[GS.etiket, { marginTop: 8, marginBottom: 10 }]}>Mine opslag</Text>

        {/* selve flat-list*/}
        {mineOpslag.length === 0 ? (
          <View style={GS.kort}>
            <Text style={GS.værdi}>Du har ikke oprettet nogen opslag endnu</Text>
          </View>
        ) : (
          mineOpslag.map((opslag) => (
            <TouchableOpacity
              key={opslag.id}
              style={GS.kort}
              onPress={() => åbnOpslag(opslag.id)}
            >
              <View style={GS.række}>
                <Text style={GS.titel}>{beregnAntal(opslag)} stk. pant</Text>
                <StatusBadge status={opslag.status} />
              </View>
              <Text style={GS.svag}>{opslag.adresse}</Text>
              <Text style={[GS.værdi, { marginTop: 4 }]}>
                Din del: {visKroner(beregnSplit(opslag))}
              </Text>
            </TouchableOpacity>
          ))
        )}

        <View style={{ height: 8 }} />
        <KnapKomponent
          title="Stil ny pant ud"
          onPress={() => navigation.navigate("Opret pant")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
