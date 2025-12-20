# Data Model: Frontend Task Management

**Feature**: 002-frontend-task-management
**Date**: 2025-12-14

## Frontend TypeScript Interfaces

### Task Entity

```typescript
// types/index.ts

export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;  // ISO 8601 datetime
  updated_at: string;  // ISO 8601 datetime
  user_id: string;
}

export interface TaskCreate {
  title: string;       // Required, 1-200 chars
  description?: string; // Optional, max 1000 chars
}

export interface TaskUpdate {
  title?: string;      // Optional, 1-200 chars if provided
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
```

### Auth Entity

```typescript
// types/index.ts

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

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
}
```

### UI State Types

```typescript
// types/index.ts

export type TaskFilter = 'all' | 'pending' | 'completed';

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

export interface OptimisticOperation {
  id: string;
  type: 'create' | 'update' | 'delete' | 'toggle';
  taskId?: number;
  rollbackData?: Task | Task[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
```

## Field Validation Rules

### Task Title
- **Required**: Yes
- **Min Length**: 1 character
- **Max Length**: 200 characters
- **Whitespace**: Strip leading/trailing, reject whitespace-only

### Task Description
- **Required**: No
- **Max Length**: 1000 characters
- **Whitespace**: Strip leading/trailing, convert whitespace-only to null

### Email (Login)
- **Required**: Yes
- **Format**: Valid email format
- **Max Length**: 254 characters (RFC 5321)

### Password (Login)
- **Required**: Yes
- **Min Length**: 1 character (actual requirements handled by Better Auth)

## State Transitions

### Task Status Transitions

```
[incomplete] <--toggle--> [complete]
```

- Tasks are created with `completed: false`
- Status can be toggled any number of times
- No restrictions on direction of transition

### Auth State Transitions

```
[unauthenticated] --login--> [loading] --success--> [authenticated]
                                       --failure--> [unauthenticated]

[authenticated] --logout--> [unauthenticated]
[authenticated] --401 response--> [unauthenticated]
```

### Task Operation States

```
[idle] --action--> [optimistic update] --API success--> [idle]
                                       --API failure--> [rollback] --> [idle]
```

## Relationship to Backend Schema

| Frontend Type | Backend Model | Notes |
|--------------|---------------|-------|
| `Task` | `Task` (SQLModel) | Direct mapping |
| `TaskCreate` | `TaskCreate` (Pydantic) | Direct mapping |
| `TaskUpdate` | `TaskUpdate` (Pydantic) | Direct mapping |
| `TaskStatusUpdate` | `TaskStatusUpdate` (Pydantic) | Direct mapping |
| `TaskListResponse` | `TaskListResponse` (Pydantic) | Direct mapping |
| `User` | `users` table (Better Auth) | Subset of fields |

## localStorage Schema

```typescript
// Key: 'auth_token'
// Value: JWT string

// Key: 'auth_user'  
// Value: JSON string of User object
```

## Context State Shape

### AuthContext

```typescript
{
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}
```

### TaskContext

```typescript
{
  state: TaskState;
  fetchTasks: () => Promise<void>;
  createTask: (data: TaskCreate) => Promise<void>;
  updateTask: (id: number, data: TaskUpdate) => Promise<void>;
  toggleTask: (id: number) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  setFilter: (filter: TaskFilter) => void;
}
```
