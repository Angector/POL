import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatPersianNumber } from '../../lib/format';

export function RiseBuffIndicator() {
  const { profile } = useAuth();
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number } | null>(null);

  useEffect(() => {
    if (!profile?.rise_buff_until) {
      setTimeLeft(null);
      return;
    }

    const update = () => {
      const until = new Date(profile.rise_buff_until!).getTime();
      const now = Date.now();
      const diff = until - now;

      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      setTimeLeft({ days, hours });
    };

    update();
    const interval = setInterval(update, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [profile?.rise_buff_until]);

  if (!timeLeft) return null;

  return (
    <div
      className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"
      style={{
        backgroundColor: 'rgba(212, 160, 23, 0.2)',
        color: '#d4a017',
        boxShadow: '0 0 10px rgba(212, 160, 23, 0.3)',
      }}
      title="در ۳ روز آینده، پاداش ماموریت‌های خارجی +۱۰٪ است"
    >
      <span>🔥</span>
      <span>
        برخاسته — {formatPersianNumber(timeLeft.days)} روز و {formatPersianNumber(timeLeft.hours)} ساعت
      </span>
    </div>
  );
}
