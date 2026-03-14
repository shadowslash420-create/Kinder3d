import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

declare global {
  interface Window {
    askFlutterForToken?: (userId: string, role: string, email: string) => void;
    registerFcmToken?: (token: string, userId: string, role: string, email: string) => Promise<void>;
    FirebasePush?: { postMessage: (msg: string) => void };
    __fcmToken?: string;
  }
}

window.askFlutterForToken = function (userId: string, role: string, email: string) {
  if (window.FirebasePush) {
    window.FirebasePush.postMessage(`registerToken:${userId},${role},${email}`);
  }
};

window.registerFcmToken = async function (token: string, userId: string, role: string, email: string) {
  try {
    window.__fcmToken = token;
    await fetch('/api/notifications/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, userId, role, email })
    });
    console.log("Successfully securely saved Push Token to Database!");
  } catch (error) {
    console.error("Failed to register token", error);
  }
};

createRoot(document.getElementById("root")!).render(<App />);
