import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { PublicProfile } from '../types/social';

export function usePublicProfiles() {
  const { session } = useAuth();
  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = useCallback(async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: profilesData, error: profilesError } = await supabase
        .from('public_profiles')
        .select('*')
        .order('freed_count', { ascending: false });

      if (profilesError) throw profilesError;

      setProfiles(profilesData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری پروفایل‌ها');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  return {
    profiles,
    loading,
    error,
    refetch: fetchProfiles,
  };
}
