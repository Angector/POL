import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { General } from '../types/general';

export function useGenerals() {
  const { session } = useAuth();
  const [generals, setGenerals] = useState<General[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGenerals = useCallback(async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: generalsData, error: fetchError } = await supabase
        .from('generals')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setGenerals((generalsData as General[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری ژنرال‌ها');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchGenerals();
  }, [fetchGenerals]);

  const dispatch = useCallback(async (generalId: number, recipientId: string, message?: string) => {
    try {
      const {  data, error } = await supabase.functions.invoke('dispatch-general', {
        body: {
          general_id: generalId,
          recipient_id: recipientId,
          message,
        },
      });

      if (error) throw error;

      await fetchGenerals();
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('خطا در ارسال ژنرال');
    }
  }, [fetchGenerals]);

  return {
    generals,
    loading,
    error,
    dispatch,
    refetch: fetchGenerals,
  };
}
