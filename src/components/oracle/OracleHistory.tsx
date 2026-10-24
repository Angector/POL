import type { OraclePrediction } from '../../types/oracle';
import { RISK_INFO } from '../../lib/advisorConstants';
import { formatDate } from '../../lib/format';

interface OracleHistoryProps {
  predictions: OraclePrediction[];
}

export function OracleHistory({ predictions }: OracleHistoryProps) {
  if (predictions.length === 0) {
    return (
      <div className="bg-command-panel border border-command-border rounded-lg p-6 text-center">
        <p className="text-command-muted">هنوز تاریخچه‌ای نیست.</p>
      </div>
    );
  }

  return (
    <div className="bg-command-panel border border-command-border rounded-lg p-6">
      <h3 className="text-lg font-bold text-command-amber mb-4 font-[family-name:var(--font-serif-epic)]">
        تاریخچه پیش‌بینی‌ها
      </h3>
      <div className="space-y-3">
        {predictions.map((pred) => {
          const riskInfo = RISK_INFO[pred.risk_level];
          return (
            <div
              key={pred.id}
              className="flex items-center justify-between p-3 bg-command-bg rounded border border-command-border"
            >
              <div className="flex items-center gap-3">
                <span
                  className="px-2 py-1 rounded text-xs font-bold"
                  style={{ backgroundColor: riskInfo.color, color: '#fff' }}
                >
                  {riskInfo.label}
                </span>
                <span className="text-sm text-command-text">{pred.risk_window}</span>
              </div>
              <span className="text-xs text-command-muted">{formatDate(pred.for_date)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
