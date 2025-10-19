// anton
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyD6S74XFOJV07BcWnXOSwatbJOfY6JbY3Y",
  authDomain: "cc25-722ca.firebaseapp.com",
  projectId: "cc25-722ca",
  storageBucket: "cc25-722ca.firebasestorage.app",
  messagingSenderId: "150427983183",
  appId: "1:150427983183:web:0f10d68b72eb7fa5f9393a"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };