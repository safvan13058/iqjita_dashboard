// firebase-init.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBcq33tb0Sefbth75Igk0mjIb6wZPcr9Q0",
  authDomain: "testiqjita.firebaseapp.com",
  projectId: "testiqjita",
  storageBucket: "testiqjita.firebasestorage.app",
  messagingSenderId: "127841140440",
  appId: "1:127841140440:web:9944ef96190a54320121ad",
  measurementId: "G-GHJF4HD44T"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Messaging
const messaging = getMessaging(firebaseApp);

export { messaging, getToken, onMessage };
