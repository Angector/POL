export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface OraclePrediction {
  id: number;
  user_id: string;
  for_date: string;
  risk_level: RiskLevel;
  risk_window: string | null;
  reason: string;
  suggestion: string;
  generated_at: string;
}
