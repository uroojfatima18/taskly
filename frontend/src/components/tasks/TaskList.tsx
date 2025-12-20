// T021: TaskList component with empty state handling
// UI-ENHANCED: Added skeleton loaders, improved empty state, better visual feedback

'use client';

import { Task, TaskUpdate } from '@/types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  onToggle: (id: number) => Promise<void>;
  onUpdate: (id: number, data: TaskUpdate) => Promise<void>;
  onDelete: (id: number) => void;
}

// Skeleton component for loading state
function TaskSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border-2 border-neutral-100 bg-dark-surface p-4">
      <div className="flex items-start gap-4">
        {/* Checkbox skeleton */}
        <div className="h-8 w-8 rounded-xl bg-neutral-200" />

        <div className="flex-1 space-y-3">
          {/* Title and badge skeleton */}
          <div className="flex items-start justify-between gap-3">
            <div className="h-5 w-3/4 rounded-lg bg-neutral-200" />
            <div className="h-6 w-16 rounded-full bg-neutral-200" />
          </div>

          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-neutral-100" />
            <div className="h-4 w-2/3 rounded bg-neutral-100" />
          </div>

          {/* Footer skeleton */}
          <div className="flex items-center justify-between pt-1">
            <div className="h-4 w-24 rounded bg-neutral-100" />
            <div className="flex gap-2">
              <div className="h-7 w-14 rounded-lg bg-neutral-100" />
              <div className="h-7 w-16 rounded-lg bg-neutral-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TaskList({
  tasks,
  isLoading,
  error,
  onToggle,
  onUpdate,
  onDelete,
}: TaskListProps) {
  // Loading state with skeleton
  if (isLoading && tasks.length === 0) {
    return (
      <div className="space-y-3">
        <TaskSkeleton />
        <TaskSkeleton />
        <TaskSkeleton />
      </div>
    );
  }

  // Error state with improved styling
  if (error) {
    return (
      <div className="overflow-hidden rounded-2xl border-2 border-red-100 bg-gradient-to-br from-red-50 to-rose-50">
        <div className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800">
            Failed to load tasks
          </h3>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state with friendly illustration
  if (tasks.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border-2 border-dashed border-dark-border bg-gradient-to-br from-neutral-50 to-slate-50">
        <div className="p-12 text-center">
          {/* Illustration */}
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-primary-200">
            <svg
              className="h-12 w-12 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 11v6m-3-3h6"
              />
            </svg>
          </div>

          <h3 className="text-xl font-semibold text-neutral-100">No tasks yet</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-500">
            Your task list is empty. Create your first task above to get started on your productivity journey.
          </p>

          {/* Visual hint */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-400">
            <svg className="h-4 w-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>Use the form above to add a task</span>
          </div>
        </div>
      </div>
    );
  }

  // Task list with refreshing indicator
  return (
    <div className="space-y-3">
      {/* Refreshing indicator */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-primary-50 px-4 py-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
          <span className="text-sm font-medium text-primary-600">Refreshing tasks...</span>
        </div>
      )}

      {/* Task items with stagger animation */}
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
          disabled={isLoading}
          index={index}
        />
      ))}
    </div>
  );
}
