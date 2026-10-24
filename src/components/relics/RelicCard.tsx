import { motion } from 'motion/react';
import { formatDate } from '../../lib/format';
import type { Relic } from '../../types/relic';

interface RelicCardProps {
  relic: Relic;
}

export function RelicCard({ relic }: RelicCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative bg-command-panel border rounded-lg p-6 text-center ${
        relic.unlocked
          ? 'border-command-amber'
          : 'border-command-border opacity-60'
      }`}
    >
      {relic.unlocked && (
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            boxShadow: '0 0 30px rgba(212, 160, 23, 0.2)',
          }}
        />
      )}
      <div className="relative">
        <div className={`text-5xl mb-3 ${relic.unlocked ? '' : 'grayscale opacity-40'}`}>
          {relic.icon}
        </div>
        <h3
          className={`text-lg font-bold mb-2 font-[family-name:var(--font-serif-epic)] ${
            relic.unlocked ? 'text-command-amber' : 'text-command-muted'
          }`}
        >
          {relic.name}
        </h3>
        <p className={`text-sm mb-3 ${relic.unlocked ? 'text-command-text' : 'text-command-muted'}`}>
          {relic.unlocked ? relic.description : `شرط: ${relic.description}`}
        </p>
        {relic.unlocked && relic.unlocked_at && (
          <p className="text-xs text-command-muted">
            باز شده: {formatDate(relic.unlocked_at)}
          </p>
        )}
        {!relic.unlocked && (
          <div className="absolute top-2 right-2 text-2xl">🔒</div>
        )}
      </div>
    </motion.div>
  );
}
