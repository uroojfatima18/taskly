// T005: TypeScript interfaces for Frontend Task Management

// Task Entity
export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
  user_id: string;
}

export interface TaskCreate {
  title: string; // Required, 1-200 chars
  description?: string; // Optional, max 1000 chars
}

export interface TaskUpdate {
  title?: string; // Optional, 1-200 chars if provided
  description?: string; // Optional, max 1000 chars
}

export interface TaskStatusUpdate {
  completed: boolean;
}

export interface TaskListResponse {
  items: Task[];
  total: number;
  page: number;
  per_page: number;
}

// Auth Entity
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthSession {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

// UI State Types
export type TaskFilter = 'all' | 'pending' | 'completed' | 'to_do' | 'in_progress' | 'done';

export interface TaskState {
  tasks: Task[];
  filter: TaskFilter;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    per_page: number;
    total: number;
  };
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

// API Error types
export interface ApiError {
  detail: string | ValidationErrorDetail[];
}

export interface ValidationErrorDetail {
  loc: string[];
  msg: string;
  type: string;
}

// Chat Entity
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

export interface ChatRequest {
  user_id: string;
  message: string;
  conversation_id?: number | null;
}

export interface ChatResponse {
  conversation_id: number;
  response: string;
  tool_calls: ToolCall[];
}

export interface ToolCall {
  name: string;
  arguments: any;
  result?: any;
}
