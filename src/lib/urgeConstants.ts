import type { UrgeTrigger } from '../types/urge';

export const TRIGGER_LABELS: Record<UrgeTrigger, string> = {
  stress: 'استرس',
  boredom: 'بی‌حوصلگی',
  loneliness: 'تنهایی',
  late_night: 'شب و تنهایی',
  anger: 'خشم',
  tiredness: 'خستگی',
  other: 'سایر',
};

export const TRIGGER_ICONS: Record<UrgeTrigger, string> = {
  stress: '😰',
  boredom: '😑',
  loneliness: '🥺',
  late_night: '🌙',
  anger: '😠',
  tiredness: '😴',
  other: '❓',
};

export const INTENSITY_LABELS: Record<number, string> = {
  1: 'خیلی ضعیف',
  2: 'ضعیف',
  3: 'کم',
  4: 'متوسط-کم',
  5: 'متوسط',
  6: 'متوسط-زیاد',
  7: 'زیاد',
  8: 'خیلی زیاد',
  9: 'شدید',
  10: 'حمله‌ی تمام‌عیار',
};

export const INTENSITY_COLORS: string[] = [
  '#4a5d23', // 1 - green
  '#5a6d33', // 2
  '#6a7d43', // 3
  '#7a8d53', // 4
  '#d4a017', // 5 - amber
  '#c9952e', // 6
  '#b8860b', // 7 - orange
  '#a67c00', // 8
  '#8b1a1a', // 9 - red
  '#6b0000', // 10 - crimson
];
