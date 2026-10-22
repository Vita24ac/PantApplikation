// Her opretter du dit eget opslag, så en bruger kan hente din pant
import React, { useState, useContext } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import KnapKomponent from "../components/KnapKomponent";
import { GlobalStyle as GS } from "../styles/GlobalStyle";
import { PantContext } from "../data/PantContext";
import { visBesked } from "../data/beskeder";
import {
  BRUGER,
  STATUS,
  PANT_TYPER,
  beregnAntal,
  beregnBeloeb,
  beregnSplit,
  visKroner,
} from "../data/const";

// Tomme standardfelter til formularen
const initialState = {
  adresse: "",
  pantA: "",
  pantB: "",
  pantC: "",
  note: "",
};

export default function OpretPant({ navigation }) {
  const { tilfoejPant } = useContext(PantContext);
  const [nytOpslag, setNytOpslag] = useState(initialState);

  // Opdater et felt adgangen
  const ændrTekst = (nøgle, værdi) =>
    setNytOpslag((forrige) => ({ ...forrige, [nøgle]: værdi }));

  // Hent telefonens placering, så opslaget kan findes på "I nærheden"-skærmen
  const hentKoordinater = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return {};
      const position = await Location.getCurrentPositionAsync({});
      return {
        breddegrad: position.coords.latitude,
        længdegrad: position.coords.longitude,
      };
    } catch (e) {
      return {}; // uden koordinater vises opslaget bare kun i den almindelige liste
    }
  };

  const gem = async () => {
    const antal = beregnAntal(nytOpslag);

    // Simpel validering på formular indhold
    if (!nytOpslag.adresse.trim()) {
      return visBesked("Du mangler at skrive en adresse.");
    }
    if (antal <= 0) {
      return visBesked("Skriv hvor meget pant du har", "Udfyld mindst én af de tre typer.");
    }

    const koordinater = await hentKoordinater();

    // Opslaget gemmes i Firestore, så det stadig er der næste gang app'en åbnes
    await tilfoejPant({
      navn: BRUGER.navn,
      adresse: nytOpslag.adresse.trim(),
      ...koordinater,
      pantA: Number(nytOpslag.pantA) || 0,
      pantB: Number(nytOpslag.pantB) || 0,
      pantC: Number(nytOpslag.pantC) || 0,
      status: STATUS.ledig,
      note: nytOpslag.note.trim() || "Ingen besked",
      ejer: true,
    });

    visBesked("Dit opslag er oprettet", "brugerne kan nu se din pant i listen.");
    setNytOpslag(initialState);
    navigation.navigate("Hjem");
  };

  return (
    <SafeAreaView style={GS.container}>
      <ScrollView contentContainerStyle={GS.skærmIndhold}>
        <Text style={GS.overskrift}>Stil din pant ud</Text>
        <Text style={[GS.underoverskrift, { marginBottom: 16 }]}>
          En bruger henter posen og afleverer den - I deler beløbet 50/50.
          Vi bruger din placering, så naboer kan se opslaget i nærheden af sig.
        </Text>

        <View style={GS.felt}>
          <Text style={GS.etiket}>Adresse</Text>
          <TextInput
            value={nytOpslag.adresse}
            onChangeText={(tekst) => ændrTekst("adresse", tekst)}
            style={GS.input}
            placeholder="Adresse"
          />
        </View>

        <Text style={GS.etiket}>Hvor meget pant har du?</Text>

        {/* Et felt med panttyper */}
        {Object.keys(PANT_TYPER).map((nøgle) => (
          <View style={[GS.række, GS.pantRække]} key={nøgle}>
            <View style={{ flex: 1 }}>
              <Text style={GS.værdi}>
                {PANT_TYPER[nøgle].navn} • {visKroner(PANT_TYPER[nøgle].værdi)} pr. stk.
              </Text>
              <Text style={GS.svag}>{PANT_TYPER[nøgle].forklaring}</Text>
            </View>
            <TextInput
              value={String(nytOpslag[nøgle])}
              onChangeText={(tekst) => ændrTekst(nøgle, tekst.replace(/[^0-9]/g, ""))}
              style={[GS.input, GS.lilleInput]}
              placeholder="0"
              keyboardType="number-pad"
            />
          </View>
        ))}

        <View style={GS.felt}>
          <Text style={GS.etiket}>Besked til den der henter</Text>
          <TextInput
            value={nytOpslag.note}
            onChangeText={(tekst) => ændrTekst("note", tekst)}
            style={GS.input}
            placeholder="Fx: Står i en blå kasse ved døren"
            multiline
          />
        </View>

        <View style={GS.splitBoks}>
          <Text style={GS.etiket}>I får hver</Text>
          <Text style={GS.splitBeløb}>{visKroner(beregnSplit(nytOpslag))}</Text>
          <Text style={GS.svag}>
            {beregnAntal(nytOpslag)} stk. pant til {visKroner(beregnBeloeb(nytOpslag))} i alt
          </Text>
        </View>

        <KnapKomponent title="Opret opslag" onPress={gem} />
        <KnapKomponent
          title="Ryd felterne"
          variant="sekundær"
          onPress={() => setNytOpslag(initialState)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
