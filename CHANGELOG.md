# Changelog

تمام تغییرات مهم پروژه «قلعه‌ی ذهن» در این فایل مستند شده‌اند.

## [1.0.0] - 2026-03-14

### فاز ۱۰: صداهای واقعی + PWA + پالایش نهایی + انتشار
- سیستم صدا با fallback به oscillator
- PWA با Service Worker و قابلیت آفلاین
- ErrorBoundary برای مدیریت خطاهای کلی
- MapErrorBoundary برای خطاهای WebGL
- TerritoryListFallback برای نمای لیستی شهرها
- React.lazy برای بهینه‌سازی بارگذاری صفحات سنگین
- Modal با focus trap و accessibility
- اسکریپت‌های seed-invite-codes و verify-install
- مستندات نهایی (README, CHANGELOG, test-checklist)
- تنظیمات PWA (UpdatePrompt, InstallPrompt)
- hook useReducedMotion برای احترام به تنظیمات کاربر

## [0.9.0] - 2026-03-13

### فاز ۹: شورای مشاوران + اوراکل + آینه‌ی جنگ (AI)
- شورای مشاوران با ۴ شخصیت AI (الصلب، المارشال، المرآة، الحکیم)
- Edge Function council-advisor برای چت با مشاوران
- اوراکل برای پیش‌بینی الگوهای حمله
- Edge Function oracle-analyze با fallback آماری
- آینه‌ی جنگ برای تحلیل بدون شرم
- جداول council_messages و oracle_predictions
- کامپوننت‌های ChatMessage, ChatInput, QuickActions
- OraclePredictionCard و OracleHistory
- MirrorStats, WhatYouLost, WhatYouGained

## [0.8.0] - 2026-03-12

### فاز ۸: ژنرال‌ها + یادگاری‌ها + درخت مهارت
- سیستم ژنرال‌ها با آرشیو تجربه
- تولید خودکار ژنرال در ارتقای رتبه
- تالار ژنرال‌ها با قابلیت ارسال به همرزم
- Edge Function dispatch-general
- ۱۹ یادگاری با شرایط مختلف
- باز شدن خودکار یادگاری‌ها با تریگر
- درخت مهارت با ۴ شاخه و ۲۰ گره
- باز شدن خودکار گره‌های مهارت
- جداول generals, relic_definitions, relics, skills
- توابع create_general_for_rank, check_relic_unlocks, check_skill_unlocks

## [0.7.0] - 2026-03-11

### فاز ۷: تکمیل مکانیک نبرد
- مینی‌گیم SOS سه مرحله‌ای (تنفس، شمارش، نوشتن)
- سیستم آتش‌بس برای جنگ خارجی
- باف برخاستن (Rise Buff) کامل
- تحلیل الگوی حمله (Heatmap, TriggerBars)
- صفحه /patterns برای تحلیل
- جدول truce_periods
- توابع start_truce, cancel_truce, get_active_truce, resist_urge_with_sos
- به‌روزرسانی toggle_habit و add_goal_progress برای Rise Buff
- صداهای جدید (playBreathIn, playBreathOut)

## [0.6.0] - 2026-03-10

### فاز ۶: جهان مشترک + نامه‌ها + اتحاد + Realtime + SOS
- نقشه‌ی جهان مشترک با مشاهده سرزمین‌های سایر فرماندهان
- سیستم کامل نامه‌ها (inbox/sent/compose)
- سیستم اتحاد و پیمان (truce/alliance)
- Realtime notifications با CinematicToast
- NotificationBell در TopBar
- Edge Function sos-broadcast برای SOS واقعی
- جداول letters, alliances
- توابع send_letter, create_alliance_request, respond_alliance
- هوک‌های usePublicProfiles, useLetters, useAlliances, useRealtimeNotifications

## [0.5.0] - 2026-03-09

### فاز ۵: To-Do + هدف‌گذاری (جنگ خارجی)
- سیستم عادت‌ها با سه فرکانس (روزانه/هفتگی/ماهانه)
- SuccessGauge برای درصد موفقیت
- سیستم هدف‌گذاری با ProgressRing
- عادت‌های پیش‌فرض با seed خودکار
- محاسبه streak جنگ خارجی
- جداول habits, habit_logs, goals, goal_updates
- توابع toggle_habit, add_goal_progress, seed_default_habits
- هوک‌های useHabits, useGoals

## [0.4.0] - 2026-03-08

### فاز ۴: تایمر پایداری + فتح شهر + سقوط کاخ
- تایمر پایداری ۲۴ ساعته
- دکمه فتح شهر با انیمیشن سینمایی
- CityFreeSequence با ذرات طلایی
- DefeatSequence با شورشی‌ها و پرچم‌ها
- RiseLetter با طومار کاغذی
- UrgeModal برای ثبت حمله‌ها
- CinematicToast برای اعلان‌های سینمایی
- Edge Function daily-cron
- توابع liberate_next_city, resist_urge, defeat_citadel
- صداهای Web Audio API (horn, drum, defeat)

## [0.3.0] - 2026-03-07

### فاز ۳: مپ سه‌بعدی ایزومتریک
- مپ سه‌بعدی با ۱۸۰ هکس
- InstancedMesh برای عملکرد بالا
- دوربین با محدودیت‌های زوم، چرخش، تیلت، پن
- FogLayer برای هکس‌های قفل
- ProvinceBorders برای مرزهای استان و ایالت
- BattleLine برای هکس‌های در نبرد
- CapitalKeep برای کاخ پایتخت
- TerritoryHUD با آمار
- ZoomControls و MapLegend
- CityPanel برای جزئیات شهر
- جداول territories, tiles
- الگوریتم computeHexLayout برای تولید موقعیت هکس‌ها

## [0.2.0] - 2026-03-06

### فاز ۲: App Shell + داشبورد + پروفایل
- AppShell با Sidebar و TopBar
- داشبورد با StatCardها
- CrestBadge پروسیجرال
- RankBadge با نوار پیشرفت
- CallsignEditor برای ویرایش نام
- صفحات placeholder برای مسیرهای آینده
- توکن‌های Tailwind (command-bg, command-amber, و غیره)
- فونت‌های Cinzel, Inter, JetBrains Mono

## [0.1.0] - 2026-03-05

### فاز ۱: احراز هویت + سوگند فرمانده
- ثبت‌نام با کد دعوت ۶ رقمی
- ورود با ایمیل/رمز
- OathScroll با متن حماسی
- امضای سوگند
- جدول profiles با فیلدهای پایه
- جدول invite_codes
- تابع consume_invite_code
- تریگر handle_new_user

### فاز ۰: زیرساخت پروژه
- React 18 + TypeScript + Vite
- Tailwind CSS 4
- Supabase client
- React Router
- Motion برای انیمیشن‌ها
- GitHub Actions برای CI/CD
- ساختار پوشه‌بندی
- تنظیمات PWA اولیه

---

## فرمت نسخه‌ها

این پروژه از [Semantic Versioning](https://semver.org/lang/fa/) پیروی می‌کند:

- **MAJOR** (x.0.0): تغییرات ناسازگار
- **MINOR** (0.x.0): افزودن ویژگی‌های جدید
- **PATCH** (0.0.x): رفع باگ‌ها

## لینک‌ها

- [Releases](https://github.com/yourusername/mind-citadel/releases)
- [Issues](https://github.com/yourusername/mind-citadel/issues)
- [Documentation](./README.md)
