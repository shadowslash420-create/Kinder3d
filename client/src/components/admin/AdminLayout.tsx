import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { auth, onAuthStateChanged, getUserRole, logOut, type UserRole } from "@/lib/firebase";
import {
  LayoutDashboard, ShoppingCart, UtensilsCrossed, FolderOpen,
  LogOut, Menu, X, ChevronRight, MessageSquare, Star, Users
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setLocation("/admin");
        return;
      }
      
      const userRole = await getUserRole(firebaseUser);
      if (userRole !== "admin" && userRole !== "staff_a" && userRole !== "staff_b") {
        setLocation("/admin");
        return;
      }
      
      setUser({ 
        name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
        email: firebaseUser.email || ""
      });
      setRole(userRole);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [setLocation]);

  const handleLogout = async () => {
    await logOut();
    toast({ title: "Logged out", description: "You have been logged out successfully." });
    setLocation("/admin");
  };

  const isAdmin = role === "admin";
  const isStaffA = role === "staff_a";
  const isStaffB = role === "staff_b";

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, visible: isAdmin },
    { path: "/admin/orders", label: "Orders", icon: ShoppingCart, visible: isAdmin || isStaffA },
    { path: "/admin/menu", label: "Menu Items", icon: UtensilsCrossed, visible: isAdmin },
    { path: "/admin/categories", label: "Categories", icon: FolderOpen, visible: isAdmin },
    { path: "/admin/reviews", label: "Reviews", icon: Star, visible: isAdmin || isStaffB },
    { path: "/admin/messages", label: "Messages", icon: MessageSquare, visible: isAdmin || isStaffB },
    { path: "/admin/staff", label: "Staff", icon: Users, visible: isAdmin },
  ].filter(item => item.visible);

  if (loading) {
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
          {sidebarOpen && user && (
            <div className="mb-3">
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-xs text-slate-400">{user.email}</p>
              <p className="text-xs text-red-400 capitalize mt-1">
                {role?.replace("_", " ")}
              </p>
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
