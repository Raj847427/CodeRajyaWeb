import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MentorCard from "@/components/mentors/mentor-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Star } from "lucide-react";
import { useState } from "react";

export default function Mentors() {
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

  const { data: mentors, isLoading: mentorsLoading } = useQuery({
    queryKey: ["/api/mentors"],
    enabled: !!user,
  });

  const { data: mentorSessions } = useQuery({
    queryKey: ["/api/mentor-sessions"],
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

  const filteredMentors = mentors?.filter((mentor: any) => {
    const fullName = `${mentor.user.firstName} ${mentor.user.lastName}`.toLowerCase();
    const expertise = mentor.expertise?.join(' ').toLowerCase() || '';
    const searchLower = searchTerm.toLowerCase();
    
    return fullName.includes(searchLower) || 
           expertise.includes(searchLower) ||
           mentor.bio?.toLowerCase().includes(searchLower);
  }) || [];

  const upcomingSessions = mentorSessions?.filter((session: any) => 
    new Date(session.scheduledAt) > new Date() && session.status === 'scheduled'
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="text-mentors-title">
            Expert Mentors
          </h1>
          <p className="text-gray-600" data-testid="text-mentors-subtitle">
            Connect with industry professionals for personalized guidance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Search */}
            <Card data-testid="card-search">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>Find a Mentor</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Search by name, expertise, or bio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                  data-testid="input-search-mentors"
                />
              </CardContent>
            </Card>

            {/* Mentors Grid */}
            {mentorsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-6 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredMentors.length === 0 ? (
              <Card className="text-center py-12" data-testid="card-no-mentors">
                <CardContent>
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No mentors found
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm 
                      ? "Try adjusting your search criteria" 
                      : "No mentors are available yet"
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMentors.map((mentor: any) => (
                  <MentorCard key={mentor.id} mentor={mentor} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Upcoming Sessions */}
            <Card data-testid="card-upcoming-sessions">
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingSessions.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No upcoming sessions</p>
                    <p className="text-xs text-gray-400">Book a session with a mentor</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingSessions.slice(0, 3).map((session: any) => (
                      <div key={session.id} className="border-l-4 border-primary-600 pl-4">
                        <h4 className="font-medium text-gray-900" data-testid={`text-session-${session.id}`}>
                          Session with {session.mentor.user.firstName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {new Date(session.scheduledAt).toLocaleString()}
                        </p>
                        {session.topic && (
                          <p className="text-sm text-gray-500">{session.topic}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mentor Stats */}
            <Card data-testid="card-mentor-stats">
              <CardHeader>
                <CardTitle>Platform Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Available Mentors</span>
                    <span className="font-semibold text-gray-900" data-testid="text-available-mentors">
                      {mentors?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Your Sessions</span>
                    <span className="font-semibold text-gray-900" data-testid="text-user-sessions">
                      {mentorSessions?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Upcoming</span>
                    <span className="font-semibold text-gray-900" data-testid="text-upcoming-count">
                      {upcomingSessions.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Popular Expertise */}
            <Card data-testid="card-popular-expertise">
              <CardHeader>
                <CardTitle>Popular Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Node.js', 'Java', 'Python', 'System Design', 'DSA'].map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
