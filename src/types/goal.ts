export interface Goal {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  target_value: number;
  current_value: number;
  unit: string;
  start_date: string;
  deadline: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GoalUpdate {
  id: number;
  goal_id: number;
  user_id: string;
  delta: number;
  note: string | null;
  created_at: string;
}
