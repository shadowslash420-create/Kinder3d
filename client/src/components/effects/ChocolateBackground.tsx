import { useEffect, useRef } from 'react';
import { useMotionValue } from 'framer-motion';
import heroBg from "@assets/generated_images/luxury_chocolate_swirl_background.png";

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
  const imageRef = useRef<HTMLImageElement | null>(null);
  const imageLoadedRef = useRef(false);

  useEffect(() => {
    // Preload image
    const img = new Image();
    img.src = heroBg;
    img.onload = () => {
      imageLoadedRef.current = true;
      imageRef.current = img;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize particles
    particles.current = [];
    const particleCount = 60;
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

    function drawDistortedImage(mouseXVal: number, mouseYVal: number) {
      const attractX = mouseXVal || centerX;
      const attractY = mouseYVal || centerY;

      if (!imageRef.current || !imageLoadedRef.current) {
        // Fallback gradient if image not loaded
        const gradient = ctx!.createLinearGradient(0, 0, canvas!.width, canvas!.height);
        gradient.addColorStop(0, '#FDFBF7');
        gradient.addColorStop(0.5, '#FFF8F0');
        gradient.addColorStop(1, '#F5EADE');
        ctx!.fillStyle = gradient;
        ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
        return;
      }

      // Draw base background
      const gradient = ctx!.createLinearGradient(0, 0, canvas!.width, canvas!.height);
      gradient.addColorStop(0, '#FDFBF7');
      gradient.addColorStop(0.5, '#FFF8F0');
      gradient.addColorStop(1, '#F5EADE');
      ctx!.fillStyle = gradient;
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      // Draw image with distortion vortex effect
      const imageWidth = imageRef.current.width;
      const imageHeight = imageRef.current.height;
      const scale = Math.max(canvas!.width / imageWidth, canvas!.height / imageHeight) * 1.1;

      const imgX = (canvas!.width - imageWidth * scale) / 2;
      const imgY = (canvas!.height - imageHeight * scale) / 2;

      // Create clipping region for vortex
      ctx!.save();
      
      // Draw the distorted image with a vortex pulling effect
      const pixelData = ctx!.getImageData(0, 0, canvas!.width, canvas!.height);
      const data = pixelData.data;

      // Draw image normally first
      ctx!.globalAlpha = 0.6;
      ctx!.drawImage(imageRef.current, imgX, imgY, imageWidth * scale, imageHeight * scale);
      ctx!.globalAlpha = 1;

      // Apply vortex distortion overlay
      const vortexRadius = 300;
      const vortexStrength = 0.8;

      for (let i = 0; i < data.length; i += 4) {
        const pixelIndex = i / 4;
        const pixelX = pixelIndex % canvas!.width;
        const pixelY = Math.floor(pixelIndex / canvas!.width);

        const dx = pixelX - attractX;
        const dy = pixelY - attractY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < vortexRadius) {
          // Create pulling effect
          const pullFactor = (1 - distance / vortexRadius) * vortexStrength;
          
          // Sample from offset position to create vortex
          const sampleX = Math.floor(pixelX + (dx * pullFactor * 0.5));
          const sampleY = Math.floor(pixelY + (dy * pullFactor * 0.5));

          if (sampleX >= 0 && sampleX < canvas!.width && sampleY >= 0 && sampleY < canvas!.height) {
            const sourcePixel = (sampleY * canvas!.width + sampleX) * 4;
            data[i] = data[sourcePixel];
            data[i + 1] = data[sourcePixel + 1];
            data[i + 2] = data[sourcePixel + 2];
            data[i + 3] = Math.floor(data[sourcePixel + 3] * (1 - pullFactor * 0.3));
          }
        }
      }

      ctx!.putImageData(pixelData, 0, 0);
      ctx!.restore();
    }

    function animate(mouseXVal: number, mouseYVal: number) {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      // Draw distorted background image
      drawDistortedImage(mouseXVal, mouseYVal);

      // Attraction point
      const attractX = mouseXVal || centerX;
      const attractY = mouseYVal || centerY;

      particles.current.forEach((particle) => {
        const dx = attractX - particle.x;
        const dy = attractY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const pullStrength = 0.15;
        const maxDistance = 400;

        if (distance < maxDistance) {
          const force = (1 - distance / maxDistance) * pullStrength;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }

        particle.vx *= 0.95;
        particle.vy *= 0.95;

        particle.x += particle.vx;
        particle.y += particle.vy;

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

        ctx!.fillStyle = `rgba(139, 69, 19, ${particle.opacity * 0.8})`;
        ctx!.beginPath();
        ctx!.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx!.fill();

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
