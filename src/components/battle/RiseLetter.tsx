import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

interface RiseLetterProps {
  isOpen: boolean;
  onAccept: () => void;
}

export function RiseLetter({ isOpen, onAccept }: RiseLetterProps) {
  const { profile } = useAuth();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
      <motion.div
        initial={{ scaleY: 0.1, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative w-full max-w-2xl rounded-lg overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #e8e0cc 0%, #d4cbb3 50%, #e8e0cc 100%)',
          boxShadow: 'inset 0 0 60px rgba(42, 36, 22, 0.3), 0 20px 60px rgba(0, 0, 0, 0.5)',
          transformOrigin: 'top center',
        }}
      >
        <div className="px-8 py-12 md:px-16 md:py-16">
          <h2
            className="text-center text-3xl md:text-4xl font-bold mb-8"
            style={{
              fontFamily: 'var(--font-serif-epic)',
              color: '#2a2416',
            }}
          >
            نامه‌ی برخاستن
          </h2>

          <div
            className="text-lg md:text-xl leading-relaxed space-y-6 text-justify"
            style={{
              fontFamily: 'var(--font-sans-body)',
              color: '#2a2416',
            }}
          >
            <p>
              فرمانده {profile?.callsign || 'ناشناس'}،
            </p>

            <p>
              کاخ سقوط کرد. اما تو هنوز نفس می‌کشی.
              تاریخ پر از فرماندهانی است که یک‌بار شکست خوردند و بار دیگر برخاستند.
              آن‌ها که تسلیم شدند، فراموش شدند. آن‌ها که برخاستند، افسانه شدند.
            </p>

            <p>
              ارتش تو پراکنده است، اما نام تو هنوز بر زبان سربازان است.
              سه روز روحیه‌ی برخاسته به تو داده می‌شود. از آن استفاده کن.
            </p>

            <p className="text-left font-bold mt-8">
              — شورای مشاوران
            </p>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={onAccept}
              className="px-8 py-3 font-bold rounded-lg transition-all"
              style={{
                backgroundColor: '#2a2416',
                color: '#e8e0cc',
              }}
            >
              برخاستن
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
