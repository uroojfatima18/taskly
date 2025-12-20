// T020: TaskItem component displaying title, status badge, created date
// T027: Add inline edit mode to TaskItem component
// T028: Add edit state management and save/cancel handlers
// T030: Add completion toggle checkbox/button
// T031: Add visual styling for completed vs incomplete tasks
// T035: Add delete button and confirmation modal trigger
// UI-ENHANCED: Added transitions, hover states, visual hierarchy improvements
// MOBILE-ENHANCED: Touch-friendly buttons, stagger animations, celebration effects

'use client';

import { useState, useCallback, useEffect } from 'react';
import { Task, TaskUpdate } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { validateTaskTitle, validateTaskDescription } from '@/lib/validators';

// Utility for conditional classes
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => Promise<void>;
  onUpdate: (id: number, data: TaskUpdate) => Promise<void>;
  onDelete: (id: number) => void;
  disabled?: boolean;
  index?: number; // For stagger animation
  isDeleting?: boolean; // For slide-out animation
}

// Confetti particle component for celebration
function ConfettiParticle({ delay, color }: { delay: number; color: string }) {
  return (
    <div
      className="absolute w-2 h-2 rounded-full animate-confetti"
      style={{
        backgroundColor: color,
        left: `${Math.random() * 100}%`,
        animationDelay: `${delay}ms`,
      }}
    />
  );
}

