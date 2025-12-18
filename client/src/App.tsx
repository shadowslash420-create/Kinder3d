import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { lazy, Suspense, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

const Home = lazy(() => import("@/pages/Home"));
const NotFound = lazy(() => import("@/pages/not-found"));
const Intro = lazy(() => import("@/components/sections/Intro"));
const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const Orders = lazy(() => import("@/pages/admin/Orders"));
const MenuItems = lazy(() => import("@/pages/admin/MenuItems"));
const Categories = lazy(() => import("@/pages/admin/Categories"));
const Reviews = lazy(() => import("@/pages/admin/Reviews"));
const Messages = lazy(() => import("@/pages/admin/Messages"));
const Staff = lazy(() => import("@/pages/admin/Staff"));

const CustomerLogin = lazy(() => import("@/pages/CustomerLogin"));
const CartPage = lazy(() => import("@/pages/CartPage"));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"));
const MyOrdersPage = lazy(() => import("@/pages/MyOrdersPage"));
const StaffA = lazy(() => import("@/pages/StaffA"));
const StaffB = lazy(() => import("@/pages/StaffB"));

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
        <Route path="/customer-login" component={CustomerLogin} />
        <Route path="/cart" component={CartPage} />
        <Route path="/checkout" component={CheckoutPage} />
        <Route path="/my-orders" component={MyOrdersPage} />
        <Route path="/staff-a" component={StaffA} />
        <Route path="/staff-b" component={StaffB} />
        <Route path="/admin" component={AdminLogin} />
        <Route path="/admin/dashboard" component={Dashboard} />
        <Route path="/admin/orders" component={Orders} />
        <Route path="/admin/menu" component={MenuItems} />
        <Route path="/admin/categories" component={Categories} />
        <Route path="/admin/reviews" component={Reviews} />
        <Route path="/admin/messages" component={Messages} />
        <Route path="/admin/staff" component={Staff} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");
  
  const pathWithoutQuery = location.split("?")[0];
  const isStaffRoute = pathWithoutQuery === "/staff-a" || pathWithoutQuery === "/staff-b";
  const isCustomerRoute = ["/customer-login", "/cart", "/checkout", "/my-orders"].includes(pathWithoutQuery) || pathWithoutQuery.startsWith("/my-orders");

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

  if (isAdminRoute || isStaffRoute) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    );
  }

  if (isCustomerRoute) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
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
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
