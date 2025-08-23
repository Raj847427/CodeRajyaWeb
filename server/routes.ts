import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertModuleSchema, 
  insertMentorSchema, 
  insertForumPostSchema,
  insertForumAnswerSchema,
  insertChallengeSchema,
  insertChallengeAttemptSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard routes
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get('/api/dashboard/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.get('/api/dashboard/badges', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const badges = await storage.getUserBadges(userId);
      res.json(badges);
    } catch (error) {
      console.error("Error fetching user badges:", error);
      res.status(500).json({ message: "Failed to fetch badges" });
    }
  });

  // Module routes
  app.get('/api/modules', async (req, res) => {
    try {
      const modules = await storage.getModules();
      res.json(modules);
    } catch (error) {
      console.error("Error fetching modules:", error);
      res.status(500).json({ message: "Failed to fetch modules" });
    }
  });

  app.get('/api/modules/:id', async (req, res) => {
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

  app.post('/api/modules', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
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

  app.put('/api/modules/:id/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { progress } = req.body;
      
      if (typeof progress !== 'number' || progress < 0 || progress > 100) {
        return res.status(400).json({ message: "Progress must be a number between 0 and 100" });
      }

      const updatedProgress = await storage.updateProgress(userId, req.params.id, progress);
      res.json(updatedProgress);
    } catch (error) {
      console.error("Error updating progress:", error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // Mentor routes
  app.get('/api/mentors', async (req, res) => {
    try {
      const mentors = await storage.getMentors();
      res.json(mentors);
    } catch (error) {
      console.error("Error fetching mentors:", error);
      res.status(500).json({ message: "Failed to fetch mentors" });
    }
  });

  app.get('/api/mentors/:id', async (req, res) => {
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

  app.post('/api/mentors', isAuthenticated, async (req: any, res) => {
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

  app.get('/api/mentor-sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getMentorSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching mentor sessions:", error);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  app.post('/api/mentor-sessions', isAuthenticated, async (req: any, res) => {
    try {
      const studentId = req.user.claims.sub;
      const { mentorId, topic, scheduledAt, duration } = req.body;
      
      const session = await storage.createMentorSession({
        mentorId,
        studentId,
        topic,
        scheduledAt: new Date(scheduledAt),
        duration: duration || 60,
        status: 'scheduled',
      });
      
      res.status(201).json(session);
    } catch (error) {
      console.error("Error booking mentor session:", error);
      res.status(500).json({ message: "Failed to book session" });
    }
  });

  // Forum routes
  app.get('/api/forum/posts', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const posts = await storage.getForumPosts(limit);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching forum posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get('/api/forum/posts/:id', async (req, res) => {
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

  app.post('/api/forum/posts', isAuthenticated, async (req: any, res) => {
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

  app.post('/api/forum/posts/:id/answers', isAuthenticated, async (req: any, res) => {
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

  // Interview challenge routes
  app.get('/api/challenges', async (req, res) => {
    try {
      const challenges = await storage.getInterviewChallenges();
      res.json(challenges);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });

  app.get('/api/challenges/:id', async (req, res) => {
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

  app.post('/api/challenges', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
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

  app.get('/api/challenge-attempts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const attempts = await storage.getUserChallengeAttempts(userId);
      res.json(attempts);
    } catch (error) {
      console.error("Error fetching challenge attempts:", error);
      res.status(500).json({ message: "Failed to fetch attempts" });
    }
  });

  app.post('/api/challenge-attempts', isAuthenticated, async (req: any, res) => {
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

  // Badge routes
  app.post('/api/badges/:badgeType', isAuthenticated, async (req: any, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
