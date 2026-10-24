import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { formatPersianNumber } from '../../lib/format';

interface GoalProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (delta: number, note: string | null) => Promise<void>;
  goalTitle: string;
  unit: string;
}

export function GoalProgressModal({
  isOpen,
  onClose,
  onSubmit,
  goalTitle,
  unit,
}: GoalProgressModalProps) {
  const [delta, setDelta] = useState(1);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (delta <= 0) return;

    setLoading(true);
    try {
      await onSubmit(delta, note.trim() || null);
      onClose();
      setDelta(1);
      setNote('');
    } catch (err) {
      console.error(err);
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
                ثبت پیشرفت
              </h2>
              <p className="text-sm text-command-muted mb-6">{goalTitle}</p>

              {/* Delta */}
              <div className="mb-4">
                <label className="block text-sm text-command-text mb-2">
                  مقدار پیشرفت ({unit})
                </label>
                <input
                  type="number"
                  value={delta}
                  onChange={(e) => setDelta(parseFloat(e.target.value))}
                  min="0.1"
                  step="0.1"
                  dir="ltr"
                  className="w-full bg-command-bg border border-command-border rounded px-4 py-2 text-command-text focus:outline-none focus:border-command-amber transition-colors"
                />
              </div>

              {/* Note */}
              <div className="mb-6">
                <label className="block text-sm text-command-text mb-2">یادداشت (اختیاری)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="چه کاری انجام دادی؟"
                  className="w-full bg-command-bg border border-command-border rounded px-4 py-2 text-command-text focus:outline-none focus:border-command-amber transition-colors"
                  rows={3}
                />
              </div>

              {/* Preview */}
              <div className="mb-6 p-3 bg-command-bg rounded border border-command-border">
                <p className="text-sm text-command-muted">
                  +{formatPersianNumber(delta)} {unit} به پیشرفت اضافه می‌شود
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2 bg-command-bg border border-command-border text-command-muted rounded hover:border-command-text transition-colors"
                >
                  انصراف
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || delta <= 0}
                  className="flex-1 py-2 bg-command-amber text-command-bg font-bold rounded hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? '...' : 'ثبت پیشرفت'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
