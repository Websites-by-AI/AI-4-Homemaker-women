"use client";

import { useEffect, useState } from "react";

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  projectId: number;
  projectTitle: string;
  assignedTo: number | null;
  assigneeName: string | null;
  createdAt: string;
}

const statusLabels: Record<string, string> = {
  todo: "انجام نشده",
  in_progress: "در حال انجام",
  review: "بررسی",
  done: "انجام شده",
};

const priorityLabels: Record<string, string> = {
  low: "کم",
  medium: "متوسط",
  high: "زیاد",
  urgent: "فوری",
};

const taskStatuses = ["todo", "in_progress", "review", "done"];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  async function fetchTasks() {
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks();
  }, []);

  async function handleStatusChange(taskId: number, newStatus: string) {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
        );
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  }

  const filteredTasks = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

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
        <h1 className="text-2xl font-bold text-gray-900">وظایف</h1>
        <p className="text-gray-500 mt-1">مشاهده و مدیریت تمام وظایف</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          همه ({tasks.length})
        </button>
        {taskStatuses.map((status) => {
          const count = tasks.filter((t) => t.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {statusLabels[status]} ({count})
            </button>
          );
        })}
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-lg font-medium text-gray-900">وظیفه‌ای یافت نشد</h3>
          <p className="text-gray-500 mt-2">
            {filter === "all"
              ? "هنوز وظیفه‌ای ثبت نشده است"
              : `وظیفه‌ای با وضعیت "${statusLabels[filter]}" وجود ندارد`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    <span className={`priority-${task.priority} text-xs px-2 py-0.5 rounded-full`}>
                      {priorityLabels[task.priority]}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-500 mb-3">{task.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>📁 {task.projectTitle}</span>
                    {task.assigneeName && <span>👤 {task.assigneeName}</span>}
                    {task.dueDate && (
                      <span>📅 {new Date(task.dueDate).toLocaleDateString("fa-IR")}</span>
                    )}
                  </div>
                </div>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  className={`badge-${task.status} text-xs px-3 py-2 rounded-xl font-medium border-0 outline-none cursor-pointer`}
                >
                  {taskStatuses.map((s) => (
                    <option key={s} value={s}>
                      {statusLabels[s]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
