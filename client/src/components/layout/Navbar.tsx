import { useState } from "react";
import { Link } from "wouter";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// 3D Logo Component
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
      {/* Glowing Background */}
      <motion.div
        animate={{
          opacity: isHovered ? 1 : 0.6,
          scale: isHovered ? 1.05 : 1
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 rounded-lg blur-xl"
        style={{
          background: "linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #991B1B 100%)",
          filter: "blur(12px)",
          zIndex: -1
        }}
      />

      <motion.div
        animate={{
          rotateX: rotate.x,
          rotateY: rotate.y,
          scale: isHovered ? 1.08 : 1
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="font-serif font-bold tracking-tighter text-2xl whitespace-nowrap px-4 py-2 rounded-lg"
        style={{
          transformStyle: "preserve-3d",
          textShadow: isHovered 
            ? "0 0 30px rgba(239, 68, 68, 1), 0 0 60px rgba(239, 68, 68, 0.8), 0 4px 20px rgba(0, 0, 0, 0.4)"
            : "0 0 20px rgba(239, 68, 68, 0.8), 0 4px 15px rgba(0, 0, 0, 0.3)",
          background: "linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #991B1B 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "0.05em"
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
    { name: "Experience", href: "#gallery" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b ${
        isScrolled
          ? "bg-white/80 backdrop-blur-xl border-white/20 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
          : "bg-transparent border-transparent py-6"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "circOut" }}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/">
          <a className="relative group">
            <Logo3D />
          </a>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs font-bold uppercase tracking-[0.15em] text-foreground/80 hover:text-primary transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-[1px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.name}
            </a>
          ))}
          <Button className="rounded-full bg-foreground hover:bg-primary text-white px-8 h-10 text-xs uppercase tracking-widest transition-colors duration-500 shadow-lg">
            Reserve
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-foreground p-2 hover:bg-foreground/5 rounded-full transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "100vh" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-[#FDFBF7] fixed inset-0 top-[72px] z-40 border-t border-border overflow-hidden"
        >
          <div className="flex flex-col p-8 space-y-6 items-center justify-center h-full pb-20">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-3xl font-serif text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </motion.a>
            ))}
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.5 }}
               className="pt-8"
            >
              <Button className="w-full rounded-full bg-primary text-white px-12 py-6 text-lg">
                Book Table
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
