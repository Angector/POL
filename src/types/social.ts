// Letter types
export type LetterType = 'help' | 'resource' | 'general' | 'congrats' | 'rise';

export interface Letter {
  id: number;
  from_user_id: string;
  to_user_id: string;
  type: LetterType;
  subject: string | null;
  body: string;
  accepted: boolean | null;
  read_at: string | null;
  created_at: string;
}

export interface LetterWithSender extends Letter {
  sender: {
    callsign: string;
    crest_seed: string;
  };
}

// Alliance types
export type AllianceType = 'truce' | 'alliance';
export type AllianceStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface Alliance {
  id: number;
  requester_id: string;
  recipient_id: string;
  type: AllianceType;
  message: string | null;
  status: AllianceStatus;
  created_at: string;
  responded_at: string | null;
}

export interface AllianceWithUsers extends Alliance {
  requester: { callsign: string; crest_seed: string };
  recipient: { callsign: string; crest_seed: string };
}

// Notification types
export type NotificationType =
  | 'city_freed'
  | 'rise_letter'
  | 'letter_new'
  | 'alliance_request'
  | 'alliance_accepted'
  | 'sos'
  | 'general_received';

export interface AppNotification {
  id: number;
  user_id: string;
  type: NotificationType;
  payload: Record<string, unknown>;
  created_at: string;
  read_at: string | null;
}

// Public profile
export interface PublicProfile {
  id: string;
  callsign: string;
  territory_name: string | null;
  rank: string;
  total_points: number;
  crest_seed: string | null;
  streak_days: number;
  is_anonymous: boolean;
  created_at: string;
  freed_count: number;
}
