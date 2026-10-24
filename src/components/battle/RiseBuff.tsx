import { useEffect, useState } from 'react';
import { formatPersianNumber } from '../../lib/format';

interface RiseBuffProps {
  riseBuffUntil: string | null;
}

export function RiseBuff({ riseBuffUntil }: RiseBuffProps) {
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    if (!riseBuffUntil) return;

    const updateDays = () => {
      const until = new Date(riseBuffUntil).getTime();
      const now = Date.now();
      const diff = until - now;
      
      if (diff > 0) {
        setDaysRemaining(Math.ceil(diff / (1000 * 60 * 60 * 24)));
      } else {
        setDaysRemaining(0);
      }
    };

    updateDays();
    const interval = setInterval(updateDays, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [riseBuffUntil]);

  if (!riseBuffUntil || daysRemaining <= 0) return null;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-command-amber/20 border border-command-amber rounded text-sm text-command-amber">
      <span>🔥</span>
      <span>روحیه‌ی برخاسته — {formatPersianNumber(daysRemaining)} روز</span>
    </div>
  );
}
