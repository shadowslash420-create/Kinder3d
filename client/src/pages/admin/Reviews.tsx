import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import RequireRole from "@/components/admin/RequireRole";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, Trash2, Star } from "lucide-react";
import { reviewService, type Review } from "@/lib/firebase";
import { TestimonialsSection } from "@/components/ui/testimonials-with-marquee";
import { TestimonialAuthor } from "@/components/ui/testimonial-card";

function ReviewsContent() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = reviewService.subscribe((data) => {
      setReviews(data);
      setLoading(false);
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

  const approvedReviews = reviews.filter((r) => r.isApproved);
  
  const testimonials = approvedReviews.map((review) => {
    const name = review.userName || (review as any).customerName || "Anonymous";
    return {
      author: {
        name,
        handle: review.email || "customer",
        avatar: undefined,
      } as TestimonialAuthor,
      text: review.comment,
    };
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reviews</h1>
          <p className="text-slate-600">Manage customer reviews and feedback</p>
        </div>

        {approvedReviews.length > 0 && (
          <Card>
            <CardContent className="p-0">
              <TestimonialsSection
                title="Customer Reviews"
                description="What our customers are saying"
                testimonials={testimonials}
              />
            </CardContent>
          </Card>
        )}

        <div className="mt-8">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Manage Reviews</h3>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
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
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold">{review.userName}</span>
                          {renderStars(review.rating)}
                          <Badge className={review.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                            {review.isApproved ? "Approved" : "Pending"}
                          </Badge>
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
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(review.id)}
                          className="text-red-600 hover:text-red-700"
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
      </div>
    </AdminLayout>
  );
}

export default function Reviews() {
  return (
    <RequireRole allowedRoles={["admin", "staff_b"]}>
      <ReviewsContent />
    </RequireRole>
  );
}
