import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, type User } from "firebase/auth";
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, setDoc, query, where, orderBy, onSnapshot, serverTimestamp, type DocumentData, Timestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  throw new Error("Missing Firebase configuration. Please set FIREBASE_* environment variables in your Replit Secrets.");
}

import { getMessaging } from "firebase/messaging";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);
export const googleProvider = new GoogleAuthProvider();

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "oussamaanis2005@gmail.com";

export interface StaffMember {
  id: string;
  email: string;
  name: string;
  role: "Staff A" | "Staff B";
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  preparationTime?: number;
  ingredients?: string;
  allergens?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  customerLat?: number;
  customerLng?: number;
  assignedShopId?: string;
  assignedShopName?: string;
  distanceKm?: number;
  email?: string;
  userId?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "pending" | "received" | "preparing" | "ready" | "picked_up" | "in_transit" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "refunded";
  paymentMethod?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  email: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  isTopRated?: boolean;
  createdAt: Date;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  isResolved: boolean;
  createdAt: Date;
}

export interface Settings {
  id: string;
  key: string;
  value: any;
}

export interface Supplement {
  id: string;
  name: string;
  price: number;
  description?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  supplements?: { id: string; name: string; price: number }[];
}

export interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt: Date;
}

export type UserRole = "admin" | "staff_a" | "staff_b" | "customer";

export async function getUserRole(user: User): Promise<UserRole> {
  if (user.email === ADMIN_EMAIL) {
    return "admin";
  }
  
  const staffDoc = await getDoc(doc(db, "staff", user.email!));
  console.log("Staff doc lookup for", user.email, "- Exists:", staffDoc.exists());
  
  if (staffDoc.exists()) {
    const staffData = staffDoc.data();
    console.log("Staff data:", staffData);
    console.log("Role value:", staffData.role, "Type:", typeof staffData.role);
    
    if (staffData.role === "Staff A") {
      console.log("Matched Staff A - returning staff_a");
      return "staff_a";
    }
    if (staffData.role === "Staff B") {
      console.log("Matched Staff B - returning staff_b");
      return "staff_b";
    }
    console.log("No role match found, returning customer");
  } else {
    console.log("No staff document found for", user.email);
  }
  
  return "customer";
}

