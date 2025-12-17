import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Menu from "@/components/sections/Menu";
import Reviews from "@/components/sections/Reviews";
import WhyUs from "@/components/sections/WhyUs";
import Contact from "@/components/sections/Contact";
import { useEffect } from "react";
import Lenis from "lenis";

export default function Home() {
  
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="w-full min-h-screen text-foreground overflow-x-hidden relative">
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: `linear-gradient(
            180deg,
            #1a1a1a 0%,
            #2d1810 8%,
            #6B4423 18%,
            #A67B5B 28%,
            #F3E5AB 38%,
            #FDFBF7 48%,
            #F3E5AB 58%,
            #A67B5B 68%,
            #6B4423 78%,
            #2d1810 88%,
            #1a1a1a 100%
          )`,
          backgroundSize: '100% 600vh',
          backgroundAttachment: 'fixed'
        }}
      />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Menu />
        <Reviews />
        <WhyUs />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
