import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import NavbarCart from "@/components/ui/NavbarCart";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogin = () => {
    setLocation("/customer-login");
  };

  const handleOrderNow = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMyOrders = () => {
    setLocation("/my-orders");
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
        padding: isScrolled ? '12px 0' : '40px 0',
        transition: 'padding 0.3s ease',
        boxShadow: '0 4px 20px rgba(74, 55, 40, 0.4)',
        clipPath: 'polygon(0 0, 200% -100%, 80% 100%, 15% 100%)',
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

        <nav style={{ alignItems: 'center', gap: '40px' }} className="hidden md:flex">
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
            onClick={handleOrderNow}
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
            Order Now
          </button>

          {!loading && user && (
            <button
              onClick={handleMyOrders}
              style={{
                padding: '8px 16px',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: '600',
                color: 'white',
                backgroundColor: 'transparent',
                border: '1px solid white',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#4A3728';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'white';
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <path d="M3 6h18"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              My Orders
            </button>
          )}

          {!loading && (
            user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {user.photoURL && (
                  <img 
                    src={user.photoURL} 
                    alt="Profile" 
                    style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%',
                      border: '2px solid white'
                    }} 
                  />
                )}
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: '600',
                    color: 'white',
                    backgroundColor: 'transparent',
                    border: '1px solid white',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = '#4A3728';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'white';
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                style={{
                  padding: '8px 16px',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: '600',
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: '1px solid white',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#4A3728';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'white';
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Sign In
              </button>
            )
          )}
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
          <a
            href="#about"
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
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none">
              <g clipPath="url(#clip0_about_mobile)">
                <path d="M17 21H7C3 21 2 20 2 16V8C2 4 3 3 7 3H17C21 3 22 4 22 8V16C22 20 21 21 17 21Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <g opacity="0.4">
                  <path d="M14 8H19" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 12H19" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M17 16H19" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8.50043 11.2899C9.50007 11.2899 10.3104 10.4796 10.3104 9.47992C10.3104 8.48029 9.50007 7.66992 8.50043 7.66992C7.50079 7.66992 6.69043 8.48029 6.69043 9.47992C6.69043 10.4796 7.50079 11.2899 8.50043 11.2899Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 16.3298C11.86 14.8798 10.71 13.7398 9.26 13.6098C8.76 13.5598 8.25 13.5598 7.74 13.6098C6.29 13.7498 5.14 14.8798 5 16.3298" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </g>
              <defs>
                <clipPath id="clip0_about_mobile">
                  <rect width="24" height="24" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            About
          </a>
          <a
            href="#menu"
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
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none">
              <g clipPath="url(#clip0_menu_mobile)">
                <path d="M2 13.5498V10.4698C2 8.13977 3.89 6.25977 6.21 6.25977H13.58C15.91 6.25977 17.79 8.14977 17.79 10.4698V17.7898C17.79 20.1198 15.9 21.9998 13.58 21.9998H6.21C3.89 21.9998 2 20.1098 2 17.7898" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5.5 4V2.25" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.5 4V2.25" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.5 4V2.25" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 13.1592C22 15.4792 20.11 17.3692 17.79 17.3692V8.94922C20.11 8.94922 22 10.8292 22 13.1592Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12H17.51" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_menu_mobile">
                  <rect width="24" height="24" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            Menu
          </a>
          <a
            href="#contact"
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
              <g clipPath="url(#clip0_contact_mobile)">
                <path opacity="0.4" d="M19.6 13.98C19.55 13.89 19.51 13.8 19.48 13.7L19.2 12.68L19.17 12.58C18.98 12.08 18.53 11.74 17.97 11.74C17.42 11.74 16.94 12.07 16.75 12.57L16.69 12.74L16.43 13.69C16.29 14.19 15.92 14.56 15.41 14.71L14.45 14.96C13.85 15.13 13.47 15.63 13.47 16.24C13.47 16.66 13.67 17.03 13.98 17.27L8.99 19.77C3.23 22.65 0.88 20.29 3.76 14.54L4.63 12.81C4.88 12.3 4.88 11.71 4.63 11.2L3.76 9.46001C0.88 3.71001 3.24 1.35001 8.99 4.23001L17.55 8.51001C20.5 9.98001 21.17 12.17 19.6 13.98Z" fill="white"/>
                <path d="M15.07 12C15.07 12.41 14.73 12.75 14.32 12.75H8.91998C8.50998 12.75 8.16998 12.41 8.16998 12C8.16998 11.59 8.50998 11.25 8.91998 11.25H14.32C14.73 11.25 15.07 11.59 15.07 12Z" fill="white"/>
                <path d="M21.47 16.26C21.47 16.33 21.43 16.49 21.24 16.55L20.26 16.82C19.41 17.05 18.77 17.69 18.54 18.54L18.28 19.5C18.22 19.72 18.05 19.74 17.97 19.74C17.89 19.74 17.72 19.72 17.66 19.5L17.4 18.53C17.17 17.69 16.52 17.05 15.68 16.82L14.71 16.56C14.5 16.5 14.48 16.32 14.48 16.25C14.48 16.17 14.5 15.99 14.71 15.93L15.69 15.67C16.53 15.43 17.17 14.79 17.4 13.95L17.68 12.93C17.75 12.76 17.91 12.73 17.97 12.73C18.03 12.73 18.2 12.75 18.26 12.91L18.54 13.94C18.77 14.78 19.42 15.42 20.26 15.66L21.26 15.94C21.46 16.02 21.47 16.2 21.47 16.26Z" fill="white"/>
              </g>
              <defs>
                <clipPath id="clip0_contact_mobile">
                  <rect width="24" height="24" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            Contact
          </a>
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
            onClick={() => {
              handleOrderNow();
              setIsMobileMenuOpen(false);
            }}
          >
            Order Now
          </button>

          {!loading && user && (
            <button
              onClick={() => {
                handleMyOrders();
                setIsMobileMenuOpen(false);
              }}
              style={{
                marginTop: '16px',
                padding: '16px 32px',
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: '600',
                color: 'white',
                backgroundColor: 'transparent',
                border: '2px solid white',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <path d="M3 6h18"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              My Orders
            </button>
          )}

          {!loading && (
            user ? (
              <div style={{ 
                marginTop: '24px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '12px' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {user.photoURL && (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%',
                        border: '2px solid white'
                      }} 
                    />
                  )}
                  <span style={{ color: 'white', fontSize: '1rem' }}>
                    {user.displayName || user.email}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    padding: '16px 32px',
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: '600',
                    color: 'white',
                    backgroundColor: 'transparent',
                    border: '2px solid white',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  handleLogin();
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  marginTop: '24px',
                  padding: '16px 32px',
                  fontSize: '1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: '600',
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: '2px solid white',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Sign In
              </button>
            )
          )}
        </div>
      )}
    </header>
  );
}
