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

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
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

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
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
  if (staffDoc.exists()) {
    const staffData = staffDoc.data();
    if (staffData.role === "Staff A") return "staff_a";
    if (staffData.role === "Staff B") return "staff_b";
  }
  
  return "customer";
}

export function signInWithGoogle() {
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
    await updateDoc(doc(db, "categories", id), {
      ...category,
      updatedAt: serverTimestamp(),
    });
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
    const docRef = await addDoc(collection(db, "orders"), {
      ...order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
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
      callback(orders);
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
    const ordersMap = new Map<string, Order>();
    let initialLoadComplete = { byUserId: false, byEmail: !email };

    const updateCallback = () => {
      if (initialLoadComplete.byUserId && initialLoadComplete.byEmail) {
        const allOrders = Array.from(ordersMap.values());
        allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(allOrders);
      }
    };

    const userIdQuery = query(
      collection(db, "orders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    unsubscribers.push(onSnapshot(userIdQuery, (snapshot) => {
      snapshot.docs.forEach(doc => {
        ordersMap.set(doc.id, {
          id: doc.id,
          ...doc.data(),
          createdAt: convertTimestamp(doc.data().createdAt),
          updatedAt: convertTimestamp(doc.data().updatedAt),
        } as Order);
      });
      initialLoadComplete.byUserId = true;
      updateCallback();
    }, (error) => {
      console.error("Error fetching user orders by userId:", error);
      initialLoadComplete.byUserId = true;
      updateCallback();
    }));

    if (email) {
      const emailQuery = query(
        collection(db, "orders"),
        where("email", "==", email),
        orderBy("createdAt", "desc")
      );
      unsubscribers.push(onSnapshot(emailQuery, (snapshot) => {
        snapshot.docs.forEach(doc => {
          ordersMap.set(doc.id, {
            id: doc.id,
            ...doc.data(),
            createdAt: convertTimestamp(doc.data().createdAt),
            updatedAt: convertTimestamp(doc.data().updatedAt),
          } as Order);
        });
        initialLoadComplete.byEmail = true;
        updateCallback();
      }, (error) => {
        console.error("Error fetching user orders by email:", error);
        initialLoadComplete.byEmail = true;
        updateCallback();
      }));
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

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export { onAuthStateChanged, type User };
