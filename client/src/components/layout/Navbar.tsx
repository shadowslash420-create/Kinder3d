import { useState } from "react";
import { Link } from "wouter";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { AnimatedNavLink, AnimatedHamburger, AnimatedButton } from "@/components/ui/animated-button";
import NavbarCart from "@/components/ui/NavbarCart";

const Logo3D = () => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientY - rect.top - rect.height / 2) / 10;
    const y = (e.clientX - rect.left - rect.width / 2) / 10;
    setRotate({ x, y });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      className="h-12 flex items-center cursor-pointer perspective relative"
      style={{
        perspective: "1000px"
      }}
    >
      <motion.div
        animate={{
          opacity: isHovered ? 0.5 : 0.25,
          scale: isHovered ? 1.02 : 1
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 rounded-lg"
        style={{
          background: "linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #991B1B 100%)",
          filter: "blur(8px)",
          zIndex: -1
        }}
      />

      <motion.div
        animate={{
          rotateX: rotate.x,
          rotateY: rotate.y,
          scale: isHovered ? 1.05 : 1
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="font-serif font-bold tracking-tighter text-2xl whitespace-nowrap px-4 py-2 rounded-lg"
        style={{
          transformStyle: "preserve-3d",
          color: "#FFFFFF",
          textShadow: isHovered 
            ? "0 0 15px rgba(239, 68, 68, 0.9), 0 0 30px rgba(239, 68, 68, 0.6)"
            : "0 0 10px rgba(239, 68, 68, 0.7), 0 0 20px rgba(239, 68, 68, 0.4)",
          letterSpacing: "0.05em",
          filter: "drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))"
        }}
      >
        Crêperie Kinder 5
      </motion.div>
    </div>
  );
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Menu", href: "#menu" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ease-in-out border-b backdrop-blur-md ${
        isScrolled
          ? "bg-black/70 border-white/10 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "bg-black/50 border-white/5 py-4"
      }`}
      initial={{ y: 0 }}
      animate={{ y: 0 }}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="relative group">
          <Logo3D />
        </Link>

        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <AnimatedNavLink
              key={link.name}
              href={link.href}
              className="text-xs"
            >
              {link.name}
            </AnimatedNavLink>
          ))}
          
          <NavbarCart />
          
          <AnimatedButton
            className="px-8 py-3 text-xs uppercase tracking-widest"
          >
            Reserve
          </AnimatedButton>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <NavbarCart />
          <AnimatedHamburger
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>
      </div>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "100vh" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-[#1a1a1a] fixed inset-0 top-[72px] z-40 border-t border-white/10 overflow-hidden"
        >
          <div className="flex flex-col p-8 space-y-6 items-center justify-center h-full pb-20">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <AnimatedNavLink
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl"
                >
                  {link.name}
                </AnimatedNavLink>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-8"
            >
              <AnimatedButton
                className="px-12 py-6 text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Book Table
              </AnimatedButton>
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
