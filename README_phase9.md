# فاز ۹: شورای مشاوران + اوراکل + آینه‌ی جنگ (AI)

این فاز هوش استراتژیک با AI را اضافه می‌کند:
- شورای مشاوران (چت با ۴ شخصیت AI)
- اوراکل (پیش‌بینی الگوهای حمله با AI + آماری)
- آینه‌ی جنگ (داشبورد تحلیلی بدون شرم)

## فایل‌های ایجاد شده

### دیتابیس
- `supabase/schema_phase9.sql` - جداول council_messages, oracle_predictions, future_letters

### Edge Functions
- `supabase/functions/council-advisor/index.ts` - چت با ۴ مشاور AI
- `supabase/functions/oracle-analyze/index.ts` - پیش‌بینی اوراکل

### Types
- `src/types/council.ts` - تایپ‌های Advisor و CouncilMessage
- `src/types/oracle.ts` - تایپ‌های OraclePrediction و RiskLevel

### Constants
- `src/lib/advisorConstants.ts` - ADVISORS و RISK_INFO

### Hooks
- `src/hooks/useCouncil.ts` - مدیریت چت با مشاوران
- `src/hooks/useOracle.ts` - مدیریت پیش‌بینی‌های اوراکل

### Components - Council
- `src/components/council/AdvisorCard.tsx` - کارت مشاور
- `src/components/council/ChatMessage.tsx` - پیام چت
- `src/components/council/ChatInput.tsx` - ورودی چت
- `src/components/council/QuickActions.tsx` - دکمه‌های سریع
- `src/components/council/TypingIndicator.tsx` - نشانگر تایپ
- `src/components/council/CouncilChat.tsx` - چت کامل

### Components - Oracle
- `src/components/oracle/OraclePredictionCard.tsx` - کارت پیش‌بینی
- `src/components/oracle/OracleHistory.tsx` - تاریخچه پیش‌بینی‌ها

### Components - Mirror
- `src/components/mirror/MirrorStats.tsx` - آمار آینه
- `src/components/mirror/WhatYouLost.tsx` - آنچه از دست دادی
- `src/components/mirror/WhatYouGained.tsx` - آنچه به دست آوردی

### Routes
- `src/routes/CouncilPage.tsx` - شورای مشاوران (بازنویسی)
- `src/routes/OraclePage.tsx` - اوراکل (بازنویسی)
- `src/routes/MirrorPage.tsx` - آینه‌ی جنگ (بازنویسی)

### Components - UI
- `src/components/ui/Skeleton.tsx` - کامپوننت Skeleton

### Updates
- `src/lib/constants.ts` - به‌روزرسانی NAV_ITEMS
- `src/App.tsx` - به‌روزرسانی routes

## راهنمای اجرا

### ۱. اجرای Schema
```bash
# در Supabase SQL Editor اجرا کنید:
supabase/schema_phase9.sql
```

### ۲. دریافت کلید AI
- **OpenAI:** برو به platform.openai.com → API keys → Create new secret key
- **Anthropic:** برو به console.anthropic.com → API keys

### ۳. دیپلوی Edge Functions
```bash
# تنظیم secrets
supabase secrets set AI_PROVIDER=openai
supabase secrets set OPENAI_API_KEY=sk-...
supabase secrets set AI_MODEL=gpt-4o-mini

# دیپلوی functions
supabase functions deploy council-advisor
supabase functions deploy oracle-analyze
```

### ۴. تست شورای مشاوران
1. به `/council` بروید
2. روی هر مشاور کلیک کنید (الصلب، المارشال، المرآة، الحکیم)
3. پیام بفرستید - پاسخ باید متمایز باشد
4. تست rate limit: ۳۰ پیام سریع بفرستید

### ۵. تست اوراکل
1. به `/oracle` بروید
2. "دریافت پیش‌بینی امروز" را بزنید
3. اگر API خطا داد، fallback آماری کار می‌کند

### ۶. تست آینه‌ی جنگ
1. به `/mirror` بروید
2. Heatmap و آمار را ببینید
3. "آنچه از دست دادی" و "آنچه به دست آوردی" را بررسی کنید

## System Prompts مشاوران

### الصب (The Steadfast) - مشاور صبر
- آرام، صبور، در لحظه‌ی بحران
- همدلی اول، تکنیک دوم
- جملات کوتاه، بدون قضاوت

### المارشال (The Marshal) - مشاور جنگ
- استراتژیست، قاطع، عمل‌گرا
- متافور نظامی
- دستور عملیاتی مشخص

### المرآة (The Mirror) - مشاور آینه
- تحلیل‌گر، داده‌محور، بی‌طرف
- اعداد و درصدها
- بدون احساس

### الحکیم (The Sage) - مشاور خرد
- فیلسوف، عمیق، بلندمدت
- سوال‌های عمیق
- تمثیل و استعاره

## Privacy

در context ارسالی به AI:
- ✅ streak_days, willpower, morale, total_points, rank
- ✅ callsign (فقط نام مستعار)
- ❌ private_note (هرگز)
- ❌ جزئیات urge خام (هرگز)
- ❌ نام واقعی (هرگز)

## هزینه

با gpt-4o-mini:
- هر چت ≈ $0.0001
- ۳۰ پیام/روز برای ۱۰ کاربر ≈ $0.03/روز
- ≈ $1/ماه

## معیارهای پذیرش

✅ شورای مشاوران با ۴ شخصیت AI متمایز
✅ چت با تاریخچه و typing indicator
✅ Rate limit (۳۰ پیام/روز)
✅ اوراکل با پیش‌بینی AI
✅ Fallback آماری اگر AI خطا داد
✅ آینه‌ی جنگ با Heatmap و آمار
✅ Privacy: هیچ داده‌ی حساس به AI نمی‌رود
✅ `/patterns` به `/mirror` redirect می‌شود
✅ `npm run build` بدون خطا

## مرحله بعد: فاز ۱۰

فاز ۱۰ شامل:
- صداهای واقعی (mp3)
- PWA
- پالایش نهایی
- آپلود به GitHub Pages
