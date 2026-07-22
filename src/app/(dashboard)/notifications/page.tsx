"use client";

import { useEffect, useState } from "react";

interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  createdAt: string;
}

const typeIcons: Record<string, string> = {
  info: "ℹ️",
  message: "💬",
  task: "📋",
  payment: "💰",
  project: "📁",
  warning: "⚠️",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }

  async function markAllAsRead() {
    try {
      const res = await fetch("/api/notifications", { method: "PUT" });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (error) {
      console.error("Failed to mark notifications:", error);
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">اعلان‌ها</h1>
          <p className="text-gray-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} اعلان خوانده نشده` : "همه اعلان‌ها خوانده شده"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            خواندن همه
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">🔔</div>
          <h3 className="text-lg font-medium text-gray-900">اعلانی وجود ندارد</h3>
          <p className="text-gray-500 mt-2">وقتی اتفاقی بیفتد، اینجا نشان داده می‌شود</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${
                notif.isRead
                  ? "border-gray-100 opacity-70"
                  : "border-blue-200 bg-blue-50/30"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-2xl">{typeIcons[notif.type] || "🔔"}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                    <span className="text-xs text-gray-400">
                      {new Date(notif.createdAt).toLocaleDateString("fa-IR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                </div>
                {!notif.isRead && (
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
