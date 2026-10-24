import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CrestBadge } from '../profile/CrestBadge';
import { useAuth } from '../../context/AuthContext';

interface CinematicToast {
  id: number;
  title: string;
  subtitle?: string;
  icon?: string;
  duration?: number;
}

interface CinematicContextValue {
  show: (toast: Omit<CinematicToast, 'id'>) => void;
}

const CinematicContext = createContext<CinematicContextValue | null>(null);

export function CinematicProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<CinematicToast[]>([]);
  const { profile } = useAuth();

  const show = useCallback((toast: Omit<CinematicToast, 'id'>) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...toast, id }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 4000);
  }, []);

  return (
    <CinematicContext.Provider value={{ show }}>
      {children}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              className="bg-command-panel border-2 border-command-amber rounded-lg px-6 py-4 shadow-2xl flex items-center gap-4 min-w-[300px]"
            >
              {toast.icon === 'crest' && profile?.crest_seed ? (
                <CrestBadge seed={profile.crest_seed} size={40} />
              ) : (
                <span className="text-3xl">{toast.icon || '🏰'}</span>
              )}
              <div>
                <h3 className="text-lg font-bold text-command-amber font-[family-name:var(--font-serif-epic)]">
                  {toast.title}
                </h3>
                {toast.subtitle && (
                  <p className="text-sm text-command-text">{toast.subtitle}</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </CinematicContext.Provider>
  );
}

export function useCinematic(): CinematicContextValue {
  const context = useContext(CinematicContext);
  if (!context) {
    throw new Error('useCinematic must be used within a CinematicProvider');
  }
  return context;
}
