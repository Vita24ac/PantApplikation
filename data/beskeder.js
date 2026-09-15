// Popup-beskeder der virker både på telefon og i browseren.
import { Alert, Platform } from "react-native";

const påTelefon = Platform.OS === "ios" || Platform.OS === "android";

// Almindelig besked med en OK-knap
export const visBesked = (titel, tekst) => {
  if (påTelefon) {
    Alert.alert(titel, tekst);
  } else {
    window.alert(tekst ? `${titel}\n\n${tekst}` : titel);
  }
};

// Spørg om brugeren er sikker. onJa() kaldes kun hvis der trykkes ja.
export const bekræft = (titel, tekst, jaTekst, onJa) => {
  if (påTelefon) {
    Alert.alert(titel, tekst, [
      { text: "Annuller", style: "cancel" },
      { text: jaTekst, style: "destructive", onPress: onJa },
    ]);
  } else if (window.confirm(`${titel}\n\n${tekst}`)) {
    onJa();
  }
};
