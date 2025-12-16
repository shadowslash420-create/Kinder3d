import { useEffect, useRef } from 'react';
import { useMotionValue } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export default function ChocolateBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const particles = useRef<Particle[]>([]);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize particles
    particles.current = [];
    const particleCount = 80;
    for (let i = 0; i < particleCount; i++) {
      particles.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 8 + 3,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    function animate(mouseXVal: number, mouseYVal: number) {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      // Draw gradient background
      const gradient = ctx!.createLinearGradient(0, 0, canvas!.width, canvas!.height);
      gradient.addColorStop(0, '#FDFBF7');
      gradient.addColorStop(0.5, '#FFF8F0');
      gradient.addColorStop(1, '#F5EADE');
      ctx!.fillStyle = gradient;
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      // Attraction point (center or mouse position)
      const attractX = mouseXVal || centerX;
      const attractY = mouseYVal || centerY;

      particles.current.forEach((particle) => {
        // Calculate direction to attraction point
        const dx = attractX - particle.x;
        const dy = attractY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Gravitational pull strength
        const pullStrength = 0.15;
        const maxDistance = 400;

        if (distance < maxDistance) {
          const force = (1 - distance / maxDistance) * pullStrength;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }

        // Apply friction
        particle.vx *= 0.95;
        particle.vy *= 0.95;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x - particle.size < 0) {
          particle.x = particle.size;
          particle.vx *= -0.5;
        }
        if (particle.x + particle.size > canvas!.width) {
          particle.x = canvas!.width - particle.size;
          particle.vx *= -0.5;
        }
        if (particle.y - particle.size < 0) {
          particle.y = particle.size;
          particle.vy *= -0.5;
        }
        if (particle.y + particle.size > canvas!.height) {
          particle.y = canvas!.height - particle.size;
          particle.vy *= -0.5;
        }

        // Draw chocolate particle
        ctx!.fillStyle = `rgba(139, 69, 19, ${particle.opacity * 0.8})`;
        ctx!.beginPath();
        ctx!.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx!.fill();

        // Inner highlight
        ctx!.fillStyle = `rgba(210, 140, 70, ${particle.opacity * 0.4})`;
        ctx!.beginPath();
        ctx!.arc(particle.x - particle.size * 0.3, particle.y - particle.size * 0.3, particle.size * 0.4, 0, Math.PI * 2);
        ctx!.fill();
      });
    }

    function handleMouseMove(e: MouseEvent) {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    }

    function handleScroll() {
      // Add slight scroll-based effect
      const scrollY = window.scrollY;
      mouseY.set(window.innerHeight / 2 + scrollY * 0.1);
    }

    function loop() {
      animate(mouseX.get(), mouseY.get());
      animationIdRef.current = requestAnimationFrame(loop);
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    loop();

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [mouseX, mouseY]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-screen z-0 pointer-events-none"
      style={{ top: 0, left: 0 }}
    />
  );
}
