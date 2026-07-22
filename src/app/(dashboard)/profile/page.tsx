"use client";

import { useEffect, useState } from "react";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  phone: string | null;
  bio: string | null;
  createdAt: string;
}

const roleLabels: Record<string, string> = {
  admin: "مدیر سیستم",
  manager: "مدیر پروژه",
  developer: "برنامه‌نویس",
  client: "کارفرما",
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", bio: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setForm({
            name: data.user.name,
            phone: data.user.phone || "",
            bio: data.user.bio || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fadeIn max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">پروفایل</h1>
        <p className="text-gray-500 mt-1">اطلاعات حساب کاربری شما</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        
        <div className="px-8 pb-8">
          {/* Avatar */}
          <div className="-mt-16 mb-6">
            <div className="w-28 h-28 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white font-bold text-4xl border-4 border-white shadow-lg">
              {user.name.charAt(0)}
            </div>
          </div>

          {message && (
            <div className="mb-4 px-4 py-3 bg-green-50 text-green-700 rounded-xl text-sm">
              {message}
            </div>
          )}

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نام
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تلفن
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="شماره تلفن"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  بیوگرافی
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="درباره خودتان بنویسید"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setEditing(false);
                    setMessage("تغییرات با موفقیت ذخیره شد (نمونه)");
                    setTimeout(() => setMessage(""), 3000);
                  }}
                  disabled={saving}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  ذخیره تغییرات
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setForm({ name: user.name, phone: user.phone || "", bio: user.bio || "" });
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  انصراف
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <span className="inline-block mt-2 px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {roleLabels[user.role]}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">ایمیل</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">تلفن</p>
                  <p className="font-medium text-gray-900">{user.phone || "ثبت نشده"}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">تاریخ عضویت</p>
                  <p className="font-medium text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">شناسه</p>
                  <p className="font-medium text-gray-900">#{user.id}</p>
                </div>
              </div>

              {user.bio && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">بیوگرافی</p>
                  <p className="text-gray-700">{user.bio}</p>
                </div>
              )}

              <button
                onClick={() => setEditing(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                ویرایش پروفایل
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
