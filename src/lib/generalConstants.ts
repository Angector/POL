export const GENERAL_NAMES = [
  'آرش', 'کاوه', 'رستم', 'سهراب', 'اسفندیار', 'گردآفرید', 'بابک', 'مازیار',
  'کوروش', 'داریوش', 'خشایار', 'اردشیر', 'شاپور', 'خسرو', 'بهرام',
  'نادر', 'عباس', 'کریم', 'یعقوب', 'سام', 'زال', 'سیاوش', 'افراسیاب',
  'گیو', 'توس', 'بهمن', 'فرامرز', 'گودرز', 'پیران', 'بژن'
];

export function generateGeneralName(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const index = Math.abs(hash) % GENERAL_NAMES.length;
  return 'ژنرال ' + GENERAL_NAMES[index];
}
