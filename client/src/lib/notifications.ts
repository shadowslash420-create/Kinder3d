import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

export const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || "";

export async function requestNotificationPermission(userId: string, role: string) {
  try {
    console.log("Requesting notification permission...");
    let permission = Notification.permission;
    console.log("Current permission:", permission);
    
    if (permission === 'default') {
      permission = await Notification.requestPermission();
      console.log("New permission result:", permission);
    }
    
    if (permission === 'granted') {
      console.log("Attempting to get FCM token with VAPID key:", VAPID_KEY);
      try {
        console.log("Registering service worker...");
        // Use a simpler approach for registration
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        
        // Wait for it to be ready
        await navigator.serviceWorker.ready;
        
        const token = await getToken(messaging, { 
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: registration
        });
        
        if (token) {
          console.log("FCM Token generated successfully:", token);
          const response = await fetch('/api/notifications/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, role, token }),
          });
          const result = await response.json();
          console.log("Registration result:", result);
          return token;
        } else {
          console.warn("No FCM token generated.");
        }
      } catch (tokenError) {
        console.error("Error getting FCM token:", tokenError);
      }
    } else {
      console.warn("Notification permission was not granted:", permission);
    }
  } catch (error) {
    console.error("Error in requestNotificationPermission:", error);
  }
  return null;
}

export function onMessageListener() {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
}
