"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  totalUsers: number;
  totalPayments: string;
  unreadMessages: number;
}

interface RecentProject {
  id: number;
  title: string;
  status: string;
  deadline: string | null;
}

interface MyTask {
  id: number;
  title: string;
  status: string;
  priority: string;
  projectTitle: string;
}

const statusLabels: Record<string, string> = {
  pending: "در انتظار",
  in_progress: "در حال انجام",
  review: "در حال بررسی",
  completed: "تکمیل شده",
  cancelled: "لغو شده",
  todo: "انجام نشده",
  done: "انجام شده",
};

const priorityLabels: Record<string, string> = {
  low: "کم",
  medium: "متوسط",
  high: "زیاد",
  urgent: "فوری",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [myTasks, setMyTasks] = useState<MyTask[]>([]);
  const [demoMode, setDemoMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setRecentProjects(data.recentProjects);
          setMyTasks(data.myTasks);
          setDemoMode(Boolean(data.demo));
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">داشبورد دیجی‌آموزش</h1>
        <p className="text-gray-500 mt-1">خلاصه‌ای از مسیرهای آموزشی، کارهای شما و وضعیت پلتفرم</p>
      </div>

      {demoMode && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
          <div className="font-bold mb-1">حالت نمایشی فعال است ✨</div>
          <p className="text-sm leading-7">
            الان بدون دیتابیس واقعی می‌توانی پنل ادمین/کاربر، ورود، ثبت‌نام و دموی داشبورد را ببینی.
            وقتی <span className="font-mono">DATABASE_URL</span> واقعی را در Vercel بگذاری، داده‌ها دائمی و کامل می‌شوند.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="مسیرهای آموزشی"
          value={stats?.totalProjects || 0}
          icon="🎯"
          color="blue"
          subtitle={`${stats?.activeProjects || 0} فعال`}
        />
        <StatsCard
          title="کارهای من"
          value={stats?.totalTasks || 0}
          icon="✅"
          color="green"
          subtitle={`${stats?.completedTasks || 0} انجام شده`}
        />
        <StatsCard
          title="اعضای پلتفرم"
          value={stats?.totalUsers || 0}
          icon="👥"
          color="purple"
          subtitle="کاربر ثبت‌شده"
        />
        <StatsCard
          title="درآمد نمونه"
          value={`${Number(stats?.totalPayments || 0).toLocaleString("fa-IR")}`}
          icon="💰"
          color="amber"
          subtitle="تومان"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">مسیرها و دوره‌های پیشنهادی</h2>
            <Link
              href="/assistant"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              مربی هوشمند ←
            </Link>
          </div>
          <div className="p-4">
            {recentProjects.length === 0 ? (
              <p className="text-center text-gray-400 py-8">فعلاً مسیری ثبت نشده است</p>
            ) : (
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">{project.title}</h3>
                      {project.deadline && (
                        <p className="text-xs text-gray-500 mt-1">
                          زمان پیشنهادی: {new Date(project.deadline).toLocaleDateString("fa-IR")}
                        </p>
                      )}
                    </div>
                    <span
                      className={`badge-${project.status} text-xs px-3 py-1 rounded-full font-medium`}
                    >
                      {statusLabels[project.status] || project.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">کارهای این هفته</h2>
            <Link
              href="/training"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              آموزش‌ها ←
            </Link>
          </div>
          <div className="p-4">
            {myTasks.length === 0 ? (
              <p className="text-center text-gray-400 py-8">فعلاً کاری برای شما ثبت نشده</p>
            ) : (
              <div className="space-y-3">
                {myTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{task.projectTitle}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`priority-${task.priority} text-xs px-2 py-1 rounded-full`}
                      >
                        {priorityLabels[task.priority]}
                      </span>
                      <span
                        className={`badge-${task.status} text-xs px-3 py-1 rounded-full font-medium`}
                      >
                        {statusLabels[task.status]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
  color,
  subtitle,
}: {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  subtitle: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: "from-blue-500 to-blue-600",
    green: "from-emerald-500 to-emerald-600",
    purple: "from-purple-500 to-purple-600",
    amber: "from-amber-500 to-amber-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center text-2xl shadow-lg`}
        >
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
      <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
    </div>
  );
}
