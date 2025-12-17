import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ShoppingCartProps {
  count: number;
  onAdd: () => void;
  onRemove: () => void;
}

export default function ShoppingCart({ count, onAdd, onRemove }: ShoppingCartProps) {
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
        setIsBouncing(true);
        setTimeout(() => setIsBouncing(false), 300);
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
          animate={isBouncing ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#4A3728">
            <g clipPath="url(#clip0_shopping_cart)">
              <path opacity="0.4" d="M16.1899 8.86039C15.7999 8.86039 15.4899 8.55039 15.4899 8.16039V6.88039C15.4899 5.90039 15.0699 4.96039 14.3499 4.30039C13.6099 3.63039 12.6599 3.32039 11.6599 3.41039C9.97986 3.57039 8.50986 5.28039 8.50986 7.06039V7.96039C8.50986 8.35039 8.19986 8.66039 7.80986 8.66039C7.41986 8.66039 7.10986 8.35039 7.10986 7.96039V7.06039C7.10986 4.56039 9.12986 2.25039 11.5199 2.02039C12.9099 1.89039 14.2499 2.33039 15.2799 3.27039C16.2999 4.19039 16.8799 5.51039 16.8799 6.88039V8.16039C16.8799 8.55039 16.5699 8.86039 16.1899 8.86039Z" fill="#4A3728"/>
              <path d="M19.9602 8.96008C19.1202 8.03008 17.7402 7.58008 15.7202 7.58008H8.28023C6.26023 7.58008 4.88023 8.03008 4.04023 8.96008C3.07023 10.0401 3.10023 11.4801 3.21023 12.4801L3.91023 18.0501C4.12023 20.0001 4.91023 22.0001 9.21023 22.0001H14.7902C19.0902 22.0001 19.8802 20.0001 20.0902 18.0601L20.7902 12.4701C20.9002 11.4801 20.9202 10.0401 19.9602 8.96008ZM8.42023 13.1501H8.41023C7.86023 13.1501 7.41023 12.7001 7.41023 12.1501C7.41023 11.6001 7.86023 11.1501 8.41023 11.1501C8.97023 11.1501 9.42023 11.6001 9.42023 12.1501C9.42023 12.7001 8.97023 13.1501 8.42023 13.1501ZM15.4202 13.1501H15.4102C14.8602 13.1501 14.4102 12.7001 14.4102 12.1501C14.4102 11.6001 14.8602 11.1501 15.4102 11.1501C15.9702 11.1501 16.4202 11.6001 16.4202 12.1501C16.4202 12.7001 15.9702 13.1501 15.4202 13.1501Z" fill="#4A3728"/>
            </g>
            <defs>
              <clipPath id="clip0_shopping_cart">
                <rect width="24" height="24" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </motion.div>

        <AnimatePresence>
          {count > 0 && (
            <motion.div
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center overflow-hidden"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <motion.span
                  className="text-[10px] font-semibold text-white absolute"
                  animate={{
                    y: countDirection === 'up' ? -16 : countDirection === 'down' ? 16 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {displayCount}
                </motion.span>
                {countDirection && (
                  <motion.span
                    className="text-[10px] font-semibold text-white absolute"
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
