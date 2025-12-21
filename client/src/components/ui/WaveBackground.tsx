import { useEffect, useRef } from 'react';

export default function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationId: number;
    let time = 0;

    const animate = () => {
      // Clear with gradient background
      const gradient = ctx!.createLinearGradient(0, 0, 0, canvas!.height);
      gradient.addColorStop(0, '#FDFBF7');
      gradient.addColorStop(1, '#F5EFE6');
      ctx!.fillStyle = gradient;
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      // Draw wave 1 - Dark Brown
      ctx!.fillStyle = 'rgba(139, 69, 19, 0.2)';
      ctx!.beginPath();
      for (let x = 0; x <= canvas!.width; x += 20) {
        const y = canvas!.height * 0.65 + Math.sin((x * 0.01) + time * 0.03) * 40;
        if (x === 0) ctx!.moveTo(x, y);
        else ctx!.lineTo(x, y);
      }
      ctx!.lineTo(canvas!.width, canvas!.height);
      ctx!.lineTo(0, canvas!.height);
      ctx!.closePath();
      ctx!.fill();

      // Draw wave 2 - Red
      ctx!.fillStyle = 'rgba(220, 38, 38, 0.15)';
      ctx!.beginPath();
      for (let x = 0; x <= canvas!.width; x += 20) {
        const y = canvas!.height * 0.70 + Math.sin((x * 0.008) + time * 0.025 + 100) * 50;
        if (x === 0) ctx!.moveTo(x, y);
        else ctx!.lineTo(x, y);
      }
      ctx!.lineTo(canvas!.width, canvas!.height);
      ctx!.lineTo(0, canvas!.height);
      ctx!.closePath();
      ctx!.fill();

      // Draw wave 3 - Gold
      ctx!.fillStyle = 'rgba(218, 165, 32, 0.15)';
      ctx!.beginPath();
      for (let x = 0; x <= canvas!.width; x += 20) {
        const y = canvas!.height * 0.75 + Math.sin((x * 0.012) + time * 0.035 + 200) * 35;
        if (x === 0) ctx!.moveTo(x, y);
        else ctx!.lineTo(x, y);
      }
      ctx!.lineTo(canvas!.width, canvas!.height);
      ctx!.lineTo(0, canvas!.height);
      ctx!.closePath();
      ctx!.fill();

      time++;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
}
