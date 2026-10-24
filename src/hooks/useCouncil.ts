import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Advisor, CouncilMessage } from '../types/council';

export function useCouncil() {
  const { session, profile } = useAuth();
  const [messagesByAdvisor, setMessagesByAdvisor] = useState<Record<Advisor, CouncilMessage[]>>({
    patience: [],
    war: [],
    mirror: [],
    sage: [],
  });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data: messagesData, error: fetchError } = await supabase
        .from('council_messages')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: true })
        .limit(200);

      if (fetchError) throw fetchError;

      const grouped: Record<Advisor, CouncilMessage[]> = {
        patience: [],
        war: [],
        mirror: [],
        sage: [],
      };

      for (const msg of (messagesData as CouncilMessage[]) || []) {
        if (msg.role !== 'system') {
          grouped[msg.advisor as Advisor].push(msg);
        }
      }

      setMessagesByAdvisor(grouped);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری پیام‌ها');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const send = useCallback(async (advisor: Advisor, message: string) => {
    if (sending || !session?.user) return;

    setSending(true);
    setError(null);

    // Optimistic: add user message
    const tempUserMsg: CouncilMessage = {
      id: Date.now(),
      user_id: session.user.id,
      advisor,
      role: 'user',
      content: message,
      tokens_used: null,
      created_at: new Date().toISOString(),
    };

    setMessagesByAdvisor((prev) => ({
      ...prev,
      [advisor]: [...prev[advisor], tempUserMsg],
    }));

    try {
      // Build context (privacy-safe)
      const context = {
        streak_days: profile?.streak_days || 0,
        willpower: profile?.willpower || 0,
        morale: profile?.morale || 0,
        total_points: profile?.total_points || 0,
        rank: profile?.rank || 'Soldier',
        callsign: profile?.callsign || 'فرمانده',
      };

      const {  data, error: invokeError } = await supabase.functions.invoke('council-advisor', {
        body: {
          advisor,
          user_message: message,
          context,
        },
      });

      if (invokeError) throw invokeError;

      // Add assistant message
      const assistantMsg: CouncilMessage = {
        id: Date.now() + 1,
        user_id: session.user.id,
        advisor,
        role: 'assistant',
        content: data.message,
        tokens_used: data.tokens_used,
        created_at: new Date().toISOString(),
      };

      setMessagesByAdvisor((prev) => ({
        ...prev,
        [advisor]: [...prev[advisor], assistantMsg],
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ارسال پیام');
      // Rollback: remove temp user message
      setMessagesByAdvisor((prev) => ({
        ...prev,
        [advisor]: prev[advisor].filter((m) => m.id !== tempUserMsg.id),
      }));
    } finally {
      setSending(false);
    }
  }, [sending, session, profile]);

  const clearHistory = useCallback(async (advisor: Advisor) => {
    if (!session?.user) return;

    try {
      const { error } = await supabase
        .from('council_messages')
        .delete()
        .eq('user_id', session.user.id)
        .eq('advisor', advisor);

      if (error) throw error;

      setMessagesByAdvisor((prev) => ({
        ...prev,
        [advisor]: [],
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در پاک کردن تاریخچه');
    }
  }, [session]);

  return {
    messagesByAdvisor,
    loading,
    sending,
    error,
    send,
    clearHistory,
    refetch: fetchMessages,
  };
}
