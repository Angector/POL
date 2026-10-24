# قلعه‌ی ذهن — The Mind Citadel

بازی استراتژیک نظامی وب برای ترک عادت.

## پیش‌نیازها

- Node.js 20+
- npm

## نصب محلی

```bash
npm install
cp .env.example .env.local
# مقادیر Supabase را در .env.local وارد کنید
npm run dev
```

## دیپلوی

1. ساخت پروژه در [Supabase](https://supabase.com)
2. گرفتن URL و Anon Key
3. اضافه کردن به GitHub Secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. فعال کردن GitHub Pages با Source = GitHub Actions
5. Push به شاخه‌ی `main`

## ساختار پوشه

```
├── .github/workflows/    # CI/CD
├── public/               # فایل‌های استاتیک
├── src/
│   ├── lib/              # کتابخانه‌ها (Supabase client)
│   ├── routes/           # صفحات
│   ├── App.tsx           # روتینگ اصلی
│   ├── main.tsx          # نقطه‌ی ورود
│   └── index.css         # استایل‌های سراسری
├── index.html
├── vite.config.ts
└── tsconfig.json
```

## نقشه‌ی فازها

- **فاز ۰** — زیرساخت پروژه (فعلی)
- **فاز ۱** — احراز هویت Supabase
- **فاز ۲** — مدل داده‌ی عادت‌ها
- **فاز ۳** — صفحه‌ی اصلی قلعه
- **فاز ۴** — سیستم نبرد با عادت
- **فاز ۵** — سه‌بعدی‌سازی قلعه (R3F)
- **فاز ۶** — سیستم پاداش و ارتقا
- **فاز ۷** — نقشه‌ی جهان بازی
- **فاز ۸** — سیستم اجتماعی
- **فاز ۹** — بهینه‌سازی و انیمیشن
- **فاز ۱۰** — انتشار نسخه‌ی نهایی
