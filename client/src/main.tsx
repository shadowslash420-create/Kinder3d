import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

declare global {
  interface Window {
    onFCMTokenReceived?: (token: string) => void;
    FirebasePush?: { postMessage: (msg: string) => void };
    __fcmToken?: string;
  }
}

window.onFCMTokenReceived = function (token: string) {
  console.log("Received FCM Token from App:", token);
  window.__fcmToken = token;

  fetch("/api/notifications/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  }).catch((err) => console.error("Failed to save FCM token:", err));
};

if (window.FirebasePush) {
  window.FirebasePush.postMessage("getFCMToken");
}

createRoot(document.getElementById("root")!).render(<App />);
