import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Home } from "lucide-react";

export default function StaffA() {
  const [, setLocation] = useLocation();
  const { user, role, logout } = useAuth();

  useEffect(() => {
    if (role !== "staff_a") {
      setLocation("/");
    }
  }, [role, setLocation]);

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Staff A Dashboard</h1>
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
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Welcome, Staff A</h2>
          <p className="text-gray-600 mb-6">
            Email: <span className="font-semibold">{user?.email}</span>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2">Orders</h3>
              <p className="text-sm opacity-90">View and manage customer orders</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2">Performance</h3>
              <p className="text-sm opacity-90">Track your performance metrics</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2">Schedule</h3>
              <p className="text-sm opacity-90">View your work schedule</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2">Reports</h3>
              <p className="text-sm opacity-90">Generate and download reports</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-blue-800">
              ℹ️ This is your Staff A workspace. You have access to staff-specific features and data.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
