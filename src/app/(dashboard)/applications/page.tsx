"use client";

import { useEffect, useState } from "react";

interface Application {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  age: number | null;
  city: string | null;
  instagramHandle: string | null;
  hasActivePage: boolean;
  hasReelsExperience: boolean;
  canWorkWithFriends: boolean;
  portfolioLinks: string | null;
  sampleVideoUrls: string | null;
  motivationText: string | null;
  skillsDescription: string | null;
  status: string;
  reviewNotes: string | null;
  trainingAssignedAt: string | null;
  trainingDeadline: string | null;
  trainingCompletedAt: string | null;
  testProjectAssignedAt: string | null;
  testProjectDeadline: string | null;
  testProjectSubmittedAt: string | null;
  totalModules: number;
  completedModules: number;
  createdAt: string;
}

const statusLabels: Record<string, string> = {
  submitted: "فرم ثبت شده",
  portfolio_review: "بررسی نمونه‌کار",
  training: "آموزش",
  test_project: "پروژه آزمایشی",
  approved: "تایید شده ✅",
  rejected: "رد شده ❌",
};

const statusColors: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-700",
  portfolio_review: "bg-amber-100 text-amber-700",
  training: "bg-purple-100 text-purple-700",
  test_project: "bg-cyan-100 text-cyan-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const nextStatusMap: Record<string, { value: string; label: string }[]> = {
  submitted: [
    { value: "portfolio_review", label: "بررسی نمونه‌کار" },
    { value: "rejected", label: "رد درخواست" },
  ],
  portfolio_review: [
    { value: "training", label: "ارسال آموزش" },
    { value: "rejected", label: "رد درخواست" },
  ],
  training: [
    { value: "test_project", label: "ارسال پروژه آزمایشی" },
    { value: "rejected", label: "رد درخواست" },
  ],
  test_project: [
    { value: "approved", label: "تایید نهایی ✅" },
    { value: "rejected", label: "رد درخواست" },
  ],
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [filter, setFilter] = useState("all");
  const [reviewNotes, setReviewNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      const res = await fetch("/api/applications");
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications);
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(appId: number, newStatus: string) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, reviewNotes }),
      });
      if (res.ok) {
        await fetchApplications();
        setShowDetail(false);
        setSelectedApp(null);
        setReviewNotes("");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(false);
    }
  }

  const filteredApps =
    filter === "all"
      ? applications
      : applications.filter((a) => a.status === filter);

  const statusCounts = applications.reduce(
    (acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">درخواست‌های همکاری</h1>
        <p className="text-gray-500 mt-1">
          مدیریت و بررسی درخواست‌های همکاری تولید محتوا ({applications.length} درخواست)
        </p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => setFilter("all")}
          className={`p-3 rounded-xl text-center transition-all ${
            filter === "all"
              ? "bg-violet-600 text-white shadow-lg"
              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <p className="text-2xl font-bold">{applications.length}</p>
          <p className="text-xs mt-1">همه</p>
        </button>
        {Object.entries(statusLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`p-3 rounded-xl text-center transition-all ${
              filter === key
                ? "bg-violet-600 text-white shadow-lg"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <p className="text-2xl font-bold">{statusCounts[key] || 0}</p>
            <p className="text-xs mt-1">{label}</p>
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900">درخواستی یافت نشد</h3>
          <p className="text-gray-500 mt-2">
            {filter === "all"
              ? "هنوز درخواست همکاری ثبت نشده است"
              : `درخواستی با وضعیت "${statusLabels[filter]}" وجود ندارد`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedApp(app);
                setShowDetail(true);
                setReviewNotes(app.reviewNotes || "");
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {app.fullName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{app.fullName}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span>{app.email}</span>
                      <span>📞 {app.phone}</span>
                      {app.city && <span>📍 {app.city}</span>}
                      {app.age && <span>🎂 {app.age} سال</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Training progress */}
                  {app.status === "training" && app.totalModules > 0 && (
                    <div className="text-center">
                      <p className="text-xs text-gray-500">آموزش</p>
                      <p className="text-sm font-bold text-purple-600">
                        {app.completedModules}/{app.totalModules}
                      </p>
                    </div>
                  )}
                  <span
                    className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                      statusColors[app.status]
                    }`}
                  >
                    {statusLabels[app.status]}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(app.createdAt).toLocaleDateString("fa-IR")}
                  </span>
                </div>
              </div>
              {/* Quick tags */}
              <div className="flex gap-2 mt-3 mr-16">
                {app.hasActivePage && (
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                    پیج فعال
                  </span>
                )}
                {app.hasReelsExperience && (
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                    تجربه ریلز
                  </span>
                )}
                {app.canWorkWithFriends && (
                  <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                    تولید با دوستان
                  </span>
                )}
                {app.instagramHandle && (
                  <span className="text-xs bg-pink-50 text-pink-700 px-2 py-0.5 rounded-full" dir="ltr">
                    {app.instagramHandle}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {selectedApp.fullName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedApp.fullName}
                  </h2>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      statusColors[selectedApp.status]
                    }`}
                  >
                    {statusLabels[selectedApp.status]}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDetail(false);
                  setSelectedApp(null);
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <InfoCard label="ایمیل" value={selectedApp.email} />
                <InfoCard label="تلفن" value={selectedApp.phone} />
                <InfoCard label="سن" value={selectedApp.age ? `${selectedApp.age} سال` : "—"} />
                <InfoCard label="شهر" value={selectedApp.city || "—"} />
                <InfoCard
                  label="اینستاگرام"
                  value={selectedApp.instagramHandle || "—"}
                />
                <InfoCard
                  label="تاریخ درخواست"
                  value={new Date(selectedApp.createdAt).toLocaleDateString("fa-IR")}
                />
              </div>

              {/* Skills & Flags */}
              <div className="flex flex-wrap gap-2">
                <Tag
                  active={selectedApp.hasActivePage}
                  label="پیج فعال اینستاگرام"
                />
                <Tag
                  active={selectedApp.hasReelsExperience}
                  label="تجربه ساخت ریلز"
                />
                <Tag
                  active={selectedApp.canWorkWithFriends}
                  label="تولید محتوا با دوستان"
                />
              </div>

              {/* Portfolio Links */}
              {selectedApp.portfolioLinks && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">نمونه‌کارها</h4>
                  <div className="space-y-2">
                    {JSON.parse(selectedApp.portfolioLinks).map(
                      (link: string, i: number) => (
                        <a
                          key={i}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-blue-600 hover:text-blue-700 underline truncate"
                          dir="ltr"
                        >
                          {link}
                        </a>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Motivation */}
              {selectedApp.motivationText && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    انگیزه همکاری
                  </h4>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4">
                    {selectedApp.motivationText}
                  </p>
                </div>
              )}

              {/* Skills */}
              {selectedApp.skillsDescription && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">مهارت‌ها</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4">
                    {selectedApp.skillsDescription}
                  </p>
                </div>
              )}

              {/* Training Progress */}
              {selectedApp.status === "training" &&
                selectedApp.totalModules > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      پیشرفت آموزش
                    </h4>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          {selectedApp.completedModules} از {selectedApp.totalModules} ماژول
                        </span>
                        <span className="text-sm font-bold text-purple-600">
                          {selectedApp.totalModules > 0
                            ? Math.round(
                                (selectedApp.completedModules /
                                  selectedApp.totalModules) *
                                  100
                              )
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-purple-600 h-3 rounded-full transition-all"
                          style={{
                            width: `${
                              selectedApp.totalModules > 0
                                ? (selectedApp.completedModules /
                                    selectedApp.totalModules) *
                                  100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                      {selectedApp.trainingDeadline && (
                        <p className="text-xs text-gray-500 mt-2">
                          مهلت:{" "}
                          {new Date(selectedApp.trainingDeadline).toLocaleString(
                            "fa-IR"
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                )}

              {/* Review Notes */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">یادداشت بررسی</h4>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none resize-none text-sm"
                  placeholder="نظر خود را بنویسید..."
                />
              </div>

              {/* Actions */}
              {nextStatusMap[selectedApp.status] && (
                <div className="border-t border-gray-100 pt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">تغییر وضعیت</h4>
                  <div className="flex flex-wrap gap-3">
                    {nextStatusMap[selectedApp.status].map((action) => (
                      <button
                        key={action.value}
                        onClick={() =>
                          handleStatusChange(selectedApp.id, action.value)
                        }
                        disabled={updating}
                        className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-50 ${
                          action.value === "rejected"
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : action.value === "approved"
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-violet-600 text-white hover:bg-violet-700"
                        }`}
                      >
                        {updating ? "⏳ ..." : action.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
    </div>
  );
}

function Tag({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={`text-xs px-3 py-1 rounded-full font-medium ${
        active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
      }`}
    >
      {active ? "✓" : "✕"} {label}
    </span>
  );
}
