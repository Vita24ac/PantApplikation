// Viser alle pant-opslag i nærheden i en FlatList
import React, { useState, useContext } from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PantKort from "../components/PantKort";
import KnapKomponent from "../components/KnapKomponent";
import { GlobalStyle as GS } from "../styles/GlobalStyle";
import { PantContext } from "../data/PantContext";
import { STATUS } from "../data/const";

export default function PantListe({ navigation }) {
  // Hent den fælles liste med alle opslag
  const { pantListe } = useContext(PantContext);

  // Filter: viser vi alle opslag eller kun de ledige?
  const [kunLedige, setKunLedige] = useState(false);

  const liste = kunLedige
    ? pantListe.filter((opslag) => opslag.status === STATUS.ledig)
    : pantListe;

  // Send opslagets id videre til detalje-skærmen
  const vælgOpslag = (id) => navigation.navigate("Pant Detaljer", { id: id });

  return (
    <SafeAreaView style={GS.container}>
      <View style={GS.header}>
        <Text style={GS.overskrift}>Pant i nærheden</Text>
        <Text style={GS.underoverskrift}>
          Hent en anden brugers pant og del beløbet 50/50
        </Text>
      </View>

      <View style={[GS.række, { paddingHorizontal: 16, gap: 10 }]}>
        <View style={{ flex: 1 }}>
          <KnapKomponent
            title="Alle opslag"
            variant={kunLedige ? "sekundær" : "primær"}
            onPress={() => setKunLedige(false)}
          />
        </View>
        <View style={{ flex: 1 }}>
          <KnapKomponent
            title="Kun ledige"
            variant={kunLedige ? "primær" : "sekundær"}
            onPress={() => setKunLedige(true)}
          />
        </View>
      </View>

      {liste.length === 0 ? (
        <View style={GS.center}>
          <Text style={GS.værdi}>Der er ingen opslag at vise lige nu</Text>
        </View>
      ) : (
        <FlatList
          data={liste}
          keyExtractor={(opslag) => opslag.id}
          contentContainerStyle={GS.listeIndhold}
          renderItem={({ item }) => (
            <PantKort opslag={item} onPress={() => vælgOpslag(item.id)} />
          )}
        />
      )}
    </SafeAreaView>
  );
}
