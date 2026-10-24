export type Advisor = 'patience' | 'war' | 'mirror' | 'sage';

export interface CouncilMessage {
  id: number;
  user_id: string;
  advisor: Advisor;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokens_used: number | null;
  created_at: string;
}
