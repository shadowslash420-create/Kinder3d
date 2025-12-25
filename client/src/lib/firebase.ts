import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  type User 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  Timestamp 
} from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

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
export const messaging = getMessaging(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export function signInWithGoogle() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    return signInWithRedirect(auth, googleProvider);
  }
  return signInWithPopup(auth, googleProvider);
}

export async function handleRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    return result;
  } catch (error) {
    console.error("Error getting redirect result:", error);
    return null;
  }
}

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
  if (staffDoc.exists()) {
    const staffData = staffDoc.data();
    if (staffData.role === "Staff A") return "staff_a";
    if (staffData.role === "Staff B") return "staff_b";
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
    const cleanedItem: Record<string, any> = { updatedAt: serverTimestamp() };
    for (const [key, value] of Object.entries(item)) {
      if (value !== undefined) {
        cleanedItem[key] = value;
      }
    }
    await updateDoc(doc(db, "menu", id), cleanedItem);
  },
  
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "menu", id));
  },
  
  subscribe(callback: (items: MenuItem[]) => void) {
    return onSnapshot(collection(db, "menu"), (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt),
        updatedAt: convertTimestamp(doc.data().updatedAt),
      })) as MenuItem[];
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
    const cleanedCategory: Record<string, any> = { updatedAt: serverTimestamp() };
    for (const [key, value] of Object.entries(category)) {
      if (value !== undefined && key !== "id" && key !== "createdAt" && key !== "updatedAt") {
        cleanedCategory[key] = value;
      }
    }
    await updateDoc(doc(db, "categories", id), cleanedCategory);
  },
  
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "categories", id));
  },
  
  subscribe(callback: (categories: Category[]) => void) {
    return onSnapshot(collection(db, "categories"), (snapshot) => {
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
    let initialLoadComplete = { byUserId: false, byEmail: !email };

    const mergeAndCallback = () => {
      if (initialLoadComplete.byUserId && initialLoadComplete.byEmail) {
        const mergedMap = new Map<string, Order>();
        userIdOrders.forEach((order, id) => mergedMap.set(id, order));
        emailOrders.forEach((order, id) => mergedMap.set(id, order));
        
        const allOrders = Array.from(mergedMap.values());
        allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(allOrders);
      }
    };

    try {
      const userIdQuery = query(collection(db, "orders"), where("userId", "==", userId));
      unsubscribers.push(onSnapshot(userIdQuery, (snapshot) => {
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
      }));
    } catch (e) {
      initialLoadComplete.byUserId = true;
      mergeAndCallback();
    }

    if (email) {
      try {
        const emailQuery = query(collection(db, "orders"), where("email", "==", email));
        unsubscribers.push(onSnapshot(emailQuery, (snapshot) => {
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
        }));
      } catch (e) {
        initialLoadComplete.byEmail = true;
        mergeAndCallback();
      }
    }

    return () => unsubscribers.forEach(unsub => unsub());
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
    const allReviews = await this.getAll();
    for (const review of allReviews) {
      if (review.isTopRated) {
        await updateDoc(doc(db, "reviews", review.id), { isTopRated: false });
      }
    }
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
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const reviews = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: convertTimestamp(doc.data().createdAt),
        })) as Review[];
      const approvedReviews = reviews.filter(r => r.isApproved);
      callback(approvedReviews);
    }, (error) => {
      console.error("Error fetching approved reviews:", error);
      callback([]);
    });
  }
};

export { onAuthStateChanged, type User };
