import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Settings, 
  Users, 
  BookOpen, 
  Code, 
  Plus,
  Edit,
  Trash2,
  Shield,
  BarChart,
  Activity
} from "lucide-react";

const moduleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  icon: z.string().optional(),
  lessons: z.number().min(1, "Lessons must be at least 1"),
  estimatedHours: z.number().min(1, "Estimated hours must be at least 1"),
});

const challengeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  solution: z.string().min(1, "Solution is required"),
  tags: z.string().optional(),
});

export default function Admin() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Redirect to login if not authenticated or not admin
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

    if (!isLoading && isAuthenticated && user?.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  // Forms
  const moduleForm = useForm({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "beginner" as const,
      icon: "",
      lessons: 1,
      estimatedHours: 1,
    },
  });

  const challengeForm = useForm({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "easy" as const,
      solution: "",
      tags: "",
    },
  });

  // Queries
  const { data: modules } = useQuery({
    queryKey: ["/api/modules"],
    enabled: !!user && user.role === 'admin',
  });

  const { data: challenges } = useQuery({
    queryKey: ["/api/challenges"],
    enabled: !!user && user.role === 'admin',
  });

  const { data: users } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: !!user && user.role === 'admin',
  });

  // Mutations
  const createModuleMutation = useMutation({
    mutationFn: async (data: z.infer<typeof moduleSchema>) => {
      await apiRequest("POST", "/api/modules", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/modules"] });
      moduleForm.reset();
      toast({
        title: "Success",
        description: "Module created successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to create module",
        variant: "destructive",
      });
    },
  });

  const createChallengeMutation = useMutation({
    mutationFn: async (data: z.infer<typeof challengeSchema>) => {
      const challengeData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
        testCases: [], // Default empty test cases
      };
      await apiRequest("POST", "/api/challenges", challengeData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/challenges"] });
      challengeForm.reset();
      toast({
        title: "Success",
        description: "Challenge created successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to create challenge",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !isAuthenticated || user?.role !== 'admin') {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>;
  }

  const handleCreateModule = (data: z.infer<typeof moduleSchema>) => {
    createModuleMutation.mutate(data);
  };

  const handleCreateChallenge = (data: z.infer<typeof challengeSchema>) => {
    createChallengeMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center" data-testid="text-admin-title">
            <Shield className="w-8 h-8 text-primary-600 mr-3" />
            Admin Panel
          </h1>
          <p className="text-gray-600" data-testid="text-admin-subtitle">
            Manage modules, challenges, users, and platform content
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5" data-testid="tabs-admin">
            <TabsTrigger value="overview" data-testid="tab-overview">
              <BarChart className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="modules" data-testid="tab-modules">
              <BookOpen className="w-4 h-4 mr-2" />
              Modules
            </TabsTrigger>
            <TabsTrigger value="challenges" data-testid="tab-challenges">
              <Code className="w-4 h-4 mr-2" />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="users" data-testid="tab-users">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card data-testid="card-total-modules">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Modules</p>
                      <p className="text-2xl font-bold text-gray-900">{modules?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-total-challenges">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Code className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Challenges</p>
                      <p className="text-2xl font-bold text-gray-900">{challenges?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-total-users">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{users?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-platform-activity">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <Activity className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Users</p>
                      <p className="text-2xl font-bold text-gray-900">24</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card data-testid="card-recent-activity">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activities and user interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">New user registration</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Module completed</p>
                      <p className="text-xs text-gray-500">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">New forum post</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card data-testid="card-create-module">
                <CardHeader>
                  <CardTitle>Create New Module</CardTitle>
                  <CardDescription>Add a new learning module to the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...moduleForm}>
                    <form onSubmit={moduleForm.handleSubmit(handleCreateModule)} className="space-y-4">
                      <FormField
                        control={moduleForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Module title" {...field} data-testid="input-module-title" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={moduleForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Module description" {...field} data-testid="textarea-module-description" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={moduleForm.control}
                        name="difficulty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Difficulty</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-module-difficulty">
                                  <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={moduleForm.control}
                          name="lessons"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lessons</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="Number of lessons" 
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  data-testid="input-module-lessons"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={moduleForm.control}
                          name="estimatedHours"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estimated Hours</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="Estimated hours" 
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  data-testid="input-module-hours"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-primary-600 hover:bg-primary-700"
                        disabled={createModuleMutation.isPending}
                        data-testid="button-create-module"
                      >
                        {createModuleMutation.isPending ? "Creating..." : "Create Module"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card data-testid="card-existing-modules">
                <CardHeader>
                  <CardTitle>Existing Modules</CardTitle>
                  <CardDescription>Manage and edit existing learning modules</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {modules?.map((module: any) => (
                      <div key={module.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900" data-testid={`text-module-${module.id}`}>
                              {module.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                            <div className="flex space-x-2 mt-2">
                              <Badge variant="secondary">{module.difficulty}</Badge>
                              <Badge variant="outline">{module.lessons} lessons</Badge>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" data-testid={`button-edit-${module.id}`}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" data-testid={`button-delete-${module.id}`}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-8">No modules found</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card data-testid="card-create-challenge">
                <CardHeader>
                  <CardTitle>Create New Challenge</CardTitle>
                  <CardDescription>Add a new coding challenge for interview preparation</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...challengeForm}>
                    <form onSubmit={challengeForm.handleSubmit(handleCreateChallenge)} className="space-y-4">
                      <FormField
                        control={challengeForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Challenge title" {...field} data-testid="input-challenge-title" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={challengeForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Challenge description" {...field} data-testid="textarea-challenge-description" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={challengeForm.control}
                        name="difficulty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Difficulty</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-challenge-difficulty">
                                  <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={challengeForm.control}
                        name="solution"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Solution</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Solution code" {...field} data-testid="textarea-challenge-solution" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={challengeForm.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tags (comma-separated)</FormLabel>
                            <FormControl>
                              <Input placeholder="array, two-pointer, hash-table" {...field} data-testid="input-challenge-tags" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full bg-primary-600 hover:bg-primary-700"
                        disabled={createChallengeMutation.isPending}
                        data-testid="button-create-challenge"
                      >
                        {createChallengeMutation.isPending ? "Creating..." : "Create Challenge"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card data-testid="card-existing-challenges">
                <CardHeader>
                  <CardTitle>Existing Challenges</CardTitle>
                  <CardDescription>Manage and edit coding challenges</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {challenges?.map((challenge: any) => (
                      <div key={challenge.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900" data-testid={`text-challenge-${challenge.id}`}>
                              {challenge.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                            <div className="flex space-x-2 mt-2">
                              <Badge variant="secondary">{challenge.difficulty}</Badge>
                              {challenge.tags && challenge.tags.slice(0, 2).map((tag: string) => (
                                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" data-testid={`button-edit-challenge-${challenge.id}`}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" data-testid={`button-delete-challenge-${challenge.id}`}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-8">No challenges found</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card data-testid="card-user-management">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
                  <p className="text-gray-600">User management features will be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card data-testid="card-platform-settings">
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Configure platform-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Platform Settings</h3>
                  <p className="text-gray-600">Settings configuration will be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
