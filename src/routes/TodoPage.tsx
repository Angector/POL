import { useState } from 'react';
import { useHabits } from '../hooks/useHabits';
import { useCinematic } from '../components/battle/CinematicToast';
import { FrequencyTabs } from '../components/habits/FrequencyTabs';
import { SuccessGauge } from '../components/habits/SuccessGauge';
import { HabitList } from '../components/habits/HabitList';
import { HabitComposer } from '../components/habits/HabitComposer';
import { TruceCard } from '../components/battle/TruceCard';
import { ErrorBanner } from '../components/ui/ErrorBanner';
import type { Habit, HabitFrequency, HabitCategory } from '../types/habit';

export default function TodoPage() {
  const { habits, logs, loading, error, toggle, create, remove, seedDefaults, successRate, refetch } = useHabits();
  const cinematic = useCinematic();

  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [composerOpen, setComposerOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const handleToggle = async (habitId: number) => {
    try {
      await toggle(habitId);
      cinematic.show({
        title: 'ماموریت تکمیل شد',
        subtitle: '+امتیاز',
        icon: '✓',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (data: { title: string; category: HabitCategory; frequency: HabitFrequency; points: number }) => {
    await create(data);
    cinematic.show({
      title: 'ماموریت جدید اضافه شد',
      icon: '📋',
    });
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setComposerOpen(true);
  };

  const handleDelete = async (habitId: number) => {
    if (confirm('آیا از حذف این ماموریت مطمئن هستید؟')) {
      await remove(habitId);
    }
  };

  const handleSeedDefaults = async () => {
    try {
      const count = await seedDefaults();
      cinematic.show({
        title: `${count} ماموریت پیش‌فرض اضافه شد`,
        icon: '🎯',
      });
    } catch (err) {
      console.error(err);
    }
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

  const showSeedButton = habits.length === 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)] mb-2">
          ماموریت‌های ارتش
        </h1>
        <p className="text-command-muted">
          جنگ خارجی: فتح بیرونی | جنگ داخلی: فتح درونی
        </p>
      </div>

      {/* Truce Card */}
      <TruceCard />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <FrequencyTabs value={frequency} onChange={setFrequency} />
        <div className="flex gap-4 items-center sm:mr-auto">
          <SuccessGauge value={successRate(frequency)} size={80} label="درصد موفقیت" />
          <button
            onClick={() => {
              setEditingHabit(null);
              setComposerOpen(true);
            }}
            className="px-4 py-2 bg-command-amber text-command-bg font-bold rounded hover:brightness-110 transition-all"
          >
            + ماموریت جدید
          </button>
        </div>
      </div>

      {/* Habit List */}
      <HabitList
        frequency={frequency}
        habits={habits}
        logs={logs}
        onToggle={handleToggle}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={() => {
          setEditingHabit(null);
          setComposerOpen(true);
        }}
        onSeedDefaults={handleSeedDefaults}
        showSeedButton={showSeedButton}
      />

      {/* Composer Modal */}
      <HabitComposer
        isOpen={composerOpen}
        onClose={() => {
          setComposerOpen(false);
          setEditingHabit(null);
        }}
        onSubmit={handleCreate}
        initialData={editingHabit || undefined}
      />
    </div>
  );
}
