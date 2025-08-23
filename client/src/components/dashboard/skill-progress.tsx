interface SkillProgressProps {
  skill: string;
  progress: number;
  color: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
  testId?: string;
}

const colorClasses = {
  blue: 'bg-blue-600',
  green: 'bg-green-600',
  purple: 'bg-purple-600',
  red: 'bg-red-600',
  yellow: 'bg-yellow-600',
};

export default function SkillProgress({ 
  skill, 
  progress, 
  color,
  testId = `skill-${skill.toLowerCase()}`
}: SkillProgressProps) {
  return (
    <div data-testid={testId}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700" data-testid={`${testId}-name`}>
          {skill}
        </span>
        <span className="text-sm text-gray-500" data-testid={`${testId}-percentage`}>
          {progress}%
        </span>
      </div>
      <div className="bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ease-in-out ${colorClasses[color]}`}
          style={{ width: `${progress}%` }}
          data-testid={`${testId}-bar`}
        />
      </div>
    </div>
  );
}
