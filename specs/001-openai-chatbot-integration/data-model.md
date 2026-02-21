# Data Model: OpenAI Chatbot Integration

## New Entities

### Conversation
Represents a chat session between user and AI assistant

- **id**: UUID (primary key)
- **user_id**: UUID (foreign key to users table, required)
- **title**: String (optional, auto-generated from first message)
- **created_at**: DateTime (required, auto-generated)
- **updated_at**: DateTime (required, auto-generated)
- **is_active**: Boolean (default: true)

**Relationships**:
- One-to-many with Messages (conversation has many messages)

**Validation**:
- user_id must exist in users table
- created_at and updated_at are automatically managed

### Message
Individual communication unit in a conversation

- **id**: UUID (primary key)
- **conversation_id**: UUID (foreign key to conversations table, required)
- **sender_type**: Enum ('user' | 'assistant', required)
- **content**: Text (required, max 10000 characters)
- **tool_calls**: JSON (optional, structured data for MCP tool calls)
- **tool_responses**: JSON (optional, responses from executed tools)
- **timestamp**: DateTime (required, auto-generated)
- **message_metadata**: JSON (optional, additional data for AI context)

**Relationships**:
- Many-to-one with Conversation (message belongs to one conversation)

**Validation**:
- conversation_id must exist in conversations table
- sender_type must be 'user' or 'assistant'
- content length must be 1-10000 characters

## Modified Entities

### Task (Existing - No Changes)
The existing task entity remains unchanged to maintain compatibility with existing functionality:

- **id**: UUID (primary key)
- **user_id**: UUID (foreign key to users table, required)
- **title**: String (required, 1-200 characters)
- **description**: Text (optional, max 1000 characters)
- **status**: Enum ('todo' | 'in_progress' | 'completed', default: 'todo')
- **created_at**: DateTime (required, auto-generated)
- **updated_at**: DateTime (required, auto-generated)

## Database Relationships

```
Users (1) <---> (Many) Conversations (1) <---> (Many) Messages
                        |
                        v
                (Through MCP Tools) <---> Tasks
```

## State Transitions

### Conversation
- `is_active: true` -> `is_active: false` (when conversation is archived/closed)

### Message
- No state transitions - messages are immutable once created

## Indexes
- conversations.user_id (for user isolation queries)
- conversations.created_at (for chronological ordering)
- messages.conversation_id (for conversation history retrieval)
- messages.timestamp (for chronological ordering within conversations)