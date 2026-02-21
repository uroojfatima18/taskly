"""
Database migration script for chatbot feature.
Ensures conversation, message, and tool_call tables are created.
"""

from sqlmodel import SQLModel
from db import get_engine
from src.models.conversation import Conversation, Message
from src.models.tool_call import ToolCall


def run_migrations():
    """
    Create all tables needed for the chatbot feature.
    """
    engine = get_engine()

    # Create tables for the new models
    SQLModel.metadata.create_all(engine)

    print("✅ Chatbot tables created successfully:")
    print("- conversations")
    print("- messages")
    print("- tool_calls")


if __name__ == "__main__":
    run_migrations()