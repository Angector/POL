import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { UrgeTrigger } from '../../types/urge';
import { playBreathIn, playBreathOut } from '../../lib/sounds';

interface SosMiniGameProps {
  open: boolean;
  intensity?: number;
  trigger?: UrgeTrigger;
  onComplete: (note: string) => void;
  onCancel: () => void;
}

const COUNCIL_MESSAGES = [
  'تو قوی‌تر از این لحظه‌ای.',
  'هر نفس، یک پیروزی است.',
  'فرمانده، ایستادگی کن.',
  'این لحظه می‌گذرد. تو می‌مانی.',
  'اراده‌ات از آهن است.',
  'تاریکی قبل از سپیده‌دم است.',
  'هر ثانیه مقاومت، یک قدم به آزادی.',
  'تو تنها نیستی. ارتشت با توست.',
];

export function SosMiniGame({
  open,
  onComplete,
  onCancel,
}: SosMiniGameProps) {
  const [phase, setPhase] = useState<'breathing' | 'counting' | 'writing'>('breathing');
  const [breathCycle, setBreathCycle] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'in' | 'hold1' | 'out' | 'hold2'>('in');
  const [countdown, setCountdown] = useState(30);
  const [messageIndex, setMessageIndex] = useState(0);
  const [note, setNote] = useState('');

  // Breathing phase (4-4-4-4 pattern, 3 cycles)
  useEffect(() => {
    if (!open || phase !== 'breathing') return;

    const phaseDuration = 4000; // 4 seconds each
    const totalCycles = 3;

    const interval = setInterval(() => {
      setBreathPhase((prev) => {
        if (prev === 'in') {
          playBreathIn();
          return 'hold1';
        }
        if (prev === 'hold1') return 'out';
        if (prev === 'out') {
          playBreathOut();
          return 'hold2';
        }
        // hold2 -> next cycle or finish
        setBreathCycle((c) => {
          if (c + 1 >= totalCycles) {
            clearInterval(interval);
            setTimeout(() => setPhase('counting'), 500);
            return c;
          }
          return c + 1;
        });
        return 'in';
      });
    }, phaseDuration);

    return () => clearInterval(interval);
  }, [open, phase]);

  // Countdown phase
  useEffect(() => {
    if (!open || phase !== 'counting') return;

    if (countdown <= 0) {
      setPhase('writing');
      return;
    }

    const interval = setInterval(() => {
      setCountdown((c) => c - 1);
      setMessageIndex((i) => (i + 1) % COUNCIL_MESSAGES.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [open, phase, countdown]);

  // Escape key handler
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (confirm('مطمئنی؟ مقاومت ثبت نمی‌شود.')) {
          onCancel();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onCancel]);

  // Reset state when opening
  useEffect(() => {
    if (open) {
      setPhase('breathing');
      setBreathCycle(0);
      setBreathPhase('in');
      setCountdown(30);
      setMessageIndex(0);
      setNote('');
    }
  }, [open]);

  const handleSubmit = () => {
    if (note.trim().length >= 10) {
      onComplete(note.trim());
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-command-bg flex items-center justify-center p-4"
      >
        {/* Cancel button */}
        <button
          onClick={() => {
            if (confirm('مطمئنی؟ مقاومت ثبت نمی‌شود.')) {
              onCancel();
            }
          }}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-command-panel border border-command-border text-command-muted hover:text-command-text transition-colors flex items-center justify-center"
          aria-label="بستن"
        >
          ✕
        </button>

        {/* Breathing phase */}
        {phase === 'breathing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{
                scale: breathPhase === 'in' || breathPhase === 'hold1' ? 1.4 : 1,
              }}
              transition={{ duration: 4, ease: 'easeInOut' }}
              className="w-64 h-64 rounded-full bg-command-amber/20 border-4 border-command-amber flex items-center justify-center mx-auto mb-8"
            >
              <p className="text-2xl text-command-amber font-bold">
                {breathPhase === 'in' && 'دم...'}
                {breathPhase === 'hold1' && 'نگه‌دار...'}
                {breathPhase === 'out' && 'بازدم...'}
                {breathPhase === 'hold2' && 'نگه‌دار...'}
              </p>
            </motion.div>
            <p className="text-xl text-command-text mb-2">با من نفس بکش</p>
            <p className="text-sm text-command-muted">
              چرخه {breathCycle + 1} از ۳
            </p>
          </motion.div>
        )}

        {/* Countdown phase */}
        {phase === 'counting' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.p
              key={countdown}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-[150px] font-bold text-command-amber font-[family-name:var(--font-mono-hud)] mb-8"
              aria-live="polite"
            >
              {countdown}
            </motion.p>
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl text-command-text mb-8"
            >
              {COUNCIL_MESSAGES[messageIndex]}
            </motion.p>
            <div className="w-full max-w-md mx-auto h-2 bg-command-panel rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-command-amber"
                initial={{ width: '100%' }}
                animate={{ width: `${(countdown / 30) * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </motion.div>
        )}

        {/* Writing phase */}
        {phase === 'writing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)] mb-4 text-center">
              چرا نمی‌خواهی؟
            </h2>
            <p className="text-command-text mb-6 text-center">
              بنویس چرا الان نمی‌خواهی این کار را بکنی. یک جمله کافی است.
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="مثلاً: چون می‌خواهم فرمانده‌ی قلعه‌ی ذهنم باشم..."
              className="w-full bg-command-panel border border-command-border rounded-lg px-4 py-3 text-command-text focus:outline-none focus:border-command-amber transition-colors min-h-[120px]"
              autoFocus
            />
            <p className="text-xs text-command-muted mt-2 mb-4">
              حداقل ۱۰ کاراکتر ({note.length}/۱۰)
            </p>
            <button
              onClick={handleSubmit}
              disabled={note.trim().length < 10}
              className="w-full py-3 bg-command-amber text-command-bg font-bold rounded-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              ثبت مقاومت
            </button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
