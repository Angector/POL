import { AnimatePresence } from 'motion/react';
import type { Habit, HabitLog, HabitFrequency } from '../../types/habit';
import { HabitRow } from './HabitRow';
import { isToday, isInCurrentWeek, isInCurrentMonth } from '../../lib/dateUtils';

interface HabitListProps {
  frequency: HabitFrequency;
  habits: Habit[];
  logs: HabitLog[];
  onToggle: (habitId: number) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: number) => void;
  onCreate: () => void;
  onSeedDefaults: () => void;
  showSeedButton: boolean;
}

export function HabitList({
  frequency,
  habits,
  logs,
  onToggle,
  onEdit,
  onDelete,
  onCreate,
  onSeedDefaults,
  showSeedButton,
}: HabitListProps) {
  const filteredHabits = habits.filter(h => h.frequency === frequency);

  const isCompleted = (habitId: number): boolean => {
    return logs.some(log => {
      if (log.habit_id !== habitId) return false;
      if (!log.completed) return false;

      switch (frequency) {
        case 'daily':
          return isToday(log.log_date);
        case 'weekly':
          return isInCurrentWeek(log.log_date);
        case 'monthly':
          return isInCurrentMonth(log.log_date);
      }
    });
  };

  if (filteredHabits.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-command-muted mb-4">هنوز ماموریتی تعریف نشده است.</p>
        {showSeedButton && (
          <button
            onClick={onSeedDefaults}
            className="px-6 py-3 bg-command-olive text-white font-bold rounded-lg hover:brightness-110 transition-all mb-4"
          >
            افزودن ۵ ماموریت پیش‌فرض
          </button>
        )}
        <div>
          <button
            onClick={onCreate}
            className="px-6 py-3 bg-command-amber text-command-bg font-bold rounded-lg hover:brightness-110 transition-all"
          >
            + افزودن اولین ماموریت
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {filteredHabits.map((habit) => (
          <HabitRow
            key={habit.id}
            habit={habit}
            completed={isCompleted(habit.id)}
            onToggle={() => onToggle(habit.id)}
            onEdit={() => onEdit(habit)}
            onDelete={() => onDelete(habit.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
