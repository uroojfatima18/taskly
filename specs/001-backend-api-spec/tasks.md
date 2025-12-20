# Tasks: Backend API for Task CRUD Operations

**Input**: Design documents from `/specs/001-backend-api-spec/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)
**Tests**: Not explicitly requested - test tasks omitted

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/` (FastAPI), `frontend/` (Next.js)
- Database: Neon PostgreSQL via SQLModel ORM

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create backend project structure with `backend/main.py`, `backend/models.py`, `backend/db.py`, `backend/routes/`
- [X] T002 Initialize Python project with FastAPI, SQLModel, and pydantic dependencies in `backend/requirements.txt`
- [X] T003 [P] Configure environment variable handling for DATABASE_URL in `backend/.env.example`
- [X] T004 [P] Create `.gitignore` with Python, environment, and IDE exclusions at repository root

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Implement database connection and session management in `backend/db.py`
- [X] T006 [P] Create User model (id, email, name, created_at) in `backend/models.py`
- [X] T007 [P] Create Task model (id, user_id, title, description, completed, created_at, updated_at) in `backend/models.py`
- [X] T008 Implement JWT authentication dependency in `backend/dependencies/auth.py`
- Read Authorization: Bearer <token>
- Verify JWT using BETTER_AUTH_SECRET
- Decode token and extract user_id
- Raise 401 if token missing/invalid
- [X] T008A Add BETTER_AUTH_SECRET to backend/.env.example

- [X] T009 [P] Create base API router with `/api` prefix in `backend/main.py`
- [X] T010 [P] Setup error handling utilities (HTTPException helpers, validation errors) in `backend/utils/errors.py`
- [X] T011 Configure Pydantic request/response schemas in `backend/schemas.py`
- [X] T012 Create database table initialization on startup in `backend/main.py`
- [X] T012A Ensure DB session dependency injected via FastAPI Depends

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create a New Task (Priority: P1)

**Goal**: Enable logged-in users to create new tasks with required title and optional description

**Independent Test**: POST `/api/tasks` with valid credentials and task data, then verify task exists in user's task list

### Implementation for User Story 1

- [X] T013 [US1] Create TaskCreate Pydantic schema (title: str 1-200 chars required, description: str max 1000 chars optional) in `backend/schemas.py`
- [X] T014 [US1] Create TaskResponse Pydantic schema (id, title, description, completed, created_at, user_id) in `backend/schemas.py`
- [X] T015 [US1] Implement `POST /api/tasks` endpoint in `backend/routes/tasks.py`
- [X] T016 [US1] Add title validation (1-200 chars, not just whitespace) in `backend/routes/tasks.py`
- [X] T017 [US1] Add description validation (max 1000 chars) in `backend/routes/tasks.py`
- [X] T018 [US1] Auto-associate task with authenticated user and set status to "pending" in `backend/routes/tasks.py`
- [X] T019 [US1] Return created task with unique identifier and timestamps in `backend/routes/tasks.py`
- [X] T020 [US1] Register tasks router in `backend/main.py`

**Checkpoint**: User Story 1 fully functional - users can create tasks with validation

---

## Phase 4: User Story 2 - View All Tasks (Priority: P1)

**Goal**: Enable logged-in users to view their complete task list with filtering and pagination

**Independent Test**: Create several tasks, then GET `/api/tasks` and verify all created tasks are returned with correct fields

### Implementation for User Story 2

- [X] T021 [US2] Create TaskListResponse Pydantic schema (items, total, page, per_page) in `backend/schemas.py`
- [X] T022 [US2] Implement `GET /api/tasks` endpoint in `backend/routes/tasks.py`
- [X] T023 [US2] Filter tasks to only return those belonging to authenticated user in `backend/routes/tasks.py`
- [X] T024 [US2] Add status query parameter filter (pending, complete, all) in `backend/routes/tasks.py`
- [X] T025 [US2] Implement pagination (20-50 items per page, offset/cursor support) in `backend/routes/tasks.py`
- [X] T026 [US2] Sort tasks by created_at descending (newest first) by default in `backend/routes/tasks.py`
- [X] T027 [US2] Return empty list with 200 status when user has no tasks in `backend/routes/tasks.py`

