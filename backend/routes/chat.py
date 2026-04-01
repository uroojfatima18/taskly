from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from chat_agent import chat_with_agent

# Instead of re-implementing auth right away, we fetch the router pattern for getting the user_id.
# Assume you have a similar get_current_user dependency in auth.py or dependencies/.
# For simplicity, we accept user_id in the payload or you can inject your actual BetterAuth dependency here.

chat = APIRouter()

class ChatRequest(BaseModel):
    user_id: str
    message: str
    conversation_id: Optional[int] = None

class ChatResponse(BaseModel):
    conversation_id: int
    response: str
    tool_calls: list

@chat.post("/", response_model=ChatResponse)
async def process_chat(request: ChatRequest):
    """
    Endpoint for the stateless AI Chatbot using OpenAI Agents SDK.
    Takes a natural language message and manages user tasks.
    """
    try:
        result = await chat_with_agent(
            user_id=request.user_id,
            message=request.message,
            conversation_id=request.conversation_id
        )
        return result
    except Exception as e:
        import traceback
        import logging
        logging.error(f"CHATBOT ERROR: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
