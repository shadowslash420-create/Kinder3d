import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { getFirestore } from "firebase-admin/firestore";

let firebaseAdmin: ReturnType<typeof getApp> | null = null;
let adminDb: ReturnType<typeof getFirestore> | null = null;
let messaging: ReturnType<typeof getMessaging> | null = null;

try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");
  
  if (serviceAccount.project_id) {
    firebaseAdmin = getApps().length > 0 
      ? getApp() 
      : initializeApp({
          credential: cert(serviceAccount),
        });

    adminDb = getFirestore(firebaseAdmin);
    messaging = getMessaging(firebaseAdmin);
    console.log("Firebase Admin initialized successfully");
  } else {
    console.warn("Firebase Admin not initialized: FIREBASE_SERVICE_ACCOUNT not configured");
  }
} catch (error) {
  console.warn("Firebase Admin initialization failed:", error);
}

export { firebaseAdmin, adminDb, messaging };

export async function sendPushNotification({ tokens, title, body, icon, data, url }: {
  tokens: string[];
  title: string;
  body: string;
  icon?: string;
  data?: Record<string, string>;
  url?: string;
}) {
  if (!messaging) {
    console.warn("Push notifications not available: Firebase Admin not initialized");
    return null;
  }

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
