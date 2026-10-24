import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TRIGGER_LABELS, TRIGGER_ICONS, INTENSITY_LABELS } from '../../lib/urgeConstants';
import { SosButton } from './SosButton';
import type { UrgeTrigger } from '../../types/urge';

interface UrgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResist: (data: { intensity: number; trigger: UrgeTrigger; privateNote?: string }) => Promise<void>;
  onDefeat: (data: { intensity: number; trigger: UrgeTrigger; privateNote?: string }) => Promise<void>;
  loading: boolean;
}

export function UrgeModal({
  isOpen,
  onClose,
  onResist,
  onDefeat,
  loading,
}: UrgeModalProps) {
  const [intensity, setIntensity] = useState(5);
  const [trigger, setTrigger] = useState<UrgeTrigger>('stress');
  const [privateNote, setPrivateNote] = useState('');

  const handleResist = async () => {
    await onResist({ intensity, trigger, privateNote: privateNote || undefined });
  };

  const handleDefeat = async () => {
    await onDefeat({ intensity, trigger, privateNote: privateNote || undefined });
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
            <div className="bg-command-panel border border-command-border rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)]">
                  حمله‌ی دشمن
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-command-bg border border-command-border text-command-muted hover:text-command-text transition-colors flex items-center justify-center"
                  aria-label="بستن"
                >
                  ✕
                </button>
              </div>

              <p className="text-sm text-command-muted mb-6">
                این حمله را ثبت کن. صداقت، سلاح فرمانده است.
              </p>

              {/* Intensity slider */}
              <div className="mb-6">
                <label className="block text-sm text-command-text mb-2">
                  شدت حمله: {INTENSITY_LABELS[intensity]}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={intensity}
                  onChange={(e) => setIntensity(parseInt(e.target.value))}
                  className="w-full accent-command-amber"
                />
                <div className="flex justify-between text-xs text-command-muted mt-1">
                  <span>۱</span>
                  <span>۱۰</span>
                </div>
              </div>

              {/* Trigger selection */}
              <div className="mb-6">
                <label className="block text-sm text-command-text mb-2">
                  محرک
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(TRIGGER_LABELS) as UrgeTrigger[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => setTrigger(key)}
                      className={`px-3 py-2 rounded border text-sm transition-all ${
                        trigger === key
                          ? 'bg-command-amber/20 border-command-amber text-command-amber'
                          : 'bg-command-bg border-command-border text-command-muted hover:border-command-text'
                      }`}
                    >
                      {TRIGGER_ICONS[key]} {TRIGGER_LABELS[key]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Private note */}
              <div className="mb-6">
                <label className="block text-sm text-command-text mb-2">
                  یادداشت خصوصی (اختیاری)
                </label>
                <textarea
                  value={privateNote}
                  onChange={(e) => setPrivateNote(e.target.value)}
                  placeholder="چه اتفاقی افتاد؟"
                  className="w-full bg-command-bg border border-command-border rounded px-3 py-2 text-sm text-command-text focus:outline-none focus:border-command-amber transition-colors"
                  rows={3}
                />
              </div>

              {/* SOS button */}
              <div className="mb-4">
                <SosButton />
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleResist}
                  disabled={loading}
                  className="py-3 bg-command-olive text-white font-bold rounded hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  دفع کردم ✓
                </button>
                <button
                  onClick={handleDefeat}
                  disabled={loading}
                  className="py-3 bg-command-crimson text-white font-bold rounded hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  کاخ سقوط کرد
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
