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
      className="fixed inset-0 z-50 bg-[#FDFBF7] overflow-hidden"
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0"
        initial={{ background: "radial-gradient(circle at 20% 50%, rgba(230, 57, 70, 0.1) 0%, transparent 50%)" }}
        animate={{ background: "radial-gradient(circle at 80% 50%, rgba(230, 57, 70, 0.15) 0%, transparent 50%)" }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* Full-Screen Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <img
          src="/kinder-hero.jpg"
          alt="Kinder Mascot"
          className="w-full h-full object-cover drop-shadow-2xl"
        />
      </motion.div>

      {/* Bottom Content - Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute bottom-0 left-0 right-0 text-center px-6 py-12 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/80 to-transparent space-y-6 z-20"
      >
        <div>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold mb-4 text-foreground leading-tight">
            Creperie
            <br />
            <span className="text-primary">Kinder 5</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Welcome to Batna's finest crepes, waffles, and desserts. Crafted with passion, served with joy.
          </p>
        </div>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button
            onClick={onEnter}
            size="lg"
            className="rounded-full px-14 py-8 text-xl bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 transition-all duration-500 flex items-center gap-3"
          >
            Enter
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <ArrowRight className="w-6 h-6" />
            </motion.div>
          </Button>
        </motion.div>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-10 right-10 w-40 h-40 rounded-full border border-primary/20 z-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-40 left-10 w-32 h-32 rounded-full bg-primary/5 z-10"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </motion.div>
  );
}
