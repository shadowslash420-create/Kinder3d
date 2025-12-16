export default function Footer() {
  return (
    <footer className="bg-secondary/10 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-serif font-bold mb-6">
              Creperie<span className="text-primary">Kinder 5</span>
            </h2>
            <p className="text-muted-foreground max-w-sm mb-8">
              The finest crepes and desserts in Batna. Crafted with French tradition and Algerian heart. Open daily for your sweet moments.
            </p>
            <div className="flex space-x-4">
              {/* Social placeholders */}
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:scale-110 transition-transform cursor-pointer">
                IG
              </div>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:scale-110 transition-transform cursor-pointer">
                FB
              </div>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:scale-110 transition-transform cursor-pointer">
                TT
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-serif font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><a href="#hero" className="text-muted-foreground hover:text-primary transition-colors">Home</a></li>
              <li><a href="#menu" className="text-muted-foreground hover:text-primary transition-colors">Our Menu</a></li>
              <li><a href="#about" className="text-muted-foreground hover:text-primary transition-colors">Our Story</a></li>
              <li><a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-6">Contact</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li>Allée Ben Boulaïd</li>
              <li>Batna, Algeria</li>
              <li>+213 (0) 792 15 97 18</li>
              <li>Mon-Sun: 12 PM - 12 AM</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2025 Creperie Kinder 5, Batna. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
