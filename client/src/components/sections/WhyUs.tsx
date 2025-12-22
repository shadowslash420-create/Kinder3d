import { motion } from "framer-motion";
import { Star, ShieldCheck, Heart, ChefHat } from "lucide-react";

const features = [
  {
    icon: <Star className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Premium Ingredients",
    description: "We source only the finest chocolate and freshest fruits."
  },
  {
    icon: <ChefHat className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Master Chefs",
    description: "Our pastry chefs are trained in the art of French creperie."
  },
  {
    icon: <Heart className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Made with Love",
    description: "Every order is crafted with care and attention to detail."
  },
  {
    icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Quality Guarantee",
    description: "We promise satisfaction in every bite."
  }
];

export default function WhyUs() {
  return (
    <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden bg-gradient-to-b from-[#0f0202]/90 via-[#1a0505]/85 to-[#0f0202]/90">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-4 sm:mb-6 text-foreground">Why We Are Different</h2>
            <p className="mb-8 sm:mb-10 md:mb-12 max-w-md text-sm sm:text-base text-foreground/80">
              It's not just a crepe; it's an experience. We combine traditional techniques with modern indulgence.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {features.map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col items-start"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-primary">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-foreground/70">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="relative h-[350px] sm:h-[400px] md:h-[500px] bg-secondary/5 rounded-2xl sm:rounded-3xl overflow-hidden p-4 sm:p-6 md:p-8 flex items-center justify-center border border-primary/30 shadow-[var(--neon-glow)]">
             <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-primary/5 rounded-full blur-3xl" />
             <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-secondary/10 rounded-full blur-3xl" />
             
             <div className="relative z-10 text-center">
                <span className="text-5xl sm:text-7xl md:text-9xl font-serif font-bold select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/10">KINDER</span>
                <div className="bg-[#1a0505]/90 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-xl border border-primary/40 shadow-[var(--neon-glow)]">
                   <h3 className="font-serif font-bold text-lg sm:text-xl md:text-2xl mb-2 text-white">Top Rated</h3>
                   <div className="flex text-yellow-400 justify-center mb-2 gap-0.5">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />
                      <Star className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />
                      <Star className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />
                      <Star className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />
                      <Star className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />
                   </div>
                   <p className="text-muted-foreground italic text-sm sm:text-base">"Best dessert I've ever had!"</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
