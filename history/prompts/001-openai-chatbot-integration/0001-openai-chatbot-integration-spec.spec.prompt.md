---
id: 0001
title: OpenAI Chatbot Integration Spec
stage: spec
date: 2026-01-13
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-openai-chatbot-integration
branch: 001-openai-chatbot-integration
user: unknown
command: /sp.specify
labels: ["spec", "chatbot", "openai", "integration", "ai"]
links:
  spec: "specs/001-openai-chatbot-integration/spec.md"
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-openai-chatbot-integration/spec.md
 - specs/001-openai-chatbot-integration/checklists/requirements.md
tests:
 - none
---

## Prompt

---
description: "Step 2 Specs - Integrate OpenAI ChatCompletion (Gemini-2.0-flash) into AI Chatbot - Chat Service, API, Frontend"
---

# Step 2: OpenAI ChatCompletion Integration for AI Chatbot
**Focus**: Chat Service, API Endpoints, and Frontend Integration

**Goal**: Refactor the chatbot backend and frontend to use OpenAI ChatCompletion (`gemini-2.0-flash`) while keeping MCP tools, stateless backend, and conversation persistence intact.

**Prerequisites**:
- Step 1 completed (full chatbot implemented)
- Backend and frontend folder structure from Step 1
- Working MCP tools for CRUD + complete task operations
- JWT authentication and database integration in place

---

## Phase 2.3: Update Chat Service

**Objective**: Integrate new OpenAI ChatCompletion-based agent into backend chat service

- [ ] T201 Refactor `backend/src/services/chat_service.py` to invoke OpenAI ChatCompletion agent for processing messages
- [ ] T202 Load conversation context from database and pass it to the agent for each message
- [ ] T203 Ensure agent returns:
  - Assistant response text
  - Tool calls executed (MCP operations)
- [ ] T204 Save all assistant messages and tool call outputs to database
- [ ] T205 Preserve stateless backend behavior (no in-memory session state)
- [ ] T206 Implement proper error handling and retries for OpenAI API failures

**Rationale**: Keeps conversation stateless while leveraging OpenAI ChatCompletion for natural language processing.

---

## Phase 2.4: Update Chat API Endpoints

**Objective**: Connect frontend to the updated agent via REST API

- [ ] T207 Update `backend/src/api/chat_endpoints.py` to call the new agent from chat service
- [ ] T208 Maintain JWT authentication and user-level isolation
- [ ] T209 Validate input messages before sending to agent
- [ ] T210 Ensure API responses include:
  - `assistant_message`: the text from AI agent
  - `tool_calls`: structured MCP operations executed
  - Optional metadata (latency, tokens, request ID)
- [ ] T211 Update API error handling to propagate useful messages to frontend

**Rationale**: Provides a clean, stateless interface for frontend communication with the OpenAI agent.

---

## Phase 2.5: Frontend Integration

**Objective**: Ensure frontend chat UI works seamlessly with updated agent

- [ ] T212 Update `frontend/src/services/chat_api.ts` to match any endpoint changes
- [ ] T213 Verify `ChatInterface.tsx` correctly displays assistant messages from OpenAI agent
- [ ] T214 Ensure `MessageBubble.tsx` shows both user and assistant messages properly
- [ ] T215 Ensure `TaskListDisplay.tsx` updates in real-time when MCP tool actions occur
- [ ] T216 Ensure `ChatInput.tsx` sends messages to updated chat API and handles loading states
- [ ] T217 Optional: add latency/spinner indicators for OpenAI API calls
- [ ] T218 Test full end-to-end flow: user sends message → agent responds → tool executes → frontend updates

**Rationale**: Provides smooth real-time user experience with new OpenAI-based backend agent while keeping previous task management features

## Response snapshot

Successfully created a comprehensive feature specification for integrating OpenAI ChatCompletion into the AI Chatbot. The specification includes user scenarios, functional requirements, key entities, and success criteria, with a focus on enabling natural language interactions while preserving existing MCP tool functionality.

## Outcome

- ✅ Impact: Created complete feature specification for OpenAI ChatCompletion integration with user stories, requirements, and success metrics
- 🧪 Tests: none
- 📁 Files: specs/001-openai-chatbot-integration/spec.md, specs/001-openai-chatbot-integration/checklists/requirements.md
- 🔁 Next prompts: /sp.plan to create implementation plan, /sp.tasks to break down implementation tasks
- 🧠 Reflection: The specification balances AI capabilities with existing MCP tools, ensuring a seamless user experience while maintaining system reliability.

## Evaluation notes (flywheel)

- Failure modes observed: None - successful creation of complete specification with proper validation checklist
- Graders run and results (PASS/FAIL): PASS - all validation criteria met, no [NEEDS CLARIFICATION] markers remaining
- Prompt variant (if applicable): Standard spec creation workflow
- Next experiment (smallest change to try): Proceed to planning phase to design the technical implementation
