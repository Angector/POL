import { useState } from 'react';
import { usePublicProfiles } from '../hooks/usePublicProfiles';
import { CrestBadge } from '../components/profile/CrestBadge';
import { Card } from '../components/ui/Card';
import { formatPersianNumber } from '../lib/format';
import { motion } from 'motion/react';
import type { PublicProfile } from '../types/social';

export default function WorldMapPage() {
  const { profiles, loading, error } = usePublicProfiles();
  const [selectedProfile, setSelectedProfile] = useState<PublicProfile | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-command-amber font-[family-name:var(--font-mono-hud)]">
          در حال بارگذاری جهان...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-command-crimson/20 border border-command-crimson rounded-lg p-4">
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)] mb-2">
            جهان مشترک
          </h1>
          <p className="text-command-muted">
            سرزمین‌های سایر فرماندهان را ببین و با آن‌ها ارتباط برقرار کن
          </p>
        </div>
        <Card className="text-center py-12">
          <p className="text-command-muted mb-4">
            هنوز کسی در قلمرو نیست. کد دعوت خودت را با دوستانت به اشتراک بذار.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)] mb-2">
          جهان مشترک
        </h1>
        <p className="text-command-muted">
          سرزمین‌های سایر فرماندهان را ببین و با آن‌ها ارتباط برقرار کن
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {profiles.map((profile) => (
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedProfile(profile)}
            className="cursor-pointer"
          >
            <Card className="hover:border-command-amber transition-colors">
              <div className="flex flex-col items-center text-center gap-3">
                <CrestBadge seed={profile.crest_seed || 'default'} size={48} />
                <div>
                  <h3 className="font-bold text-command-text">
                    {profile.callsign}
                  </h3>
                  <p className="text-xs text-command-muted italic">
                    {profile.territory_name || 'سرزمین بی‌نام'}
                  </p>
                </div>
                <div className="w-full space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-command-muted">فتح</span>
                    <span className="text-command-amber font-[family-name:var(--font-mono-hud)]">
                      {formatPersianNumber(profile.freed_count)} / ۱۸۰
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-command-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-command-amber transition-all"
                      style={{ width: `${(profile.freed_count / 180) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-command-muted">
                  <span>🔥 {formatPersianNumber(profile.streak_days)} روز</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Profile Modal */}
      {selectedProfile && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProfile(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-command-panel border border-command-border rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <CrestBadge seed={selectedProfile.crest_seed || 'default'} size={128} />
              <div>
                <h2 className="text-2xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)]">
                  {selectedProfile.callsign}
                </h2>
                <p className="text-sm text-command-muted">
                  {selectedProfile.territory_name || 'سرزمین بی‌نام'}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 w-full">
                <div className="text-center">
                  <p className="text-2xl font-bold text-command-amber font-[family-name:var(--font-mono-hud)]">
                    {formatPersianNumber(selectedProfile.freed_count)}
                  </p>
                  <p className="text-xs text-command-muted">شهر آزاد</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-command-olive font-[family-name:var(--font-mono-hud)]">
                    {formatPersianNumber(selectedProfile.streak_days)}
                  </p>
                  <p className="text-xs text-command-muted">روز پایداری</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-command-crimson font-[family-name:var(--font-mono-hud)]">
                    {formatPersianNumber(selectedProfile.total_points)}
                  </p>
                  <p className="text-xs text-command-muted">امتیاز</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProfile(null)}
                className="w-full py-2 bg-command-bg border border-command-border text-command-muted rounded hover:border-command-text transition-colors"
              >
                بستن
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
