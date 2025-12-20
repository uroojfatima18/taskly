'use client';

import { useMemo } from 'react';

interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface AnalyticsDashboardProps {
  tasks: Task[];
}

export function AnalyticsDashboard({ tasks }: AnalyticsDashboardProps) {
  const analytics = useMemo(() => {
    const completedCount = tasks.filter((t) => t.completed).length;
    const pendingCount = tasks.filter((t) => !t.completed).length;
    const completionRate =
      tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const tasksThisWeek = tasks.filter(
      (t) => new Date(t.created_at) >= weekAgo
    ).length;

    return {
      total: tasks.length,
      completed: completedCount,
      pending: pendingCount,
      completionRate,
      tasksThisWeek,
    };
  }, [tasks]);

  const progressPercentage = analytics.completionRate;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className="space-y-6 mb-8">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="glass-card p-6 rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-dark-surface/20">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-dark-surface/20 text-white">
              Total
            </span>
          </div>
          <p className="text-sm font-medium text-white/80 mb-1">Total Tasks</p>
          <p className="text-4xl font-bold text-white">{analytics.total}</p>
        </div>

        {/* Completed Tasks */}
        <div className="glass-card p-6 rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-dark-surface/20">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-dark-surface/20 text-white">
              Done
            </span>
          </div>
          <p className="text-sm font-medium text-white/80 mb-1">Completed</p>
          <p className="text-4xl font-bold text-white">{analytics.completed}</p>
        </div>

        {/* Pending Tasks */}
        <div className="glass-card p-6 rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-dark-surface/20">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-dark-surface/20 text-white">
              TODO
            </span>
          </div>
          <p className="text-sm font-medium text-white/80 mb-1">Pending</p>
          <p className="text-4xl font-bold text-white">{analytics.pending}</p>
        </div>

        {/* This Week */}
        <div className="glass-card p-6 rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-dark-surface/20">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-dark-surface/20 text-white">
              Week
            </span>
          </div>
          <p className="text-sm font-medium text-white/80 mb-1">
            Created This Week
          </p>
          <p className="text-4xl font-bold text-white">
            {analytics.tasksThisWeek}
          </p>
        </div>
      </div>

      {/* Completion Rate Progress */}
      <div className="glass-card p-8 rounded-2xl border border-white/20">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-semibold text-white">Completion Rate</h3>
          <span className="text-3xl font-bold text-white">
            {analytics.completionRate}%
          </span>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="white"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
                style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl font-bold text-white">
                  {analytics.completionRate}%
                </p>
                <p className="text-sm font-medium text-white/70 mt-2">
                  of tasks done
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white/90">Overall Progress</span>
            <span className="text-sm font-semibold text-white">
              {analytics.completed} / {analytics.total}
            </span>
          </div>
          <div className="h-3 bg-dark-surface/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-dark-surface rounded-full transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
