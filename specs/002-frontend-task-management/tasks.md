# Tasks: Frontend Task Management

**Input**: Design documents from `/specs/002-frontend-task-management/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/tasks-api.yaml, research.md, quickstart.md

**Tests**: Tests are NOT included in this task list (not explicitly requested in feature specification).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app structure**: `frontend/src/` for all frontend code
- Backend exists at `backend/` - no changes needed for this feature

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and Next.js 14 project structure

- [x] T001 Initialize Next.js 14 project with TypeScript, Tailwind CSS, ESLint in frontend/ directory
- [x] T002 Configure TypeScript strict mode in frontend/tsconfig.json
- [x] T003 [P] Create environment configuration file frontend/.env.local.example with API_URL and BETTER_AUTH_URL
- [x] T004 [P] Install Better Auth client dependency in frontend/package.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create TypeScript interfaces (Task, TaskCreate, TaskUpdate, TaskStatusUpdate, TaskListResponse, User, AuthSession, LoginCredentials, AuthState, TaskFilter, TaskState) in frontend/src/types/index.ts
- [x] T006 [P] Implement API client with 401 interceptor and Bearer token handling in frontend/src/lib/api.ts
- [x] T007 [P] Implement input validation utilities (validateTaskTitle, validateTaskDescription, validateEmail) in frontend/src/lib/validators.ts
- [x] T008 [P] Create reusable Button component with variants (primary, secondary, danger) in frontend/src/components/ui/Button.tsx
- [x] T009 [P] Create reusable Input component with error state support in frontend/src/components/ui/Input.tsx
- [x] T010 Create AuthContext with login/logout methods and localStorage token management in frontend/src/context/AuthContext.tsx
- [x] T011 Create useAuth custom hook wrapping AuthContext in frontend/src/hooks/useAuth.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - User Authentication (Priority: P1) - MVP

**Goal**: Enable users to sign in and access their personal tasks securely

**Independent Test**: Sign in with valid/invalid credentials, verify access to dashboard is granted or denied appropriately

**Acceptance Scenarios**:
1. Unauthenticated users redirected to sign-in page
2. Valid credentials authenticate and redirect to dashboard
3. Invalid credentials show error, remain on sign-in page
4. Sign out ends session and redirects to sign-in

### Implementation for User Story 1

- [x] T012 [US1] Create LoginForm component with email/password fields and validation in frontend/src/components/auth/LoginForm.tsx
- [x] T013 [US1] Create AuthGuard component for protected route handling in frontend/src/components/auth/AuthGuard.tsx
- [x] T014 [US1] Create sign-in page with LoginForm in frontend/src/app/login/page.tsx
- [x] T015 [US1] Create root layout with AuthProvider wrapper in frontend/src/app/layout.tsx
- [x] T016 [US1] Create home page with redirect logic (authenticated -> dashboard, unauthenticated -> login) in frontend/src/app/page.tsx

**Checkpoint**: User Story 1 complete - users can sign in, sign out, and are redirected appropriately

---

## Phase 4: User Story 2 - View Tasks (Priority: P1)

**Goal**: Enable authenticated users to view all their tasks with title, status, and created date

**Independent Test**: Sign in and verify task list displays all user tasks with correct information

**Acceptance Scenarios**:
1. Users with tasks see all tasks with title, status, created date
2. Users with no tasks see empty state message
3. Users can filter tasks by status (all, pending, completed)

### Implementation for User Story 2

- [x] T017 [US2] Create TaskContext with state management (tasks, filter, loading, error) and fetchTasks method in frontend/src/context/TaskContext.tsx
- [x] T018 [US2] Create useTasks custom hook wrapping TaskContext in frontend/src/hooks/useTasks.ts
- [x] T019 [P] [US2] Create TaskFilter component with status dropdown (all, pending, completed) in frontend/src/components/tasks/TaskFilter.tsx
- [x] T020 [P] [US2] Create TaskItem component displaying title, status badge, created date in frontend/src/components/tasks/TaskItem.tsx
- [x] T021 [US2] Create TaskList component with empty state handling in frontend/src/components/tasks/TaskList.tsx
- [x] T022 [US2] Create dashboard page with AuthGuard, TaskProvider, TaskList, TaskFilter in frontend/src/app/dashboard/page.tsx

**Checkpoint**: User Story 2 complete - users can view their tasks and filter by status

---

## Phase 5: User Story 3 - Create Task (Priority: P2)

**Goal**: Enable authenticated users to create new tasks to track work

**Independent Test**: Create a new task and verify it appears in the task list with correct details

**Acceptance Scenarios**:
1. Valid title (1-200 chars) creates task and shows in list
2. Title with optional description (max 1000 chars) saves both fields
3. Empty title shows validation error, task not created
4. Title exceeding 200 chars shows validation error

### Implementation for User Story 3

- [x] T023 [US3] Add createTask method with optimistic update and rollback to TaskContext in frontend/src/context/TaskContext.tsx
- [x] T024 [US3] Create TaskForm component with title input, description textarea, validation in frontend/src/components/tasks/TaskForm.tsx
- [x] T025 [US3] Integrate TaskForm into dashboard page above TaskList in frontend/src/app/dashboard/page.tsx

**Checkpoint**: User Story 3 complete - users can create tasks with validation

---

## Phase 6: User Story 4 - Update Task (Priority: P2)

**Goal**: Enable authenticated users to edit existing task details

**Independent Test**: Edit a task title or description and verify changes persist

**Acceptance Scenarios**:
1. Edit title and save updates task list display
2. Edit description and save persists the change
3. Clear required title shows validation error

### Implementation for User Story 4

- [x] T026 [US4] Add updateTask method with optimistic update and rollback to TaskContext in frontend/src/context/TaskContext.tsx
- [x] T027 [US4] Add inline edit mode to TaskItem component (click to edit title/description) in frontend/src/components/tasks/TaskItem.tsx
- [x] T028 [US4] Add edit state management and save/cancel handlers to TaskItem in frontend/src/components/tasks/TaskItem.tsx

**Checkpoint**: User Story 4 complete - users can edit tasks inline

---

## Phase 7: User Story 5 - Mark Task Complete (Priority: P2)

**Goal**: Enable users to toggle task completion status for progress tracking

**Independent Test**: Toggle a task's completion status and verify the status change is reflected in UI

**Acceptance Scenarios**:
1. Mark incomplete task as complete changes status and shows visual indicator
2. Mark completed task as incomplete reverts status

### Implementation for User Story 5

- [x] T029 [US5] Add toggleTask method with optimistic update and rollback to TaskContext in frontend/src/context/TaskContext.tsx
- [x] T030 [US5] Add completion toggle checkbox/button to TaskItem component in frontend/src/components/tasks/TaskItem.tsx
- [x] T031 [US5] Add visual styling for completed vs incomplete tasks (strikethrough, opacity) in frontend/src/components/tasks/TaskItem.tsx

**Checkpoint**: User Story 5 complete - users can toggle task completion

---

## Phase 8: User Story 6 - Delete Task (Priority: P3)

**Goal**: Enable users to remove tasks they no longer need

**Independent Test**: Delete a task and verify it no longer appears in the task list

**Acceptance Scenarios**:
1. Initiate deletion, confirm, task removed from list
2. Initiate deletion, cancel, task remains in list

### Implementation for User Story 6

- [x] T032 [P] [US6] Create Modal component with overlay and close button in frontend/src/components/ui/Modal.tsx
- [x] T033 [US6] Create DeleteConfirmModal component with confirm/cancel buttons in frontend/src/components/tasks/DeleteConfirmModal.tsx
- [x] T034 [US6] Add deleteTask method with optimistic update and rollback to TaskContext in frontend/src/context/TaskContext.tsx
- [x] T035 [US6] Add delete button and confirmation modal trigger to TaskItem in frontend/src/components/tasks/TaskItem.tsx

**Checkpoint**: User Story 6 complete - users can delete tasks with confirmation

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, toast notifications, and UX improvements

- [x] T036 [P] Create Toast component for notifications in frontend/src/components/ui/Toast.tsx
- [x] T037 [P] Create useToast hook for toast state management in frontend/src/hooks/useToast.ts
- [x] T038 Integrate toast notifications into TaskContext for operation feedback in frontend/src/context/TaskContext.tsx
- [x] T039 Add loading spinners and disabled states during API operations in frontend/src/components/tasks/TaskItem.tsx
- [x] T040 Add error boundary and fallback UI for unexpected errors in frontend/src/app/layout.tsx
- [x] T041 Validate implementation against quickstart.md patterns and requirements

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - US1 (Auth) should be completed first as it provides the authentication infrastructure
  - US2 (View) depends on US1 for AuthGuard and dashboard access
  - US3-6 can proceed in priority order after US2
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No story dependencies
- **User Story 2 (P1)**: Should follow US1 for authentication infrastructure
- **User Story 3 (P2)**: Can start after US2 - Uses TaskContext
- **User Story 4 (P2)**: Can start after US2 - Extends TaskItem
- **User Story 5 (P2)**: Can start after US2 - Extends TaskItem
- **User Story 6 (P3)**: Can start after US2 - Requires Modal component

### Within Each User Story

- Context methods before UI components using them
- Shared UI components before story-specific components
- Core implementation before integration

### Parallel Opportunities

**Foundational Phase (T005-T011)**:
```
Parallel Group A: T006, T007, T008, T009 (all independent)
Sequential: T005 → T010 → T011 (types → context → hook)
```

**User Story 2 (T017-T022)**:
```
Sequential: T017 → T018 (context → hook)
Parallel: T019, T020 (filter and item components)
Sequential: T021 depends on T020; T022 depends on T021
```

**User Story 6 (T032-T035)**:
```
Parallel: T032 (Modal) can start with T034 (deleteTask)
Sequential: T033 depends on T032; T035 depends on T033, T034
```

---

## Parallel Example: Foundational Phase

```bash
# Launch independent foundational tasks together:
Task T006: "Implement API client with 401 interceptor in frontend/src/lib/api.ts"
Task T007: "Implement input validation utilities in frontend/src/lib/validators.ts"
Task T008: "Create reusable Button component in frontend/src/components/ui/Button.tsx"
Task T009: "Create reusable Input component in frontend/src/components/ui/Input.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T011)
3. Complete Phase 3: User Story 1 - Authentication (T012-T016)
4. Complete Phase 4: User Story 2 - View Tasks (T017-T022)
5. **STOP and VALIDATE**: Test sign-in flow and task viewing independently
6. Deploy/demo MVP

