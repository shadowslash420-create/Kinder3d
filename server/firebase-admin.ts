import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");

let firebaseAdmin: ReturnType<typeof getApp> | null = null;
let adminDb: ReturnType<typeof getFirestore> | null = null;
let messaging: ReturnType<typeof getMessaging> | null = null;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT && Object.keys(serviceAccount).length > 0) {
    firebaseAdmin = getApps().length > 0 
      ? getApp() 
      : initializeApp({
          credential: cert(serviceAccount),
        });
    
    adminDb = getFirestore(firebaseAdmin);
    messaging = getMessaging(firebaseAdmin);
  } else {
    console.warn("Firebase Admin SDK not initialized: FIREBASE_SERVICE_ACCOUNT not configured");
  }
} catch (error) {
  console.warn("Firebase Admin SDK initialization failed:", error);
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
    console.warn("Cannot send push notification: Firebase Admin SDK not initialized");
    return;
  }

  if (tokens.length === 0) return;

  const fcmData: Record<string, string> = {
    ...(data || {}),
    url: url || "/",
    title,
    body,
    click_action: "FLUTTER_NOTIFICATION_CLICK",
  };

  const message = {
    data: fcmData,
    android: {
      priority: "high" as const,
      notification: {
        title,
        body,
        clickAction: "FLUTTER_NOTIFICATION_CLICK",
        channelId: "orders",
        ...(icon ? { imageUrl: icon } : {}),
      },
    },
    apns: {
      payload: {
        aps: {
          alert: { title, body },
          sound: "default",
          badge: 1,
          "mutable-content": 1,
        },
      },
      fcmOptions: {
        ...(icon ? { imageUrl: icon } : {}),
      },
    },
    tokens: tokens,
  };

  try {
    const response = await messaging.sendEachForMulticast(message);
    console.log(`FCM: sent ${response.successCount}/${tokens.length} notifications`);
    
    if (response.failureCount > 0) {
      const failedTokens: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
          console.error(`FCM failure for token ${tokens[idx]}:`, resp.error);
        }
      });

      if (adminDb && failedTokens.length > 0) {
        const batch = adminDb.batch();
        for (const token of failedTokens) {
          const errorCode = response.responses[tokens.indexOf(token)]?.error?.code;
          if (errorCode === "messaging/registration-token-not-registered" ||
              errorCode === "messaging/invalid-registration-token") {
            batch.delete(adminDb.collection("fcm_tokens").doc(token));
          }
        }
        await batch.commit().catch(() => {});
      }
    }
    return response;
  } catch (error) {
    console.error("Error sending push notification:", error);
    throw error;
  }
}
