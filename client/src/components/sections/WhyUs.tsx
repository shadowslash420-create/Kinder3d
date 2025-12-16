import { motion } from "framer-motion";
import { Star, ShieldCheck, Heart, ChefHat } from "lucide-react";

const features = [
  {
    icon: <Star className="w-6 h-6" />,
    title: "Premium Ingredients",
    description: "We source only the finest chocolate and freshest fruits."
  },
  {
    icon: <ChefHat className="w-6 h-6" />,
    title: "Master Chefs",
    description: "Our pastry chefs are trained in the art of French creperie."
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Made with Love",
    description: "Every order is crafted with care and attention to detail."
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Quality Guarantee",
    description: "We promise satisfaction in every bite."
  }
];

export default function WhyUs() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-serif font-bold mb-6">Why We Are Different</h2>
            <p className="text-muted-foreground mb-12 max-w-md">
              It’s not just a crepe; it’s an experience. We combine traditional techniques with modern indulgence.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {features.map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col items-start"
                >
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="relative h-[500px] bg-secondary/5 rounded-3xl overflow-hidden p-8 flex items-center justify-center">
             {/* Abstract Layout */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
             
             <div className="relative z-10 text-center">
                <span className="text-9xl font-serif font-bold text-primary/10 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">KINDER</span>
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white">
                   <h3 className="font-serif font-bold text-2xl mb-2 text-foreground">Top Rated</h3>
                   <div className="flex text-yellow-400 justify-center mb-2">
                      <Star fill="currentColor" />
                      <Star fill="currentColor" />
                      <Star fill="currentColor" />
                      <Star fill="currentColor" />
                      <Star fill="currentColor" />
                   </div>
                   <p className="text-muted-foreground italic">"Best dessert I've ever had!"</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
