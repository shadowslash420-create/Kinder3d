import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { orderService, generateOrderNumber, type OrderItem } from "@/lib/firebase";
import { ArrowLeft, MapPin, Phone, User, FileText, CreditCard } from "lucide-react";

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { cart, totalPrice, clearCart, isLoading: cartLoading } = useCart();
  
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/customer-login");
    }
  }, [user, authLoading, setLocation]);

  useEffect(() => {
    if (!cartLoading && cart.length === 0 && user) {
      setLocation("/cart");
    }
  }, [cart, cartLoading, user, setLocation]);

  if (authLoading || cartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDFBF7] to-[#F5EFE6] flex items-center justify-center">
        <div className="w-12 h-12 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || cart.length === 0) {
    return null;
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      toast({ title: "Error", description: "Please enter your name", variant: "destructive" });
      return;
    }

    if (!customerPhone.trim()) {
      toast({ title: "Error", description: "Please enter your phone number", variant: "destructive" });
      return;
    }

    if (!customerAddress.trim()) {
      toast({ title: "Error", description: "Please enter your delivery address", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const orderItems: OrderItem[] = cart.map(item => ({
        menuItemId: item.menuItemId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const orderNumber = generateOrderNumber();

      console.log("Creating order in Firebase...");
      await orderService.create({
        orderNumber,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        email: user.email || undefined,
        userId: user.uid,
        items: orderItems,
        subtotal: totalPrice,
        tax: 0,
        total: totalPrice,
        status: "pending",
        paymentStatus: "pending",
        paymentMethod: "COD",
        notes: notes.trim() || undefined,
      });

      console.log("Order created, clearing cart...");
      await clearCart();

      toast({ 
        title: "Order placed successfully!", 
        description: `Your order #${orderNumber} has been received. We'll contact you soon.`
      });

      setLocation(`/my-orders?new=${orderNumber}`);
    } catch (error: any) {
      console.error("Order error detail:", error);
      toast({ 
        title: "Order failed", 
        description: `Something went wrong: ${error.message || "Please try again."}`, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFBF7] to-[#F5EFE6]">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setLocation("/cart")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-slate-900">Checkout</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <form onSubmit={handleSubmitOrder}>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="pl-10"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="pl-10"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Textarea
                      id="address"
                      placeholder="Enter your full delivery address"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="pl-10 min-h-[80px]"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Order Notes (Optional)</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Textarea
                      id="notes"
                      placeholder="Any special instructions for your order..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="pl-10 min-h-[60px]"
                      disabled={loading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-4 border-2 border-red-600 rounded-lg bg-red-50">
                  <div className="w-4 h-4 rounded-full border-4 border-red-600"></div>
                  <div>
                    <p className="font-medium text-slate-900">Cash on Delivery (COD)</p>
                    <p className="text-sm text-slate-600">Pay when your order arrives</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-600">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium">{item.price * item.quantity} DA</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{totalPrice} DA</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-red-600">{totalPrice} DA</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={loading}
                >
                  {loading ? "Placing Order..." : `Place Order - ${totalPrice} DA`}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
