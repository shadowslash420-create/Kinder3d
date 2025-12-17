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
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        backgroundColor: '#4A3728',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: isScrolled ? '12px 0' : '16px 0',
        transition: 'padding 0.3s ease',
        boxShadow: '0 4px 20px rgba(74, 55, 40, 0.4)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/">
          <span 
            style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 'bold',
              fontSize: '1.5rem',
              color: 'white',
              textShadow: '0 0 10px rgba(239, 68, 68, 0.7), 0 0 20px rgba(239, 68, 68, 0.4)',
              cursor: 'pointer',
            }}
          >
            Crêperie Kinder 5
          </span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '40px' }} className="hidden md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              style={{
                color: 'white',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontSize: '0.75rem',
                textDecoration: 'none',
                transition: 'color 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#DC2626'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
            >
              {link.name}
            </a>
          ))}
          
          <NavbarCart />
          
          <button 
            style={{
              padding: '12px 32px',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontWeight: '600',
              color: 'white',
              backgroundColor: '#DC2626',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B91C1C'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
          >
            Reserve
          </button>
        </nav>

        <div className="flex items-center gap-4 md:hidden">
          <NavbarCart />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '44px',
              height: '44px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              gap: '5px',
            }}
            aria-label="Toggle menu"
          >
            <div style={{
              width: '24px',
              height: '2px',
              backgroundColor: 'white',
              borderRadius: '9999px',
              transition: 'all 0.3s',
              transform: isMobileMenuOpen ? 'rotate(45deg) translateY(7px)' : 'none',
            }} />
            <div style={{
              width: '24px',
              height: '2px',
              backgroundColor: 'white',
              borderRadius: '9999px',
              transition: 'all 0.3s',
              opacity: isMobileMenuOpen ? 0 : 1,
            }} />
            <div style={{
              width: '24px',
              height: '2px',
              backgroundColor: 'white',
              borderRadius: '9999px',
              transition: 'all 0.3s',
              transform: isMobileMenuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
            }} />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            top: '80px',
            zIndex: 40,
            backgroundColor: '#4A3728',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px',
            gap: '24px',
          }}
          className="md:hidden"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                color: 'white',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontSize: '1.5rem',
                textDecoration: 'none',
              }}
            >
              {link.name}
            </a>
          ))}
          <button 
            style={{
              marginTop: '32px',
              padding: '24px 48px',
              fontSize: '1.125rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontWeight: '600',
              color: 'white',
              backgroundColor: '#DC2626',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Book Table
          </button>
        </div>
      )}
    </header>
  );
}
