import type { LetterType, AllianceType } from '../types/social';

export const LETTER_TYPE_INFO: Record<LetterType, { label: string; icon: string; color: string }> = {
  help: { label: 'درخواست کمک', icon: '🆘', color: 'crimson' },
  resource: { label: 'منبع', icon: '🎁', color: 'amber' },
  general: { label: 'ژنرال', icon: '🎖', color: 'olive' },
  congrats: { label: 'تبریک', icon: '🎉', color: 'amber' },
  rise: { label: 'برخاستن', icon: '🔥', color: 'crimson' },
};

export const ALLIANCE_TYPE_INFO: Record<AllianceType, { label: string; icon: string; color: string; description: string }> = {
  truce: { 
    label: 'آتش‌بس', 
    icon: '🤝', 
    color: 'olive',
    description: 'تعهد ملایم — دو طرف متعهد می‌شوند به هم روحیه بدهند'
  },
  alliance: { 
    label: 'اتحاد رسمی', 
    icon: '⚔️', 
    color: 'amber',
    description: 'تعهد قوی‌تر — اگر یکی لغزش کرد، دیگری می‌تواند کمک کند'
  },
};
