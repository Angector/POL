import { motion } from 'motion/react';
import { formatPersianNumber } from '../../lib/format';

interface StatCardProps {
  label: string;
  value: number;
  unit?: string;
  icon?: string;
  accent?: 'amber' | 'olive' | 'crimson' | 'muted';
}

const accentColors = {
  amber: '#d4a017',
  olive: '#4a5d23',
  crimson: '#8b1a1a',
  muted: '#8a8578',
};

export function StatCard({
  label,
  value,
  unit,
  icon,
  accent = 'amber',
}: StatCardProps) {
  const color = accentColors[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-command-panel border border-command-border rounded-lg p-6 hover:border-opacity-70 transition-colors cursor-default"
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-command-muted">{label}</p>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-2">
        <p
          className="text-3xl font-bold font-[family-name:var(--font-mono-hud)]"
          style={{ color }}
        >
          {formatPersianNumber(value)}
        </p>
        {unit && <span className="text-sm text-command-muted">{unit}</span>}
      </div>
    </motion.div>
  );
}
