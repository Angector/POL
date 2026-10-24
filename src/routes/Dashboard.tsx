import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';

export default function Dashboard() {
  const { signOut } = useAuth();
  const { profile } = useProfile();

  if (!profile) {
    return (
      <div className="min-h-screen bg-command-bg flex items-center justify-center">
        <div className="text-command-amber text-lg font-[family-name:var(--font-mono-hud)]">
          در حال بارگذاری...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-command-bg">
      {/* Header */}
      <header className="border-b border-command-border bg-command-panel">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)]">
              قلعه‌ی ذهن
            </h1>
            <p className="text-xs text-command-muted mt-1">
              داشبورد فرمانده
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-command-text">{profile.callsign}</p>
              <p className="text-xs text-command-muted">{profile.rank}</p>
            </div>

            <button
              onClick={signOut}
              className="px-4 py-2 border border-command-border text-command-muted text-sm hover:border-command-crimson hover:text-command-crimson transition-colors"
            >
              خروج
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-command-text mb-2">
            خوش آمدید، {profile.callsign}
          </h2>
          <p className="text-command-muted">
            سوگند شما در تاریخ {new Date(profile.oath_signed_at || '').toLocaleDateString('fa-IR')} امضا شد.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="روزهای متوالی" value={profile.streak_days} />
          <StatCard label="اراده" value={profile.willpower} />
          <StatCard label="روحیه" value={profile.morale} />
          <StatCard label="امتیاز کل" value={profile.total_points} />
        </div>

        {/* Placeholder for future content */}
        <div className="bg-command-panel border border-command-border rounded-lg p-8 text-center">
          <p className="text-command-muted text-lg">
            فازهای بعدی: نبرد با عادت‌ها، ارتقای قلعه، و نقشه‌ی جهان بازی
          </p>
          <p className="text-command-muted text-sm mt-4 font-[family-name:var(--font-mono-hud)]">
            فاز ۱ تکمیل شده است ✓
          </p>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-command-panel border border-command-border rounded-lg p-6">
      <p className="text-sm text-command-muted mb-2">{label}</p>
      <p className="text-3xl font-bold text-command-amber font-[family-name:var(--font-mono-hud)]">
        {value}
      </p>
    </div>
  );
}
