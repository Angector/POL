# 🏰 قلعه‌ی ذهن — The Mind Citadel

**بازی استراتژیک وب برای ترک عادت**

قلعه‌ی ذهن یک وب‌اپلیکیشن تعاملی است که با استفاده از مکانیک‌های بازی، انگیزه و ساختار، به کاربران کمک می‌کند عادت‌های ناسالم خود را ترک کنند. با مپ سه‌بعدی ایزومتریک، سیستم جنگ داخلی/خارجی، شورای مشاوران AI، و جامعه‌ی فرماندهان، این پروژه تجربه‌ای منحصر به فرد از توسعه فردی ارائه می‌دهد.

![قلعه‌ی ذهن](https://img.shields.io/badge/phase-10/10-green) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Supabase](https://img.shields.io/badge/Supabase-✓-green)

## ✨ ویژگی‌ها

- 🗺️ **مپ سه‌بعدی ایزومتریک** با ۱۸۰ شهر قابل فتح
- ⚔️ **سیستم جنگ داخلی/خارجی** با عادت‌ها و اهداف
- 🤖 **شورای مشاوران AI** با ۴ شخصیت متمایز
- 🔮 **اوراکل** برای پیش‌بینی الگوهای حمله
- 🪞 **آینه‌ی جنگ** برای تحلیل بدون شرم
- 🎖️ **سیستم ژنرال‌ها** برای آرشیو تجربه
- 🏺 **یادگاری‌ها** برای دستاوردها
- 🌳 **درخت مهارت** با ۴ شاخه و ۲۰ گره
- 📨 **سیستم نامه و اتحاد** برای ارتباط با همرزمان
- 🆘 **SOS واقعی** با مینی‌گیم تنفس
- 📱 **PWA** قابل نصب و آفلاین
- 🎨 **طراحی RTL** کاملاً فارسی

## 🎯 نقشه‌ی فازها

- [x] **فاز ۰:** زیرساخت پروژه
- [x] **فاز ۱:** احراز هویت + سوگند فرمانده
- [x] **فاز ۲:** App Shell + داشبورد + پروفایل
- [x] **فاز ۳:** مپ سه‌بعدی ایزومتریک (Hex Map MVP)
- [x] **فاز ۴:** تایمر پایداری + فتح شهر + سقوط کاخ
- [x] **فاز ۵:** To-Do + هدف‌گذاری (جنگ خارجی)
- [x] **فاز ۶:** جهان مشترک + نامه‌ها + اتحاد + Realtime + SOS
- [x] **فاز ۷:** تکمیل مکانیک نبرد (مینی‌گیم SOS + آتش‌بس + باف برخاستن)
- [x] **فاز ۸:** ژنرال‌ها + یادگاری‌ها + درخت مهارت
- [x] **فاز ۹:** شورای مشاوران + اوراکل + آینه‌ی جنگ (AI)
- [x] **فاز ۱۰:** صداهای واقعی + PWA + پالایش نهایی + انتشار

## 🛠️ استک فنی

### Frontend
- **React 18** + **TypeScript 5**
- **Vite 5** برای build
- **Tailwind CSS 4** برای استایل
- **React Router 6** برای مسیریابی
- **Motion** برای انیمیشن‌ها
- **React Three Fiber** + **Drei** برای مپ سه‌بعدی
- **Three.js** برای رندر سه‌بعدی

### Backend
- **Supabase** برای دیتابیس و احراز هویت
- **PostgreSQL** با RLS (Row Level Security)
- **Edge Functions** برای منطق سرور
- **Realtime** برای اعلان‌های زنده

### AI
- **OpenAI GPT-4o-mini** یا **Anthropic Claude** برای مشاوران
- **System prompts** متمایز برای هر مشاور

### DevOps
- **GitHub Actions** برای CI/CD
- **GitHub Pages** برای میزبانی
- **PWA** با Service Worker

## 📦 نصب و راه‌اندازی

### پیش‌نیازها

- Node.js 20+
- npm یا yarn
- حساب Supabase
- (اختیاری) کلید API OpenAI یا Anthropic

### مراحل نصب

#### ۱. کلون کردن پروژه

```bash
git clone https://github.com/yourusername/mind-citadel.git
cd mind-citadel
```

#### ۲. نصب وابستگی‌ها

```bash
npm install
```

#### ۳. ساخت پروژه Supabase

1. به [supabase.com](https://supabase.com) بروید و یک پروژه جدید بسازید
2. از Settings → API، مقادیر زیر را کپی کنید:
   - `Project URL`
   - `anon public key`

#### ۴. تنظیم متغیرهای محیطی

فایل `.env.example` را به `.env.local` کپی کنید:

```bash
cp .env.example .env.local
```

مقادیر را پر کنید:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### ۵. اجرای schema های دیتابیس

در Supabase SQL Editor، فایل‌های زیر را **به ترتیب** اجرا کنید:

```bash
supabase/schema_phase1.sql
supabase/schema_phase2.sql
supabase/schema_phase3.sql
supabase/schema_phase4.sql
supabase/schema_phase5.sql
supabase/schema_phase6.sql
supabase/schema_phase7.sql
supabase/schema_phase8.sql
supabase/schema_phase9.sql
supabase/seed_cities.sql
scripts/seed-invite-codes.sql
```

#### ۶. تأیید نصب

اسکریپت verify-install.sql را اجرا کنید:

```bash
# در Supabase SQL Editor
scripts/verify-install.sql
```

#### ۷. دیپلوی Edge Functions

```bash
# نصب Supabase CLI
npm install -g supabase

# لاگین
supabase login

# لینک به پروژه
supabase link --project-ref your-project-ref

# دیپلوی Edge Functions
supabase functions deploy council-advisor
supabase functions deploy oracle-analyze
supabase functions deploy sos-broadcast
supabase functions deploy dispatch-general
supabase functions deploy daily-cron
```

#### ۸. تنظیم Secrets

```bash
# برای AI (اختیاری)
supabase secrets set AI_PROVIDER=openai
supabase secrets set OPENAI_API_KEY=sk-...
supabase secrets set AI_MODEL=gpt-4o-mini

# یا برای Anthropic
supabase secrets set AI_PROVIDER=anthropic
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

#### ۹. غیرفعال کردن تأیید ایمیل

در Supabase Dashboard:
1. Authentication → Providers → Email
2. "Confirm email" را غیرفعال کنید (برای توسعه)

#### ۱۰. اجرای پروژه

```bash
npm run dev
```

مرورگر را باز کنید: `http://localhost:5173/mind-citadel/`

## 🚀 دیپلوی روی GitHub Pages

### ۱. ساخت repository در GitHub

```bash
git init
git add .
git commit -m "Initial commit: Mind Citadel Phase 10"
git branch -M main
git remote add origin https://github.com/yourusername/mind-citadel.git
git push -u origin main
```

### ۲. تنظیم GitHub Secrets

در repository GitHub:
1. Settings → Secrets and variables → Actions
2. Secrets زیر را اضافه کنید:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### ۳. فعال کردن GitHub Pages

1. Settings → Pages
2. Source: **GitHub Actions**
3. Workflow را انتخاب کنید

### ۴. Push به main

```bash
git push origin main
```

GitHub Actions به‌صورت خودکار build و deploy می‌کند.

### ۵. دسترسی به سایت

سایت شما در آدرس زیر در دسترس خواهد بود:
```
https://yourusername.github.io/mind-citadel/
```

## 🎮 راهنمای استفاده

### ثبت‌نام اولیه

1. به صفحه ثبت‌نام بروید
2. یکی از کدهای دعوت تست را وارد کنید (مثلاً `123456`)
3. نام، ایمیل و رمز عبور را وارد کنید
4. سوگند فرمانده را امضا کنید

### شروع بازی

1. **داشبورد:** نمای کلی وضعیت شما
2. **سرزمین:** مپ سه‌بعدی با ۱۸۰ شهر
3. **ماموریت‌ها:** عادت‌های روزانه/هفتگی/ماهانه
4. **اهداف:** اهداف بلندمدت با پیشرفت

### مکانیک‌های اصلی

- **فتح شهر:** هر ۲۴ ساعت یک شهر آزاد کنید
- **جنگ داخلی:** عادت‌های درونی (مثل مدیتیشن)
- **جنگ خارجی:** عادت‌های بیرونی (مثل ورزش)
- **SOS:** در لحظات بحرانی از مینی‌گیم تنفس استفاده کنید
- **آتش‌بس:** در مواقع اضطراری (مسافرت، بیماری)

### مشاوران AI

به `/council` بروید و با یکی از ۴ مشاور چت کنید:
- **الصلب:** آرامش در بحران
- **المارشال:** استراتژی و عمل
- **المرآة:** تحلیل داده‌ها
- **الحکیم:** خرد و فلسفه

## 🔒 امنیت و Privacy

- **RLS:** تمام جداول با Row Level Security محافظت می‌شوند
- **حریم خصوصی:** داده‌های حساس (مثل private_note در urges) هرگز به AI ارسال نمی‌شوند
- **کلیدهای API:** هیچ کلید API در frontend وجود ندارد
- **احراز هویت:** Supabase Auth با JWT

## ⚠️ محدودیت‌ها و نکات

### فعلی

- **صداهای واقعی:** فایل‌های mp3 باید دستی اضافه شوند (fallback به oscillator)
- **آیکون‌های PNG:** باید از SVG تبدیل شوند
- **باف‌های مهارت:** برخی باف‌های گره ۳-۵ در فازهای آینده اعمال می‌شوند
- **هزینه AI:** استفاده از OpenAI/Anthropic هزینه دارد (حدود $1/ماه برای 10 کاربر)

### آینده (فاز ۱۱+)

- Streaming پاسخ AI
- اعلان‌های push واقعی (Web Push API)
- حالت تیره/روشن
- ترجمه به انگلیسی
- آمار پیشرفته‌تر
- بهبودهای بر اساس بازخورد کاربران

## 📊 آمار پروژه

- **۱۰ فاز** توسعه
- **۲۰۰+ فایل** کد
- **۱۸۰ شهر** روی مپ
- **۱۹ یادگاری** قابل کسب
- **۲۰ گره مهارت** در ۴ شاخه
- **۴ مشاور AI** با شخصیت‌های متمایز
- **۸ رتبه** از سرباز تا پادشاه

## 🤝 مشارکت

این پروژه در حال حاضر یک پروژه شخصی است، اما از پیشنهادات و بازخوردها استقبال می‌کنم:

1. Issue باز کنید
2. Pull request بفرستید
3. یا مستقیماً تماس بگیرید

## 📄 لایسنس

این پروژه تحت لایسنس **MIT** منتشر شده است.

## 🙏 تشکر

- **Supabase** برای پلتفرم عالی backend
- **OpenAI** و **Anthropic** برای API های AI
- **React Three Fiber** برای مپ سه‌بعدی
- **جامعه React** برای الهام و پشتیبانی

---

**ساخته شده با ❤️ برای فرماندهان قلعه‌ی ذهن**

🎖 **آفرین که تا اینجا خواندید. حالا وقت نبرد است!**
