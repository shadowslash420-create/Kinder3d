import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import RequireRole from "@/components/admin/RequireRole";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Search, Eye } from "lucide-react";
import { orderService, type Order } from "@/lib/firebase";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  received: "bg-blue-100 text-blue-800",
  preparing: "bg-purple-100 text-purple-800",
  ready: "bg-green-100 text-green-800",
  picked_up: "bg-gray-100 text-gray-800",
  in_transit: "bg-indigo-100 text-indigo-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "received", label: "Received" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "picked_up", label: "Picked Up" },
  { value: "in_transit", label: "In Transit" },
  { value: "cancelled", label: "Cancelled" },
];

function OrdersContent() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const unsubscribe = orderService.subscribe((data) => {
      setOrders(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !search || 
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await orderService.update(orderId, { status: status as Order["status"] });
      toast({ title: "Success", description: "Order status updated" });
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: status as Order["status"] });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const updateNotes = async () => {
    if (!selectedOrder) return;
    try {
      await orderService.update(selectedOrder.id, { notes });
      toast({ title: "Success", description: "Notes updated" });
      setSelectedOrder({ ...selectedOrder, notes });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update notes", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6 w-full overflow-hidden">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">Orders</h1>
            <p className="text-sm md:text-base text-slate-600">Manage and track all orders</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col gap-3 md:flex-row md:gap-4">
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Search..."
                  className="text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="secondary" size="sm" className="md:size-auto">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <Select value={statusFilter || "all"} onValueChange={(val) => setStatusFilter(val === "all" ? "" : val)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {statusOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Desktop Table View */}
        <Card className="hidden md:block">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-slate-600 text-sm">Order #</th>
                    <th className="text-left p-4 font-medium text-slate-600 text-sm">Customer</th>
                    <th className="text-left p-4 font-medium text-slate-600 text-sm">Items</th>
                    <th className="text-left p-4 font-medium text-slate-600 text-sm">Total</th>
                    <th className="text-left p-4 font-medium text-slate-600 text-sm">Status</th>
                    <th className="text-left p-4 font-medium text-slate-600 text-sm">Date</th>
                    <th className="text-left p-4 font-medium text-slate-600 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        Loading...
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-slate-50">
                        <td className="p-4 font-mono text-sm">{order.orderNumber}</td>
                        <td className="p-4">
                          <div className="text-sm font-medium">{order.customerName}</div>
                          <div className="text-xs text-slate-500">{order.customerPhone}</div>
                          <div className="text-xs text-slate-400 mt-1 max-w-[200px] truncate" title={order.customerAddress}>
                            {order.customerAddress}
                          </div>
                        </td>
                        <td className="p-4 text-sm">{order.items.length} items</td>
                        <td className="p-4 font-medium text-sm">DA {order.total.toFixed(2)}</td>
                        <td className="p-4">
                          <Badge className={statusColors[order.status]}>{order.status.replace("_", " ")}</Badge>
                        </td>
                        <td className="p-4 text-sm text-slate-500">
                          {order.createdAt.toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedOrder(order);
                              setNotes(order.notes || "");
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <div className="text-center text-slate-500 py-8">Loading...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center text-slate-500 py-8">No orders found</div>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-mono text-sm font-bold text-slate-900">{order.orderNumber}</p>
                      <p className="text-xs text-slate-500">{order.createdAt.toLocaleDateString()}</p>
                    </div>
                    <Badge className={statusColors[order.status]}>{order.status.replace("_", " ")}</Badge>
                  </div>
                  
                  <div className="border-t pt-3">
                    <p className="text-sm font-medium text-slate-900">{order.customerName}</p>
                    <p className="text-xs text-slate-500">{order.customerPhone}</p>
                    {order.email && <p className="text-xs text-slate-500">{order.email}</p>}
                  </div>

                  <div className="border-t pt-3 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-500">Items</p>
                      <p className="text-sm font-medium">{order.items.length} items</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Total</p>
                      <p className="text-sm font-bold text-slate-900">DA {order.total.toFixed(2)}</p>
                    </div>
                  </div>

                  <Button
                    variant="default"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => {
                      setSelectedOrder(order);
                      setNotes(order.notes || "");
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">Order {selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <p className="text-xs md:text-sm text-slate-500">Customer</p>
                  <p className="font-medium text-sm md:text-base">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-slate-500">Phone</p>
                  <p className="font-medium text-sm md:text-base">{selectedOrder.customerPhone || "-"}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs md:text-sm text-slate-500">Delivery Address</p>
                  <p className="font-medium text-sm md:text-base bg-slate-50 p-2 rounded border">{selectedOrder.customerAddress || "-"}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-slate-500">Email</p>
                  <p className="font-medium text-sm md:text-base break-all">{selectedOrder.email || "-"}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-slate-500">Date</p>
                  <p className="font-medium text-sm md:text-base">
                    {selectedOrder.createdAt.toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs md:text-sm text-slate-500 mb-2">Items</p>
                <div className="bg-slate-50 rounded-lg p-3 space-y-2 max-h-[200px] overflow-y-auto">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="break-words flex-1 pr-2">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-medium whitespace-nowrap">DA {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 flex justify-between font-bold text-sm">
                    <span>Total</span>
                    <span>DA {selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs md:text-sm text-slate-500 mb-2">Update Status</p>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(val) => updateStatus(selectedOrder.id, val)}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs md:text-sm">Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes for this order..."
                  className="text-sm min-h-[80px]"
                />
                <Button onClick={updateNotes} size="sm" className="mt-2 w-full md:w-auto">
                  Save Notes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

export default function Orders() {
  return (
    <RequireRole allowedRoles={["admin", "staff_a"]}>
      <OrdersContent />
    </RequireRole>
  );
}
