import { Card } from '../ui/Card';
import { formatPersianNumber } from '../../lib/format';
import type { Profile } from '../../types/profile';

interface WhatYouGainedProps {
  profile: Profile;
  generalsCount: number;
  relicsCount: number;
  skillsCount: number;
}

export function WhatYouGained({ profile, generalsCount, relicsCount, skillsCount }: WhatYouGainedProps) {
  return (
    <Card>
      <h3 className="text-lg font-bold text-command-olive mb-3 font-[family-name:var(--font-serif-epic)]">
        آنچه به دست آوردی
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <div>
            <p className="text-lg font-bold text-command-amber font-[family-name:var(--font-mono-hud)]">
              {formatPersianNumber(profile.streak_days)}
            </p>
            <p className="text-xs text-command-muted">روز پایداری</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏰</span>
          <div>
            <p className="text-lg font-bold text-command-olive font-[family-name:var(--font-mono-hud)]">
              {formatPersianNumber(profile.total_points)}
            </p>
            <p className="text-xs text-command-muted">امتیاز کل</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎖</span>
          <div>
            <p className="text-lg font-bold text-command-amber font-[family-name:var(--font-mono-hud)]">
              {formatPersianNumber(generalsCount)}
            </p>
            <p className="text-xs text-command-muted">ژنرال</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏺</span>
          <div>
            <p className="text-lg font-bold text-command-olive font-[family-name:var(--font-mono-hud)]">
              {formatPersianNumber(relicsCount)}
            </p>
            <p className="text-xs text-command-muted">یادگاری</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌳</span>
          <div>
            <p className="text-lg font-bold text-command-amber font-[family-name:var(--font-mono-hud)]">
              {formatPersianNumber(skillsCount)}
            </p>
            <p className="text-xs text-command-muted">مهارت</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
