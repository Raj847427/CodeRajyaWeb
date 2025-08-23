import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'primary' | 'success' | 'accent' | 'purple';
  isLoading?: boolean;
  testId?: string;
}

const colorClasses = {
  primary: 'bg-primary-50 text-primary-600',
  success: 'bg-success-50 text-success-600',
  accent: 'bg-accent-50 text-accent-600',
  purple: 'bg-purple-50 text-purple-600',
};

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  isLoading = false,
  testId 
}: StatsCardProps) {
  if (isLoading) {
    return (
      <Card className="animate-pulse" data-testid={testId}>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-gray-200 rounded-lg">
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
            </div>
            <div className="ml-4 flex-1">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow" data-testid={testId}>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600" data-testid={`${testId}-title`}>
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900" data-testid={`${testId}-value`}>
              {value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
