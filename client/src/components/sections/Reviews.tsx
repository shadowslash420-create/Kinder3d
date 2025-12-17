import { motion } from "framer-motion";

const reviews = [
  { id: 1, text: "Best crepes in Batna!", author: "Ahmed K.", emoji: "🔥" },
  { id: 2, text: "Amazing desserts, highly recommend!", author: "Sara M.", emoji: "✨" },
  { id: 3, text: "The Kinder Classic is incredible!", author: "Youcef B.", emoji: "🚀" },
  { id: 4, text: "Perfect place for family outings", author: "Fatima L.", emoji: "🌟" },
  { id: 5, text: "Fresh ingredients, delicious taste!", author: "Mohamed D.", emoji: "🎉" },
  { id: 6, text: "My kids love it here!", author: "Nadia H.", emoji: "❤️" },
  { id: 7, text: "Great service and atmosphere", author: "Karim A.", emoji: "👏" },
  { id: 8, text: "The waffles are to die for!", author: "Lina Z.", emoji: "🧇" },
];

export default function Reviews() {
  return (
    <section className="py-16 bg-[#FDFBF7] overflow-hidden">
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
          <h2 className="text-4xl md:text-5xl font-serif font-medium text-foreground">
            What Our Guests Say
          </h2>
        </motion.div>
      </div>

      <div className="marquee">
        <div className="marquee__inner">
          <div className="marquee__group">
            {reviews.map((review) => (
              <span key={review.id} className="marquee__item">
                {review.emoji} "{review.text}" — {review.author}
              </span>
            ))}
          </div>
          <div className="marquee__group">
            {reviews.map((review) => (
              <span key={`dup-${review.id}`} className="marquee__item">
                {review.emoji} "{review.text}" — {review.author}
              </span>
            ))}
          </div>
        </div>
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
