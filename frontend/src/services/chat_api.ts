import { api } from '@/lib/api';

export interface Conversation {
  id: number;
  title?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface CreateConversationRequest {
  title?: string;
}

export interface CreateConversationResponse {
  conversation_id: number;
  title?: string;
  message: string;
}

export interface SendMessageRequest {
  conversation_id: number;
  message: string;
}

export interface SendMessageResponse {
  conversation_id: number;
  user_message: string;
  ai_response: string;
  timestamp: string;
}

class ChatApi {
  /**
   * Creates a new conversation
   */
  async createConversation(request: CreateConversationRequest): Promise<CreateConversationResponse> {
    return api.request<CreateConversationResponse>('/api/chat/conversations', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Gets all conversations for the current user
   */
  async getUserConversations(): Promise<Conversation[]> {
    return api.request<Conversation[]>('/api/chat/conversations', {
      method: 'GET',
    });
  }

  /**
   * Gets all messages for a specific conversation
   */
  async getConversationMessages(conversationId: number): Promise<Message[]> {
    return api.request<Message[]>(`/api/chat/conversations/${conversationId}`, {
      method: 'GET',
    });
  }

  /**
   * Sends a message to the chatbot and returns the response
   */
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    return api.request<SendMessageResponse>('/api/chat/messages', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Deletes a conversation
   */
  async deleteConversation(conversationId: number): Promise<void> {
    await api.request<void>(`/api/chat/conversations/${conversationId}`, {
      method: 'DELETE',
    });
  }
}

export const chatApi = new ChatApi();