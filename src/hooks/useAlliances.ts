import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Alliance, AllianceType } from '../types/social';

export function useAlliances() {
  const { session } = useAuth();
  const [alliances, setAlliances] = useState<Alliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlliances = useCallback(async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('alliances')
        .select('*')
        .or(`requester_id.eq.${session.user.id},recipient_id.eq.${session.user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAlliances(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری پیمان‌ها');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchAlliances();
  }, [fetchAlliances]);

  const request = useCallback(async (params: {
    recipient: string;
    type: AllianceType;
    message?: string;
  }) => {
    if (!session?.user) return;

    try {
      const { data, error } = await supabase.rpc('create_alliance_request', {
        p_recipient: params.recipient,
        p_type: params.type,
        p_message: params.message || null,
      });

      if (error) throw error;

      await fetchAlliances();
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('خطا در ارسال درخواست');
    }
  }, [session, fetchAlliances]);

  const respond = useCallback(async (allianceId: number, accept: boolean) => {
    try {
      const { error } = await supabase.rpc('respond_alliance', {
        p_alliance_id: allianceId,
        p_accept: accept,
      });

      if (error) throw error;

      await fetchAlliances();
    } catch (err) {
      throw err instanceof Error ? err : new Error('خطا در پاسخ');
    }
  }, [fetchAlliances]);

  const accepted = alliances.filter(a => a.status === 'accepted');
  const incoming = alliances.filter(a => 
    a.status === 'pending' && a.recipient_id === session?.user.id
  );
  const outgoing = alliances.filter(a => 
    a.status === 'pending' && a.requester_id === session?.user.id
  );

  return {
    alliances,
    accepted,
    incoming,
    outgoing,
    loading,
    error,
    request,
    respond,
    refetch: fetchAlliances,
  };
}
