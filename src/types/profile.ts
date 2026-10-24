export interface Profile {
  id: string;
  callsign: string;
  territory_name: string | null;
  rank: string;
  streak_days: number;
  willpower: number;
  morale: number;
  total_points: number;
  crest_seed: string | null;
  season_id: number | null;
  is_anonymous: boolean;
  oath_signed_at: string | null;
  oath_signature: string | null;
  cycle_started_at: string | null;
  current_cycle: number;
  rise_buff_until: string | null;
  created_at: string;
  updated_at: string;
}

export interface PublicProfile {
  id: string;
  callsign: string;
  territory_name: string | null;
  rank: string;
  total_points: number;
  crest_seed: string | null;
  is_anonymous: boolean;
}
