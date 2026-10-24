import { motion, AnimatePresence } from 'motion/react';
import { GeneralPortrait } from './GeneralPortrait';
import { formatDate, formatPersianNumber } from '../../lib/format';
import type { General } from '../../types/general';

interface GeneralDetailModalProps {
  general: General | null;
  onClose: () => void;
  onDispatch?: () => void;
}

export function GeneralDetailModal({ general, onClose, onDispatch }: GeneralDetailModalProps) {
  if (!general) return null;

  const archive = general.experience_archive;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-command-panel border border-command-border rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-center text-center mb-6">
            <GeneralPortrait seed={general.portrait_seed} size={200} />
            <h2 className="text-3xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)] mt-4">
              {general.name}
            </h2>
            <p className="text-lg text-command-muted mt-2">
              رتبه: {general.rank_earned}
            </p>
            <p className="text-sm text-command-muted mt-1">
              تاریخ تولید: {formatDate(general.created_at)}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-command-bg border border-command-border rounded p-3 text-center">
              <p className="text-2xl font-bold text-command-amber font-[family-name:var(--font-mono-hud)]">
                {formatPersianNumber(archive.resisted_urges)}
              </p>
              <p className="text-xs text-command-muted">حملات دفع‌شده</p>
            </div>
            <div className="bg-command-bg border border-command-border rounded p-3 text-center">
              <p className="text-2xl font-bold text-command-crimson font-[family-name:var(--font-mono-hud)]">
                {formatPersianNumber(archive.defeated_urges)}
              </p>
              <p className="text-xs text-command-muted">لغزش‌ها</p>
            </div>
            <div className="bg-command-bg border border-command-border rounded p-3 text-center">
              <p className="text-2xl font-bold text-command-olive font-[family-name:var(--font-mono-hud)]">
                {formatPersianNumber(archive.freed_cities)}
              </p>
              <p className="text-xs text-command-muted">شهرهای آزادشده</p>
            </div>
            <div className="bg-command-bg border border-command-border rounded p-3 text-center">
              <p className="text-2xl font-bold text-command-amber font-[family-name:var(--font-mono-hud)]">
                {formatPersianNumber(archive.completed_habits)}
              </p>
              <p className="text-xs text-command-muted">عادت‌های تکمیل‌شده</p>
            </div>
            <div className="bg-command-bg border border-command-border rounded p-3 text-center">
              <p className="text-2xl font-bold text-command-olive font-[family-name:var(--font-mono-hud)]">
                {formatPersianNumber(archive.completed_goals)}
              </p>
              <p className="text-xs text-command-muted">اهداف تکمیل‌شده</p>
            </div>
            <div className="bg-command-bg border border-command-border rounded p-3 text-center">
              <p className="text-2xl font-bold text-command-amber font-[family-name:var(--font-mono-hud)]">
                {formatPersianNumber(archive.streak_days)}
              </p>
              <p className="text-xs text-command-muted">روزهای پایداری</p>
            </div>
          </div>

          <div className="bg-command-bg border border-command-border rounded p-4 mb-6">
            <h3 className="text-sm font-bold text-command-amber mb-2">روایت تجربه</h3>
            <p className="text-sm text-command-text leading-relaxed">
              {archive.narrative}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-command-bg border border-command-border text-command-muted rounded hover:border-command-text transition-colors"
            >
              بستن
            </button>
            {onDispatch && general.status === 'home' && (
              <button
                onClick={onDispatch}
                className="flex-1 py-3 bg-command-amber text-command-bg font-bold rounded hover:brightness-110 transition-all"
              >
                ارسال به همرزم
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
