import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function UpdatePrompt() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [updateSW, setUpdateSW] = useState<((reloadPage?: boolean) => Promise<void>) | null>(null);

  useEffect(() => {
    // Check if service worker is available
    if ('serviceWorker' in navigator) {
      // Listen for updates
      const handleUpdate = () => {
        setNeedRefresh(true);
      };

      // Try to import virtual:pwa-register
      import('virtual:pwa-register').then(({ registerSW }) => {
        const updateServiceWorker = registerSW({
          onNeedRefresh() {
            handleUpdate();
          },
          onOfflineReady() {
            console.log('App ready to work offline');
          },
        });
        setUpdateSW(() => updateServiceWorker);
      }).catch(() => {
        // PWA plugin not available (dev mode)
        console.log('PWA not available in this environment');
      });
    }
  }, []);

  const handleUpdate = async () => {
    if (updateSW) {
      await updateSW(true);
    } else {
      window.location.reload();
    }
  };

  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-command-panel border-2 border-command-amber rounded-lg p-4 shadow-2xl z-50"
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">🔄</div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-command-amber mb-1">
                نسخه‌ی جدید آماده است
              </h3>
              <p className="text-xs text-command-text mb-3">
                برای دریافت آخرین تغییرات، برنامه را بروزرسانی کنید.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  className="px-3 py-1.5 bg-command-amber text-command-bg text-sm font-bold rounded hover:brightness-110 transition-all"
                >
                  بروزرسانی
                </button>
                <button
                  onClick={() => setNeedRefresh(false)}
                  className="px-3 py-1.5 bg-command-bg border border-command-border text-command-muted text-sm rounded hover:border-command-text transition-colors"
                >
                  بعداً
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
