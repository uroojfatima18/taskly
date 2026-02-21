# Quickstart Guide: OpenAI Chatbot Integration

## Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL database
- OpenAI API key
- Existing task management system (from previous phases)

## Environment Setup

### Backend Configuration

1. Set up environment variables in `backend/.env`:
```bash
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=postgresql://username:password@localhost:5432/taskly_db
JWT_SECRET=your_jwt_secret
```

2. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Run database migrations:
```bash
cd backend
python -m migrations
```

### Frontend Configuration

1. Install frontend dependencies:
```bash
cd frontend
npm install
```

2. Configure environment variables in `frontend/.env.local`:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Running the System

### Development Mode

1. Start the backend server:
```bash
cd backend
uvicorn main:app --reload --port 8000
```

2. Start the frontend server:
```bash
cd frontend
npm run dev
```

3. Access the chat interface at `http://localhost:3000/chat`

## Key Components

### Backend Services

- **OpenAI Agent** (`src/agents/openai_agent.py`): Handles ChatCompletion API integration
- **MCP Server** (`src/services/mcp_server.py`): Exposes task operations as tools for the AI
- **Chat Service** (`src/services/chat_service.py`): Orchestrates AI interactions and message persistence
- **Chat API** (`src/api/chat_endpoints.py`): REST endpoints for chat functionality

### Frontend Components

- **Chat Interface** (`frontend/src/components/chat/ChatInterface.tsx`): Main chat UI
- **Message Display** (`frontend/src/components/chat/MessageBubble.tsx`): Shows user and AI messages
- **Chat API Client** (`frontend/src/services/chat_api.ts`): Communicates with backend chat API

## API Endpoints

### Chat
- `POST /api/chat/message` - Send message to AI assistant
- `GET /api/chat/conversations` - Get user's conversations
- `GET /api/chat/conversations/{id}/messages` - Get messages for conversation

### Existing Task API (still available)
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

## MCP Tools Available to AI

The AI agent can use these tools to perform task operations:

- `add_task(title, description?, status?)` - Create a new task
- `list_tasks(status_filter?)` - Get user's tasks
- `complete_task(task_id)` - Mark task as completed
- `update_task(task_id, title?, description?, status?)` - Update task properties
- `delete_task(task_id)` - Delete a task

## Testing

### Backend Tests
```bash
cd backend
pytest tests/unit/
pytest tests/integration/
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## Troubleshooting

### Common Issues

1. **OpenAI API Timeout**: Check your internet connection and API key validity
2. **JWT Authentication Errors**: Verify JWT token is included in requests
3. **Database Connection Issues**: Confirm DATABASE_URL is correct and database is running
4. **CORS Errors**: Check that frontend and backend origins are properly configured

### Debugging AI Interactions

- Enable debug logging in `src/services/chat_service.py`
- Monitor tool call execution in the MCP server logs
- Check message persistence in the database