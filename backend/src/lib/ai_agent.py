import asyncio
from typing import Dict, Any, List, Optional
from src.services.mcp_service import MCPTaskService, MCPBaseTool
from src.models.conversation import Message, Conversation
from langchain_core.tools import BaseTool
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.agents.agent import AgentExecutor
from langchain.agents.openai_functions_agent.base import create_openai_functions_agent
import os


class AIAgent:
    """
    Base AI agent framework that handles natural language processing
    and maps user intents to appropriate MCP tools.
    """

    def __init__(self, db_session, user_id: str):
        self.db_session = db_session
        self.user_id = user_id

        # Initialize OpenAI model (or alternative)
        self.model = ChatOpenAI(
            model=os.getenv("OPENAI_MODEL", "gpt-3.5-turbo"),
            temperature=float(os.getenv("OPENAI_TEMPERATURE", "0.7"))
        )

        # Initialize task service
        self.task_service = MCPTaskService(db_session, user_id)

        # Load tools dynamically
        self.tools: List[MCPBaseTool] = []
        self._load_tools()

        # Create the agent
        self.agent_executor = self._create_agent()

    def _load_tools(self):
        """
        Load all available MCP tools for this user.
        """
        # Get all available task tools
        task_tools = asyncio.run(self.task_service.get_task_tools())
        self.tools.extend(task_tools)

    def _create_agent(self):
        """
        Create the LangChain agent with tools and prompt.
        """
        # Define the prompt for the agent
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a helpful task management assistant. You help users manage their tasks using natural language.
             You can create, list, update, complete, and delete tasks.
             Always respond in a friendly, helpful way and confirm actions taken.
             Use the appropriate tools to perform task operations based on user requests.
             If a user asks about tasks, use the list_tasks tool.
             If a user wants to create a task, use the add_task tool.
             If a user wants to update a task, use the update_task tool.
             If a user wants to complete a task, use the complete_task tool.
             If a user wants to delete a task, use the delete_task tool.
             Only perform actions that clearly match the user's request."""),
            ("placeholder", "{chat_history}"),
            ("human", "{input}"),
            ("placeholder", "{agent_scratchpad}")
        ])

        # Create the agent
        agent = create_openai_functions_agent(self.model, self.tools, prompt)
        agent_executor = AgentExecutor(agent=agent, tools=self.tools, verbose=True)

        return agent_executor

    async def process_message(self, user_message: str, conversation_id: int) -> str:
        """
        Process a user message and return the AI response.
        This includes loading conversation history for context.
        """
        # Load conversation history for context
        conversation_history = await self._load_conversation_history(conversation_id)

        # Prepare the input for the agent
        input_data = {
            "input": user_message,
            "chat_history": conversation_history,
        }

        # Execute the agent
        try:
            result = await self.agent_executor.ainvoke(input_data)
            # Return the response
            return result['output']
        except Exception as e:
            # Handle any errors from the AI processing
            return f"Sorry, I encountered an error processing your request: {str(e)}. Please try again."

    async def _load_conversation_history(self, conversation_id: int) -> List[tuple]:
        """
        Load conversation history from the database for context.
        Returns a list of (role, message) tuples.
        """
        from src.models.conversation import Message, MessageRole

        # Query messages for this conversation
        messages = self.db_session.query(Message)\
            .filter(Message.conversation_id == conversation_id)\
            .order_by(Message.timestamp.asc())\
            .all()

        # Convert to the format expected by LangChain
        history = []
        for msg in messages:
            # Map roles to LangChain format
            role = "human" if msg.role == MessageRole.USER else "ai"
            history.append((role, msg.content))

        return history