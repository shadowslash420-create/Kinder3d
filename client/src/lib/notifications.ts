import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

export const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export async function requestNotificationPermission(userId: string, role: string) {
  try {
    console.log("Requesting notification permission...");
    const permission = await Notification.requestPermission();
    console.log("Permission result:", permission);
    
    if (permission === 'granted') {
      console.log("Attempting to get FCM token with VAPID key:", VAPID_KEY);
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (token) {
        console.log("FCM Token generated successfully:", token);
        // Send token to backend
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
