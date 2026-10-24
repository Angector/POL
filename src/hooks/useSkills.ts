import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Skill } from '../types/skill';
import { SKILL_NODES } from '../lib/skillDefinitions';

export function useSkills() {
  const { session } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = useCallback(async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: unlockedSkills, error: fetchError } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', session.user.id);

      if (fetchError) throw fetchError;

      // Merge definitions with unlocked status
      const merged: Skill[] = SKILL_NODES.map((def) => {
        const unlocked = unlockedSkills?.find((s) => s.node_key === def.key);
        return {
          ...def,
          unlocked: !!unlocked,
          unlocked_at: unlocked?.unlocked_at || null,
        };
      });

      setSkills(merged);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری مهارت‌ها');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const unlockedCount = skills.filter((s) => s.unlocked).length;
  const totalCount = skills.length;

  return {
    skills,
    unlockedCount,
    totalCount,
    loading,
    error,
    refetch: fetchSkills,
  };
}
