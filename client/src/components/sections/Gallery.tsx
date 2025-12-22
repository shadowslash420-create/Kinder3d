import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import cafeInterior from "@assets/stock_images/luxury_modern_cafe_i_6f8b323a.jpg";

gsap.registerPlugin(ScrollTrigger);

const images = [
  "https://images.unsplash.com/photo-1559715745-e1b33a271c8f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1626237517686-21800cc42a2d?auto=format&fit=crop&q=80&w=800",
  cafeInterior,
  "https://images.unsplash.com/photo-1481671703460-040cb8a2d909?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&q=80&w=800",
];

export default function Gallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current || !triggerRef.current) return;
      
      const cards = gsap.utils.toArray(".gallery-item");
      const totalWidth = containerRef.current.scrollWidth - containerRef.current.offsetWidth;
      
      gsap.to(containerRef.current, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: `+=${totalWidth}`,
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          fastScrollEnd: true,
        }
      });
      
      // Parallax effect on images inside cards
      cards.forEach((card: any, i) => {
        gsap.to(card.querySelector("img"), {
          scale: 1.2,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            containerAnimation: gsap.getById("galleryScroll"), 
            start: "left right",
            end: "right left",
            scrub: true,
          }
        });
      });

    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={triggerRef} id="gallery" className="h-screen bg-[#0f0202] text-white overflow-hidden flex flex-col justify-center relative">
      <div className="absolute top-8 sm:top-12 left-4 sm:left-6 md:left-24 z-10 max-w-lg px-2 sm:px-0">
        <span className="text-primary font-bold tracking-[0.15em] sm:tracking-[0.2em] text-xs uppercase mb-2 sm:mb-4 block">The Gallery</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-medium leading-tight">Visual <br/> Symphony</h2>
      </div>

      <div ref={containerRef} className="flex gap-6 sm:gap-10 md:gap-16 pl-4 sm:pl-6 md:pl-24 items-center h-[50vh] sm:h-[55vh] md:h-[60vh] mt-16 sm:mt-20">
        {images.map((src, i) => (
          <div key={i} className="gallery-item flex-shrink-0 relative w-[70vw] sm:w-[45vw] md:w-[30vw] min-w-[250px] sm:min-w-[280px] md:min-w-[300px] h-[40vh] sm:h-[45vh] md:h-[50vh] rounded-sm overflow-hidden group">
            <img 
              src={src} 
              alt={`Gallery ${i}`} 
              className="w-full h-full object-cover transition-all duration-700"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
          </div>
        ))}
        {/* End Spacer */}
        <div className="w-[10vw] flex-shrink-0" />
      </div>
      
      <div className="absolute bottom-6 sm:bottom-12 right-4 sm:right-12 md:right-24 hidden sm:flex gap-4 items-center text-white/30 text-xs sm:text-sm tracking-widest uppercase">
         <span>Scroll to Discover</span>
         <div className="w-12 sm:w-16 h-px bg-white/30" />
      </div>
    </section>
  );
}
