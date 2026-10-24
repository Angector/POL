import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSound } from '../../context/SoundContext';

export function SoundToggle() {
  const { muted, volume, toggleMute, setVolume } = useSound();
  const [showVolume, setShowVolume] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowVolume(false);
      }
    }

    if (showVolume) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showVolume]);

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={toggleMute}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowVolume(!showVolume);
        }}
        className="p-2 text-command-muted hover:text-command-text transition-colors"
        aria-label={muted ? 'فعال‌سازی صدا' : 'قطع صدا'}
      >
        {muted ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>

      <AnimatePresence>
        {showVolume && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full right-0 mt-2 bg-command-panel border border-command-border rounded-lg p-4 shadow-xl z-50"
          >
            <label className="block text-xs text-command-muted mb-2">
              میزان صدا
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-32 accent-command-amber"
              aria-label="میزان صدا"
            />
            <div className="flex justify-between text-xs text-command-muted mt-1">
              <span>۰</span>
              <span>{Math.round(volume * 100)}%</span>
              <span>۱۰۰</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
