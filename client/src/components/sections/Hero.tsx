import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import * as THREE from "three";
import heroBg from "@assets/generated_images/luxury_chocolate_swirl_background.png";

function FloatingChocolate() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.cos(t / 4) / 8;
      meshRef.current.rotation.y = Math.sin(t / 4) / 8;
      meshRef.current.position.y = (1 + Math.sin(t / 1.5)) / 10;
    }
  });

  return (
    <group rotation={[0, 0, 0.1]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef} scale={1.5}>
          <boxGeometry args={[3, 1, 0.4]} />
          <meshStandardMaterial 
            color="#5D4037" 
            roughness={0.1} 
            metalness={0.1} 
          />
        </mesh>
        {/* White creamy layer inside */}
        <mesh position={[0, 0.05, 0]} scale={1.48}>
          <boxGeometry args={[3.01, 0.4, 0.38]} />
          <meshStandardMaterial 
            color="#FDFBF7" 
            roughness={0.4}
          />
        </mesh>
        {/* Top waves to look like chocolate bar */}
        <mesh position={[-0.7, 0.5, 0]} scale={0.8}>
           <cylinderGeometry args={[0.4, 0.5, 0.1, 32]} />
           <meshStandardMaterial color="#5D4037" roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.5, 0]} scale={0.8}>
           <cylinderGeometry args={[0.4, 0.5, 0.1, 32]} />
           <meshStandardMaterial color="#5D4037" roughness={0.1} />
        </mesh>
        <mesh position={[0.7, 0.5, 0]} scale={0.8}>
           <cylinderGeometry args={[0.4, 0.5, 0.1, 32]} />
           <meshStandardMaterial color="#5D4037" roughness={0.1} />
        </mesh>
      </Float>
    </group>
  );
}

export default function Hero() {
  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="Chocolate Swirl Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-xl"
        >
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20"
          >
            Premium Dessert Experience
          </motion.span>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6 text-foreground">
            The Art of <br/>
            <span className="text-primary relative inline-block">
              Indulgence
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Discover the perfect harmony of authentic French crêpes and the nostalgic creaminess of Kinder chocolate. A luxury treat for your senses.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="rounded-full px-8 text-base bg-primary hover:bg-primary/90 h-12 shadow-lg hover:shadow-primary/30 transition-all duration-300">
              View Menu
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8 text-base h-12 border-primary/20 text-foreground hover:bg-secondary/10 group">
              Our Story <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>

        {/* 3D Element */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="h-[500px] w-full hidden lg:block relative"
        >
           <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
             <ambientLight intensity={0.8} />
             <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
             <pointLight position={[-10, -10, -10]} intensity={0.5} />
             <Environment preset="city" />
             <FloatingChocolate />
             <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
           </Canvas>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/60"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-current to-transparent" />
      </motion.div>
    </section>
  );
}
