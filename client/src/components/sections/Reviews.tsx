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
    <section className="py-20 overflow-hidden bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-amber-700 font-bold tracking-[0.2em] text-xs uppercase mb-4 block">
            Guest Testimonials
          </span>
          <h2 className="text-5xl md:text-6xl font-serif font-light text-amber-900 mb-2">
            Celebrated by Our Patrons
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-8 bg-amber-700"></div>
            <span className="text-amber-700 text-sm">Refined Dining Experiences</span>
            <div className="h-px w-8 bg-amber-700"></div>
          </div>
        </motion.div>

        {/* Top Rated Review Section */}
        {topRatedReview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 max-w-2xl mx-auto"
          >
            <div className="relative">
              <div className="absolute -top-6 -left-4 text-6xl text-amber-200 opacity-30 font-serif">"</div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-700 rounded-2xl p-10 shadow-2xl text-center">
                <h3 className="text-amber-900 font-serif text-xl tracking-wider mb-6">✦ Featured Review ✦</h3>
                <div className="flex justify-center gap-2 mb-6">
                  {[...Array(topRatedReview.rating)].map((_, i) => (
                    <Star key={i} size={22} className="fill-amber-600 text-amber-600" />
                  ))}
                </div>
                <p className="text-lg text-amber-950 italic font-light mb-6 leading-relaxed">"{topRatedReview.comment}"</p>
                <div className="border-t border-amber-700 pt-4">
                  <p className="text-sm font-serif text-amber-900">— {topRatedReview.userName}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Elegant Marquee Section */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 py-8 my-12 shadow-lg">
        <div className="marquee">
          <div className="marquee__inner">
            <div className="marquee__group">
              {displayReviews.map((review) => (
                <span key={review.id} className="marquee__item">
                  <span className="text-amber-300 mr-2">{review.emoji}</span>
                  <span className="text-amber-50">"{review.text}"</span>
                  <span className="text-amber-400 mx-2">—</span>
                  <span className="text-amber-200 font-light">{review.author}</span>
                </span>
              ))}
            </div>
            <div className="marquee__group">
              {displayReviews.map((review) => (
                <span key={`dup-${review.id}`} className="marquee__item">
                  <span className="text-amber-300 mr-2">{review.emoji}</span>
                  <span className="text-amber-50">"{review.text}"</span>
                  <span className="text-amber-400 mx-2">—</span>
                  <span className="text-amber-200 font-light">{review.author}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Review Form Section */}
      <div className="container mx-auto px-6 mt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative">
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <div className="flex gap-2 text-2xl text-amber-700">
                <span>✦</span>
                <span>✦</span>
                <span>✦</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 border-2 border-amber-700 rounded-2xl shadow-2xl p-10">
              <h3 className="text-3xl font-serif font-light text-amber-900 mb-2 text-center">Share Your Delight</h3>
              <p className="text-sm text-amber-800 text-center mb-8 font-light">Let us know about your refined experience</p>
              
              <form onSubmit={handleSubmitReview} className="space-y-5">
                <div>
                  <label className="block text-sm font-serif text-amber-900 mb-2 tracking-wide">Your Name</label>
                  <input
                    type="text"
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border-2 border-amber-700 bg-white text-amber-950 placeholder-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-amber-50 transition-colors"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-serif text-amber-900 mb-2 tracking-wide">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border-2 border-amber-700 bg-white text-amber-950 placeholder-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-amber-50 transition-colors"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-serif text-amber-900 mb-3 tracking-wide">Your Rating</label>
                  <div className="flex gap-3 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="transition-all duration-200 hover:scale-125 active:scale-95"
                        disabled={submitting}
                      >
                        <Star
                          size={32}
                          className={star <= formData.rating ? "fill-amber-600 text-amber-600" : "text-amber-300"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-serif text-amber-900 mb-2 tracking-wide">Your Review</label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Tell us about your experience..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-amber-700 bg-white text-amber-950 placeholder-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-amber-50 transition-colors resize-none"
                    disabled={submitting}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 disabled:from-gray-400 disabled:to-gray-500 text-amber-50 font-serif font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl border border-amber-900"
                >
                  {submitting ? "Submitting..." : "Submit Your Review"}
                </button>
              </form>
            </div>
          </div>
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
          animation: marquee 35s linear infinite;
        }

        .marquee__group {
          display: flex;
        }

        .marquee__item {
          margin: 0 2rem;
          white-space: nowrap;
          padding: 12px 24px;
          font-size: 0.95rem;
          font-weight: 400;
          letter-spacing: 0.03em;
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
