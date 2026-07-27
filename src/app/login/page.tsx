"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const demoAccounts = [
  { label: "ورود مدیر", email: "admin@digiamoozesh.demo", password: "123456", desc: "دیدن پنل ادمین نمایشی" },
  { label: "ورود هنرجو", email: "user@digiamoozesh.demo", password: "123456", desc: "دیدن پنل کاربر نمایشی" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "خطا در ورود");
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
            🎓
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ورود به دیجی‌آموزش</h1>
          <p className="text-gray-500 mt-2">پنل هنرجو، ادمین و مربی هوشمند در یک جا</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900 leading-7">
            <b>حالت دمو آماده است 👀</b>
            <div className="mt-2 grid gap-3 md:grid-cols-2">
              {demoAccounts.map((item) => (
                <button
                  key={item.email}
                  type="button"
                  onClick={() => { setEmail(item.email); setPassword(item.password); }}
                  className="rounded-xl border border-amber-300 bg-white px-4 py-3 text-right hover:bg-amber-100 transition-colors"
                >
                  <div className="font-bold text-amber-950">{item.label}</div>
                  <div className="text-xs mt-1 text-amber-800">{item.desc}</div>
                  <div className="text-xs mt-2 font-mono" dir="ltr">{item.email}</div>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-amber-800">رمز هر دو حساب نمایشی: <span className="font-mono">123456</span></p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="رمز عبور خود را وارد کنید"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/25"
            >
              {loading ? "در حال ورود..." : "ورود"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            حساب کاربری نداری؟{" "}
            <Link href="/register" className="text-blue-600 font-medium hover:text-blue-700">
              ثبت‌نام رایگان
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
