---
id: 0001
title: Update Constitution Phase III Chatbot
stage: constitution
date: 2026-01-13
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 002-frontend-task-management
user: Urooj Fatima
command: /sp.constitution
labels: ["constitution", "phase-3", "ai-chatbot", "architecture", "mcp", "stateless"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - none
---

## Prompt

```text
now update constitution  # Phase III Constitution — Todo AI Chatbot

## 1. Purpose

Phase III extends the Phase II Todo Full-Stack Web Application by introducing an
AI-powered chatbot that allows users to manage their todo tasks using natural
language.

The chatbot acts as an intelligent interface on top of the existing task CRUD
functionality and does not replace or modify the existing REST API or frontend UI.

---

## 2. Scope

### In Scope
- Natural language chat interface for task management
- AI agent that interprets user intent
- MCP (Model Context Protocol) tools for task operations
- Stateless backend architecture
- Persistent conversation history stored in database
- Integration with existing authentication (Better Auth + JWT)

### Out of Scope
- Redesign of existing task CRUD REST APIs
- Changes to authentication or user management
- Task recommendations, scheduling, or reminders
- Vector databases or embeddings
- Voice input or multimodal features

---

## 3. Core Principle

**Phase III does not introduce new business logic.**

All task operations performed by the chatbot must map directly to the same task
operations already implemented in Phase II.

> Phase II: Humans click buttons to manage tasks
> Phase III: AI uses tools to manage tasks on behalf of humans

---

## 4. Architecture Overview

The system follows a stateless, tool-driven AI architecture:

- The backend holds no in-memory state
- All conversation context is reconstructed from the database
- The AI agent never accesses the database directly
- All task operations are executed exclusively through MCP tools

High-level flow:

1. User sends a chat message
2. Backend loads conversation history from database
3. AI agent processes the message
4. Agent invokes MCP tools as needed
5. MCP tools read/write to the existing tasks table
6. Assistant response is stored and returned

---

## 5. Stateless Design Guarantee

The backend server must remain stateless at all times:

- No session storage
- No in-memory conversation state
- No cached task state

If the server restarts, all conversations must continue correctly by reconstructing
state from the database.

---

## 6. Database Responsibility

### Existing Tables (Phase II)
- `tasks` table remains unchanged
- Task ownership is enforced by `user_id`

### New Tables (Phase III)
- `conversations`: Represents a chat session per user
- `messages`: Stores user and assistant messages for each conversation

No AI-related metadata (embeddings, scores, memory) is stored.

---

## 7. MCP Server Responsibility

The MCP server exposes task operations as tools:

- add_task
- list_tasks
- complete_task
- update_task
- delete_task

Rules:
- Tools are stateless
- Each tool performs exactly one task operation
- Tools operate only on authenticated user data
- Tools return structured responses defined in spec

---

## 8. AI Agent Responsibility

The AI agent is responsible for:

- Interpreting natural language user input
- Selecting the correct MCP tool(s)
- Passing valid parameters to tools
- Generating friendly confirmation responses
- Handling errors gracefully

The agent must never:
- Access the database directly
- Invent task IDs
- Perform task logic internally

---

## 9. Chat API Responsibility

A single chat endpoint orchestrates the system:

- Accepts user message input
- Loads conversation history
- Invokes the AI agent
- Persists messages
- Returns assistant response and tool usage

The chat endpoint is stateless and idempotent.

---

## 10. Authentication & Security

- All chat requests require a valid JWT
- User identity is derived from the JWT token
- The `user_id` in requests must match the authenticated user
- MCP tools enforce user-level task isolation

---

## 11. Success Criteria

Phase III is considered complete when:

- Users can add, list, update, complete, and delete tasks via chat
- The chatbot uses MCP tools for all task operations
- Conversations persist across server restarts
- Backend remains stateless
- System follows spec-driven development principles

---

## 12. Non-Goals

The following are explicitly not goals of P
```

## Response snapshot

Updated constitution from v1.0.0 to v1.1.0 (MINOR version bump) by adding Phase III AI Chatbot Architecture section.

**Changes Made**:
- Added comprehensive Phase III section covering:
  - Purpose & Scope (in-scope and out-of-scope items)
  - Core Principle (no new business logic)
  - Architecture Overview (stateless, tool-driven design)
  - Stateless Design Guarantee
  - Component Responsibilities (Database, MCP Server, AI Agent, Chat API)
  - Authentication & Security requirements
  - Success Criteria

- Preserved all existing Core Principles (I-V):
  - Coding Standards
  - Commit & PR Rules
  - Testing
  - Security
  - Architecture Principles

- Updated governance metadata:
  - Version: 1.0.0 → 1.1.0
  - Last Amended: 2026-01-13

**Sync Impact Report** (prepended as HTML comment):
- No template updates required
- All existing templates remain compatible
- No follow-up TODOs

**File Modified**: `.specify/memory/constitution.md`

## Outcome

- ✅ Impact: Constitution successfully updated with Phase III AI Chatbot architecture principles. MINOR version bump (1.0.0 → 1.1.0) reflects additive change without breaking existing principles.
- 🧪 Tests: N/A - Constitution updates are governance documents without executable tests
- 📁 Files: 1 file modified (.specify/memory/constitution.md)
- 🔁 Next prompts: Consider running `/sp.specify` to create Phase III feature spec, or `/sp.plan` to design implementation architecture
- 🧠 Reflection: Phase III architecture emphasizes stateless design and clear separation of concerns (AI agent → MCP tools → database). This prevents the AI from directly accessing business logic or data, maintaining consistency with Phase II REST APIs.

## Evaluation notes (flywheel)

- Failure modes observed: None - Constitution update completed successfully with proper versioning and sync impact analysis
- Graders run and results (PASS/FAIL): Manual validation PASS - No unresolved placeholders, proper semantic versioning applied, all rationales provided
- Prompt variant (if applicable): N/A - Standard constitution update workflow
- Next experiment (smallest change to try): N/A - Constitution is now ready to guide Phase III implementation
