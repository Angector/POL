export type SkillBranch = 'order' | 'courage' | 'wisdom' | 'steadfastness';

export interface SkillNodeDefinition {
  key: string;
  branch: SkillBranch;
  index: number;
  name: string;
  description: string;
  threshold: number;
  icon: string;
}

export interface Skill extends SkillNodeDefinition {
  id?: number;
  user_id?: string;
  unlocked: boolean;
  unlocked_at: string | null;
}
