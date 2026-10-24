import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useTerritory } from './useTerritory';

export function useStreak() {
  const { session, refreshProfile } = useAuth();
  const { refresh: refreshTerritory } = useTerritory();
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [hoursRemaining, setHoursRemaining] = useState(0);
  const [cycleStartedAt, setCycleStartedAt] = useState<string | null>(null);

  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

  useEffect(() => {
    const fetchCycleStartedAt = async () => {
      if (!session?.user) return;

      const { data } = await supabase
        .from('profiles')
        .select('cycle_started_at')
        .eq('id', session.user.id)
        .single();

      if (data?.cycle_started_at) {
        setCycleStartedAt(data.cycle_started_at);
      }
    };

    fetchCycleStartedAt();
  }, [session]);

  useEffect(() => {
    if (!cycleStartedAt) return;

    const updateTimer = () => {
      const startTime = new Date(cycleStartedAt).getTime();
      const now = Date.now();
      const elapsed = now - startTime;
      
      setElapsedMs(elapsed);
      
      if (elapsed >= TWENTY_FOUR_HOURS) {
        setIsReady(true);
        setHoursRemaining(0);
      } else {
        setIsReady(false);
        setHoursRemaining(Math.ceil((TWENTY_FOUR_HOURS - elapsed) / (1000 * 60 * 60)));
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [cycleStartedAt]);

  const liberate = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!session?.user) {
      return { success: false, error: 'کاربر وارد نشده است' };
    }

    try {
      const { error } = await supabase.rpc('liberate_next_city', {
        p_user_id: session.user.id,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Refresh data
      await refreshProfile();
      await refreshTerritory();
      
      // Update cycle_started_at
      const { data } = await supabase
        .from('profiles')
        .select('cycle_started_at')
        .eq('id', session.user.id)
        .single();

      if (data?.cycle_started_at) {
        setCycleStartedAt(data.cycle_started_at);
      }

      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'خطا در فتح شهر' 
      };
    }
  }, [session, refreshProfile, refreshTerritory]);

  return {
    elapsedMs,
    isReady,
    hoursRemaining,
    cycleStartedAt,
    liberate,
  };
}
