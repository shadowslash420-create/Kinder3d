import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { getFirestore } from "firebase-admin/firestore";

// ─── Initialize Firebase Admin ───────────────────────────────────────────────

let serviceAccount: Record<string, any> = {};

try {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (raw) {
    serviceAccount = JSON.parse(raw);
  }
} catch (e) {
  console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:", e);
}

let firebaseAdmin: ReturnType<typeof getApp> | null = null;
export let adminDb: ReturnType<typeof getFirestore> | null = null;
let messaging: ReturnType<typeof getMessaging> | null = null;

try {
  if (serviceAccount.project_id) {
    firebaseAdmin =
      getApps().length > 0
        ? getApp()
        : initializeApp({
            credential: cert(serviceAccount as any),
          });

    adminDb = getFirestore(firebaseAdmin);
    messaging = getMessaging(firebaseAdmin);

    console.log(
      "✅ Firebase Admin SDK initialized. Project:",
      serviceAccount.project_id
    );
  } else {
    console.warn(
      "❌ Firebase Admin SDK NOT initialized — FIREBASE_SERVICE_ACCOUNT is missing or invalid."
    );
  }
} catch (error) {
  console.error("❌ Firebase Admin SDK initialization error:", error);
}

export { firebaseAdmin, messaging };

// ─── Send Push Notification ───────────────────────────────────────────────────

export async function sendPushNotification({
  tokens,
  title,
  body,
  icon,
  data,
  url,
}: {
  tokens: string[];
  title: string;
  body: string;
  icon?: string;
  data?: Record<string, string>;
  url?: string;
}) {
  if (!messaging) {
    console.warn(
      "⚠️ Cannot send push notification: Firebase Admin SDK not initialized."
    );
    return;
  }

  // Filter out any empty/null tokens
  const validTokens = tokens.filter((t) => t && t.trim().length > 0);
  if (validTokens.length === 0) {
    console.warn("⚠️ No valid FCM tokens to send to.");
    return;
  }

  // Extra data payload (all values must be strings for FCM)
  const fcmData: Record<string, string> = {
    ...(data || {}),
    url: url || "/",
    title,
    body,
    click_action: "FLUTTER_NOTIFICATION_CLICK",
  };

  const message = {
    // ✅ TOP-LEVEL notification — this is what makes the system show a
    //    banner even when the app is in the BACKGROUND or CLOSED.
    notification: {
      title,
      body,
    },

    // Extra data for your Flutter/web app to read
    data: fcmData,

    // Android-specific settings
    android: {
      priority: "high" as const,
      notification: {
        title,
        body,
        channelId: "orders",
        clickAction: "FLUTTER_NOTIFICATION_CLICK",
        sound: "default",
        ...(icon ? { imageUrl: icon } : {}),
      },
    },

    // iOS (APNS) settings
    apns: {
      headers: {
        "apns-priority": "10",
      },
      payload: {
        aps: {
          alert: { title, body },
          sound: "default",
          badge: 1,
          "mutable-content": 1,
          "content-available": 1,
        },
      },
      ...(icon
        ? {
            fcmOptions: {
              imageUrl: icon,
            },
          }
        : {}),
    },

    tokens: validTokens,
  };

  try {
    console.log(`📤 Sending FCM to ${validTokens.length} device(s)...`);
    const response = await messaging.sendEachForMulticast(message);

    console.log(
      `✅ FCM result: ${response.successCount} sent, ${response.failureCount} failed out of ${validTokens.length}`
    );

    // ── Auto-clean invalid/expired tokens from Firestore ──────────────────
    if (response.failureCount > 0 && adminDb) {
      const batch = adminDb.batch();
      let staleCount = 0;

      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const code = resp.error?.code;
          console.error(
            `❌ FCM failed for token [...${validTokens[idx].slice(-8)}]:`,
            resp.error?.message
          );

          // Remove tokens that are no longer valid
          if (
            code === "messaging/registration-token-not-registered" ||
            code === "messaging/invalid-registration-token" ||
            code === "messaging/invalid-argument"
          ) {
            batch.delete(
              adminDb!.collection("fcm_tokens").doc(validTokens[idx])
            );
            staleCount++;
          }
        }
      });

      if (staleCount > 0) {
        await batch.commit().catch((err) =>
          console.error("Failed to clean stale tokens:", err)
        );
        console.log(`🗑️ Removed ${staleCount} stale token(s) from Firestore.`);
      }
    }

    return response;
  } catch (error) {
    console.error("❌ FCM sendEachForMulticast error:", error);
    throw error;
  }
}

