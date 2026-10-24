import { useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useProfile() {
  const { profile, refreshProfile } = useAuth();

  const signOath = useCallback(
    async (signature: string): Promise<{ error: string | null }> => {
      if (!profile) {
        return { error: 'پروفایل یافت نشد' };
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          oath_signed_at: new Date().toISOString(),
          oath_signature: signature,
        })
        .eq('id', profile.id);

      if (error) {
        return { error: error.message };
      }

      await refreshProfile();
      return { error: null };
    },
    [profile, refreshProfile]
  );

  const updateCallsign = useCallback(
    async (newCallsign: string): Promise<{ error: string | null }> => {
      if (!profile) {
        return { error: 'پروفایل یافت نشد' };
      }

      if (!newCallsign.trim()) {
        return { error: 'نام نمی‌تواند خالی باشد' };
      }

      const { error } = await supabase
        .from('profiles')
        .update({ callsign: newCallsign.trim() })
        .eq('id', profile.id);

      if (error) {
        return { error: error.message };
      }

      await refreshProfile();
      return { error: null };
    },
    [profile, refreshProfile]
  );

  return {
    profile,
    signOath,
    updateCallsign,
  };
}
