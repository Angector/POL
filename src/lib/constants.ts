export interface Rank {
  key: string;
  title: string;
  minPoints: number;
  color: string;
  icon: string;
}

export const RANKS: Rank[] = [
  { key: 'soldier', title: 'سرباز', minPoints: 0, color: '#8a8578', icon: '⚔️' },
  { key: 'corporal', title: 'گروهبان', minPoints: 500, color: '#4a5d23', icon: '🛡️' },
  { key: 'captain', title: 'سروان', minPoints: 1500, color: '#2a3520', icon: '🏹' },
  { key: 'major', title: 'سرگرد', minPoints: 3500, color: '#d4a017', icon: '⚡' },
  { key: 'colonel', title: 'سرهنگ', minPoints: 7000, color: '#c9952e', icon: '🗡️' },
  { key: 'general', title: 'ژنرال', minPoints: 12000, color: '#b8860b', icon: '👑' },
  { key: 'commander', title: 'فرمانده‌ی کل', minPoints: 20000, color: '#996515', icon: '🏆' },
  { key: 'king', title: 'پادشاه', minPoints: 35000, color: '#8b6914', icon: '👑' },
];

export function getRankByPoints(points: number): Rank {
  let currentRank = RANKS[0];
  for (const rank of RANKS) {
    if (points >= rank.minPoints) {
      currentRank = rank;
    }
  }
  return currentRank;
}

export function getNextRank(currentPoints: number): Rank | null {
  for (const rank of RANKS) {
    if (currentPoints < rank.minPoints) {
      return rank;
    }
  }
  return null;
}

export interface NavItem {
  path: string;
  label: string;
  icon: string;
  phase?: number;
}

export const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', label: 'داشبورد', icon: '🏰' },
  { path: '/territory', label: 'سرزمین', icon: '🗺️' },
  { path: '/todo', label: 'ماموریت‌ها', icon: '📋' },
  { path: '/goals', label: 'اهداف', icon: '🎯' },
  { path: '/world', label: 'جهان مشترک', icon: '🌍' },
  { path: '/letters', label: 'نامه‌ها', icon: '✉️' },
  { path: '/alliances', label: 'اتحاد', icon: '🤝' },
  { path: '/patterns', label: 'الگوی حمله', icon: '📊' },
  { path: '/generals', label: 'تالار ژنرال‌ها', icon: '🎖' },
  { path: '/relics', label: 'یادگاری‌ها', icon: '🏺' },
  { path: '/skills', label: 'درخت مهارت', icon: '🌳' },
  { path: '/council', label: 'شورای مشاوران', icon: '🧙', phase: 9 },
  { path: '/oracle', label: 'اوراکل', icon: '🔮', phase: 9 },
  { path: '/mirror', label: 'آینه‌ی جنگ', icon: '🪞', phase: 9 },
  { path: '/profile', label: 'پروفایل', icon: '👤' },
];

export const STATUS_COLORS = {
  locked: '#8a8578',
  fighting: '#d4a017',
  freed: '#4a5d23',
};

export const COUNCIL_MESSAGES = [
  'فرمانده، امروز سنگر خواب را تقویت کن. دشمن شب‌ها حمله می‌کند.',
  'به یاد داشته باش: هر عادت کوچک، یک سرباز در ارتش تاریکی است.',
  'امروز یک قدم کوچک بردار. پیروزی‌های بزرگ از قدم‌های کوچک آغاز می‌شوند.',
  'فرمانده، اراده‌ات را تقویت کن. دشمن منتظر لحظه‌ی ضعف توست.',
  'امروز با یک عادت بد بجنگ. حتی یک پیروزی، روحیه‌ات را بالا می‌برد.',
  'به یاد داشته باش: تو فرمانده‌ی قلعه‌ی ذهن خود هستی. تسلیم نشو.',
  'امروز یک عادت خوب بساز. هر عادت خوب، یک سرباز در ارتش نور است.',
  'فرمانده، استراحت کن اما تسلیم نشو. فردا روز جدیدی برای نبرد است.',
  'به یاد داشته باش: ثبات مهم‌تر از شدت است. هر روز یک قدم کوچک.',
  'امروز به خودت قول بده: یک عادت بد را ترک می‌کنم. فقط یکی.',
];

export function getMessageOfTheDay(): string {
  const dayOfMonth = new Date().getDate();
  const index = dayOfMonth % COUNCIL_MESSAGES.length;
  return COUNCIL_MESSAGES[index];
}
