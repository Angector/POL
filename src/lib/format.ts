export function formatPersianNumber(n: number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const formatted = n.toLocaleString('en-US');
  return formatted.replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
}

export function formatDate(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return 'تاریخ نامعتبر';
  }
}

export function formatRelativeTime(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
      return 'همین الان';
    } else if (diffMinutes < 60) {
      return `${formatPersianNumber(diffMinutes)} دقیقه پیش`;
    } else if (diffHours < 24) {
      return `${formatPersianNumber(diffHours)} ساعت پیش`;
    } else if (diffDays < 7) {
      return `${formatPersianNumber(diffDays)} روز پیش`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${formatPersianNumber(weeks)} هفته پیش`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${formatPersianNumber(months)} ماه پیش`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${formatPersianNumber(years)} سال پیش`;
    }
  } catch {
    return 'زمان نامعتبر';
  }
}
