import { TRIGGER_LABELS } from '../../lib/urgeConstants';
import { formatPersianNumber } from '../../lib/format';
import type { UrgeTrigger } from '../../types/urge';

interface TriggerBarsProps {
  data: Record<UrgeTrigger, number>;
}

export function TriggerBars({ data }: TriggerBarsProps) {
  const max = Math.max(...Object.values(data), 1);

  return (
    <div>
      <h3 className="text-sm font-bold text-command-text mb-2">محرک‌ها</h3>
      <div className="space-y-2">
        {(Object.keys(TRIGGER_LABELS) as UrgeTrigger[]).map((trigger) => {
          const count = data[trigger];
          const width = (count / max) * 100;

          return (
            <div key={trigger}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-command-text">{TRIGGER_LABELS[trigger]}</span>
                <span className="text-command-muted">{formatPersianNumber(count)}</span>
              </div>
              <div className="w-full h-2 bg-command-panel rounded-full overflow-hidden">
                <div
                  className="h-full bg-command-crimson transition-all"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
