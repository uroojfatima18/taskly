from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from src.models.conversation import Conversation, Message, MessageRole
from src.agents.openai_agent import GeminiOpenAIAgent
from src.services.mcp_server import MCPServer
from datetime import datetime


class ChatService:
    """
    Core service for handling chat operations.
    Manages conversations, messages, and interaction with the AI agent.
    """

    def __init__(self, db_session: Session):
        self.db_session = db_session

    async def create_conversation(self, user_id: str, title: Optional[str] = None) -> Conversation:
        """
        Create a new conversation for the user.
        """
        conversation = Conversation(
            user_id=user_id,
            title=title or "New Conversation"
        )

        self.db_session.add(conversation)
        self.db_session.commit()
        self.db_session.refresh(conversation)

        return conversation

    async def get_conversation(self, conversation_id: int, user_id: str) -> Optional[Conversation]:
        """
        Retrieve a specific conversation for the user.
        """
        return self.db_session.query(Conversation)\
            .filter(Conversation.id == conversation_id, Conversation.user_id == user_id)\
            .first()

    async def get_user_conversations(self, user_id: str) -> List[Conversation]:
        """
        Retrieve all conversations for the user.
        """
        return self.db_session.query(Conversation)\
            .filter(Conversation.user_id == user_id)\
            .order_by(Conversation.updated_at.desc())\
            .all()

    async def add_message_to_conversation(self, conversation_id: int, role: MessageRole, content: str) -> Message:
        """
        Add a message to a conversation.
        """
        message = Message(
            conversation_id=conversation_id,
            role=role,
            content=content
        )

        self.db_session.add(message)
        self.db_session.commit()
        self.db_session.refresh(message)

        # Update the conversation's last updated time
        conversation = await self.get_conversation(conversation_id, message.conversation.user_id)
        conversation.updated_at = datetime.utcnow()
        self.db_session.commit()

        return message

    async def get_conversation_messages(self, conversation_id: int) -> List[Message]:
        """
        Retrieve all messages for a conversation.
        """
        return self.db_session.query(Message)\
            .filter(Message.conversation_id == conversation_id)\
            .order_by(Message.timestamp.asc())\
            .all()

    async def process_user_message(self, conversation_id: int, user_id: str, user_message: str) -> Dict[str, Any]:
        """
        Process a user message through the AI agent and return the response.
        This includes saving the user message, getting AI response, and saving it.
        Enhanced to support tool calls for task operations.
        """
        # First, save the user's message
        user_msg = await self.add_message_to_conversation(
            conversation_id=conversation_id,
            role=MessageRole.USER,
            content=user_message
        )

        # Get conversation history for context
        conversation_history = await self.get_conversation_messages(conversation_id)

        # Format history for the AI agent
        formatted_history = []
        for msg in conversation_history[:-1]:  # Exclude the current message we just added
            formatted_history.append({
                "role": msg.role.value,
                "content": msg.content
            })

        # Create MCP server for tool access
        mcp_server = MCPServer(self.db_session, user_id)

        # Create the enhanced AI agent with tool calling capabilities
        ai_agent = GeminiOpenAIAgent()

        # Process the message through the AI agent with tool support
        result = await ai_agent.process_message(
            user_message=user_message,
            conversation_history=formatted_history,
            user_id=user_id,
            mcp_server=mcp_server
        )

        if result["success"]:
            ai_response = result["response"]
        else:
            ai_response = f"Sorry, I encountered an error: {result.get('error', 'Unknown error')}. Please try again."

        # Save the AI's response
        ai_msg = await self.add_message_to_conversation(
            conversation_id=conversation_id,
            role=MessageRole.ASSISTANT,
            content=ai_response
        )

        return {
            "user_message": user_msg,
            "ai_response": ai_response,
            "conversation_id": conversation_id,
            "tool_calls": result.get("tool_calls", [])
        }

    async def delete_conversation(self, conversation_id: int, user_id: str) -> bool:
        """
        Delete a conversation and all its messages.
        """
        conversation = await self.get_conversation(conversation_id, user_id)
        if not conversation:
            return False

        # Delete all messages in the conversation first (due to foreign key constraint)
        self.db_session.query(Message).filter(Message.conversation_id == conversation_id).delete()

        # Delete the conversation
        self.db_session.delete(conversation)
        self.db_session.commit()

        return True

    async def update_conversation_title(self, conversation_id: int, user_id: str, title: str) -> Optional[Conversation]:
        """
        Update the title of a conversation.
        """
        conversation = await self.get_conversation(conversation_id, user_id)
        if not conversation:
            return None

        conversation.title = title
        conversation.updated_at = datetime.utcnow()
        self.db_session.commit()
        self.db_session.refresh(conversation)

        return conversation