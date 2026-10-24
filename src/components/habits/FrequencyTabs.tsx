import { motion } from 'motion/react';
import type { HabitFrequency } from '../../types/habit';
import { FREQUENCY_LABELS } from '../../lib/habitConstants';

interface FrequencyTabsProps {
  value: HabitFrequency;
  onChange: (frequency: HabitFrequency) => void;
}

export function FrequencyTabs({ value, onChange }: FrequencyTabsProps) {
  const frequencies: HabitFrequency[] = ['daily', 'weekly', 'monthly'];

  return (
    <div className="relative flex gap-1 bg-command-bg p-1 rounded-lg border border-command-border">
      {frequencies.map((freq) => (
        <button
          key={freq}
          onClick={() => onChange(freq)}
          className="relative px-4 py-2 text-sm font-medium transition-colors z-10"
        >
          {value === freq && (
            <motion.div
              layoutId="frequency-tab"
              className="absolute inset-0 bg-command-amber/20 border border-command-amber rounded"
              transition={{ type: 'spring', duration: 0.3 }}
            />
          )}
          <span className={value === freq ? 'text-command-amber' : 'text-command-muted'}>
            {FREQUENCY_LABELS[freq]}
          </span>
        </button>
      ))}
    </div>
  );
}
