import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTerritory } from '../hooks/useTerritory';
import { TerritoryMap3D } from '../components/map3d/TerritoryMap3D';
import { CityPanel } from '../components/map3d/CityPanel';
import { ErrorBanner } from '../components/ui/ErrorBanner';
import type { TileWithPosition } from '../types/tile';

export default function TerritoryPage() {
  const { profile } = useAuth();
  const { territory, tiles, loading, error, refresh } = useTerritory();
  const [selectedTile, setSelectedTile] = useState<TileWithPosition | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <p className="text-command-amber font-[family-name:var(--font-mono-hud)]">
          در حال بارگذاری سرزمین...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorBanner message={error} onRetry={refresh} />
      </div>
    );
  }

  if (tiles.length === 0) {
    return (
      <div className="p-4">
        <ErrorBanner message="سرزمینی یافت نشد. لطفاً دوباره وارد شوید." onRetry={refresh} />
      </div>
    );
  }

  return (
    <div className="relative">
      <TerritoryMap3D
        tiles={tiles}
        territory={territory}
        territoryName={profile?.territory_name || null}
        onTileClick={setSelectedTile}
      />
      <CityPanel tile={selectedTile} onClose={() => setSelectedTile(null)} />
    </div>
  );
}
