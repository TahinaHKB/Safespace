// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAv049gag-TcG7bkdxUoFq4BgJ9Im4dWGU",
  authDomain: "safespace-34ce3.firebaseapp.com",
  projectId: "safespace-34ce3",
  storageBucket: "safespace-34ce3.firebasestorage.app",
  messagingSenderId: "971056015760",
  appId: "1:971056015760:web:44198f3ff78a9630deeb15",
  measurementId: "G-1YQXFRMPHW",
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Exporter les services que tu vas utiliser
export const auth = getAuth(app);      // Authentification
export const db = getFirestore(app);   // Base de données Firestore
export const storage = getStorage(app); // Stockage des images
export const messaging = getMessaging(app);