### Incremental Delivery

1. Setup + Foundational -> Foundation ready
2. Add US1 (Auth) -> Test independently -> Deploy (can sign in)
3. Add US2 (View) -> Test independently -> Deploy (can view tasks - MVP!)
4. Add US3 (Create) -> Test independently -> Deploy (full read/create)
5. Add US4 (Update) -> Test independently -> Deploy (edit capability)
6. Add US5 (Complete) -> Test independently -> Deploy (toggle status)
7. Add US6 (Delete) -> Test independently -> Deploy (full CRUD!)
8. Add Polish -> Final release

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| Setup | T001-T004 | Project initialization |
| Foundational | T005-T011 | Core infrastructure |
| US1 Auth | T012-T016 | Sign-in, sign-out, route protection |
| US2 View | T017-T022 | Task list, filtering, empty state |
| US3 Create | T023-T025 | Task creation form |
| US4 Update | T026-T028 | Inline task editing |
| US5 Complete | T029-T031 | Toggle completion status |
| US6 Delete | T032-T035 | Delete with confirmation |
| Polish | T036-T041 | Toast notifications, loading states |

**Total Tasks**: 41
**Task Count by User Story**:
- Setup: 4 tasks
- Foundational: 7 tasks
- US1 (Auth): 5 tasks
- US2 (View): 6 tasks
- US3 (Create): 3 tasks
- US4 (Update): 3 tasks
- US5 (Complete): 3 tasks
- US6 (Delete): 4 tasks
- Polish: 6 tasks

**MVP Scope**: Setup (4) + Foundational (7) + US1 (5) + US2 (6) = 22 tasks

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All file paths are relative to repository root
