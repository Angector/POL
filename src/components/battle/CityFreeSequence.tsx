import { useEffect } from 'react';
import { motion } from 'motion/react';
import { playHorn } from '../../lib/sounds';

interface CityFreeSequenceProps {
  isOpen: boolean;
  cityName: string;
  cityMeaning: string | null;
  onComplete: () => void;
}

export function CityFreeSequence({
  isOpen,
  cityName,
  cityMeaning,
  onComplete,
}: CityFreeSequenceProps) {
  useEffect(() => {
    if (isOpen) {
      playHorn();
      const timer = setTimeout(onComplete, 3500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
    >
      <div className="text-center">
        {/* Flag animation */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-8xl mb-8"
        >
          🏰
        </motion.div>

        {/* City name */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-4xl md:text-5xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)] mb-4"
        >
          شهر {cityName} آزاد شد
        </motion.h2>

        {/* City meaning */}
        {cityMeaning && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.3 }}
            className="text-xl text-command-text italic"
          >
            {cityMeaning}
          </motion.p>
        )}

        {/* Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: '50%',
                y: '50%',
                scale: 0,
                opacity: 1,
              }}
              animate={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                scale: [0, 1, 0],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: 0.5 + Math.random() * 0.5,
                ease: 'easeOut',
              }}
              className="absolute w-2 h-2 bg-command-amber rounded-full"
            />
          ))}
        </div>

        {/* Continue button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          onClick={onComplete}
          className="mt-8 px-8 py-3 bg-command-amber text-command-bg font-bold rounded-lg hover:brightness-110 transition-all"
        >
          ادامه
        </motion.button>
      </div>
    </motion.div>
  );
}
