import type { Express, Request, Response, NextFunction } from "express";
import express from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");

declare module "express-session" {
  interface SessionData {
    adminId?: string;
  }
}

const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

import { adminDb, sendPushNotification } from "./firebase-admin";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/notifications/register", async (req, res) => {
    try {
      const { userId, role, token, email } = req.body;
      if (!token) return res.status(400).json({ error: "Missing token" });
      
      if (!adminDb) return res.status(500).json({ error: "Firebase not initialized" });
      const tokenRef = adminDb.collection("fcm_tokens").doc(token);
      const data: Record<string, any> = {
        token,
        role: role || "customer",
        updatedAt: new Date(),
      };
      if (userId) data.userId = userId;
      if (email) data.email = email;
      await tokenRef.set(data, { merge: true });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Token registration error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/notifications/order-status", async (req, res) => {
    try {
      const { orderId, orderNumber, status, userId, email } = req.body;
      if (!orderId || !status) return res.status(400).json({ error: "Missing orderId or status" });
      if (!adminDb) return res.status(500).json({ error: "Firebase not initialized" });

      const statusLabels: Record<string, string> = {
        pending: "Pending",
        received: "Received",
        preparing: "Being Prepared",
        ready: "Ready for Pickup",
        picked_up: "Picked Up",
        in_transit: "On Its Way",
        delivered: "Delivered",
        cancelled: "Cancelled",
      };

      const statusLabel = statusLabels[status] || status;
      const title = "Order Update 🔔";
      const body = `Your order #${orderNumber || orderId} is now: ${statusLabel}`;
      const url = "/my-orders";

      const notificationData: Record<string, any> = {
        title,
        body,
        url,
        orderId,
        orderNumber: orderNumber || orderId,
        status,
        read: false,
        createdAt: new Date(),
      };
      if (userId) notificationData.userId = userId;
      if (email) notificationData.email = email;

      await adminDb.collection("notifications").add(notificationData);

      let tokens: string[] = [];

      if (userId) {
        const snapshot = await adminDb.collection("fcm_tokens")
          .where("userId", "==", userId)
          .get();
        tokens = snapshot.docs.map(doc => doc.data().token);
      }

      if (tokens.length === 0 && email) {
        const snapshot = await adminDb.collection("fcm_tokens")
          .where("email", "==", email)
          .get();
        tokens = snapshot.docs.map(doc => doc.data().token);
      }

      if (tokens.length > 0) {
        await sendPushNotification({
          tokens,
          title,
          body,
          url,
          data: {
            type: "order_status",
            orderId,
            orderNumber: orderNumber || orderId,
            status,
          },
        });
        res.json({ success: true, notified: tokens.length });
      } else {
        res.json({ success: true, notified: 0, message: "No FCM tokens found, notification saved to Firestore" });
      }
    } catch (error) {
      console.error("Order status notification error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "lax",
      },
    })
  );

  app.use("/uploads", (req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=31536000");
    next();
  }, express.static(uploadDir));

  return httpServer;
}
