import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const DISMISS_KEY = 'mind-citadel-install-dismissed';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem(DISMISS_KEY) === 'true';
  });
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(isStandaloneMode);

    // Check if iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    // Listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(DISMISS_KEY, 'true');
  };

  // Don't show if already installed or dismissed
  if (isStandalone || isDismissed) return null;

  // Don't show if no prompt available and not iOS
  if (!deferredPrompt && !isIOS) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-command-panel border border-command-amber rounded-lg p-4 shadow-lg"
      >
        <div className="flex items-start gap-3">
          <div className="text-3xl">📱</div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-command-amber mb-1">
              قلعه‌ی ذهن را نصب کنید
            </h3>
            <p className="text-xs text-command-text mb-3">
              {isIOS
                ? 'در Safari، روی دکمه‌ی Share بزنید و «Add to Home Screen» را انتخاب کنید.'
                : 'برنامه را روی گوشی خود نصب کنید تا سریع‌تر دسترسی داشته باشید.'}
            </p>
            <div className="flex gap-2">
              {!isIOS && deferredPrompt && (
                <button
                  onClick={handleInstall}
                  className="px-3 py-1.5 bg-command-amber text-command-bg text-sm font-bold rounded hover:brightness-110 transition-all"
                >
                  نصب
                </button>
              )}
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 bg-command-bg border border-command-border text-command-muted text-sm rounded hover:border-command-text transition-colors"
              >
                بعداً
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
