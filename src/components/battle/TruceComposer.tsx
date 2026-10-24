import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTruce } from '../../hooks/useTruce';
import { TRUCE_REASONS } from '../../lib/truceConstants';
import type { TruceReason } from '../../types/truce';

interface TruceComposerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TruceComposer({ isOpen, onClose }: TruceComposerProps) {
  const [selectedReason, setSelectedReason] = useState<TruceReason | null>(null);
  const [loading, setLoading] = useState(false);
  const { start } = useTruce();

  const handleSubmit = async () => {
    if (!selectedReason) return;

    setLoading(true);
    try {
      await start(selectedReason);
      onClose();
      setSelectedReason(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'خطا در شروع آتش‌بس');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-command-panel border border-command-border rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)] mb-2">
                آتش‌بس بگیر
              </h2>
              <p className="text-sm text-command-muted mb-4">
                حداکثر ۳ روز. فقط جنگ خارجی.
              </p>

              <div className="bg-command-crimson/20 border border-command-crimson rounded p-3 mb-6">
                <p className="text-sm text-red-200">
                  🛡 جنگ داخلی آتش‌بس ندارد. عادت‌های داخلی همیشه ادامه دارند.
                </p>
              </div>

              <label className="block text-sm text-command-text mb-3">
                دلیل آتش‌بس:
              </label>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {(Object.keys(TRUCE_REASONS) as TruceReason[]).map((reason) => {
                  const info = TRUCE_REASONS[reason];
                  return (
                    <button
                      key={reason}
                      onClick={() => setSelectedReason(reason)}
                      className={`px-4 py-3 rounded border text-sm transition-all ${
                        selectedReason === reason
                          ? 'bg-command-olive/20 border-command-olive text-command-olive'
                          : 'bg-command-bg border-command-border text-command-muted hover:border-command-text'
                      }`}
                    >
                      <span className="text-xl block mb-1">{info.icon}</span>
                      {info.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2 bg-command-bg border border-command-border text-command-muted rounded hover:border-command-text transition-colors"
                >
                  انصراف
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !selectedReason}
                  className="flex-1 py-2 bg-command-olive text-white font-bold rounded hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? '...' : 'فعال‌سازی آتش‌بس'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
