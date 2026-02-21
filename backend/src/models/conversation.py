from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
from enum import Enum


class ConversationStatus(str, Enum):
    ACTIVE = "active"
    ARCHIVED = "archived"


class Conversation(SQLModel, table=True):
    """
    Represents a chat session between a user and the chatbot.
    Contains a unique identifier, user reference, creation timestamp, and last updated timestamp.
    Each user can have multiple conversations.
    """
    id: int = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)  # From JWT token
    title: Optional[str] = Field(default=None, max_length=200)
    status: ConversationStatus = Field(default=ConversationStatus.ACTIVE)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship with messages
    messages: List["Message"] = Relationship(back_populates="conversation")


class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"


class Message(SQLModel, table=True):
    """
    Represents a single message in a conversation.
    Contains the message text, role (user or assistant), timestamp, and reference to the parent conversation.
    Messages are ordered chronologically within a conversation.
    """
    id: int = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversation.id", index=True)
    role: MessageRole = Field(sa_column_kwargs={"default": MessageRole.USER})
    content: str = Field(max_length=5000)  # Support for longer messages
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    # Relationship with conversation
    conversation: Conversation = Relationship(back_populates="messages")