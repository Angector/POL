import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { TileWithPosition } from '../../types/tile';
import { HEX_SIZE, HEX_HEIGHT, COLORS } from '../../lib/mapConstants';

interface BattleLineProps {
  tiles: TileWithPosition[];
}

export function BattleLine({ tiles }: BattleLineProps) {
  const groupRef = useRef<THREE.Group>(null);

  const fightingTiles = tiles.filter(tile => tile.status === 'fighting');

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime();
    const pulse = (Math.sin(time * 2) + 1) / 2;
    
    groupRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material as THREE.MeshBasicMaterial;
        material.opacity = 0.2 + pulse * 0.3;
      }
    });
  });

  if (fightingTiles.length === 0) return null;

  return (
    <group ref={groupRef}>
      {fightingTiles.map((tile) => (
        <mesh
          key={tile.tile_index}
          position={[tile.x, HEX_HEIGHT / 2 + 0.04, tile.z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[HEX_SIZE * 0.9, 6]} />
          <meshBasicMaterial
            color={COLORS.fightingPulse}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
