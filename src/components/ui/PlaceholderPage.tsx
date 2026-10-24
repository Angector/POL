import { Link } from 'react-router-dom';
import { Card } from './Card';

interface PlaceholderPageProps {
  title: string;
  phase: number;
  description?: string;
  backTo?: string;
  icon?: string;
}

export function PlaceholderPage({
  title,
  phase,
  description,
  backTo = '/dashboard',
  icon = '🏰',
}: PlaceholderPageProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="text-center max-w-md">
        <div className="text-6xl mb-4">{icon}</div>
        <h1 className="text-2xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)] mb-4">
          {title}
        </h1>
        <p className="text-command-muted mb-2">
          این بخش در فاز {phase} پیاده‌سازی می‌شود.
        </p>
        {description && (
          <p className="text-sm text-command-muted mb-6">{description}</p>
        )}
        <Link
          to={backTo}
          className="inline-block px-6 py-2 bg-command-amber text-command-bg font-bold rounded hover:brightness-110 transition-all"
        >
          بازگشت به داشبورد
        </Link>
      </Card>
    </div>
  );
}
