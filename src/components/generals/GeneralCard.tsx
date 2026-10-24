import { motion } from 'motion/react';
import { GeneralPortrait } from './GeneralPortrait';
import { formatRelativeTime } from '../../lib/format';
import type { General } from '../../types/general';

interface GeneralCardProps {
  general: General;
  onClick: () => void;
  onDispatch?: () => void;
  receivedFrom?: string;
}

export function GeneralCard({ general, onClick, onDispatch, receivedFrom }: GeneralCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-command-panel border border-command-border rounded-lg p-4 cursor-pointer hover:border-command-amber transition-colors"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <GeneralPortrait seed={general.portrait_seed} size={80} />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-command-amber font-[family-name:var(--font-serif-epic)] truncate">
            {general.name}
          </h3>
          <p className="text-sm text-command-muted mb-1">
            رتبه: {general.rank_earned}
          </p>
          <p className="text-xs text-command-muted mb-2">
            {formatRelativeTime(general.created_at)}
          </p>
          {receivedFrom && (
            <p className="text-xs text-command-olive mb-2">
              از: {receivedFrom}
            </p>
          )}
          <p className="text-sm text-command-text line-clamp-2">
            {general.experience_archive.narrative}
          </p>
        </div>
      </div>
      {onDispatch && general.status === 'home' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDispatch();
          }}
          className="mt-3 w-full py-2 bg-command-amber/20 border border-command-amber text-command-amber rounded hover:bg-command-amber/30 transition-colors text-sm"
        >
          ارسال به همرزم
        </button>
      )}
    </motion.div>
  );
}
