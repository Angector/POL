import { useRelics } from '../hooks/useRelics';
import { RelicCard } from '../components/relics/RelicCard';
import { formatPersianNumber } from '../lib/format';

export default function RelicsPage() {
  const { relics, unlockedCount, totalCount, loading, error } = useRelics();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-command-amber font-[family-name:var(--font-mono-hud)]">
          در حال بارگذاری...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-command-crimson/20 border border-command-crimson rounded-lg p-4">
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)] mb-2">
          یادگاری‌های نبرد
        </h1>
        <p className="text-command-muted">
          دستاوردهای شما در مسیر فرماندهی
        </p>
      </div>

      <div className="bg-command-panel border border-command-border rounded-lg p-4 text-center">
        <p className="text-3xl font-bold text-command-amber font-[family-name:var(--font-mono-hud)]">
          {formatPersianNumber(unlockedCount)} / {formatPersianNumber(totalCount)}
        </p>
        <p className="text-sm text-command-muted">یادگاری‌های باز شده</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {relics.map((relic) => (
          <RelicCard key={relic.key} relic={relic} />
        ))}
      </div>
    </div>
  );
}
