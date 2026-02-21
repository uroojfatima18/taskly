# API Contracts: OpenAI Chatbot Integration

## Chat Endpoint

### POST /api/chat/message

**Description**: Send a message to the AI assistant and receive a response with potential tool calls

**Authentication**: JWT Bearer Token required

**Request Body**:
```json
{
  "message": "User's message to the AI assistant",
  "conversation_id": "UUID of existing conversation (optional, creates new if not provided)"
}
```

**Response (200 OK)**:
```json
{
  "conversation_id": "UUID of the conversation",
  "message_id": "UUID of the assistant's response message",
  "response": "AI assistant's response text",
  "tool_calls": [
    {
      "tool_name": "Name of the MCP tool called (e.g., 'add_task', 'list_tasks')",
      "parameters": "Object with parameters for the tool call",
      "result": "Result of the tool execution (if applicable)"
    }
  ],
  "timestamp": "ISO 8601 timestamp of the response"
}
```

**Error Responses**:
- 400 Bad Request: Invalid request format
- 401 Unauthorized: Missing or invalid JWT token
- 422 Unprocessable Entity: Business logic validation failed
- 500 Internal Server Error: AI service or tool execution failure

## Conversation Management

### GET /api/chat/conversations

**Description**: Retrieve list of user's conversations

**Authentication**: JWT Bearer Token required

**Response (200 OK)**:
```json
{
  "conversations": [
    {
      "id": "UUID of conversation",
      "title": "Conversation title",
      "created_at": "ISO 8601 timestamp",
      "updated_at": "ISO 8601 timestamp",
      "is_active": true
    }
  ]
}
```

### GET /api/chat/conversations/{conversation_id}/messages

**Description**: Retrieve messages for a specific conversation

**Authentication**: JWT Bearer Token required

**Path Parameters**:
- conversation_id: UUID of the conversation

**Response (200 OK)**:
```json
{
  "messages": [
    {
      "id": "UUID of message",
      "sender_type": "user|assistant",
      "content": "Message content",
      "timestamp": "ISO 8601 timestamp",
      "tool_calls": "JSON object of tool calls (assistant messages only)",
      "tool_responses": "JSON object of tool responses (assistant messages only)"
    }
  ]
}
```

## MCP Tools Contract

### Task Operations via MCP Tools

The AI agent will use these standardized tool calls:

#### add_task
```json
{
  "tool_name": "add_task",
  "parameters": {
    "title": "Task title (required)",
    "description": "Task description (optional)",
    "status": "Task status (optional, default: 'todo')"
  }
}
```

#### list_tasks
```json
{
  "tool_name": "list_tasks",
  "parameters": {
    "status_filter": "Filter by status (optional: 'todo', 'in_progress', 'completed')"
  }
}
```

#### complete_task
```json
{
  "tool_name": "complete_task",
  "parameters": {
    "task_id": "UUID of task to complete"
  }
}
```

#### update_task
```json
{
  "tool_name": "update_task",
  "parameters": {
    "task_id": "UUID of task to update",
    "title": "New title (optional)",
    "description": "New description (optional)",
    "status": "New status (optional)"
  }
}
```

#### delete_task
```json
{
  "tool_name": "delete_task",
  "parameters": {
    "task_id": "UUID of task to delete"
  }
}
```

Each tool returns a structured response indicating success or failure with relevant data.
> NOTE: Although OpenAI Agent SDK is used, the underlying model provider
> is Gemini 2.0 Flash via a ChatCompletion-compatible endpoint.
> No OpenAI-hosted models are required.
