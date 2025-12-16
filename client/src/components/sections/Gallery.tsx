import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const images = [
  "https://images.unsplash.com/photo-1559715745-e1b33a271c8f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1626237517686-21800cc42a2d?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1481671703460-040cb8a2d909?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&q=80&w=800",
];

export default function Gallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current || !triggerRef.current) return;
      
      const totalWidth = containerRef.current.scrollWidth - containerRef.current.offsetWidth;
      
      gsap.to(containerRef.current, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: `+=${totalWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={triggerRef} id="gallery" className="h-screen bg-foreground text-background overflow-hidden flex flex-col justify-center relative">
      <div className="absolute top-10 left-6 md:left-20 z-10">
        <h2 className="text-5xl font-serif font-bold text-white">The Experience</h2>
        <p className="text-white/60 mt-2">A visual journey through taste.</p>
      </div>

      <div ref={containerRef} className="flex gap-10 pl-6 md:pl-20 items-center h-[60vh]">
        {images.map((src, i) => (
          <div key={i} className="flex-shrink-0 relative w-[400px] h-[500px] rounded-lg overflow-hidden group">
            <img 
              src={src} 
              alt={`Gallery ${i}`} 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 border border-white/10 pointer-events-none" />
          </div>
        ))}
        {/* End Spacer */}
        <div className="w-[10vw] flex-shrink-0" />
      </div>
    </section>
  );
}
