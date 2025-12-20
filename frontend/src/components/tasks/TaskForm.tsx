// T024: TaskForm component with title input, description textarea, validation
// UI-ENHANCED: Added visual polish, better feedback, improved flow

'use client';

import { useState, useCallback, FormEvent } from 'react';
import { TaskCreate } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { validateTaskTitle, validateTaskDescription } from '@/lib/validators';

interface TaskFormProps {
  onSubmit: (data: TaskCreate) => Promise<void>;
  disabled?: boolean;
}

export function TaskForm({ onSubmit, disabled }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      // Validate
      const titleResult = validateTaskTitle(title);
      const descResult = description ? validateTaskDescription(description) : null;

      if (!titleResult.isValid || (descResult && !descResult.isValid)) {
        setErrors({
          title: titleResult.error || undefined,
          description: descResult?.error || undefined,
        });
        return;
      }

      setErrors({});
      setIsSubmitting(true);

      try {
        const taskData: TaskCreate = {
          title: title.trim(),
        };

        if (description.trim()) {
          taskData.description = description.trim();
        }

        await onSubmit(taskData);

        // Clear form on success
        setTitle('');
        setDescription('');
        setIsExpanded(false);
      } catch (err) {
        setErrors({
          title: err instanceof Error ? err.message : 'Failed to create task',
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [title, description, onSubmit]
  );

  const isDisabled = disabled || isSubmitting;
  const descriptionLength = description.length;
  const isNearLimit = descriptionLength > 900;

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border-2 border-neutral-100 bg-dark-surface shadow-sm transition-all duration-300 hover:shadow-md"
    >
      {/* Header */}
      <div className="border-b border-neutral-100 bg-gradient-to-r from-primary-50 to-primary-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-md shadow-primary-200">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-100">Create New Task</h2>
            <p className="text-xs text-neutral-400">Add a task to your list</p>
          </div>
        </div>
      </div>

      {/* Form Body */}
      <div className="p-5">
        <div className="space-y-4">
          {/* Title Input */}
          <div>
            <label
              htmlFor="task-title"
              className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-neutral-700"
            >
              <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Task Title
              <span className="text-red-500">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                if (e.target.value && !isExpanded) setIsExpanded(true);
              }}
              placeholder="What needs to be done?"
              disabled={isDisabled}
              className={`block w-full rounded-xl border-2 px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                errors.title
                  ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200'
                  : 'border-dark-border bg-neutral-50 focus:border-primary-400 focus:bg-dark-surface focus:ring-primary-200'
              } disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400`}
            />
            {errors.title && (
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.title}
              </p>
            )}
          </div>

          {/* Description - Expandable */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isExpanded ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <label
              htmlFor="task-description"
              className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-neutral-700"
            >
              <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Description
              <span className="text-xs font-normal text-neutral-400">(optional)</span>
            </label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description)
                  setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              placeholder="Add more details about this task..."
              disabled={isDisabled}
              className={`block w-full rounded-xl border-2 px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                errors.description
                  ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200'
                  : 'border-dark-border bg-neutral-50 focus:border-primary-400 focus:bg-dark-surface focus:ring-primary-200'
              } disabled:cursor-not-allowed disabled:bg-neutral-100`}
              rows={3}
            />
            <div className="mt-1.5 flex items-center justify-between">
              {errors.description ? (
                <p className="flex items-center gap-1.5 text-sm text-red-600">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.description}
                </p>
              ) : (
                <span />
              )}
              <span
                className={`text-xs transition-colors ${
                  isNearLimit ? 'font-medium text-amber-600' : 'text-neutral-400'
                }`}
              >
                {descriptionLength}/1000
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4">
          {!isExpanded && title && (
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add description
            </button>
          )}
          {isExpanded && (
            <button
              type="button"
              onClick={() => {
                setIsExpanded(false);
                setDescription('');
              }}
              className="flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
              Hide description
            </button>
          )}
          {!isExpanded && !title && <span />}

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isDisabled || !title.trim()}
            isLoading={isSubmitting}
            leftIcon={
              !isSubmitting && (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              )
            }
          >
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </div>
    </form>
  );
}
