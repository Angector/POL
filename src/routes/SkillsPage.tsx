import { useState } from 'react';
import { useSkills } from '../hooks/useSkills';
import { SkillBranch } from '../components/skillTree/SkillBranch';
import { SkillDetailModal } from '../components/skillTree/SkillDetailModal';
import { formatPersianNumber } from '../lib/format';
import type { SkillNodeDefinition } from '../types/skill';

export default function SkillsPage() {
  const { skills, unlockedCount, totalCount, loading, error } = useSkills();
  const [selectedNode, setSelectedNode] = useState<(SkillNodeDefinition & { unlocked: boolean; unlocked_at: string | null }) | null>(null);

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

  const orderNodes = skills.filter((s) => s.branch === 'order');
  const courageNodes = skills.filter((s) => s.branch === 'courage');
  const wisdomNodes = skills.filter((s) => s.branch === 'wisdom');
  const steadfastnessNodes = skills.filter((s) => s.branch === 'steadfastness');

  const progressPercent = (unlockedCount / totalCount) * 100;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)] mb-2">
          درخت مهارت فرمانده
        </h1>
        <p className="text-command-muted">
          مسیر پیشرفت شما در چهار شاخه
        </p>
      </div>

      <div className="bg-command-panel border border-command-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-command-muted">پیشرفت کلی</p>
          <p className="text-sm text-command-amber font-bold">
            {formatPersianNumber(unlockedCount)} / {formatPersianNumber(totalCount)}
          </p>
        </div>
        <div className="w-full h-3 bg-command-bg rounded-full overflow-hidden">
          <div
            className="h-full bg-command-amber transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <SkillBranch branch="order" nodes={orderNodes} onSelect={setSelectedNode} />
        <SkillBranch branch="courage" nodes={courageNodes} onSelect={setSelectedNode} />
        <SkillBranch branch="wisdom" nodes={wisdomNodes} onSelect={setSelectedNode} />
        <SkillBranch branch="steadfastness" nodes={steadfastnessNodes} onSelect={setSelectedNode} />
      </div>

      <SkillDetailModal node={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  );
}
