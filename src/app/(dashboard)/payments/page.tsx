"use client";

import { useEffect, useState } from "react";

interface Payment {
  id: number;
  amount: string;
  status: string;
  description: string | null;
  paymentDate: string | null;
  createdAt: string;
  projectId: number;
  projectTitle: string;
  userId: number;
  userName: string;
}

const statusLabels: Record<string, string> = {
  pending: "در انتظار",
  completed: "تکمیل شده",
  failed: "ناموفق",
  refunded: "بازگشت داده شده",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await fetch("/api/payments");
        if (res.ok) {
          const data = await res.json();
          setPayments(data.payments);
        }
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

  const totalPaid = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const totalPending = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + Number(p.amount), 0);

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
        <h1 className="text-2xl font-bold text-gray-900">پرداخت‌ها</h1>
        <p className="text-gray-500 mt-1">مدیریت و پیگیری پرداخت‌ها</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">کل پرداخت‌ها</h3>
          <p className="text-2xl font-bold text-gray-900">{payments.length} مورد</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">پرداخت‌های تکمیل شده</h3>
          <p className="text-2xl font-bold text-green-600">
            {totalPaid.toLocaleString("fa-IR")} تومان
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">در انتظار پرداخت</h3>
          <p className="text-2xl font-bold text-amber-600">
            {totalPending.toLocaleString("fa-IR")} تومان
          </p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">شناسه</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">پروژه</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">کاربر</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">مبلغ</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">وضعیت</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">تاریخ</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    پرداختی ثبت نشده است
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">#{payment.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{payment.projectTitle}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{payment.userName}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {Number(payment.amount).toLocaleString("fa-IR")} تومان
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          statusColors[payment.status]
                        }`}
                      >
                        {statusLabels[payment.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {payment.paymentDate
                        ? new Date(payment.paymentDate).toLocaleDateString("fa-IR")
                        : new Date(payment.createdAt).toLocaleDateString("fa-IR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
