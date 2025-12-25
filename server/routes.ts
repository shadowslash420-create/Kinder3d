import type { Express, Request, Response, NextFunction } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  adminLoginSchema, insertCategorySchema, updateCategorySchema,
  insertMenuItemSchema, updateMenuItemSchema, insertOrderSchema, updateOrderSchema
} from "@shared/schema";
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

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.adminId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

import { adminDb, sendPushNotification } from "./firebase-admin";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // FCM Token Registration
  app.post("/api/notifications/register", async (req, res) => {
    try {
      if (!adminDb) {
        return res.status(503).json({ error: "Push notifications not available" });
      }
      
      const { userId, role, token } = req.body;
      if (!userId || !token) return res.status(400).json({ error: "Missing userId or token" });
      
      const tokenRef = adminDb.collection("fcm_tokens").doc(token);
      await tokenRef.set({
        userId,
        role: role || "client",
        token,
        updatedAt: new Date(),
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Token registration error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Helper to notify admins and staff
  async function notifyStaff(title: string, body: string, url: string) {
    if (!adminDb) {
      console.warn("Push notifications not available: Firebase not configured");
      return;
    }
    
    const snapshot = await adminDb.collection("fcm_tokens")
      .where("role", "in", ["admin", "staff_a", "staff_b"])
      .get();
    
    const tokens = snapshot.docs.map(doc => doc.data().token);
    if (tokens.length > 0) {
      await sendPushNotification({ tokens, title, body, url });
    }
  }

  // Helper to notify client
  async function notifyClient(userId: string, title: string, body: string, url: string) {
    if (!adminDb) {
      console.warn("Push notifications not available: Firebase not configured");
      return;
    }
    
    const snapshot = await adminDb.collection("fcm_tokens")
      .where("userId", "==", userId)
      .get();
    
    const tokens = snapshot.docs.map(doc => doc.data().token);
    if (tokens.length > 0) {
      await sendPushNotification({ tokens, title, body, url });
    }
  }
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

  app.post("/api/admin/login", async (req, res) => {
    try {
      const parsed = adminLoginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid credentials format" });
      }

      const admin = await storage.validateAdminPassword(parsed.data.email, parsed.data.password);
      if (!admin) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      req.session.adminId = admin.id;
      res.json({ id: admin.id, email: admin.email, name: admin.name, role: admin.role });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: "Failed to logout" });
      res.json({ success: true });
    });
  });

  app.get("/api/admin/me", requireAdmin, async (req, res) => {
    try {
      const admin = await storage.getAdminById(req.session.adminId!);
      if (!admin) return res.status(404).json({ error: "Admin not found" });
      res.json({ id: admin.id, email: admin.email, name: admin.name, role: admin.role });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/categories", async (_req, res) => {
    try {
      const cats = await storage.getCategories();
      res.json(cats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.post("/api/admin/categories", requireAdmin, async (req, res) => {
    try {
      const parsed = insertCategorySchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
      const category = await storage.createCategory(parsed.data);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  app.put("/api/admin/categories/:id", requireAdmin, async (req, res) => {
    try {
      const parsed = updateCategorySchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
      const category = await storage.updateCategory(req.params.id, parsed.data);
      if (!category) return res.status(404).json({ error: "Category not found" });
      res.json(category);
    } catch (error) {
      console.error("Update category error:", error);
      res.status(500).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", requireAdmin, async (req, res) => {
    try {
      const success = await storage.deleteCategory(req.params.id);
      if (!success) return res.status(404).json({ error: "Category not found" });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  app.get("/api/menu-items", async (req, res) => {
    try {
      const categoryId = req.query.categoryId as string | undefined;
      const items = await storage.getMenuItems(categoryId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  });

  app.get("/api/menu-items/:id", async (req, res) => {
    try {
      const item = await storage.getMenuItemById(req.params.id);
      if (!item) return res.status(404).json({ error: "Menu item not found" });
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu item" });
    }
  });

  app.post("/api/admin/menu-items", requireAdmin, upload.single("image"), async (req, res) => {
    try {
      const data = { ...req.body };
      if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;
      if (data.price) data.price = String(data.price);
      if (data.isAvailable) data.isAvailable = data.isAvailable === "true";
      if (data.isFeatured) data.isFeatured = data.isFeatured === "true";
      if (data.preparationTime) data.preparationTime = parseInt(data.preparationTime);

      const parsed = insertMenuItemSchema.safeParse(data);
      if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
      const item = await storage.createMenuItem(parsed.data);
      res.status(201).json(item);
    } catch (error) {
      console.error("Create menu item error:", error);
      res.status(500).json({ error: "Failed to create menu item" });
    }
  });

  app.put("/api/admin/menu-items/:id", requireAdmin, upload.single("image"), async (req, res) => {
    try {
      const data = { ...req.body };
      if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;
      if (data.price) data.price = String(data.price);
      if (data.isAvailable !== undefined) data.isAvailable = data.isAvailable === "true";
      if (data.isFeatured !== undefined) data.isFeatured = data.isFeatured === "true";
      if (data.preparationTime) data.preparationTime = parseInt(data.preparationTime);

      const parsed = updateMenuItemSchema.safeParse(data);
      if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
      const item = await storage.updateMenuItem(req.params.id, parsed.data);
      if (!item) return res.status(404).json({ error: "Menu item not found" });
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to update menu item" });
    }
  });

  app.delete("/api/admin/menu-items/:id", requireAdmin, async (req, res) => {
    try {
      const success = await storage.deleteMenuItem(req.params.id);
      if (!success) return res.status(404).json({ error: "Menu item not found" });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete menu item" });
    }
  });

  app.get("/api/admin/orders", requireAdmin, async (req, res) => {
    try {
      const { status, startDate, endDate, search } = req.query;
      const filters: any = {};
      if (status) filters.status = status as string;
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      if (search) filters.search = search as string;
      
      const ordersList = await storage.getOrders(filters);
      res.json(ordersList);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/admin/orders/export", requireAdmin, async (req, res) => {
    try {
      const { status, startDate, endDate } = req.query;
      const filters: any = {};
      if (status) filters.status = status as string;
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      
      const ordersList = await storage.getOrders(filters);
      
      const csv = [
        ["Order #", "Customer", "Phone", "Email", "Items", "Subtotal", "Tax", "Total", "Status", "Payment", "Date"].join(","),
        ...ordersList.map(o => [
          o.orderNumber,
          `"${o.customerName}"`,
          o.customerPhone || "",
          o.customerEmail || "",
          `"${o.items.map(i => `${i.name} x${i.quantity}`).join("; ")}"`,
          o.subtotal,
          o.tax,
          o.total,
          o.status,
          o.paymentStatus,
          o.createdAt.toISOString(),
        ].join(","))
      ].join("\n");
      
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=orders-${Date.now()}.csv`);
      res.send(csv);
    } catch (error) {
      res.status(500).json({ error: "Failed to export orders" });
    }
  });

  app.get("/api/admin/orders/:id", requireAdmin, async (req, res) => {
    try {
      const order = await storage.getOrderById(req.params.id);
      if (!order) return res.status(404).json({ error: "Order not found" });
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.put("/api/admin/orders/:id", requireAdmin, async (req, res) => {
    try {
      const parsed = updateOrderSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
      const order = await storage.updateOrder(req.params.id, parsed.data);
      if (!order) return res.status(404).json({ error: "Order not found" });

      // Notify client about status update
      if (parsed.data.status && order.userId) {
        notifyClient(
          order.userId,
          "Order Update",
          `Your order #${order.orderNumber} is now ${parsed.data.status}`,
          "/orders"
        ).catch(err => console.error("Notification error:", err));
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const parsed = insertOrderSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
      const order = await storage.createOrder(parsed.data);
      // Notify admins/staff about new order
      notifyStaff(
        "New Order Received!",
        `Order #${order.orderNumber} from ${order.customerName}`,
        "/admin/orders"
      ).catch(err => console.error("Notification error:", err));
      
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/admin/analytics", requireAdmin, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;
      const analytics = await storage.getAnalytics(start, end);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.get("/api/admin/popular-items", requireAdmin, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const items = await storage.getPopularItems(limit);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch popular items" });
    }
  });

  app.post("/api/admin/setup", async (req, res) => {
    try {
      if (process.env.NODE_ENV === "production") {
        return res.status(403).json({ error: "Setup not allowed in production" });
      }
      
      const existing = await storage.getAdminByEmail("oussamaanis2005@gmail.com");
      if (existing) {
        return res.json({ message: "Admin already exists", exists: true });
      }
      
      const admin = await storage.createAdmin({
        email: "oussamaanis2005@gmail.com",
        password: "admin123",
        name: "Admin",
        role: "admin",
      });
      
      res.status(201).json({ message: "Admin created successfully", id: admin.id });
    } catch (error) {
      console.error("Setup error:", error);
      res.status(500).json({ error: "Failed to setup admin" });
    }
  });

  return httpServer;
}
