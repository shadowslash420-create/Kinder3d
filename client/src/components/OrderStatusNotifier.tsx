import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { db, orderService, type Order } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore";
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

    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("userId", "==", user.uid),
      where("read", "==", false),
      orderBy("createdAt", "desc")
    );

    unsubFirestore = onSnapshot(q, (snapshot) => {
      if (initialLoadRef.current) {
        snapshot.docs.forEach((d) => {
          shownIdsRef.current.add(d.id);
        });
        initialLoadRef.current = false;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" && !shownIdsRef.current.has(change.doc.id)) {
          shownIdsRef.current.add(change.doc.id);
          const data = change.doc.data();

          toast({
            title: data.title || "Order Update",
            description: data.body || `Order status changed to: ${data.status}`,
            duration: 6000,
          });

          updateDoc(doc(db, "notifications", change.doc.id), { read: true }).catch(() => {});
        }
      });
    }, () => {
      if (!fallbackActiveRef.current) {
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
    });

    return () => {
      if (unsubFirestore) unsubFirestore();
      if (unsubFallback) unsubFallback();
    };
  }, [user, toast]);

  return null;
}
