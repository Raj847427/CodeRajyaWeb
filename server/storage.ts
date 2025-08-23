import {
  users,
  modules,
  userProgress,
  mentors,
  mentorSessions,
  forumPosts,
  forumAnswers,
  interviewChallenges,
  challengeAttempts,
  userBadges,
  type User,
  type UpsertUser,
  type Module,
  type InsertModule,
  type UserProgress,
  type Mentor,
  type InsertMentor,
  type MentorSession,
  type ForumPost,
  type InsertForumPost,
  type ForumAnswer,
  type InsertForumAnswer,
  type InterviewChallenge,
  type InsertChallenge,
  type ChallengeAttempt,
  type InsertChallengeAttempt,
  type UserBadge,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, or, ilike } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Module operations
  getModules(): Promise<Module[]>;
  getModule(id: string): Promise<Module | undefined>;
  createModule(module: InsertModule): Promise<Module>;
  updateModule(id: string, module: Partial<InsertModule>): Promise<Module>;
  
  // User progress operations
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getModuleProgress(userId: string, moduleId: string): Promise<UserProgress | undefined>;
  updateProgress(userId: string, moduleId: string, progress: number): Promise<UserProgress>;
  
  // Mentor operations
  getMentors(): Promise<(Mentor & { user: User })[]>;
  getMentor(id: string): Promise<(Mentor & { user: User }) | undefined>;
  createMentor(mentor: InsertMentor): Promise<Mentor>;
  
  // Mentor session operations
  getMentorSessions(userId: string): Promise<(MentorSession & { mentor: Mentor & { user: User } })[]>;
  createMentorSession(session: Omit<MentorSession, 'id' | 'createdAt'>): Promise<MentorSession>;
  
  // Forum operations
  getForumPosts(limit?: number): Promise<(ForumPost & { author: User })[]>;
  getForumPost(id: string): Promise<(ForumPost & { author: User; answers: (ForumAnswer & { author: User })[] }) | undefined>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  createForumAnswer(answer: InsertForumAnswer): Promise<ForumAnswer>;
  
  // Interview challenge operations
  getInterviewChallenges(): Promise<InterviewChallenge[]>;
  getInterviewChallenge(id: string): Promise<InterviewChallenge | undefined>;
  createChallenge(challenge: InsertChallenge): Promise<InterviewChallenge>;
  getUserChallengeAttempts(userId: string): Promise<ChallengeAttempt[]>;
  createChallengeAttempt(attempt: InsertChallengeAttempt): Promise<ChallengeAttempt>;
  
  // Badge operations
  getUserBadges(userId: string): Promise<UserBadge[]>;
  awardBadge(userId: string, badgeType: string): Promise<UserBadge>;
  
  // Dashboard stats
  getUserStats(userId: string): Promise<{
    completedModules: number;
    badges: number;
    studyHours: number;
    mentorSessions: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Module operations
  async getModules(): Promise<Module[]> {
    return await db.select().from(modules).orderBy(modules.title);
  }

  async getModule(id: string): Promise<Module | undefined> {
    const [module] = await db.select().from(modules).where(eq(modules.id, id));
    return module;
  }

  async createModule(module: InsertModule): Promise<Module> {
    const [newModule] = await db.insert(modules).values(module).returning();
    return newModule;
  }

  async updateModule(id: string, module: Partial<InsertModule>): Promise<Module> {
    const [updatedModule] = await db
      .update(modules)
      .set(module)
      .where(eq(modules.id, id))
      .returning();
    return updatedModule;
  }

  // User progress operations
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .orderBy(userProgress.startedAt);
  }

  async getModuleProgress(userId: string, moduleId: string): Promise<UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.moduleId, moduleId)));
    return progress;
  }

  async updateProgress(userId: string, moduleId: string, progress: number): Promise<UserProgress> {
    const existingProgress = await this.getModuleProgress(userId, moduleId);
    
    if (existingProgress) {
      const [updated] = await db
        .update(userProgress)
        .set({ 
          progress, 
          completed: progress >= 100,
          completedAt: progress >= 100 ? new Date() : null,
        })
        .where(eq(userProgress.id, existingProgress.id))
        .returning();
      return updated;
    } else {
      const [newProgress] = await db
        .insert(userProgress)
        .values({
          userId,
          moduleId,
          progress,
          completed: progress >= 100,
          completedAt: progress >= 100 ? new Date() : null,
        })
        .returning();
      return newProgress;
    }
  }

  // Mentor operations
  async getMentors(): Promise<(Mentor & { user: User })[]> {
    const results = await db
      .select()
      .from(mentors)
      .innerJoin(users, eq(mentors.userId, users.id))
      .where(eq(mentors.isAvailable, true))
      .orderBy(desc(mentors.rating));
    
    return results.map(result => ({
      ...result.mentors,
      user: result.users
    }));
  }

  async getMentor(id: string): Promise<(Mentor & { user: User }) | undefined> {
    const [result] = await db
      .select()
      .from(mentors)
      .innerJoin(users, eq(mentors.userId, users.id))
      .where(eq(mentors.id, id));
    
    if (!result) return undefined;
    
    return {
      ...result.mentors,
      user: result.users
    };
  }

  async createMentor(mentor: InsertMentor): Promise<Mentor> {
    const [newMentor] = await db.insert(mentors).values(mentor).returning();
    return newMentor;
  }

  // Mentor session operations
  async getMentorSessions(userId: string): Promise<(MentorSession & { mentor: Mentor & { user: User } })[]> {
    const results = await db
      .select()
      .from(mentorSessions)
      .innerJoin(mentors, eq(mentorSessions.mentorId, mentors.id))
      .innerJoin(users, eq(mentors.userId, users.id))
      .where(eq(mentorSessions.studentId, userId))
      .orderBy(mentorSessions.scheduledAt);
    
    return results.map(result => ({
      ...result.mentor_sessions,
      mentor: {
        ...result.mentors,
        user: result.users
      }
    }));
  }

  async createMentorSession(session: Omit<MentorSession, 'id' | 'createdAt'>): Promise<MentorSession> {
    const [newSession] = await db.insert(mentorSessions).values(session).returning();
    return newSession;
  }

  // Forum operations
  async getForumPosts(limit: number = 20): Promise<(ForumPost & { author: User })[]> {
    const results = await db
      .select()
      .from(forumPosts)
      .innerJoin(users, eq(forumPosts.authorId, users.id))
      .orderBy(desc(forumPosts.createdAt))
      .limit(limit);
    
    return results.map(result => ({
      ...result.forum_posts,
      author: result.users
    }));
  }

  async getForumPost(id: string): Promise<(ForumPost & { author: User; answers: (ForumAnswer & { author: User })[] }) | undefined> {
    const [postResult] = await db
      .select()
      .from(forumPosts)
      .innerJoin(users, eq(forumPosts.authorId, users.id))
      .where(eq(forumPosts.id, id));

    if (!postResult) return undefined;

    const post = {
      ...postResult.forum_posts,
      author: postResult.users
    };

    const answerResults = await db
      .select()
      .from(forumAnswers)
      .innerJoin(users, eq(forumAnswers.authorId, users.id))
      .where(eq(forumAnswers.postId, id))
      .orderBy(desc(forumAnswers.upvotes), forumAnswers.createdAt);

    const answers = answerResults.map(result => ({
      ...result.forum_answers,
      author: result.users
    }));

    return { ...post, answers };
  }

  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const [newPost] = await db.insert(forumPosts).values(post).returning();
    return newPost;
  }

  async createForumAnswer(answer: InsertForumAnswer): Promise<ForumAnswer> {
    const [newAnswer] = await db.insert(forumAnswers).values(answer).returning();
    
    // Update answers count on the post
    await db
      .update(forumPosts)
      .set({ answersCount: sql`${forumPosts.answersCount} + 1` })
      .where(eq(forumPosts.id, answer.postId));
    
    return newAnswer;
  }

  // Interview challenge operations
  async getInterviewChallenges(): Promise<InterviewChallenge[]> {
    return await db.select().from(interviewChallenges).orderBy(interviewChallenges.difficulty, interviewChallenges.title);
  }

  async getInterviewChallenge(id: string): Promise<InterviewChallenge | undefined> {
    const [challenge] = await db.select().from(interviewChallenges).where(eq(interviewChallenges.id, id));
    return challenge;
  }

  async createChallenge(challenge: InsertChallenge): Promise<InterviewChallenge> {
    const [newChallenge] = await db.insert(interviewChallenges).values(challenge).returning();
    return newChallenge;
  }

  async getUserChallengeAttempts(userId: string): Promise<ChallengeAttempt[]> {
    return await db
      .select()
      .from(challengeAttempts)
      .where(eq(challengeAttempts.userId, userId))
      .orderBy(desc(challengeAttempts.createdAt));
  }

  async createChallengeAttempt(attempt: InsertChallengeAttempt): Promise<ChallengeAttempt> {
    const [newAttempt] = await db.insert(challengeAttempts).values(attempt).returning();
    return newAttempt;
  }

  // Badge operations
  async getUserBadges(userId: string): Promise<UserBadge[]> {
    return await db
      .select()
      .from(userBadges)
      .where(eq(userBadges.userId, userId))
      .orderBy(desc(userBadges.earnedAt));
  }

  async awardBadge(userId: string, badgeType: string): Promise<UserBadge> {
    // Check if user already has this badge
    const existingBadge = await db
      .select()
      .from(userBadges)
      .where(and(eq(userBadges.userId, userId), eq(userBadges.badgeType, badgeType)))
      .limit(1);

    if (existingBadge.length > 0) {
      return existingBadge[0];
    }

    const [newBadge] = await db
      .insert(userBadges)
      .values({ userId, badgeType })
      .returning();
    return newBadge;
  }

  // Dashboard stats
  async getUserStats(userId: string): Promise<{
    completedModules: number;
    badges: number;
    studyHours: number;
    mentorSessions: number;
  }> {
    const [completedModulesResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.completed, true)));

    const [badgesResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userBadges)
      .where(eq(userBadges.userId, userId));

    const [mentorSessionsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(mentorSessions)
      .where(and(eq(mentorSessions.studentId, userId), eq(mentorSessions.status, 'completed')));

    // Calculate study hours based on completed modules (estimated)
    const progressData = await db
      .select({ progress: userProgress.progress })
      .from(userProgress)
      .where(eq(userProgress.userId, userId));
    
    const studyHours = Math.round(progressData.reduce((total, p) => total + ((p.progress || 0) / 100) * 2, 0));

    return {
      completedModules: completedModulesResult?.count || 0,
      badges: badgesResult?.count || 0,
      studyHours,
      mentorSessions: mentorSessionsResult?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
