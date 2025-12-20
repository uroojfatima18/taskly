# Research: Frontend Task Management

**Feature**: 002-frontend-task-management
**Date**: 2025-12-14
**Status**: Complete

## Research Summary

All technical uncertainties have been resolved through spec clarifications and analysis of the existing backend implementation.

## Resolved Questions

### 1. JWT Storage Location

**Decision**: localStorage
**Rationale**: Per spec clarification (2025-12-14), JWT access tokens will be stored in localStorage for simplicity. This is acceptable for a hackathon project where XSS concerns are secondary to rapid development.
**Alternatives Considered**:
- httpOnly cookies: More secure but requires backend cookie support not currently implemented
- sessionStorage: Would clear on tab close, poor UX for task management app

### 2. State Management Approach

**Decision**: React Context + custom hooks
**Rationale**: Per spec clarification (2025-12-14), React Context with hooks provides sufficient complexity for this single-user task app without introducing external dependencies.
**Alternatives Considered**:
- Redux: Overkill for simple CRUD operations
- Zustand: Nice but adds dependency for minimal benefit
- React Query: Good for data fetching but spec explicitly chose Context approach

### 3. Task Editing UI Pattern

**Decision**: Inline editing in task list
**Rationale**: Per spec clarification (2025-12-14), inline editing provides faster workflow than modal dialogs. Users can click a task to enter edit mode directly in the list view.
**Alternatives Considered**:
- Modal dialog: More disruptive to workflow
- Separate edit page: Unnecessary navigation

### 4. Update Strategy

**Decision**: Optimistic updates with rollback on failure
**Rationale**: Per spec clarification (2025-12-14), optimistic updates provide instant feedback. On API failure, the UI reverts to previous state and displays error toast.
**Alternatives Considered**:
- Pessimistic updates: Wait for server response first - feels slow
- Optimistic without rollback: Could show stale/incorrect data on failures

### 5. Session Expiration Handling

**Decision**: API 401 response interception
**Rationale**: Per spec clarification (2025-12-14), the API client will intercept 401 responses and redirect to sign-in page. No proactive token expiry checking needed.
**Alternatives Considered**:
- Token expiry timer: Adds complexity; 401 interception is simpler
- Refresh tokens: Not implemented in backend

## Technology Research

### Better Auth Client Integration

**Finding**: Better Auth provides a JavaScript/TypeScript client that handles sign-in flows and returns JWT tokens. The token is included in the response body after successful authentication.

**Best Practice**: Store the token in localStorage immediately after successful sign-in, then include it in all subsequent API requests via Authorization header.

### Next.js 14 App Router Patterns

**Finding**: Next.js 14 App Router defaults to Server Components. Client-side interactivity requires explicit "use client" directive.

**Best Practices**:
- Use Server Components for static layouts
- Mark interactive components (forms, context consumers) as Client Components
- Keep auth state in Client Component providers at root level

### Optimistic Updates Pattern

**Finding**: Standard pattern for optimistic updates in React:
1. Save current state for potential rollback
2. Immediately apply optimistic change to local state
3. Make API request
4. On failure: rollback to saved state, show error
5. On success: optionally refresh from server (or keep optimistic)

**Implementation Notes**: The TaskContext will track pending operations and rollback state for each optimistic action.

### Tailwind CSS Form Styling

**Finding**: Tailwind provides utility classes for form inputs, buttons, and feedback states. No custom CSS needed.

**Best Practices**:
- Use focus rings for accessibility
- Apply consistent spacing with space-y/gap utilities
- Use text-red-500 for error states, text-green-500 for success

## Backend API Contract Summary

Based on analysis of `backend/routes/tasks.py` and `backend/schemas.py`:

| Operation | Endpoint | Method | Request Body | Response |
|-----------|----------|--------|--------------|----------|
| List Tasks | `/tasks` | GET | - | `TaskListResponse` |
| Create Task | `/tasks` | POST | `TaskCreate` | `TaskResponse` |
| Update Task | `/tasks/{id}` | PUT | `TaskUpdate` | `TaskResponse` |
| Toggle Status | `/tasks/{id}/complete` | PATCH | `TaskStatusUpdate` | `TaskResponse` |
| Delete Task | `/tasks/{id}` | DELETE | - | 204 No Content |

**Query Parameters** (List Tasks):
- `status`: "all" | "pending" | "completed"
- `page`: integer (default 1)
- `per_page`: integer (default 20, max 50)

**Auth**: All endpoints require `Authorization: Bearer <token>` header. Returns 401 on invalid/expired token.

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| localStorage XSS vulnerability | Medium | High | Short session tokens, user education |
| Optimistic update race conditions | Low | Medium | Queue operations, disable controls during pending |
| Better Auth integration issues | Low | Medium | Test auth flow early in development |

## Next Steps

All research complete. Proceed to Phase 1: Design & Contracts.
