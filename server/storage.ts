import { db } from "./db";
import { 
  admins, categories, menuItems, orders,
  type Admin, type InsertAdmin, 
  type Category, type InsertCategory, type UpdateCategory,
  type MenuItem, type InsertMenuItem, type UpdateMenuItem,
  type Order, type InsertOrder, type UpdateOrder
} from "@shared/schema";
import { eq, desc, asc, ilike, and, sql, gte, lte, count, sum } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  getAdminByEmail(email: string): Promise<Admin | undefined>;
  getAdminById(id: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  validateAdminPassword(email: string, password: string): Promise<Admin | null>;
  
  getCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: UpdateCategory): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;
  
  getMenuItems(categoryId?: string): Promise<MenuItem[]>;
  getMenuItemById(id: string): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: string, item: UpdateMenuItem): Promise<MenuItem | undefined>;
  deleteMenuItem(id: string): Promise<boolean>;
  
  getOrders(filters?: OrderFilters): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | undefined>;
  getOrderByNumber(orderNumber: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: UpdateOrder): Promise<Order | undefined>;
  
  getAnalytics(startDate?: Date, endDate?: Date): Promise<Analytics>;
  getPopularItems(limit?: number): Promise<PopularItem[]>;
}

export interface OrderFilters {
  status?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

export interface Analytics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Record<string, number>;
  revenueByDay: { date: string; revenue: number }[];
}

export interface PopularItem {
  menuItemId: string;
  name: string;
  totalQuantity: number;
  totalRevenue: number;
}

class DatabaseStorage implements IStorage {
  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.email, email));
    return admin;
  }

  async getAdminById(id: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.id, id));
    return admin;
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(admin.password, 10);
    const [newAdmin] = await db.insert(admins).values({
      ...admin,
      password: hashedPassword,
    }).returning();
    return newAdmin;
  }

  async validateAdminPassword(email: string, password: string): Promise<Admin | null> {
    const admin = await this.getAdminByEmail(email);
    if (!admin) return null;
    const isValid = await bcrypt.compare(password, admin.password);
    return isValid ? admin : null;
  }

  async getCategories(): Promise<Category[]> {
    return db.select().from(categories).orderBy(asc(categories.displayOrder), asc(categories.name));
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values({
      ...category,
      updatedAt: new Date(),
    }).returning();
    return newCategory;
  }

  async updateCategory(id: string, category: UpdateCategory): Promise<Category | undefined> {
    const [updated] = await db.update(categories)
      .set({ ...category, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id)).returning();
    return result.length > 0;
  }

  async getMenuItems(categoryId?: string): Promise<MenuItem[]> {
    if (categoryId) {
      return db.select().from(menuItems).where(eq(menuItems.categoryId, categoryId)).orderBy(asc(menuItems.name));
    }
    return db.select().from(menuItems).orderBy(asc(menuItems.name));
  }

  async getMenuItemById(id: string): Promise<MenuItem | undefined> {
    const [item] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return item;
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const [newItem] = await db.insert(menuItems).values({
      ...item,
      updatedAt: new Date(),
    }).returning();
    return newItem;
  }

  async updateMenuItem(id: string, item: UpdateMenuItem): Promise<MenuItem | undefined> {
    const [updated] = await db.update(menuItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(menuItems.id, id))
      .returning();
    return updated;
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    const result = await db.delete(menuItems).where(eq(menuItems.id, id)).returning();
    return result.length > 0;
  }

  async getOrders(filters?: OrderFilters): Promise<Order[]> {
    let query = db.select().from(orders);
    const conditions = [];
    
    if (filters?.status) {
      conditions.push(eq(orders.status, filters.status));
    }
    if (filters?.startDate) {
      conditions.push(gte(orders.createdAt, filters.startDate));
    }
    if (filters?.endDate) {
      conditions.push(lte(orders.createdAt, filters.endDate));
    }
    if (filters?.search) {
      conditions.push(
        sql`(${orders.customerName} ILIKE ${`%${filters.search}%`} OR ${orders.orderNumber} ILIKE ${`%${filters.search}%`})`
      );
    }
    
    if (conditions.length > 0) {
      return db.select().from(orders).where(and(...conditions)).orderBy(desc(orders.createdAt));
    }
    
    return db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
    return order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
    const [newOrder] = await db.insert(orders).values({
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      items: order.items as any,
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      notes: order.notes,
      orderNumber,
      updatedAt: new Date(),
    }).returning();
    return newOrder;
  }

  async updateOrder(id: string, order: UpdateOrder): Promise<Order | undefined> {
    const [updated] = await db.update(orders)
      .set({ ...order, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updated;
  }

  async getAnalytics(startDate?: Date, endDate?: Date): Promise<Analytics> {
    const conditions = [];
    if (startDate) conditions.push(gte(orders.createdAt, startDate));
    if (endDate) conditions.push(lte(orders.createdAt, endDate));
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const allOrders = whereClause 
      ? await db.select().from(orders).where(whereClause)
      : await db.select().from(orders);
    
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, o) => sum + parseFloat(o.total || "0"), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const ordersByStatus: Record<string, number> = {};
    allOrders.forEach(o => {
      ordersByStatus[o.status] = (ordersByStatus[o.status] || 0) + 1;
    });
    
    const revenueByDay: { date: string; revenue: number }[] = [];
    const dailyRevenue: Record<string, number> = {};
    allOrders.forEach(o => {
      const date = o.createdAt.toISOString().split('T')[0];
      dailyRevenue[date] = (dailyRevenue[date] || 0) + parseFloat(o.total || "0");
    });
    Object.entries(dailyRevenue).forEach(([date, revenue]) => {
      revenueByDay.push({ date, revenue });
    });
    revenueByDay.sort((a, b) => a.date.localeCompare(b.date));
    
    return { totalOrders, totalRevenue, averageOrderValue, ordersByStatus, revenueByDay };
  }

  async getPopularItems(limit = 10): Promise<PopularItem[]> {
    const allOrders = await db.select().from(orders);
    const itemStats: Record<string, PopularItem> = {};
    
    allOrders.forEach(order => {
      if (Array.isArray(order.items)) {
        order.items.forEach(item => {
          if (!itemStats[item.menuItemId]) {
            itemStats[item.menuItemId] = {
              menuItemId: item.menuItemId,
              name: item.name,
              totalQuantity: 0,
              totalRevenue: 0,
            };
          }
          itemStats[item.menuItemId].totalQuantity += item.quantity;
          itemStats[item.menuItemId].totalRevenue += item.price * item.quantity;
        });
      }
    });
    
    return Object.values(itemStats)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, limit);
  }
}

export const storage = new DatabaseStorage();
