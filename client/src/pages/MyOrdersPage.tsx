import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { orderService, type Order } from "@/lib/firebase";
import { ArrowLeft, Package, Clock, CheckCircle, Truck, XCircle, ChefHat, ShoppingBag } from "lucide-react";
import { format } from "date-fns";

const statusConfig: Record<Order["status"], { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: <Clock className="w-4 h-4" /> },
  received: { label: "Received", color: "bg-blue-100 text-blue-800", icon: <CheckCircle className="w-4 h-4" /> },
  preparing: { label: "Preparing", color: "bg-orange-100 text-orange-800", icon: <ChefHat className="w-4 h-4" /> },
  ready: { label: "Ready", color: "bg-green-100 text-green-800", icon: <Package className="w-4 h-4" /> },
  picked_up: { label: "Picked Up", color: "bg-purple-100 text-purple-800", icon: <Truck className="w-4 h-4" /> },
  in_transit: { label: "In Transit", color: "bg-indigo-100 text-indigo-800", icon: <Truck className="w-4 h-4" /> },
  delivered: { label: "Delivered", color: "bg-emerald-100 text-emerald-800", icon: <CheckCircle className="w-4 h-4" /> },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: <XCircle className="w-4 h-4" /> },
};

export default function MyOrdersPage() {
  const [, setLocation] = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const newOrderNumber = searchParams.get("new");

  const handleBrowseMenu = () => {
    setLocation("/");
    setTimeout(() => {
      const menuSection = document.getElementById('menu');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  useEffect(() => {
    if (!user) return;

    const unsubscribe = orderService.subscribeToUserOrdersByEmailAndId(
      user.uid, 
      user.email, 
      (userOrders) => {
        setOrders(userOrders);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user?.email) return;
    
    const linkedKey = `orders_linked_${user.uid}`;
    if (sessionStorage.getItem(linkedKey)) return;
    
    orderService.linkExistingOrdersToUser(user.uid, user.email).then((linkedCount) => {
      sessionStorage.setItem(linkedKey, 'true');
      if (linkedCount > 0) {
        console.log(`Linked ${linkedCount} existing orders to user account`);
      }
    }).catch(console.error);
  }, [user?.uid, user?.email]);

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/customer-login");
    }
  }, [user, authLoading, setLocation]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDFBF7] to-[#F5EFE6] flex items-center justify-center">
        <div className="w-12 h-12 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFBF7] to-[#F5EFE6]">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setLocation("/")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-slate-900">My Orders</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {newOrderNumber && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-800">Order placed successfully!</p>
                <p className="text-sm text-green-700">Order #{newOrderNumber} has been received. We'll contact you soon.</p>
              </div>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingBag className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">No orders yet</h2>
              <p className="text-slate-600 mb-6">Your order history will appear here</p>
              <Button 
                onClick={handleBrowseMenu}
                className="bg-red-600 hover:bg-red-700"
              >
                Browse Menu
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {orders.map((order, index) => {
                const isNewOrder = order.orderNumber === newOrderNumber;
                const status = statusConfig[order.status];
                
                return (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={isNewOrder ? "ring-2 ring-green-500 ring-offset-2" : ""}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-base">
                              Order #{order.orderNumber}
                            </CardTitle>
                            <p className="text-sm text-slate-500">
                              {format(new Date(order.createdAt), "MMM d, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                          <Badge className={`${status.color} flex items-center gap-1`}>
                            {status.icon}
                            {status.label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="space-y-2 mb-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-slate-600">
                                {item.name} x {item.quantity}
                              </span>
                              <span className="font-medium">{item.price * item.quantity} DA</span>
                            </div>
                          ))}
                        </div>
                        
                        <Separator className="my-3" />
                        
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-slate-600">
                            <p>Payment: <span className="font-medium">{order.paymentMethod || "COD"}</span></p>
                            <p>Status: <span className={order.paymentStatus === "paid" ? "text-green-600 font-medium" : "text-yellow-600 font-medium"}>
                              {order.paymentStatus === "paid" ? "Paid" : "Pending"}
                            </span></p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-slate-600">Total</p>
                            <p className="text-lg font-bold text-red-600">{order.total} DA</p>
                          </div>
                        </div>

                        {order.customerAddress && (
                          <>
                            <Separator className="my-3" />
                            <div className="text-sm text-slate-600">
                              <p className="font-medium text-slate-700">Delivery Address:</p>
                              <p>{order.customerAddress}</p>
                            </div>
                          </>
                        )}

                        {order.notes && (
                          <>
                            <Separator className="my-3" />
                            <div className="text-sm text-slate-600">
                              <p className="font-medium text-slate-700">Notes:</p>
                              <p>{order.notes}</p>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
