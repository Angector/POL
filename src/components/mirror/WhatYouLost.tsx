import { Card } from '../ui/Card';
import { formatPersianNumber } from '../../lib/format';
import { TRIGGER_LABELS } from '../../lib/urgeConstants';
import type { UrgeTrigger } from '../../types/urge';

interface WhatYouLostProps {
  defeatedCount: number;
  topTrigger: UrgeTrigger | null;
}

export function WhatYouLost({ defeatedCount, topTrigger }: WhatYouLostProps) {
  const estimatedHours = defeatedCount * 2;

  return (
    <Card>
      <h3 className="text-lg font-bold text-command-crimson mb-3 font-[family-name:var(--font-serif-epic)]">
        آنچه از دست دادی
      </h3>
      <p className="text-command-text mb-3">
        اگر زمان صرف‌شده در حمله‌های لغزش‌شده را صرف یادگیری یک مهارت می‌کردی، الان حدود{' '}
        <span className="text-command-crimson font-bold">
          {formatPersianNumber(estimatedHours)} ساعت
        </span>{' '}
        تمرین کرده بودی.
      </p>
      {topTrigger && (
        <p className="text-sm text-command-muted">
          پرتکرارترین نقطه‌ی ضعف: {TRIGGER_LABELS[topTrigger]}
        </p>
      )}
    </Card>
  );
}
