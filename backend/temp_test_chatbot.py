"""
Test suite for the OpenAI Chatbot Integration feature.
Tests all aspects of the chatbot functionality including:
- Conversation management
- Message processing
- Tool calling capabilities
- Error handling
"""
import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel
from backend.src.models.conversation import Conversation, Message, MessageRole
from backend.src.services.chat_service import ChatService
from backend.src.services.mcp_server import MCPServer
from backend.src.agents.openai_agent import GeminiOpenAIAgent


@pytest.fixture
def db_session():
    """Create a test database session"""
    engine = create_engine("sqlite:///:memory:")
    SQLModel.metadata.create_all(engine)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()
    yield session
    session.close()


@pytest.fixture
def sample_user_id():
    """Sample user ID for testing"""
    return "test-user-123"


@pytest.mark.asyncio
async def test_create_conversation(db_session, sample_user_id):
    """Test creating a new conversation"""
    chat_service = ChatService(db_session)

    conversation = await chat_service.create_conversation(sample_user_id, "Test Conversation")

    assert conversation.user_id == sample_user_id
    assert conversation.title == "Test Conversation"
    assert db_session.query(Conversation).filter_by(id=conversation.id).first() is not None


@pytest.mark.asyncio
async def test_add_message_to_conversation(db_session, sample_user_id):
    """Test adding a message to a conversation"""
    chat_service = ChatService(db_session)

    # Create a conversation first
    conversation = await chat_service.create_conversation(sample_user_id, "Test Conversation")

    # Add a message
    message = await chat_service.add_message_to_conversation(
        conversation_id=conversation.id,
        role=MessageRole.USER,
        content="Hello, world!"
    )

    assert message.conversation_id == conversation.id
    assert message.role == MessageRole.USER
    assert message.content == "Hello, world!"

    # Verify the message exists in the database
    db_message = db_session.query(Message).filter_by(id=message.id).first()
    assert db_message is not None


@pytest.mark.asyncio
async def test_get_conversation_messages(db_session, sample_user_id):
    """Test retrieving messages from a conversation"""
    chat_service = ChatService(db_session)

    # Create a conversation and add messages
    conversation = await chat_service.create_conversation(sample_user_id, "Test Conversation")

    await chat_service.add_message_to_conversation(
        conversation_id=conversation.id,
        role=MessageRole.USER,
        content="First message"
    )

    await chat_service.add_message_to_conversation(
        conversation_id=conversation.id,
        role=MessageRole.ASSISTANT,
        content="Second message"
    )

    # Retrieve messages
    messages = await chat_service.get_conversation_messages(conversation.id)

    assert len(messages) == 2
    assert messages[0].content == "First message"
    assert messages[1].content == "Second message"


@pytest.mark.asyncio
async def test_process_user_message(db_session, sample_user_id):
    """Test processing a user message through the AI agent"""
    chat_service = ChatService(db_session)

    # Create a conversation
    conversation = await chat_service.create_conversation(sample_user_id, "Test Conversation")

    # Mock the AI agent response since we don't want to call the real API in tests
    with patch('backend.src.agents.openai_agent.GeminiOpenAIAgent') as mock_agent_class:
        mock_agent_instance = AsyncMock()
        mock_agent_instance.process_message.return_value = {
            "success": True,
            "response": "This is a test response",
            "tool_calls": []
        }
        mock_agent_class.return_value = mock_agent_instance

        # Process a user message
        result = await chat_service.process_user_message(
            conversation_id=conversation.id,
            user_id=sample_user_id,
            user_message="Test message"
        )

        assert result["ai_response"] == "This is a test response"
        assert result["conversation_id"] == conversation.id


@pytest.mark.asyncio
async def test_mcp_server_tool_execution(db_session, sample_user_id):
    """Test MCP server tool execution"""
    mcp_server = MCPServer(db_session, sample_user_id)

    # Get available tools
    tools = await mcp_server.get_available_tools()

    # Verify that tools are returned
    assert len(tools) > 0

    # Test tool execution with a mock tool
    # Note: Actual tool testing would require setting up proper test data


@pytest.mark.asyncio
async def test_gemini_openai_agent_initialization():
    """Test initialization of the unified AI agent"""
    # Test when no API keys are set (should raise ValueError)
    with patch.dict('os.environ', {}, clear=True):
        with pytest.raises(ValueError, match="Either GEMINI_API_KEY or OPENAI_API_KEY must be set"):
            GeminiOpenAIAgent()

    # Test when OpenAI key is set
    with patch.dict('os.environ', {'OPENAI_API_KEY': 'test-key'}):
        agent = GeminiOpenAIAgent()
        assert agent.current_agent == "openai"

    # Test when Gemini key is set
    with patch.dict('os.environ', {'GEMINI_API_KEY': 'test-key', 'OPENAI_API_KEY': ''}):
        agent = GeminiOpenAIAgent()
        assert agent.current_agent == "gemini"


@pytest.mark.asyncio
async def test_error_handling_in_process_user_message(db_session, sample_user_id):
    """Test error handling in the process_user_message method"""
    chat_service = ChatService(db_session)

    # Create a conversation
    conversation = await chat_service.create_conversation(sample_user_id, "Test Conversation")

    # Mock the AI agent to raise an exception
    with patch('backend.src.agents.openai_agent.GeminiOpenAIAgent') as mock_agent_class:
        mock_agent_instance = AsyncMock()
        mock_agent_instance.process_message.side_effect = Exception("Test error")
        mock_agent_class.return_value = mock_agent_instance

        # Process a user message - should handle the error gracefully
        result = await chat_service.process_user_message(
            conversation_id=conversation.id,
            user_id=sample_user_id,
            user_message="Test message"
        )

        # Should return an error response instead of crashing
        assert "error" in result["ai_response"]


if __name__ == "__main__":
    pytest.main([__file__])