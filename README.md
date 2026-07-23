# 🎓 دیجی‌آموزش — اپلیکیشن کامل Next.js

**نسخهٔ ادغام‌شده:** سایت دیجی‌آموزش (لندینگ + وبلاگ ۱۸ مقاله + استودیوی ویدیو با ۱۵ سناریو)
+ اپلیکیشن کامل (ثبت‌نام/ورود با JWT، داشبورد، پروژه/وظیفه/پیام/پرداخت، آکادمی، API کامل و دیتابیس PostgreSQL)

## ✅ وضعیت تست‌شده با Node.js (روی این پروژه انجام شده)
- `npm run build` بدون خطا ✅ — هر ۱۸ مقالهٔ وبلاگ به‌صورت استاتیک (SSG) ساخته می‌شوند
- تمام صفحات با ۲۰۰ پاسخ می‌دهند ✅
- ثبت‌نام، ورود (bcrypt + jose)، توکن `/api/auth/me` ✅
- ساخت جداول با `drizzle-kit push` و سید داده با `POST /api/seed` ✅

## اجرای محلی
```bash
npm install
# PostgreSQL محلی داشته باش (یا embedded-postgres) و:
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/app_db" npx drizzle-kit push
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/app_db" npm run dev
# سپس: http://localhost:3000  و یک‌بار: curl -X POST http://localhost:3000/api/seed
```

## ☁️ دیپلوی (درست‌ترین هاست برای این اپ: Vercel نه Cloudflare Pages)
1. دیتابیس رایگان **PostgreSQL** بساز: https://neon.tech و رشتهٔ اتصال را بردار
2. در https://vercel.com → Add New Project → همین مخزن
3. Environment Variables:
   - `DATABASE_URL` = رشتهٔ اتصال Neon
   - `JWT_SECRET` = یک رمز تصادفی طولانی
4. Deploy — بعد از بالا آمدن، یک بار `/api/seed` را POST کن

## 🗂 ساختار بخش‌های جدید
```
src/app/page.tsx            ← لندینگ دیجی‌آموزش (جایگزین قالب قبلی)
src/app/blog/page.tsx       ← لیست وبلاگ با جست‌وجو
src/app/blog/[slug]/page.tsx← ۱۸ مقالهٔ کامل (SSG)
src/app/video/page.tsx      ← استودیوی ویدیو: آموزش + ۱۵ سناریو + پرامپت کپی‌شدنی
src/app/digi.css            ← استایل برند دیجی‌آموزش (Scope شده؛ داشبورد خراب نمی‌شود)
src/lib/digi-content.ts     ← همهٔ داده‌ها (حوزه‌ها، مقاله‌ها، سناریوها)
src/lib/hero-img.ts         ← تصویر هیرو (base64)
src/components/SiteChrome.tsx← هدر/فوتر مشترک
```
بقیهٔ اپ (auth، داشبورد، APIها، دیتابیس) دست‌نخورده باقی مانده است.
