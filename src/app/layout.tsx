import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "دیجی‌آموزش | آکادمی دیجیتال کسب‌وکارهای خانگی با هوش مصنوعی",
  description:
    "برای هر کسب‌وکار خانگی یک مسیر آموزشی کامل: یادگیری مهارت، استفاده از هوش مصنوعی، ساخت برند، تولید محتوا و فروش آنلاین. دورهٔ ۱۰ قسمتی برای ۱۵ حوزه + وبلاگ و استودیوی ویدیو.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-gray-50 text-gray-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
