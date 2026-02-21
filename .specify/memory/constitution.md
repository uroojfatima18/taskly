<!--
Sync Impact Report
==================
Version change: 1.0.0 → 1.1.0
Bump rationale: MINOR - Added Phase III AI Chatbot architecture principles and responsibilities

Modified principles: None (existing principles I-V unchanged)

Added sections:
- Phase III: AI Chatbot Architecture (new major section)
  - Purpose & Scope
  - Core Principle
  - Stateless Design Guarantee
  - Component Responsibilities (Database, MCP Server, AI Agent, Chat API)
  - Authentication & Security
  - Success Criteria

Removed sections: None

Templates requiring updates:
- .specify/templates/plan-template.md: ✅ No changes needed (Constitution Check section is generic)
- .specify/templates/spec-template.md: ✅ No changes needed (requirements section aligns with principles)
- .specify/templates/tasks-template.md: ✅ No changes needed (task categorization supports new architecture)

Follow-up TODOs: None
-->

# Taskly - Todo App Constitution

## Core Principles

### I. Coding Standards

All code MUST adhere to language-specific style guidelines and strict type safety requirements:

- **Python**: MUST be PEP8 compliant. Use linters (flake8, black) to enforce.
- **TypeScript**: MUST use strict mode with `"strict": true` in tsconfig.json. No implicit `any` types allowed.
- **Tailwind CSS**: MUST use utility classes exclusively. No inline CSS styles permitted.

**Rationale**: Consistent code style reduces cognitive load during code review and enables automated quality checks.

### II. Commit & PR Rules

All version control operations MUST follow these rules:

- Commit messages MUST be meaningful and describe the change's purpose (not just "fix" or "update").
- Pull requests MUST pass all automated tests before merge approval.
- PRs SHOULD include a brief description of changes and testing performed.

**Rationale**: Clear commit history enables efficient debugging and knowledge transfer; passing tests prevent regressions.

### III. Testing

Testing is mandatory at all layers of the application:

- **Backend**: Unit tests MUST exist for all API endpoints. Use pytest for Python backend.
- **Frontend**: Component rendering tests AND API integration tests MUST be implemented.
- Test coverage SHOULD be maintained at a reasonable level for critical paths.

**Rationale**: Tests provide confidence in deployments and serve as living documentation of expected behavior.

### IV. Security

Security MUST be enforced at every layer:

- **Authentication**: JWT tokens MUST be required for all API endpoints (except health checks and public routes).
- **Secrets Management**: No secrets, tokens, or credentials in code. All sensitive values MUST use `.env` files and environment variables.
- **User Isolation**: Users MUST only access their own data. Backend MUST enforce ownership checks on all data operations.
- **Input Validation**: All user input MUST be validated and sanitized.

**Rationale**: Security vulnerabilities can compromise user data and trust; defense-in-depth is mandatory.

### V. Architecture Principles

Development MUST follow these architectural guidelines:

- **Smallest Viable Change**: Each feature/fix MUST be the minimal diff required. No unrelated refactoring.
- **RESTful APIs**: All endpoints MUST use proper HTTP methods and return appropriate status codes (200, 201, 400, 401, 404, 500).
- **Spec-Driven**: Implementation MUST follow specifications in `/specs/`. No ad-hoc feature additions.

**Rationale**: Small changes reduce risk; REST conventions ensure predictable API behavior; specs provide alignment.

## Development Workflow

All development MUST follow this workflow:

1. **Read Spec First**: Before implementing, read the relevant specification in `/specs/features/`.
2. **Backend First**: Implement API endpoints before frontend integration.
3. **Test as You Go**: Write tests alongside implementation, not after.
4. **PR Review**: All changes require review before merging to main branch.

**Environment Setup**:
- Backend: `cd backend && uvicorn main:app --reload --port 8000`
- Frontend: `cd frontend && npm run dev`

## Phase III: AI Chatbot Architecture

### Purpose

Phase III extends the Phase II Todo Full-Stack Web Application by introducing an AI-powered chatbot that allows users to manage their todo tasks using natural language.

The chatbot acts as an intelligent interface on top of the existing task CRUD functionality and does NOT replace or modify the existing REST API or frontend UI.

### Scope

