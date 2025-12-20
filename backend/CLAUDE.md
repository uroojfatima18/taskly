# Backend Implementation Rules

You are working inside the `backend/` directory.

## Source of Truth
- Follow tasks strictly from: `specs/001-backend-api/tasks.md`
- Follow feature spec: `specs/features/task-crud.md`
- Do NOT invent features outside the spec

## Architecture
- Framework: FastAPI
- ORM: SQLModel
- Database: PostgreSQL (DATABASE_URL from env)
- Auth: JWT via Better Auth
- User identity ONLY from JWT (no user CRUD)

## Constraints
- No frontend code
- No mock auth (NO hardcoded user_id)
- Use dependency injection for DB + auth
- Use Pydantic schemas for all requests/responses

## Workflow Rules
- Implement ONE task at a time
- Mark task as completed in tasks.md after implementation
- Do not skip phases (Foundation before User Stories)

## Output Expectations
- Production-ready code
- Clear folder structure
- Minimal comments, clean code
