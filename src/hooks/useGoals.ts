import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Goal, GoalUpdate } from '../types/goal';

export function useGoals() {
  const { session, refreshProfile } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [updates, setUpdates] = useState<Record<number, GoalUpdate[]>>({});
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

      // Fetch goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (goalsError) throw goalsError;

      // Fetch updates
      const { data: updatesData, error: updatesError } = await supabase
        .from('goal_updates')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (updatesError) throw updatesError;

      setGoals(goalsData || []);

      // Group updates by goal_id
      const updatesByGoal: Record<number, GoalUpdate[]> = {};
      for (const update of updatesData || []) {
        if (!updatesByGoal[update.goal_id]) {
          updatesByGoal[update.goal_id] = [];
        }
        updatesByGoal[update.goal_id].push(update);
      }
      setUpdates(updatesByGoal);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری اهداف');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const create = useCallback(async (data: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'is_active' | 'current_value'>) => {
    if (!session?.user) return;

    try {
      const { error } = await supabase
        .from('goals')
        .insert({
          ...data,
          user_id: session.user.id,
          is_active: true,
          current_value: 0,
        });

      if (error) throw error;

      await fetchData();
    } catch (err) {
      throw err instanceof Error ? err : new Error('خطا در ایجاد هدف');
    }
  }, [session, fetchData]);

  const update = useCallback(async (id: number, patch: Partial<Goal>) => {
    try {
      const { error } = await supabase
        .from('goals')
        .update(patch)
        .eq('id', id);

      if (error) throw error;

      await fetchData();
    } catch (err) {
      throw err instanceof Error ? err : new Error('خطا در بروزرسانی هدف');
    }
  }, [fetchData]);

  const remove = useCallback(async (id: number) => {
    try {
      const { error } = await supabase
        .from('goals')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      await fetchData();
    } catch (err) {
      throw err instanceof Error ? err : new Error('خطا در حذف هدف');
    }
  }, [fetchData]);

  const addProgress = useCallback(async (goalId: number, delta: number, note?: string) => {
    try {
      const { data, error } = await supabase.rpc('add_goal_progress', {
        p_goal_id: goalId,
        p_delta: delta,
        p_note: note || null,
      });

      if (error) throw error;

      await fetchData();
      await refreshProfile();

      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('خطا در ثبت پیشرفت');
    }
  }, [fetchData, refreshProfile]);

  return {
    goals,
    updates,
    loading,
    error,
    create,
    update,
    remove,
    addProgress,
    refetch: fetchData,
  };
}
