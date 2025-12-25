import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");

export const firebaseAdmin = getApps().length > 0 
  ? getApp() 
  : initializeApp({
      credential: cert(serviceAccount),
    });

export const adminDb = getFirestore(firebaseAdmin);
export const messaging = getMessaging(firebaseAdmin);

export async function sendPushNotification({ tokens, title, body, icon, data, url }: {
  tokens: string[];
  title: string;
  body: string;
  icon?: string;
  data?: Record<string, string>;
  url?: string;
}) {
  if (tokens.length === 0) return;

  const message = {
    notification: { title, body, imageUrl: icon },
    data: { ...data, url: url || "/" },
    tokens: tokens,
  };

  try {
    const response = await messaging.sendEachForMulticast(message);
    console.log(`Successfully sent ${response.successCount} notifications`);
    
    if (response.failureCount > 0) {
      const failedTokens: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
          console.error(`Failure sending to token ${tokens[idx]}:`, resp.error);
        }
      });
      // Optionally clean up failed tokens from Firestore here
    }
    return response;
  } catch (error) {
    console.error("Error sending push notification:", error);
    throw error;
  }
}
