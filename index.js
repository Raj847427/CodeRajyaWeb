var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  challengeAttempts: () => challengeAttempts,
  challengeAttemptsRelations: () => challengeAttemptsRelations,
  forumAnswers: () => forumAnswers,
  forumAnswersRelations: () => forumAnswersRelations,
  forumPosts: () => forumPosts,
  forumPostsRelations: () => forumPostsRelations,
  insertChallengeAttemptSchema: () => insertChallengeAttemptSchema,
  insertChallengeSchema: () => insertChallengeSchema,
  insertForumAnswerSchema: () => insertForumAnswerSchema,
  insertForumPostSchema: () => insertForumPostSchema,
  insertMentorSchema: () => insertMentorSchema,
  insertModuleSchema: () => insertModuleSchema,
  insertUserSchema: () => insertUserSchema,
  interviewChallenges: () => interviewChallenges,
  interviewChallengesRelations: () => interviewChallengesRelations,
  mentorSessions: () => mentorSessions,
  mentorSessionsRelations: () => mentorSessionsRelations,
  mentors: () => mentors,
  mentorsRelations: () => mentorsRelations,
  modules: () => modules,
  modulesRelations: () => modulesRelations,
  sessions: () => sessions,
  userBadges: () => userBadges,
  userBadgesRelations: () => userBadgesRelations,
  userProgress: () => userProgress,
  userProgressRelations: () => userProgressRelations,
  users: () => users,
  usersRelations: () => usersRelations
});
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("student"),
  // student, mentor, admin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var modules = pgTable("modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  difficulty: varchar("difficulty").notNull(),
  // beginner, intermediate, advanced
  icon: varchar("icon"),
  lessons: integer("lessons").default(0),
  estimatedHours: integer("estimated_hours"),
  createdAt: timestamp("created_at").defaultNow()
});
var userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  moduleId: varchar("module_id").references(() => modules.id).notNull(),
  progress: integer("progress").default(0),
  // percentage 0-100
  completed: boolean("completed").default(false),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at")
});
var mentors = pgTable("mentors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  expertise: text("expertise").array(),
  // array of skill tags
  bio: text("bio"),
  hourlyRate: integer("hourly_rate"),
  rating: integer("rating").default(0),
  totalSessions: integer("total_sessions").default(0),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var mentorSessions = pgTable("mentor_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mentorId: varchar("mentor_id").references(() => mentors.id).notNull(),
  studentId: varchar("student_id").references(() => users.id).notNull(),
  topic: varchar("topic"),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").default(60),
  // minutes
  status: varchar("status").default("scheduled"),
  // scheduled, completed, cancelled
  createdAt: timestamp("created_at").defaultNow()
});
var forumPosts = pgTable("forum_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  authorId: varchar("author_id").references(() => users.id).notNull(),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags").array(),
  upvotes: integer("upvotes").default(0),
  answersCount: integer("answers_count").default(0),
  solved: boolean("solved").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var forumAnswers = pgTable("forum_answers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").references(() => forumPosts.id).notNull(),
  authorId: varchar("author_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  upvotes: integer("upvotes").default(0),
  isAccepted: boolean("is_accepted").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var interviewChallenges = pgTable("interview_challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  difficulty: varchar("difficulty").notNull(),
  solution: text("solution"),
  testCases: jsonb("test_cases"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow()
});
var challengeAttempts = pgTable("challenge_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  challengeId: varchar("challenge_id").references(() => interviewChallenges.id).notNull(),
  code: text("code"),
  language: varchar("language").default("javascript"),
  passed: boolean("passed").default(false),
  score: integer("score").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var userBadges = pgTable("user_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  badgeType: varchar("badge_type").notNull(),
  // java_master, problem_solver, streak_7
  earnedAt: timestamp("earned_at").defaultNow()
});
var usersRelations = relations(users, ({ many, one }) => ({
  progress: many(userProgress),
  mentorProfile: one(mentors, { fields: [users.id], references: [mentors.userId] }),
  forumPosts: many(forumPosts),
  forumAnswers: many(forumAnswers),
  challengeAttempts: many(challengeAttempts),
  badges: many(userBadges),
  mentorSessions: many(mentorSessions)
}));
var modulesRelations = relations(modules, ({ many }) => ({
  progress: many(userProgress)
}));
var userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, { fields: [userProgress.userId], references: [users.id] }),
  module: one(modules, { fields: [userProgress.moduleId], references: [modules.id] })
}));
var mentorsRelations = relations(mentors, ({ one, many }) => ({
  user: one(users, { fields: [mentors.userId], references: [users.id] }),
  sessions: many(mentorSessions)
}));
var mentorSessionsRelations = relations(mentorSessions, ({ one }) => ({
  mentor: one(mentors, { fields: [mentorSessions.mentorId], references: [mentors.id] }),
  student: one(users, { fields: [mentorSessions.studentId], references: [users.id] })
}));
var forumPostsRelations = relations(forumPosts, ({ one, many }) => ({
  author: one(users, { fields: [forumPosts.authorId], references: [users.id] }),
  answers: many(forumAnswers)
}));
var forumAnswersRelations = relations(forumAnswers, ({ one }) => ({
  post: one(forumPosts, { fields: [forumAnswers.postId], references: [forumPosts.id] }),
  author: one(users, { fields: [forumAnswers.authorId], references: [users.id] })
}));
var interviewChallengesRelations = relations(interviewChallenges, ({ many }) => ({
  attempts: many(challengeAttempts)
}));
var challengeAttemptsRelations = relations(challengeAttempts, ({ one }) => ({
  user: one(users, { fields: [challengeAttempts.userId], references: [users.id] }),
  challenge: one(interviewChallenges, { fields: [challengeAttempts.challengeId], references: [interviewChallenges.id] })
}));
var userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, { fields: [userBadges.userId], references: [users.id] })
}));
var insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true
});
var insertModuleSchema = createInsertSchema(modules).omit({
  id: true,
  createdAt: true
});
var insertMentorSchema = createInsertSchema(mentors).omit({
  id: true,
  createdAt: true
});
var insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  upvotes: true,
  answersCount: true,
  solved: true,
  createdAt: true
});
var insertForumAnswerSchema = createInsertSchema(forumAnswers).omit({
  id: true,
  upvotes: true,
  isAccepted: true,
  createdAt: true
});
var insertChallengeSchema = createInsertSchema(interviewChallenges).omit({
  id: true,
  createdAt: true
});
var insertChallengeAttemptSchema = createInsertSchema(challengeAttempts).omit({
  id: true,
  createdAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, sql as sql2, and } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations (mandatory for Replit Auth)
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  // Module operations
  async getModules() {
    return await db.select().from(modules).orderBy(modules.title);
  }
  async getModule(id) {
    const [module] = await db.select().from(modules).where(eq(modules.id, id));
    return module;
  }
  async createModule(module) {
    const [newModule] = await db.insert(modules).values(module).returning();
    return newModule;
  }
  async updateModule(id, module) {
    const [updatedModule] = await db.update(modules).set(module).where(eq(modules.id, id)).returning();
    return updatedModule;
  }
  // User progress operations
  async getUserProgress(userId) {
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId)).orderBy(userProgress.startedAt);
  }
  async getModuleProgress(userId, moduleId) {
    const [progress] = await db.select().from(userProgress).where(and(eq(userProgress.userId, userId), eq(userProgress.moduleId, moduleId)));
    return progress;
  }
  async updateProgress(userId, moduleId, progress) {
    const existingProgress = await this.getModuleProgress(userId, moduleId);
    if (existingProgress) {
      const [updated] = await db.update(userProgress).set({
        progress,
        completed: progress >= 100,
        completedAt: progress >= 100 ? /* @__PURE__ */ new Date() : null
      }).where(eq(userProgress.id, existingProgress.id)).returning();
      return updated;
    } else {
      const [newProgress] = await db.insert(userProgress).values({
        userId,
        moduleId,
        progress,
        completed: progress >= 100,
        completedAt: progress >= 100 ? /* @__PURE__ */ new Date() : null
      }).returning();
      return newProgress;
    }
  }
  // Mentor operations
  async getMentors() {
    const results = await db.select().from(mentors).innerJoin(users, eq(mentors.userId, users.id)).where(eq(mentors.isAvailable, true)).orderBy(desc(mentors.rating));
    return results.map((result) => ({
      ...result.mentors,
      user: result.users
    }));
  }
  async getMentor(id) {
    const [result] = await db.select().from(mentors).innerJoin(users, eq(mentors.userId, users.id)).where(eq(mentors.id, id));
    if (!result) return void 0;
    return {
      ...result.mentors,
      user: result.users
    };
  }
  async createMentor(mentor) {
    const [newMentor] = await db.insert(mentors).values(mentor).returning();
    return newMentor;
  }
  // Mentor session operations
  async getMentorSessions(userId) {
    const results = await db.select().from(mentorSessions).innerJoin(mentors, eq(mentorSessions.mentorId, mentors.id)).innerJoin(users, eq(mentors.userId, users.id)).where(eq(mentorSessions.studentId, userId)).orderBy(mentorSessions.scheduledAt);
    return results.map((result) => ({
      ...result.mentor_sessions,
      mentor: {
        ...result.mentors,
        user: result.users
      }
    }));
  }
  async createMentorSession(session2) {
    const [newSession] = await db.insert(mentorSessions).values(session2).returning();
    return newSession;
  }
  // Forum operations
  async getForumPosts(limit = 20) {
    const results = await db.select().from(forumPosts).innerJoin(users, eq(forumPosts.authorId, users.id)).orderBy(desc(forumPosts.createdAt)).limit(limit);
    return results.map((result) => ({
      ...result.forum_posts,
      author: result.users
    }));
  }
  async getForumPost(id) {
    const [postResult] = await db.select().from(forumPosts).innerJoin(users, eq(forumPosts.authorId, users.id)).where(eq(forumPosts.id, id));
    if (!postResult) return void 0;
    const post = {
      ...postResult.forum_posts,
      author: postResult.users
    };
    const answerResults = await db.select().from(forumAnswers).innerJoin(users, eq(forumAnswers.authorId, users.id)).where(eq(forumAnswers.postId, id)).orderBy(desc(forumAnswers.upvotes), forumAnswers.createdAt);
    const answers = answerResults.map((result) => ({
      ...result.forum_answers,
      author: result.users
    }));
    return { ...post, answers };
  }
  async createForumPost(post) {
    const [newPost] = await db.insert(forumPosts).values(post).returning();
    return newPost;
  }
  async createForumAnswer(answer) {
    const [newAnswer] = await db.insert(forumAnswers).values(answer).returning();
    await db.update(forumPosts).set({ answersCount: sql2`${forumPosts.answersCount} + 1` }).where(eq(forumPosts.id, answer.postId));
    return newAnswer;
  }
  // Interview challenge operations
  async getInterviewChallenges() {
    return await db.select().from(interviewChallenges).orderBy(interviewChallenges.difficulty, interviewChallenges.title);
  }
  async getInterviewChallenge(id) {
    const [challenge] = await db.select().from(interviewChallenges).where(eq(interviewChallenges.id, id));
    return challenge;
  }
  async createChallenge(challenge) {
    const [newChallenge] = await db.insert(interviewChallenges).values(challenge).returning();
    return newChallenge;
  }
  async getUserChallengeAttempts(userId) {
    return await db.select().from(challengeAttempts).where(eq(challengeAttempts.userId, userId)).orderBy(desc(challengeAttempts.createdAt));
  }
  async createChallengeAttempt(attempt) {
    const [newAttempt] = await db.insert(challengeAttempts).values(attempt).returning();
    return newAttempt;
  }
  // Badge operations
  async getUserBadges(userId) {
    return await db.select().from(userBadges).where(eq(userBadges.userId, userId)).orderBy(desc(userBadges.earnedAt));
  }
  async awardBadge(userId, badgeType) {
    const existingBadge = await db.select().from(userBadges).where(and(eq(userBadges.userId, userId), eq(userBadges.badgeType, badgeType))).limit(1);
    if (existingBadge.length > 0) {
      return existingBadge[0];
    }
    const [newBadge] = await db.insert(userBadges).values({ userId, badgeType }).returning();
    return newBadge;
  }
  // Dashboard stats
  async getUserStats(userId) {
    const [completedModulesResult] = await db.select({ count: sql2`count(*)` }).from(userProgress).where(and(eq(userProgress.userId, userId), eq(userProgress.completed, true)));
    const [badgesResult] = await db.select({ count: sql2`count(*)` }).from(userBadges).where(eq(userBadges.userId, userId));
    const [mentorSessionsResult] = await db.select({ count: sql2`count(*)` }).from(mentorSessions).where(and(eq(mentorSessions.studentId, userId), eq(mentorSessions.status, "completed")));
    const progressData = await db.select({ progress: userProgress.progress }).from(userProgress).where(eq(userProgress.userId, userId));
    const studyHours = Math.round(progressData.reduce((total, p) => total + (p.progress || 0) / 100 * 2, 0));
    return {
      completedModules: completedModulesResult?.count || 0,
      badges: badgesResult?.count || 0,
      studyHours,
      mentorSessions: mentorSessionsResult?.count || 0
    };
  }
};
var storage = new DatabaseStorage();

