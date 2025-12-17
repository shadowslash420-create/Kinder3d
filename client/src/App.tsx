import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { lazy, Suspense, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

const Home = lazy(() => import("@/pages/Home"));
const NotFound = lazy(() => import("@/pages/not-found"));
const Intro = lazy(() => import("@/components/sections/Intro"));

const PageLoader = () => (
  <div className="fixed inset-0 bg-[#FDFBF7] flex items-center justify-center">
    <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  const [hasEntered, setHasEntered] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("creperie_entered") === "true";
    }
    return false;
  });

  useEffect(() => {
    if (hasEntered) {
      localStorage.setItem("creperie_entered", "true");
    }
  }, [hasEntered]);

  useEffect(() => {
    if (!hasEntered) {
      import("@/pages/Home");
    }
  }, [hasEntered]);

  const handleEnter = () => {
    setHasEntered(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <AnimatePresence mode="wait">
            {!hasEntered ? (
              <Suspense fallback={<PageLoader />}>
                <Intro key="intro" onEnter={handleEnter} />
              </Suspense>
            ) : (
              <div key="main">
                <Router />
              </div>
            )}
          </AnimatePresence>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
