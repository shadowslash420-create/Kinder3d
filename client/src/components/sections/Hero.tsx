import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows, Sparkles } from "@react-three/drei";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import * as THREE from "three";
import heroBg from "@assets/generated_images/luxury_chocolate_swirl_background.png";

// Magnetic Button Component
const MagneticButton = ({ children, className, ...props }: any) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;
  return (
    <motion.div
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      <Button
        ref={ref}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        className={className}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
};

function FloatingChocolate() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Slower, more elegant rotation
      meshRef.current.rotation.x = Math.cos(t / 8) / 10;
      meshRef.current.rotation.y = t / 10; 
      meshRef.current.position.y = (1 + Math.sin(t / 2)) / 15;
    }
  });

  return (
    <group rotation={[0, 0, 0.1]}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
        <group scale={1.8}>
           {/* Chocolate Bar Base */}
          <mesh ref={meshRef}>
            <boxGeometry args={[3, 1, 0.4]} />
            <meshStandardMaterial 
              color="#3E2723" 
              roughness={0.2} 
              metalness={0.1} 
              envMapIntensity={1.5}
            />
          </mesh>
          {/* White creamy layer inside - subtle reveal at ends */}
          <mesh position={[1.51, 0, 0]} scale={[0.01, 0.9, 0.8]}>
            <boxGeometry args={[1, 1, 0.4]} />
            <meshStandardMaterial color="#FDFBF7" roughness={0.4} />
          </mesh>
           {/* Gold flakes/Sparkles around */}
           <Sparkles count={20} scale={4} size={4} speed={0.4} opacity={0.5} color="#FFD700" />
        </group>
      </Float>
    </group>
  );
}

const letterContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.5,
    },
  },
};

const letterAnimation: any = {
  hidden: { y: 100, opacity: 0 },
  show: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    }
  },
};

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden flex items-center">
      {/* Background Image */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <img 
          src="/kinder-luxury.jpg" 
          alt="Luxury Dining Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
        {/* Text Content */}
        <div className="max-w-xl pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="h-[1px] w-12 bg-primary"></div>
            <span className="text-primary font-medium tracking-[0.2em] text-sm uppercase">
              Batna, Algeria
            </span>
          </motion.div>
          
          <motion.h1 
            variants={letterContainer}
            initial="hidden"
            animate="show"
            className="text-6xl md:text-8xl font-serif font-bold leading-[0.9] mb-8 text-foreground tracking-tighter"
          >
            <span className="text-primary">Creperie</span>
            <br />
            {"Kinder 5".split("").map((char, i) => (
              <motion.span key={i} variants={letterAnimation} className="inline-block">
                {char}
              </motion.span>
            ))}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-md font-light"
          >
            Finest crepes, waffles, and desserts in Batna. From our kitchen to your table, crafted with passion and precision.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="flex flex-wrap gap-6"
          >
            <MagneticButton className="rounded-full px-10 py-7 text-lg bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 transition-all duration-500">
              Explore Menu
            </MagneticButton>
            <Button variant="ghost" size="lg" className="rounded-full px-8 text-lg h-14 text-foreground hover:bg-transparent hover:text-primary transition-colors group">
              Watch Film <div className="ml-3 w-10 h-10 rounded-full border border-current flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all"><ArrowRight className="w-4 h-4" /></div>
            </Button>
          </motion.div>
        </div>

      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-10 flex items-center gap-4 text-muted-foreground/40 mix-blend-multiply"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-medium rotate-180" style={{ writingMode: 'vertical-rl' }}>Scroll to Explore</span>
        <div className="h-24 w-[1px] bg-current" />
      </motion.div>
    </section>
  );
}
