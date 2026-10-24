import { formatPersianNumber } from '../../lib/format';

interface StreakTimerProps {
  elapsedMs: number;
  isReady: boolean;
}

export function StreakTimer({ elapsedMs, isReady }: StreakTimerProps) {
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  
  const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
  const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((elapsedMs % (1000 * 60)) / 1000);
  
  const progress = Math.min((elapsedMs / TWENTY_FOUR_HOURS) * 100, 100);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`text-4xl font-bold font-[family-name:var(--font-mono-hud)] ${
          isReady ? 'text-command-amber' : 'text-command-muted'
        }`}
      >
        {formatPersianNumber(hours)}:{minutes.toString().padStart(2, '0').split('').map(d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]).join('')}:{seconds.toString().padStart(2, '0').split('').map(d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]).join('')}
      </div>
      <div className="w-full max-w-xs h-2 bg-command-bg rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${
            isReady ? 'bg-command-amber' : 'bg-command-muted'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-command-muted">
        {isReady ? 'آماده فتح' : 'زمان باقی‌مانده'}
      </p>
    </div>
  );
}
