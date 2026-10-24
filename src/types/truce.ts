export type TruceReason = 'travel' | 'illness' | 'family_crisis' | 'exam' | 'other';

export interface Truce {
  id: number;
  user_id: string;
  reason: TruceReason;
  started_at: string;
  ends_at: string;
  cancelled_at: string | null;
  days_remaining?: number;
}
