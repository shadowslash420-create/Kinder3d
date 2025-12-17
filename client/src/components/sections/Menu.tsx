import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import luxuryCrepe from "@assets/stock_images/luxury_crepe_with_ki_74d12ec0.jpg";
import ShoppingCart from "@/components/ui/ShoppingCart";
import { useCart } from "@/context/CartContext";
import FloatingLines from "@/components/ui/FloatingLines";

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
  const { addToCart, removeFromCart, getItemQuantity, totalItems } = useCart();
  const totalItemsCount = menuItems.length;

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalItemsCount);
  }, [totalItemsCount]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalItemsCount) % totalItemsCount);
  }, [totalItemsCount]);

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

  const handleAddToCart = (item: typeof menuItems[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    });
  };

  const handleRemoveFromCart = (itemId: number) => {
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

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section id="menu" className="py-16 sm:py-24 md:py-32 bg-[#FDFBF7] relative overflow-hidden">
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
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <span className="tracking-[0.2em] uppercase mb-2 sm:mb-4 block text-[#eb2d2d] text-[38px] font-black">Our Selection</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-[#241008]">Curated Indulgence</h2>
          <p className="mt-2 sm:mt-4 max-w-xl mx-auto text-sm sm:text-base px-4 text-[#ffffff]">
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

        <div 
          className="relative h-[450px] sm:h-[500px] md:h-[600px] flex items-center justify-center"
          style={{ perspective: "1200px" }}
        >
          <div 
            className="relative w-full h-full flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            <AnimatePresence mode="popLayout">
              {menuItems.map((menuItem, index) => {
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
