import { useState } from 'react';
import type { TileWithPosition } from '../../types/tile';
import { CityPanel } from './CityPanel';
import { formatPersianNumber } from '../../lib/format';

interface TerritoryListFallbackProps {
  tiles: TileWithPosition[];
  territoryName: string | null;
}

export function TerritoryListFallback({ tiles, territoryName }: TerritoryListFallbackProps) {
  const [selectedTile, setSelectedTile] = useState<TileWithPosition | null>(null);
  const [filter, setFilter] = useState<'all' | 'locked' | 'fighting' | 'freed'>('all');

  const filteredTiles = tiles.filter(tile => {
    if (filter === 'all') return true;
    return tile.status === filter;
  });

  const freedCount = tiles.filter(t => t.status === 'freed').length;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)] mb-2">
          {territoryName || 'سرزمین بی‌نام'}
        </h1>
        <p className="text-sm text-command-muted">
          نمای لیستی — {formatPersianNumber(freedCount)} از {formatPersianNumber(tiles.length)} شهر آزاد شده
        </p>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded text-sm whitespace-nowrap ${
            filter === 'all'
              ? 'bg-command-amber text-command-bg'
              : 'bg-command-panel border border-command-border text-command-muted'
          }`}
        >
          همه ({formatPersianNumber(tiles.length)})
        </button>
        <button
          onClick={() => setFilter('freed')}
          className={`px-4 py-2 rounded text-sm whitespace-nowrap ${
            filter === 'freed'
              ? 'bg-command-olive text-white'
              : 'bg-command-panel border border-command-border text-command-muted'
          }`}
        >
          🏰 آزاد ({formatPersianNumber(freedCount)})
        </button>
        <button
          onClick={() => setFilter('fighting')}
          className={`px-4 py-2 rounded text-sm whitespace-nowrap ${
            filter === 'fighting'
              ? 'bg-command-crimson text-white'
              : 'bg-command-panel border border-command-border text-command-muted'
          }`}
        >
          ⚔️ در نبرد ({formatPersianNumber(tiles.filter(t => t.status === 'fighting').length)})
        </button>
        <button
          onClick={() => setFilter('locked')}
          className={`px-4 py-2 rounded text-sm whitespace-nowrap ${
            filter === 'locked'
              ? 'bg-command-border text-command-text'
              : 'bg-command-panel border border-command-border text-command-muted'
          }`}
        >
          🔒 قفل ({formatPersianNumber(tiles.filter(t => t.status === 'locked').length)})
        </button>
      </div>

      {/* Tiles list */}
      <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto">
        {filteredTiles.map((tile) => (
          <button
            key={tile.id}
            onClick={() => setSelectedTile(tile)}
            className="w-full bg-command-panel border border-command-border rounded-lg p-3 hover:border-command-amber transition-colors text-right"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-bold text-command-text">
                  {tile.name}
                </h3>
                {tile.name_meaning && (
                  <p className="text-xs text-command-muted italic">
                    {tile.name_meaning}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-command-muted">
                  #{formatPersianNumber(tile.tile_index)}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    tile.status === 'freed'
                      ? 'bg-command-olive/20 text-command-olive'
                      : tile.status === 'fighting'
                      ? 'bg-command-crimson/20 text-command-crimson'
                      : 'bg-command-border/20 text-command-muted'
                  }`}
                >
                  {tile.status === 'freed'
                    ? '🏰 آزاد'
                    : tile.status === 'fighting'
                    ? '⚔️ نبرد'
                    : '🔒 قفل'}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* City Panel */}
      <CityPanel tile={selectedTile} onClose={() => setSelectedTile(null)} />
    </div>
  );
}