export async function getStaffRoleByEmail(email: string): Promise<{ role: UserRole; staffData?: any } | null> {
  if (email === ADMIN_EMAIL) {
    return { role: "admin" };
  }
  
  try {
    const staffDoc = await getDoc(doc(db, "staff", email));
    if (staffDoc.exists()) {
      const staffData = staffDoc.data();
      let role: UserRole = "customer";
      
      if (staffData.role === "Staff A") role = "staff_a";
      if (staffData.role === "Staff B") role = "staff_b";
      
      return { role, staffData };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching staff role for ${email}:`, error);
    return null;
  }
}

export function signInWithGoogle() {
  // Force account selection every time to allow switching between Gmail accounts
  googleProvider.setCustomParameters({ prompt: 'select_account' });
  return signInWithPopup(auth, googleProvider);
}

export function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signUpWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function logOut() {
  return signOut(auth);
}

function convertTimestamp(timestamp: any): Date {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date();
}

export const menuService = {
  async getAll(): Promise<MenuItem[]> {
    const snapshot = await getDocs(collection(db, "menu"));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt),
    })) as MenuItem[];
  },
  
  async getById(id: string): Promise<MenuItem | null> {
    const docRef = await getDoc(doc(db, "menu", id));
    if (!docRef.exists()) return null;
    return { id: docRef.id, ...docRef.data(), createdAt: convertTimestamp(docRef.data().createdAt), updatedAt: convertTimestamp(docRef.data().updatedAt) } as MenuItem;
  },
  
  async create(item: Omit<MenuItem, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const docRef = await addDoc(collection(db, "menu"), {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },
  
  async update(id: string, item: Partial<MenuItem>): Promise<void> {
    try {
      console.log("Updating menu item:", id, item);
      const cleanedItem: Record<string, any> = { updatedAt: serverTimestamp() };
      for (const [key, value] of Object.entries(item)) {
        if (value !== undefined) {
          cleanedItem[key] = value;
        }
      }
      await updateDoc(doc(db, "menu", id), cleanedItem);
      console.log("Menu item updated successfully");
    } catch (error: any) {
      console.error("Error updating menu item:", error.code, error.message);
      throw error;
    }
  },
  
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "menu", id));
  },
  
  subscribe(callback: (items: MenuItem[]) => void) {
    console.log("Subscribing to menu collection...");
    return onSnapshot(collection(db, "menu"), (snapshot) => {
      console.log("Menu snapshot received, count:", snapshot.docs.length);
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt),
        updatedAt: convertTimestamp(doc.data().updatedAt),
      })) as MenuItem[];
      console.log("Available items after filtering:", items.filter(i => i.isAvailable).length);
      callback(items);
    }, (error) => {
      console.error("Error fetching menu items:", error);
      callback([]);
    });
  }
};

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const snapshot = await getDocs(collection(db, "categories"));
    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt),
    })) as Category[];
    return categories.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  },
  
  async getById(id: string): Promise<Category | null> {
    const docRef = await getDoc(doc(db, "categories", id));
    if (!docRef.exists()) return null;
    return { id: docRef.id, ...docRef.data(), createdAt: convertTimestamp(docRef.data().createdAt), updatedAt: convertTimestamp(docRef.data().updatedAt) } as Category;
  },
  
  async create(category: Omit<Category, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const docRef = await addDoc(collection(db, "categories"), {
      ...category,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },
  
  async update(id: string, category: Partial<Category>): Promise<void> {
    try {
      console.log("Updating category:", id, category);
      const cleanedCategory: Record<string, any> = { updatedAt: serverTimestamp() };
      for (const [key, value] of Object.entries(category)) {
        if (value !== undefined && key !== "id" && key !== "createdAt" && key !== "updatedAt") {
          cleanedCategory[key] = value;
        }
      }
      console.log("Cleaned category data:", cleanedCategory);
      await updateDoc(doc(db, "categories", id), cleanedCategory);
      console.log("Category updated successfully");
    } catch (error: any) {
      console.error("Error updating category:", error.code, error.message, error);
      throw error;
    }
  },
  
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "categories", id));
  },
  
  subscribe(callback: (categories: Category[]) => void) {
    console.log("Subscribing to categories collection...");
    return onSnapshot(collection(db, "categories"), (snapshot) => {
      console.log("Categories snapshot received, count:", snapshot.docs.length);
      const categories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt),
        updatedAt: convertTimestamp(doc.data().updatedAt),
      })) as Category[];
      categories.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      callback(categories);
    }, (error) => {
      console.error("Error fetching categories:", error);
      callback([]);
    });
  }
};

export const orderService = {
  async getAll(): Promise<Order[]> {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt),
    })) as Order[];
  },
  
  async getByUser(userId: string): Promise<Order[]> {
    const q = query(
      collection(db, "orders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt),
    })) as Order[];
  },

  async getByEmail(email: string): Promise<Order[]> {
    const q = query(
      collection(db, "orders"),
      where("email", "==", email),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt),
    })) as Order[];
  },
  
  async create(order: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<string> {
    try {
      console.log("Firebase createOrder - data:", order);
      const cleanedOrder: Record<string, any> = {};
      for (const [key, value] of Object.entries(order)) {
        if (value !== undefined) {
          cleanedOrder[key] = value;
        }
      }
      const docRef = await addDoc(collection(db, "orders"), {
        ...cleanedOrder,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log("Firebase createOrder - success, ID:", docRef.id);
      return docRef.id;
    } catch (error: any) {
      console.error("Firebase createOrder - ERROR:", error.code, error.message);
      throw error;
    }
  },
  
  async update(id: string, order: Partial<Order>): Promise<void> {
    await updateDoc(doc(db, "orders", id), {
      ...order,
      updatedAt: serverTimestamp(),
    });
  },
  
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "orders", id));
  },
  
  subscribe(callback: (orders: Order[]) => void) {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt),
        updatedAt: convertTimestamp(doc.data().updatedAt),
      })) as Order[];
      // Explicitly sort just in case orderBy is failing due to missing index
      const sortedOrders = [...orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      callback(sortedOrders);
    }, (error) => {
      console.error("Error fetching orders:", error);
      callback([]);
    });
  },

  subscribeToUserOrders(userId: string, callback: (orders: Order[]) => void) {
    const q = query(
      collection(db, "orders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt),
        updatedAt: convertTimestamp(doc.data().updatedAt),
      })) as Order[];
      callback(orders);
    }, (error) => {
      console.error("Error fetching user orders:", error);
      callback([]);
    });
  },

  subscribeToUserOrdersByEmailAndId(userId: string, email: string | null, callback: (orders: Order[]) => void) {
    const unsubscribers: (() => void)[] = [];
    const userIdOrders = new Map<string, Order>();
    const emailOrders = new Map<string, Order>();
    let initialLoadComplete = { byUserId: false, byEmail: !email, fallback: false };
    let useFallback = false;

    const mergeAndCallback = () => {
      if (initialLoadComplete.byUserId && initialLoadComplete.byEmail) {
        const mergedMap = new Map<string, Order>();
        userIdOrders.forEach((order, id) => mergedMap.set(id, order));
        emailOrders.forEach((order, id) => mergedMap.set(id, order));
        
        const allOrders = Array.from(mergedMap.values());
        allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        console.log("Merged orders count:", allOrders.length, "useFallback:", useFallback);
        callback(allOrders);
      }
    };

    // Try userId query without orderBy first (doesn't require composite index)
    try {
      const userIdQuery = query(
        collection(db, "orders"),
        where("userId", "==", userId)
      );
      unsubscribers.push(onSnapshot(userIdQuery, (snapshot) => {
        console.log("UserId query snapshot received:", snapshot.docs.length, "docs");
        userIdOrders.clear();
        snapshot.docs.forEach(doc => {
          userIdOrders.set(doc.id, {
            id: doc.id,
            ...doc.data(),
            createdAt: convertTimestamp(doc.data().createdAt),
            updatedAt: convertTimestamp(doc.data().updatedAt),
          } as Order);
        });
        initialLoadComplete.byUserId = true;
        mergeAndCallback();
      }, (error) => {
        console.error("Error fetching user orders by userId:", error);
        initialLoadComplete.byUserId = true;
        mergeAndCallback();
      }));
    } catch (e) {
      console.error("Exception in userId query:", e);
      initialLoadComplete.byUserId = true;
      mergeAndCallback();
    }

    // Try email query if provided
    if (email) {
      try {
        const emailQuery = query(
          collection(db, "orders"),
          where("email", "==", email)
        );
        unsubscribers.push(onSnapshot(emailQuery, (snapshot) => {
          console.log("Email query snapshot received:", snapshot.docs.length, "docs");
          emailOrders.clear();
          snapshot.docs.forEach(doc => {
            emailOrders.set(doc.id, {
              id: doc.id,
              ...doc.data(),
              createdAt: convertTimestamp(doc.data().createdAt),
              updatedAt: convertTimestamp(doc.data().updatedAt),
            } as Order);
          });
          initialLoadComplete.byEmail = true;
          mergeAndCallback();
        }, (error) => {
          console.error("Error fetching user orders by email:", error);
          initialLoadComplete.byEmail = true;
          mergeAndCallback();
        }));
      } catch (e) {
        console.error("Exception in email query:", e);
        initialLoadComplete.byEmail = true;
        mergeAndCallback();
      }
    }

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  },

  async linkExistingOrdersToUser(userId: string, email: string): Promise<number> {
    const emailOrders = await this.getByEmail(email);
    let linkedCount = 0;
    
    for (const order of emailOrders) {
      if (!order.userId || order.userId !== userId) {
        await this.update(order.id, { userId });
        linkedCount++;
      }
    }
    
    return linkedCount;
  }
};

export const cartService = {
  async getCart(userId: string): Promise<CartItem[]> {
    const docRef = await getDoc(doc(db, "carts", userId));
    if (!docRef.exists()) return [];
    return docRef.data().items || [];
  },

  async saveCart(userId: string, items: CartItem[]): Promise<void> {
    await setDoc(doc(db, "carts", userId), {
      userId,
      items,
      updatedAt: serverTimestamp(),
    });
  },

  async clearCart(userId: string): Promise<void> {
    await setDoc(doc(db, "carts", userId), {
      userId,
      items: [],
      updatedAt: serverTimestamp(),
    });
  },

  subscribeToCart(userId: string, callback: (items: CartItem[]) => void) {
    return onSnapshot(doc(db, "carts", userId), (docSnapshot) => {
      if (docSnapshot.exists()) {
        callback(docSnapshot.data().items || []);
      } else {
        callback([]);
      }
    }, (error) => {
      console.error("Error fetching cart:", error);
      callback([]);
    });
  }
};

export const reviewService = {
  async getAll(): Promise<Review[]> {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
    })) as Review[];
  },
  
  async getApproved(): Promise<Review[]> {
    const q = query(
      collection(db, "reviews"),
      where("isApproved", "==", true),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
    })) as Review[];
  },
  
  async create(review: Omit<Review, "id" | "createdAt">): Promise<string> {
    const docRef = await addDoc(collection(db, "reviews"), {
      ...review,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },
  
  async approve(id: string): Promise<void> {
    await updateDoc(doc(db, "reviews", id), { isApproved: true });
  },
  
  async setTopRated(id: string, isTopRated: boolean): Promise<void> {
    // Remove top rated from all reviews first
    const allReviews = await this.getAll();
    for (const review of allReviews) {
      if (review.isTopRated) {
        await updateDoc(doc(db, "reviews", review.id), { isTopRated: false });
      }
    }
    // Set the new top rated review
    await updateDoc(doc(db, "reviews", id), { isTopRated });
  },
  
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "reviews", id));
  },
  
  subscribe(callback: (reviews: Review[]) => void) {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const reviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt),
      })) as Review[];
      callback(reviews);
    });
  },
  
  subscribeToApproved(callback: (reviews: Review[]) => void) {
    // Subscribe to all reviews and filter approved ones client-side to avoid needing composite index
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const reviews = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: convertTimestamp(doc.data().createdAt),
        })) as Review[];
      // Filter approved reviews client-side
      const approvedReviews = reviews.filter(r => r.isApproved);
      callback(approvedReviews);
    }, (error) => {
      console.error("Error fetching approved reviews:", error);
      callback([]);
    });
  }
};

export const contactService = {
  async getAll(): Promise<ContactMessage[]> {
    const q = query(collection(db, "contact_messages"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
    })) as ContactMessage[];
  },
  
  async create(message: Omit<ContactMessage, "id" | "createdAt" | "isRead" | "isResolved">): Promise<string> {
    const docRef = await addDoc(collection(db, "contact_messages"), {
      ...message,
      isRead: false,
      isResolved: false,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },
  
  async markAsRead(id: string): Promise<void> {
    await updateDoc(doc(db, "contact_messages", id), { isRead: true });
  },
  
  async markAsResolved(id: string): Promise<void> {
    await updateDoc(doc(db, "contact_messages", id), { isResolved: true });
  },
  
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "contact_messages", id));
  },
  
  subscribe(callback: (messages: ContactMessage[]) => void) {
    const q = query(collection(db, "contact_messages"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt),
      })) as ContactMessage[];
      callback(messages);
    });
  }
};

export const staffService = {
  async getAll(): Promise<StaffMember[]> {
    const snapshot = await getDocs(collection(db, "staff"));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      email: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
    })) as StaffMember[];
  },
  
  async create(staff: { email: string; name: string; role: "Staff A" | "Staff B" }): Promise<void> {
    await updateDoc(doc(db, "staff", staff.email), {
      name: staff.name,
      role: staff.role,
      createdAt: serverTimestamp(),
    }).catch(() => {
      return addDoc(collection(db, "staff"), {
        ...staff,
        createdAt: serverTimestamp(),
      });
    });
  },
  
  async update(email: string, data: { name?: string; role?: "Staff A" | "Staff B" }): Promise<void> {
    await updateDoc(doc(db, "staff", email), data);
  },
  
  async delete(email: string): Promise<void> {
    await deleteDoc(doc(db, "staff", email));
  },
  
  subscribe(callback: (staff: StaffMember[]) => void) {
    return onSnapshot(collection(db, "staff"), (snapshot) => {
      const staff = snapshot.docs.map(doc => ({
        id: doc.id,
        email: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt),
      })) as StaffMember[];
      callback(staff);
    });
  }
};

export const settingsService = {
  async get(key: string): Promise<any> {
    const docRef = await getDoc(doc(db, "settings", key));
    if (!docRef.exists()) return null;
    return docRef.data().value;
  },
  
  async set(key: string, value: any): Promise<void> {
    await updateDoc(doc(db, "settings", key), { value }).catch(() => {
      return addDoc(collection(db, "settings"), { key, value });
    });
  }
};

export const supplementService = {
  async getAll(): Promise<Supplement[]> {
    const snapshot = await getDocs(collection(db, "supplements"));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt),
    })) as Supplement[];
  },
  
  async create(supplement: Omit<Supplement, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, "supplements"), {
      ...supplement,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },
  
  async update(id: string, data: Partial<Omit<Supplement, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    await updateDoc(doc(db, "supplements", id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },
  
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "supplements", id));
  },
  
  subscribe(callback: (supplements: Supplement[]) => void) {
    return onSnapshot(collection(db, "supplements"), (snapshot) => {
      const supplements = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt),
        updatedAt: convertTimestamp(doc.data().updatedAt),
      })) as Supplement[];
      callback(supplements);
    });
  }
};

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export { onAuthStateChanged, type User };