**In Scope**:
- Natural language chat interface for task management
- AI agent that interprets user intent
- MCP (Model Context Protocol) tools for task operations
- Stateless backend architecture
- Persistent conversation history stored in database
- Integration with existing authentication (Better Auth + JWT)

**Out of Scope**:
- Redesign of existing task CRUD REST APIs
- Changes to authentication or user management
- Task recommendations, scheduling, or reminders
- Vector databases or embeddings
- Voice input or multimodal features

### Core Principle

**Phase III does NOT introduce new business logic.**

All task operations performed by the chatbot MUST map directly to the same task operations already implemented in Phase II.

> Phase II: Humans click buttons to manage tasks
> Phase III: AI uses tools to manage tasks on behalf of humans

### Architecture Overview

The system follows a stateless, tool-driven AI architecture:

- The backend holds no in-memory state
- All conversation context is reconstructed from the database
- The AI agent never accesses the database directly
- All task operations are executed exclusively through MCP tools

**High-level flow**:

1. User sends a chat message
2. Backend loads conversation history from database
3. AI agent processes the message
4. Agent invokes MCP tools as needed
5. MCP tools read/write to the existing tasks table
6. Assistant response is stored and returned

### Stateless Design Guarantee

The backend server MUST remain stateless at all times:

- No session storage
- No in-memory conversation state
- No cached task state

If the server restarts, all conversations MUST continue correctly by reconstructing state from the database.

**Rationale**: Stateless design ensures horizontal scalability, simplifies deployment, and eliminates state synchronization issues.

### Database Responsibility

**Existing Tables (Phase II)**:
- `tasks` table remains unchanged
- Task ownership is enforced by `user_id`

**New Tables (Phase III)**:
- `conversations`: Represents a chat session per user
- `messages`: Stores user and assistant messages for each conversation

No AI-related metadata (embeddings, scores, memory) is stored.

**Rationale**: Simple schema keeps the system maintainable and avoids premature optimization.

### MCP Server Responsibility

The MCP server exposes task operations as tools:

- `add_task`
- `list_tasks`
- `complete_task`
- `update_task`
- `delete_task`

**Rules**:
- Tools are stateless
- Each tool performs exactly one task operation
- Tools operate only on authenticated user data
- Tools return structured responses defined in spec

**Rationale**: MCP tools provide a clean abstraction layer between AI and business logic, ensuring consistency with existing REST APIs.

### AI Agent Responsibility

The AI agent is responsible for:

- Interpreting natural language user input
- Selecting the correct MCP tool(s)
- Passing valid parameters to tools
- Generating friendly confirmation responses
- Handling errors gracefully

The agent MUST NEVER:
- Access the database directly
- Invent task IDs
- Perform task logic internally

**Rationale**: Clear separation of concerns ensures the AI layer remains a pure interface without business logic.

### Chat API Responsibility

A single chat endpoint orchestrates the system:

- Accepts user message input
- Loads conversation history
- Invokes the AI agent
- Persists messages
- Returns assistant response and tool usage

The chat endpoint is stateless and idempotent.

**Rationale**: Single endpoint simplifies client integration and maintains consistency with REST principles.

### Authentication & Security

- All chat requests MUST require a valid JWT
- User identity is derived from the JWT token
- The `user_id` in requests MUST match the authenticated user
- MCP tools MUST enforce user-level task isolation

**Rationale**: Consistent authentication across REST and chat APIs prevents security gaps.

### Success Criteria

Phase III is considered complete when:

- Users can add, list, update, complete, and delete tasks via chat
- The chatbot uses MCP tools for all task operations
- Conversations persist across server restarts
- Backend remains stateless
- System follows spec-driven development principles

## Governance

This constitution establishes the authoritative rules for the Taskly Todo App project:

- **Supremacy**: This constitution supersedes all other development practices. Conflicts MUST be resolved in favor of constitution principles.
- **Amendments**: Changes to this constitution require documentation of rationale and versioning update.
- **Compliance**: All PRs and code reviews MUST verify compliance with these principles.
- **Exceptions**: Any deviation from these principles MUST be documented with justification in the PR description.

**Version**: 1.1.0 | **Ratified**: 2025-12-11 | **Last Amended**: 2026-01-13
