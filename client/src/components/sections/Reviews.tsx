import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { reviewService, type Review } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";

const ratingEmojis: Record<number, string> = {
  1: "😞",
  2: "😕",
  3: "😐",
  4: "😊",
  5: "🤩"
};

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    rating: 5,
    comment: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = reviewService.subscribeToApproved((data) => {
      console.log("Approved reviews loaded:", data);
      setReviews(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        userName: user.displayName || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.userName.trim() || !formData.email.trim() || !formData.comment.trim()) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      await reviewService.create({
        userId: user?.uid || "",
        userName: formData.userName,
        email: formData.email,
        rating: formData.rating,
        comment: formData.comment,
        isApproved: false
      });
      
      toast({ title: "Thank you!", description: "Your review has been submitted for approval." });
      setFormData({ userName: "", email: "", rating: 5, comment: "" });
      
      if (user) {
        setFormData(prev => ({
          ...prev,
          userName: user.displayName || "",
          email: user.email || ""
        }));
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // Get top rated review
  const topRatedReview = reviews.find(r => r.isTopRated);

  // Use static fallback reviews if no real reviews exist yet
  const displayReviews = reviews.length > 0 ? reviews.map((review) => ({
    id: review.id,
    text: review.comment,
    author: review.userName || (review as any).customerName || "Anonymous",
    emoji: ratingEmojis[review.rating] || "⭐"
  })) : [
    { id: 1, text: "Best crepes in Batna!", author: "Ahmed K.", emoji: "🔥" },
    { id: 2, text: "Amazing desserts, highly recommend!", author: "Sara M.", emoji: "✨" },
    { id: 3, text: "The Kinder Classic is incredible!", author: "Youcef B.", emoji: "🚀" },
    { id: 4, text: "Perfect place for family outings", author: "Fatima L.", emoji: "🌟" },
    { id: 5, text: "Fresh ingredients, delicious taste!", author: "Mohamed D.", emoji: "🎉" },
    { id: 6, text: "My kids love it here!", author: "Nadia H.", emoji: "❤️" },
    { id: 7, text: "Great service and atmosphere", author: "Karim A.", emoji: "👏" },
    { id: 8, text: "The waffles are to die for!", author: "Lina Z.", emoji: "🧇" },
  ];

  return (
    <section className="py-16 overflow-hidden">
      <div className="container mx-auto px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-4 block">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-medium text-[#bda89d]">
            What Our Guests Say
          </h2>
        </motion.div>

        {/* Top Rated Review Section */}
        {topRatedReview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 max-w-2xl mx-auto"
          >
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-2xl p-8 shadow-lg">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-2xl">👑</span>
                <span className="text-xs font-bold uppercase tracking-widest text-yellow-700">Featured Review</span>
              </div>
              <p className="text-lg font-serif text-slate-800 mb-4 italic">"{topRatedReview.comment}"</p>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[...Array(topRatedReview.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="font-semibold text-slate-700">— {topRatedReview.userName}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <div className="marquee">
        <div className="marquee__inner">
          <div className="marquee__group">
            {displayReviews.map((review) => (
              <span key={review.id} className="marquee__item">
                {review.emoji} "{review.text}" — {review.author}
              </span>
            ))}
          </div>
          <div className="marquee__group">
            {displayReviews.map((review) => (
              <span key={`dup-${review.id}`} className="marquee__item">
                {review.emoji} "{review.text}" — {review.author}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Review Form Section */}
      <div className="container mx-auto px-6 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8"
        >
          <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2 text-center">Share Your Experience</h3>
          <p className="text-sm text-slate-600 text-center mb-6">Help others discover our delicious treats</p>
          
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="transition-transform hover:scale-110"
                    disabled={submitting}
                  >
                    <Star
                      size={28}
                      className={star <= formData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your Review</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                placeholder="Tell us what you think..."
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                disabled={submitting}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </motion.div>
      </div>
      <style>{`
        .marquee {
          overflow: hidden;
          width: 100%;
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
        }

        .marquee__inner {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }

        .marquee__group {
          display: flex;
        }

        .marquee__item {
          margin: 0 1.5rem;
          white-space: nowrap;
          background: #1a1a1a;
          color: white;
          padding: 12px 24px;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee:hover .marquee__inner {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
