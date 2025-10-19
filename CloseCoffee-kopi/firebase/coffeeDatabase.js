// Cæcilia

import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";

const coffeeConfig = {
  apiKey: "AIzaSyANYnvKQ-wrSu_rRS1ibMzkyyG3uFdIQ78",
  authDomain: "closecoffee-c1b08.firebaseapp.com",
  projectId: "closecoffee-c1b08",
  storageBucket: "closecoffee-c1b08.firebasestorage.app",
  messagingSenderId: "58542228805",
  appId: "1:58542228805:web:e2f1cacbb7c111fdde6a2c",
};

const COFFEE_APP_NAME = "coffee-app";

const coffeeApp =
  getApps().find((a) => a.name === COFFEE_APP_NAME) ??
  initializeApp(coffeeConfig, COFFEE_APP_NAME);

export const rtdbCoffee = getDatabase(
  coffeeApp,
  "https://closecoffee-c1b08-default-rtdb.europe-west1.firebasedatabase.app/"
);

export const cafesRef = () => ref(rtdbCoffee, "cafes"); // adgang til mappen cafes
export const ordersRef = () => ref(rtdbCoffee, "orders"); // adgang til orders
