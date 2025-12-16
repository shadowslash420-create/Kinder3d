import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface IntroProps {
  onEnter: () => void;
}

export default function Intro({ onEnter }: IntroProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#FDFBF7] overflow-hidden"
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0"
        initial={{ background: "radial-gradient(circle at 20% 50%, rgba(230, 57, 70, 0.1) 0%, transparent 50%)" }}
        animate={{ background: "radial-gradient(circle at 80% 50%, rgba(230, 57, 70, 0.15) 0%, transparent 50%)" }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-6">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-col items-center gap-12"
        >
          {/* Image */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-64 h-64 md:w-80 md:h-80"
          >
            <img
              src="/kinder-hero.jpg"
              alt="Kinder Mascot"
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center max-w-md"
          >
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 text-foreground">
              Creperie
              <br />
              <span className="text-primary">Kinder 5</span>
            </h1>
            <p className="text-lg text-muted-foreground font-light">
              Welcome to Batna's finest crepes, waffles, and desserts. Crafted with passion, served with joy.
            </p>
          </motion.div>

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex gap-4"
          >
            <Button
              onClick={onEnter}
              size="lg"
              className="rounded-full px-10 py-7 text-lg bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 transition-all duration-500 flex items-center gap-3"
            >
              Enter
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </Button>
          </motion.div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          className="absolute top-10 right-10 w-32 h-32 rounded-full border border-primary/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-24 h-24 rounded-full bg-primary/5"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
}
