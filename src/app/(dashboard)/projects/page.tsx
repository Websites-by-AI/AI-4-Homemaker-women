"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Project {
  id: number;
  title: string;
  description: string | null;
  budget: string | null;
  status: string;
  deadline: string | null;
  createdAt: string;
  ownerName: string;
  memberCount: number;
  taskTotal: number;
  taskCompleted: number;
}

const statusLabels: Record<string, string> = {
  pending: "در انتظار",
  in_progress: "در حال انجام",
  review: "بررسی",
  completed: "تکمیل شده",
  cancelled: "لغو شده",
};

const statusOptions = ["pending", "in_progress", "review", "completed", "cancelled"];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowModal(false);
        setForm({ title: "", description: "", budget: "", deadline: "" });
        fetchProjects();
      }
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setSubmitting(false);
    }
  }

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
          <h1 className="text-2xl font-bold text-gray-900">پروژه‌ها</h1>
          <p className="text-gray-500 mt-1">مدیریت تمام پروژه‌های تیم</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          پروژه جدید
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-900">هنوز پروژه‌ای ندارید</h3>
          <p className="text-gray-500 mt-2">اولین پروژه خود را ایجاد کنید</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                <span className={`badge-${project.status} text-xs px-3 py-1 rounded-full font-medium`}>
                  {statusLabels[project.status]}
                </span>
              </div>
              {project.description && (
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                  {project.description}
                </p>
              )}
              <div className="space-y-3">
                {/* Progress bar */}
                {project.taskTotal > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>پیشرفت</span>
                      <span>
                        {project.taskCompleted}/{project.taskTotal} وظیفه
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${project.taskTotal > 0 ? (project.taskCompleted / project.taskTotal) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>👤 {project.ownerName}</span>
                  <span>👥 {project.memberCount} نفر</span>
                </div>
                {project.budget && (
                  <p className="text-sm font-medium text-emerald-600">
                    💰 {Number(project.budget).toLocaleString("fa-IR")} تومان
                  </p>
                )}
                {project.deadline && (
                  <p className="text-xs text-gray-400">
                    مهلت: {new Date(project.deadline).toLocaleDateString("fa-IR")}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg mx-4 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-900 mb-6">ایجاد پروژه جدید</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان پروژه *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="عنوان پروژه را وارد کنید"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  توضیحات
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="توضیحات پروژه"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    بودجه (تومان)
                  </label>
                  <input
                    type="number"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    مهلت
                  </label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? "در حال ایجاد..." : "ایجاد پروژه"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
