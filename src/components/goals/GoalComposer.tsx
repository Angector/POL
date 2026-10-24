import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Goal } from '../../types/goal';

interface GoalComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string | null; target_value: number; unit: string; deadline: string | null }) => Promise<void>;
  initialData?: Partial<Goal>;
}

export function GoalComposer({ isOpen, onClose, onSubmit, initialData }: GoalComposerProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [targetValue, setTargetValue] = useState(initialData?.target_value || 100);
  const [unit, setUnit] = useState(initialData?.unit || 'واحد');
  const [deadline, setDeadline] = useState(initialData?.deadline || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || targetValue <= 0) return;

    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        target_value: targetValue,
        unit: unit.trim() || 'واحد',
        deadline: deadline || null,
      });
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
                {initialData ? 'ویرایش هدف' : 'هدف جدید'}
              </h2>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm text-command-text mb-2">عنوان</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثلاً: خواندن ۱۰ کتاب"
                  className="w-full bg-command-bg border border-command-border rounded px-4 py-2 text-command-text focus:outline-none focus:border-command-amber transition-colors"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm text-command-text mb-2">توضیحات (اختیاری)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="توضیح کوتاه درباره هدف"
                  className="w-full bg-command-bg border border-command-border rounded px-4 py-2 text-command-text focus:outline-none focus:border-command-amber transition-colors"
                  rows={3}
                />
              </div>

              {/* Target value and unit */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm text-command-text mb-2">مقدار هدف</label>
                  <input
                    type="number"
                    value={targetValue}
                    onChange={(e) => setTargetValue(parseFloat(e.target.value))}
                    min="1"
                    dir="ltr"
                    className="w-full bg-command-bg border border-command-border rounded px-4 py-2 text-command-text focus:outline-none focus:border-command-amber transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-command-text mb-2">واحد</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="صفحه، کیلومتر، ساعت"
                    className="w-full bg-command-bg border border-command-border rounded px-4 py-2 text-command-text focus:outline-none focus:border-command-amber transition-colors"
                  />
                </div>
              </div>

              {/* Deadline */}
              <div className="mb-6">
                <label className="block text-sm text-command-text mb-2">مهلت (اختیاری)</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  dir="ltr"
                  className="w-full bg-command-bg border border-command-border rounded px-4 py-2 text-command-text focus:outline-none focus:border-command-amber transition-colors"
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
                  disabled={loading || !title.trim() || targetValue <= 0}
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
