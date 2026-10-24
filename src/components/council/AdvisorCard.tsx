import { motion } from 'motion/react';
import type { Advisor } from '../../types/council';
import { ADVISORS } from '../../lib/advisorConstants';

interface AdvisorCardProps {
  advisor: Advisor;
  active: boolean;
  onClick: () => void;
}

export function AdvisorCard({ advisor, active, onClick }: AdvisorCardProps) {
  const info = ADVISORS.find((a) => a.key === advisor)!;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-4 rounded-lg border-2 transition-all ${
        active
          ? 'border-command-amber bg-command-amber/10'
          : 'border-command-border bg-command-panel hover:border-command-amber/50'
      }`}
    >
      <div className="text-4xl mb-2">{info.icon}</div>
      <h3 className="text-lg font-bold text-command-amber font-[family-name:var(--font-serif-epic)]">
        {info.nameFa}
      </h3>
      <p className="text-xs text-command-muted">{info.name}</p>
      <p className="text-sm text-command-text mt-2">{info.description}</p>
    </motion.button>
  );
}