**Checkpoint**: User Stories 1 AND 2 fully functional - users can create and view their tasks
- Toggle task status → Set completed=true (idempotent)

---

## Phase 5: User Story 3 - Update a Task (Priority: P2)

**Goal**: Enable logged-in users to modify an existing task's title or description

**Independent Test**: Create a task, update its title/description via PUT, then retrieve it to verify changes persisted

### Implementation for User Story 3

- [X] T028 [US3] Create TaskUpdate Pydantic schema (title: optional str 1-200 chars, description: optional str max 1000 chars) in `backend/schemas.py`
- [X] T029 [US3] Implement `PUT /api/tasks/{task_id}` endpoint in `backend/routes/tasks.py`
- [X] T030 [US3] Verify task exists, return 404 if not found in `backend/routes/tasks.py`
- [X] T031 [US3] Verify task belongs to authenticated user, return 403 if not in `backend/routes/tasks.py`
- [X] T032 [US3] Apply partial updates (only update provided fields) in `backend/routes/tasks.py`
- [X] T033 [US3] Update `updated_at` timestamp on successful update in `backend/routes/tasks.py`
- [X] T034 [US3] Return updated task in response in `backend/routes/tasks.py`

**Checkpoint**: User Story 3 fully functional - users can update their tasks

---

## Phase 6: User Story 4 - Mark Task Complete (Priority: P2)

**Goal**: Enable logged-in users to mark tasks as complete or reopen them

**Independent Test**: Create a task, PATCH to mark complete, then retrieve to verify status changed

### Implementation for User Story 4

- [X] T035 [US4] Create TaskStatusUpdate Pydantic schema (completed: bool) in `backend/schemas.py`
- [X] T036 [US4] PATCH /api/tasks/{task_id}/complete
- [X] T037 [US4] Verify task exists and belongs to authenticated user in `backend/routes/tasks.py`
- [X] T038 [US4] Toggle task status between pending (false) and complete (true) in `backend/routes/tasks.py`
- [X] T039 [US4] Update `updated_at` timestamp on status change in `backend/routes/tasks.py`
- [X] T040 [US4] Return updated task with new status in response in `backend/routes/tasks.py`

**Checkpoint**: User Story 4 fully functional - users can complete/reopen tasks

---

## Phase 7: User Story 5 - Delete a Task (Priority: P3)

**Goal**: Enable logged-in users to permanently remove tasks they no longer need

**Independent Test**: Create a task, DELETE it, then verify it no longer appears in task list

### Implementation for User Story 5

- [X] T041 [US5] Implement `DELETE /api/tasks/{task_id}` endpoint in `backend/routes/tasks.py`
- [X] T042 [US5] Verify task exists, return 404 if not found in `backend/routes/tasks.py`
- [X] T043 [US5] Verify task belongs to authenticated user, return 403 if not in `backend/routes/tasks.py`
- [X] T044 [US5] Permanently delete task from database in `backend/routes/tasks.py`
- [X] T045 [US5] Return 204 No Content on successful deletion in `backend/routes/tasks.py`

**Checkpoint**: User Story 5 fully functional - users can delete their tasks

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T046 [P] Add request/response logging middleware in `backend/middleware/logging.py`
- [X] T047 [P] Implement rate limiting for API endpoints in `backend/middleware/rate_limit.py`
- [X] T048 Add CORS configuration for frontend access in `backend/main.py`
- [X] T049 [P] Create health check endpoint `GET /api/health` in `backend/routes/health.py`
- [X] T050 Review and validate all error messages are user-friendly across all endpoints
- [X] T051 Verify all endpoints return within performance targets (<2s create, <1s list)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1 and US2 are both P1 and can proceed in parallel
  - US3 and US4 are both P2 and can proceed in parallel after US1/US2
  - US5 is P3 and can proceed after US3/US4
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Uses same Task model as US1/US2
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Uses same Task model as US1/US2
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - Uses same Task model as US1-4

