export interface DemoAccount {
  userId: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "developer" | "client";
}

export interface DemoStatsPayload {
  stats: {
    totalProjects: number;
    activeProjects: number;
    totalTasks: number;
    completedTasks: number;
    totalUsers: number;
    totalPayments: string;
    unreadMessages: number;
  };
  recentProjects: Array<{
    id: number;
    title: string;
    status: string;
    deadline: string | null;
  }>;
  myTasks: Array<{
    id: number;
    title: string;
    status: string;
    priority: string;
    projectTitle: string;
  }>;
}

const PLACEHOLDER_PATTERNS = ["placeholder", "127.0.0.1:5432/placeholder"];

export function hasRealDatabase(): boolean {
  const url = (process.env.DATABASE_URL || "").trim();
  if (!url) return false;
  return !PLACEHOLDER_PATTERNS.some((part) => url.includes(part));
}

export const DEMO_PASSWORD = "123456";

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    userId: 9001,
    name: "مدیر دیجی‌آموزش",
    email: "admin@digiamoozesh.demo",
    role: "admin",
  },
  {
    userId: 9002,
    name: "هنرجوی نمونه",
    email: "user@digiamoozesh.demo",
    role: "client",
  },
  {
    userId: 9003,
    name: "مدیر محتوا",
    email: "manager@digiamoozesh.demo",
    role: "manager",
  },
];

export function findDemoAccount(email: string, password?: string): DemoAccount | null {
  if (!email || (password !== undefined && password !== DEMO_PASSWORD)) return null;
  const found = DEMO_ACCOUNTS.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
  return found || null;
}

export function buildDemoAccountFromRegister(params: {
  name: string;
  email: string;
  role?: string;
}): DemoAccount {
  const normalizedRole = params.role === "admin" || params.role === "manager" || params.role === "developer"
    ? params.role
    : "client";

  return {
    userId: 9500,
    name: params.name.trim() || "هنرجوی جدید",
    email: params.email.trim().toLowerCase(),
    role: normalizedRole,
  };
}

export function demoStatsFor(role: string): DemoStatsPayload {
  const isAdmin = role === "admin" || role === "manager";

  return {
    stats: {
      totalProjects: isAdmin ? 12 : 4,
      activeProjects: isAdmin ? 7 : 3,
      totalTasks: isAdmin ? 38 : 9,
      completedTasks: isAdmin ? 24 : 5,
      totalUsers: isAdmin ? 146 : 146,
      totalPayments: isAdmin ? "24500000" : "3800000",
      unreadMessages: isAdmin ? 6 : 2,
    },
    recentProjects: [
      {
        id: 101,
        title: "مسیر راه‌اندازی پیج آموزشی با هوش مصنوعی",
        status: "in_progress",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 102,
        title: "کارگاه ساخت سناریوی ریلز برای فروش خانگی",
        status: "review",
        deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 103,
        title: "دورهٔ برندسازی کسب‌وکارهای خانگی",
        status: "completed",
        deadline: null,
      },
    ],
    myTasks: [
      {
        id: 201,
        title: isAdmin ? "بررسی سؤالات جدید هنرجوها" : "تکمیل پروفایل هنرجو",
        status: "in_progress",
        priority: "high",
        projectTitle: "داشبورد دیجی‌آموزش",
      },
      {
        id: 202,
        title: isAdmin ? "افزودن ویدیوی یوتیوب به کتابخانه" : "تماشای درس «اولین فروش»",
        status: "todo",
        priority: "medium",
        projectTitle: "مربی هوشمند",
      },
      {
        id: 203,
        title: isAdmin ? "خروجی گرفتن از لاگ‌های AI" : "پرسیدن یک سؤال از مربی هوشمند",
        status: "done",
        priority: "low",
        projectTitle: "RAG آموزشی",
      },
    ],
  };
}
