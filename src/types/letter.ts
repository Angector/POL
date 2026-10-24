export type LetterType = 'help' | 'resource' | 'general' | 'congrats' | 'rise';

export interface Letter {
  id: number;
  from_user_id: string | null;
  to_user_id: string;
  type: LetterType;
  subject: string | null;
  body: string;
  accepted: boolean | null;
  read_at: string | null;
  from_system: boolean;
  created_at: string;
}

export interface LetterWithSender extends Letter {
  sender: {
    callsign: string;
    crest_seed: string;
  } | null;
}
