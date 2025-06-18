// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBcq33tb0Sefbth75Igk0mjIb6wZPcr9Q0",
  authDomain: "testiqjita.firebaseapp.com",
  projectId: "testiqjita",
  storageBucket: "testiqjita.firebasestorage.app",
  messagingSenderId: "127841140440",
  appId: "1:127841140440:web:9944ef96190a54320121ad",
  measurementId: "G-GHJF4HD44T"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log("Received background message", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo192.png" // optional icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
