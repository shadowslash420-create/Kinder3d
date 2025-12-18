import { useEffect, useRef } from 'react';

export default function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let time = 0;
    const waves = [
      { amplitude: 40, frequency: 0.01, speed: 0.03, color: 'rgba(139, 69, 19, 0.15)', offset: 0 }, // Dark brown
      { amplitude: 50, frequency: 0.008, speed: 0.025, color: 'rgba(220, 38, 38, 0.1)', offset: 100 }, // Red
      { amplitude: 35, frequency: 0.012, speed: 0.035, color: 'rgba(218, 165, 32, 0.12)', offset: 200 }, // Goldenrod
      { amplitude: 45, frequency: 0.009, speed: 0.028, color: 'rgba(160, 82, 45, 0.1)', offset: 300 }, // Sienna
    ];

    const drawWave = (wave: any, yOffset: number) => {
      ctx!.beginPath();
      ctx!.fillStyle = wave.color;

      for (let x = 0; x <= canvas!.width; x += 10) {
        const y = yOffset + Math.sin((x * wave.frequency) + time * wave.speed) * wave.amplitude;
        if (x === 0) {
          ctx!.moveTo(x, y);
        } else {
          ctx!.lineTo(x, y);
        }
      }

      ctx!.lineTo(canvas!.width, canvas!.height);
      ctx!.lineTo(0, canvas!.height);
      ctx!.closePath();
      ctx!.fill();
    };

    const animate = () => {
      // Clear canvas with gradient background
      const gradient = ctx!.createLinearGradient(0, 0, 0, canvas!.height);
      gradient.addColorStop(0, '#FDFBF7');
      gradient.addColorStop(1, '#F5EFE6');
      ctx!.fillStyle = gradient;
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      // Draw multiple waves
      drawWave(waves[0], canvas!.height * 0.6);
      drawWave(waves[1], canvas!.height * 0.65);
      drawWave(waves[2], canvas!.height * 0.7);
      drawWave(waves[3], canvas!.height * 0.75);

      time += 1;
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
