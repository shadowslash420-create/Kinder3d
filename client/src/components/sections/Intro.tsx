import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { animate } from "animejs";

interface IntroProps {
  onEnter: () => void;
}

export default function Intro({ onEnter }: IntroProps) {
  const [isExiting, setIsExiting] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 600);
  };

  useEffect(() => {
    const button = buttonRef.current;
    const background = backgroundRef.current;
    if (!button || !background) return;

    const handleMouseEnter = () => {
      animate(background, {
        height: "120%",
        top: "50%",
        width: "120%",
        duration: 300,
        ease: "outQuad"
      });
    };

    const handleMouseLeave = () => {
      animate(background, {
        height: "4px",
        top: "100%",
        width: "100%",
        duration: 300,
        ease: "outQuad"
      });
    };

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1, scale: 1 }}
      animate={isExiting ? { opacity: 0, scale: 1.1 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 bg-[#FDFBF7] overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ background: "radial-gradient(circle at 20% 50%, rgba(230, 57, 70, 0.1) 0%, transparent 50%)" }}
        animate={{ background: "radial-gradient(circle at 80% 50%, rgba(230, 57, 70, 0.15) 0%, transparent 50%)" }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={isExiting ? { opacity: 0, scale: 1.2, y: -100 } : { opacity: 1, scale: 1, y: [0, -15, 0] }}
        transition={isExiting ? { duration: 0.9, ease: "easeIn" } : { duration: 1, delay: 0.2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <img
          src="/kinder-hero.jpg"
          alt="Kinder Mascot"
          className="w-full h-full object-cover drop-shadow-2xl"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isExiting ? { opacity: 0, y: 60 } : { opacity: 1, y: 0 }}
        transition={isExiting ? { duration: 0.7, ease: "easeIn" } : { duration: 0.8, delay: 0.4 }}
        className="absolute bottom-0 left-0 right-0 text-center px-6 py-12 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/80 to-transparent space-y-6 z-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isExiting ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
          transition={isExiting ? { duration: 0.6, ease: "easeIn" } : { duration: 0.8, delay: 0.4 }}
        >
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold mb-4 text-foreground leading-tight">
            Creperie
            <br />
            <span className="text-primary">Kinder 5</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Welcome to Batna's finest crepes, waffles, and desserts. Crafted with passion, served with joy.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={isExiting ? { opacity: 0, y: 30, scale: 0.8 } : { opacity: 1, y: 0, scale: 1 }}
          transition={isExiting ? { duration: 0.6, ease: "easeIn" } : { duration: 0.8, delay: 0.6 }}
          className="flex justify-center"
        >
          <button
            ref={buttonRef}
            onClick={handleEnter}
            disabled={isExiting}
            className="relative text-2xl font-semibold cursor-pointer bg-transparent border-none outline-none text-foreground hover:text-white px-14 py-4 flex items-center gap-3 disabled:opacity-80 disabled:cursor-not-allowed transition-colors duration-300"
          >
            <span className="relative z-10 flex items-center gap-3">
              Enter
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ArrowRight className="w-7 h-7" />
              </motion.div>
            </span>
            <div
              ref={backgroundRef}
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg -z-10"
              style={{
                top: "100%",
                height: "4px",
                width: "100%",
                backgroundColor: "#DC2626"
              }}
            />
          </button>
        </motion.div>
      </motion.div>

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
