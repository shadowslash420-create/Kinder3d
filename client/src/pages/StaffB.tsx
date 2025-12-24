import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut, Home, MessageSquare, Star, CheckCircle, Clock } from "lucide-react";
import { contactService, reviewService } from "@/lib/firebase";

export default function StaffB() {
  const [, setLocation] = useLocation();
  const { user, role, logout, loading } = useAuth();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [pendingReviews, setPendingReviews] = useState(0);
  const [approvedReviews, setApprovedReviews] = useState(0);

  useEffect(() => {
    console.log("StaffB - Current role:", role, "Loading:", loading, "User:", user?.email);
    if (!loading && role !== "staff_b") {
      console.log("Redirecting - role is not staff_b");
      setLocation("/");
    }
  }, [role, setLocation, loading]);

  useEffect(() => {
    const unsubMessages = contactService.subscribe((data) => {
      setUnreadMessages(data.filter((msg) => !msg.isRead).length);
    });
    return () => unsubMessages();
  }, []);

  useEffect(() => {
    const unsubReviews = reviewService.subscribe((data) => {
      setPendingReviews(data.filter((r) => !r.isApproved).length);
      setApprovedReviews(data.filter((r) => r.isApproved).length);
    });
    return () => unsubReviews();
  }, []);

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
        <div className="w-12 h-12 border-3 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Communications Dashboard</h2>
            <p className="text-gray-600">
              Welcome, <span className="font-semibold">{user?.email}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              className="cursor-pointer hover:shadow-lg transition bg-gradient-to-br from-amber-500 to-amber-600 border-0"
              onClick={() => setLocation("/staff-b/messages")}
            >
              <CardContent className="p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <MessageSquare className="w-12 h-12 opacity-80" />
                    <div>
                      <h3 className="text-xl font-bold mb-1">Messages</h3>
                      <p className="text-sm opacity-90">{unreadMessages} unread messages</p>
                    </div>
                  </div>
                  <Button 
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation("/staff-b/messages");
                    }}
                  >
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition bg-gradient-to-br from-yellow-500 to-yellow-600 border-0"
              onClick={() => setLocation("/staff-b/reviews")}
            >
              <CardContent className="p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Clock className="w-12 h-12 opacity-80" />
                    <div>
                      <h3 className="text-xl font-bold mb-1">Pending Reviews</h3>
                      <p className="text-sm opacity-90">{pendingReviews} awaiting approval</p>
                    </div>
                  </div>
                  <Button 
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation("/staff-b/reviews");
                    }}
                  >
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-500 to-pink-600 border-0">
              <CardContent className="p-6 text-white">
                <div className="flex items-center gap-4">
                  <Star className="w-12 h-12 opacity-80" />
                  <div>
                    <h3 className="text-xl font-bold mb-1">Approved Reviews</h3>
                    <p className="text-sm opacity-90">{approvedReviews} published reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-rose-500 to-rose-600 border-0">
              <CardContent className="p-6 text-white">
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-12 h-12 opacity-80" />
                  <div>
                    <h3 className="text-xl font-bold mb-1">Your Role</h3>
                    <p className="text-sm opacity-90">Manage messages and reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-amber-50 border-l-4 border-amber-500">
            <CardContent className="p-6">
              <p className="text-amber-800">
                <strong>Your Responsibilities:</strong> Respond to customer inquiries promptly, review and approve customer feedback, and maintain positive customer engagement. Click "Manage" on the cards above to perform actions.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
