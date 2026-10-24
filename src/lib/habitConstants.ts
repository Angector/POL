import type { HabitCategory, HabitFrequency } from '../types/habit';

export const CATEGORY_INFO: Record<HabitCategory, { label: string; icon: string; color: string }> = {
  internal: { label: 'جنگ داخلی', icon: '🛡', color: 'crimson' },
  external: { label: 'جنگ خارجی', icon: '⚔️', color: 'amber' },
};

export const FREQUENCY_LABELS: Record<HabitFrequency, string> = {
  daily: 'روزانه',
  weekly: 'هفتگی',
  monthly: 'ماهانه',
};

export const FREQUENCY_DAYS: Record<HabitFrequency, number> = {
  daily: 1,
  weekly: 7,
  monthly: 30,
};

export const DEFAULT_HABITS = [
  { title: 'پایداری در جنگ داخلی', category: 'internal' as const, frequency: 'daily' as const, points: 10 },
  { title: '۳۰ دقیقه ورزش', category: 'external' as const, frequency: 'daily' as const, points: 5 },
  { title: '۳۰ دقیقه مطالعه', category: 'external' as const, frequency: 'daily' as const, points: 5 },
  { title: 'خواب پیش از ۲۳', category: 'external' as const, frequency: 'daily' as const, points: 3 },
  { title: '۱۰ دقیقه مدیتیشن', category: 'external' as const, frequency: 'daily' as const, points: 3 },
];
