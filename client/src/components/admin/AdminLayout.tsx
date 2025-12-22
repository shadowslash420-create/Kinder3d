import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { auth, onAuthStateChanged, getUserRole, logOut, type UserRole } from "@/lib/firebase";
import {
  LayoutDashboard, ShoppingCart, UtensilsCrossed, FolderOpen,
  LogOut, Menu, X, ChevronRight, MessageSquare, Star, Users, Globe
} from "lucide-react";
import {
  AnimatedSidebar,
  AnimatedSidebarBody,
  DesktopSidebar,
  MobileSidebar,
  SidebarLink,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/animated-sidebar";

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
    { path: "/admin/supplements", label: "Supplements", icon: UtensilsCrossed, visible: isAdmin },
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
    <AnimatedSidebar open={sidebarOpen} setOpen={setSidebarOpen}>
      <div className="min-h-screen bg-slate-50 flex">
        <DesktopSidebar>
          <AnimatedSidebarBody>
            <SidebarHeader>
              <span className="font-bold text-lg">Creperie Admin</span>
            </SidebarHeader>

            <nav className="flex-1 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                return (
                  <SidebarLink
                    key={item.path}
                    icon={<Icon className="h-5 w-5 flex-shrink-0" />}
                    label={item.label}
                    isActive={isActive}
                    onClick={() => setLocation(item.path)}
                  />
                );
              })}
            </nav>

            <SidebarFooter>
              {user && (
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
                size="sm"
                onClick={() => setLocation("/")}
                className="w-full text-slate-300 hover:text-white hover:bg-slate-800 justify-start mb-2"
              >
                <Globe className="h-4 w-4 mr-2" />
                <span>View Website</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full text-slate-300 hover:text-white hover:bg-slate-800 justify-start"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Logout</span>
              </Button>
            </SidebarFooter>
          </AnimatedSidebarBody>
        </DesktopSidebar>

        <MobileSidebar>
          <div className="flex flex-col flex-1">
            <SidebarHeader>
              <span className="font-bold text-lg">Creperie Admin</span>
            </SidebarHeader>

            <nav className="flex-1 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                return (
                  <SidebarLink
                    key={item.path}
                    icon={<Icon className="h-5 w-5 flex-shrink-0" />}
                    label={item.label}
                    isActive={isActive}
                    onClick={() => {
                      setLocation(item.path);
                      setSidebarOpen(false);
                    }}
                  />
                );
              })}
            </nav>

            <div className="border-t border-slate-700 pt-4">
              {user && (
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
                size="sm"
                onClick={() => setLocation("/")}
                className="w-full text-slate-300 hover:text-white hover:bg-slate-800 justify-start mb-2"
              >
                <Globe className="h-4 w-4 mr-2" />
                <span>View Website</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full text-slate-300 hover:text-white hover:bg-slate-800 justify-start"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </MobileSidebar>

        <main className="flex-1 transition-all duration-300 min-w-0">
          <div className="p-3 md:p-6 lg:pl-[300px] overflow-x-hidden min-h-screen">{children}</div>
        </main>
      </div>
    </AnimatedSidebar>
  );
}
