export interface RelicDefinition {
  key: string;
  name: string;
  description: string;
  icon: string;
  condition_type: string;
  condition_value: number | null;
}

export interface Relic extends RelicDefinition {
  id?: number;
  user_id?: string;
  unlocked: boolean;
  unlocked_at: string | null;
}
