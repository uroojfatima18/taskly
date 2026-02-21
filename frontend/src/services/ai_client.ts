/**
 * AI Client service for handling communication with AI providers (OpenAI/Gemini)
 * from the frontend side. This service provides retry logic and handles API calls
 * to the backend AI endpoints.
 */

export interface AIConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  maxRetries?: number;
  timeout?: number;
}

export interface ChatRequest {
  message: string;
  conversationId?: number;
  userId?: string;
}

export interface ChatResponse {
  success: boolean;
  response?: string;
  conversationId?: number;
  error?: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export class AIClient {
  private config: AIConfig;
  private baseUrl: string;

  constructor(config?: AIConfig) {
    this.config = {
      maxRetries: 3,
      timeout: 30000, // 30 seconds
      ...config,
    };

    // Use the backend API base URL
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
  }

  /**
   * Send a message to the AI and get a response
   */
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const { message, conversationId } = request;

    // Prepare the request payload
    const payload = {
      message,
      ...(conversationId && { conversation_id: conversationId }),
    };

    try {
      // Make API call to backend
      const response = await this.fetchWithRetry(`${this.baseUrl}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(typeof window !== 'undefined' && window.localStorage.getItem('auth-token')
            ? { Authorization: `Bearer ${window.localStorage.getItem('auth-token')}` }
            : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        response: data.ai_response,
        conversationId: data.conversation_id,
        usage: data.usage || undefined,
      };
    } catch (error) {
      console.error('Error sending message to AI:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Fetch with retry logic
   */
  private async fetchWithRetry(url: string, options: RequestInit, retries = this.config.maxRetries): Promise<Response> {
    let lastError: Error | null = null;

    for (let i = 0; i <= retries; i++) {
      try {
        // Add timeout to request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // If successful, return the response
        if (response.ok || response.status < 500) {
          return response;
        }

        // For 5xx errors, continue to retry
        lastError = new Error(`Server error: ${response.status}`);
      } catch (error) {
        lastError = error as Error;

        // If it's an abort error (timeout), don't retry
        if ((error as Error).name === 'AbortError') {
          throw error;
        }
      }

      // If this is not the last attempt, wait before retrying (exponential backoff)
      if (i < retries) {
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s...
        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  /**
   * Sleep utility function
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get conversation history
   */
  async getConversationHistory(conversationId: number): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/conversations/${conversationId}/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(typeof window !== 'undefined' && window.localStorage.getItem('auth-token')
            ? { Authorization: `Bearer ${window.localStorage.getItem('auth-token')}` }
            : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      throw error;
    }
  }

  /**
   * Get list of conversations
   */
  async getConversations(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/conversations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(typeof window !== 'undefined' && window.localStorage.getItem('auth-token')
            ? { Authorization: `Bearer ${window.localStorage.getItem('auth-token')}` }
            : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const aiClient = new AIClient();