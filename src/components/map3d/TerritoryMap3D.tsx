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
import { MapErrorBoundary } from '../errors/MapErrorBoundary';
import { TerritoryListFallback } from './TerritoryListFallback';

interface TerritoryMap3DProps {
  tiles: TileWithPosition[];
  territory: Territory | null;
  territoryName: string | null;
  onTileClick: (tile: TileWithPosition) => void;
  elapsedMs: number;
  isReady: boolean;
  hoursRemaining: number;
  onLiberate: () => void;
  liberateLoading: boolean;
  riseBuffUntil: string | null;
}

export function TerritoryMap3D(props: TerritoryMap3DProps) {
  const { tiles, territory, territoryName, onTileClick, elapsedMs, isReady, hoursRemaining, onLiberate, liberateLoading, riseBuffUntil } = props;
  const cameraRef = useRef<CameraRigHandle>(null);

  const freedCount = tiles.filter(t => t.status === 'freed').length;
  const capitalTile = territory
    ? tiles.find(t => t.tile_index === territory.capital_tile_index)
    : null;

  // Check if WebGL is supported
  const isWebGLSupported = (() => {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  })();

  // If WebGL not supported, show list fallback
  if (!isWebGLSupported) {
    return <TerritoryListFallback tiles={tiles} territoryName={territoryName} />;
  }

  return (
    <MapErrorBoundary>
      <div className="relative w-full h-[calc(100vh-64px)]">
        <TerritoryHUD
          territoryName={territoryName}
          freedCount={freedCount}
          elapsedMs={elapsedMs}
          isReady={isReady}
          hoursRemaining={hoursRemaining}
          onLiberate={onLiberate}
          liberateLoading={liberateLoading}
          riseBuffUntil={riseBuffUntil}
        />
        
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
    </MapErrorBoundary>
  );
}
