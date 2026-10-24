import { StatCard } from '../profile/StatCard';
import type { UrgeStats } from '../../hooks/useUrgeStats';

interface MirrorStatsProps {
  stats: UrgeStats;
}

export function MirrorStats({ stats }: MirrorStatsProps) {
  const lostDays = Math.round(stats.defeatCount * 0.5);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        label="کل حملات"
        value={stats.totalUrges}
        icon="⚔️"
        accent="muted"
      />
      <StatCard
        label="دفع‌شده"
        value={stats.resistedCount}
        icon="🛡️"
        accent="olive"
      />
      <StatCard
        label="نرخ پیروزی"
        value={Math.round(stats.resistanceRate)}
        unit="%"
        icon="📊"
        accent="amber"
      />
      <StatCard
        label="روزهای از دست رفته"
        value={lostDays}
        unit="روز"
        icon="⏳"
        accent="crimson"
      />
    </div>
  );
}
