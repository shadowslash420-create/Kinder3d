import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import luxuryCrepe from "@assets/stock_images/luxury_crepe_with_ki_74d12ec0.jpg";
import ShoppingCart from "@/components/ui/ShoppingCart";

interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
}

const menuItems = [
  {
    id: 1,
    name: "Kinder Classic",
    description: "Golden crepe filled with Nutella, hazelnut cream, and strawberries.",
    price: "520 DA",
    category: "Signature",
    image: luxuryCrepe
  },
  {
    id: 2,
    name: "Double Chocolate",
    description: "Dark chocolate crepe with chocolate sauce and whipped cream.",
    price: "480 DA",
    category: "Signature",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    name: "Berry Sensation",
    description: "Fresh mixed berries, cream, and powdered sugar on a delicate crepe.",
    price: "550 DA",
    category: "Fruity",
    image: "https://images.unsplash.com/photo-1504113882839-58e39d385ef4?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    name: "Premium Waffle",
    description: "Belgian waffle with ice cream, chocolate drizzle, and almonds.",
    price: "650 DA",
    category: "Waffles",
    image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    name: "Caramel Dream",
    description: "Salted caramel sauce with vanilla ice cream and crushed biscuits.",
    price: "580 DA",
    category: "Signature",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 6,
    name: "Tropical Bliss",
    description: "Mango, passion fruit, and coconut cream on a light crepe.",
    price: "600 DA",
    category: "Fruity",
    image: "https://images.unsplash.com/photo-1476887334197-56adbf254e1a?auto=format&fit=crop&q=80&w=800"
  },
];