### Within Each User Story

- Schemas before endpoints
- Core implementation before validation
- Validation before response handling
- Story complete before moving to next priority

### Parallel Opportunities

- T003, T004 can run in parallel (Setup phase)
- T006, T007, T009, T010 can run in parallel (Foundational phase)
- US1 and US2 can be developed in parallel (both P1)
- US3 and US4 can be developed in parallel (both P2)
- T046, T047, T049 can run in parallel (Polish phase)

---

## Parallel Example: Foundational Phase

```bash
# Launch foundational tasks in parallel:
Task: "Create User model in backend/models.py" (T006)
Task: "Create Task model in backend/models.py" (T007)
Task: "Create base API router in backend/main.py" (T009)
Task: "Setup error handling utilities in backend/utils/errors.py" (T010)
```


## Parallel Example: User Story 1 & 2

```bash
# After Foundational complete, launch both P1 stories:
# Developer A: User Story 1 (Create Task)
Task: "Create TaskCreate Pydantic schema" (T013)
Task: "Implement POST /api/tasks endpoint" (T015)

# Developer B: User Story 2 (View Tasks)
Task: "Create TaskListResponse Pydantic schema" (T021)
Task: "Implement GET /api/tasks endpoint" (T022)
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Create Task)
4. Complete Phase 4: User Story 2 (View Tasks)
5. **STOP and VALIDATE**: Test US1 + US2 independently
6. Deploy/demo if ready - users can now create and view tasks

### Incremental Delivery

1. Complete Setup + Foundational -> Foundation ready
2. Add User Story 1 -> Test independently (can create tasks)
3. Add User Story 2 -> Test independently (can view tasks) -> **MVP Milestone!**
4. Add User Story 3 -> Test independently (can update tasks)
5. Add User Story 4 -> Test independently (can complete tasks)
6. Add User Story 5 -> Test independently (can delete tasks) -> **Full Feature!**
7. Add Polish phase -> Production ready

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Create Task)
   - Developer B: User Story 2 (View Tasks)
3. Once P1 stories done:
   - Developer A: User Story 3 (Update Task)
   - Developer B: User Story 4 (Mark Complete)
4. Developer A or B: User Story 5 (Delete Task)
5. Team: Polish phase

---

## Summary

| Metric | Count |
|--------|-------|
| Total Tasks | 51 |
| Phase 1 (Setup) | 4 tasks |
| Phase 2 (Foundational) | 8 tasks |
| Phase 3 (US1 - Create) | 8 tasks |
| Phase 4 (US2 - View) | 7 tasks |
| Phase 5 (US3 - Update) | 7 tasks |
| Phase 6 (US4 - Complete) | 6 tasks |
| Phase 7 (US5 - Delete) | 5 tasks |
| Phase 8 (Polish) | 6 tasks |
| Parallel Opportunities | 14 tasks marked [P] |

**MVP Scope**: Setup + Foundational + US1 + US2 = 27 tasks

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- JWT authentication per spec clarifications
- Pagination default: 20-50 items per page, newest first
- All timestamps stored in UTC
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- User identity is derived from JWT token, not from URL params

## Implementation Notes (Updated)

- Backend implements full auth routes (`/api/auth/signup`, `/api/auth/login`, `/api/auth/demo`)
- User model includes password_hash for self-contained auth
- Task status uses boolean `completed` field (true/false) instead of string enum
- Demo endpoint disabled in production via ENVIRONMENT env var
- Logging middleware logs all requests with timing
- Rate limiting: 60 requests/minute per IP (configurable)