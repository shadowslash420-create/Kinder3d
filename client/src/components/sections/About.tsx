import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import diningImage from "@assets/uiughuyguygyti7_210241_Maps_1766002062020.jpg";
import GridMotion from "@/components/ui/GridMotion";

export default function About() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const stats = [
    { value: "100%", label: "Authentic" },
    { value: "24h", label: "Batter Rest" },
    { value: "50+", label: "Variations" },
  ];

  const colors = {
    maroon: '#2b0a0a',
    gold: '#c69b7b',
    burgundy: '#641010'
  };

  const gridItems = [
    <div key='block-1' className="w-full h-full" style={{ backgroundColor: colors.maroon }} />,
    <div key='block-2' className="w-full h-full" style={{ backgroundColor: colors.gold }} />,
    <div key='block-3' className="w-full h-full" style={{ backgroundColor: colors.burgundy }} />,
    <div key='block-4' className="w-full h-full" style={{ backgroundColor: colors.maroon }} />,
    <div key='block-5' className="w-full h-full" style={{ backgroundColor: colors.gold }} />,
    <div key='block-6' className="w-full h-full" style={{ backgroundColor: colors.burgundy }} />,
    <div key='block-7' className="w-full h-full" style={{ backgroundColor: colors.maroon }} />,
    <div key='block-8' className="w-full h-full" style={{ backgroundColor: colors.gold }} />,
    <div key='block-9' className="w-full h-full" style={{ backgroundColor: colors.burgundy }} />,
  ];

  return (
    <section id="about" className="py-16 sm:py-24 md:py-32 relative overflow-hidden min-h-screen bg-gradient-to-b from-[#0f0202] via-[#1a0505] to-[#2b0a0a]">
      {!isMobile && (
      <div className="absolute inset-0 z-0 opacity-30">
        <GridMotion items={gridItems} gradientColor="transparent" />
      </div>
      )}
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "circOut" }}
            className="col-span-1 md:col-span-6 relative group"
          >
            <div className="relative z-10 rounded-sm overflow-hidden aspect-[3/4] shadow-2xl">
              <img 
                src={diningImage} 
                alt="Luxury dining interior" 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
            </div>
            
            <div className="absolute -bottom-6 -right-6 w-full h-full border border-primary/10 -z-10" />
          </motion.div>

          <div className="col-span-1 md:col-span-5 md:col-start-8">
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="bg-[#1a0505]/80 backdrop-blur-md p-5 sm:p-6 md:p-8 rounded-lg shadow-xl border border-primary/30 shadow-[var(--neon-glow)]"
            >
              <h2 className="text-xs sm:text-sm font-bold tracking-[0.2em] sm:tracking-[0.3em] text-gold uppercase mb-4 sm:mb-6">Our Story</h2>
              
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-white mb-4 sm:mb-6 md:mb-8 leading-tight">
                Bringing European <br/>
                <span className="italic text-gold">Flavors Home</span>
              </h3>
              
              <div className="space-y-4 sm:space-y-6 text-white/70 text-sm sm:text-base md:text-lg font-light leading-relaxed">
                <p>
                  At Creperie Kinder 5, we blend authentic French technique with the warmth of Algerian hospitality. Each crepe is made fresh to order, crafted with premium ingredients and genuine care.
                </p>
                <p>
                  From our kitchen to your table—whether you crave a classic Nutella crepe or our signature chocolate-filled specialties, every bite tells a story of passion and tradition.
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8 md:mt-12 bg-[#1a0505]/80 backdrop-blur-md p-4 sm:p-5 md:p-6 rounded-lg shadow-xl border border-primary/30 shadow-[var(--neon-glow)]">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + (index * 0.1), duration: 0.8 }}
                  className="text-center sm:text-left"
                >
                  <h4 className="text-xl sm:text-2xl md:text-3xl font-serif text-white mb-1 sm:mb-2">{stat.value}</h4>
                  <p className="text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-white/50">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
