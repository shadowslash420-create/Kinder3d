import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, TrendingUp, Package } from "lucide-react";

interface Analytics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Record<string, number>;
  revenueByDay: { date: string; revenue: number }[];
}

interface PopularItem {
  menuItemId: string;
  name: string;
  totalQuantity: number;
  totalRevenue: number;
}

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [popularItems, setPopularItems] = useState<PopularItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/analytics").then((r) => r.json()),
      fetch("/api/admin/popular-items?limit=5").then((r) => r.json()),
    ])
      .then(([analyticsData, itemsData]) => {
        setAnalytics(analyticsData);
        setPopularItems(itemsData);
      })
      .finally(() => setLoading(false));
  }, []);

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
      value: `DA ${analytics?.totalRevenue.toFixed(2) || "0.00"}`,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Total Orders",
      value: analytics?.totalOrders || 0,
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      title: "Average Order",
      value: `DA ${analytics?.averageOrderValue.toFixed(2) || "0.00"}`,
      icon: TrendingUp,
      color: "bg-purple-500",
    },
    {
      title: "Pending Orders",
      value: analytics?.ordersByStatus?.pending || 0,
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
                {Object.entries(analytics?.ordersByStatus || {}).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="capitalize text-slate-600">{status}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
                {Object.keys(analytics?.ordersByStatus || {}).length === 0 && (
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

        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics?.revenueByDay && analytics.revenueByDay.length > 0 ? (
              <div className="h-64 flex items-end gap-2">
                {analytics.revenueByDay.slice(-14).map((day) => {
                  const maxRevenue = Math.max(...analytics.revenueByDay.map((d) => d.revenue));
                  const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-red-500 rounded-t"
                        style={{ height: `${Math.max(height, 4)}%` }}
                        title={`DA ${day.revenue.toFixed(2)}`}
                      />
                      <span className="text-xs text-slate-500 rotate-45 origin-left">
                        {new Date(day.date).toLocaleDateString("en", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-12">No revenue data yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
