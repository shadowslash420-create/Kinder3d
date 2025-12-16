import { motion } from "framer-motion";
import chefImage from "@assets/stock_images/chef_pouring_chocola_d3a3e47e.jpg";

export default function About() {
  const stats = [
    { value: "100%", label: "Authentic" },
    { value: "24h", label: "Batter Rest" },
    { value: "50+", label: "Variations" },
  ];

  return (
    <section id="about" className="py-32 relative overflow-hidden bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
          
          {/* Image Side - Wider column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "circOut" }}
            className="col-span-1 md:col-span-6 relative group"
          >
            <div className="relative z-10 rounded-sm overflow-hidden aspect-[3/4]">
              <img 
                src={chefImage} 
                alt="Chef making crepes" 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
            </div>
            
            {/* Minimalist Decoration */}
            <div className="absolute -bottom-6 -right-6 w-full h-full border border-primary/10 -z-10" />
          </motion.div>

          {/* Content Side */}
          <div className="col-span-1 md:col-span-5 md:col-start-8">
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
            >
              <h2 className="text-sm font-bold tracking-[0.3em] text-primary uppercase mb-6">The Craft</h2>
              
              <h3 className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-8 leading-tight">
                An Ode to <br/>
                <span className="italic text-secondary">Sweet Nostalgia</span>
              </h3>
              
              <div className="space-y-6 text-muted-foreground text-lg font-light leading-relaxed">
                <p>
                  We don't just make crepes; we architect memories. Inspired by the creamy, hazelnut-infused joy of Kinder chocolate, our kitchen is a laboratory of indulgence.
                </p>
                <p>
                  Every crepe begins with our signature batter, rested for exactly 24 hours to achieve that elusive balance: crisp lace edges and a pillowy, melt-in-your-mouth center.
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-3 gap-8 mt-12 border-t border-border/40 pt-10">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + (index * 0.1), duration: 0.8 }}
                >
                  <h4 className="text-3xl font-serif text-foreground mb-2">{stat.value}</h4>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
