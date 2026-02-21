/**
 * AI Client wrapper for handling chatbot interactions
 * Provides a high-level interface for chat operations
 */

import { chatApi, Conversation, Message, SendMessageRequest } from '../services/chat_api';

export class AIClient {
  private chatApi = chatApi;

  /**
   * Creates a new conversation
   */
  async createConversation(title?: string): Promise<Conversation> {
    const response = await this.chatApi.createConversation({ title });

    // Return a conversation object with the response data
    return {
      id: response.conversation_id,
      title: response.title,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * Gets all conversations for the current user
   */
  async getUserConversations(): Promise<Conversation[]> {
    return await this.chatApi.getUserConversations();
  }

  /**
   * Gets all messages for a specific conversation
   */
  async getConversationMessages(conversationId: number): Promise<Message[]> {
    return await this.chatApi.getConversationMessages(conversationId);
  }

  /**
   * Sends a message to the chatbot and returns the response
   */
  async sendMessage(conversationId: number, message: string): Promise<{ userMessage: Message, aiResponse: string }> {
    const request: SendMessageRequest = {
      conversation_id: conversationId,
      message
    };

    const response = await this.chatApi.sendMessage(request);

    // Construct the user message object
    const userMessage: Message = {
      id: Date.now(), // Temporary ID, actual ID comes from server
      conversation_id: response.conversation_id,
      role: 'user',
      content: response.user_message,
      timestamp: response.timestamp
    };

    return {
      userMessage,
      aiResponse: response.ai_response
    };
  }

  /**
   * Deletes a conversation
   */
  async deleteConversation(conversationId: number): Promise<void> {
    return await this.chatApi.deleteConversation(conversationId);
  }
}

// Export a singleton instance
export const aiClient = new AIClient();