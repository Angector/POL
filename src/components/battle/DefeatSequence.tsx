import { useEffect } from 'react';
import { motion } from 'motion/react';
import { playDefeat } from '../../lib/sounds';

interface DefeatSequenceProps {
  isOpen: boolean;
  onComplete: () => void;
}

export function DefeatSequence({ isOpen, onComplete }: DefeatSequenceProps) {
  useEffect(() => {
    if (isOpen) {
      playDefeat();
      const timer = setTimeout(onComplete, 4500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(139, 26, 26, 0.9)' }}
    >
      <div className="text-center relative">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-5xl md:text-6xl font-bold text-white font-[family-name:var(--font-serif-epic)] mb-6"
        >
          کاخ سقوط کرد
        </motion.h2>

        {/* Rebels animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: `${20 + Math.random() * 60}%`,
                y: '100%',
                opacity: 0,
              }}
              animate={{
                y: '30%',
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: 0.5 + i * 0.1,
                ease: 'easeOut',
              }}
              className="absolute text-4xl"
            >
              🏴
            </motion.div>
          ))}
        </div>

        {/* Falling flags */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={`flag-${i}`}
              initial={{
                x: `${10 + i * 20}%`,
                y: '-10%',
                rotate: 0,
              }}
              animate={{
                y: '110%',
                rotate: 360,
              }}
              transition={{
                duration: 3,
                delay: 1 + i * 0.2,
                ease: 'easeIn',
              }}
              className="absolute text-3xl"
            >
              🏴
            </motion.div>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.4 }}
          className="text-xl text-white/80 mt-8"
        >
          ارتش پراکنده شد. اما فرمانده نمرده.
        </motion.p>

        {/* Continue button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          onClick={onComplete}
          className="mt-8 px-8 py-3 bg-white text-command-crimson font-bold rounded-lg hover:brightness-90 transition-all"
        >
          ادامه
        </motion.button>
      </div>
    </motion.div>
  );
}
