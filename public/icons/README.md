# آیکون‌های PWA

این پوشه برای آیکون‌های PWA است.

## فایل‌های مورد نیاز

- `icon.svg` — آیکون اصلی (SVG)
- `icon-192.png` — آیکون ۱۹۲x۱۹۲ (PNG)
- `icon-512.png` — آیکون ۵۱۲x۵۱۲ (PNG)
- `icon-maskable-512.png` — آیکون maskable ۵۱۲x۵۱۲ (PNG)

## وضعیت فعلی

فعلاً فقط `icon.svg` موجود است. برای PWA کامل، باید PNG ها را بسازید.

## تبدیل SVG به PNG

### روش ۱: ابزار آنلاین
- برو به https://cloudconvert.com/svg-to-png
- فایل `icon.svg` را آپلود کن
- سایز ۱۹۲x۱۹۲ و ۵۱۲x۵۱۲ را انتخاب کن
- دانلود کن و در این پوشه قرار بده

### روش ۲: ImageMagick (خط فرمان)
```bash
# نصب ImageMagick
# macOS: brew install imagemagick
# Ubuntu: sudo apt-get install imagemagick

# تبدیل
convert -background none -resize 192x192 icon.svg icon-192.png
convert -background none -resize 512x512 icon.svg icon-512.png
convert -background none -resize 512x512 icon.svg icon-maskable-512.png
```

### روش ۳: Inkscape
```bash
inkscape icon.svg --export-type=png --export-filename=icon-192.png --export-width=192
inkscape icon.svg --export-type=png --export-filename=icon-512.png --export-width=512
```

## نکته مهم

بدون فایل‌های PNG، PWA در برخی مرورگرها (مخصوصاً iOS) ممکن است درست کار نکند. اما برای MVP و تست، SVG کافی است.
