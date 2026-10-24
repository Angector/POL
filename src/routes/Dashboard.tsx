import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/profile/StatCard';
import { RankBadge } from '../components/profile/RankBadge';
import { Card } from '../components/ui/Card';
import { getMessageOfTheDay } from '../lib/constants';

export default function Dashboard() {
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

  const messageOfTheDay = getMessageOfTheDay();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)] mb-2">
          ژنرال {profile.callsign}
        </h1>
        <p className="text-command-muted text-lg mb-4">
          فرمانروای سرزمین {profile.territory_name || 'بی‌نام'}
        </p>
        <RankBadge points={profile.total_points} size="md" />
      </motion.header>

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

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Council Message */}
        <Card>
          <h2 className="text-lg font-bold text-command-amber mb-3 font-[family-name:var(--font-serif-epic)]">
            پیام امروز شورای مشاوران
          </h2>
          <p className="text-command-text leading-relaxed">{messageOfTheDay}</p>
        </Card>

        {/* Battle Field */}
        <Card>
          <h2 className="text-lg font-bold text-command-amber mb-3 font-[family-name:var(--font-serif-epic)]">
            میدان نبرد
          </h2>
          <p className="text-command-muted mb-4">
            سرزمینت منتظر فرمان توست.
          </p>
          <Link
            to="/territory"
            className="inline-block px-6 py-2 bg-command-amber text-command-bg font-bold rounded hover:brightness-110 transition-all"
          >
            ورود به سرزمین
          </Link>
        </Card>
      </div>

      {/* Missions Card */}
      <Card>
        <h2 className="text-lg font-bold text-command-amber mb-3 font-[family-name:var(--font-serif-epic)]">
          ماموریت‌های امروز
        </h2>
        <p className="text-command-muted mb-4">
          ماموریت‌های امروزت را بررسی کن و با عادت‌هایت بجنگ.
        </p>
        <Link
          to="/todo"
          className="inline-block px-6 py-2 bg-command-olive text-command-text font-bold rounded hover:brightness-110 transition-all"
        >
          مشاهده ماموریت‌ها
        </Link>
      </Card>
    </div>
  );
}