// server/replitAuth.ts
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}
var getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"]
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(passport.initialize());
  app2.use(passport.session());
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };
  for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`
      },
      verify
    );
    passport.use(strategy);
  }
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
  app2.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}
var isAuthenticated = async (req, res, next) => {
  const user = req.user;
  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const now = Math.floor(Date.now() / 1e3);
  if (now <= user.expires_at) {
    return next();
  }
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// server/routes.ts
async function registerRoutes(app2) {
  await setupAuth(app2);
  app2.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.get("/api/dashboard/stats", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });
  app2.get("/api/dashboard/progress", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });
  app2.get("/api/dashboard/badges", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const badges = await storage.getUserBadges(userId);
      res.json(badges);
    } catch (error) {
      console.error("Error fetching user badges:", error);
      res.status(500).json({ message: "Failed to fetch badges" });
    }
  });
  app2.get("/api/modules", async (req, res) => {
    try {
      const modules2 = await storage.getModules();
      res.json(modules2);
    } catch (error) {
      console.error("Error fetching modules:", error);
      res.status(500).json({ message: "Failed to fetch modules" });
    }
  });
  app2.get("/api/modules/:id", async (req, res) => {
    try {
      const module = await storage.getModule(req.params.id);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      res.json(module);
    } catch (error) {
      console.error("Error fetching module:", error);
      res.status(500).json({ message: "Failed to fetch module" });
    }
  });
  app2.post("/api/modules", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const moduleData = insertModuleSchema.parse(req.body);
      const module = await storage.createModule(moduleData);
      res.status(201).json(module);
    } catch (error) {
      console.error("Error creating module:", error);
      res.status(500).json({ message: "Failed to create module" });
    }
  });
  app2.put("/api/modules/:id/progress", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { progress } = req.body;
      if (typeof progress !== "number" || progress < 0 || progress > 100) {
        return res.status(400).json({ message: "Progress must be a number between 0 and 100" });
      }
      const updatedProgress = await storage.updateProgress(userId, req.params.id, progress);
      res.json(updatedProgress);
    } catch (error) {
      console.error("Error updating progress:", error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  });
  app2.get("/api/mentors", async (req, res) => {
    try {
      const mentors2 = await storage.getMentors();
      res.json(mentors2);
    } catch (error) {
      console.error("Error fetching mentors:", error);
      res.status(500).json({ message: "Failed to fetch mentors" });
    }
  });
  app2.get("/api/mentors/:id", async (req, res) => {
    try {
      const mentor = await storage.getMentor(req.params.id);
      if (!mentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }
      res.json(mentor);
    } catch (error) {
      console.error("Error fetching mentor:", error);
      res.status(500).json({ message: "Failed to fetch mentor" });
    }
  });
  app2.post("/api/mentors", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const mentorData = insertMentorSchema.parse({ ...req.body, userId });
      const mentor = await storage.createMentor(mentorData);
      res.status(201).json(mentor);
    } catch (error) {
      console.error("Error creating mentor profile:", error);
      res.status(500).json({ message: "Failed to create mentor profile" });
    }
  });
  app2.get("/api/mentor-sessions", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions2 = await storage.getMentorSessions(userId);
      res.json(sessions2);
    } catch (error) {
      console.error("Error fetching mentor sessions:", error);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });
  app2.post("/api/mentor-sessions", isAuthenticated, async (req, res) => {
    try {
      const studentId = req.user.claims.sub;
      const { mentorId, topic, scheduledAt, duration } = req.body;
      const session2 = await storage.createMentorSession({
        mentorId,
        studentId,
        topic,
        scheduledAt: new Date(scheduledAt),
        duration: duration || 60,
        status: "scheduled"
      });
      res.status(201).json(session2);
    } catch (error) {
      console.error("Error booking mentor session:", error);
      res.status(500).json({ message: "Failed to book session" });
    }
  });
  app2.get("/api/forum/posts", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 20;
      const posts = await storage.getForumPosts(limit);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching forum posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });
  app2.get("/api/forum/posts/:id", async (req, res) => {
    try {
      const post = await storage.getForumPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching forum post:", error);
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });
  app2.post("/api/forum/posts", isAuthenticated, async (req, res) => {
    try {
      const authorId = req.user.claims.sub;
      const postData = insertForumPostSchema.parse({ ...req.body, authorId });
      const post = await storage.createForumPost(postData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating forum post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });
  app2.post("/api/forum/posts/:id/answers", isAuthenticated, async (req, res) => {
    try {
      const authorId = req.user.claims.sub;
      const answerData = insertForumAnswerSchema.parse({
        ...req.body,
        authorId,
        postId: req.params.id
      });
      const answer = await storage.createForumAnswer(answerData);
      res.status(201).json(answer);
    } catch (error) {
      console.error("Error creating forum answer:", error);
      res.status(500).json({ message: "Failed to create answer" });
    }
  });
  app2.get("/api/challenges", async (req, res) => {
    try {
      const challenges = await storage.getInterviewChallenges();
      res.json(challenges);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });
  app2.get("/api/challenges/:id", async (req, res) => {
    try {
      const challenge = await storage.getInterviewChallenge(req.params.id);
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      res.json(challenge);
    } catch (error) {
      console.error("Error fetching challenge:", error);
      res.status(500).json({ message: "Failed to fetch challenge" });
    }
  });
  app2.post("/api/challenges", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const challengeData = insertChallengeSchema.parse(req.body);
      const challenge = await storage.createChallenge(challengeData);
      res.status(201).json(challenge);
    } catch (error) {
      console.error("Error creating challenge:", error);
      res.status(500).json({ message: "Failed to create challenge" });
    }
  });
  app2.get("/api/challenge-attempts", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const attempts = await storage.getUserChallengeAttempts(userId);
      res.json(attempts);
    } catch (error) {
      console.error("Error fetching challenge attempts:", error);
      res.status(500).json({ message: "Failed to fetch attempts" });
    }
  });
  app2.post("/api/challenge-attempts", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const attemptData = insertChallengeAttemptSchema.parse({ ...req.body, userId });
      const attempt = await storage.createChallengeAttempt(attemptData);
      res.status(201).json(attempt);
    } catch (error) {
      console.error("Error creating challenge attempt:", error);
      res.status(500).json({ message: "Failed to create attempt" });
    }
  });
  app2.post("/api/badges/:badgeType", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { badgeType } = req.params;
      const badge = await storage.awardBadge(userId, badgeType);
      res.status(201).json(badge);
    } catch (error) {
      console.error("Error awarding badge:", error);
      res.status(500).json({ message: "Failed to award badge" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
