// database.js

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase, ref } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD6S74XFOJV07BcWnXOSwatbJOfY6JbY3Y",
  authDomain: "cc25-722ca.firebaseapp.com",
  projectId: "cc25-722ca",
  storageBucket: "cc25-722ca.firebasestorage.app",
  messagingSenderId: "150427983183",
  appId: "1:150427983183:web:0f10d68b72eb7fa5f9393a",
};

// Make sure we only create the app once (important with hot reload)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// --- Auth (React Native) ---
let auth;
try {
  // First time: initialize with React Native persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // If Auth was already initialized (e.g. hot reload), just get the existing instance
  auth = getAuth(app);
}

// --- Realtime Database ---
const rtdb = getDatabase(
  app,
  "https://cc25-722ca-default-rtdb.europe-west1.firebasedatabase.app/"
);

// Convenience refs for your data
const cafesRef = () => ref(rtdb, "cafes");
const ordersRef = () => ref(rtdb, "orders");

// Exports
export { app, auth, rtdb, cafesRef, ordersRef };