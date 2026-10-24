export type GeneralStatus = 'home' | 'dispatched' | 'received';

export interface ExperienceArchive {
  streak_days: number;
  total_points: number;
  resisted_urges: number;
  defeated_urges: number;
  freed_cities: number;
  completed_habits: number;
  completed_goals: number;
  narrative: string;
}

export interface General {
  id: number;
  user_id: string;
  name: string;
  rank_earned: string;
  portrait_seed: string;
  experience_archive: ExperienceArchive;
  status: GeneralStatus;
  sent_to_user_id: string | null;
  received_from_user_id: string | null;
  original_general_id: number | null;
  sent_at: string | null;
  received_at: string | null;
  created_at: string;
}
