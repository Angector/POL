import type { Habit, HabitLog } from '../types/habit';

export function calcExternalStreak(logs: HabitLog[], habits: Habit[]): number {
  // Get external habits
  const externalHabitIds = new Set(
    habits.filter(h => h.category === 'external' && h.is_active).map(h => h.id)
  );

  if (externalHabitIds.size === 0) return 0;

  // Group logs by date
  const logsByDate = new Map<string, Set<number>>();
  
  for (const log of logs) {
    if (!externalHabitIds.has(log.habit_id)) continue;
    if (!log.completed) continue;
    
    const dateKey = log.log_date;
    if (!logsByDate.has(dateKey)) {
      logsByDate.set(dateKey, new Set());
    }
    logsByDate.get(dateKey)!.add(log.habit_id);
  }

  // Calculate streak from today backwards
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateKey = checkDate.toISOString().split('T')[0];
    
    const habitIdsForDate = logsByDate.get(dateKey);
    
    // If at least one external habit was completed on this date
    if (habitIdsForDate && habitIdsForDate.size > 0) {
      streak++;
    } else {
      // If today has no logs yet, don't break the streak
      if (i === 0) continue;
      break;
    }
  }

  return streak;
}
