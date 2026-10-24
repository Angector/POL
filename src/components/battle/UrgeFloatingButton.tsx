import { motion } from 'motion/react';

interface UrgeFloatingButtonProps {
  onClick: () => void;
}

export function UrgeFloatingButton({ onClick }: UrgeFloatingButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-3 bg-command-crimson text-white font-bold rounded-lg shadow-lg hover:brightness-110 transition-all"
      aria-label="حمله‌ی دشمن"
    >
      <span className="text-xl">⚔️</span>
      <span className="hidden sm:inline">حمله‌ی دشمن</span>
    </motion.button>
  );
}
