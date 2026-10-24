import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { TileWithPosition } from '../../types/tile';
import { HEX_SIZE, HEX_HEIGHT, COLORS } from '../../lib/mapConstants';

interface FogLayerProps {
  tiles: TileWithPosition[];
}

export function FogLayer({ tiles }: FogLayerProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tempObject = useMemo(() => new THREE.Object3D(), []);

  const lockedTiles = useMemo(() => 
    tiles.filter(tile => tile.status === 'locked'),
    [tiles]
  );

  useEffect(() => {
    if (!meshRef.current || lockedTiles.length === 0) return;

    lockedTiles.forEach((tile, i) => {
      tempObject.position.set(tile.x, HEX_HEIGHT / 2 + 0.01, tile.z);
      tempObject.rotation.x = -Math.PI / 2;
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [lockedTiles, tempObject]);

  if (lockedTiles.length === 0) return null;

  const geometry = useMemo(() => {
    return new THREE.CircleGeometry(HEX_SIZE - 0.05, 6);
  }, []);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, undefined, lockedTiles.length]}
    >
      <meshBasicMaterial
        color={COLORS.lockedFog}
        transparent
        opacity={0.6}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}
