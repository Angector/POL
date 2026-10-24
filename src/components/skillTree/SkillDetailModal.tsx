import { motion, AnimatePresence } from 'motion/react';
import { formatDate, formatPersianNumber } from '../../lib/format';
import { BRANCH_INFO } from '../../lib/skillDefinitions';
import type { SkillNodeDefinition } from '../../types/skill';

interface SkillDetailModalProps {
  node: (SkillNodeDefinition & { unlocked: boolean; unlocked_at: string | null }) | null;
  onClose: () => void;
}

export function SkillDetailModal({ node, onClose }: SkillDetailModalProps) {
  if (!node) return null;

  const branchInfo = BRANCH_INFO[node.branch];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-command-panel border border-command-border rounded-lg p-6 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-6">
            <div
              className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl border-2 mb-4"
              style={{
                backgroundColor: node.unlocked ? `${branchInfo.color}20` : '#141a12',
                borderColor: node.unlocked ? branchInfo.color : '#2a3520',
              }}
            >
              {node.unlocked ? node.icon : '🔒'}
            </div>
            <h2
              className="text-2xl font-bold font-[family-name:var(--font-serif-epic)] mb-2"
              style={{ color: node.unlocked ? branchInfo.color : '#8a8578' }}
            >
              {node.name}
            </h2>
            <p className="text-sm text-command-muted">
              شاخه: {branchInfo.label}
            </p>
          </div>

          <div className="bg-command-bg border border-command-border rounded p-4 mb-4">
            <h3 className="text-sm font-bold text-command-amber mb-2">توضیح</h3>
            <p className="text-sm text-command-text">{node.description}</p>
          </div>

          <div className="bg-command-bg border border-command-border rounded p-4 mb-6">
            <h3 className="text-sm font-bold text-command-amber mb-2">شرط باز شدن</h3>
            <p className="text-sm text-command-text">
              {formatPersianNumber(node.threshold)} امتیاز کل
            </p>
          </div>

          <div className="text-center mb-6">
            {node.unlocked ? (
              <div>
                <p className="text-command-olive font-bold mb-1">✓ باز شده</p>
                {node.unlocked_at && (
                  <p className="text-xs text-command-muted">
                    تاریخ: {formatDate(node.unlocked_at)}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-command-muted">
                🔒 قفل — {formatPersianNumber(node.threshold)} امتیاز نیاز است
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-command-bg border border-command-border text-command-muted rounded hover:border-command-text transition-colors"
          >
            بستن
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
