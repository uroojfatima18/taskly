# OpenAI (Gemini 2.0 Flash) Chatbot Integration

## Overview
This feature implements an AI-powered chatbot that integrates with the task management system. The chatbot uses either OpenAI or Google Gemini models to process natural language requests and perform task operations using MCP (Model Context Protocol) tools.

## Architecture

### Backend Components

#### Models
- `Conversation`: Represents a chat session between a user and the chatbot
- `Message`: Represents individual messages in a conversation
- `ToolCall`: Represents actions taken by the chatbot to perform task operations

#### Services
- `ChatService`: Core service for handling chat operations, managing conversations and messages
- `MCPServer`: Handles communication between the AI agent and task management system tools
- `MCPService`: Defines MCP tools for task operations (create, list, update, delete, complete tasks)

#### Agents
- `OpenAIAgent`: Uses OpenAI's ChatCompletion API with function calling capabilities
- `GeminiAgent`: Uses Google Gemini API with function calling capabilities
- `GeminiOpenAIAgent`: Unified agent that selects between OpenAI and Gemini based on configuration

#### API Endpoints
- `POST /chat/conversations`: Create a new conversation
- `GET /chat/conversations`: Get all conversations for the user
- `GET /chat/conversations/{conversation_id}`: Get messages for a specific conversation
- `POST /chat/messages`: Send a message to the chatbot and receive a response
- `DELETE /chat/conversations/{conversation_id}`: Delete a conversation

### Frontend Components

#### Services
- `chat_api.ts`: API service for chat operations
- `ai_client.ts`: Client service for AI interactions with retry logic

#### Components
- `ChatInterface`: Main chat interface component
- `MessageBubble`: Displays individual messages with proper formatting
- `ChatInput`: Input component for sending messages
- `TaskListDisplay`: Displays tasks returned by the AI agent

## Configuration

### Environment Variables

#### Backend
```bash
# API Keys
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key

# Model Selection
OPENAI_MODEL=gpt-3.5-turbo  # or gpt-4
GEMINI_MODEL=gemini-1.5-flash

# Configuration
OPENAI_TEMPERATURE=0.7
OPENAI_MAX_TOKENS=1000
GEMINI_TEMPERATURE=0.7
GEMINI_MAX_TOKENS=1000

# Retry Logic
OPENAI_MAX_RETRIES=3
OPENAI_RETRY_DELAY=1.0
GEMINI_MAX_RETRIES=3
GEMINI_RETRY_DELAY=1.0
```

#### Frontend
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

## Features

### Core Chat Functionality
- Create and manage multiple conversations per user
- Real-time chat interface with message history
- JWT authentication for secure access
- Automatic conversation title generation

### Task Operations via Natural Language
- Create tasks: "Add a task to buy groceries"
- List tasks: "Show my tasks" or "What do I have to do?"
- Update tasks: "Change the title of task 1 to 'Updated title'"
- Complete tasks: "Mark task 1 as complete" or "Finish the grocery task"
- Delete tasks: "Delete task 1"

### Advanced Features
- Tool calling capabilities for task operations
- Conversation context preservation
- Response time optimization (<5s target)
- API failure resilience with retry logic
- Rate limiting and quota management
- Error handling and graceful degradation

## Error Handling

### API Failures
- Retry logic with exponential backoff
- Circuit breaker pattern for API failures
- Graceful degradation when AI services are unavailable
- Fallback responses when AI is unavailable

### Validation
- Input validation to prevent injection attacks
- Parameter validation for tool calls
- Authentication and authorization checks
- Rate limiting to prevent abuse

## Security

### Authentication
- JWT-based authentication for all endpoints
- User isolation to prevent cross-user data access
- Secure API key storage in environment variables

### Data Protection
- Encrypted API key transmission
- Input sanitization to prevent injection attacks
- Proper access controls on conversations and messages

## Testing

### Backend Tests
- Unit tests for all services and agents
- Integration tests for API endpoints
- Error handling tests
- Tool execution tests

### Frontend Tests
- Component tests for UI elements
- Service tests for API interactions
- End-to-end tests for user flows

## Deployment

### Backend
```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export OPENAI_API_KEY=your_key_here
export GEMINI_API_KEY=your_key_here

# Run the application
uvicorn main:app --reload
```

### Frontend
```bash
# Install dependencies
npm install

# Set environment variables
export NEXT_PUBLIC_API_BASE_URL=http://your-backend-url/api

# Run the application
npm run dev
```

## API Examples

### Creating a Conversation
```javascript
const response = await fetch('/api/chat/conversations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token'
  },
  body: JSON.stringify({
    title: 'My New Chat'
  })
});
```

### Sending a Message
```javascript
const response = await fetch('/api/chat/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token'
  },
  body: JSON.stringify({
    conversation_id: 1,
    message: 'Create a task to buy groceries'
  })
});
```

## Best Practices

### Performance
- Optimize database queries for message retrieval
- Implement caching for frequently accessed data
- Use connection pooling for database operations
- Monitor response times and optimize as needed

### Scalability
- Design for horizontal scaling
- Use database indexing appropriately
- Implement proper load balancing
- Monitor resource usage and scale accordingly

### Maintenance
- Comprehensive logging for debugging
- Structured error reporting
- Regular backup of conversation data
- Automated testing for all components

## Future Enhancements

### Planned Features
- Voice input/output capabilities
- Rich media support in messages
- Advanced analytics and insights
- Multi-language support
- Advanced task scheduling
- Team collaboration features

### Improvements
- Enhanced context understanding
- Better error recovery mechanisms
- Improved response personalization
- Advanced conversation memory