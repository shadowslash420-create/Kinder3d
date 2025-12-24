import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { supplementService } from "@/lib/firebase";

interface Supplement {
  id: string;
  name: string;
  price: number;
  description?: string;
  isAvailable: boolean;
}

export default function CartPage() {
  const [, setLocation] = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { cart, addToCart, removeFromCart, updateQuantity, updateSupplements, totalItems, totalPrice, clearCart, isLoading: cartLoading } = useCart();
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [supplementsDialogOpen, setSupplementsDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedSupplements, setSelectedSupplements] = useState<{ id: string; name: string; price: number }[]>([]);

  const handleBrowseMenu = () => {
    setLocation("/");
    setTimeout(() => {
      const menuSection = document.getElementById('menu');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  useEffect(() => {
    // Fetch supplements from Firebase in real-time
    const unsubscribe = supplementService.subscribe((data) => {
      setSupplements(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/customer-login");
    }
  }, [user, authLoading, setLocation]);

  const openSupplementsDialog = (itemId: string) => {
    const item = cart.find(i => i.id === itemId);
    setSelectedItemId(itemId);
    setSelectedSupplements(item?.supplements || []);
    setSupplementsDialogOpen(true);
  };

  const handleSupplementToggle = (supplement: Supplement) => {
    setSelectedSupplements(prev => {
      const exists = prev.find(s => s.id === supplement.id);
      if (exists) {
        return prev.filter(s => s.id !== supplement.id);
      } else {
        return [...prev, { id: supplement.id, name: supplement.name, price: supplement.price }];
      }
    });
  };

  const handleSaveSupplements = () => {
    if (selectedItemId) {
      updateSupplements(selectedItemId, selectedSupplements);
      setSupplementsDialogOpen(false);
    }
  };

  if (authLoading || cartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDFBF7] to-[#F5EFE6] flex items-center justify-center">
        <div className="w-12 h-12 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleIncrement = (item: typeof cart[0]) => {
    addToCart({
      id: item.id,
      menuItemId: item.menuItemId,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
    });
  };

  const handleDecrement = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleRemoveItem = (itemId: string) => {
    updateQuantity(itemId, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFBF7] to-[#F5EFE6]">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setLocation("/")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-slate-900">Your Cart</h1>
            {totalItems > 0 && (
              <span className="text-sm text-slate-500">({totalItems} items)</span>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {cart.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingBag className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Your cart is empty</h2>
              <p className="text-slate-600 mb-6">Add some delicious items from our menu!</p>
              <Button 
                onClick={handleBrowseMenu}
                className="bg-red-600 hover:bg-red-700"
              >
                Browse Menu
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                                No Image
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 truncate">{item.name}</h3>
                            <p className="text-red-600 font-medium">{item.price} DA</p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleDecrement(item.id)}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleIncrement(item)}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => openSupplementsDialog(item.id)}
                                >
                                  Supplements
                                  {item.supplements && item.supplements.length > 0 && (
                                    <span className="ml-1 text-red-600">({item.supplements.length})</span>
                                  )}
                                </Button>
                              </div>
                            </div>

                            {item.supplements && item.supplements.length > 0 && (
                              <div className="mt-2 text-xs text-slate-700">
                                <p className="font-bold">Supplements:</p>
                                <ul className="list-disc list-inside">
                                  {item.supplements.map(s => (
                                    <li key={s.id} className="font-medium">{s.name} (+{s.price} DA)</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-3">
                              <span className="font-semibold text-slate-900">
                                {(() => {
                                  const itemPrice = item.price * item.quantity;
                                  const supplementsPrice = item.supplements?.reduce((sum, s) => sum + (s.price * item.quantity), 0) || 0;
                                  return `${itemPrice + supplementsPrice} DA`;
                                })()}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <Card className="sticky bottom-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{totalPrice} DA</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-red-600">{totalPrice} DA</span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={() => setLocation("/checkout")}
                >
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </div>

      <Dialog open={supplementsDialogOpen} onOpenChange={setSupplementsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Supplements</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {supplements.filter(s => s.isAvailable).length === 0 ? (
              <p className="text-sm text-slate-500">No supplements available</p>
            ) : (
              supplements
                .filter(s => s.isAvailable)
                .map((supplement) => (
                  <div key={supplement.id} className="flex items-center gap-3 p-2 border rounded-lg hover:bg-slate-50">
                    <Checkbox
                      id={supplement.id}
                      checked={selectedSupplements.some(s => s.id === supplement.id)}
                      onCheckedChange={() => handleSupplementToggle(supplement)}
                    />
                    <Label htmlFor={supplement.id} className="flex-1 cursor-pointer">
                      <div className="font-medium text-slate-900">{supplement.name}</div>
                      {supplement.description && (
                        <div className="text-xs text-slate-600">{supplement.description}</div>
                      )}
                    </Label>
                    <span className="text-sm font-semibold text-red-600">+{supplement.price} DA</span>
                  </div>
                ))
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSupplementsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSupplements} className="bg-red-600 hover:bg-red-700">
              Save Supplements
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
