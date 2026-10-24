import { COLORS } from '../../lib/mapConstants';

export function MapLegend() {
  return (
    <div className="absolute top-4 left-4 bg-command-panel/80 border border-command-border rounded-lg p-3 backdrop-blur-sm z-10">
      <h3 className="text-xs text-command-muted mb-2 font-[family-name:var(--font-mono-hud)]">
        راهنما
      </h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: COLORS.locked }}
          />
          <span className="text-xs text-command-text">🔒 قفل — دشمن</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: COLORS.fighting }}
          />
          <span className="text-xs text-command-text">⚔️ در نبرد</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: COLORS.freed }}
          />
          <span className="text-xs text-command-text">🏰 آزاد</span>
        </div>
      </div>
    </div>
  );
}
