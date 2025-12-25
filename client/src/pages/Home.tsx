import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import GradientDivider from "@/components/ui/GradientDivider";
import { lazy, Suspense, useEffect, useRef } from "react";
import Lenis from "lenis";
import { useState } from "react";
import { requestNotificationPermission } from "@/lib/notifications";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

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
  const { user, role } = useAuth();
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [notificationStatus, setNotificationStatus] = useState<"idle" | "requesting" | "enabled" | "denied">("idle");

  const handleEnableNotifications = async () => {
    if (user) {
      setNotificationStatus("requesting");
      const token = await requestNotificationPermission(user.uid, role || "customer");
      if (token) {
        setNotificationStatus("enabled");
      } else {
        setNotificationStatus("denied");
      }
    }
  };
  
  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        setNotificationStatus("enabled");
      } else if (Notification.permission === "denied") {
        setNotificationStatus("denied");
      }
    }
  }, []);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    const handleResize = () => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(checkMobile, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (isMobile) return;
    
    const initLenis = () => {
      if (lenisRef.current) return;
      
      lenisRef.current = new Lenis({
        duration: 0.8,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
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
      (window as any).requestIdleCallback(initLenis, { timeout: 1000 });
    } else {
      setTimeout(initLenis, 200);
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
        <div className="fixed top-24 right-4 z-50">
          <Button 
            onClick={handleEnableNotifications}
            variant="outline" 
            size="sm"
            className={`bg-background/80 backdrop-blur-sm border-primary/20 hover:border-primary text-xs ${
              notificationStatus === "enabled" ? "text-green-500 border-green-500" : ""
            }`}
            disabled={notificationStatus === "enabled" || notificationStatus === "requesting"}
          >
            <Bell className="w-3 h-3 mr-2" />
            {notificationStatus === "enabled" ? "Notifications Enabled" : 
             notificationStatus === "requesting" ? "Requesting..." :
             notificationStatus === "denied" ? "Permission Denied" : "Enable Push"}
          </Button>
        </div>
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
