import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { orderService, type Order } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

const statusLabels: Record<Order["status"], string> = {
  pending: "Pending",
  received: "Received",
  preparing: "Being Prepared 👨‍🍳",
  ready: "Ready for Pickup ✅",
  picked_up: "Picked Up 📦",
  in_transit: "On Its Way 🚗",
  delivered: "Delivered 🎉",
  cancelled: "Cancelled ❌",
};

export default function OrderStatusNotifier() {
  const { user } = useAuth();
  const { toast } = useToast();
  const prevOrdersRef = useRef<Map<string, Order["status"]>>(new Map());
  const initialLoadRef = useRef(true);

  useEffect(() => {
    if (!user) {
      prevOrdersRef.current.clear();
      initialLoadRef.current = true;
      return;
    }

    const unsubscribe = orderService.subscribeToUserOrdersByEmailAndId(
      user.uid,
      user.email || null,
      (orders) => {
        if (initialLoadRef.current) {
          orders.forEach((order) => {
            prevOrdersRef.current.set(order.id, order.status);
          });
          initialLoadRef.current = false;
          return;
        }

        orders.forEach((order) => {
          const prevStatus = prevOrdersRef.current.get(order.id);

          if (prevStatus && prevStatus !== order.status) {
            toast({
              title: `Order #${order.orderNumber}`,
              description: `Your order is now: ${statusLabels[order.status] || order.status}`,
              duration: 6000,
            });
          }

          prevOrdersRef.current.set(order.id, order.status);
        });
      }
    );

    return () => unsubscribe();
  }, [user, toast]);

  return null;
}
