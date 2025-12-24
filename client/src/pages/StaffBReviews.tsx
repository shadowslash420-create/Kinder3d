import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, Trash2, Star, Crown, LogOut, Home, ArrowLeft } from "lucide-react";
import { reviewService, type Review } from "@/lib/firebase";

export default function StaffBReviews() {
  const [, setLocation] = useLocation();
  const { user, role, logout, loading } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading && role !== "staff_b") {
      setLocation("/");
    }
  }, [role, setLocation, loading]);

  useEffect(() => {
    const unsubscribe = reviewService.subscribe((data) => {
      setReviews(data);
      setPageLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await reviewService.approve(id);
      toast({ title: "Success", description: "Review approved" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to approve review", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await reviewService.delete(id);
      toast({ title: "Success", description: "Review deleted" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete review", variant: "destructive" });
    }
  };

  const handleSetTopRated = async (id: string, isCurrentlyTopRated: boolean) => {
    try {
      await reviewService.setTopRated(id, !isCurrentlyTopRated);
      toast({ 
        title: "Success", 
        description: isCurrentlyTopRated ? "Removed from top rated" : "Set as top rated review" 
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update review", variant: "destructive" });
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/staff-b")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-amber-600">Staff B - Reviews</h1>
          </div>
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
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Customer Reviews</h2>
            <p className="text-slate-600">Manage and approve customer reviews</p>
          </div>

          {pageLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-slate-500">
                No reviews yet
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="font-semibold">{review.userName}</span>
                          {renderStars(review.rating)}
                          <Badge className={review.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                            {review.isApproved ? "Approved" : "Pending"}
                          </Badge>
                          {review.isTopRated && (
                            <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
                              <Crown className="h-3 w-3" /> Top Rated
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 mb-2">{review.email}</p>
                        <p className="text-slate-700">{review.comment}</p>
                        <p className="text-xs text-slate-400 mt-2">
                          {review.createdAt.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {!review.isApproved && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(review.id)}
                            className="text-green-600 hover:text-green-700"
                            title="Approve review"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        {review.isApproved && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetTopRated(review.id, review.isTopRated || false)}
                            className={review.isTopRated ? "text-purple-600 hover:text-purple-700" : "text-gray-600 hover:text-gray-700"}
                            title={review.isTopRated ? "Remove from top rated" : "Set as top rated"}
                          >
                            <Crown className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(review.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete review"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
