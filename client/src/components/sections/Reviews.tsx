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
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
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
    <section className="py-24 overflow-hidden relative bg-gradient-to-b from-[#2b0a0a] via-[#1a0505] to-[#0f0202]">
      {/* Background with multiple layered gradients - Dark Chocolate */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2d1810]/40 via-transparent to-[#1a1a1a]/30"></div>
      {!isMobile && (
        <>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#eb2d2d]/10 to-transparent rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#6B4423]/20 to-transparent rounded-full blur-3xl opacity-20"></div>
        </>
      )}
      
      <div className="relative z-10 container mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <span className="text-primary font-bold tracking-[0.3em] text-xs uppercase mb-6 block opacity-90">
            ✧ Guest Testimonials ✧
          </span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light text-white mb-4">
            Celebrated by Our Patrons
          </h2>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary"></div>
            <span className="text-white/70 text-sm font-light tracking-wider">Refined Dining Experiences</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary"></div>
          </div>
        </motion.div>

        {/* Top Rated Review Section */}
        {topRatedReview && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mt-20 max-w-3xl mx-auto"
          >
            <div className="relative">
              <div className="absolute -top-8 -left-6 text-7xl text-stone-300 opacity-25 font-serif">"</div>
              <div className="bg-[#1a0505]/80 backdrop-blur-sm border border-primary/40 rounded-3xl p-12 shadow-2xl text-center overflow-hidden relative shadow-[var(--neon-glow)]">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-40"></div>
                <div className="relative z-10">
                  <h3 className="text-white font-serif text-lg tracking-widest mb-8 font-light">✦ Featured Review ✦</h3>
                  <div className="flex justify-center gap-3 mb-8">
                    {[...Array(topRatedReview.rating)].map((_, i) => (
                      <motion.div key={i} initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: i * 0.1 }}>
                        <Star size={24} className="fill-[#ffb76e] text-[#ffb76e]" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-xl text-white/90 italic font-light mb-8 leading-relaxed max-w-2xl mx-auto">"{topRatedReview.comment}"</p>
                  <div className="border-t border-white/20 pt-6 mt-6">
                    <p className="text-sm font-serif text-white/70 tracking-wide">— {topRatedReview.userName}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Elegant Marquee Section */}
      <div className="relative z-10 my-16 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-900 via-stone-800 via-amber-800 to-amber-900 py-12 shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5"></div>
          <div className="marquee relative z-10">
            <div className="marquee__inner">
              <div className="marquee__group">
                {displayReviews.map((review) => (
                  <span key={review.id} className="marquee__item">
                    <span className="text-amber-100 mr-3 text-lg">{review.emoji}</span>
                    <span className="text-stone-50 font-light">"{review.text}"</span>
                    <span className="text-amber-200 mx-3">•</span>
                    <span className="text-stone-200 font-light italic">{review.author}</span>
                  </span>
                ))}
              </div>
              <div className="marquee__group">
                {displayReviews.map((review) => (
                  <span key={`dup-${review.id}`} className="marquee__item">
                    <span className="text-amber-100 mr-3 text-lg">{review.emoji}</span>
                    <span className="text-stone-50 font-light">"{review.text}"</span>
                    <span className="text-amber-200 mx-3">•</span>
                    <span className="text-stone-200 font-light italic">{review.author}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Form Section */}
      <div className="relative z-10 container mx-auto px-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative">
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex gap-3 text-2xl text-amber-900 opacity-60">
              <span>✦</span>
              <span>✦</span>
              <span>✦</span>
            </div>
            <div className="bg-[#1a0505]/90 border border-primary/40 rounded-3xl shadow-2xl p-12 relative overflow-hidden shadow-[var(--neon-glow)]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-40"></div>
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-serif font-light text-white mb-3 text-center">Share Your Delight</h3>
                <p className="text-white/70 text-center mb-10 font-light tracking-wide">Let us know about your refined experience</p>
                
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  <div>
                    <label className="block text-sm font-serif text-white/80 mb-3 tracking-wider font-light">Your Name</label>
                    <input
                      type="text"
                      value={formData.userName}
                      onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                      placeholder="Enter your name"
                      className="w-full px-5 py-3 border border-primary/30 bg-[#1a0505]/50 text-white placeholder-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-[#1a0505] transition-all duration-300 backdrop-blur-sm"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-serif text-white/80 mb-3 tracking-wider font-light">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full px-5 py-3 border border-primary/30 bg-[#1a0505]/50 text-white placeholder-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-[#1a0505] transition-all duration-300 backdrop-blur-sm"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-serif text-white/80 mb-4 tracking-wider font-light">Your Rating</label>
                    <div className="flex gap-4 justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="transition-all duration-300 hover:scale-125 active:scale-95"
                          disabled={submitting}
                          whileHover={{ rotate: 10 }}
                        >
                          <Star
                            size={36}
                            className={star <= formData.rating ? "fill-gold text-gold drop-shadow-[0_0_8px_rgba(198,155,123,0.5)]" : "text-white/20 drop-shadow"}
                          />
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-serif text-white/80 mb-3 tracking-wider font-light">Your Review</label>
                    <textarea
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      placeholder="Tell us about your experience..."
                      rows={4}
                      className="w-full px-5 py-3 border border-primary/30 bg-[#1a0505]/50 text-white placeholder-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-[#1a0505] transition-all duration-300 resize-none backdrop-blur-sm"
                      disabled={submitting}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-primary via-[#4a0505] to-primary hover:from-[#8a1a1a] hover:to-[#4a0505] disabled:from-gray-600 disabled:to-gray-700 text-white font-serif font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-xl hover:shadow-[var(--neon-glow)] border border-white/5 tracking-wide"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {submitting ? "Submitting..." : "Submit Your Review"}
                  </motion.button>
                </form>
              </div>
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
