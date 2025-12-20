// T018: useTasks custom hook wrapping TaskContext

'use client';

import { useEffect } from 'react';
import { useTaskContext } from '@/context/TaskContext';

export function useTasks() {
  const {
    state,
    fetchTasks,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    setFilter,
  } = useTaskContext();

  // Fetch tasks on mount and when filter changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    // State
    tasks: state.tasks,
    filter: state.filter,
    isLoading: state.isLoading,
    error: state.error,
    pagination: state.pagination,

    // Actions
    fetchTasks,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    setFilter,

    // Computed
    filteredTasks: state.tasks,
    isEmpty: state.tasks.length === 0 && !state.isLoading,
    hasError: state.error !== null,
  };
}
