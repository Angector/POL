import type { TruceReason } from '../types/truce';

export const TRUCE_REASONS: Record<TruceReason, { label: string; icon: string }> = {
  travel: { label: 'مسافرت', icon: '✈️' },
  illness: { label: 'بیماری', icon: '🤒' },
  family_crisis: { label: 'بحران خانوادگی', icon: '🏚️' },
  exam: { label: 'امتحان', icon: '📝' },
  other: { label: 'سایر', icon: '❓' },
};
