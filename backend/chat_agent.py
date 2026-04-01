from agents import Agent, Runner, function_tool
from sqlalchemy.orm import Session
from models import Conversation, Message
from db import get_engine
import json
import sys
import os

# Add root path to sys.path so config can be imported if running inside backend/
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import run_config, Model

# Instead of running a separate heavy MCP python process, we can directly map our DB tools to the Agent 
# or use an MCP Client if the FastMCP server runs on a separate port.
# For simplicity and robust integration in FastAPI without IPC overhead, we'll map the functions natively.
# (If strict separated MCP server is required by the Hackathon, you'd substitute these with an MCPClient wrapper)

from mcp_server import add_task, list_tasks, complete_task, delete_task, update_task

todo_agent = Agent(
    name="Todo Chatbot",
    instructions="""You are a STRICT To-Do list assistant. 
    Your ONLY purpose is to manage tasks for the user using the provided tools.
    
    GUARDRAILS:
    - You MUST NOT answer questions on any topic other than task management.
    - If the user asks about weather, sports, politics, math, or anything unrelated to tasks, you must politely say: "I am only allowed to manage your to-do list. Please let me know if you want to add, list, or update your tasks."
    
    TASK MANAGEMENT RULES:
    - You will be given a [System: User ID is X] at the start of every message.
    - Always use this provided User ID as the 'user_id' argument in all tool calls (add_task, list_tasks, etc).
    - When adding tasks, call add_task.
    - When listing tasks, use list_tasks with the appropriate status filter ('all', 'pending', 'completed').
    - Only modify or delete tasks that exist (check with list_tasks first if unsure).
    - Always confirm actions with a friendly, natural language response.""",
    # We inject the Gemini model from your root config.py
    model=Model,
    tools=[
        function_tool(add_task),
        function_tool(list_tasks),
        function_tool(complete_task),
        function_tool(delete_task),
        function_tool(update_task),
    ]
)

async def chat_with_agent(user_id: str, message: str, conversation_id: int = None) -> dict:
    with Session(get_engine()) as session:
        # Ensure user exists before creating conversation (Lazy Init)
        from models import User
        user = session.get(User, user_id)
        if not user:
            user = User(id=user_id, email=f"{user_id}@demo.app", name=user_id, password_hash="")
            session.add(user)
            session.commit()
            session.refresh(user)

        # Load or create conversation
        if not conversation_id:
            conv = Conversation(user_id=user_id)
            session.add(conv)
            session.commit()
            session.refresh(conv)
            conversation_id = conv.id
        else:
            conv = session.query(Conversation).filter(Conversation.id == conversation_id, Conversation.user_id == user_id).first()
            if not conv:
                raise ValueError("Conversation not found")

        # Save user message
        user_msg = Message(conversation_id=conversation_id, user_id=user_id, role="user", content=message)
        session.add(user_msg)
        session.commit()

        # Load history and convert to format for Runner
        history = session.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.created_at).all()
        history_msgs = [{"role": msg.role, "content": msg.content} for msg in history]

        # Provide context about the current user ID to the agent
        full_message = f"[System: User ID is {user_id}]\n{message}"

        # Combine history with the new message for the AI (Input list format)
        conversation_input = history_msgs + [{"role": "user", "content": full_message}]
        
        # Run agent with the full conversation history
        result = await Runner.run(todo_agent, conversation_input)

        # Save agent response
        bot_msg = Message(conversation_id=conversation_id, user_id=user_id, role="assistant", content=result.final_output)
        session.add(bot_msg)
        session.commit()

        return {
            "conversation_id": conversation_id,
            "response": result.final_output,
            "tool_calls": result.tool_calls if hasattr(result, "tool_calls") else []
        }
