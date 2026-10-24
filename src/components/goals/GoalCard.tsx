import { motion } from 'motion/react';
import type { Goal, GoalUpdate } from '../../types/goal';
import { ProgressRing } from './ProgressRing';
import { formatDate, formatPersianNumber } from '../../lib/format';

interface GoalCardProps {
  goal: Goal;
  updates: GoalUpdate[];
  onProgress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function GoalCard({ goal, updates, onProgress, onEdit, onDelete }: GoalCardProps) {
  const progress = (goal.current_value / goal.target_value) * 100;
  const recentUpdates = updates.slice(0, 3);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-command-panel border border-command-border rounded-lg p-6"
    >
      <div className="flex gap-4">
        {/* Progress Ring */}
        <div className="flex-shrink-0">
          <ProgressRing
            progress={progress}
            size={100}
            color={progress >= 100 ? '#4a5d23' : '#d4a017'}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-bold text-command-text">{goal.title}</h3>
            {progress >= 100 && (
              <span className="px-2 py-1 bg-command-olive/20 border border-command-olive text-command-olive text-xs rounded">
                تکمیل‌شده ✓
              </span>
            )}
          </div>

          {goal.description && (
            <p className="text-sm text-command-muted mb-2">{goal.description}</p>
          )}

          <div className="flex items-center gap-4 text-sm mb-3">
            <span className="text-command-text">
              {formatPersianNumber(goal.current_value)} / {formatPersianNumber(goal.target_value)} {goal.unit}
            </span>
            {goal.deadline && (
              <span className="text-command-muted">
                مهلت: {formatDate(goal.deadline)}
              </span>
            )}
          </div>

          {/* Recent updates */}
          {recentUpdates.length > 0 && (
            <div className="space-y-1 mb-3">
              {recentUpdates.map((update) => (
                <div key={update.id} className="text-xs text-command-muted flex items-center gap-2">
                  <span className="text-command-amber">+{formatPersianNumber(update.delta)}</span>
                  {update.note && <span className="truncate">{update.note}</span>}
                  <span className="ml-auto">{formatDate(update.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onProgress}
            className="p-2 text-command-amber hover:text-command-text transition-colors"
            aria-label="ثبت پیشرفت"
          >
            +
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-command-muted hover:text-command-text transition-colors"
            aria-label="ویرایش"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-command-muted hover:text-command-crimson transition-colors"
            aria-label="حذف"
          >
            🗑️
          </button>
        </div>
      </div>
    </motion.div>
  );
}
