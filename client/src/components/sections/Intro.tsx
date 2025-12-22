import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { animate, stagger, Timeline } from "animejs";

interface IntroProps {
  onEnter: () => void;
}

export default function Intro({ onEnter }: IntroProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [animationsReady, setAnimationsReady] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  const handleEnter = () => {
    setIsExiting(true);
    if (titleRef.current) {
      animate(titleRef.current.querySelectorAll('.letter'), {
        translateY: [{ from: 0, to: 100 }],
        opacity: [{ from: 1, to: 0 }],
        rotateX: [{ from: 0, to: -90 }],
        ease: 'inExpo',
        duration: 600,
        delay: stagger(30, { reversed: true })
      });
    }
    setTimeout(() => {
      onEnter();
    }, 800);
  };

  useEffect(() => {
    const tl = new Timeline({ autoplay: true });

    if (titleRef.current) {
      const titleElement = titleRef.current;
      const creperieSpan = titleElement.querySelector('.creperie-text');
      const kinderSpan = titleElement.querySelector('.kinder-text');

      if (creperieSpan) {
        const creperieText = creperieSpan.textContent || '';
        creperieSpan.innerHTML = creperieText.split('').map((char) => 
          `<span class="letter" style="display:inline-block;opacity:0;transform:translateY(80px)">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');
      }

      if (kinderSpan) {
        const kinderText = kinderSpan.textContent || '';
        kinderSpan.innerHTML = kinderText.split('').map((char) => 
          `<span class="letter" style="display:inline-block;opacity:0;transform:translateY(80px)">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');
      }

      if (creperieSpan) {
        const creperieLetters = creperieSpan.querySelectorAll('.letter');
        tl.add(creperieLetters, {
          translateY: [{ from: 80, to: 0 }],
          opacity: [{ from: 0, to: 1 }],
          rotateX: [{ from: 90, to: 0 }],
          ease: 'outExpo',
          duration: 1200,
          delay: stagger(60, { start: 300 })
        });
      }

      if (kinderSpan) {
        const kinderLetters = kinderSpan.querySelectorAll('.letter');
        tl.add(kinderLetters, {
          translateY: [{ from: 80, to: 0 }],
          opacity: [{ from: 0, to: 1 }],
          rotateX: [{ from: 90, to: 0 }],
          scale: [{ from: 0.5, to: 1 }],
          ease: 'outExpo',
          duration: 1000,
          delay: stagger(80)
        }, '-=600');
      }
    }

    if (subtitleRef.current) {
      tl.add(subtitleRef.current, {
        translateY: [{ from: 30, to: 0 }],
        opacity: [{ from: 0, to: 1 }],
        ease: 'outExpo',
        duration: 800
      }, '-=400');
    }

    tl.then(() => {
      setAnimationsReady(true);
    });

    const button = buttonRef.current;
    const background = backgroundRef.current;
    if (!button || !background) return;

    const handleMouseEnter = () => {
      animate(background, {
        height: "120%",
        top: "50%",
        width: "120%",
        duration: 300,
        ease: 'outQuad'
      });
    };

    const handleMouseLeave = () => {
      animate(background, {
        height: "4px",
        top: "100%",
        width: "100%",
        duration: 300,
        ease: 'outQuad'
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
      className="fixed inset-0 z-50 bg-[#1a1a1a] overflow-hidden"
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
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isExiting ? { opacity: 0, y: 60 } : { opacity: 1, y: 0 }}
        transition={isExiting ? { duration: 0.7, ease: "easeIn" } : { duration: 0.8, delay: 0.4 }}
        className="absolute bottom-0 left-0 right-0 text-center px-4 sm:px-6 py-8 sm:py-10 md:py-12 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/80 to-transparent space-y-4 sm:space-y-6 z-20"
      >
        <div>
          <h1 
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold mb-2 sm:mb-4 text-foreground leading-tight overflow-hidden"
            style={{ perspective: '1000px' }}
          >
            <span className="creperie-text block">Creperie</span>
            <span className="kinder-text text-primary block">Kinder 5</span>
          </h1>
          <p 
            ref={subtitleRef}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground font-light max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto px-2"
            style={{ opacity: 0 }}
          >
            Welcome to Batna's finest crepes, waffles, and desserts. Crafted with passion, served with joy.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={isExiting ? { opacity: 0, y: 30, scale: 0.8 } : animationsReady ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center"
        >
          <button
            ref={buttonRef}
            onClick={handleEnter}
            disabled={isExiting}
            className="relative text-lg sm:text-xl md:text-2xl font-semibold cursor-pointer bg-transparent border-none outline-none text-white hover:text-primary px-8 sm:px-10 md:px-14 py-3 sm:py-4 flex items-center gap-2 sm:gap-3 disabled:opacity-80 disabled:cursor-not-allowed transition-colors duration-300"
          >
            <span className="relative z-10 flex items-center gap-2 sm:gap-3">
              Enter
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
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
        className="absolute top-6 right-6 sm:top-10 sm:right-10 w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-40 rounded-full border border-primary/20 z-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-32 sm:bottom-40 left-4 sm:left-10 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full bg-primary/5 z-10"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </motion.div>
  );
}
