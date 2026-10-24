# فاز ۶: جهان مشترک + نامه‌ها + اتحاد + Realtime + SOS

## راهنمای اجرا

### ۱. اجرای Schema

در Supabase SQL Editor، فایل `schema_phase6.sql` را اجرا کنید:

```sql
-- این فایل:
-- - جدول letters (نامه‌ها) را می‌سازد
-- - جدول alliances (پیمان‌ها) را می‌سازد
-- - توابع RPC: create_alliance_request, respond_alliance, send_letter
-- - view public_profiles را گسترش می‌دهد
```

### ۲. فعال‌سازی Realtime

در Supabase Dashboard:
1. Database → Replication
2. جداول `notifications`, `letters`, `alliances` را به publication `supabase_realtime` اضافه کنید

### ۳. دیپلوی Edge Function

```bash
supabase functions deploy sos-broadcast
```

متغیرهای env:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### ۴. تست تک‌کاربره

```bash
npm run dev
```

1. `/world` — فقط خودت را می‌بینی (اگر کاربر دیگری نیست)
2. `/alliances` — خالی
3. `/letters` — خالی
4. NotificationBell در TopBar باید کار کند

### ۵. تست دوکاربره (مهم)

با یک مرورگر دیگر یا Incognito:

1. **ایجاد حساب دوم:**
   - با کد دعوت جدید ثبت‌نام کن
   - سوگند را امضا کن

2. **تست نامه:**
   - از حساب A به B نامه بفرست (`/letters` → نوشتن نامه)
   - در حساب B باید **در لحظه** toast ببینی
   - B نامه را باز کند → A notification "خوانده شد" می‌گیرد

3. **تست پیمان:**
   - از A به B درخواست پیمان بفرست (`/alliances` → ارسال درخواست)
   - B notification می‌گیرد
   - B پذیرش کند → A notification می‌گیرد
   - هر دو در لیست هم‌پیمان‌ها یکدیگر را می‌بینند

4. **تست SOS:**
   - A یک urge ثبت کند و SOS بزند
   - B notification قرمز می‌بیند: "🆘 کمک فوری!"
   - B می‌تواند پاسخ دهد

### ۶. بررسی Privacy

از حساب B نگاه کن:
- ✅ فقط اطلاعات public_profiles قابل مشاهده است
- ❌ urge ها، habit ها، و داده‌های خصوصی A قابل مشاهده نیستند

## ساختار فایل‌ها

### دیتابیس:
- `supabase/schema_phase6.sql` — جداول letters, alliances + توابع RPC
- `supabase/functions/sos-broadcast/index.ts` — Edge Function برای SOS

### Types:
- `src/types/social.ts` — تایپ‌های Letter, Alliance, Notification, PublicProfile

### Constants:
- `src/lib/socialConstants.ts` — اطلاعات انواع نامه و پیمان

### Hooks:
- `src/hooks/usePublicProfiles.ts` — fetch پروفایل‌های عمومی
- `src/hooks/useLetters.ts` — مدیریت نامه‌ها
- `src/hooks/useAlliances.ts` — مدیریت پیمان‌ها
- `src/hooks/useRealtimeNotifications.ts` — Realtime notifications + CinematicToast

### Routes:
- `src/routes/WorldMapPage.tsx` (بازنویسی) — نقشه‌ی جهان مشترک
- `src/routes/LettersPage.tsx` (بازنویسی) — صندوق ورودی/ارسال‌شده/نوشتن
- `src/routes/AlliancesPage.tsx` (جدید) — هم‌پیمان‌ها/درخواست‌ها/ارسال

### Components:
- `src/components/layout/NotificationBell.tsx` — زنگ اعلان‌ها با dropdown

### Updates:
- `src/components/layout/TopBar.tsx` — افزودن NotificationBell
- `src/App.tsx` — افزودن route /alliances
- `src/lib/constants.ts` — افزودن اتحاد به NAV_ITEMS

## نکات مهم

### اگر Realtime کار نکرد:
- در Supabase Dashboard → Database → Replication بررسی کن که جداول در publication باشند
- مطمئن شو که `supabase_realtime` publication فعال است

### اگر SOS خطای "function not found" داد:
- `supabase functions deploy sos-broadcast` را دوباره بزن
- مطمئن شو env variables درست تنظیم شده‌اند

### اگر NotificationBell badge آپدیت نشد:
- `useRealtimeNotifications` فقط یک بار در TopBar صدا زده شده باشد
- بررسی کن که subscription درست کار می‌کند

## معیارهای پذیرش

✅ نقشه‌ی جهان مشترک با همه‌ی سرزمین‌ها
✅ کلیک روی پچ → PublicProfileModal
✅ سیستم نامه‌ها (inbox/sent/compose)
✅ LetterScroll با استایل طومار
✅ اتحاد و پیمان (truce/alliance)
✅ درخواست پیمان با پیام اختیاری
✅ پذیرش/رد درخواست‌ها
✅ Realtime notifications با CinematicToast
✅ NotificationBell در TopBar با badge
✅ SOS واقعی با Edge Function
✅ Privacy: فقط public_profiles قابل مشاهده
✅ همه اعداد فارسی
✅ انیمیشن‌ها با Motion
✅ موبایل‌فرندلی
✅ `npm run build` بدون خطا

## مرحله بعد: فاز ۷

فاز ۶ کامل شد! حالا سیستم اجتماعی آماده است.

**فاز ۷ (اختیاری):** تکمیل مکانیک جنگ
- مینی‌گیم‌های نبرد
- آتش‌بس موقت
- پالایش باف برخاستن

**یا فاز ۸:** تالار ژنرال‌ها + سیستم اهدا
- نمایش ژنرال‌های برتر
- اهدای منابع به هم‌پیمان‌ها
- سیستم امتیازدهی
