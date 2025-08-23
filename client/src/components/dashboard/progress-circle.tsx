interface ProgressCircleProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  testId?: string;
}

export default function ProgressCircle({ 
  progress, 
  size = 128, 
  strokeWidth = 3,
  testId = "progress-circle"
}: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`;

  return (
    <div className="relative inline-flex items-center justify-center" data-testid={testId}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1E40AF"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span 
          className="text-2xl font-bold text-gray-900" 
          data-testid={`${testId}-percentage`}
        >
          {progress}%
        </span>
      </div>
    </div>
  );
}
