import { useRef } from 'react';
import type { TileWithPosition, Territory } from '../../types/tile';
import { MapCanvas } from './MapCanvas';
import { CameraRig, type CameraRigHandle } from './CameraRig';
import { HexTileInstanced } from './HexTileInstanced';
import { FogLayer } from './FogLayer';
import { ProvinceBorders } from './ProvinceBorders';
import { BattleLine } from './BattleLine';
import { CapitalKeep } from './CapitalKeep';
import { ZoomControls } from './ZoomControls';
import { MapLegend } from './MapLegend';
import { TerritoryHUD } from './TerritoryHUD';

interface TerritoryMap3DProps {
  tiles: TileWithPosition[];
  territory: Territory | null;
  territoryName: string | null;
  onTileClick: (tile: TileWithPosition) => void;
}

export function TerritoryMap3D({
  tiles,
  territory,
  territoryName,
  onTileClick,
}: TerritoryMap3DProps) {
  const cameraRef = useRef<CameraRigHandle>(null);

  const freedCount = tiles.filter(t => t.status === 'freed').length;
  const capitalTile = territory
    ? tiles.find(t => t.tile_index === territory.capital_tile_index)
    : null;

  return (
    <div className="relative w-full h-[calc(100vh-64px)]">
      <TerritoryHUD territoryName={territoryName} freedCount={freedCount} />
      
      <MapCanvas>
        <CameraRig ref={cameraRef} />
        <HexTileInstanced tiles={tiles} onTileClick={onTileClick} />
        <FogLayer tiles={tiles} />
        <ProvinceBorders tiles={tiles} />
        <BattleLine tiles={tiles} />
        {capitalTile && (
          <CapitalKeep position={{ x: capitalTile.x, z: capitalTile.z }} />
        )}
      </MapCanvas>

      <ZoomControls
        onZoomIn={() => cameraRef.current?.zoomIn()}
        onZoomOut={() => cameraRef.current?.zoomOut()}
        onReset={() => cameraRef.current?.reset()}
      />
      <MapLegend />
    </div>
  );
}
