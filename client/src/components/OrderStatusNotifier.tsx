import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { notificationService, orderService, type Order } from "@/lib/firebase";
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
  const shownIdsRef = useRef<Set<string>>(new Set());
  const initialLoadRef = useRef(true);
  const fallbackActiveRef = useRef(false);
  const prevOrdersRef = useRef<Map<string, Order["status"]>>(new Map());

  useEffect(() => {
    if (!user) {
      shownIdsRef.current.clear();
      initialLoadRef.current = true;
      fallbackActiveRef.current = false;
      prevOrdersRef.current.clear();
      return;
    }

    let unsubFirestore: (() => void) | null = null;
    let unsubFallback: (() => void) | null = null;
    let isFirstBatch = true;

    unsubFirestore = notificationService.subscribeToUserNotifications(
      user.uid,
      (newNotifications) => {
        if (isFirstBatch) {
          newNotifications.forEach((n) => shownIdsRef.current.add(n.id));
          isFirstBatch = false;
          return;
        }

        newNotifications.forEach((notification) => {
          if (!shownIdsRef.current.has(notification.id)) {
            shownIdsRef.current.add(notification.id);

            toast({
              title: notification.title || "Order Update",
              description: notification.body || `Order status changed to: ${notification.status}`,
              duration: 6000,
            });

            notificationService.markAsRead(notification.id).catch(() => {});
          }
        });
      }
    );

    setTimeout(() => {
      if (!fallbackActiveRef.current && shownIdsRef.current.size === 0 && isFirstBatch) {
        fallbackActiveRef.current = true;
        let fallbackInitial = true;

        unsubFallback = orderService.subscribeToUserOrdersByEmailAndId(
          user.uid,
          user.email || null,
          (orders) => {
            if (fallbackInitial) {
              orders.forEach((order) => {
                prevOrdersRef.current.set(order.id, order.status);
              });
              fallbackInitial = false;
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
      }
    }, 3000);

    return () => {
      if (unsubFirestore) unsubFirestore();
      if (unsubFallback) unsubFallback();
    };
  }, [user, toast]);

  return null;
}
