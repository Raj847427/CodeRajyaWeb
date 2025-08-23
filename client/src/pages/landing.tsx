import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Code, Users, Trophy, BookOpen, MessageSquare } from "lucide-react";
import Footer from "@/components/layout/footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600 flex items-center" data-testid="logo">
                <Crown className="w-8 h-8 text-accent-500 mr-2" />
                CodeRajya
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-login"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-get-started"
                className="bg-primary-600 hover:bg-primary-700"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6" data-testid="text-hero-title">
            Jahan Har Coder Banega <span className="text-primary-600">King</span> 👑
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto" data-testid="text-hero-description">
            Master coding skills with expert mentors, comprehensive learning modules, and a supportive community. 
            Build your path to becoming a coding king.
          </p>
          <Button 
            size="lg" 
            onClick={() => window.location.href = "/api/login"}
            data-testid="button-start-learning"
            className="bg-primary-600 hover:bg-primary-700 text-lg px-8 py-3"
          >
            Start Your Journey
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="text-features-title">
              Everything You Need to Excel
            </h2>
            <p className="text-gray-600" data-testid="text-features-description">
              Comprehensive learning platform designed for serious developers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow" data-testid="card-feature-modules">
              <CardHeader>
                <BookOpen className="w-12 h-12 text-primary-600 mb-4" />
                <CardTitle>Skill Modules</CardTitle>
                <CardDescription>
                  Master Java, DSA, MERN Stack, OOP, and System Design with structured learning paths
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow" data-testid="card-feature-mentors">
              <CardHeader>
                <Users className="w-12 h-12 text-success-600 mb-4" />
                <CardTitle>Expert Mentors</CardTitle>
                <CardDescription>
                  Connect with industry professionals for 1-on-1 guidance and career advice
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow" data-testid="card-feature-interview">
              <CardHeader>
                <Code className="w-12 h-12 text-accent-600 mb-4" />
                <CardTitle>Interview Prep</CardTitle>
                <CardDescription>
                  Practice coding challenges, mock interviews, and real-world problems
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow" data-testid="card-feature-community">
              <CardHeader>
                <MessageSquare className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>Community Forum</CardTitle>
                <CardDescription>
                  Get help, share knowledge, and collaborate with fellow developers
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow" data-testid="card-feature-progress">
              <CardHeader>
                <Trophy className="w-12 h-12 text-yellow-600 mb-4" />
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>
                  Visual skill graphs, badges, and achievements to track your growth
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow" data-testid="card-feature-practice">
              <CardHeader>
                <Crown className="w-12 h-12 text-indigo-600 mb-4" />
                <CardTitle>Hands-on Practice</CardTitle>
                <CardDescription>
                  Code challenges, quizzes, and real projects to solidify your learning
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4" data-testid="text-cta-title">
            Ready to Become a Coding King?
          </h2>
          <p className="text-primary-100 mb-8 text-lg" data-testid="text-cta-description">
            Join thousands of developers who have transformed their careers with CodeRajya
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => window.location.href = "/api/login"}
            data-testid="button-join-now"
            className="bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3"
          >
            Join CodeRajya Now
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
