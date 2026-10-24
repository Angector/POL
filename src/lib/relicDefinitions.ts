import type { RelicDefinition } from '../types/relic';

export const RELIC_DEFINITIONS: RelicDefinition[] = [
  { key: 'first_freed_city', name: 'اولین فتح', description: 'اولین شهر آزاد شده', icon: '🏰', condition_type: 'freed_cities', condition_value: 1 },
  { key: 'streak_7', name: 'هفته‌ی پایداری', description: '۷ روز پایداری متوالی', icon: '🔥', condition_type: 'streak_days', condition_value: 7 },
  { key: 'streak_30', name: 'ماه‌ی پایداری', description: '۳۰ روز پایداری متوالی', icon: '🌟', condition_type: 'streak_days', condition_value: 30 },
  { key: 'streak_100', name: 'صد روز', description: '۱۰۰ روز پایداری متوالی', icon: '💎', condition_type: 'streak_days', condition_value: 100 },
  { key: 'first_general', name: 'اولین ژنرال', description: 'اولین ژنرال متولد شد', icon: '🎖', condition_type: 'generals_count', condition_value: 1 },
  { key: 'five_generals', name: 'پنج ژنرال', description: 'پنج ژنرال متولد شدند', icon: '🏆', condition_type: 'generals_count', condition_value: 5 },
  { key: 'first_alliance', name: 'اولین پیمان', description: 'اولین پیمان بسته شد', icon: '🤝', condition_type: 'alliances_count', condition_value: 1 },
  { key: 'first_letter_received', name: 'اولین نامه', description: 'اولین نامه دریافت شد', icon: '✉️', condition_type: 'letters_received', condition_value: 1 },
  { key: 'resisted_10', name: 'دفاع‌کار', description: '۱۰ حمله دفع شده', icon: '🛡', condition_type: 'resisted_urges', condition_value: 10 },
  { key: 'resisted_50', name: 'جنگجوی سخت‌جان', description: '۵۰ حمله دفع شده', icon: '⚔️', condition_type: 'resisted_urges', condition_value: 50 },
  { key: 'resisted_100', name: 'افسانه', description: '۱۰۰ حمله دفع شده', icon: '👑', condition_type: 'resisted_urges', condition_value: 100 },
  { key: 'first_goal_completed', name: 'اولین هدف', description: 'اولین هدف تکمیل شد', icon: '🎯', condition_type: 'completed_goals', condition_value: 1 },
  { key: 'three_goals', name: 'سه هدف', description: 'سه هدف تکمیل شد', icon: '🏅', condition_type: 'completed_goals', condition_value: 3 },
  { key: 'first_sos', name: 'اولین SOS', description: 'اولین SOS موفق', icon: '🆘', condition_type: 'sos_count', condition_value: 1 },
  { key: 'sos_master', name: 'استاد SOS', description: '۱۰ SOS موفق', icon: '🚨', condition_type: 'sos_count', condition_value: 10 },
  { key: 'rank_corporal', name: 'گروهبان', description: 'رسیدن به رتبه گروهبان', icon: '⭐', condition_type: 'total_points', condition_value: 500 },
  { key: 'rank_captain', name: 'سروان', description: 'رسیدن به رتبه سروان', icon: '⭐⭐', condition_type: 'total_points', condition_value: 1500 },
  { key: 'rank_general', name: 'ژنرال', description: 'رسیدن به رتبه ژنرال', icon: '⭐⭐⭐', condition_type: 'total_points', condition_value: 12000 },
  { key: 'rank_king', name: 'پادشاه', description: 'رسیدن به رتبه پادشاه', icon: '👑', condition_type: 'total_points', condition_value: 35000 },
];
