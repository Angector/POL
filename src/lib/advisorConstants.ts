import type { Advisor } from '../types/council';
import type { RiskLevel } from '../types/oracle';

export interface AdvisorInfo {
  key: Advisor;
  name: string;
  nameFa: string;
  icon: string;
  color: string;
  description: string;
  quickActions: string[];
  welcomeMessage: string;
}

export const ADVISORS: AdvisorInfo[] = [
  {
    key: 'patience',
    name: 'The Steadfast',
    nameFa: 'الصلب',
    icon: '🕊️',
    color: 'olive',
    description: 'آرامش در لحظه‌ی بحران',
    quickActions: ['الان وسوسه دارم', 'چطور آرام شوم؟', 'نفس عمیق'],
    welcomeMessage: 'سلام فرمانده. من اینجام. هر وقت خواستی حرف بزنی، من می‌شنوم.',
  },
  {
    key: 'war',
    name: 'The Marshal',
    nameFa: 'المارشال',
    icon: '⚔️',
    color: 'amber',
    description: 'استراتژیست و فرمانده',
    quickActions: ['برنامه‌ی فردا', 'ماموریت امروز', 'چطور قوی‌تر شوم؟'],
    welcomeMessage: 'فرمانده! ارتش منتظر فرمان توست. چه ماموریتی داری؟',
  },
  {
    key: 'mirror',
    name: 'The Mirror',
    nameFa: 'المرآة',
    icon: '🪞',
    color: 'muted',
    description: 'تحلیل‌گر داده‌ها',
    quickActions: ['الگوی حمله‌ام چیست؟', 'نقاط ضعفم کجاست؟', 'یک هفته گذشته چطور بود؟'],
    welcomeMessage: 'داده‌ها آماده‌ی تحلیل هستند. چه سوالی داری؟',
  },
  {
    key: 'sage',
    name: 'The Sage',
    nameFa: 'الحکیم',
    icon: '🧙',
    color: 'amber',
    description: 'فیلسوف و راهنمای بلندمدت',
    quickActions: ['چرا اینقدر خسته‌ام؟', 'معنای این نبرد چیست؟', 'آینده‌ام چه می‌شود؟'],
    welcomeMessage: 'فرمانده، بیا با هم فکر کنیم. چه سوالی در ذهنت هست؟',
  },
];

export const RISK_INFO: Record<RiskLevel, { label: string; color: string; bgClass: string }> = {
  low: { label: 'کم', color: '#4a5d23', bgClass: 'bg-green-900/30 border-green-700' },
  medium: { label: 'متوسط', color: '#d4a017', bgClass: 'bg-amber-900/30 border-amber-700' },
  high: { label: 'بالا', color: '#c9952e', bgClass: 'bg-orange-900/30 border-orange-700' },
  critical: { label: 'بحرانی', color: '#8b1a1a', bgClass: 'bg-red-900/30 border-red-700' },
};
