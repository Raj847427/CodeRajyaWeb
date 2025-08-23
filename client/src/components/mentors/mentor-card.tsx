import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Calendar, DollarSign } from "lucide-react";

interface MentorCardProps {
  mentor: {
    id: string;
    userId: string;
    expertise?: string[];
    bio?: string;
    hourlyRate?: number;
    rating: number;
    totalSessions: number;
    isAvailable: boolean;
    user: {
      firstName?: string;
      lastName?: string;
      email?: string;
      profileImageUrl?: string;
    };
  };
  testId?: string;
}

export default function MentorCard({ 
  mentor,
  testId = `mentor-card-${mentor.id}`
}: MentorCardProps) {
  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'M';
  };

  const formatRating = (rating: number) => {
    return rating > 0 ? (rating / 20).toFixed(1) : '0.0'; // Convert from 0-100 to 0-5 scale
  };

  return (
    <Card className="hover:shadow-md transition-shadow" data-testid={testId}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={mentor.user.profileImageUrl} />
            <AvatarFallback>{getInitials(mentor.user.firstName, mentor.user.lastName)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900" data-testid={`${testId}-name`}>
                {mentor.user.firstName} {mentor.user.lastName}
              </h3>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-700" data-testid={`${testId}-rating`}>
                  {formatRating(mentor.rating)}
                </span>
              </div>
            </div>
            
            {mentor.bio && (
              <p className="text-gray-600 text-sm mb-3" data-testid={`${testId}-bio`}>
                {mentor.bio}
              </p>
            )}
            
            {mentor.expertise && mentor.expertise.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {mentor.expertise.slice(0, 4).map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs"
                    data-testid={`${testId}-skill-${index}`}
                  >
                    {skill}
                  </Badge>
                ))}
                {mentor.expertise.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{mentor.expertise.length - 4} more
                  </Badge>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span data-testid={`${testId}-sessions`}>
                  {mentor.totalSessions} sessions
                </span>
              </div>
              {mentor.hourlyRate && (
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4" />
                  <span data-testid={`${testId}-rate`}>
                    ${mentor.hourlyRate}/hr
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button 
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white" 
                disabled={!mentor.isAvailable}
                data-testid={`${testId}-book-button`}
              >
                {mentor.isAvailable ? 'Book Session' : 'Unavailable'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                data-testid={`${testId}-view-button`}
              >
                View Profile
              </Button>
            </div>
          </div>
        </div>
        
        {!mentor.isAvailable && (
          <div className="mt-3 text-center">
            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
              Currently Unavailable
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
