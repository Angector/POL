import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { OraclePrediction } from '../types/oracle';

export function useOracle() {
  const { session } = useAuth();
  const [todayPrediction, setTodayPrediction] = useState<OraclePrediction | null>(null);
  const [history, setHistory] = useState<OraclePrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPredictions = useCallback(async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      const { data: predictionsData, error: fetchError } = await supabase
        .from('oracle_predictions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('for_date', { ascending: false })
        .limit(7);

      if (fetchError) throw fetchError;

      const predictions = (predictionsData as OraclePrediction[]) || [];
      setHistory(predictions);

      const todayPred = predictions.find((p) => p.for_date === today);
      setTodayPrediction(todayPred || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری پیش‌بینی‌ها');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  const generate = useCallback(async () => {
    if (!session?.user || generating) return;

    setGenerating(true);
    setError(null);

    try {
      const {  data, error: invokeError } = await supabase.functions.invoke('oracle-analyze', {
        body: {},
      });

      if (invokeError) throw invokeError;

      // Refetch to get the new prediction
      await fetchPredictions();

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'خطا در تولید پیش‌بینی';
      setError(message);
      throw err;
    } finally {
      setGenerating(false);
    }
  }, [session, generating, fetchPredictions]);

  return {
    todayPrediction,
    history,
    loading,
    generating,
    error,
    generate,
    refetch: fetchPredictions,
  };
}
