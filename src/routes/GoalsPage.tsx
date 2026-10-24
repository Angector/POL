import { useState } from 'react';
import { motion } from 'motion/react';
import { useGoals } from '../hooks/useGoals';
import { useCinematic } from '../components/battle/CinematicToast';
import { GoalCard } from '../components/goals/GoalCard';
import { GoalComposer } from '../components/goals/GoalComposer';
import { GoalProgressModal } from '../components/goals/GoalProgressModal';
import { ErrorBanner } from '../components/ui/ErrorBanner';
import type { Goal } from '../types/goal';

export default function GoalsPage() {
  const { goals, updates, loading, error, create, remove, addProgress, refetch } = useGoals();
  const cinematic = useCinematic();

  const [composerOpen, setComposerOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [progressGoal, setProgressGoal] = useState<Goal | null>(null);

  const handleCreate = async (data: { title: string; description: string | null; target_value: number; unit: string; deadline: string | null }) => {
    await create({
      ...data,
      start_date: new Date().toISOString().split('T')[0],
    } as any);
    cinematic.show({
      title: 'هدف جدید اضافه شد',
      icon: '🎯',
    });
  };

  const handleDelete = async (goalId: number) => {
    if (confirm('آیا از حذف این هدف مطمئن هستید؟')) {
      await remove(goalId);
    }
  };

  const handleAddProgress = async (goalId: number, delta: number, note: string | null) => {
    await addProgress(goalId, delta, note || undefined);
    cinematic.show({
      title: 'پیشرفت ثبت شد',
      subtitle: `+${delta}`,
      icon: '📈',
    });
  };

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
        <ErrorBanner message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)] mb-2">
            اهداف استراتژیک
          </h1>
          <p className="text-command-muted">
            هدف‌های بلندمدت خود را تعریف و پیشرفت را ثبت کنید
          </p>
        </div>
        <button
          onClick={() => {
            setEditingGoal(null);
            setComposerOpen(true);
          }}
          className="px-6 py-3 bg-command-amber text-command-bg font-bold rounded-lg hover:brightness-110 transition-all"
        >
          + هدف جدید
        </button>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-command-muted mb-4">هنوز هدفی تعریف نشده است.</p>
          <button
            onClick={() => {
              setEditingGoal(null);
              setComposerOpen(true);
            }}
            className="px-6 py-3 bg-command-amber text-command-bg font-bold rounded-lg hover:brightness-110 transition-all"
          >
            + افزودن اولین هدف
          </button>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              updates={updates[goal.id] || []}
              onProgress={() => setProgressGoal(goal)}
              onEdit={() => {
                setEditingGoal(goal);
                setComposerOpen(true);
              }}
              onDelete={() => handleDelete(goal.id)}
            />
          ))}
        </motion.div>
      )}

      {/* Composer Modal */}
      <GoalComposer
        isOpen={composerOpen}
        onClose={() => {
          setComposerOpen(false);
          setEditingGoal(null);
        }}
        onSubmit={handleCreate}
        initialData={editingGoal || undefined}
      />

      {/* Progress Modal */}
      {progressGoal && (
        <GoalProgressModal
          isOpen={!!progressGoal}
          onClose={() => setProgressGoal(null)}
          onSubmit={(delta, note) => handleAddProgress(progressGoal.id, delta, note)}
          goalTitle={progressGoal.title}
          unit={progressGoal.unit}
        />
      )}
    </div>
  );
}
