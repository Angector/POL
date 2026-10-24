import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HEX_HEIGHT } from '../../lib/mapConstants';

interface CapitalKeepProps {
  position: { x: number; z: number };
}

export function CapitalKeep({ position }: CapitalKeepProps) {
  const flagRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (flagRef.current) {
      const time = clock.getElapsedTime();
      flagRef.current.rotation.z = Math.sin(time * 2) * 0.1;
    }
  });

  return (
    <group position={[position.x, HEX_HEIGHT / 2, position.z]}>
      {/* Base */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.4, 4]} />
        <meshStandardMaterial color="#3a3a2e" />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.5, 0.6, 0.5]} />
        <meshStandardMaterial color="#4a4a3e" />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <coneGeometry args={[0.4, 0.5, 4]} />
        <meshStandardMaterial color="#8b6a15" />
      </mesh>

      {/* Flag pole */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Flag */}
      <mesh ref={flagRef} position={[0.15, 1.7, 0]}>
        <planeGeometry args={[0.3, 0.2]} />
        <meshStandardMaterial color="#8b1a1a" side={THREE.DoubleSide} />
      </mesh>

      {/* Light */}
      <pointLight position={[0, 1.5, 0]} color="#d4a017" intensity={0.5} distance={5} />
    </group>
  );
}
