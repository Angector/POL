import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useCinematic } from '../components/battle/CinematicToast';
import type { AppNotification } from '../types/social';

export function useRealtimeNotifications() {
  const { session } = useAuth();
  const cinematic = useCinematic();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!session?.user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount((data || []).filter(n => !n.read_at).length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  }, [session]);

  useEffect(() => {
    fetchNotifications();

    if (!session?.user) return;

    // Subscribe to realtime
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as AppNotification;
          
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);

          // Show cinematic toast
          const type = newNotification.type;
          const payloadData = newNotification.payload;

          switch (type) {
            case 'city_freed':
              cinematic.show({
                title: 'شهری آزاد شد',
                subtitle: (payloadData as any).city_name || '',
                icon: '🏰',
              });
              break;
            case 'rise_letter':
              cinematic.show({
                title: 'نامه‌ی برخاستن',
                subtitle: 'به پنل نامه‌ها برو',
                icon: '🔥',
              });
              break;
            case 'letter_new':
              cinematic.show({
                title: 'نامه‌ی جدید',
                subtitle: `از ${(payloadData as any).from_callsign}`,
                icon: '✉️',
              });
              break;
            case 'alliance_request':
              cinematic.show({
                title: 'درخواست پیمان',
                subtitle: (payloadData as any).from_callsign,
                icon: '🤝',
              });
              break;
            case 'alliance_accepted':
              cinematic.show({
                title: 'پیمان پذیرفته شد',
                subtitle: (payloadData as any).from_callsign,
                icon: '⚔️',
              });
              break;
            case 'sos':
              cinematic.show({
                title: '🆘 کمک فوری!',
                subtitle: `${(payloadData as any).from_callsign} به کمکت نیاز دارد`,
                icon: '🚨',
                duration: 8000,
              });
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, cinematic, fetchNotifications]);

  const markAllRead = useCallback(async () => {
    if (!session?.user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('user_id', session.user.id)
        .is('read_at', null);

      if (error) throw error;

      await fetchNotifications();
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  }, [session, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    markAllRead,
    refetch: fetchNotifications,
  };
}
