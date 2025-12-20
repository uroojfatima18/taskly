// T019: TaskFilter component with status dropdown (all, pending, completed)

'use client';

import { TaskFilter as TaskFilterType } from '@/types';

interface TaskFilterProps {
  filter: TaskFilterType;
  onFilterChange: (filter: TaskFilterType) => void;
  disabled?: boolean;
}

export function TaskFilter({ filter, onFilterChange, disabled }: TaskFilterProps) {
  const filterOptions: { value: TaskFilterType; label: string }[] = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="task-filter" className="text-sm font-medium text-gray-700">
        Filter:
      </label>
      <select
        id="task-filter"
        value={filter}
        onChange={(e) => onFilterChange(e.target.value as TaskFilterType)}
        disabled={disabled}
        className="block rounded-md border border-gray-300 bg-dark-surface px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
      >
        {filterOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
