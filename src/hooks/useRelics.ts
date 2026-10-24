import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Relic } from '../types/relic';
import { RELIC_DEFINITIONS } from '../lib/relicDefinitions';

export function useRelics() {
  const { session } = useAuth();
  const [relics, setRelics] = useState<Relic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRelics = useCallback(async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: unlockedRelics, error: fetchError } = await supabase
        .from('relics')
        .select('*')
        .eq('user_id', session.user.id);

      if (fetchError) throw fetchError;

      // Merge definitions with unlocked status
      const merged: Relic[] = RELIC_DEFINITIONS.map((def) => {
        const unlocked = unlockedRelics?.find((r) => r.relic_key === def.key);
        return {
          ...def,
          unlocked: !!unlocked,
          unlocked_at: unlocked?.unlocked_at || null,
        };
      });

      setRelics(merged);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری یادگاری‌ها');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchRelics();
  }, [fetchRelics]);

  const unlockedCount = relics.filter((r) => r.unlocked).length;
  const totalCount = relics.length;

  return {
    relics,
    unlockedCount,
    totalCount,
    loading,
    error,
    refetch: fetchRelics,
  };
}
