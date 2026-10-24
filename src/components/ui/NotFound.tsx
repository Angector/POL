import { Link } from 'react-router-dom';
import { Card } from './Card';

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="text-center max-w-md">
        <div className="text-6xl mb-4">🗺️</div>
        <h1 className="text-2xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)] mb-4">
          ۴۰۴ — سرزمین ناشناخته
        </h1>
        <p className="text-command-muted mb-6">
          این مسیر در نقشه‌ی قلعه وجود ندارد.
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-6 py-2 bg-command-amber text-command-bg font-bold rounded hover:brightness-110 transition-all"
        >
          بازگشت به قلعه
        </Link>
      </Card>
    </div>
  );
}
