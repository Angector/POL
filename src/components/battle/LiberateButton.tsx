import { motion } from 'motion/react';
import { formatPersianNumber } from '../../lib/format';

interface LiberateButtonProps {
  isReady: boolean;
  hoursRemaining: number;
  onLiberate: () => void;
  loading: boolean;
}

export function LiberateButton({
  isReady,
  hoursRemaining,
  onLiberate,
  loading,
}: LiberateButtonProps) {
  if (isReady) {
    return (
      <motion.button
        onClick={onLiberate}
        disabled={loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-3 bg-command-amber text-command-bg font-bold rounded-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? 'در حال فتح...' : 'فتح شهر بعدی ⚔️'}
      </motion.button>
    );
  }

  return (
    <div className="flex items-center gap-2 text-command-muted">
      <span className="text-xl">⏳</span>
      <span className="text-sm">
        {formatPersianNumber(hoursRemaining)} ساعت تا فتح بعدی
      </span>
    </div>
  );
}
