import { Canvas } from '@react-three/fiber';
import type { ReactNode } from 'react';

interface MapCanvasProps {
  children: ReactNode;
}

export function MapCanvas({ children }: MapCanvasProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      shadows
      camera={{ position: [0, 18, 18], fov: 45, near: 0.1, far: 500 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor('#0a0f0a');
      }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[0, 8, 0]} color="#d4a017" intensity={0.6} distance={30} />
      <fog attach="fog" args={['#0a0f0a', 30, 80]} />
      {children}
    </Canvas>
  );
}
