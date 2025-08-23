import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  ThumbsUp, 
  Search, 
  Plus, 
  CheckCircle,
  Clock,
  TrendingUp,
  HelpCircle
} from "lucide-react";

export default function Forum() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

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

  const { data: forumPosts, isLoading: postsLoading } = useQuery({
    queryKey: ["/api/forum/posts"],
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

  const filteredPosts = forumPosts?.filter((post: any) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

  const getTagColor = (tag: string) => {
    const colors = {
      'javascript': 'bg-yellow-100 text-yellow-800',
      'react': 'bg-blue-100 text-blue-800',
      'node.js': 'bg-green-100 text-green-800',
      'java': 'bg-orange-100 text-orange-800',
      'python': 'bg-purple-100 text-purple-800',
      'dsa': 'bg-red-100 text-red-800',
      'system-design': 'bg-indigo-100 text-indigo-800',
    };
    return colors[tag.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="text-forum-title">
                Community Forum
              </h1>
              <p className="text-gray-600" data-testid="text-forum-subtitle">
                Ask questions, share knowledge, and help fellow developers
              </p>
            </div>
            <Button 
              className="mt-4 sm:mt-0 bg-primary-600 hover:bg-primary-700 text-white"
              data-testid="button-ask-question"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ask Question
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Search and Filters */}
            <Card data-testid="card-search-filter">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        data-testid="input-search-posts"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Latest</Button>
                    <Button variant="outline" size="sm">Popular</Button>
                    <Button variant="outline" size="sm">Unanswered</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Forum Posts */}
            <div className="space-y-4">
              {postsLoading ? (
                // Loading skeleton
                [...Array(5)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded mb-3"></div>
                          <div className="flex space-x-4">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : filteredPosts.length === 0 ? (
                <Card className="text-center py-12" data-testid="card-no-posts">
                  <CardContent>
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No posts found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm 
                        ? "Try adjusting your search criteria" 
                        : "Be the first to ask a question!"
                      }
                    </p>
                    <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Ask Question
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredPosts.map((post: any) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow" data-testid={`card-post-${post.id}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={post.author.profileImageUrl} />
                          <AvatarFallback>{getInitials(post.author.firstName, post.author.lastName)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 cursor-pointer" data-testid={`text-post-title-${post.id}`}>
                              {post.title}
                            </h3>
                            {post.solved && (
                              <CheckCircle className="w-4 h-4 text-green-600" data-testid={`icon-solved-${post.id}`} />
                            )}
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2" data-testid={`text-post-content-${post.id}`}>
                            {post.content}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <ThumbsUp className="w-4 h-4" />
                                <span data-testid={`text-upvotes-${post.id}`}>{post.upvotes}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MessageSquare className="w-4 h-4" />
                                <span data-testid={`text-answers-${post.id}`}>{post.answersCount} answers</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            {post.tags && (
                              <div className="flex space-x-1">
                                {post.tags.slice(0, 3).map((tag: string) => (
                                  <Badge key={tag} className={`text-xs ${getTagColor(tag)}`}>
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-3 text-xs text-gray-500">
                            by <span className="font-medium" data-testid={`text-author-${post.id}`}>
                              {post.author.firstName} {post.author.lastName}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Forum Stats */}
            <Card data-testid="card-forum-stats">
              <CardHeader>
                <CardTitle className="text-lg">Forum Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Posts</span>
                    <span className="font-semibold" data-testid="text-total-posts">{forumPosts?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Solved Posts</span>
                    <span className="font-semibold text-green-600" data-testid="text-solved-posts">
                      {forumPosts?.filter((p: any) => p.solved).length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Users</span>
                    <span className="font-semibold" data-testid="text-active-users">42</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card data-testid="card-popular-tags">
              <CardHeader>
                <CardTitle className="text-lg">Popular Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['JavaScript', 'React', 'Node.js', 'Java', 'Python', 'DSA', 'System Design'].map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-primary-100 hover:text-primary-700"
                      data-testid={`tag-${tag.toLowerCase().replace('.', '')}`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card data-testid="card-recent-activity">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">New answer</span>
                    </div>
                    <p className="text-gray-600 text-xs">React Hook Dependencies</p>
                    <p className="text-gray-400 text-xs">2 minutes ago</p>
                  </div>
                  
                  <div className="text-sm">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">New question</span>
                    </div>
                    <p className="text-gray-600 text-xs">Binary Tree Traversal</p>
                    <p className="text-gray-400 text-xs">15 minutes ago</p>
                  </div>
                  
                  <div className="text-sm">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium">Question solved</span>
                    </div>
                    <p className="text-gray-600 text-xs">JWT Authentication</p>
                    <p className="text-gray-400 text-xs">1 hour ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card data-testid="card-forum-actions">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white" 
                  data-testid="button-ask-question-sidebar"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Ask Question
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  data-testid="button-browse-unanswered"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Browse Unanswered
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  data-testid="button-trending-posts"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trending Posts
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
