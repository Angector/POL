import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Urge, UrgeTrigger } from '../types/urge';

export interface UrgeStats {
  byHour: number[];
  byDayOfWeek: number[];
  byTrigger: Record<UrgeTrigger, number>;
  totalUrges: number;
  resistedCount: number;
  defeatCount: number;
  resistanceRate: number;
  topPattern: { day: number; hour: number; trigger: string } | null;
}

export function useUrgeStats(days: number = 30) {
  const { session } = useAuth();
  const [stats, setStats] = useState<UrgeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const since = new Date();
      since.setDate(since.getDate() - days);

      const { data: urges, error: fetchError } = await supabase
        .from('urges')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('occurred_at', since.toISOString())
        .order('occurred_at', { ascending: false });

      if (fetchError) throw fetchError;

      if (!urges || urges.length === 0) {
        setStats(null);
        return;
      }

      // Calculate stats
      const byHour = new Array(24).fill(0);
      const byDayOfWeek = new Array(7).fill(0);
      const byTrigger: Record<UrgeTrigger, number> = {
        stress: 0,
        boredom: 0,
        loneliness: 0,
        late_night: 0,
        anger: 0,
        tiredness: 0,
        other: 0,
      };

      let resistedCount = 0;
      let defeatCount = 0;

      const patternMap = new Map<string, number>();

      for (const urge of urges as Urge[]) {
        const date = new Date(urge.occurred_at);
        const hour = date.getHours();
        const dayOfWeek = (date.getDay() + 1) % 7; // 0 = Saturday in Iran

        byHour[hour]++;
        byDayOfWeek[dayOfWeek]++;
        byTrigger[urge.trigger_context]++;

        if (urge.resisted) {
          resistedCount++;
        } else {
          defeatCount++;
        }

        // Track patterns
        const patternKey = `${dayOfWeek}-${hour}-${urge.trigger_context}`;
        patternMap.set(patternKey, (patternMap.get(patternKey) || 0) + 1);
      }

      // Find top pattern
      let topPattern: { day: number; hour: number; trigger: string } | null = null;
      let maxCount = 0;

      for (const [key, count] of patternMap.entries()) {
        if (count > maxCount) {
          maxCount = count;
          const [day, hour, trigger] = key.split('-');
          topPattern = {
            day: parseInt(day),
            hour: parseInt(hour),
            trigger,
          };
        }
      }

      const totalUrges = urges.length;
      const resistanceRate = totalUrges > 0 ? (resistedCount / totalUrges) * 100 : 0;

      setStats({
        byHour,
        byDayOfWeek,
        byTrigger,
        totalUrges,
        resistedCount,
        defeatCount,
        resistanceRate,
        topPattern,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری آمار');
    } finally {
      setLoading(false);
    }
  }, [session, days]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
