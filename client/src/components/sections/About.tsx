import { motion } from "framer-motion";
import diningImage from "@assets/51216_150042_Maps_1765939512903.jpg";
import PrismaticBurst from "@/components/ui/PrismaticBurst";

export default function About() {
  const stats = [
    { value: "100%", label: "Authentic" },
    { value: "24h", label: "Batter Rest" },
    { value: "50+", label: "Variations" },
  ];

  return (
    <section id="about" className="py-16 sm:py-24 md:py-32 relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 z-0" style={{ width: '100%', height: '100%' }}>
        <PrismaticBurst
          animationType="rotate3d"
          intensity={2}
          speed={0.5}
          distort={1.0}
          paused={false}
          offset={{ x: 0, y: 0 }}
          hoverDampness={0.25}
          rayCount={24}
          mixBlendMode="lighten"
          colors={['#ff007a', '#4d3dff', '#ffffff']}
        />
      </div>
      
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
               className="bg-white/90 backdrop-blur-sm p-5 sm:p-6 md:p-8 rounded-lg shadow-xl"
            >
              <h2 className="text-xs sm:text-sm font-bold tracking-[0.2em] sm:tracking-[0.3em] text-primary uppercase mb-4 sm:mb-6">Our Story</h2>
              
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-foreground mb-4 sm:mb-6 md:mb-8 leading-tight">
                Bringing European <br/>
                <span className="italic text-secondary">Flavors Home</span>
              </h3>
              
              <div className="space-y-4 sm:space-y-6 text-muted-foreground text-sm sm:text-base md:text-lg font-light leading-relaxed">
                <p>
                  At Creperie Kinder 5, we blend authentic French technique with the warmth of Algerian hospitality. Each crepe is made fresh to order, crafted with premium ingredients and genuine care.
                </p>
                <p>
                  From our kitchen to your table—whether you crave a classic Nutella crepe or our signature chocolate-filled specialties, every bite tells a story of passion and tradition.
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8 md:mt-12 bg-white/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-lg shadow-xl">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + (index * 0.1), duration: 0.8 }}
                  className="text-center sm:text-left"
                >
                  <h4 className="text-xl sm:text-2xl md:text-3xl font-serif text-foreground mb-1 sm:mb-2">{stat.value}</h4>
                  <p className="text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
