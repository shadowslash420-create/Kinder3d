import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Waves from '@/components/Waves';

export default function WaveBackground() {
  return (
    <Canvas 
      className="!absolute inset-0 w-full h-full"
      style={{ position: 'fixed', top: '100vh', left: 0, right: 0, pointerEvents: 'none' }}
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ transparent: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Waves />
      </Suspense>
    </Canvas>
  );
}
