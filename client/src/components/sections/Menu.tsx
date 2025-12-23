import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import ShoppingCart from "@/components/ui/ShoppingCart";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import FloatingLines from "@/components/ui/FloatingLines";
import { menuService, categoryService, type MenuItem, type Category } from "@/lib/firebase";

export default function Menu() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, removeFromCart, getItemQuantity, totalItems } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

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

  const filteredItems = useMemo(() => {
    if (!selectedCategory) return menuItems;
    return menuItems.filter(item => item.categoryId === selectedCategory);
  }, [menuItems, selectedCategory]);

  const totalItemsCount = filteredItems.length;

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalItemsCount);
  }, [totalItemsCount]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalItemsCount) % totalItemsCount);
  }, [totalItemsCount]);

  useEffect(() => {
    if (isDragging || selectedItem) return;
    // Disable auto-rotation on mobile to reduce CPU usage
    if (isMobile) return;
    const interval = setInterval(handleNext, 4000);
    return () => clearInterval(interval);
  }, [handleNext, isDragging, selectedItem, isMobile]);

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

  const handleAddToCart = (item: MenuItem) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart",
        variant: "destructive"
      });
      // Optionally redirect to login, but toast is sufficient
      return;
    }
    addToCart({
      id: item.id,
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl
    });
  };

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return "Uncategorized";
    const cat = categories.find(c => c.id === categoryId);
    return cat?.name || "Uncategorized";
  };

  useEffect(() => {
    if (selectedCategory !== null) {
      setActiveIndex(0);
    }
  }, [selectedCategory]);

  const handleRemoveFromCart = (itemId: string) => {
    removeFromCart(itemId);
  };

  const getCardStyle = (index: number, isMobile: boolean = false) => {
    const diff = index - activeIndex;
    const normalizedDiff = ((diff + totalItemsCount) % totalItemsCount);
    const adjustedDiff = normalizedDiff > totalItemsCount / 2 ? normalizedDiff - totalItemsCount : normalizedDiff;
    
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

    const xMultiplier = isMobile ? 0.55 : 1;
    
    // Simplify 3D transforms on mobile for better performance
    if (isMobile) {
      if (isCenter) {
        x = 0;
        z = 0;
        rotateY = 0;
        scale = 1;
        opacity = 1;
        zIndex = 5;
      } else if (isLeft1 || isRight1) {
        x = isLeft1 ? -200 : 200;
        z = 0;
        rotateY = 0;
        scale = 0.8;
        opacity = 0;
        zIndex = 2;
      } else {
        x = adjustedDiff > 0 ? 400 : -400;
        z = 0;
        rotateY = 0;
        scale = 0.5;
        opacity = 0;
        zIndex = 1;
      }
      return { x, z, rotateY, scale, opacity, zIndex };
    }

    if (isCenter) {
      x = 0;
      z = 100;
      rotateY = 0;
      scale = 1;
      opacity = 1;
      zIndex = 5;
    } else if (isLeft1) {
      x = -280 * xMultiplier;
      z = 0;
      rotateY = isMobile ? 25 : 35;
      scale = isMobile ? 0.7 : 0.85;
      opacity = isMobile ? 0.7 : 1;
      zIndex = 4;
    } else if (isRight1) {
      x = 280 * xMultiplier;
      z = 0;
      rotateY = isMobile ? -25 : -35;
      scale = isMobile ? 0.7 : 0.85;
      opacity = isMobile ? 0.7 : 1;
      zIndex = 4;
    } else if (isLeft2) {
      x = -480 * xMultiplier;
      z = -100;
      rotateY = isMobile ? 35 : 50;
      scale = isMobile ? 0.5 : 0.65;
      opacity = isMobile ? 0.3 : 0.6;
      zIndex = 3;
    } else if (isRight2) {
      x = 480 * xMultiplier;
      z = -100;
      rotateY = isMobile ? -35 : -50;
      scale = isMobile ? 0.5 : 0.65;
      opacity = isMobile ? 0.3 : 0.6;
      zIndex = 3;
    } else if (absPosition <= 3) {
      x = (adjustedDiff > 0 ? 600 : -600) * xMultiplier;
      z = -200;
      rotateY = adjustedDiff > 0 ? -60 : 60;
      scale = 0.5;
      opacity = isMobile ? 0 : 0.3;
      zIndex = 2;
    }

    return { x, z, rotateY, scale, opacity, zIndex };
  };


  const floatingLinesBackground = useMemo(() => 
    isMobile ? null : (
    <div className="absolute inset-0 z-0">
      <FloatingLines 
        linesGradient={['#8B4513', '#A0522D', '#CD853F', '#D2691E', '#B8860B']}
        enabledWaves={['top', 'middle', 'bottom']}
        lineCount={[12, 16, 20]}
        lineDistance={[6, 5, 4]}
        bendRadius={5.0}
        bendStrength={-0.5}
        interactive={true}
        parallax={true}
        animationSpeed={0.8}
        mixBlendMode="normal"
      />
    </div>
  ), [isMobile]);

  return (
    <section id="menu" className="py-16 sm:py-24 md:py-32 relative overflow-hidden bg-gradient-to-b from-[#0f0202] via-[#1a0505] to-[#2b0a0a]">
      {floatingLinesBackground}
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 md:mb-16 bg-[#1a0505]/80 backdrop-blur-md p-8 sm:p-10 rounded-2xl border border-primary/30 shadow-[var(--neon-glow)] max-w-4xl mx-auto"
        >
          <span className="tracking-[0.2em] uppercase mb-2 sm:mb-4 block text-primary text-[38px] font-black">Our Selection</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-white">Curated Indulgence</h2>
          <p className="mt-2 sm:mt-4 max-w-xl mx-auto text-sm sm:text-base px-4 text-white/70">
            Click on any item to add to your bag
          </p>
          
          {totalItems > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 sm:mt-4 inline-flex items-center gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm"
            >
              <span className="font-medium">{totalItems} item{totalItems > 1 ? 's' : ''} in your bag</span>
            </motion.div>
          )}
        </motion.div>

        {categories.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 relative overflow-hidden"
          >
            <div className="flex gap-3 sm:gap-4 pb-4 overflow-x-auto scrollbar-hide scroll-smooth px-4 sm:px-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(null)}
                className={`px-6 sm:px-8 py-3 rounded-lg text-sm sm:text-base font-semibold whitespace-nowrap transition-all duration-300 flex-shrink-0 backdrop-blur-sm ${
                  selectedCategory === null 
                    ? 'bg-gradient-to-br from-[#eb2d2d] to-[#c41a1a] text-white shadow-lg shadow-[#eb2d2d]/30' 
                    : 'bg-slate-800/40 text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                All
              </motion.button>
              {categories.map((category, idx) => (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * idx }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 sm:px-8 py-3 rounded-lg text-sm sm:text-base font-semibold whitespace-nowrap transition-all duration-300 flex-shrink-0 backdrop-blur-sm ${
                    selectedCategory === category.id 
                      ? 'bg-gradient-to-br from-[#eb2d2d] to-[#c41a1a] text-white shadow-lg shadow-[#eb2d2d]/30' 
                      : 'bg-slate-800/40 text-slate-200 hover:bg-slate-700/50'
                  }`}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="h-[450px] sm:h-[500px] md:h-[600px] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="h-[450px] sm:h-[500px] md:h-[600px] flex items-center justify-center">
            <p className="text-white text-lg">No items available in this category</p>
          </div>
        ) : (
        <>
        <div 
          className="relative z-20 h-[450px] sm:h-[500px] md:h-[600px] flex items-center justify-center"
          style={{ perspective: "1200px" }}
        >
          <div 
            className="relative w-full h-full flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((menuItem, index) => {
                const style = getCardStyle(index, isMobile);
                const isCenter = style.zIndex === 5;
                
                return (
                  <motion.div
                    key={menuItem.id}
                    className="absolute cursor-pointer w-[240px] sm:w-[280px] md:w-[320px]"
                    style={{
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
                      const normalizedDiff = ((diff + totalItemsCount) % totalItemsCount);
                      const adjustedDiff = normalizedDiff > totalItemsCount / 2 ? normalizedDiff - totalItemsCount : normalizedDiff;
                      if (adjustedDiff === 0) {
                        setSelectedItem(menuItem);
                      } else {
                        setActiveIndex(index);
                      }
                    }}
                    whileHover={isCenter ? { scale: 1.08, y: -8 } : {}}
                  >
                    <div className="bg-[#1a0505] rounded-2xl overflow-hidden shadow-2xl relative transition-all duration-500 hover:shadow-[var(--neon-glow)] border border-primary/30">
                      {getItemQuantity(menuItem.id) > 0 && (
                        <div className="absolute top-3 right-3 z-20 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {getItemQuantity(menuItem.id)}
                        </div>
                      )}
                      <div className="relative aspect-[4/5] overflow-hidden">
                        {menuItem.imageUrl ? (
                          <img 
                            src={menuItem.imageUrl} 
                            alt={menuItem.name}
                            className="w-full h-full object-cover"
                            draggable="false"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                            No Image
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <span className="uppercase tracking-wider opacity-80 mb-1 block font-medium text-[13px] text-gold">
                            {getCategoryName(menuItem.categoryId)}
                          </span>
                          <h3 className="font-serif text-2xl font-bold mb-1">{menuItem.name}</h3>
                          <p className="text-lg font-medium text-gold">{menuItem.price} DA</p>
                        </div>
                      </div>
                      <div className="p-5 bg-[#1a0505]">
                        <p className="text-sm leading-relaxed text-white/70">
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
            className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/90 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all duration-300 group"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/90 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all duration-300 group"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <div className="flex justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
          {filteredItems.map((_, index) => (
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
        </>
        )}

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
              className="bg-[#1a0505] rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full border border-primary/40 shadow-[var(--neon-glow)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {selectedItem.imageUrl ? (
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <span className="text-xs uppercase tracking-wider text-gold mb-2 block">
                    {getCategoryName(selectedItem.categoryId)}
                  </span>
                  <h3 className="font-serif text-3xl font-bold">{selectedItem.name}</h3>
                </div>
              </div>
              
              <div className="p-6 bg-[#1a0505]">
                <p className="text-white/70 leading-relaxed mb-6">
                  {selectedItem.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-serif font-bold text-gold">
                    {selectedItem.price} DA
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
