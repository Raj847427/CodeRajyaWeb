import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import StatsCard from "@/components/dashboard/stats-card";
import ProgressCircle from "@/components/dashboard/progress-circle";
import SkillProgress from "@/components/dashboard/skill-progress";
import ModuleCard from "@/components/modules/module-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  Users, 
  Code, 
  Mic,
  Medal,
  Star,
  Flame,
  Search,
  HelpCircle,
  CalendarPlus
} from "lucide-react";

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch dashboard data
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    enabled: !!user,
  });

  const { data: progress = [], isLoading: progressLoading } = useQuery({
    queryKey: ["/api/dashboard/progress"],
    enabled: !!user,
  });

  const { data: badges = [], isLoading: badgesLoading } = useQuery({
    queryKey: ["/api/dashboard/badges"],
    enabled: !!user,
  });

  const { data: modules = [] } = useQuery({
    queryKey: ["/api/modules"],
  });

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>;
  }

  // Calculate overall progress
  const overallProgress = Array.isArray(progress) && progress.length > 0 
    ? Math.round(progress.reduce((acc: number, p: any) => acc + p.progress, 0) / progress.length)
    : 0;

  const currentModules = Array.isArray(progress) ? progress.filter((p: any) => p.progress > 0 && p.progress < 100) : [];
  const recentBadges = Array.isArray(badges) ? badges.slice(0, 3) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2" data-testid="text-welcome">
            Welcome back, <span className="text-primary-600">{(user as any)?.firstName || 'Coder'}</span>! 👑
          </h2>
          <p className="text-gray-600" data-testid="text-welcome-subtitle">
            Continue your journey to become a coding king.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Modules Completed"
            value={(stats as any)?.completedModules || 0}
            icon={BookOpen}
            color="primary"
            isLoading={statsLoading}
            testId="card-completed-modules"
          />
          <StatsCard
            title="Badges Earned"
            value={(stats as any)?.badges || 0}
            icon={Trophy}
            color="success"
            isLoading={statsLoading}
            testId="card-badges"
          />
          <StatsCard
            title="Study Hours"
            value={(stats as any)?.studyHours || 0}
            icon={Clock}
            color="accent"
            isLoading={statsLoading}
            testId="card-study-hours"
          />
          <StatsCard
            title="Mentor Sessions"
            value={(stats as any)?.mentorSessions || 0}
            icon={Users}
            color="purple"
            isLoading={statsLoading}
            testId="card-mentor-sessions"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Continue Learning Section */}
            {currentModules.length > 0 && (
              <Card data-testid="card-continue-learning">
                <CardHeader>
                  <CardTitle>Continue Learning</CardTitle>
                  <CardDescription>Pick up where you left off</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentModules.slice(0, 2).map((progress: any) => (
                    <div key={progress.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-primary-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-medium text-gray-900" data-testid={`text-module-title-${progress.moduleId}`}>
                          Module Progress
                        </h4>
                        <p className="text-sm text-gray-600">
                          {progress.progress}% complete
                        </p>
                        <div className="mt-2">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary-600 h-2 rounded-full" 
                              style={{ width: `${progress.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <Button 
                        className="bg-primary-600 text-white hover:bg-primary-700" 
                        data-testid={`button-continue-${progress.moduleId}`}
                      >
                        Continue
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Skill Modules Grid */}
            <Card data-testid="card-explore-modules">
              <CardHeader>
                <CardTitle>Explore Modules</CardTitle>
                <CardDescription>Master new skills at your own pace</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.isArray(modules) ? modules.slice(0, 4).map((module: any) => (
                    <ModuleCard key={module.id} module={module} />
                  )) : null}
                </div>
              </CardContent>
            </Card>

            {/* Interview Prep Section */}
            <Card data-testid="card-interview-prep">
              <CardHeader>
                <CardTitle>Interview Preparation</CardTitle>
                <CardDescription>Practice coding problems and mock interviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Code className="text-accent-600 text-2xl" />
                      <div>
                        <h4 className="font-semibold text-gray-900" data-testid="text-daily-challenge">
                          Daily Challenge
                        </h4>
                        <p className="text-sm text-gray-600">Two Sum Problem</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Solve today's coding challenge and improve your problem-solving skills.
                    </p>
                    <Button 
                      className="w-full bg-accent-600 text-white hover:bg-accent-700"
                      data-testid="button-solve-challenge"
                    >
                      Solve Now
                    </Button>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Mic className="text-success-600 text-2xl" />
                      <div>
                        <h4 className="font-semibold text-gray-900" data-testid="text-mock-interview">
                          Mock Interview
                        </h4>
                        <p className="text-sm text-gray-600">Technical Round</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Practice with AI interviewer or book a session with mentors.
                    </p>
                    <Button 
                      className="w-full bg-success-600 text-white hover:bg-success-700"
                      data-testid="button-start-interview"
                    >
                      Start Interview
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Progress Overview */}
            <Card data-testid="card-progress-overview">
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <ProgressCircle progress={overallProgress} />
                  <p className="text-gray-600 mt-2">Overall Progress</p>
                </div>

                <div className="space-y-4">
                  <SkillProgress skill="Java" progress={80} color="blue" />
                  <SkillProgress skill="React" progress={65} color="green" />
                  <SkillProgress skill="DSA" progress={45} color="purple" />
                  <SkillProgress skill="System Design" progress={30} color="red" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Badges */}
            <Card data-testid="card-recent-badges">
              <CardHeader>
                <CardTitle>Recent Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentBadges.map((badge: any, index: number) => (
                    <div key={badge.id || index} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Medal className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900" data-testid={`text-badge-${badge.badgeType}`}>
                          {badge.badgeType.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(badge.earnedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-4">
                      <Trophy className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No badges yet</p>
                      <p className="text-xs text-gray-400">Complete modules to earn badges</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card data-testid="card-quick-actions">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-primary-600 text-white hover:bg-primary-700 flex items-center justify-center space-x-2"
                  data-testid="button-find-mentor"
                >
                  <Search className="w-4 h-4" />
                  <span>Find a Mentor</span>
                </Button>
                <Button 
                  className="w-full bg-accent-600 text-white hover:bg-accent-700 flex items-center justify-center space-x-2"
                  data-testid="button-ask-question"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Ask a Question</span>
                </Button>
                <Button 
                  className="w-full bg-success-600 text-white hover:bg-success-700 flex items-center justify-center space-x-2"
                  data-testid="button-schedule-study"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>Schedule Study</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
