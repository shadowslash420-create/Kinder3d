import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Home, MessageSquare, Star, CheckCircle, Clock } from "lucide-react";

export default function StaffB() {
  const [, setLocation] = useLocation();
  const { user, role, logout, loading } = useAuth();

  useEffect(() => {
    console.log("StaffB - Current role:", role, "Loading:", loading, "User:", user?.email);
    if (!loading && role !== "staff_b") {
      console.log("Redirecting - role is not staff_b");
      setLocation("/");
    }
  }, [role, setLocation, loading]);

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-amber-600">Staff B - Messages & Reviews</h1>
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
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Communications Dashboard</h2>
          <p className="text-gray-600 mb-8">
            Welcome, <span className="font-semibold">{user?.email}</span>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex items-center gap-4">
                <MessageSquare className="w-12 h-12 opacity-80" />
                <div>
                  <h3 className="text-xl font-bold mb-1">New Messages</h3>
                  <p className="text-sm opacity-90">7 unread customer messages</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex items-center gap-4">
                <Clock className="w-12 h-12 opacity-80" />
                <div>
                  <h3 className="text-xl font-bold mb-1">Pending Reviews</h3>
                  <p className="text-sm opacity-90">4 reviews awaiting approval</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex items-center gap-4">
                <Star className="w-12 h-12 opacity-80" />
                <div>
                  <h3 className="text-xl font-bold mb-1">Published Reviews</h3>
                  <p className="text-sm opacity-90">42 approved customer reviews</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-rose-500 to-rose-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-12 h-12 opacity-80" />
                <div>
                  <h3 className="text-xl font-bold mb-1">Replied Messages</h3>
                  <p className="text-sm opacity-90">89 messages responded to</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 rounded p-4">
            <p className="text-amber-800">
              <strong>Your Role:</strong> You are responsible for managing customer messages and reviews. Respond to inquiries promptly, moderate and approve reviews, and maintain positive customer engagement.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
