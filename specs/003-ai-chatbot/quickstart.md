# Quickstart Guide: AI Chatbot for Task Management

This guide will help you quickly set up and test the AI chatbot functionality.

## Prerequisites

- Python 3.11+
- Node.js 18+ (for frontend)
- PostgreSQL database
- OpenAI API key (or compatible provider)

## Backend Setup

1. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. Set up environment variables in `.env`:
   ```env
   DATABASE_URL=postgresql://username:password@localhost/dbname
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-3.5-turbo  # or gpt-4
   JWT_SECRET_KEY=your_jwt_secret
   BETTER_AUTH_SECRET=your_better_auth_secret
   ```

3. Run the backend server:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

## Frontend Setup

1. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Set up environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```

3. Run the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## Testing the Chatbot

1. Navigate to `http://localhost:3000/chat` in your browser
2. Log in with your credentials
3. Start chatting with the bot using natural language commands such as:
   - "Add a task to buy groceries"
   - "Create a task: Call mom tonight with description: Discuss weekend plans"
   - "Show me all my tasks"
   - "Show me my pending tasks"
   - "Mark task 1 as complete"
   - "Complete the buy groceries task"
   - "Change task 1 to 'Call mom tonight'"
   - "Update task 2 description to 'Discuss weekend plans'"
   - "Delete task 1"
   - "Remove the old task"

## API Endpoints

The chatbot provides the following API endpoints:

- `POST /chat/conversations` - Create a new conversation
- `GET /chat/conversations` - Get all conversations for the user
- `GET /chat/conversations/{id}` - Get messages for a specific conversation
- `POST /chat/messages` - Send a message to the chatbot
- `DELETE /chat/conversations/{id}` - Delete a conversation

## Troubleshooting

- If you get authentication errors, ensure your JWT token is valid and included in requests
- If the AI responses are slow, check your OpenAI API key and rate limits
- If conversations don't persist, verify your database connection and permissions
- If tasks aren't being created/updated, ensure the MCP tools are functioning correctly