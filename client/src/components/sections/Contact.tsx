import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section id="contact" className="py-16 sm:py-24 md:py-32 bg-foreground text-[#FDFBF7] relative overflow-hidden">
      {/* Background Texture/Noise could go here */}
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 md:gap-16 lg:gap-20">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-between h-full"
          >
            <div>
              <span className="text-primary font-bold tracking-[0.15em] sm:tracking-[0.2em] text-xs uppercase mb-4 sm:mb-6 block">Visit Us</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-medium mb-6 sm:mb-8 md:mb-12 leading-none">
                Find Us in <br/> <span className="text-white/50 italic">Batna</span>
              </h2>
              
              <div className="space-y-6 sm:space-y-8 md:space-y-12">
                 <div>
                   <label className="text-xs font-bold uppercase tracking-widest text-primary mb-2 sm:mb-3 block">Location</label>
                   <p className="text-lg sm:text-xl md:text-2xl font-serif leading-relaxed">Allée Ben Boulaïd<br/>Batna, Algeria</p>
                 </div>
                 <div>
                   <label className="text-xs font-bold uppercase tracking-widest text-primary mb-2 sm:mb-3 block">Contact</label>
                   <p className="text-base sm:text-lg md:text-xl font-light text-white/80">+213 (0) 792 15 97 18</p>
                 </div>
                 <div>
                   <label className="text-xs font-bold uppercase tracking-widest text-primary mb-2 sm:mb-3 block">Hours</label>
                   <p className="text-sm sm:text-base md:text-lg font-light text-white/70">Tue-Thu, Sat: 12 PM - 12 AM<br/>Friday: 3 PM - 12 AM<br/>Sunday: Open 24 Hours</p>
                 </div>
              </div>
            </div>

            <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-0">
               <p className="text-white/40 text-xs sm:text-sm">© 2024 Kinder Délice. Crafted with passion.</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm p-6 sm:p-8 md:p-10 lg:p-12 rounded-sm border border-white/10"
          >
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 group">
                   <label className="text-xs uppercase tracking-widest text-white/60 group-focus-within:text-primary transition-colors">Name</label>
                   <Input placeholder="John Doe" className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-primary text-white placeholder:text-white/20 h-auto text-lg transition-all" />
                </div>
                <div className="space-y-2 group">
                   <label className="text-xs uppercase tracking-widest text-white/60 group-focus-within:text-primary transition-colors">Phone</label>
                   <Input placeholder="+1 234 567 890" className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-primary text-white placeholder:text-white/20 h-auto text-lg transition-all" />
                </div>
              </div>
              <div className="space-y-2 group">
                 <label className="text-xs uppercase tracking-widest text-white/60 group-focus-within:text-primary transition-colors">Email</label>
                 <Input type="email" placeholder="john@example.com" className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-primary text-white placeholder:text-white/20 h-auto text-lg transition-all" />
              </div>
              <div className="space-y-2 group">
                 <label className="text-xs uppercase tracking-widest text-white/60 group-focus-within:text-primary transition-colors">Message</label>
                 <Textarea placeholder="Any special requests?" className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-primary text-white placeholder:text-white/20 min-h-[100px] text-lg resize-none transition-all" />
              </div>
              
              <Button className="w-full bg-primary text-white hover:bg-primary/90 mt-8 rounded-full h-14 text-lg tracking-wide shadow-lg shadow-primary/20">
                Send Request
              </Button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
