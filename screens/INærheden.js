// Ny skærm: finder brugerens placering med telefonens GPS og viser
// de pantposer, der ligger indenfor 5 km - sorteret efter afstand
import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import PantKort from "../components/PantKort";
import KnapKomponent from "../components/KnapKomponent";
import { GlobalStyle as GS, Farver } from "../styles/GlobalStyle";
import { PantContext } from "../data/PantContext";
import { MAKS_AFSTAND_KM, beregnAfstand, visAfstand } from "../data/const";

export default function INærheden({ navigation }) {
  const { pantListe } = useContext(PantContext);

  const [minPosition, setMinPosition] = useState(null); // brugerens koordinater
  const [indlæser, setIndlæser] = useState(true);
  const [fejl, setFejl] = useState(null);
  const [kunNær, setKunNær] = useState(true); // filter: kun indenfor 5 km?

  // Spørg om lov til at bruge lokationen, og hent så positionen
  const hentPlacering = async () => {
    setIndlæser(true);
    setFejl(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setFejl("Vi må ikke bruge din placering. Giv app'en adgang i indstillingerne.");
      } else {
        const position = await Location.getCurrentPositionAsync({});
        setMinPosition({
          breddegrad: position.coords.latitude,
          længdegrad: position.coords.longitude,
        });
      }
    } catch (e) {
      setFejl("Vi kunne ikke finde din placering lige nu.");
    }
    setIndlæser(false);
  };

  // Hent placeringen automatisk, første gang skærmen åbnes
  useEffect(() => {
    hentPlacering();
  }, []);

  // Læg afstanden på hvert opslag og sortér, så det nærmeste ligger øverst
  const medAfstand = pantListe
    .map((opslag) => ({ ...opslag, afstand: beregnAfstand(minPosition, opslag) }))
    .filter((opslag) => opslag.afstand !== null)
    .sort((a, b) => a.afstand - b.afstand);

  const liste = kunNær
    ? medAfstand.filter((opslag) => opslag.afstand <= MAKS_AFSTAND_KM)
    : medAfstand;

  return (
    <SafeAreaView style={GS.container}>
      <View style={GS.header}>
        <Text style={GS.overskrift}>Pant tæt på dig</Text>
        <Text style={GS.underoverskrift}>
          {minPosition
            ? `Vi bruger din placering til at finde pant indenfor ${MAKS_AFSTAND_KM} km`
            : "Vi skal bruge din placering for at kunne måle afstanden"}
        </Text>
      </View>

      {/* De to nye knapper: hent placeringen igen, og slå 5 km-filteret til/fra */}
      <View style={[GS.række, { paddingHorizontal: 16, gap: 10 }]}>
        <View style={{ flex: 1 }}>
          <KnapKomponent title="Find min placering" onPress={hentPlacering} />
        </View>
        <View style={{ flex: 1 }}>
          <KnapKomponent
            title={kunNær ? `Vis alle` : `Kun ${MAKS_AFSTAND_KM} km`}
            variant="sekundær"
            onPress={() => setKunNær((forrige) => !forrige)}
          />
        </View>
      </View>

      {indlæser ? (
        <View style={GS.center}>
          <ActivityIndicator size="large" color={Farver.primær} />
          <Text style={[GS.svag, { marginTop: 10 }]}>Finder din placering...</Text>
        </View>
      ) : fejl ? (
        <View style={GS.center}>
          <Text style={GS.værdi}>{fejl}</Text>
        </View>
      ) : liste.length === 0 ? (
        <View style={GS.center}>
          <Text style={GS.værdi}>
            Der er ingen pant indenfor {MAKS_AFSTAND_KM} km af dig lige nu
          </Text>
        </View>
      ) : (
        <FlatList
          data={liste}
          keyExtractor={(opslag) => opslag.id}
          contentContainerStyle={GS.listeIndhold}
          renderItem={({ item }) => (
            <PantKort
              opslag={item}
              afstand={visAfstand(item.afstand)}
              onPress={() => navigation.navigate("Pant Detaljer", { id: item.id })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
