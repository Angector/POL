export type HabitCategory = 'internal' | 'external';
export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

export interface Habit {
  id: number;
  user_id: string;
  title: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  points: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HabitLog {
  id: number;
  habit_id: number;
  user_id: string;
  log_date: string;
  completed: boolean;
  points_earned: number;
  created_at: string;
}
