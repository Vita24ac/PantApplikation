import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  onSnapshot,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import PantListe from "./screens/PantListe";
import PantDetaljer from "./screens/PantDetaljer";
import OpretPant from "./screens/OpretPant";
import INærheden from "./screens/INærheden";
import MinProfil from "./screens/MinProfil";
import { PantContext } from "./data/PantContext";
import { PANT_OPSLAG } from "./data/const";
import { db, PANT_SAMLING } from "./data/firebase";
import { Farver } from "./styles/GlobalStyle";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack-navigatoren: måden man sig ind på ét opslag
const StackNavigation = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Pant Liste" component={PantListe} />
    <Stack.Screen name="Pant Detaljer" component={PantDetaljer} />
  </Stack.Navigator>
);

// Samme stack, men med "I nærheden" som startskærm, så man også
// kan trykke sig ind på detaljerne derfra
const NærhedNavigation = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="I nærheden" component={INærheden} />
    <Stack.Screen name="Pant Detaljer" component={PantDetaljer} />
  </Stack.Navigator>
);

export default function App() {
  // Opslagene kommer nu fra Firestore i stedet for at ligge fast i koden
  const [pantListe, setPantListe] = useState([]);

  useEffect(() => {
    const samling = collection(db, PANT_SAMLING);

    // Første gang app'en kører er databasen tom, så lægger vi vores startdata op
    const fyldDatabasen = async () => {
      const øjebliksbillede = await getDocs(samling);
      if (øjebliksbillede.empty) {
        for (const opslag of PANT_OPSLAG) {
          const { id, ...felter } = opslag;
          await setDoc(doc(db, PANT_SAMLING, id), felter);
        }
      }
    };
    fyldDatabasen();

    // onSnapshot lytter løbende: ændrer databasen sig, opdaterer listen sig selv
    const stopLytteren = onSnapshot(samling, (øjebliksbillede) => {
      setPantListe(
        øjebliksbillede.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    });

    // Ryd op, når app'en lukkes ned
    return stopLytteren;
  }, []);

  // Gem et nyt opslag i databasen (Firestore giver det selv et id)
  const tilfoejPant = (nytOpslag) =>
    addDoc(collection(db, PANT_SAMLING), nytOpslag);

  // Skift status på ét opslag
  const opdaterStatus = (id, nyStatus) =>
    updateDoc(doc(db, PANT_SAMLING, id), { status: nyStatus });

  // Fjern et opslag fra databasen
  const sletPant = (id) => deleteDoc(doc(db, PANT_SAMLING, id));

  return (
    <PantContext.Provider value={{ pantListe, tilfoejPant, opdaterStatus, sletPant }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: Farver.primær,
              tabBarInactiveTintColor: Farver.svagTekst,
            }}
          >
            <Tab.Screen
              name="Hjem"
              component={StackNavigation}
              options={{
                tabBarIcon: ({ color }) => (
                  <Ionicons name="home" size={20} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Nærheden"
              component={NærhedNavigation}
              options={{
                tabBarIcon: ({ color }) => (
                  <Ionicons name="navigate" size={20} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Opret pant"
              component={OpretPant}
              options={{
                tabBarIcon: ({ color }) => (
                  <Ionicons name="add-circle" size={20} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Min profil"
              component={MinProfil}
              options={{
                tabBarIcon: ({ color }) => (
                  <Ionicons name="person" size={20} color={color} />
                ),
              }}
            />
          </Tab.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </SafeAreaProvider>
    </PantContext.Provider>
  );
}
