# فاز ۵: To-Do + هدف‌گذاری (جنگ خارجی)

## راهنمای اجرا

### ۱. اجرای Schema

در Supabase SQL Editor، فایل `schema_phase5.sql` را اجرا کنید:

```sql
-- این فایل:
-- - جدول habits (عادت‌ها) را می‌سازد
-- - جدول habit_logs (ثبت تیک‌ها) را می‌سازد
-- - جدول goals (اهداف) را می‌سازد
-- - جدول goal_updates (ثبت پیشرفت‌ها) را می‌سازد
-- - توابع RPC: toggle_habit, add_goal_progress, seed_default_habits
```

### ۲. تست

```bash
npm run dev
```

#### تست To-Do (`/todo`):

1. به `/todo` بروید
2. اگر هیچ عادتی ندارید، کارت «افزودن ۵ ماموریت پیش‌فرض» ظاهر می‌شود
3. روی آن کلیک کنید → ۵ عادت پیش‌فرض ساخته می‌شود:
   - 🛡 پایداری در جنگ داخلی (internal, 10 امتیاز)
   - ⚔️ ۳۰ دقیقه ورزش (external, 5 امتیاز)
   - ⚔️ ۳۰ دقیقه مطالعه (external, 5 امتیاز)
   - ⚔️ خواب پیش از ۲۳ (external, 3 امتیاز)
   - ⚔️ ۱۰ دقیقه مدیتیشن (external, 3 امتیاز)
4. روی چک‌باکس هر عادت کلیک کنید → تیک می‌خورد
5. SuccessGauge درصد موفقیت را نشان می‌دهد
6. در پروفایل: willpower و total_points افزایش می‌یابد
7. تب‌های روزانه/هفتگی/ماهانه را تست کنید

#### تست Goals (`/goals`):

1. به `/goals` بروید
2. روی «+ هدف جدید» کلیک کنید
3. هدفی بسازید:
   - عنوان: «خواندن ۱۰ کتاب»
   - مقدار هدف: ۱۰
   - واحد: کتاب
4. روی «+» در کارت هدف کلیک کنید
5. مقدار پیشرفت را وارد کنید (مثلاً ۲)
6. ProgressRing آپدیت می‌شود
7. در پروفایل: willpower و total_points افزایش می‌یابد

#### تست Dashboard (`/dashboard`):

1. به `/dashboard` بروید
2. StatCard پنجم «موفقیت امروز» باید نمایش داده شود
3. اگر streak جنگ خارجی دارید، بج «🔥 پایدار در جنگ خارجی: N روز» ظاهر می‌شود

### ۳. بررسی دیتابیس

در Supabase SQL Editor:

```sql
-- بررسی عادت‌ها
select * from habits where user_id = '<your-user-id>';

-- بررسی لاگ‌ها
select * from habit_logs where user_id = '<your-user-id>' order by log_date desc;

-- بررسی اهداف
select * from goals where user_id = '<your-user-id>';

-- بررسی پیشرفت‌ها
select * from goal_updates where user_id = '<your-user-id>' order by created_at desc;
```

## ساختار فایل‌ها

### دیتابیس:
- `supabase/schema_phase5.sql` — جداول و توابع RPC

### Types:
- `src/types/habit.ts` — تایپ‌های Habit و HabitLog
- `src/types/goal.ts` — تایپ‌های Goal و GoalUpdate

### Constants:
- `src/lib/habitConstants.ts` — دسته‌بندی‌ها، فرکانس‌ها، عادت‌های پیش‌فرض
- `src/lib/dateUtils.ts` — توابع کمکی تاریخ (هفته، ماه، امروز)
- `src/lib/streakCalc.ts` — محاسبه streak جنگ خارجی

### Hooks:
- `src/hooks/useHabits.ts` — مدیریت عادت‌ها و لاگ‌ها
- `src/hooks/useGoals.ts` — مدیریت اهداف و پیشرفت‌ها

### Components - Habits:
- `src/components/habits/FrequencyTabs.tsx` — تب‌های فرکانس
- `src/components/habits/SuccessGauge.tsx` — gauge دایره‌ای درصد
- `src/components/habits/HabitRow.tsx` — ردیف عادت با چک‌باکس
- `src/components/habits/HabitComposer.tsx` — مودال ساخت/ویرایش عادت
- `src/components/habits/HabitList.tsx` — لیست عادت‌ها

### Components - Goals:
- `src/components/goals/ProgressRing.tsx` — حلقه پیشرفت
- `src/components/goals/GoalCard.tsx` — کارت هدف
- `src/components/goals/GoalComposer.tsx` — مودال ساخت/ویرایش هدف
- `src/components/goals/GoalProgressModal.tsx` — مودال ثبت پیشرفت

### Routes:
- `src/routes/TodoPage.tsx` (بازنویسی) — صفحه ماموریت‌ها
- `src/routes/GoalsPage.tsx` (بازنویسی) — صفحه اهداف
- `src/routes/Dashboard.tsx` (ویرایش) — افزودن StatCard درصد موفقیت + بج streak

## نکات مهم

### اگر toggle کار نکرد:
در Network tab بررسی کن RPC `toggle_habit` خطا نده.

### اگر gauge همیشه ۰ موند:
بررسی کن `log_date` با today match می‌شه (timezone).

### اگر successRate هفتگی/ماهانه اشتباهه:
`dateUtils` رو بررسی کن (شنبه شروع هفته در ایران).

### اعداد فارسی:
همه اعداد با `formatPersianNumber` نمایش داده می‌شوند.

### RTL:
فیلدهای اعداد و date `dir="ltr"` هستند.

## معیارهای پذیرش

✅ سه تب روزانه/هفتگی/ماهانه
✅ SuccessGauge دایره‌ای با درصد موفقیت
✅ دکمه‌ی «+ عادت جدید» با HabitComposer
✅ عادت‌های پیش‌فرض با seed_default_habits
✅ چک‌باکس با انیمیشن Motion
✅ منوی سه‌نقطه برای ویرایش/حذف
✅ لیست اهداف با ProgressRing
✅ GoalComposer برای ساخت هدف
✅ GoalProgressModal برای ثبت پیشرفت
✅ تاریخچه‌ی ۳ پیشرفت آخر در هر کارت
✅ StatCard «موفقیت امروز» در داشبورد
✅ بج streak جنگ خارجی در داشبورد
✅ همه اعداد فارسی
✅ انیمیشن‌ها با Motion
✅ موبایل‌فرندلی
✅ `npm run build` بدون خطا

## مرحله بعد: فاز ۶ یا ۷

فاز ۵ کامل شد! حالا سیستم عادت‌ها و هدف‌گذاری آماده است.

**فاز ۶ (اختیاری):** بهبود مکانیک جنگ
- SOS واقعی (ارتباط با همرزمان)
- مینی‌گیم‌های نبرد
- آتش‌بس موقت

**فاز ۷:** جهان مشترک + نامه‌ها
- نقشه‌ی جهانی با سایر فرماندهان
- سیستم نامه‌نگاری
- تالار ژنرال‌ها
