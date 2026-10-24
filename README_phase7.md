# فاز ۷: تکمیل مکانیک نبرد

این فاز مکانیک‌های نبرد را کامل می‌کند:
- مینی‌گیم SOS (تنفس، شمارش معکوس، نوشتن)
- سیستم آتش‌بس (فقط جنگ خارجی)
- باف برخاستن (Rise Buff) کامل
- تحلیل الگوی حمله (Heatmap و Trigger Bars)
- صداهای جدید (playBreathIn, playBreathOut)

## فایل‌های ایجاد شده

### دیتابیس
- `supabase/schema_phase7.sql` - جدول truce_periods، توابع start_truce, cancel_truce, get_active_truce, resist_urge_with_sos، به‌روزرسانی toggle_habit و add_goal_progress برای Rise Buff
- `supabase/functions/daily-cron/index.ts` - به‌روزرسانی برای بررسی آتش‌بس

### Types
- `src/types/truce.ts` - تایپ‌های Truce و TruceReason
- `src/types/letter.ts` - به‌روزرسانی برای from_system و from_user_id nullable

### Constants
- `src/lib/truceConstants.ts` - TRUCE_REASONS

### Hooks
- `src/hooks/useTruce.ts` - مدیریت آتش‌بس
- `src/hooks/useUrgeStats.ts` - تحلیل الگوی حمله

### Components
- `src/components/battle/SosMiniGame.tsx` - مینی‌گیم SOS سه مرحله‌ای
- `src/components/battle/TruceCard.tsx` - کارت آتش‌بس
- `src/components/battle/TruceComposer.tsx` - مودال شروع آتش‌بس
- `src/components/battle/RiseBuffIndicator.tsx` - نشانگر باف برخاستن
- `src/components/patterns/HeatmapHour.tsx` - Heatmap ساعتی
- `src/components/patterns/HeatmapDay.tsx` - Heatmap روز هفته
- `src/components/patterns/TriggerBars.tsx` - نمودار محرک‌ها
- `src/components/patterns/PatternSummary.tsx` - خلاصه الگو

### Routes
- `src/routes/PatternsPage.tsx` - صفحه تحلیل الگوی حمله

### Updates
- `src/lib/sounds.ts` - افزودن playBreathIn و playBreathOut
- `src/lib/constants.ts` - افزودن /patterns به NAV_ITEMS
- `src/App.tsx` - افزودن route /patterns
- `src/components/layout/TopBar.tsx` - افزودن RiseBuffIndicator
- `src/routes/TodoPage.tsx` - افزودن TruceCard

## راهنمای اجرا

### ۱. اجرای Schema
```bash
# در Supabase SQL Editor اجرا کنید:
supabase/schema_phase7.sql
```

### ۲. به‌روزرسانی Edge Function
```bash
supabase functions deploy daily-cron
```

### ۳. تست مینی‌گیم SOS
1. به `/territory` بروید
2. روی دکمه‌ی «حمله‌ی دشمن» کلیک کنید
3. روی SOS کلیک کنید
4. مینی‌گیم سه مرحله‌ای باز می‌شود:
   - مرحله ۱: تنفس (۳ چرخه ۴-۴-۴)
   - مرحله ۲: شمارش معکوس (۳۰ ثانیه)
   - مرحله ۳: نوشتن دلیل مقاومت
5. بعد از تکمیل، نامه‌ای از شورای مشاوران دریافت می‌کنید

### ۴. تست آتش‌بس
1. به `/todo` بروید
2. روی «آتش‌بس بگیر» کلیک کنید
3. دلیل را انتخاب کنید (مسافرت، بیماری، و غیره)
4. کارت آتش‌بس نمایش داده می‌شود
5. عادت‌های external تحت تأثیر قرار می‌گیرند، internal نه

### ۵. تست Rise Buff
```sql
-- در Supabase SQL Editor:
UPDATE profiles 
SET rise_buff_until = NOW() + INTERVAL '2 days'
WHERE id = '<your-user-id>';
```
- نشانگر «🔥 برخاسته» در TopBar نمایش داده می‌شود
- پاداش ماموریت‌های external +10% می‌شود

### ۶. تست تحلیل الگو
1. چند urge ثبت کنید (از طریق UrgeModal)
2. به `/patterns` بروید
3. Heatmap ساعتی و روز هفته را ببینید
4. Trigger Bars و Pattern Summary را بررسی کنید

## معیارهای پذیرش

✅ مینی‌گیم SOS سه مرحله‌ای (تنفس، شمارش، نوشتن)
✅ سیستم آتش‌بس (فقط جنگ خارجی، حداکثر ۳ روز)
✅ Rise Buff Indicator در TopBar
✅ اعمال Rise Buff در toggle_habit و add_goal_progress
✅ تحلیل الگوی حمله (Heatmap + Trigger Bars)
✅ صفحه /patterns با آمار کامل
✅ صداهای جدید (playBreathIn, playBreathOut)
✅ نامه از شورای مشاوران بعد از SOS موفق
✅ `npm run build` بدون خطا

## مرحله بعد: فاز ۸

فاز ۸ شامل:
- تالار ژنرال‌ها (Leaderboard)
- سیستم اهدای منابع
- درخت مهارت
- یادگاری‌ها
