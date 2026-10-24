import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Letter, LetterType } from '../types/social';

export function useLetters() {
  const { session } = useAuth();
  const [inbox, setInbox] = useState<Letter[]>([]);
  const [sent, setSent] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLetters = useCallback(async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch inbox
      const { data: inboxData, error: inboxError } = await supabase
        .from('letters')
        .select('*')
        .eq('to_user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (inboxError) throw inboxError;

      // Fetch sent
      const { data: sentData, error: sentError } = await supabase
        .from('letters')
        .select('*')
        .eq('from_user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (sentError) throw sentError;

      setInbox(inboxData || []);
      setSent(sentData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری نامه‌ها');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchLetters();
  }, [fetchLetters]);

  const send = useCallback(async (params: {
    to: string;
    type: LetterType;
    subject?: string;
    body: string;
  }) => {
    if (!session?.user) return;

    try {
      const { data, error } = await supabase.rpc('send_letter', {
        p_to: params.to,
        p_type: params.type,
        p_subject: params.subject || null,
        p_body: params.body,
      });

      if (error) throw error;

      await fetchLetters();
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('خطا در ارسال نامه');
    }
  }, [session, fetchLetters]);

  const markRead = useCallback(async (letterId: number) => {
    try {
      const { error } = await supabase
        .from('letters')
        .update({ read_at: new Date().toISOString() })
        .eq('id', letterId);

      if (error) throw error;

      await fetchLetters();
    } catch (err) {
      throw err instanceof Error ? err : new Error('خطا در علامت‌گذاری');
    }
  }, [fetchLetters]);

  return {
    inbox,
    sent,
    loading,
    error,
    send,
    markRead,
    refetch: fetchLetters,
  };
}
