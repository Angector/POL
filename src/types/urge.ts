export type UrgeTrigger = 'stress' | 'boredom' | 'loneliness' | 'late_night' | 'anger' | 'tiredness' | 'other';

export interface Urge {
  id: number;
  user_id: string;
  occurred_at: string;
  intensity: number;
  trigger_context: UrgeTrigger;
  resisted: boolean;
  private_note: string | null;
  created_at: string;
}
