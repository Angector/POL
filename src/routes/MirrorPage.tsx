import { useUrgeStats } from '../hooks/useUrgeStats';
import { useAuth } from '../context/AuthContext';
import { useGenerals } from '../hooks/useGenerals';
import { useRelics } from '../hooks/useRelics';
import { useSkills } from '../hooks/useSkills';
import { MirrorStats } from '../components/mirror/MirrorStats';
import { WhatYouLost } from '../components/mirror/WhatYouLost';
import { WhatYouGained } from '../components/mirror/WhatYouGained';
import { HeatmapHour } from '../components/patterns/HeatmapHour';
import { HeatmapDay } from '../components/patterns/HeatmapDay';
import { TriggerBars } from '../components/patterns/TriggerBars';
import { PatternSummary } from '../components/patterns/PatternSummary';
import { Card } from '../components/ui/Card';

export default function MirrorPage() {
  const { profile } = useAuth();
  const { stats, loading, error } = useUrgeStats(30);
  const { generals } = useGenerals();
  const { unlockedCount: relicsCount } = useRelics();
  const { unlockedCount: skillsCount } = useSkills();

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

  if (!stats || stats.totalUrges < 3) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)] mb-2">
            آینه‌ی جنگ
          </h1>
          <p className="text-command-muted">
            حقیقت، بدون شرم. این آینه است، نه قاضی.
          </p>
        </div>
        <Card className="text-center py-12">
          <p className="text-command-muted mb-4">
            برای دیدن آینه، حداقل ۳ حمله ثبت کن.
          </p>
          <p className="text-sm text-command-muted">
            حملات را از طریق دکمه‌ی «حمله‌ی دشمن» در مپ ثبت کن.
          </p>
        </Card>
      </div>
    );
  }

  const topTrigger = Object.entries(stats.byTrigger)
    .sort((a, b) => b[1] - a[1])[0]?.[0] as string | null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)] mb-2">
          آینه‌ی جنگ
        </h1>
        <p className="text-command-muted">
          حقیقت، بدون شرم. این آینه است، نه قاضی.
        </p>
      </div>

      <MirrorStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <HeatmapHour data={stats.byHour} />
        </Card>
        <Card>
          <HeatmapDay data={stats.byDayOfWeek} />
        </Card>
        <Card>
          <TriggerBars data={stats.byTrigger} />
        </Card>
        <Card>
          <PatternSummary stats={stats} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WhatYouLost
          defeatedCount={stats.defeatCount}
          topTrigger={topTrigger as any}
        />
        {profile && (
          <WhatYouGained
            profile={profile}
            generalsCount={generals.length}
            relicsCount={relicsCount}
            skillsCount={skillsCount}
          />
        )}
      </div>
    </div>
  );
}
