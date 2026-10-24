# فاز ۸: ژنرال‌ها + یادگاری‌ها + درخت مهارت

این فاز سیستم پیشرفت بلندمدت را کامل می‌کند:
- سیستم ژنرال‌ها (آرشیو تجربه در هر رتبه)
- تالار ژنرال‌ها با قابلیت ارسال به همرزم
- یادگاری‌ها (Relics) با ۱۹ دستاورد
- درخت مهارت با ۴ شاخه و ۲۰ گره

## فایل‌های ایجاد شده

### دیتابیس
- `supabase/schema_phase8.sql` - جداول generals, relic_definitions, relics, skills + توابع create_general_for_rank, check_relic_unlocks, check_skill_unlocks + تریگرهای on_rank_change, on_relic_check, on_skill_check
- `supabase/functions/dispatch-general/index.ts` - Edge Function برای ارسال ژنرال به همرزم

### Types
- `src/types/general.ts` - تایپ‌های General و ExperienceArchive
- `src/types/relic.ts` - تایپ‌های Relic و RelicDefinition
- `src/types/skill.ts` - تایپ‌های Skill و SkillNodeDefinition

### Constants
- `src/lib/generalConstants.ts` - GENERAL_NAMES و generateGeneralName
- `src/lib/relicDefinitions.ts` - ۱۹ تعریف یادگاری
- `src/lib/skillDefinitions.ts` - ۲۰ گره مهارت در ۴ شاخه

### Hooks
- `src/hooks/useGenerals.ts` - مدیریت ژنرال‌ها
- `src/hooks/useRelics.ts` - مدیریت یادگاری‌ها
- `src/hooks/useSkills.ts` - مدیریت مهارت‌ها

### Components - Generals
- `src/components/generals/GeneralPortrait.tsx` - پرتره ژنرال
- `src/components/generals/GeneralCard.tsx` - کارت ژنرال
- `src/components/generals/GeneralDetailModal.tsx` - مودال جزئیات ژنرال
- `src/components/generals/DispatchGeneralModal.tsx` - مودال ارسال ژنرال
- `src/components/generals/GeneralsGallery.tsx` - گالری ژنرال‌ها

### Components - Relics
- `src/components/relics/RelicCard.tsx` - کارت یادگاری

### Components - Skills
- `src/components/skillTree/SkillNode.tsx` - گره مهارت
- `src/components/skillTree/SkillBranch.tsx` - شاخه مهارت
- `src/components/skillTree/SkillDetailModal.tsx` - مودال جزئیات گره

### Routes
- `src/routes/GeneralsHall.tsx` - تالار ژنرال‌ها
- `src/routes/RelicsPage.tsx` - صفحه یادگاری‌ها
- `src/routes/SkillsPage.tsx` - صفحه درخت مهارت

### Updates
- `src/lib/constants.ts` - افزودن /generals, /relics, /skills به NAV_ITEMS
- `src/App.tsx` - افزودن routes جدید

## راهنمای اجرا

### ۱. اجرای Schema
```bash
# در Supabase SQL Editor اجرا کنید:
supabase/schema_phase8.sql
```

### ۲. دیپلوی Edge Function
```bash
supabase functions deploy dispatch-general
```

### ۳. تست ارتقای رتبه و ژنرال
```sql
-- در Supabase SQL Editor:
UPDATE profiles 
SET total_points = 600
WHERE id = '<your-user-id>';
```
- رتبه به گروهبان تغییر می‌کند
- تریگر `on_rank_change` اجرا می‌شود
- ژنرال جدید ساخته می‌شود
- به `/generals` بروید و ژنرال را ببینید

### ۴. تست یادگاری‌ها
```sql
-- آزاد کردن اولین شهر:
UPDATE tiles 
SET status = 'freed', freed_at = NOW()
WHERE user_id = '<your-user-id>' AND tile_index = 1;
```
- تریگر `on_relic_check` اجرا می‌شود
- یادگاری `first_freed_city` باز می‌شود
- به `/relics` بروید

### ۵. تست مهارت‌ها
```sql
-- افزایش امتیاز:
UPDATE profiles 
SET total_points = 100
WHERE id = '<your-user-id>';
```
- تریگر `on_skill_check` اجرا می‌شود
- گره `order_1`, `courage_1`, `wisdom_1`, `steadfastness_1` باز می‌شوند
- به `/skills` بروید

### ۶. تست ارسال ژنرال
1. به `/generals` بروید
2. روی یک ژنرال کلیک کنید
3. "ارسال به همرزم" را بزنید
4. همرزم را انتخاب کنید (باید پیمان داشته باشید)
5. Edge Function `dispatch-general` اجرا می‌شود
6. گیرنده notification دریافت می‌کند

## معیارهای پذیرش

✅ سیستم ژنرال‌ها با آرشیو تجربه
✅ تولید خودکار ژنرال در ارتقای رتبه
✅ تالار ژنرال‌ها با دو تب (من / دریافتی)
✅ ارسال ژنرال به همرزم
✅ ۱۹ یادگاری با شرایط مختلف
✅ باز شدن خودکار یادگاری‌ها
✅ درخت مهارت با ۴ شاخه و ۲۰ گره
✅ باز شدن خودکار گره‌های مهارت
✅ `npm run build` بدون خطا

## مرحله بعد: فاز ۹

فاز ۹ شامل:
- شورای مشاوران (AI-powered)
- اوراکل (پیش‌بینی)
- آینه‌ی جنگ (تحلیل پیشرفته)
