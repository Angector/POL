import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { TileWithPosition } from '../../types/tile';
import { HEX_SIZE, HEX_HEIGHT, COLORS } from '../../lib/mapConstants';

interface HexTileInstancedProps {
  tiles: TileWithPosition[];
  onTileClick: (tile: TileWithPosition) => void;
}

export function HexTileInstanced({ tiles, onTileClick }: HexTileInstancedProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  const getColor = (status: string) => {
    switch (status) {
      case 'freed': return COLORS.freed;
      case 'fighting': return COLORS.fighting;
      default: return COLORS.locked;
    }
  };

  useEffect(() => {
    if (!meshRef.current) return;

    tiles.forEach((tile, i) => {
      tempObject.position.set(tile.x, 0, tile.z);
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);
      
      tempColor.set(getColor(tile.status));
      meshRef.current!.setColorAt(i, tempColor);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [tiles, tempObject, tempColor]);

  const handleClick = (event: THREE.Intersection) => {
    if (event.instanceId !== undefined && tiles[event.instanceId]) {
      onTileClick(tiles[event.instanceId]);
    }
  };

  const geometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(
      HEX_SIZE - 0.02,
      HEX_SIZE - 0.02,
      HEX_HEIGHT,
      6
    );
    geo.rotateY(Math.PI / 6);
    return geo;
  }, []);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, undefined, tiles.length]}
      castShadow
      receiveShadow
      onClick={(e) => {
        e.stopPropagation();
        handleClick(e);
      }}
    >
      <meshStandardMaterial vertexColors />
    </instancedMesh>
  );
}
