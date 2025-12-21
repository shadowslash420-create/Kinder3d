import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import { lazy, Suspense, useEffect, useRef, useMemo } from "react";
import Lenis from "lenis";

// Detect if running on mobile/low-end device
const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;
const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const About = lazy(() => import("@/components/sections/About"));
const Menu = lazy(() => import("@/components/sections/Menu"));
const Reviews = lazy(() => import("@/components/sections/Reviews"));
const WhyUs = lazy(() => import("@/components/sections/WhyUs"));
const Contact = lazy(() => import("@/components/sections/Contact"));

const SectionLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function Home() {
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Disable smooth scroll on mobile for better performance
    if (isMobileDevice || isReducedMotion) return;

    const initLenis = () => {
      if (lenisRef.current) return;
      
      lenisRef.current = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
      });

      function raf(time: number) {
        lenisRef.current?.raf(time);
        rafIdRef.current = requestAnimationFrame(raf);
      }

      rafIdRef.current = requestAnimationFrame(raf);
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(initLenis, { timeout: 2000 });
    } else {
      setTimeout(initLenis, 100);
    }

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      lenisRef.current?.destroy();
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
        <Suspense fallback={<SectionLoader />}>
          <About />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Menu />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Reviews />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <WhyUs />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
