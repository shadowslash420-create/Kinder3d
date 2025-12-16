import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import luxuryCrepe from "@assets/stock_images/luxury_crepe_with_ki_74d12ec0.jpg";

// Mock data - Authentic Menu
const menuItems = [
  {
    id: 1,
    name: "Kinder Classic",
    description: "Golden crepe filled with Nutella, hazelnut cream, and strawberries.",
    price: "520 DA",
    category: "Signature",
    image: luxuryCrepe
  },
  {
    id: 2,
    name: "Double Chocolate",
    description: "Dark chocolate crepe with chocolate sauce and whipped cream.",
    price: "480 DA",
    category: "Signature",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    name: "Berry Sensation",
    description: "Fresh mixed berries, cream, and powdered sugar on a delicate crepe.",
    price: "550 DA",
    category: "Fruity",
    image: "https://images.unsplash.com/photo-1504113882839-58e39d385ef4?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    name: "Premium Waffle",
    description: "Belgian waffle with ice cream, chocolate drizzle, and almonds.",
    price: "650 DA",
    category: "Waffles",
    image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&q=80&w=800"
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: any = {
  hidden: { opacity: 0, y: 40 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 20
    }
  }
};

export default function Menu() {
  return (
    <section id="menu" className="py-32 bg-[#FDFBF7] relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          <div className="max-w-2xl">
            <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-4 block">Our Selection</span>
            <h2 className="text-5xl md:text-6xl font-serif font-medium text-foreground">Curated Indulgence</h2>
          </div>
          <button className="hidden md:block text-foreground border-b border-foreground/30 pb-1 hover:text-primary hover:border-primary transition-all font-serif italic text-lg">
            View Full Menu
          </button>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16"
        >
          {menuItems.map((menuItem) => (
            <motion.div 
              key={menuItem.id}
              variants={item}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-white shadow-sm group-hover:shadow-2xl transition-all duration-500 ease-out">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 z-10 transition-colors duration-500" />
                <img 
                  src={menuItem.image} 
                  alt={menuItem.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-lg">
                    <Plus size={24} />
                  </div>
                </div>
              </div>
              
              <div className="pr-4">
                <div className="flex justify-between items-baseline mb-2 border-b border-border/50 pb-4 group-hover:border-primary/50 transition-colors duration-500">
                  <h3 className="font-serif font-bold text-xl text-foreground group-hover:text-primary transition-colors">{menuItem.name}</h3>
                  <span className="font-serif text-lg text-foreground">{menuItem.price}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2 line-clamp-2">{menuItem.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-16 text-center md:hidden">
          <button className="text-foreground border-b border-primary pb-1 hover:text-primary transition-colors font-serif italic text-lg">
            View Full Menu
          </button>
        </div>
      </div>
    </section>
  );
}
