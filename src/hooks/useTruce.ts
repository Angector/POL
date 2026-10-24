import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Truce, TruceReason } from '../types/truce';

export function useTruce() {
  const { session } = useAuth();
  const [activeTruce, setActiveTruce] = useState<Truce | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTruce = useCallback(async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: rpcError } = await supabase.rpc('get_active_truce');

      if (rpcError) throw rpcError;

      if (data && data.length > 0) {
        setActiveTruce(data[0] as Truce);
      } else {
        setActiveTruce(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری آتش‌بس');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchTruce();
  }, [fetchTruce]);

  const start = useCallback(async (reason: TruceReason) => {
    try {
      const { error } = await supabase.rpc('start_truce', { p_reason: reason });
      if (error) throw error;
      await fetchTruce();
    } catch (err) {
      throw err instanceof Error ? err : new Error('خطا در شروع آتش‌بس');
    }
  }, [fetchTruce]);

  const cancel = useCallback(async () => {
    if (!activeTruce) return;
    
    try {
      const { error } = await supabase.rpc('cancel_truce', { p_truce_id: activeTruce.id });
      if (error) throw error;
      await fetchTruce();
    } catch (err) {
      throw err instanceof Error ? err : new Error('خطا در لغو آتش‌بس');
    }
  }, [activeTruce, fetchTruce]);

  return {
    activeTruce,
    loading,
    error,
    start,
    cancel,
    refetch: fetchTruce,
  };
}
