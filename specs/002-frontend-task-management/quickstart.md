# Quickstart: Frontend Task Management

**Feature**: 002-frontend-task-management
**Date**: 2025-12-14

## Prerequisites

- Node.js 18+ installed
- Backend API running at http://localhost:8000
- Better Auth service configured

## Setup

### 1. Initialize Next.js Project

```bash
cd frontend
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### 2. Install Dependencies

```bash
npm install better-auth
```

### 3. Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000/auth
```

### 4. Configure TypeScript

Ensure `tsconfig.json` has strict mode:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    ...
  }
}
```

## Development

### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs at http://localhost:3000

### Start Backend (separate terminal)

```bash
cd backend
uvicorn main:app --reload --port 8000
```

## File Implementation Order

Follow this order for implementing the frontend:

### Phase 1: Foundation (P0)

1. `src/types/index.ts` - TypeScript interfaces
2. `src/lib/api.ts` - API client with auth interceptor
3. `src/lib/validators.ts` - Input validation utilities
4. `src/context/AuthContext.tsx` - Auth state management
5. `src/hooks/useAuth.ts` - Auth hook

### Phase 2: Auth UI (P1)

6. `src/components/ui/Button.tsx` - Reusable button
7. `src/components/ui/Input.tsx` - Reusable input
8. `src/components/auth/LoginForm.tsx` - Sign-in form
9. `src/components/auth/AuthGuard.tsx` - Route protection
10. `src/app/login/page.tsx` - Sign-in page
11. `src/app/layout.tsx` - Root layout with providers

### Phase 3: Task Management (P1-P2)

12. `src/context/TaskContext.tsx` - Task state with optimistic updates
13. `src/hooks/useTasks.ts` - Task operations hook
14. `src/components/tasks/TaskFilter.tsx` - Status filter
15. `src/components/tasks/TaskForm.tsx` - Create task form
16. `src/components/tasks/TaskItem.tsx` - Task with inline edit
17. `src/components/tasks/TaskList.tsx` - Task list container
18. `src/app/dashboard/page.tsx` - Main dashboard

### Phase 4: Polish (P3)

19. `src/components/ui/Toast.tsx` - Toast notifications
20. `src/components/ui/Modal.tsx` - Modal dialog
21. `src/components/tasks/DeleteConfirmModal.tsx` - Delete confirmation
22. `src/hooks/useToast.ts` - Toast state hook

### Phase 5: Testing

23. `tests/mocks/handlers.ts` - MSW request handlers
24. `tests/components/TaskList.test.tsx` - Component tests
25. `tests/integration/auth-flow.test.tsx` - Auth integration tests

## Key Patterns

### API Client Pattern

```typescript
// src/lib/api.ts
const api = {
  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
    });
    
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    
    if (!response.ok) {
      throw new Error(await response.text());
    }
    
    return response.json();
  },
};
```

### Optimistic Update Pattern

```typescript
// In TaskContext
const toggleTask = async (id: number) => {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  
  // Optimistic update
  dispatch({ type: 'TOGGLE_TASK', id });
  
  try {
    await api.patch(`/tasks/${id}/complete`, { completed: !task.completed });
  } catch (error) {
    // Rollback on failure
    dispatch({ type: 'TOGGLE_TASK', id });
    showToast({ type: 'error', message: 'Failed to update task' });
  }
};
```

### Auth Guard Pattern

```typescript
// src/components/auth/AuthGuard.tsx
'use client';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);
  
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return null;
  
  return <>{children}</>;
}
```

## Testing Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage
```

## Common Issues

### CORS Errors

Ensure backend has CORS configured for http://localhost:3000:

```python
# backend/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 401 Redirect Loop

Clear localStorage if stuck in redirect loop:

```javascript
localStorage.removeItem('auth_token');
localStorage.removeItem('auth_user');
```

### TypeScript Strict Mode Errors

Address all implicit `any` types and undefined checks. Use optional chaining (`?.`) and nullish coalescing (`??`) operators.
