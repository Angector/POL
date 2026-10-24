import { motion } from 'motion/react';
import type { Habit } from '../../types/habit';
import { CATEGORY_INFO } from '../../lib/habitConstants';
import { formatPersianNumber } from '../../lib/format';

interface HabitRowProps {
  habit: Habit;
  completed: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function HabitRow({ habit, completed, onToggle, onEdit, onDelete }: HabitRowProps) {
  const categoryInfo = CATEGORY_INFO[habit.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-center gap-4 p-4 bg-command-panel border border-command-border rounded-lg ${
        completed ? 'opacity-60' : ''
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className="relative w-8 h-8 rounded border-2 border-command-border flex items-center justify-center transition-colors hover:border-command-amber"
        role="checkbox"
        aria-checked={completed}
      >
        {completed && (
          <motion.svg
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3 }}
            className="w-5 h-5 text-command-amber"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-command-text ${completed ? 'line-through' : ''}`}>
          {habit.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm">{categoryInfo.icon}</span>
          <span className="text-xs text-command-muted">{categoryInfo.label}</span>
          <span className="text-xs text-command-amber">
            +{formatPersianNumber(habit.points)} امتیاز
          </span>
        </div>
      </div>

      {/* Menu */}
      <div className="flex items-center gap-2">
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
    </motion.div>
  );
}
