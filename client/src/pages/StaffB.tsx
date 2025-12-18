import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Home } from "lucide-react";

export default function StaffB() {
  const [, setLocation] = useLocation();
  const { user, role, logout } = useAuth();

  useEffect(() => {
    if (role !== "staff_b") {
      setLocation("/");
    }
  }, [role, setLocation]);

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-amber-600">Staff B Dashboard</h1>
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
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Welcome, Staff B</h2>
          <p className="text-gray-600 mb-6">
            Email: <span className="font-semibold">{user?.email}</span>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2">Inventory</h3>
              <p className="text-sm opacity-90">Manage kitchen inventory and supplies</p>
            </div>
            
            <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2">Quality Control</h3>
              <p className="text-sm opacity-90">Ensure product quality standards</p>
            </div>

            <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2">Staff Notes</h3>
              <p className="text-sm opacity-90">Leave and read staff notes</p>
            </div>

            <div className="bg-gradient-to-br from-rose-500 to-rose-600 text-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2">Shifts</h3>
              <p className="text-sm opacity-90">Manage your shift information</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-amber-50 border-l-4 border-amber-500 rounded">
            <p className="text-amber-800">
              ℹ️ This is your Staff B workspace. You have access to staff-specific features and data.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
