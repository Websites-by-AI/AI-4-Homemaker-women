"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";

interface Project {
  id: number;
  title: string;
  description: string | null;
  budget: string | null;
  status: string;
  deadline: string | null;
  createdAt: string;
  ownerId: number;
  ownerName: string;
  ownerEmail: string;
}

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  userRole: string;
}

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  assignedTo: number | null;
  assigneeName: string | null;
}

const statusLabels: Record<string, string> = {
  pending: "در انتظار",
  in_progress: "در حال انجام",
  review: "بررسی",
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

const projectStatuses = ["pending", "in_progress", "review", "completed", "cancelled"];
const taskStatuses = ["todo", "in_progress", "review", "done"];
const taskPriorities = ["low", "medium", "high", "urgent"];

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium",
    dueDate: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  async function fetchProject() {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data.project);
        setMembers(data.members);
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error("Failed to fetch project:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setProject((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...taskForm,
          projectId: parseInt(id),
          assignedTo: taskForm.assignedTo ? parseInt(taskForm.assignedTo) : null,
        }),
      });
      if (res.ok) {
        setShowTaskModal(false);
        setTaskForm({ title: "", description: "", assignedTo: "", priority: "medium", dueDate: "" });
        fetchProject();
      }
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleTaskStatusChange(taskId: number, newStatus: string) {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">پروژه یافت نشد</h2>
        <Link href="/projects" className="text-blue-600 mt-4 inline-block">
          بازگشت به پروژه‌ها
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/projects"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          →
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
          <p className="text-gray-500 mt-1">مالک: {project.ownerName}</p>
        </div>
        <select
          value={project.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className={`badge-${project.status} px-4 py-2 rounded-xl font-medium border-0 outline-none cursor-pointer`}
        >
          {projectStatuses.map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </select>
      </div>

      {/* Project Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">بودجه</h3>
          <p className="text-xl font-bold text-gray-900">
            {project.budget
              ? `${Number(project.budget).toLocaleString("fa-IR")} تومان`
              : "تعیین نشده"}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">مهلت</h3>
          <p className="text-xl font-bold text-gray-900">
            {project.deadline
              ? new Date(project.deadline).toLocaleDateString("fa-IR")
              : "بدون مهلت"}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">تاریخ ایجاد</h3>
          <p className="text-xl font-bold text-gray-900">
            {new Date(project.createdAt).toLocaleDateString("fa-IR")}
          </p>
        </div>
      </div>

      {project.description && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">توضیحات</h3>
          <p className="text-gray-700">{project.description}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">وظایف</h2>
            <button
              onClick={() => setShowTaskModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              + وظیفه جدید
            </button>
          </div>
          <div className="p-4">
            {tasks.length === 0 ? (
              <p className="text-center text-gray-400 py-8">وظیفه‌ای ثبت نشده</p>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        {task.assigneeName && (
                          <span className="text-xs text-gray-500">
                            👤 {task.assigneeName}
                          </span>
                        )}
                        <span className={`priority-${task.priority} text-xs px-2 py-0.5 rounded-full`}>
                          {priorityLabels[task.priority]}
                        </span>
                      </div>
                    </div>
                    <select
                      value={task.status}
                      onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                      className={`badge-${task.status} text-xs px-3 py-1.5 rounded-full font-medium border-0 outline-none cursor-pointer`}
                    >
                      {taskStatuses.map((s) => (
                        <option key={s} value={s}>
                          {statusLabels[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Members */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">اعضای تیم</h2>
          </div>
          <div className="p-4">
            {members.length === 0 ? (
              <p className="text-center text-gray-400 py-8">عضوی وجود ندارد</p>
            ) : (
              <div className="space-y-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {member.role === "owner" ? "مالک" : "عضو"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg mx-4 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-900 mb-6">ایجاد وظیفه جدید</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان وظیفه *
                </label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="عنوان وظیفه"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  توضیحات
                </label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اولویت
                  </label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    {taskPriorities.map((p) => (
                      <option key={p} value={p}>
                        {priorityLabels[p]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    مسئول
                  </label>
                  <select
                    value={taskForm.assignedTo}
                    onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">انتخاب کنید</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  مهلت
                </label>
                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? "در حال ایجاد..." : "ایجاد وظیفه"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
