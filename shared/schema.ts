import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default('student'), // student, mentor, admin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Learning modules
export const modules = pgTable("modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  difficulty: varchar("difficulty").notNull(), // beginner, intermediate, advanced
  icon: varchar("icon"),
  lessons: integer("lessons").default(0),
  estimatedHours: integer("estimated_hours"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User progress on modules
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  moduleId: varchar("module_id").references(() => modules.id).notNull(),
  progress: integer("progress").default(0), // percentage 0-100
  completed: boolean("completed").default(false),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Mentors
export const mentors = pgTable("mentors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  expertise: text("expertise").array(), // array of skill tags
  bio: text("bio"),
  hourlyRate: integer("hourly_rate"),
  rating: integer("rating").default(0),
  totalSessions: integer("total_sessions").default(0),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Mentor booking sessions
export const mentorSessions = pgTable("mentor_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mentorId: varchar("mentor_id").references(() => mentors.id).notNull(),
  studentId: varchar("student_id").references(() => users.id).notNull(),
  topic: varchar("topic"),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").default(60), // minutes
  status: varchar("status").default('scheduled'), // scheduled, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

// Forum posts
export const forumPosts = pgTable("forum_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  authorId: varchar("author_id").references(() => users.id).notNull(),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags").array(),
  upvotes: integer("upvotes").default(0),
  answersCount: integer("answers_count").default(0),
  solved: boolean("solved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Forum answers
export const forumAnswers = pgTable("forum_answers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").references(() => forumPosts.id).notNull(),
  authorId: varchar("author_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  upvotes: integer("upvotes").default(0),
  isAccepted: boolean("is_accepted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Interview challenges
export const interviewChallenges = pgTable("interview_challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  difficulty: varchar("difficulty").notNull(),
  solution: text("solution"),
  testCases: jsonb("test_cases"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User challenge attempts
export const challengeAttempts = pgTable("challenge_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  challengeId: varchar("challenge_id").references(() => interviewChallenges.id).notNull(),
  code: text("code"),
  language: varchar("language").default('javascript'),
  passed: boolean("passed").default(false),
  score: integer("score").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// User badges
export const userBadges = pgTable("user_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  badgeType: varchar("badge_type").notNull(), // java_master, problem_solver, streak_7
  earnedAt: timestamp("earned_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  progress: many(userProgress),
  mentorProfile: one(mentors, { fields: [users.id], references: [mentors.userId] }),
  forumPosts: many(forumPosts),
  forumAnswers: many(forumAnswers),
  challengeAttempts: many(challengeAttempts),
  badges: many(userBadges),
  mentorSessions: many(mentorSessions),
}));

export const modulesRelations = relations(modules, ({ many }) => ({
  progress: many(userProgress),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, { fields: [userProgress.userId], references: [users.id] }),
  module: one(modules, { fields: [userProgress.moduleId], references: [modules.id] }),
}));

export const mentorsRelations = relations(mentors, ({ one, many }) => ({
  user: one(users, { fields: [mentors.userId], references: [users.id] }),
  sessions: many(mentorSessions),
}));

export const mentorSessionsRelations = relations(mentorSessions, ({ one }) => ({
  mentor: one(mentors, { fields: [mentorSessions.mentorId], references: [mentors.id] }),
  student: one(users, { fields: [mentorSessions.studentId], references: [users.id] }),
}));

export const forumPostsRelations = relations(forumPosts, ({ one, many }) => ({
  author: one(users, { fields: [forumPosts.authorId], references: [users.id] }),
  answers: many(forumAnswers),
}));

export const forumAnswersRelations = relations(forumAnswers, ({ one }) => ({
  post: one(forumPosts, { fields: [forumAnswers.postId], references: [forumPosts.id] }),
  author: one(users, { fields: [forumAnswers.authorId], references: [users.id] }),
}));

export const interviewChallengesRelations = relations(interviewChallenges, ({ many }) => ({
  attempts: many(challengeAttempts),
}));

export const challengeAttemptsRelations = relations(challengeAttempts, ({ one }) => ({
  user: one(users, { fields: [challengeAttempts.userId], references: [users.id] }),
  challenge: one(interviewChallenges, { fields: [challengeAttempts.challengeId], references: [interviewChallenges.id] }),
}));

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, { fields: [userBadges.userId], references: [users.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertModuleSchema = createInsertSchema(modules).omit({
  id: true,
  createdAt: true,
});

export const insertMentorSchema = createInsertSchema(mentors).omit({
  id: true,
  createdAt: true,
});

export const insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  upvotes: true,
  answersCount: true,
  solved: true,
  createdAt: true,
});

export const insertForumAnswerSchema = createInsertSchema(forumAnswers).omit({
  id: true,
  upvotes: true,
  isAccepted: true,
  createdAt: true,
});

export const insertChallengeSchema = createInsertSchema(interviewChallenges).omit({
  id: true,
  createdAt: true,
});

export const insertChallengeAttemptSchema = createInsertSchema(challengeAttempts).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Module = typeof modules.$inferSelect;
export type InsertModule = z.infer<typeof insertModuleSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type Mentor = typeof mentors.$inferSelect;
export type InsertMentor = z.infer<typeof insertMentorSchema>;
export type MentorSession = typeof mentorSessions.$inferSelect;
export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type ForumAnswer = typeof forumAnswers.$inferSelect;
export type InsertForumAnswer = z.infer<typeof insertForumAnswerSchema>;
export type InterviewChallenge = typeof interviewChallenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type ChallengeAttempt = typeof challengeAttempts.$inferSelect;
export type InsertChallengeAttempt = z.infer<typeof insertChallengeAttemptSchema>;
export type UserBadge = typeof userBadges.$inferSelect;
