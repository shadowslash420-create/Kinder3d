import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section id="contact" className="py-16 sm:py-24 md:py-32 text-[#FDFBF7] relative overflow-hidden bg-gradient-to-b from-[#1a0505]/90 via-[#0f0202]/85 to-[#000000]/95">
      {/* Background Texture/Noise could go here */}
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 md:gap-16 lg:gap-20">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-between h-full will-change-opacity"
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
                   <a 
                     href="tel:+213792159718" 
                     className="flex items-center gap-3 text-base sm:text-lg md:text-xl font-light text-white/80 hover:text-white transition-colors group"
                   >
                     <span className="lg:hidden flex items-center justify-center w-10 h-10 bg-primary/20 rounded-full group-hover:bg-primary/30 transition-colors">
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                         <path d="M21.97 18.33C21.97 18.69 21.89 19.06 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20.01 21.37 19.4 21.62C18.8 21.87 18.15 22 17.45 22C16.43 22 15.34 21.76 14.19 21.27C13.04 20.78 11.89 20.12 10.75 19.29C9.6 18.45 8.51 17.52 7.47 16.49C6.44 15.45 5.51 14.36 4.68 13.22C3.86 12.08 3.2 10.94 2.72 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.51 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.4 9.53C8.29 9.64 8.24 9.77 8.24 9.93C8.24 10.01 8.25 10.08 8.27 10.16C8.3 10.24 8.33 10.3 8.35 10.36C8.53 10.69 8.84 11.12 9.28 11.64C9.73 12.16 10.21 12.69 10.73 13.22C11.27 13.75 11.79 14.24 12.32 14.69C12.84 15.13 13.27 15.43 13.61 15.61C13.66 15.63 13.72 15.66 13.79 15.69C13.87 15.72 13.95 15.73 14.04 15.73C14.21 15.73 14.34 15.67 14.45 15.56L15.21 14.81C15.46 14.56 15.7 14.37 15.93 14.25C16.16 14.11 16.39 14.04 16.64 14.04C16.83 14.04 17.03 14.08 17.25 14.17C17.47 14.26 17.7 14.39 17.95 14.56L21.26 16.91C21.52 17.09 21.7 17.3 21.81 17.55C21.91 17.8 21.97 18.05 21.97 18.33Z" stroke="#fff" strokeWidth="1.5" strokeMiterlimit="10" />
                       </svg>
                     </span>
                     <span>+213 (0) 792 15 97 18</span>
                   </a>
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
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-[#1a0505]/80 backdrop-blur-sm p-6 sm:p-8 md:p-10 lg:p-12 rounded-sm border border-primary/30 shadow-[var(--neon-glow)] will-change-opacity"
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
