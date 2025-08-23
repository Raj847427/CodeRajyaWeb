import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Code, 
  Play, 
  Trophy, 
  Clock, 
  Target, 
  Zap,
  Star,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useState } from "react";

export default function InterviewPrep() {
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

  const { data: challenges, isLoading: challengesLoading } = useQuery({
    queryKey: ["/api/challenges"],
    enabled: !!user,
  });

  const { data: attempts } = useQuery({
    queryKey: ["/api/challenge-attempts"],
    enabled: !!user,
  });

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttemptForChallenge = (challengeId: string) => {
    return attempts?.find((attempt: any) => attempt.challengeId === challengeId);
  };

  const solvedChallenges = attempts?.filter((attempt: any) => attempt.passed).length || 0;
  const totalChallenges = challenges?.length || 0;
  const successRate = totalChallenges > 0 ? Math.round((solvedChallenges / totalChallenges) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="text-interview-prep-title">
            Interview Preparation
          </h1>
          <p className="text-gray-600" data-testid="text-interview-prep-subtitle">
            Practice coding challenges and prepare for technical interviews
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card data-testid="card-stat-solved">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Problems Solved</p>
                  <p className="text-2xl font-bold text-gray-900">{solvedChallenges}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-total">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Code className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Problems</p>
                  <p className="text-2xl font-bold text-gray-900">{totalChallenges}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-success">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <Target className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{successRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-streak">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Current Streak</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Daily Challenge */}
            <Card data-testid="card-daily-challenge" className="border-2 border-accent-200 bg-accent-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-accent-600" />
                      <span>Daily Challenge</span>
                    </CardTitle>
                    <CardDescription>Solve today's featured problem</CardDescription>
                  </div>
                  <Badge className="bg-accent-600 text-white">Featured</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900" data-testid="text-daily-challenge-title">
                      Two Sum Problem
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Given an array of integers and a target sum, return indices of two numbers that add up to the target.
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className={getDifficultyColor('easy')}>Easy</Badge>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>~15 mins</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-accent-600 hover:bg-accent-700 text-white" 
                    data-testid="button-solve-daily"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Solve Challenge
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* All Challenges */}
            <Card data-testid="card-all-challenges">
              <CardHeader>
                <CardTitle>All Challenges</CardTitle>
                <CardDescription>Browse and solve coding problems by difficulty</CardDescription>
              </CardHeader>
              <CardContent>
                {challengesLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse border rounded-lg p-4">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-3"></div>
                        <div className="flex justify-between">
                          <div className="h-6 bg-gray-200 rounded w-20"></div>
                          <div className="h-8 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : challenges?.length === 0 ? (
                  <div className="text-center py-8">
                    <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No challenges available yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {challenges?.map((challenge: any) => {
                      const attempt = getAttemptForChallenge(challenge.id);
                      const isSolved = attempt?.passed || false;
                      
                      return (
                        <div 
                          key={challenge.id} 
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                          data-testid={`card-challenge-${challenge.id}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                {isSolved && <CheckCircle className="w-4 h-4 text-green-600" />}
                                <h3 className="font-semibold text-gray-900" data-testid={`text-challenge-title-${challenge.id}`}>
                                  {challenge.title}
                                </h3>
                              </div>
                              <p className="text-sm text-gray-600 mb-3" data-testid={`text-challenge-description-${challenge.id}`}>
                                {challenge.description}
                              </p>
                              <div className="flex items-center space-x-4">
                                <Badge className={getDifficultyColor(challenge.difficulty)}>
                                  {challenge.difficulty}
                                </Badge>
                                {challenge.tags && (
                                  <div className="flex space-x-1">
                                    {challenge.tags.slice(0, 3).map((tag: string) => (
                                      <Badge key={tag} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button 
                              variant={isSolved ? "outline" : "default"}
                              className={isSolved ? "" : "bg-primary-600 hover:bg-primary-700"}
                              data-testid={`button-solve-${challenge.id}`}
                            >
                              {isSolved ? "Review" : "Solve"}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Overall Progress</span>
                      <span className="text-sm font-medium">{successRate}%</span>
                    </div>
                    <Progress value={successRate} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600" data-testid="text-solved-count">
                        {solvedChallenges}
                      </div>
                      <p className="text-xs text-gray-600">Solved</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-600" data-testid="text-attempted-count">
                        {attempts?.length || 0}
                      </div>
                      <p className="text-xs text-gray-600">Attempted</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Problem Categories */}
            <Card data-testid="card-categories">
              <CardHeader>
                <CardTitle>Problem Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Arrays & Strings', count: 15, color: 'blue' },
                    { name: 'Dynamic Programming', count: 12, color: 'purple' },
                    { name: 'Trees & Graphs', count: 10, color: 'green' },
                    { name: 'System Design', count: 8, color: 'orange' },
                  ].map((category) => (
                    <div key={category.name} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700" data-testid={`text-category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        {category.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card data-testid="card-interview-actions">
              <CardHeader>
                <CardTitle>Interview Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-success-600 hover:bg-success-700 text-white flex items-center justify-center space-x-2"
                  data-testid="button-mock-interview"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Mock Interview</span>
                </Button>
                <Button 
                  variant="outline"
                  className="w-full flex items-center justify-center space-x-2"
                  data-testid="button-random-problem"
                >
                  <Zap className="w-4 h-4" />
                  <span>Random Problem</span>
                </Button>
                <Button 
                  variant="outline"
                  className="w-full flex items-center justify-center space-x-2"
                  data-testid="button-study-plan"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Create Study Plan</span>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card data-testid="card-recent-activity">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {attempts?.length === 0 ? (
                  <div className="text-center py-4">
                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No attempts yet</p>
                    <p className="text-xs text-gray-400">Solve your first problem!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {attempts?.slice(0, 5).map((attempt: any, index: number) => (
                      <div key={attempt.id || index} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${attempt.passed ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900" data-testid={`text-attempt-${attempt.id}`}>
                            Challenge Attempt
                          </p>
                          <p className="text-xs text-gray-500">
                            {attempt.passed ? 'Solved' : 'Failed'} • {new Date(attempt.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
