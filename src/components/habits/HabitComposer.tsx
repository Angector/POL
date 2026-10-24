import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Habit, HabitCategory, HabitFrequency } from '../../types/habit';
import { CATEGORY_INFO, FREQUENCY_LABELS } from '../../lib/habitConstants';
import { formatPersianNumber } from '../../lib/format';

interface HabitComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; category: HabitCategory; frequency: HabitFrequency; points: number }) => Promise<void>;
  initialData?: Partial<Habit>;
}

export function HabitComposer({ isOpen, onClose, onSubmit, initialData }: HabitComposerProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState<HabitCategory>(initialData?.category || 'external');
  const [frequency, setFrequency] = useState<HabitFrequency>(initialData?.frequency || 'daily');
  const [points, setPoints] = useState(initialData?.points || 3);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onSubmit({ title: title.trim(), category, frequency, points });
      onClose();
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
              <h2 className="text-2xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)] mb-6">
                {initialData ? 'ویرایش ماموریت' : 'ماموریت جدید'}
              </h2>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm text-command-text mb-2">عنوان</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثلاً: ۳۰ دقیقه مطالعه"
                  className="w-full bg-command-bg border border-command-border rounded px-4 py-2 text-command-text focus:outline-none focus:border-command-amber transition-colors"
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="block text-sm text-command-text mb-2">دسته</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(CATEGORY_INFO) as HabitCategory[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-4 py-2 rounded border text-sm transition-all ${
                        category === cat
                          ? 'bg-command-amber/20 border-command-amber text-command-amber'
                          : 'bg-command-bg border-command-border text-command-muted hover:border-command-text'
                      }`}
                    >
                      {CATEGORY_INFO[cat].icon} {CATEGORY_INFO[cat].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency */}
              <div className="mb-4">
                <label className="block text-sm text-command-text mb-2">فرکانس</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(FREQUENCY_LABELS) as HabitFrequency[]).map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setFrequency(freq)}
                      className={`px-3 py-2 rounded border text-sm transition-all ${
                        frequency === freq
                          ? 'bg-command-amber/20 border-command-amber text-command-amber'
                          : 'bg-command-bg border-command-border text-command-muted hover:border-command-text'
                      }`}
                    >
                      {FREQUENCY_LABELS[freq]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Points */}
              <div className="mb-6">
                <label className="block text-sm text-command-text mb-2">
                  امتیاز: {formatPersianNumber(points)}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={points}
                  onChange={(e) => setPoints(parseInt(e.target.value))}
                  className="w-full accent-command-amber"
                />
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
                  disabled={loading || !title.trim()}
                  className="flex-1 py-2 bg-command-amber text-command-bg font-bold rounded hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? '...' : 'ذخیره'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
