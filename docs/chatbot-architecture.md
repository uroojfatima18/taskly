# AI Chatbot for Task Management

This feature adds an AI-powered chatbot interface to the Taskly application, allowing users to manage their tasks using natural language.

## Features

- **Natural Language Task Creation**: Create tasks by describing them in plain English
- **Task Listing**: View all tasks or filter by status using natural language
- **Task Completion**: Mark tasks as complete using conversational commands
- **Task Updates**: Modify existing tasks through chat
- **Task Deletion**: Remove tasks using natural language commands
- **Persistent Conversations**: Conversation history persists across server restarts
- **User Isolation**: Users can only access their own tasks and conversations

## Architecture

The chatbot follows a stateless architecture with persistent storage:

- **Frontend**: React-based chat interface with real-time messaging
- **Backend**: FastAPI server with LangChain-powered AI agent
- **Database**: PostgreSQL storing conversations, messages, and tool calls
- **Authentication**: JWT-based authentication using Better Auth
- **AI Processing**: LangChain with OpenAI-compatible models and MCP tools

## MCP Tools

The system uses Model Context Protocol (MCP) tools for task operations:

- `add_task`: Create new tasks
- `list_tasks`: List tasks with optional filtering
- `update_task`: Update existing tasks
- `delete_task`: Delete tasks
- `complete_task`: Mark tasks as complete/incomplete

## Implementation Details

### Backend Structure

```
backend/
├── src/
│   ├── models/
│   │   ├── conversation.py    # Conversation and Message models
│   │   └── tool_call.py       # Tool call tracking model
│   ├── services/
│   │   ├── chat_service.py    # Core chat operations
│   │   └── mcp_service.py     # MCP tools implementation
│   ├── api/
│   │   └── chat_endpoints.py  # API routes for chat functionality
│   └── lib/
│       └── ai_agent.py        # AI agent with LangChain integration
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── chat/
│   │       ├── ChatInterface.tsx   # Main chat UI component
│   │       ├── MessageBubble.tsx   # Individual message display
│   │       ├── ChatInput.tsx       # Message input component
│   │       └── TaskListDisplay.tsx # Task list visualization
│   ├── pages/
│   │   └── chat/
│   │       └── page.tsx         # Chat page (Next.js App Router)
│   ├── services/
│   │   └── chat_api.ts          # API client for chat endpoints
│   └── lib/
│       └── ai_client.ts          # High-level AI client wrapper
```

## Security

- JWT authentication required for all endpoints
- User isolation enforced at the database level
- Input validation for all user messages
- Rate limiting to prevent abuse

## Performance

- Stateless backend design scales horizontally
- Database indexing for efficient message retrieval
- Caching strategies for improved response times
- Asynchronous processing for AI interactions

## Error Handling

- Graceful degradation when AI services are unavailable
- User-friendly error messages
- Comprehensive logging for debugging
- Fallback responses for invalid inputs