export default function Menu() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedItem, setSelectedItem] = useState<typeof menuItems[0] | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const totalItems = menuItems.length;

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalItems);
  }, [totalItems]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
  }, [totalItems]);

  useEffect(() => {
    if (isDragging || selectedItem) return;
    const interval = setInterval(handleNext, 4000);
    return () => clearInterval(interval);
  }, [handleNext, isDragging, selectedItem]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedItem) {
        if (e.key === 'Escape') setSelectedItem(null);
        return;
      }
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, selectedItem]);

  const getItemQuantity = (itemId: number) => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem?.quantity || 0;
  };

  const handleAddToCart = (item: typeof menuItems[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1, image: item.image }];
    });
  };

  const handleRemoveFromCart = (itemId: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map(i => 
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter(i => i.id !== itemId);
    });
  };

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const normalizedDiff = ((diff + totalItems) % totalItems);
    const adjustedDiff = normalizedDiff > totalItems / 2 ? normalizedDiff - totalItems : normalizedDiff;
    
    const absPosition = Math.abs(adjustedDiff);
    const isCenter = adjustedDiff === 0;
    const isLeft1 = adjustedDiff === -1;
    const isRight1 = adjustedDiff === 1;
    const isLeft2 = adjustedDiff === -2;
    const isRight2 = adjustedDiff === 2;
    
    let x = 0;
    let z = 0;
    let rotateY = 0;
    let scale = 0.5;
    let opacity = 0;
    let zIndex = 0;

    if (isCenter) {
      x = 0;
      z = 100;
      rotateY = 0;
      scale = 1;
      opacity = 1;
      zIndex = 5;
    } else if (isLeft1) {
      x = -280;
      z = 0;
      rotateY = 35;
      scale = 0.85;
      opacity = 1;
      zIndex = 4;
    } else if (isRight1) {
      x = 280;
      z = 0;
      rotateY = -35;
      scale = 0.85;
      opacity = 1;
      zIndex = 4;
    } else if (isLeft2) {
      x = -480;
      z = -100;
      rotateY = 50;
      scale = 0.65;
      opacity = 0.6;
      zIndex = 3;
    } else if (isRight2) {
      x = 480;
      z = -100;
      rotateY = -50;
      scale = 0.65;
      opacity = 0.6;
      zIndex = 3;
    } else if (absPosition <= 3) {
      x = adjustedDiff > 0 ? 600 : -600;
      z = -200;
      rotateY = adjustedDiff > 0 ? -60 : 60;
      scale = 0.5;
      opacity = 0.3;
      zIndex = 2;
    }

    return { x, z, rotateY, scale, opacity, zIndex };
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section id="menu" className="py-32 bg-[#FDFBF7] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-4 block">Our Selection</span>
          <h2 className="text-5xl md:text-6xl font-serif font-medium text-foreground">Curated Indulgence</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Click on any item to add to your bag
          </p>
          
          {totalCartItems > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full"
            >
              <span className="font-medium">{totalCartItems} item{totalCartItems > 1 ? 's' : ''} in your bag</span>
            </motion.div>
          )}
        </motion.div>

        <div 
          className="relative h-[600px] flex items-center justify-center"
          style={{ perspective: "1200px" }}
        >
          <div 
            className="relative w-full h-full flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            <AnimatePresence mode="popLayout">
              {menuItems.map((menuItem, index) => {
                const style = getCardStyle(index);
                const isCenter = style.zIndex === 5;
                
                return (
                  <motion.div
                    key={menuItem.id}
                    className="absolute cursor-pointer"
                    style={{
                      width: "320px",
                      transformStyle: "preserve-3d",
                      zIndex: style.zIndex,
                    }}
                    initial={false}
                    animate={{
                      x: style.x,
                      z: style.z,
                      rotateY: style.rotateY,
                      scale: style.scale,
                      opacity: style.opacity,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 20,
                      mass: 1,
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.1}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={(_, info) => {
                      setIsDragging(false);
                      if (info.offset.x > 50) {
                        handlePrev();
                      } else if (info.offset.x < -50) {
                        handleNext();
                      }
                    }}
                    onClick={() => {
                      const diff = index - activeIndex;
                      const normalizedDiff = ((diff + totalItems) % totalItems);
                      const adjustedDiff = normalizedDiff > totalItems / 2 ? normalizedDiff - totalItems : normalizedDiff;
                      if (adjustedDiff === 0) {
                        setSelectedItem(menuItem);
                      } else {
                        setActiveIndex(index);
                      }
                    }}
                    whileHover={isCenter ? { scale: 1.02 } : {}}
                  >
                    <div className="bg-white rounded-2xl overflow-hidden shadow-2xl relative">
                      {getItemQuantity(menuItem.id) > 0 && (
                        <div className="absolute top-3 right-3 z-20 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {getItemQuantity(menuItem.id)}
                        </div>
                      )}
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <img 
                          src={menuItem.image} 
                          alt={menuItem.name}
                          className="w-full h-full object-cover"
                          draggable="false"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <span className="text-xs uppercase tracking-wider opacity-80 mb-1 block">
                            {menuItem.category}
                          </span>
                          <h3 className="font-serif text-2xl font-bold mb-1">{menuItem.name}</h3>
                          <p className="text-lg font-medium text-primary">{menuItem.price}</p>
                        </div>
                      </div>
                      <div className="p-5 bg-white">
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {menuItem.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all duration-300 group"
          >
            <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all duration-300 group"
          >
            <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <div className="flex justify-center gap-3 mt-8">
          {menuItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'bg-primary w-8' 
                  : 'bg-foreground/20 hover:bg-foreground/40'
              }`}
            />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <button className="text-foreground border-b border-primary pb-1 hover:text-primary transition-colors font-serif italic text-lg">
            View Full Menu
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <span className="text-xs uppercase tracking-wider opacity-80 mb-2 block">
                    {selectedItem.category}
                  </span>
                  <h3 className="font-serif text-3xl font-bold">{selectedItem.name}</h3>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {selectedItem.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-serif font-bold text-primary">
                    {selectedItem.price}
                  </span>
                  
                  <ShoppingCart
                    count={getItemQuantity(selectedItem.id)}
                    onAdd={() => handleAddToCart(selectedItem)}
                    onRemove={() => handleRemoveFromCart(selectedItem.id)}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
