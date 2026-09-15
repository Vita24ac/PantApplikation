// Viser ét opslag og lader dig reservere, aflevere eller slette det
import React, { useContext } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import KnapKomponent from "../components/KnapKomponent";
import StatusBadge from "../components/StatusBadge";
import { GlobalStyle as GS } from "../styles/GlobalStyle";
import { PantContext } from "../data/PantContext";
import { visBesked, bekræft } from "../data/beskeder";
import {
  STATUS,
  PANT_TYPER,
  beregnAntal,
  beregnBeloeb,
  beregnSplit,
  visKroner,
} from "../data/const";

export default function PantDetaljer({ navigation, route }) {
  const { pantListe, opdaterStatus, sletPant } = useContext(PantContext);

  // finde ID'et på opslaget, så man ved hvilken man referer til
  const id = route?.params?.id;
  const opslag = pantListe.find((p) => p.id === id);

  if (!opslag) {
    return (
      <SafeAreaView style={GS.container}>
        <View style={GS.center}>
          <Text style={GS.værdi}>Ingen data om dette opslag</Text>
        </View>
      </SafeAreaView>
    );
  }

  const beløb = beregnBeloeb(opslag);
  const split = beregnSplit(opslag);

  // afhentning af pant
  const reservér = () => {
    opdaterStatus(opslag.id, STATUS.reserveret);
    visBesked(
      "Du har reserveret panten",
      `Hent posen hos ${opslag.navn} og få ${visKroner(split)}, når den er afleveret.`
    );
  };

  // Pant afleveret i automaten og pengene deles
  const aflevér = () => {
    opdaterStatus(opslag.id, STATUS.afhentet);
    visBesked(
      "Panten er afleveret",
      `I deler ${visKroner(beløb)} - ${visKroner(split)} til hver.`
    );
  };

  const bekræftSlet = () => {
    bekræft("Er du sikker?", "Vil du slette dit opslag?", "Slet", () => {
      sletPant(opslag.id);
      navigation.goBack();
    });
  };

  return (
    <SafeAreaView style={GS.container}>
      <ScrollView contentContainerStyle={GS.skærmIndhold}>
        <View style={GS.række}>
          <Text style={GS.overskrift}>{opslag.navn}</Text>
          <StatusBadge status={opslag.status} />
        </View>
        <Text style={[GS.underoverskrift, { marginBottom: 16 }]}>
          {opslag.adresse}
        </Text>

        <View style={GS.splitBoks}>
          <Text style={GS.etiket}>Din del af panten (50%)</Text>
          <Text style={GS.splitBeløb}>{visKroner(split)}</Text>
          <Text style={GS.svag}>
            Posen er {visKroner(beløb)} værd • {opslag.navn} får de andre{" "}
            {visKroner(split)}
          </Text>
        </View>

        <View style={GS.kort}>
          <Text style={GS.etiket}>Indholdet i posen</Text>

          {/* Hvad hver pant fylder og giver*/}
          {Object.keys(PANT_TYPER).map((nøgle) => (
            <View style={[GS.række, GS.typeRække]} key={nøgle}>
              <Text style={GS.værdi}>
                {PANT_TYPER[nøgle].navn} ({visKroner(PANT_TYPER[nøgle].værdi)})
              </Text>
              <Text style={GS.værdi}>
                {opslag[nøgle] || 0} stk. ={" "}
                {visKroner((opslag[nøgle] || 0) * PANT_TYPER[nøgle].værdi)}
              </Text>
            </View>
          ))}

          <View style={[GS.række, GS.typeRække, { borderTopWidth: 1, borderTopColor: "#E5E7EB" }]}>
            <Text style={GS.etiket}>I alt {beregnAntal(opslag)} stk.</Text>
            <Text style={GS.etiket}>{visKroner(beløb)}</Text>
          </View>
        </View>

        <View style={GS.kort}>
          <Text style={GS.etiket}>Besked fra {opslag.navn}</Text>
          <Text style={GS.værdi}>{opslag.note}</Text>
        </View>

        <View style={{ height: 8 }} />

        {/* ens liste af opslag, både ens egne og andres */}
        {opslag.ejer ? (
          <KnapKomponent title="Slet mit opslag" variant="farlig" onPress={bekræftSlet} />
        ) : opslag.status === STATUS.ledig ? (
          <KnapKomponent title={`Jeg henter panten for ${opslag.navn}`} onPress={reservér} />
        ) : opslag.status === STATUS.reserveret ? (
          <KnapKomponent title="Markér som afleveret i automaten" onPress={aflevér} />
        ) : (
          <KnapKomponent title="Panten er afleveret" disabled={true} onPress={() => {}} />
        )}

        <KnapKomponent
          title="Tilbage til listen"
          variant="sekundær"
          onPress={() => navigation.goBack()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
