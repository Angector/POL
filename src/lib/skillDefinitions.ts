import type { SkillNodeDefinition, SkillBranch } from '../types/skill';

export const SKILL_NODES: SkillNodeDefinition[] = [
  // Order branch
  { key: 'order_1', branch: 'order', index: 1, name: 'برنامه‌ریز', description: '+۵٪ امتیاز عادت‌های روزانه', threshold: 100, icon: '📋' },
  { key: 'order_2', branch: 'order', index: 2, name: 'سازمان‌دهنده', description: '+۱۰٪ امتیاز عادت‌های هفتگی', threshold: 500, icon: '🗂️' },
  { key: 'order_3', branch: 'order', index: 3, name: 'فرمانده‌ی دقیق', description: 'یک عادت روزانه اضافی مجاز', threshold: 1500, icon: '⚙️' },
  { key: 'order_4', branch: 'order', index: 4, name: 'مارشال', description: '+۱۵٪ امتیاز عادت‌ها', threshold: 3500, icon: '🎖️' },
  { key: 'order_5', branch: 'order', index: 5, name: 'معمار', description: '+۲۵٪ total_points', threshold: 7000, icon: '🏛️' },
  
  // Courage branch
  { key: 'courage_1', branch: 'courage', index: 1, name: 'جسور', description: '+۱۰٪ willpower از resist', threshold: 100, icon: '⚔️' },
  { key: 'courage_2', branch: 'courage', index: 2, name: 'بی‌باک', description: '+۲۰٪ willpower از resist', threshold: 500, icon: '🗡️' },
  { key: 'courage_3', branch: 'courage', index: 3, name: 'پیشرو', description: 'SOS +۵ اراده اضافه', threshold: 1500, icon: '🚀' },
  { key: 'courage_4', branch: 'courage', index: 4, name: 'قهرمان', description: 'اولین resist هر روز +۵ بونوس', threshold: 3500, icon: '🦁' },
  { key: 'courage_5', branch: 'courage', index: 5, name: 'اسطوره', description: 'لغزش فقط نیمی از شهرها را می‌گیرد', threshold: 7000, icon: '🐉' },
  
  // Wisdom branch
  { key: 'wisdom_1', branch: 'wisdom', index: 1, name: 'بینا', description: 'خلاصه هفتگی الگوی حمله', threshold: 100, icon: '👁️' },
  { key: 'wisdom_2', branch: 'wisdom', index: 2, name: 'مشاور', description: 'دسترسی به مشاور اضافه', threshold: 500, icon: '🧙' },
  { key: 'wisdom_3', branch: 'wisdom', index: 3, name: 'حکیم', description: 'آینه‌ی جنگ دقیق‌تر', threshold: 1500, icon: '📊' },
  { key: 'wisdom_4', branch: 'wisdom', index: 4, name: 'اوراکل', description: 'پیش‌بینی ۳ روز آینده', threshold: 3500, icon: '🔮' },
  { key: 'wisdom_5', branch: 'wisdom', index: 5, name: 'فرزانگان', description: 'گزارش ماهانه کامل', threshold: 7000, icon: '📜' },
  
  // Steadfastness branch
  { key: 'steadfastness_1', branch: 'steadfastness', index: 1, name: 'استوار', description: '+۵٪ morale از منابع مثبت', threshold: 100, icon: '🛡️' },
  { key: 'steadfastness_2', branch: 'steadfastness', index: 2, name: 'سنگر', description: 'کاهش morale از بی‌توجهی نصف', threshold: 500, icon: '🏰' },
  { key: 'steadfastness_3', branch: 'steadfastness', index: 3, name: 'دیوار', description: 'آتش‌بس ۴ روز به جای ۳', threshold: 1500, icon: '🧱' },
  { key: 'steadfastness_4', branch: 'steadfastness', index: 4, name: 'قلعه', description: 'هر ۷ روز یک شهر بونوس', threshold: 3500, icon: '🏯' },
  { key: 'steadfastness_5', branch: 'steadfastness', index: 5, name: 'سنگ بنیاد', description: 'morale هرگز زیر ۳۰ نمی‌رود', threshold: 7000, icon: '⛰️' },
];

export const BRANCH_INFO: Record<SkillBranch, { label: string; icon: string; color: string }> = {
  order: { label: 'نظم', icon: '📋', color: '#d4a017' },
  courage: { label: 'شجاعت', icon: '⚔️', color: '#8b1a1a' },
  wisdom: { label: 'خرد', icon: '🔮', color: '#4a5d23' },
  steadfastness: { label: 'پایداری', icon: '🛡️', color: '#d4a017' },
};
