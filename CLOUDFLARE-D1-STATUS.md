# وضعیت Cloudflare DNS و D1 برای دیجی‌آموزش

## نتیجهٔ بررسی

### 1) توکن Cloudflare
- توکن **معتبر و active** است.
- endpoint تأیید توکن کار می‌کند.

### 2) Zone
- zone پیدا شد: `vibelab.ir`
- zone id: `f8d34494a869b1b9314c639e22c57331`

### 3) دامنه در Vercel
- `home.vibelab.ir` داخل پروژه Vercel اضافه شده است.
- ولی هنوز DNS آن در Cloudflare تنظیم نشده، پس live نشده است.

### 4) مشکل فعلی DNS
- روی endpointهای `dns_records` با همین token خطای `Authentication error` گرفتیم.
- یعنی token برای verify خوب است، اما برای ساخت/ویرایش رکورد DNS فعلاً permission کافی ندارد.

### 5) وضعیت D1
- روی endpointهای D1 هم با همین token خطای `Authentication error` گرفتیم.
- بنابراین فعلاً **نه لیست D1 را می‌توان خواند، نه D1 جدید ساخت، نه migration انجام داد**.

## نکتهٔ مهم فنی
این پروژه الان روی **PostgreSQL + drizzle-orm/node-postgres** نوشته شده است:
- `src/db/index.ts` → `node-postgres`
- `src/db/schema.ts` → `pg-core`

یعنی حتی اگر D1 permission هم کامل شود، برای استفادهٔ کامل از D1 باید:
1. schema از `pg-core` به `sqlite-core`/D1-compatible تغییر کند
2. runtime query layer برای Vercel بازنویسی شود
3. routeهای auth/dashboard/messages/payments/training دوباره تست شوند

## پیشنهاد بهتر برای سریع‌ترین نتیجه
اگر هدفت این است که:
- ادمین واقعی
- ثبت‌نام واقعی کاربر
- لاگین واقعی
- ذخیرهٔ دائمی
- آپلود PDF و YouTube

همه همین الان کار کنند، **Neon Postgres** یا **Vercel Postgres** بهترین و سریع‌ترین انتخاب است.

## اگر اصرار داری روی D1
توکن جدید باید این permissionها را داشته باشد:
- Zone / DNS / Read
- Zone / DNS / Edit
- Zone / Zone / Read
- Account / D1 / Read
- Account / D1 / Edit

## رکورد پیشنهادی دامنه
برای بالا آمدن `home.vibelab.ir` در Cloudflare این رکورد لازم است:

```text
Type: CNAME
Name: home
Target: cname.vercel-dns.com
Proxy: DNS only
TTL: Auto
```
