import { motion } from "framer-motion";
import { Plus } from "lucide-react";

// Mock data
const menuItems = [
  {
    id: 1,
    name: "The Classic Kinder",
    description: "Our signature crepe filled with melted Kinder chocolate bars and white cream.",
    price: "$12.00",
    category: "Signature",
    image: "https://images.unsplash.com/photo-1519340333755-56e9c1d04579?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    name: "Bueno Delight",
    description: "Crushed Kinder Bueno, hazelnut cream, and dark chocolate drizzle.",
    price: "$14.50",
    category: "Signature",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    name: "Berry Bliss",
    description: "Fresh strawberries, blueberries, and Kinder white chocolate shavings.",
    price: "$13.50",
    category: "Fruity",
    image: "https://images.unsplash.com/photo-1504113882839-58e39d385ef4?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    name: "Royal Waffle",
    description: "Belgian waffle topped with vanilla ice cream and warm Kinder sauce.",
    price: "$15.00",
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

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Menu() {
  return (
    <section id="menu" className="py-24 bg-secondary/5 relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium tracking-widest uppercase text-sm">Our Selection</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mt-3 mb-6">Curated Indulgence</h2>
          <p className="text-muted-foreground">Explore our menu of handcrafted delights, where premium ingredients meet artistic presentation.</p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {menuItems.map((menuItem) => (
            <motion.div 
              key={menuItem.id}
              variants={item}
              className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-muted">
                <img 
                  src={menuItem.image} 
                  alt={menuItem.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <button className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-primary hover:bg-primary hover:text-white transition-colors">
                  <Plus size={20} />
                </button>
              </div>
              
              <div className="px-2 pb-2">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif font-bold text-lg text-foreground group-hover:text-primary transition-colors">{menuItem.name}</h3>
                  <span className="font-bold text-primary">{menuItem.price}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{menuItem.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-16 text-center">
          <button className="text-foreground border-b border-primary pb-1 hover:text-primary transition-colors font-serif italic text-lg">
            View Full Menu
          </button>
        </div>
      </div>
    </section>
  );
}
