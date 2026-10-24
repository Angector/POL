import { formatPersianNumber } from '../../lib/format';
import { TOTAL_TILES } from '../../lib/mapConstants';

interface TerritoryHUDProps {
  territoryName: string | null;
  freedCount: number;
}

export function TerritoryHUD({ territoryName, freedCount }: TerritoryHUDProps) {
  const progress = (freedCount / TOTAL_TILES) * 100;
  const cycle = Math.floor(freedCount / TOTAL_TILES) + 1;

  return (
    <div className="absolute top-4 inset-x-4 z-10">
      <div className="bg-command-panel/80 border border-command-border rounded-lg p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg font-bold text-command-amber font-[family-name:var(--font-serif-epic)]">
              {territoryName || 'سرزمین بی‌نام'}
            </h2>
            <p className="text-xs text-command-muted font-[family-name:var(--font-mono-hud)]">
              {formatPersianNumber(freedCount)} / {formatPersianNumber(TOTAL_TILES)} شهر آزاد
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-command-text">دور {formatPersianNumber(cycle)}</p>
          </div>
        </div>
        <div className="w-full h-2 bg-command-bg rounded-full overflow-hidden">
          <div
            className="h-full bg-command-amber transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
