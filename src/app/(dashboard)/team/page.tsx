"use client";

import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  phone: string | null;
  bio: string | null;
  isActive: boolean;
  createdAt: string;
}

const roleLabels: Record<string, string> = {
  admin: "مدیر سیستم",
  manager: "مدیر پروژه",
  developer: "برنامه‌نویس",
  client: "کارفرما",
};

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-700",
  manager: "bg-purple-100 text-purple-700",
  developer: "bg-blue-100 text-blue-700",
  client: "bg-green-100 text-green-700",
};

const avatarColors = [
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-purple-400 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-red-500",
  "from-cyan-400 to-blue-500",
];

export default function TeamPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = filter === "all" ? users : users.filter((u) => u.role === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">اعضای تیم</h1>
        <p className="text-gray-500 mt-1">مشاهده تمام اعضای تیم ({users.length} نفر)</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "admin", "manager", "developer", "client"].map((role) => (
          <button
            key={role}
            onClick={() => setFilter(role)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === role
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {role === "all" ? "همه" : roleLabels[role]}
          </button>
        ))}
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user, index) => (
          <div
            key={user.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-14 h-14 bg-gradient-to-br ${avatarColors[index % avatarColors.length]} rounded-full flex items-center justify-center text-white font-bold text-xl`}
              >
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${roleColors[user.role]}`}>
                {roleLabels[user.role]}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  user.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                {user.isActive ? "فعال" : "غیرفعال"}
              </span>
            </div>
            {user.bio && (
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{user.bio}</p>
            )}
            {user.phone && (
              <p className="text-xs text-gray-400">📞 {user.phone}</p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              عضویت: {new Date(user.createdAt).toLocaleDateString("fa-IR")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
