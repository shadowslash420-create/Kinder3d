import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Package, Clock, AlertCircle, CheckCircle } from "lucide-react";

export default function StaffA() {
  const [, setLocation] = useLocation();
  const { user, role, logout, loading } = useAuth();

  useEffect(() => {
    console.log("StaffA - Current role:", role, "Loading:", loading, "User:", user?.email);
    if (!loading && role !== "staff_a") {
      console.log("Redirecting - role is not staff_a");
      setLocation("/");
    }
  }, [role, setLocation, loading]);

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Staff A - Orders Management</h1>
          <div className="flex gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/")}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Orders Dashboard</h2>
          <p className="text-gray-600 mb-8">
            Welcome, <span className="font-semibold">{user?.email}</span>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex items-center gap-4">
                <Package className="w-12 h-12 opacity-80" />
                <div>
                  <h3 className="text-xl font-bold mb-1">Pending Orders</h3>
                  <p className="text-sm opacity-90">12 orders awaiting processing</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex items-center gap-4">
                <Clock className="w-12 h-12 opacity-80" />
                <div>
                  <h3 className="text-xl font-bold mb-1">In Progress</h3>
                  <p className="text-sm opacity-90">5 orders being prepared</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-12 h-12 opacity-80" />
                <div>
                  <h3 className="text-xl font-bold mb-1">Ready for Pickup</h3>
                  <p className="text-sm opacity-90">8 orders completed</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex items-center gap-4">
                <AlertCircle className="w-12 h-12 opacity-80" />
                <div>
                  <h3 className="text-xl font-bold mb-1">Issues</h3>
                  <p className="text-sm opacity-90">2 orders need attention</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 rounded p-4">
            <p className="text-blue-800">
              <strong>Your Role:</strong> You are responsible for managing all customer orders. Monitor pending orders, track preparation progress, and ensure timely delivery of completed orders.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
