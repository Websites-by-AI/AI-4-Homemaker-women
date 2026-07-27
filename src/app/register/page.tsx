"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const roles = [
  { value: "client", label: "هنرجو", desc: "یادگیری، ثبت‌نام و استفاده از مربی هوشمند" },
  { value: "developer", label: "همکار محتوا", desc: "کمک در تولید محتوا و سناریو" },
  { value: "manager", label: "مدیر آموزشی", desc: "مدیریت آموزش‌ها و کتابخانه" },
];

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "خطا در ثبت‌نام");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg text-3xl">
            ✨
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ثبت‌نام در دیجی‌آموزش</h1>
          <p className="text-gray-500 mt-2">حساب کاربری‌ات را بساز و وارد پنل آموزشی شو</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="mb-6 rounded-2xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-900 leading-7">
            اگر دیتابیس واقعی هنوز وصل نشده باشد، ثبت‌نام فعلاً در <b>حالت نمایشی</b> انجام می‌شود تا بتوانی ظاهر پنل و تجربهٔ کاربر را ببینی 👌
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نام کامل
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="نام و نام خانوادگی"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ایمیل
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="email@example.com"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رمز عبور
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="حداقل ۶ کاراکتر"
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                نقش شما
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      role === r.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <p className="text-sm font-medium">{r.label}</p>
                    <p className="text-xs mt-1 opacity-70 leading-5">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/25"
            >
              {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            قبلاً ثبت‌نام کرده‌ای؟{" "}
            <Link href="/login" className="text-blue-600 font-medium hover:text-blue-700">
              وارد شو
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
