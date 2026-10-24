import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Habit, HabitLog, HabitFrequency } from '../types/habit';
import { isToday, isInCurrentWeek, isInCurrentMonth } from '../lib/dateUtils';

export function useHabits() {
  const { session, refreshProfile } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch habits
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (habitsError) throw habitsError;

      // Fetch logs (last 30 days for stats)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: logsData, error: logsError } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('log_date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('log_date', { ascending: false });

      if (logsError) throw logsError;

      setHabits(habitsData || []);
      setLogs(logsData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری عادت‌ها');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggle = useCallback(async (habitId: number, date?: string) => {
    if (!session?.user) return;

    const logDate = date || new Date().toISOString().split('T')[0];

    try {
      const { data, error } = await supabase.rpc('toggle_habit', {
        p_habit_id: habitId,
        p_date: logDate,
      });

      if (error) throw error;

      // Refresh data
      await fetchData();
      await refreshProfile();

      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('خطا در تغییر وضعیت عادت');
    }
  }, [session, fetchData, refreshProfile]);

  const create = useCallback(async (data: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'is_active'>) => {
    if (!session?.user) return;

    try {
      const { error } = await supabase
        .from('habits')
        .insert({
          ...data,
          user_id: session.user.id,
          is_active: true,
        });

      if (error) throw error;

      await fetchData();
    } catch (err) {
      throw err instanceof Error ? err : new Error('خطا در ایجاد عادت');
    }
  }, [session, fetchData]);

  const update = useCallback(async (id: number, patch: Partial<Habit>) => {
    try {
      const { error } = await supabase
        .from('habits')
        .update(patch)
        .eq('id', id);

      if (error) throw error;

      await fetchData();
    } catch (err) {
      throw err instanceof Error ? err : new Error('خطا در بروزرسانی عادت');
    }
  }, [fetchData]);

  const remove = useCallback(async (id: number) => {
    try {
      const { error } = await supabase
        .from('habits')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      await fetchData();
    } catch (err) {
      throw err instanceof Error ? err : new Error('خطا در حذف عادت');
    }
  }, [fetchData]);

  const seedDefaults = useCallback(async () => {
    if (!session?.user) return 0;

    try {
      const { data, error } = await supabase.rpc('seed_default_habits');

      if (error) throw error;

      await fetchData();
      return data || 0;
    } catch (err) {
      throw err instanceof Error ? err : new Error('خطا در ایجاد عادت‌های پیش‌فرض');
    }
  }, [session, fetchData]);

  const successRate = useCallback((frequency: HabitFrequency): number => {
    const activeHabits = habits.filter(h => h.frequency === frequency && h.is_active);
    if (activeHabits.length === 0) return 0;

    const completedCount = logs.filter(log => {
      const habit = activeHabits.find(h => h.id === log.habit_id);
      if (!habit) return false;
      if (!log.completed) return false;

      switch (frequency) {
        case 'daily':
          return isToday(log.log_date);
        case 'weekly':
          return isInCurrentWeek(log.log_date);
        case 'monthly':
          return isInCurrentMonth(log.log_date);
      }
    }).length;

    const totalExpected = frequency === 'daily' 
      ? activeHabits.length 
      : frequency === 'weekly'
      ? activeHabits.length * 7
      : activeHabits.length * 30;

    return Math.round((completedCount / totalExpected) * 100);
  }, [habits, logs]);

  return {
    habits,
    logs,
    loading,
    error,
    toggle,
    create,
    update,
    remove,
    seedDefaults,
    successRate,
    refetch: fetchData,
  };
}
