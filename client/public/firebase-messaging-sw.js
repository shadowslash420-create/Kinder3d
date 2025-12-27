/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyApo_-Y96wRPfJ3zdDWmzOuj3E66c1hFxk",
  authDomain: "kinder-87e7e.firebaseapp.com",
  projectId: "kinder-87e7e",
  storageBucket: "kinder-87e7e.firebasestorage.app",
  messagingSenderId: "447252216729",
  appId: "1:447252216729:web:371d0ec1dce02b52db7108",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || "/favicon.png",
    data: {
      url: payload.data?.url || "/",
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data.url;
  event.waitUntil(clients.openWindow(url));
});
