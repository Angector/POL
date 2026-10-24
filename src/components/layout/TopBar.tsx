import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RankBadge } from '../profile/RankBadge';
import { CrestBadge } from '../profile/CrestBadge';

interface TopBarProps {
  onOpenSidebar: () => void;
}

export function TopBar({ onOpenSidebar }: TopBarProps) {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 h-16 bg-command-panel/60 backdrop-blur-md border-b border-command-border">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Right: Hamburger (mobile) */}
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 text-command-muted hover:text-command-text transition-colors"
          aria-label="باز کردن منو"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Center: Name and Rank */}
        <div className="flex items-center gap-3">
          {profile && (
            <>
              <div className="hidden sm:block">
                <RankBadge points={profile.total_points} size="sm" />
              </div>
              <h2 className="text-lg font-bold text-command-text">
                {profile.callsign}
              </h2>
            </>
          )}
        </div>

        {/* Left: Avatar */}
        {profile && (
          <button
            onClick={() => navigate('/profile')}
            className="relative group"
            aria-label="پروفایل"
          >
            <CrestBadge seed={profile.crest_seed || 'default'} size={32} />
            <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-command-amber transition-colors" />
          </button>
        )}
      </div>
    </header>
  );
}
