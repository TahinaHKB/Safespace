// firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDRUi14Ra1emKbcWAO7NBDlagnv81o-tog",
  authDomain: "konnekt-cbe73.firebaseapp.com",
  projectId: "konnekt-cbe73",
  storageBucket: "konnekt-cbe73.firebasestorage.app",
  messagingSenderId: "99876262987",
  appId: "1:99876262987:web:e4eaf4b249d5dad47ca9ce",
  measurementId: "G-WKMEP7SX03"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message:", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo.png", // facultatif
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
