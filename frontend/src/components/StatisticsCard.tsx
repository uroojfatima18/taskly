interface StatisticsCardProps {
  icon: 'tasks' | 'completed' | 'pending' | 'streak';
  label: string;
  value: number | string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'primary' | 'success' | 'accent' | 'neutral';
}

const iconMap = {
  tasks: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  ),
  completed: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  pending: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  streak: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  ),
};

const colorMap = {
  primary: 'bg-gradient-to-br from-primary-50 to-primary-100 text-primary-700 border-primary-200',
  success: 'bg-gradient-to-br from-success-50 to-success-100 text-success-700 border-success-200',
  accent: 'bg-gradient-to-br from-accent-50 to-accent-100 text-accent-700 border-accent-200',
  neutral: 'bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-700 border-neutral-300',
};

const iconBgMap = {
  primary: 'bg-gradient-to-br from-primary-100 to-primary-200 text-primary-600',
  success: 'bg-gradient-to-br from-success-100 to-success-200 text-success-600',
  accent: 'bg-gradient-to-br from-accent-100 to-accent-200 text-accent-600',
  neutral: 'bg-gradient-to-br from-neutral-200 to-neutral-300 text-neutral-400',
};

export function StatisticsCard({
  icon,
  label,
  value,
  trend,
  variant = 'primary',
}: StatisticsCardProps) {
  return (
    <div className={`card-elevated border ${colorMap[variant]} group cursor-default hover-lift`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${iconBgMap[variant]} transition-all duration-300 group-hover:scale-110 shadow-sm`}>
          <div className="text-xl">
            {iconMap[icon]}
          </div>
        </div>
        {trend && (
          <div
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              trend.isPositive
                ? 'bg-success-100 text-success-700'
                : 'bg-neutral-100 text-neutral-700'
            }`}
          >
            {trend.isPositive ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>

      <p className="text-sm font-medium text-neutral-400 mb-1">{label}</p>
      <p className="text-3xl font-bold text-neutral-100">{value}</p>
    </div>
  );
}
