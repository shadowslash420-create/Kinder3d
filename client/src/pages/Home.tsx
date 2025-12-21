import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import { lazy, Suspense, useEffect, useRef } from "react";
import Lenis from "lenis";
import WaveBackground from "@/components/ui/WaveBackground";

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
    <div className="w-full min-h-screen text-foreground overflow-x-hidden">
      <Navbar />
      <main className="relative">
        <Hero />
        
        {/* 3D Wave Background */}
        <div className="fixed inset-0 top-[100vh] w-full z-0 pointer-events-none" style={{ height: 'calc(100vh * 4)' }}>
          <WaveBackground />
        </div>
        
        <div className="relative z-10">
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
