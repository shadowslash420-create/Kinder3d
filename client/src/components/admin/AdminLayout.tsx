import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard, ShoppingCart, UtensilsCrossed, FolderOpen,
  LogOut, Menu, X, ChevronRight
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [admin, setAdmin] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then(setAdmin)
      .catch(() => setLocation("/admin"));
  }, [setLocation]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    toast({ title: "Logged out", description: "You have been logged out successfully." });
    setLocation("/admin");
  };

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { path: "/admin/menu", label: "Menu Items", icon: UtensilsCrossed },
    { path: "/admin/categories", label: "Categories", icon: FolderOpen },
  ];

  if (!admin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-slate-900 text-white transition-all duration-300 flex flex-col fixed h-full z-40`}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-700">
          {sidebarOpen && <span className="font-bold text-lg">Creperie Admin</span>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-slate-800"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    isActive
                      ? "bg-red-500 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                  {sidebarOpen && isActive && (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          {sidebarOpen && (
            <div className="mb-3">
              <p className="font-medium text-sm">{admin.name}</p>
              <p className="text-xs text-slate-400">{admin.email}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size={sidebarOpen ? "default" : "icon"}
            onClick={handleLogout}
            className="w-full text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>

      <main className={`flex-1 ${sidebarOpen ? "ml-64" : "ml-16"} transition-all duration-300`}>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
