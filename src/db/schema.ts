import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  decimal,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ── Enums ──────────────────────────────────────────────
export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "manager",
  "developer",
  "client",
]);
export const projectStatusEnum = pgEnum("project_status", [
  "pending",
  "in_progress",
  "review",
  "completed",
  "cancelled",
]);
export const taskStatusEnum = pgEnum("task_status", [
  "todo",
  "in_progress",
  "review",
  "done",
]);
export const taskPriorityEnum = pgEnum("task_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "completed",
  "failed",
  "refunded",
]);

// ── Collaboration Application Enums ────────────────────
export const applicationStatusEnum = pgEnum("application_status", [
  "submitted",       // فرم ثبت شده
  "portfolio_review", // در حال بررسی نمونه‌کار
  "training",        // در حال آموزش
  "test_project",    // پروژه آزمایشی
  "approved",        // تایید شده
  "rejected",        // رد شده
]);

// ── Users ──────────────────────────────────────────────
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull().default("developer"),
  avatar: text("avatar"),
  phone: varchar("phone", { length: 50 }),
  bio: text("bio"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── Projects ───────────────────────────────────────────
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  budget: decimal("budget", { precision: 12, scale: 2 }),
  status: projectStatusEnum("status").notNull().default("pending"),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => users.id),
  deadline: timestamp("deadline"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── Project Members ────────────────────────────────────
export const projectMembers = pgTable("project_members", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 50 }).notNull().default("member"),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

