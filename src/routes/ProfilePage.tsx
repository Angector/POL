import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { CrestBadge } from '../components/profile/CrestBadge';
import { RankBadge } from '../components/profile/RankBadge';
import { StatCard } from '../components/profile/StatCard';
import { CallsignEditor } from '../components/profile/CallsignEditor';
import { Card } from '../components/ui/Card';
import { formatDate } from '../lib/format';

export default function ProfilePage() {
  const { profile, loading } = useAuth();

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-command-amber font-[family-name:var(--font-mono-hud)]">
          در حال بارگذاری...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Main Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="text-center">
          <div className="flex justify-center mb-6">
            <CrestBadge seed={profile.crest_seed || 'default'} size={128} />
          </div>

          <div className="mb-6">
            <CallsignEditor initialCallsign={profile.callsign} />
          </div>

          <p className="text-command-muted mb-4">
            فرمانروای سرزمین {profile.territory_name || 'بی‌نام'}
          </p>

          <RankBadge points={profile.total_points} size="lg" />
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          label="روزهای پایداری"
          value={profile.streak_days}
          unit="روز"
          icon="⚔️"
          accent="amber"
        />
        <StatCard
          label="اراده"
          value={profile.willpower}
          unit="WP"
          icon="🔥"
          accent="olive"
        />
        <StatCard
          label="روحیه"
          value={profile.morale}
          unit="%"
          icon="🛡️"
          accent="amber"
        />
        <StatCard
          label="امتیاز کل"
          value={profile.total_points}
          icon="⭐"
          accent="crimson"
        />
      </motion.div>

      {/* Oath History */}
      <Card>
        <h3 className="text-lg font-bold text-command-amber mb-3 font-[family-name:var(--font-serif-epic)]">
          تاریخچه‌ی پیمان
        </h3>
        {profile.oath_signed_at ? (
          <p className="text-command-text">
            پیمان در تاریخ {formatDate(profile.oath_signed_at)} امضا شد.
          </p>
        ) : (
          <p className="text-command-muted">
            هنوز پیمانی امضا نشده است.
          </p>
        )}
      </Card>
    </div>
  );
}
