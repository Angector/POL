-- ============================================================
-- Mind Citadel – Verify Installation
-- ============================================================
-- این اسکریپت صحت نصب جداول، توابع، RLS policy ها و تریگرها را بررسی می‌کند.

-- بررسی جداول
SELECT '✓ جدول profiles' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles');
SELECT '✓ جدول territories' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'territories');
SELECT '✓ جدول tiles' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tiles');
SELECT '✓ جدول invites' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'invites');
SELECT '✓ جدول urges' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'urges');
SELECT '✓ جدول habits' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'habits');
SELECT '✓ جدول habit_logs' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'habit_logs');
SELECT '✓ جدول goals' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'goals');
SELECT '✓ جدول goal_updates' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'goal_updates');
SELECT '✓ جدول generals' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'generals');
SELECT '✓ جدول relics' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'relics');
SELECT '✓ جدول skills' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'skills');
SELECT '✓ جدول letters' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'letters');
SELECT '✓ جدول alliances' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'alliances');
SELECT '✓ جدول notifications' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications');
SELECT '✓ جدول council_messages' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'council_messages');
SELECT '✓ جدول oracle_predictions' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'oracle_predictions');

-- بررسی توابع
SELECT '✓ تابع consume_invite_code' as status WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'consume_invite_code');
SELECT '✓ تابع liberate_city' as status WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'liberate_city');
SELECT '✓ تابع resist_urge' as status WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'resist_urge');
SELECT '✓ تابع defeat_citadel' as status WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'defeat_citadel');
SELECT '✓ تابع toggle_habit' as status WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'toggle_habit');
SELECT '✓ تابع add_goal_progress' as status WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'add_goal_progress');
SELECT '✓ تابع create_general_for_rank' as status WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'create_general_for_rank');
SELECT '✓ تابع check_relic_unlocks' as status WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'check_relic_unlocks');
SELECT '✓ تابع check_skill_unlocks' as status WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'check_skill_unlocks');
SELECT '✓ تابع send_letter' as status WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'send_letter');
SELECT '✓ تابع create_alliance_request' as status WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'create_alliance_request');
SELECT '✓ تابع respond_alliance' as status WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'respond_alliance');
SELECT '✓ تابع start_truce' as status WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'start_truce');
SELECT '✓ تابع cancel_truce' as status WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'cancel_truce');
SELECT '✓ تابع get_active_truce' as status WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_active_truce');
SELECT '✓ تابع resist_urge_with_sos' as status WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'resist_urge_with_sos');

-- بررسی RLS
SELECT '✓ RLS فعال روی profiles' as status WHERE EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'profiles' AND rowsecurity = true);
SELECT '✓ RLS فعال روی territories' as status WHERE EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'territories' AND rowsecurity = true);
SELECT '✓ RLS فعال روی tiles' as status WHERE EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'tiles' AND rowsecurity = true);
SELECT '✓ RLS فعال روی habits' as status WHERE EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'habits' AND rowsecurity = true);
SELECT '✓ RLS فعال روی goals' as status WHERE EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'goals' AND rowsecurity = true);
SELECT '✓ RLS فعال روی generals' as status WHERE EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'generals' AND rowsecurity = true);
SELECT '✓ RLS فعال روی relics' as status WHERE EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'relics' AND rowsecurity = true);
SELECT '✓ RLS فعال روی skills' as status WHERE EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'skills' AND rowsecurity = true);
SELECT '✓ RLS فعال روی letters' as status WHERE EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'letters' AND rowsecurity = true);
SELECT '✓ RLS فعال روی alliances' as status WHERE EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'alliances' AND rowsecurity = true);

-- بررسی تریگرها
SELECT '✓ تریگر on_auth_user_created' as status WHERE EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created');
SELECT '✓ تریگر on_rank_change' as status WHERE EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_rank_change');
SELECT '✓ تریگر on_relic_check' as status WHERE EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_relic_check');
SELECT '✓ تریگر on_skill_check' as status WHERE EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_skill_check');

-- بررسی داده‌های اولیه
SELECT '✓ ' || COUNT(*) || ' یادگاری تعریف شده' as status FROM relic_definitions;
SELECT '✓ ' || COUNT(*) || ' کد دعوت موجود' as status FROM invite_codes WHERE is_active = true;

-- خلاصه نهایی
SELECT '✅ بررسی نصب تکمیل شد' as final_status;
