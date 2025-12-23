import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import GradientDivider from "@/components/ui/GradientDivider";
import { lazy, Suspense, useEffect, useRef } from "react";
import Lenis from "lenis";
import { useState } from "react";

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
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Disable smooth scrolling on mobile entirely for better performance
    if (isMobile) return;
    
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
  }, [isMobile]);

  return (
    <div className="w-full min-h-screen text-foreground overflow-x-hidden relative">
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: `linear-gradient(
            180deg,
            #0f0202 0%,
            #2b0a0a 8%,
            #4a0505 18%,
            #641010 28%,
            #801515 38%,
            #1a0505 48%,
            #641010 58%,
            #4a0505 68%,
            #2b0a0a 78%,
            #1a0505 88%,
            #0f0202 100%
          )`,
          backgroundSize: '100% 600vh',
          backgroundAttachment: isMobile ? 'scroll' : 'fixed'
        }}
      />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <GradientDivider fromColor="#0f0202" toColor="#1a0505" height="h-24" />
        <Suspense fallback={<SectionLoader />}>
          <About />
        </Suspense>
        <GradientDivider fromColor="#2b0a0a" toColor="#1a0505" height="h-24" />
        <Suspense fallback={<SectionLoader />}>
          <Menu />
        </Suspense>
        <GradientDivider fromColor="#1a0505" toColor="#0f0202" height="h-24" />
        <Suspense fallback={<SectionLoader />}>
          <Reviews />
        </Suspense>
        <GradientDivider fromColor="#0f0202" toColor="#0f0202" height="h-24" />
        <Suspense fallback={<SectionLoader />}>
          <WhyUs />
        </Suspense>
        <GradientDivider fromColor="#0f0202" toColor="#1a0505" height="h-24" />
        <Suspense fallback={<SectionLoader />}>
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
