import { motion } from "framer-motion";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import crepeImage from "@assets/generated_images/gourmet_crepe_with_kinder_chocolate.png";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const imageRef = useRef(null);

  const stats = [
    { value: "100%", label: "Authentic Taste" },
    { value: "24h", label: "Fresh Batter" },
    { value: "50+", label: "Unique Flavors" },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 ease-out">
              <img 
                src={crepeImage} 
                alt="Chef making crepes" 
                className="w-full h-auto object-cover aspect-[4/5]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            
            {/* Decorative background element */}
            <div className="absolute top-10 -left-10 w-full h-full border-2 border-primary/20 rounded-2xl -z-0 -rotate-3" />
          </motion.div>

          {/* Content Side */}
          <div>
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-primary font-serif italic text-xl mb-4 block"
            >
              Since 2024
            </motion.span>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6"
            >
              Crafting Sweet <br/> Memories
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg leading-relaxed mb-8"
            >
              We believe that dessert is not just food—it’s an emotion. Inspired by the nostalgia of Kinder chocolate, we’ve reinvented the classic French crêpe into a luxurious, melt-in-your-mouth experience.
              <br/><br/>
              Every crepe is made to order using our secret batter recipe, resting for 24 hours to ensure the perfect texture—crispy edges with a soft, pillowy center.
            </motion.p>

            <div className="grid grid-cols-3 gap-6 border-t border-border pt-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (index * 0.1) }}
                >
                  <h4 className="text-3xl font-serif font-bold text-primary mb-1">{stat.value}</h4>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
