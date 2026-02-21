from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from src.middleware.auth import JWTBearer, get_current_user_id
from src.database import get_db
from src.services.chat_service import ChatService
from src.models.conversation import Conversation, Message
from pydantic import BaseModel


router = APIRouter(
    prefix="/chat",
    tags=["chat"],
    dependencies=[Depends(JWTBearer())],
)


class CreateConversationRequest(BaseModel):
    title: Optional[str] = None


class CreateConversationResponse(BaseModel):
    conversation_id: int
    title: Optional[str]
    message: str


class SendMessageRequest(BaseModel):
    conversation_id: int
    message: str


class SendMessageResponse(BaseModel):
    conversation_id: int
    user_message: str
    ai_response: str
    timestamp: str


class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    role: str
    content: str
    timestamp: str


class ConversationResponse(BaseModel):
    id: int
    title: Optional[str]
    created_at: str
    updated_at: str


@router.post("/conversations", response_model=CreateConversationResponse)
async def create_conversation(
    request: CreateConversationRequest,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Create a new conversation for the user.
    """
    try:
        chat_service = ChatService(db)
        conversation = await chat_service.create_conversation(
            user_id=user_id,
            title=request.title
        )

        return CreateConversationResponse(
            conversation_id=conversation.id,
            title=conversation.title,
            message="Conversation created successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create conversation: {str(e)}"
        )


@router.get("/conversations", response_model=List[ConversationResponse])
async def get_user_conversations(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Get all conversations for the current user.
    """
    try:
        chat_service = ChatService(db)
        conversations = await chat_service.get_user_conversations(user_id)

        return [
            ConversationResponse(
                id=conv.id,
                title=conv.title,
                created_at=conv.created_at.isoformat(),
                updated_at=conv.updated_at.isoformat()
            )
            for conv in conversations
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve conversations: {str(e)}"
        )


@router.get("/conversations/{conversation_id}", response_model=List[MessageResponse])
async def get_conversation_messages(
    conversation_id: int,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Get all messages for a specific conversation.
    """
    try:
        chat_service = ChatService(db)

        # Verify user has access to this conversation
        conversation = await chat_service.get_conversation(conversation_id, user_id)
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found or access denied"
            )

        messages = await chat_service.get_conversation_messages(conversation_id)

        return [
            MessageResponse(
                id=msg.id,
                conversation_id=msg.conversation_id,
                role=msg.role.value,
                content=msg.content,
                timestamp=msg.timestamp.isoformat()
            )
            for msg in messages
        ]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve messages: {str(e)}"
        )


@router.post("/messages", response_model=SendMessageResponse)
async def send_message(
    request: SendMessageRequest,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Send a message to the chatbot and get a response.
    """
    try:
        chat_service = ChatService(db)

        # Verify user has access to this conversation
        conversation = await chat_service.get_conversation(request.conversation_id, user_id)
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found or access denied"
            )

        # Process the message through the chat service
        result = await chat_service.process_user_message(
            conversation_id=request.conversation_id,
            user_id=user_id,
            user_message=request.message
        )

        return SendMessageResponse(
            conversation_id=result["conversation_id"],
            user_message=request.message,
            ai_response=result["ai_response"],
            timestamp=result["user_message"].timestamp.isoformat()
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process message: {str(e)}"
        )


@router.delete("/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: int,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Delete a conversation and all its messages.
    """
    try:
        chat_service = ChatService(db)
        success = await chat_service.delete_conversation(conversation_id, user_id)

        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found or access denied"
            )

        return {"message": "Conversation deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete conversation: {str(e)}"
        )