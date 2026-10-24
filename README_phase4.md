# فاز ۴: تایمر پایداری + فتح شهر + سقوط کاخ

## راهنمای اجرا

### ۱. اجرای Schema

در Supabase SQL Editor، فایل‌های زیر را به ترتیب اجرا کنید:

```sql
-- ابتدا schema_phase4.sql
-- این فایل:
-- - فیلدهای جدید به profiles اضافه می‌کند (cycle_started_at, current_cycle, rise_buff_until)
-- - جدول urges را می‌سازد
-- - توابع RPC را ایجاد می‌کند (resist_urge, defeat_citadel, liberate_next_city)
-- - policy های tiles را محدود می‌کند
```

### ۲. دیپلوی Edge Function

اگر Supabase CLI نصب دارید:

```bash
cd supabase/functions/daily-cron
supabase functions deploy daily-cron
```

متغیرهای env را در Supabase Dashboard تنظیم کنید:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET` (یک کلید تصادفی که خودتان می‌سازید)

### ۳. تنظیم Cron Job

در Supabase Dashboard → Database → Extensions → pg_cron را فعال کنید.

سپس یک cron job بسازید:

```sql
select cron.schedule(
  'daily-citadel-cron',
  '0 3 * * *', -- هر روز ساعت ۳ صبح
  $$
  select
    net.http_post(
      url := 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/daily-cron',
      headers := '{"Content-Type": "application/json", "cron-secret": "YOUR_CRON_SECRET"}'::jsonb
    );
  $$
);
```

### ۴. تست

```bash
npm run dev
```

#### تست تایمر:

برای اینکه فوراً تست کنید، در Supabase:

```sql
-- cycle_started_at را به ۲۵ ساعت قبل تغییر دهید
update profiles 
set cycle_started_at = now() - interval '25 hours' 
where id = '<your-user-id>';
```

صفحه را رفرش کنید — دکمه‌ی «فتح شهر بعدی» فعال می‌شود.

#### تست فتح شهر:

1. روی دکمه‌ی «فتح شهر بعدی» کلیک کنید
2. انیمیشن سینمایی باید اجرا شود
3. شهر سبز می‌شود
4. Toast سینمایی نمایش داده می‌شود

#### تست Urge Resist:

1. روی دکمه‌ی شناور «حمله‌ی دشمن» کلیک کنید
2. شدت و محرک را انتخاب کنید
3. «دفع کردم» را بزنید
4. Toast: «حمله دفع شد. +۱۰ اراده»
5. willpower در پروفایل افزایش می‌یابد

#### تست Urge Defeat:

1. روی دکمه‌ی شناور «حمله‌ی دشمن» کلیک کنید
2. «کاخ سقوط کرد» را بزنید
3. انیمیشن DefeatSequence اجرا می‌شود
4. نامه‌ی برخاستن ظاهر می‌شود
5. «برخاستن» را بزنید
6. نقشه ریست می‌شود (شهرهای این دور به locked برمی‌گردند)
7. streak_days = 0
8. rise_buff_until = 3 روز آینده

### ۵. تست موبایل

- عرض مرورگر را به ۳۷۵px تغییر دهید
- دکمه‌ی شناور در پایین-چپ باید دیده شود
- HUD باید responsive باشد
- انیمیشن‌ها باید روی موبایل کار کنند

## ساختار فایل‌ها

### دیتابیس:
- `supabase/schema_phase4.sql` — تغییرات schema
- `supabase/functions/daily-cron/index.ts` — Edge Function

### Types:
- `src/types/urge.ts` — تایپ‌های Urge

### Constants:
- `src/lib/urgeConstants.ts` — برچسب‌های محرک و شدت

### Hooks:
- `src/hooks/useStreak.ts` — تایمر و فتح شهر
- `src/hooks/useUrges.ts` — ثبت حمله‌ها

### Components:
- `src/components/battle/StreakTimer.tsx` — تایمر
- `src/components/battle/LiberateButton.tsx` — دکمه فتح
- `src/components/battle/CityFreeSequence.tsx` — انیمیشن فتح
- `src/components/battle/DefeatSequence.tsx` — انیمیشن سقوط
- `src/components/battle/RiseLetter.tsx` — نامه‌ی برخاستن
- `src/components/battle/RiseBuff.tsx` — نشان باف
- `src/components/battle/UrgeModal.tsx` — مودال حمله
- `src/components/battle/SosButton.tsx` — دکمه کمک
- `src/components/battle/UrgeFloatingButton.tsx` — دکمه شناور
- `src/components/battle/CinematicToast.tsx` — Toast سینمایی

### Utils:
- `src/lib/sounds.ts` — صداهای Web Audio API

### Updates:
- `src/components/map3d/TerritoryHUD.tsx` — گسترش HUD
- `src/components/map3d/TerritoryMap3D.tsx` — پاس دادن props جدید
- `src/routes/TerritoryPage.tsx` — منطق کامل فاز ۴
- `src/types/profile.ts` — افزودن فیلدهای جدید
- `src/App.tsx` — افزودن CinematicProvider

## نکات مهم

### اگر تایمر منفی نشان داد:
`cycle_started_at` در آینده است → بررسی کنید timezone (باید UTC باشد).

### اگر RPC خطای "function does not exist" داد:
مطمئن شوید `schema_phase4.sql` کامل اجرا شده است.

### اگر دکمه‌ی فتح همیشه غیرفعال است:
بررسی کنید که `cycle_started_at` از DB درست fetch می‌شود.

### صداها:
در این فاز از Web Audio API با oscillator استفاده شده است. در فاز ۱۰ با فایل‌های mp3 واقعی جایگزین می‌شود.

## معیارهای پذیرش

✅ تایمر پایداری در HUD نمایش داده می‌شود (HH:MM:SS)
✅ دکمه‌ی «فتح شهر بعدی» فقط بعد از ۲۴ ساعت فعال می‌شود
✅ انیمیشن سینمایی CityFreeSequence اجرا می‌شود
✅ دکمه‌ی شناور «حمله‌ی دشمن» در همه‌ی صفحات دیده می‌شود
✅ UrgeModal با slider شدت و انتخاب trigger
✅ دفع حمله: willpower += 10
✅ سقوط کاخ: DefeatSequence + RiseLetter + ریست نقشه
✅ RiseBuff برای ۳ روز فعال می‌شود
✅ CinematicToast برای اعلان‌های سینمایی
✅ صداهای placeholder با Web Audio API
✅ Edge Function daily-cron برای streak و اعلان‌ها

## مرحله بعد: فاز ۵

فاز ۵ شامل:
- سیستم To-Do (ماموریت‌های روزانه)
- هدف‌گذاری بلندمدت
- ارتباط با فتح شهر
- انیمیشن‌های تکمیل ماموریت
