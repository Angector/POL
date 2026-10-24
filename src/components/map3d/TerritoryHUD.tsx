import { formatPersianNumber } from '../../lib/format';
import { TOTAL_TILES } from '../../lib/mapConstants';
import { StreakTimer } from '../battle/StreakTimer';
import { LiberateButton } from '../battle/LiberateButton';
import { RiseBuff } from '../battle/RiseBuff';

interface TerritoryHUDProps {
  territoryName: string | null;
  freedCount: number;
  elapsedMs: number;
  isReady: boolean;
  hoursRemaining: number;
  onLiberate: () => void;
  liberateLoading: boolean;
  riseBuffUntil: string | null;
}

export function TerritoryHUD({
  territoryName,
  freedCount,
  elapsedMs,
  isReady,
  hoursRemaining,
  onLiberate,
  liberateLoading,
  riseBuffUntil,
}: TerritoryHUDProps) {
  const progress = (freedCount / TOTAL_TILES) * 100;
  const cycle = Math.floor(freedCount / TOTAL_TILES) + 1;

  return (
    <div className="absolute top-4 inset-x-4 z-10">
      <div className="bg-command-panel/80 border border-command-border rounded-lg p-4 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
          {/* Right: Territory info */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-command-amber font-[family-name:var(--font-serif-epic)]">
                {territoryName || 'سرزمین بی‌نام'}
              </h2>
              <RiseBuff riseBuffUntil={riseBuffUntil} />
            </div>
            <p className="text-xs text-command-muted font-[family-name:var(--font-mono-hud)]">
              {formatPersianNumber(freedCount)} / {formatPersianNumber(TOTAL_TILES)} شهر آزاد
            </p>
            <p className="text-xs text-command-muted">
              دور {formatPersianNumber(cycle)}
            </p>
          </div>

          {/* Center: Timer */}
          <div className="flex justify-center">
            <StreakTimer elapsedMs={elapsedMs} isReady={isReady} />
          </div>

          {/* Left: Liberate button */}
          <div className="flex items-center justify-end">
            <LiberateButton
              isReady={isReady}
              hoursRemaining={hoursRemaining}
              onLiberate={onLiberate}
              loading={liberateLoading}
            />
          </div>
        </div>

        {/* Progress bar */}
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
