import { TRIGGER_LABELS } from '../../lib/urgeConstants';
import { formatPersianNumber } from '../../lib/format';
import type { UrgeStats } from '../../hooks/useUrgeStats';

interface PatternSummaryProps {
  stats: UrgeStats;
}

const DAY_NAMES = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

export function PatternSummary({ stats }: PatternSummaryProps) {
  return (
    <div>
      <h3 className="text-sm font-bold text-command-text mb-2">خلاصه الگو</h3>
      
      {stats.topPattern && (
        <div className="bg-command-panel border border-command-border rounded p-3 mb-3">
          <p className="text-sm text-command-text">
            بیشترین حمله: {DAY_NAMES[stats.topPattern.day]} ساعت {formatPersianNumber(stats.topPattern.hour)} با محرک {TRIGGER_LABELS[stats.topPattern.trigger as keyof typeof TRIGGER_LABELS]}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="text-center">
          <p className="text-2xl font-bold text-command-amber font-[family-name:var(--font-mono-hud)]">
            {formatPersianNumber(stats.totalUrges)}
          </p>
          <p className="text-xs text-command-muted">کل حملات</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-command-olive font-[family-name:var(--font-mono-hud)]">
            {formatPersianNumber(Math.round(stats.resistanceRate))}٪
          </p>
          <p className="text-xs text-command-muted">نرخ پیروزی</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-command-olive font-[family-name:var(--font-mono-hud)]">
            {formatPersianNumber(stats.resistedCount)}
          </p>
          <p className="text-xs text-command-muted">دفع شده</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-command-crimson font-[family-name:var(--font-mono-hud)]">
            {formatPersianNumber(stats.defeatCount)}
          </p>
          <p className="text-xs text-command-muted">سقوط</p>
        </div>
      </div>
    </div>
  );
}
