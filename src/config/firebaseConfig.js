import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAzd7H7osMun82EqK37UHjEn-dpX2JM2rI",
  authDomain: "delivery-eb503.firebaseapp.com",
  databaseURL: "https://delivery-eb503-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "delivery-eb503",
  storageBucket: "delivery-eb503.firebasestorage.app",
  messagingSenderId: "708037846990",
  appId: "708037846990:web:8e6824ccdece44b7eeed9f",
  measurementId: "G-8HXQB157V7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const database = getDatabase(app);

// Initialize Firebase Auth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { app, database, auth };
