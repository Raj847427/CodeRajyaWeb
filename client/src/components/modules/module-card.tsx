import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Play, CheckCircle } from "lucide-react";

interface ModuleCardProps {
  module: {
    id: string;
    title: string;
    description?: string;
    difficulty: string;
    lessons: number;
    estimatedHours?: number;
    icon?: string;
  };
  progress?: number;
  isCompleted?: boolean;
  testId?: string;
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-orange-100 text-orange-800',
  advanced: 'bg-red-100 text-red-800',
};

const getIconComponent = (iconName?: string) => {
  // Map icon names to actual components or use default
  return BookOpen;
};

export default function ModuleCard({ 
  module, 
  progress = 0, 
  isCompleted = false,
  testId = `module-card-${module.id}`
}: ModuleCardProps) {
  const IconComponent = getIconComponent(module.icon);
  const difficultyColor = difficultyColors[module.difficulty as keyof typeof difficultyColors] || 'bg-gray-100 text-gray-800';

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" data-testid={testId}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2 bg-primary-50 rounded-lg">
            <IconComponent className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-900" data-testid={`${testId}-title`}>
              {module.title}
            </h4>
            <p className="text-sm text-gray-600" data-testid={`${testId}-lessons`}>
              {module.lessons} lessons
              {module.estimatedHours && ` • ${module.estimatedHours}h`}
            </p>
          </div>
          {isCompleted && (
            <CheckCircle className="w-5 h-5 text-green-600" data-testid={`${testId}-completed-icon`} />
          )}
        </div>
        
        {module.description && (
          <p className="text-gray-600 text-sm mb-4" data-testid={`${testId}-description`}>
            {module.description}
          </p>
        )}

        {progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-medium text-gray-900">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" data-testid={`${testId}-progress`} />
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <Badge className={difficultyColor} data-testid={`${testId}-difficulty`}>
            {module.difficulty}
          </Badge>
          <Button 
            className={`${
              isCompleted 
                ? "bg-green-600 hover:bg-green-700" 
                : progress > 0 
                  ? "bg-primary-600 hover:bg-primary-700" 
                  : "bg-primary-600 hover:bg-primary-700"
            } text-white`}
            data-testid={`${testId}-action-button`}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Review
              </>
            ) : progress > 0 ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                Continue
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Learning
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
