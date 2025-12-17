import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ShoppingCartProps {
  count: number;
  onAdd: () => void;
  onRemove: () => void;
}

export default function ShoppingCart({ count, onAdd, onRemove }: ShoppingCartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [displayCount, setDisplayCount] = useState(count);
  const [countDirection, setCountDirection] = useState<'up' | 'down' | null>(null);
  const prevCount = useRef(count);

  useEffect(() => {
    if (count !== prevCount.current) {
      const direction = count > prevCount.current ? 'up' : 'down';
      setCountDirection(direction);
      
      setTimeout(() => {
        setDisplayCount(count);
        setCountDirection(null);
      }, 300);
      
      if (count > 0) {
        setIsOpen(true);
        setIsBouncing(true);
        setTimeout(() => setIsBouncing(false), 300);
      } else {
        setIsOpen(false);
      }
      
      prevCount.current = count;
    }
  }, [count]);

  const handleAdd = () => {
    if (count < 99) {
      onAdd();
    }
  };

  const handleRemove = () => {
    if (count > 0) {
      onRemove();
    }
  };

  return (
    <div className="flex items-center gap-6">
      <button
        onClick={handleRemove}
        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-colors active:scale-95"
        disabled={count === 0}
      >
        <span className="w-4 h-0.5 bg-current rounded-full" />
      </button>

      <div className="relative" style={{ zoom: 1.5 }}>
        <motion.div
          className="relative"
          style={{ perspective: "64px", transformOrigin: "50% 100%" }}
          animate={isBouncing ? { scaleY: [1, 0.9, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="relative w-8 h-8 bg-white border-2 border-[#242836] rounded-sm z-30"
            style={{ transformStyle: "preserve-3d", transformOrigin: "50% 100%" }}
            animate={{
              rotateX: isOpen ? -20 : 24,
              scaleY: isOpen ? 0.65 : 1,
              z: 1,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="absolute bottom-1 left-1.5 right-1.5 h-0.5 bg-[#3F4656] rounded-full" />
            
            <svg
              className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8"
              viewBox="0 0 32 32"
              fill="none"
            >
              <motion.path
                d="M8 16 C8 8, 24 8, 24 16"
                stroke="#242836"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                animate={{
                  d: isOpen 
                    ? "M8 16 C8 12, 24 12, 24 16" 
                    : "M8 16 C8 8, 24 8, 24 16"
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </svg>
          </motion.div>

          <motion.div
            className="absolute top-0 left-0 w-8 h-2.5 bg-white border-2 border-[#242836] rounded-sm"
            style={{ transformStyle: "preserve-3d", transformOrigin: "50% 100%" }}
            animate={{
              rotateX: 0,
              y: 4,
              scaleX: 0.73,
              scaleY: 0.8,
              z: isOpen ? 8 : -20,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          <motion.div
            className="absolute top-0 left-1/2 w-8 h-5 bg-[#242836] z-10"
            style={{ 
              transformStyle: "preserve-3d", 
              transformOrigin: "50% 100%",
              clipPath: "polygon(6px 0, 26px 0, 22px 8px, 32px 22px, 0 22px, 10px 8px)"
            }}
            animate={{
              x: "-50%",
              y: "-105%",
              rotateX: isOpen ? -64 : -130,
            }}
            transition={{ duration: 0.5, ease: "easeOut", delay: isOpen ? 0 : 0.01 }}
          >
            <div 
              className="absolute inset-0 bg-[#EEF4FF] scale-75"
              style={{ clipPath: "polygon(6px 0, 26px 0, 22px 8px, 32px 22px, 0 22px, 10px 8px)" }}
            />
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {count > 0 && (
            <motion.div
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center overflow-hidden"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <motion.span
                  className="text-[8px] font-semibold text-white absolute"
                  animate={{
                    y: countDirection === 'up' ? -16 : countDirection === 'down' ? 16 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {displayCount}
                </motion.span>
                {countDirection && (
                  <motion.span
                    className="text-[8px] font-semibold text-white absolute"
                    initial={{ y: countDirection === 'up' ? 16 : -16 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {count}
                  </motion.span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={handleAdd}
        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-colors active:scale-95"
      >
        <span className="relative w-4 h-4">
          <span className="absolute top-1/2 left-0 w-4 h-0.5 bg-current rounded-full -translate-y-1/2" />
          <span className="absolute top-0 left-1/2 w-0.5 h-4 bg-current rounded-full -translate-x-1/2" />
        </span>
      </button>
    </div>
  );
}
