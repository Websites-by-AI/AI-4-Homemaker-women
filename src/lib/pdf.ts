/**
 * pdf-parse بدون تست‌فایل داخلی — ایمپورت مستقیم از lib تا در باندل Next مشکل نسازد
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - بدون تایپ برای مسیر عمیق
import pdfParse from "pdf-parse/lib/pdf-parse.js";

export default pdfParse as (buffer: Buffer) => Promise<{ text: string; numpages: number }>;
