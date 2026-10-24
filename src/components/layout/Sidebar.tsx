import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { NAV_ITEMS } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="w-60 h-full bg-command-panel border-l border-command-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-command-border">
        <h1 className="text-xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)]">
          قلعه‌ی ذهن
        </h1>
        <div className="h-px bg-command-border mt-3" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-sm transition-colors border-r-2 ${
                isActive
                  ? 'bg-command-amber/10 border-command-amber text-command-amber'
                  : 'border-transparent text-command-muted hover:text-command-text hover:bg-command-bg'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
            {item.phase && (
              <span className="text-xs text-command-muted mr-auto">
                فاز {item.phase}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-command-border">
        {profile && (
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-command-olive/20 flex items-center justify-center text-xs text-command-amber">
              {profile.callsign.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-command-text truncate">{profile.callsign}</p>
              <p className="text-xs text-command-muted truncate">{profile.rank}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="w-full px-4 py-2 text-sm text-command-muted border border-command-border rounded hover:border-command-crimson hover:text-command-crimson transition-colors"
        >
          خروج
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block fixed top-0 right-0 bottom-0 z-40">
        {sidebarContent}
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 z-50"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
