import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAlliances } from '../../hooks/useAlliances';
import { usePublicProfiles } from '../../hooks/usePublicProfiles';
import type { General } from '../../types/general';

interface DispatchGeneralModalProps {
  general: General | null;
  onClose: () => void;
  onDispatch: (recipientId: string, message?: string) => Promise<void>;
}

export function DispatchGeneralModal({ general, onClose, onDispatch }: DispatchGeneralModalProps) {
  const { accepted } = useAlliances();
  const { profiles } = usePublicProfiles();
  const [selectedRecipient, setSelectedRecipient] = useState<string>('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!general) return null;

  // Get allies from accepted alliances
  const allies = accepted.map((alliance) => {
    const otherUserId = alliance.requester_id === general.user_id 
      ? alliance.recipient_id 
      : alliance.requester_id;
    const profile = profiles.find((p) => p.id === otherUserId);
    return profile ? { id: otherUserId, callsign: profile.callsign } : null;
  }).filter(Boolean) as { id: string; callsign: string }[];

  const handleSubmit = async () => {
    if (!selectedRecipient) return;

    setLoading(true);
    try {
      await onDispatch(selectedRecipient, message || undefined);
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'خطا در ارسال ژنرال');
    } finally {
      setLoading(false);
    }
  };

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
          className="bg-command-panel border border-command-border rounded-lg p-6 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)] mb-4">
            ارسال {general.name}
          </h2>

          {allies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-command-muted mb-4">
                هنوز هم‌پیمانی ندارید.
              </p>
              <p className="text-sm text-command-muted">
                برای ارسال ژنرال، ابتدا باید با کسی پیمان ببندید.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm text-command-text mb-2">
                  انتخاب همرزم
                </label>
                <select
                  value={selectedRecipient}
                  onChange={(e) => setSelectedRecipient(e.target.value)}
                  className="w-full bg-command-bg border border-command-border rounded px-4 py-2 text-command-text"
                >
                  <option value="">انتخاب کنید...</option>
                  {allies.map((ally) => (
                    <option key={ally.id} value={ally.id}>
                      {ally.callsign}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-command-text mb-2">
                  پیام (اختیاری)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="یک جمله برای همرزم..."
                  className="w-full bg-command-bg border border-command-border rounded px-4 py-2 text-command-text min-h-[80px]"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-command-bg border border-command-border text-command-muted rounded hover:border-command-text transition-colors"
                >
                  انصراف
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !selectedRecipient}
                  className="flex-1 py-3 bg-command-amber text-command-bg font-bold rounded hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? 'در حال ارسال...' : 'ارسال'}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
