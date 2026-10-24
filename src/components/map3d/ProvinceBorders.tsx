import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { TileWithPosition } from '../../types/tile';
import { HEX_SIZE, HEX_HEIGHT, COLORS } from '../../lib/mapConstants';

interface ProvinceBordersProps {
  tiles: TileWithPosition[];
}

export function ProvinceBorders({ tiles }: ProvinceBordersProps) {
  const provinceRef = useRef<THREE.InstancedMesh>(null);
  const stateRef = useRef<THREE.InstancedMesh>(null);
  const tempObject = useMemo(() => new THREE.Object3D(), []);

  const provinceTiles = useMemo(() => 
    tiles.filter(tile => tile.tile_type === 'province'),
    [tiles]
  );

  const stateTiles = useMemo(() => 
    tiles.filter(tile => tile.tile_type === 'state'),
    [tiles]
  );

  useEffect(() => {
    if (!provinceRef.current || provinceTiles.length === 0) return;

    provinceTiles.forEach((tile, i) => {
      tempObject.position.set(tile.x, HEX_HEIGHT / 2 + 0.02, tile.z);
      tempObject.rotation.x = -Math.PI / 2;
      tempObject.updateMatrix();
      provinceRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    provinceRef.current.instanceMatrix.needsUpdate = true;
  }, [provinceTiles, tempObject]);

  useEffect(() => {
    if (!stateRef.current || stateTiles.length === 0) return;

    stateTiles.forEach((tile, i) => {
      tempObject.position.set(tile.x, HEX_HEIGHT / 2 + 0.03, tile.z);
      tempObject.rotation.x = -Math.PI / 2;
      tempObject.updateMatrix();
      stateRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    stateRef.current.instanceMatrix.needsUpdate = true;
  }, [stateTiles, tempObject]);

  const geometry = useMemo(() => {
    return new THREE.RingGeometry(HEX_SIZE * 0.85, HEX_SIZE - 0.02, 6);
  }, []);

  return (
    <>
      {provinceTiles.length > 0 && (
        <instancedMesh
          ref={provinceRef}
          args={[geometry, undefined, provinceTiles.length]}
        >
          <meshBasicMaterial
            color={COLORS.borderProvince}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </instancedMesh>
      )}
      {stateTiles.length > 0 && (
        <instancedMesh
          ref={stateRef}
          args={[geometry, undefined, stateTiles.length]}
        >
          <meshBasicMaterial
            color={COLORS.borderState}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </instancedMesh>
      )}
    </>
  );
}
