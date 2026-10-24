import { useState } from 'react';
import { useRealtimeNotifications } from '../../hooks/useRealtimeNotifications';
import { formatRelativeTime } from '../../lib/format';
import { motion, AnimatePresence } from 'motion/react';

export function NotificationBell() {
  const { notifications, unreadCount, markAllRead } = useRealtimeNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-command-muted hover:text-command-text transition-colors"
        aria-label="اعلان‌ها"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-command-crimson text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 mt-2 w-80 bg-command-panel border border-command-border rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
            >
              <div className="p-3 border-b border-command-border flex items-center justify-between">
                <h3 className="font-bold text-command-text">اعلان‌ها</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-command-amber hover:underline"
                  >
                    همه را خواندم
                  </button>
                )}
              </div>
              <div className="divide-y divide-command-border">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-command-muted">
                    اعلانی نیست
                  </div>
                ) : (
                  notifications.slice(0, 10).map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 ${!notif.read_at ? 'bg-command-amber/5' : ''}`}
                    >
                      <p className="text-sm text-command-text">
                        {getNotificationText(notif.type, notif.payload)}
                      </p>
                      <p className="text-xs text-command-muted mt-1">
                        {formatRelativeTime(notif.created_at)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function getNotificationText(type: string, payload: any): string {
  switch (type) {
    case 'city_freed':
      return 'شهری آزاد شد';
    case 'rise_letter':
      return 'نامه‌ی برخاستن دریافت شد';
    case 'letter_new':
      return `نامه‌ی جدید از ${payload.from_callsign}`;
    case 'alliance_request':
      return `${payload.from_callsign} درخواست پیمان داد`;
    case 'alliance_accepted':
      return `${payload.from_callsign} پیمان را پذیرفت`;
    case 'sos':
      return `${payload.from_callsign} به کمکت نیاز دارد!`;
    default:
      return 'اعلان جدید';
  }
}
