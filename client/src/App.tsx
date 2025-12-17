import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import Intro from "@/components/sections/Intro";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
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
              <Intro key="intro" onEnter={handleEnter} />
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
