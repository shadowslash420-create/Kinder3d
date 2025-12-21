import { useEffect, useRef, ReactNode, memo } from 'react';
import { gsap } from 'gsap';

interface GridMotionProps {
  items?: (string | ReactNode)[];
  gradientColor?: string;
}

const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;

const GridMotion = memo(({ items = [], gradientColor = '#4A3728' }: GridMotionProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouseXRef = useRef(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);

  const totalItems = 28;
  const defaultItems = Array.from({ length: totalItems }, (_, index) => `Item ${index + 1}`);
  const combinedItems = items.length > 0 ? items.slice(0, totalItems) : defaultItems;

  useEffect(() => {
    // Disable animations on mobile for performance
    if (isMobileDevice) return;
    
    gsap.ticker.lagSmoothing(0);

    const handleMouseMove = (e: MouseEvent) => {
      mouseXRef.current = e.clientX;
    };

    const updateMotion = () => {
      const maxMoveAmount = 300;
      const baseDuration = 0.8;
      const inertiaFactors = [0.6, 0.4, 0.3, 0.2];

      rowRefs.current.forEach((row, index) => {
        if (row) {
          const direction = index % 2 === 0 ? 1 : -1;
          const moveAmount = ((mouseXRef.current / window.innerWidth) * maxMoveAmount - maxMoveAmount / 2) * direction;

          gsap.to(row, {
            x: moveAmount,
            duration: baseDuration + inertiaFactors[index % inertiaFactors.length],
            ease: 'power3.out',
            overwrite: 'auto'
          });
        }
      });
    };

    const removeAnimationLoop = gsap.ticker.add(updateMotion);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      gsap.ticker.remove(updateMotion);
    };
  }, []);

  return (
    <div className="h-full w-full overflow-hidden" ref={gridRef}>
      <section
        className="w-full h-full overflow-hidden relative flex items-center justify-center"
        style={{
          background: `radial-gradient(circle, ${gradientColor} 0%, transparent 100%)`
        }}
      >
        <div 
          className="relative flex-none grid gap-4 z-[2]"
          style={{
            width: '150vw',
            height: '150vh',
            gridTemplateRows: 'repeat(4, 1fr)',
            gridTemplateColumns: '100%',
            transform: 'rotate(-15deg)',
            transformOrigin: 'center center'
          }}
        >
          {[...Array(4)].map((_, rowIndex) => (
            <div 
              key={rowIndex} 
              className="grid gap-4"
              style={{ 
                gridTemplateColumns: 'repeat(7, 1fr)',
                willChange: 'transform, filter'
              }}
              ref={el => { rowRefs.current[rowIndex] = el; }}
            >
              {[...Array(7)].map((_, itemIndex) => {
                const content = combinedItems[rowIndex * 7 + itemIndex];
                return (
                  <div key={itemIndex} className="relative">
                    <div 
                      className="relative w-full h-full overflow-hidden rounded-lg flex items-center justify-center text-white text-xl"
                      style={{ backgroundColor: 'rgba(74, 55, 40, 0.3)' }}
                    >
                      {typeof content === 'string' && content.startsWith('http') ? (
                        <div
                          className="w-full h-full absolute top-0 left-0 bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${content})`
                          }}
                        />
                      ) : typeof content === 'string' && content.startsWith('/') ? (
                        <div
                          className="w-full h-full absolute top-0 left-0 bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${content})`
                          }}
                        />
                      ) : (
                        <div className="p-4 text-center z-[1]">{content}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
});

GridMotion.displayName = 'GridMotion';

export default GridMotion;
