import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import PantListe from "./screens/PantListe";
import PantDetaljer from "./screens/PantDetaljer";
import OpretPant from "./screens/OpretPant";
import MinProfil from "./screens/MinProfil";
import { PantContext } from "./data/PantContext";
import { PANT_OPSLAG } from "./data/const";
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

export default function App() {
  // Alle opslag ligger her i App.js, så alle skærme bruger den samme liste
  const [pantListe, setPantListe] = useState(PANT_OPSLAG);

  // Læg et nyt opslag øverst i listen
  const tilfoejPant = (nytOpslag) =>
    setPantListe((forrige) => [nytOpslag, ...forrige]);

  // Skift status på ét opslag 
  const opdaterStatus = (id, nyStatus) =>
    setPantListe((forrige) =>
      forrige.map((opslag) =>
        opslag.id === id ? { ...opslag, status: nyStatus } : opslag
      )
    );

  // Fjern et opslag fra listen
  const sletPant = (id) =>
    setPantListe((forrige) => forrige.filter((opslag) => opslag.id !== id));

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
