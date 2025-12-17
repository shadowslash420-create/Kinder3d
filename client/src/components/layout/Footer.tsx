import { useMemo } from "react";

interface Bubble {
  id: number;
  size: string;
  distance: string;
  position: string;
  time: string;
  delay: string;
}

export default function Footer() {
  const bubbles: Bubble[] = useMemo(() => {
    return Array.from({ length: 48 }, (_, i) => ({
      id: i,
      size: `${2 + Math.random() * 4}rem`,
      distance: `${6 + Math.random() * 4}rem`,
      position: `${-5 + Math.random() * 110}%`,
      time: `${2 + Math.random() * 2}s`,
      delay: `${-1 * (2 + Math.random() * 2)}s`,
    }));
  }, []);

  return (
    <footer className="relative z-10" style={{ minHeight: "14rem" }}>
      <svg style={{ position: "fixed", top: "100vh" }}>
        <defs>
          <filter id="blob">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="blob"
            />
            <feComposite in="SourceGraphic" in2="blob" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div 
        className="absolute top-0 left-0 right-0 h-4"
        style={{ 
          backgroundColor: "#DC2626",
          filter: "url(#blob)"
        }}
      >
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="absolute rounded-full"
            style={{
              left: bubble.position,
              backgroundColor: "#DC2626",
              width: bubble.size,
              height: bubble.size,
              animation: `bubble-size ${bubble.time} ease-in infinite ${bubble.delay}, bubble-move ${bubble.time} ease-in infinite ${bubble.delay}`,
              transform: "translate(-50%, 100%)",
            }}
          />
        ))}
      </div>

      <div 
        className="relative z-20 pt-20 pb-10"
        style={{ backgroundColor: "#DC2626" }}
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-3xl font-serif font-bold mb-6 text-white">
                Creperie<span className="text-white/80"> Kinder 5</span>
              </h2>
              <p className="text-white/80 max-w-sm mb-8">
                The finest crepes and desserts in Batna. Crafted with French tradition and Algerian heart. Open daily for your sweet moments.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-serif font-bold text-lg mb-6 text-white">Quick Links</h3>
              <ul className="space-y-4">
                <li><a href="#hero" className="text-white/80 hover:text-white transition-colors">Home</a></li>
                <li><a href="#menu" className="text-white/80 hover:text-white transition-colors">Our Menu</a></li>
                <li><a href="#about" className="text-white/80 hover:text-white transition-colors">Our Story</a></li>
                <li><a href="#contact" className="text-white/80 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg mb-6 text-white">Contact</h3>
              <ul className="space-y-4 text-white/80">
                <li>Allée Ben Boulaïd</li>
                <li>Batna, Algeria</li>
                <li>+213 (0) 792 15 97 18</li>
                <li>Mon-Sun: 12 PM - 12 AM</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/70">
            <p>© 2025 Creperie Kinder 5, Batna. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bubble-size {
          0%, 75% {
            width: var(--size, 4rem);
            height: var(--size, 4rem);
          }
          100% {
            width: 0rem;
            height: 0rem;
          }
        }
        @keyframes bubble-move {
          0% {
            bottom: -4rem;
          }
          100% {
            bottom: var(--distance, 10rem);
          }
        }
      `}</style>
    </footer>
  );
}
