import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { menuService, categoryService, type MenuItem, type Category } from "@/lib/firebase";
import { ShoppingCart, Plus, Minus, ArrowLeft, User, LogOut, Package } from "lucide-react";

export default function MenuPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const { cart, addToCart, removeFromCart, getItemQuantity, totalItems } = useCart();
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubMenu = menuService.subscribe((items) => {
      setMenuItems(items.filter(item => item.isAvailable));
      setLoading(false);
    });
    
    const unsubCat = categoryService.subscribe((cats) => {
      setCategories(cats.filter(cat => cat.isActive));
    });

    return () => {
      unsubMenu();
      unsubCat();
    };
  }, []);

  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.categoryId === selectedCategory)
    : menuItems;

  const handleAddToCart = (item: MenuItem) => {
    if (!user) {
      toast({ 
        title: "Sign in required", 
        description: "Please sign in to add items to your cart",
        variant: "destructive"
      });
      setLocation("/customer-login");
      return;
    }

    addToCart({
      id: item.id,
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
    });
    
    toast({ 
      title: "Added to cart", 
      description: `${item.name} has been added to your cart` 
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    removeFromCart(itemId);
  };

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return "Uncategorized";
    const cat = categories.find(c => c.id === categoryId);
    return cat?.name || "Uncategorized";
  };

  const handleLogout = async () => {
    await logout();
    toast({ title: "Signed out", description: "You have been signed out successfully" });
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFBF7] to-[#F5EFE6]">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setLocation("/")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold text-slate-900">Our Menu</h1>
            </div>
            
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLocation("/my-orders")}
                    className="hidden sm:flex"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    My Orders
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="hidden sm:flex"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setLocation("/cart")}
                    className="relative bg-red-600 hover:bg-red-700"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Cart
                    {totalItems > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-slate-900 text-white text-xs px-1.5">
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setLocation("/customer-login")}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className={selectedCategory === null ? "bg-red-600 hover:bg-red-700" : ""}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id ? "bg-red-600 hover:bg-red-700 whitespace-nowrap" : "whitespace-nowrap"}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">No menu items available in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => {
                const quantity = getItemQuantity(item.id);
                
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                  >
                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 h-full cursor-pointer">
                      <div className="aspect-square relative overflow-hidden bg-slate-100">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            No Image
                          </div>
                        )}
                        <Badge className="absolute top-2 left-2 bg-white/90 text-slate-700">
                          {getCategoryName(item.categoryId)}
                        </Badge>
                        {item.isFeatured && (
                          <Badge className="absolute top-2 right-2 bg-red-600 text-white">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg text-slate-900 mb-1">{item.name}</h3>
                        {item.description && (
                          <p className="text-sm text-slate-600 mb-3 line-clamp-2">{item.description}</p>
                        )}
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-lg font-bold text-red-600">{item.price} DA</span>
                          
                          {quantity > 0 ? (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleRemoveFromCart(item.id)}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center font-medium">{quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleAddToCart(item)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleAddToCart(item)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {user && totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg sm:hidden">
          <Button
            className="w-full bg-red-600 hover:bg-red-700"
            onClick={() => setLocation("/cart")}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            View Cart ({totalItems} items)
          </Button>
        </div>
      )}
    </div>
  );
}
