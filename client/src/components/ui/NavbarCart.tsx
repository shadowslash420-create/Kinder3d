import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

export default function NavbarCart() {
  const { totalItems } = useCart();

  return (
    <div className="relative cursor-pointer" style={{ zoom: 1.2 }}>
      <motion.div
        className="relative"
        style={{ perspective: "64px", transformOrigin: "50% 100%" }}
        animate={totalItems > 0 ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="relative w-6 h-6 bg-white border-2 border-[#242836] rounded-sm"
          style={{ transformStyle: "preserve-3d", transformOrigin: "50% 100%" }}
          animate={{
            rotateX: totalItems > 0 ? -10 : 20,
            scaleY: totalItems > 0 ? 0.85 : 1,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="absolute bottom-0.5 left-1 right-1 h-0.5 bg-[#3F4656] rounded-full" />
          
          <svg
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-6 h-6"
            viewBox="0 0 32 32"
            fill="none"
          >
            <motion.path
              d="M10 16 C10 10, 22 10, 22 16"
              stroke="#242836"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              animate={{
                d: totalItems > 0 
                  ? "M10 16 C10 13, 22 13, 22 16" 
                  : "M10 16 C10 10, 22 10, 22 16"
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </svg>
        </motion.div>

        <motion.div
          className="absolute top-0 left-1/2 w-6 h-4 bg-[#242836]"
          style={{ 
            transformStyle: "preserve-3d", 
            transformOrigin: "50% 100%",
            clipPath: "polygon(4px 0, 20px 0, 17px 6px, 24px 16px, 0 16px, 7px 6px)"
          }}
          animate={{
            x: "-50%",
            y: "-100%",
            rotateX: totalItems > 0 ? -50 : -120,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div 
            className="absolute inset-0 bg-[#EEF4FF] scale-75"
            style={{ clipPath: "polygon(4px 0, 20px 0, 17px 6px, 24px 16px, 0 16px, 7px 6px)" }}
          />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center overflow-hidden shadow-lg"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <motion.span
              key={totalItems}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-[10px] font-bold text-white"
            >
              {totalItems > 99 ? '99+' : totalItems}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
