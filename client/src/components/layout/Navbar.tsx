import { useState, useEffect } from "react";
import { Link } from "wouter";
import NavbarCart from "@/components/ui/NavbarCart";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Menu", href: "#menu" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: isScrolled ? 'rgba(26, 26, 26, 0.95)' : 'rgba(26, 26, 26, 0.90)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: isScrolled ? '12px 0' : '16px 0',
        transition: 'all 0.3s ease',
        boxShadow: isScrolled ? '0 4px 30px rgba(0, 0, 0, 0.3)' : 'none',
      }}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="relative group">
          <div className="h-12 flex items-center cursor-pointer">
            <span 
              className="font-serif font-bold tracking-tighter text-2xl whitespace-nowrap px-4 py-2 text-white"
              style={{
                textShadow: "0 0 10px rgba(239, 68, 68, 0.7), 0 0 20px rgba(239, 68, 68, 0.4)"
              }}
            >
              Crêperie Kinder 5
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-white font-bold uppercase tracking-widest text-xs hover:text-primary transition-colors duration-300"
            >
              {link.name}
            </a>
          ))}
          
          <NavbarCart />
          
          <button className="px-8 py-3 text-xs uppercase tracking-widest font-semibold text-white bg-primary hover:bg-primary/90 rounded-md transition-colors duration-300">
            Reserve
          </button>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <NavbarCart />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-3 flex flex-col justify-center items-center w-12 h-12"
            aria-label="Toggle menu"
          >
            <div className={`w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <div className={`w-6 h-0.5 bg-white rounded-full mt-2 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-6 h-0.5 bg-white rounded-full mt-2 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            top: '72px',
            zIndex: 40,
            backgroundColor: '#1a1a1a',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
          className="md:hidden"
        >
          <div className="flex flex-col p-8 space-y-6 items-center justify-center h-full pb-20">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white font-bold uppercase tracking-widest text-2xl hover:text-primary transition-colors duration-300"
              >
                {link.name}
              </a>
            ))}
            <button 
              className="mt-8 px-12 py-6 text-lg uppercase tracking-widest font-semibold text-white bg-primary hover:bg-primary/90 rounded-md transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Book Table
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
