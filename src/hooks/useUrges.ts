import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useTerritory } from './useTerritory';
import type { UrgeTrigger } from '../types/urge';

interface UrgeData {
  intensity: number;
  trigger: UrgeTrigger;
  privateNote?: string;
}

export function useUrges() {
  const { session, refreshProfile } = useAuth();
  const { refresh: refreshTerritory } = useTerritory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitResisted = useCallback(async (data: UrgeData): Promise<{ success: boolean; error?: string }> => {
    if (!session?.user) {
      return { success: false, error: 'کاربر وارد نشده است' };
    }

    setLoading(true);
    setError(null);

    try {
      const { error: rpcError } = await supabase.rpc('resist_urge', {
        p_user_id: session.user.id,
        p_intensity: data.intensity,
        p_trigger: data.trigger,
      });

      if (rpcError) {
        setError(rpcError.message);
        return { success: false, error: rpcError.message };
      }

      await refreshProfile();
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'خطا در ثبت حمله';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [session, refreshProfile]);

  const submitDefeat = useCallback(async (data: UrgeData): Promise<{ success: boolean; error?: string }> => {
    if (!session?.user) {
      return { success: false, error: 'کاربر وارد نشده است' };
    }

    setLoading(true);
    setError(null);

    try {
      const { error: rpcError } = await supabase.rpc('defeat_citadel', {
        p_user_id: session.user.id,
        p_intensity: data.intensity,
        p_trigger: data.trigger,
      });

      if (rpcError) {
        setError(rpcError.message);
        return { success: false, error: rpcError.message };
      }

      await refreshProfile();
      await refreshTerritory();
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'خطا در ثبت شکست';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [session, refreshProfile, refreshTerritory]);

  return {
    submitResisted,
    submitDefeat,
    loading,
    error,
  };
}
