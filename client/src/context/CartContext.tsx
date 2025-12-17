import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { cartService, type CartItem as FirebaseCartItem } from "@/lib/firebase";

interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  getItemQuantity: (itemId: string) => number;
  totalItems: number;
  totalPrice: number;
  clearCart: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setCart([]);
      return;
    }

    setIsLoading(true);
    const unsubscribe = cartService.subscribeToCart(user.uid, (items) => {
      setCart(items as CartItem[]);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const saveCartToFirebase = useCallback(async (newCart: CartItem[]) => {
    if (user) {
      try {
        await cartService.saveCart(user.uid, newCart as FirebaseCartItem[]);
      } catch (error) {
        console.error("Error saving cart:", error);
      }
    }
  }, [user]);

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    if (!user) return;
    
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      let newCart: CartItem[];
      
      if (existing) {
        newCart = prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newCart = [...prev, { ...item, quantity: 1 }];
      }
      
      saveCartToFirebase(newCart);
      return newCart;
    });
  }, [user, saveCartToFirebase]);

  const removeFromCart = useCallback((itemId: string) => {
    if (!user) return;
    
    setCart(prev => {
      const existing = prev.find(i => i.id === itemId);
      let newCart: CartItem[];
      
      if (existing && existing.quantity > 1) {
        newCart = prev.map(i => 
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      } else {
        newCart = prev.filter(i => i.id !== itemId);
      }
      
      saveCartToFirebase(newCart);
      return newCart;
    });
  }, [user, saveCartToFirebase]);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (!user) return;
    
    setCart(prev => {
      let newCart: CartItem[];
      
      if (quantity <= 0) {
        newCart = prev.filter(i => i.id !== itemId);
      } else {
        newCart = prev.map(i => 
          i.id === itemId ? { ...i, quantity } : i
        );
      }
      
      saveCartToFirebase(newCart);
      return newCart;
    });
  }, [user, saveCartToFirebase]);

  const getItemQuantity = useCallback((itemId: string) => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem?.quantity || 0;
  }, [cart]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const clearCart = useCallback(async () => {
    setCart([]);
    if (user) {
      await cartService.clearCart(user.uid);
    }
  }, [user]);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      getItemQuantity, 
      totalItems, 
      totalPrice,
      clearCart,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
