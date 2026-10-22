// Opsætning af Firebase. Her forbinder vi app'en til vores Firestore-database,
// så opslagene bliver gemt online i stedet for kun at ligge i app'ens hukommelse.
import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

// ───────────────────────────────────────────────────────────────
// Konfigurationen kommer fra Firebase-konsollen:
// Project settings → Your apps → Web app (</>) → "firebaseConfig"
// ───────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyDBewVls-VEnq8SNZdwe1vxQPfhJTenZAs",
  authDomain: "pantmakker-database.firebaseapp.com",
  projectId: "pantmakker-database",
  storageBucket: "pantmakker-database.firebasestorage.app",
  messagingSenderId: "963470256237",
  appId: "1:963470256237:web:c4e4230be8dc4291187764",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// experimentalForceLongPolling gør at Firestore virker stabilt i Expo Go,
// hvor den normale streaming-forbindelse ellers kan hænge.
export const db = initializeFirestore(app, { experimentalForceLongPolling: true });

// Navnet på vores samling (tabel) i databasen
export const PANT_SAMLING = "pant";
