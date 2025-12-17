import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, TrendingUp, Package } from "lucide-react";
import { orderService, menuService, type Order, type MenuItem } from "@/lib/firebase";

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubOrders = orderService.subscribe(setOrders);
    const unsubMenu = menuService.subscribe(setMenuItems);
    setLoading(false);
    return () => {
      unsubOrders();
      unsubMenu();
    };
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  
  const ordersByStatus = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const popularItems = orders.flatMap(order => order.items)
    .reduce((acc, item) => {
      const existing = acc.find(i => i.menuItemId === item.menuItemId);
      if (existing) {
        existing.totalQuantity += item.quantity;
        existing.totalRevenue += item.price * item.quantity;
      } else {
        acc.push({
          menuItemId: item.menuItemId,
          name: item.name,
          totalQuantity: item.quantity,
          totalRevenue: item.price * item.quantity
        });
      }
      return acc;
    }, [] as { menuItemId: string; name: string; totalQuantity: number; totalRevenue: number }[])
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 5);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      value: `DA ${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      title: "Average Order",
      value: `DA ${averageOrderValue.toFixed(2)}`,
      icon: TrendingUp,
      color: "bg-purple-500",
    },
    {
      title: "Pending Orders",
      value: ordersByStatus["pending"] || 0,
      icon: Package,
      color: "bg-orange-500",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">Overview of your creperie performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">{stat.title}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Orders by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(ordersByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="capitalize text-slate-600">{status.replace("_", " ")}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
                {Object.keys(ordersByStatus).length === 0 && (
                  <p className="text-slate-500 text-center py-4">No orders yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {popularItems.map((item, index) => (
                  <div key={item.menuItemId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-slate-700">{item.name}</span>
                    </div>
                    <span className="text-sm text-slate-500">{item.totalQuantity} sold</span>
                  </div>
                ))}
                {popularItems.length === 0 && (
                  <p className="text-slate-500 text-center py-4">No sales data yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