// ── Tasks ──────────────────────────────────────────────
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  assignedTo: integer("assigned_to").references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: taskStatusEnum("status").notNull().default("todo"),
  priority: taskPriorityEnum("priority").notNull().default("medium"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── Messages ───────────────────────────────────────────
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id")
    .notNull()
    .references(() => users.id),
  receiverId: integer("receiver_id")
    .notNull()
    .references(() => users.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Payments ───────────────────────────────────────────
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  status: paymentStatusEnum("status").notNull().default("pending"),
  description: text("description"),
  paymentDate: timestamp("payment_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Notifications ──────────────────────────────────────
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  type: varchar("type", { length: 50 }).notNull().default("info"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Relations ──────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  ownedProjects: many(projects),
  assignedTasks: many(tasks),
  projectMemberships: many(projectMembers),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "receiver" }),
  payments: many(payments),
  notifications: many(notifications),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(users, { fields: [projects.ownerId], references: [users.id] }),
  tasks: many(tasks),
  members: many(projectMembers),
  payments: many(payments),
}));

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectMembers.userId],
    references: [users.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  project: one(projects, { fields: [tasks.projectId], references: [projects.id] }),
  assignee: one(users, { fields: [tasks.assignedTo], references: [users.id] }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, { fields: [messages.senderId], references: [users.id], relationName: "sender" }),
  receiver: one(users, { fields: [messages.receiverId], references: [users.id], relationName: "receiver" }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  project: one(projects, { fields: [payments.projectId], references: [projects.id] }),
  user: one(users, { fields: [payments.userId], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

// ── Collaboration Applications ─────────────────────────
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  age: integer("age"),
  city: varchar("city", { length: 100 }),
  instagramHandle: varchar("instagram_handle", { length: 255 }),
  hasActivePage: boolean("has_active_page").default(false),
  hasReelsExperience: boolean("has_reels_experience").default(false),
  canWorkWithFriends: boolean("can_work_with_friends").default(false),
  portfolioLinks: text("portfolio_links"),     // JSON array of links
  sampleVideoUrls: text("sample_video_urls"),  // JSON array of URLs
  motivationText: text("motivation_text"),     // Why do you want to collaborate?
  skillsDescription: text("skills_description"),
  status: applicationStatusEnum("status").notNull().default("submitted"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewNotes: text("review_notes"),
  trainingAssignedAt: timestamp("training_assigned_at"),
  trainingDeadline: timestamp("training_deadline"),
  trainingCompletedAt: timestamp("training_completed_at"),
  testProjectAssignedAt: timestamp("test_project_assigned_at"),
  testProjectDeadline: timestamp("test_project_deadline"),
  testProjectSubmittedAt: timestamp("test_project_submitted_at"),
  testProjectNotes: text("test_project_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── Training Modules (YouTube links & resources) ───────
export const trainingModules = pgTable("training_modules", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  videoUrl: text("video_url").notNull(),
  platform: varchar("platform", { length: 50 }).default("youtube"), // youtube, aparat, etc
  durationMinutes: integer("duration_minutes"),
  orderIndex: integer("order_index").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Training Progress per Application ──────────────────
export const trainingProgress = pgTable("training_progress", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id")
    .notNull()
    .references(() => applications.id, { onDelete: "cascade" }),
  moduleId: integer("module_id")
    .notNull()
    .references(() => trainingModules.id, { onDelete: "cascade" }),
  isCompleted: boolean("is_completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Applications Relations ─────────────────────────────
export const applicationsRelations = relations(applications, ({ one, many }) => ({
  reviewer: one(users, { fields: [applications.reviewedBy], references: [users.id] }),
  trainingProgress: many(trainingProgress),
}));

export const trainingModulesRelations = relations(trainingModules, ({ many }) => ({
  progress: many(trainingProgress),
}));

export const trainingProgressRelations = relations(trainingProgress, ({ one }) => ({
  application: one(applications, {
    fields: [trainingProgress.applicationId],
    references: [applications.id],
  }),
  module: one(trainingModules, {
    fields: [trainingProgress.moduleId],
    references: [trainingModules.id],
  }),
}));

// ── Home Business Categories ───────────────────────────
export const businessCategories = pgTable("business_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  icon: varchar("icon", { length: 10 }).notNull(),
  description: text("description"),
  difficulty: varchar("difficulty", { length: 20 }).notNull().default("easy"), // easy, medium, hard
  startupCost: varchar("startup_cost", { length: 100 }), // "کم", "متوسط", "زیاد"
  monthlyIncome: varchar("monthly_income", { length: 100 }),
  skillsNeeded: text("skills_needed"),         // JSON array
  aiToolsUsage: text("ai_tools_usage"),        // JSON array of AI use-cases
  contentIdeas: text("content_ideas"),          // JSON array of reel/content ideas
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── User Business Profile (quiz results + selection) ──
export const userBusinessProfiles = pgTable("user_business_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  applicationId: integer("application_id").references(() => applications.id),
  selectedCategoryId: integer("selected_category_id").references(() => businessCategories.id),
  businessName: varchar("business_name", { length: 255 }),
  quizAnswers: text("quiz_answers"),           // JSON of quiz Q&A
  quizResult: text("quiz_result"),             // JSON of recommended categories
  currentStep: integer("current_step").notNull().default(1),  // 1-7
  hasPersonalBrand: boolean("has_personal_brand").default(false),
  hasInstagramPage: boolean("has_instagram_page").default(false),
  reelsCount: integer("reels_count").default(0),
  hasProduct: boolean("has_product").default(false),
  hasFirstSale: boolean("has_first_sale").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── Affiliate / Referral System ────────────────────────
export const affiliateCodes = pgTable("affiliate_codes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 50 }).notNull().unique(),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).notNull().default("20"),
  totalReferrals: integer("total_referrals").notNull().default(0),
  totalEarnings: decimal("total_earnings", { precision: 12, scale: 2 }).notNull().default("0"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const affiliateReferrals = pgTable("affiliate_referrals", {
  id: serial("id").primaryKey(),
  affiliateCodeId: integer("affiliate_code_id")
    .notNull()
    .references(() => affiliateCodes.id),
  referredUserId: integer("referred_user_id")
    .notNull()
    .references(() => users.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  commission: decimal("commission", { precision: 12, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, confirmed, paid
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const affiliateCodesRelations = relations(affiliateCodes, ({ one, many }) => ({
  user: one(users, { fields: [affiliateCodes.userId], references: [users.id] }),
  referrals: many(affiliateReferrals),
}));

export const affiliateReferralsRelations = relations(affiliateReferrals, ({ one }) => ({
  affiliateCode: one(affiliateCodes, {
    fields: [affiliateReferrals.affiliateCodeId],
    references: [affiliateCodes.id],
  }),
  referredUser: one(users, {
    fields: [affiliateReferrals.referredUserId],
    references: [users.id],
  }),
}));
