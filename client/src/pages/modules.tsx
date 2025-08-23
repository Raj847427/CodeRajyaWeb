import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ModuleCard from "@/components/modules/module-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen } from "lucide-react";
import { useState } from "react";

export default function Modules() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [difficulty, setDifficulty] = useState<string>("all");

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

  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: ["/api/modules"],
    enabled: !!user,
  });

  const { data: userProgress } = useQuery({
    queryKey: ["/api/dashboard/progress"],
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

  const filteredModules = modules?.filter((module: any) => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficulty === "all" || module.difficulty === difficulty;
    return matchesSearch && matchesDifficulty;
  }) || [];

  const getModuleProgress = (moduleId: string) => {
    return userProgress?.find((p: any) => p.moduleId === moduleId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="text-modules-title">
            Learning Modules
          </h1>
          <p className="text-gray-600" data-testid="text-modules-subtitle">
            Master new skills with our comprehensive learning modules
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8" data-testid="card-filters">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Find Modules</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search modules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                  data-testid="input-search-modules"
                />
              </div>
              <div className="w-full md:w-48">
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger data-testid="select-difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modules Grid */}
        {modulesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredModules.length === 0 ? (
          <Card className="text-center py-12" data-testid="card-no-modules">
            <CardContent>
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No modules found
              </h3>
              <p className="text-gray-600">
                {searchTerm || difficulty !== "all" 
                  ? "Try adjusting your search criteria" 
                  : "No learning modules are available yet"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((module: any) => {
              const progress = getModuleProgress(module.id);
              return (
                <ModuleCard 
                  key={module.id} 
                  module={module}
                  progress={progress?.progress || 0}
                  isCompleted={progress?.completed || false}
                />
              );
            })}
          </div>
        )}

        {/* Learning Stats */}
        <Card className="mt-12" data-testid="card-learning-stats">
          <CardHeader>
            <CardTitle>Your Learning Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary-600" data-testid="text-total-modules">
                  {modules?.length || 0}
                </div>
                <p className="text-gray-600">Total Modules</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-success-600" data-testid="text-completed-modules">
                  {userProgress?.filter((p: any) => p.completed).length || 0}
                </div>
                <p className="text-gray-600">Completed</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent-600" data-testid="text-in-progress-modules">
                  {userProgress?.filter((p: any) => p.progress > 0 && !p.completed).length || 0}
                </div>
                <p className="text-gray-600">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
