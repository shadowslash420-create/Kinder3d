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
          <a
            href="#hero"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              color: 'white',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontSize: '1.5rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#fff">
              <g clipPath="url(#clip0_home_mobile)">
                <path opacity="0.4" d="M10.0698 2.81986L3.13978 8.36985C2.35978 8.98985 1.85978 10.2999 2.02978 11.2799L3.35978 19.2398C3.59978 20.6598 4.95977 21.8099 6.39977 21.8099H17.5998C19.0298 21.8099 20.3998 20.6498 20.6398 19.2398L21.9698 11.2799C22.1298 10.2999 21.6298 8.98985 20.8598 8.36985L13.9298 2.82984C12.8598 1.96984 11.1298 1.96986 10.0698 2.81986Z" fill="white"/>
                <path d="M12 15.5C13.3807 15.5 14.5 14.3807 14.5 13C14.5 11.6193 13.3807 10.5 12 10.5C10.6193 10.5 9.5 11.6193 9.5 13C9.5 14.3807 10.6193 15.5 12 15.5Z" fill="white"/>
              </g>
              <defs>
                <clipPath id="clip0_home_mobile">
                  <rect width="24" height="24" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            Home
          </a>
          {navLinks.slice(1).map((link) => (
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
