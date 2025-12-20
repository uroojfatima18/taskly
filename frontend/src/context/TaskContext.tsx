// T017: TaskContext with state management (tasks, filter, loading, error) and fetchTasks method
// T023: Add createTask method with optimistic update and rollback
// T026: Add updateTask method with optimistic update and rollback
// T029: Add toggleTask method with optimistic update and rollback
// T034: Add deleteTask method with optimistic update and rollback

'use client';

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from 'react';
import {
  Task,
  TaskState,
  TaskFilter,
  TaskCreate,
  TaskUpdate,
} from '@/types';
import { api } from '@/lib/api';

// Action types
type TaskAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TASKS'; payload: { tasks: Task[]; total: number; page: number; per_page: number } }
  | { type: 'SET_FILTER'; payload: TaskFilter }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'REMOVE_TASK'; payload: number }
  | { type: 'TOGGLE_TASK'; payload: number }
  | { type: 'ROLLBACK_TASKS'; payload: Task[] };

// Initial state
const initialState: TaskState = {
  tasks: [],
  filter: 'all',
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    per_page: 20,
    total: 0,
  },
};

// Reducer
function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_TASKS':
      return {
        ...state,
        tasks: action.payload.tasks,
        pagination: {
          page: action.payload.page,
          per_page: action.payload.per_page,
          total: action.payload.total,
        },
        isLoading: false,
        error: null,
      };

    case 'SET_FILTER':
      return { ...state, filter: action.payload };

    case 'ADD_TASK':
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        pagination: {
          ...state.pagination,
          total: state.pagination.total + 1,
        },
      };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };

    case 'REMOVE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        pagination: {
          ...state.pagination,
          total: Math.max(0, state.pagination.total - 1),
        },
      };

    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task
        ),
      };

    case 'ROLLBACK_TASKS':
      return { ...state, tasks: action.payload };

    default:
      return state;
  }
}

// Context type
interface TaskContextType {
  state: TaskState;
  fetchTasks: () => Promise<void>;
  createTask: (data: TaskCreate) => Promise<void>;
  updateTask: (id: number, data: TaskUpdate) => Promise<void>;
  toggleTask: (id: number) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  setFilter: (filter: TaskFilter) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // T017: Fetch tasks from API
  const fetchTasks = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await api.getTasks(
        state.filter,
        state.pagination.page,
        state.pagination.per_page
      );

      dispatch({
        type: 'SET_TASKS',
        payload: {
          tasks: response.items,
          total: response.total,
          page: response.page,
          per_page: response.per_page,
        },
      });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to fetch tasks',
      });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.filter, state.pagination.page, state.pagination.per_page]);

  // T023: Create task with optimistic update
  const createTask = useCallback(async (data: TaskCreate) => {
    const previousTasks = [...state.tasks];

    // Create temporary optimistic task
    const tempTask: Task = {
      id: Date.now(), // Temporary ID
      title: data.title,
      description: data.description || null,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: 'temp',
    };

    // Optimistic update
    dispatch({ type: 'ADD_TASK', payload: tempTask });

    try {
      const createdTask = await api.createTask(data);
      // Replace temp task with real task
      dispatch({ type: 'REMOVE_TASK', payload: tempTask.id });
      dispatch({ type: 'ADD_TASK', payload: createdTask });
    } catch (error) {
      // Rollback on failure
      dispatch({ type: 'ROLLBACK_TASKS', payload: previousTasks });
      throw error;
    }
  }, [state.tasks]);

  // T026: Update task with optimistic update
  const updateTask = useCallback(async (id: number, data: TaskUpdate) => {
    const previousTasks = [...state.tasks];
    const taskToUpdate = state.tasks.find((t) => t.id === id);

    if (!taskToUpdate) return;

    // Optimistic update
    const optimisticTask: Task = {
      ...taskToUpdate,
      ...data,
      updated_at: new Date().toISOString(),
    };
    dispatch({ type: 'UPDATE_TASK', payload: optimisticTask });

    try {
      const updatedTask = await api.updateTask(id, data);
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
    } catch (error) {
      // Rollback on failure
      dispatch({ type: 'ROLLBACK_TASKS', payload: previousTasks });
      throw error;
    }
  }, [state.tasks]);

  // T029: Toggle task with optimistic update
  const toggleTask = useCallback(async (id: number) => {
    const previousTasks = [...state.tasks];
    const task = state.tasks.find((t) => t.id === id);

    if (!task) return;

    // Optimistic update
    dispatch({ type: 'TOGGLE_TASK', payload: id });

    try {
      await api.toggleTaskStatus(id, { completed: !task.completed });
    } catch (error) {
      // Rollback on failure
      dispatch({ type: 'ROLLBACK_TASKS', payload: previousTasks });
      throw error;
    }
  }, [state.tasks]);

  // T034: Delete task with optimistic update
  const deleteTask = useCallback(async (id: number) => {
    const previousTasks = [...state.tasks];

    // Optimistic update
    dispatch({ type: 'REMOVE_TASK', payload: id });

    try {
      await api.deleteTask(id);
    } catch (error) {
      // Rollback on failure
      dispatch({ type: 'ROLLBACK_TASKS', payload: previousTasks });
      throw error;
    }
  }, [state.tasks]);

  // Set filter
  const setFilter = useCallback((filter: TaskFilter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }, []);

  return (
    <TaskContext.Provider
      value={{
        state,
        fetchTasks,
        createTask,
        updateTask,
        toggleTask,
        deleteTask,
        setFilter,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext(): TaskContextType {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