export function TaskItem({
  task,
  onToggle,
  onUpdate,
  onDelete,
  disabled,
  index = 0,
  isDeleting = false,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  // Reset celebration after animation
  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => {
        setShowCelebration(false);
        setJustCompleted(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [showCelebration]);

  const handleToggle = useCallback(async () => {
    if (isToggling || disabled) return;
    setIsToggling(true);
    setError(null);

    const wasCompleted = task.completed;

    try {
      await onToggle(task.id);
      // Show celebration only when marking as complete
      if (!wasCompleted) {
        setShowCelebration(true);
        setJustCompleted(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setIsToggling(false);
    }
  }, [task.id, task.completed, onToggle, isToggling, disabled]);

  const handleEditStart = useCallback(() => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(true);
    setError(null);
  }, [task.title, task.description]);

  const handleEditCancel = useCallback(() => {
    setIsEditing(false);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setError(null);
  }, [task.title, task.description]);

  const handleEditSave = useCallback(async () => {
    // Validate
    const titleResult = validateTaskTitle(editTitle);
    if (!titleResult.isValid) {
      setError(titleResult.error);
      return;
    }

    const descResult = validateTaskDescription(editDescription);
    if (!descResult.isValid) {
      setError(descResult.error);
      return;
    }

    // Check if anything changed
    const trimmedTitle = editTitle.trim();
    const trimmedDesc = editDescription.trim() || null;

    if (trimmedTitle === task.title && trimmedDesc === task.description) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const updateData: TaskUpdate = {};
      if (trimmedTitle !== task.title) {
        updateData.title = trimmedTitle;
      }
      if (trimmedDesc !== task.description) {
        updateData.description = trimmedDesc || undefined;
      }

      await onUpdate(task.id, updateData);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    } finally {
      setIsUpdating(false);
    }
  }, [task, editTitle, editDescription, onUpdate]);

  const formattedDate = new Date(task.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Stagger delay calculation (50ms per item, max 500ms)
  const staggerDelay = Math.min(index * 50, 500);

  if (isEditing) {
    return (
      <div
        className="rounded-xl border-2 border-primary-500/50 bg-dark-elevated p-5 shadow-lg shadow-primary-500/10 transition-all duration-300 animate-scale-in"
        style={{ animationDelay: `${staggerDelay}ms` }}
      >
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-white">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-primary-400">Edit Task</span>
        </div>
        <div className="space-y-4">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Task title"
            disabled={isUpdating}
            error={error && error.includes('title') ? error : undefined}
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description (optional)"
            disabled={isUpdating}
            className="block w-full rounded-lg border-2 border-dark-border bg-dark-surface px-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 shadow-sm transition-all duration-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            rows={3}
          />
          {error && !error.includes('title') && (
            <p className="flex items-center gap-1.5 text-sm text-red-400">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}
          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
            <Button
              variant="secondary"
              onClick={handleEditCancel}
              disabled={isUpdating}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleEditSave}
              disabled={isUpdating}
              isLoading={isUpdating}
              className="w-full sm:w-auto"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group relative rounded-xl border-2 p-4 sm:p-5 transition-all duration-300 backdrop-blur-sm',
        'animate-stagger-in',
        isDeleting && 'animate-slide-out-right',
        task.completed
          ? 'border-success-500/30 bg-dark-elevated shadow-sm hover:shadow-md hover:shadow-success-500/5'
          : 'border-dark-border bg-dark-surface hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10',
        justCompleted && 'animate-celebrate',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      style={{ animationDelay: `${staggerDelay}ms` }}
    >
      {/* Celebration confetti effect */}
      {showCelebration && (
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <ConfettiParticle
              key={i}
              delay={i * 50}
              color={['#7c7cff', '#22d3ee', '#22c55e', '#f59e0b'][i % 4]}
            />
          ))}
        </div>
      )}

      <div className="flex items-start gap-3 sm:gap-4">
        {/* Completion checkbox - enhanced with animation */}
        <button
          onClick={handleToggle}
          disabled={isToggling || disabled}
          className={cn(
            'mt-0.5 flex h-10 w-10 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-xl border-2 transition-all duration-300 transform touch-manipulation',
            task.completed
              ? 'scale-100 sm:scale-110 border-success-500 bg-gradient-to-br from-success-500 to-success-600 text-white shadow-lg shadow-success-500/30 hover:shadow-xl active:scale-95'
              : 'border-dark-border hover:border-primary-500 hover:bg-primary-500/10 hover:scale-105 active:scale-95',
            isToggling && 'animate-pulse scale-95',
            !isToggling && !disabled && !task.completed && 'cursor-pointer'
          )}
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          title={task.completed ? 'Click to mark as incomplete' : 'Click to mark as complete'}
        >
          {task.completed && (
            <svg className="h-5 w-5 sm:h-5 sm:w-5 animate-bounce-in" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          )}
        </button>

        {/* Task content - clear visual hierarchy */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <h3
              className={cn(
                'text-sm sm:text-base font-semibold leading-tight transition-all duration-300',
                task.completed ? 'text-neutral-500 line-through decoration-success-500/50 decoration-2' : 'text-neutral-100'
              )}
            >
              {task.title}
            </h3>
            <span
              className={cn(
                'flex-shrink-0 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wide transition-all duration-300',
                task.completed
                  ? 'bg-success-500/20 text-success-400'
                  : 'bg-primary-500/20 text-primary-400'
              )}
            >
              {task.completed ? 'Done' : 'Pending'}
            </span>
          </div>

          {task.description && (
            <p
              className={cn(
                'mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed transition-colors duration-200',
                task.completed ? 'text-neutral-600' : 'text-neutral-400'
              )}
            >
              {task.description}
            </p>
          )}

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formattedDate}</span>
            </div>

            {/* Actions - always visible on mobile, hover on desktop */}
            <div className="flex gap-2 sm:opacity-0 sm:transition-opacity sm:duration-200 sm:group-hover:opacity-100">
              <button
                onClick={handleEditStart}
                disabled={disabled}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 sm:px-2.5 sm:py-1.5 text-xs font-medium text-neutral-400 bg-dark-hover sm:bg-transparent transition-all duration-150 hover:bg-dark-hover hover:text-neutral-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation"
              >
                <svg className="h-4 w-4 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="sm:inline">Edit</span>
              </button>
              <button
                onClick={() => onDelete(task.id)}
                disabled={disabled}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 sm:px-2.5 sm:py-1.5 text-xs font-medium text-neutral-400 bg-dark-hover sm:bg-transparent transition-all duration-150 hover:bg-red-500/10 hover:text-red-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation"
              >
                <svg className="h-4 w-4 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="sm:inline">Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error message with icon */}
      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">
          <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
