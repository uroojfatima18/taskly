'use client';

import React, { useState, useEffect, useRef } from 'react';
import { aiClient } from '../../lib/ai_client';
import { Message } from '../../services/chat_api';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import TaskListDisplay from './TaskListDisplay';

interface ChatInterfaceProps {
  conversationId?: number;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ conversationId: propConversationId }) => {
  const [conversationId, setConversationId] = useState<number | undefined>(propConversationId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages when conversationId changes
  useEffect(() => {
    if (conversationId) {
      loadMessages();
    } else {
      // Create a new conversation if none exists
      createNewConversation();
    }
  }, [conversationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const createNewConversation = async () => {
    try {
      setIsLoading(true);
      const newConversation = await aiClient.createConversation();
      setConversationId(newConversation.id);
      setMessages([]);
      setError(null);
    } catch (err) {
      console.error('Error creating conversation:', err);
      setError('Failed to create a new conversation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!conversationId) return;

    try {
      setIsLoading(true);
      const loadedMessages = await aiClient.getConversationMessages(conversationId);
      setMessages(loadedMessages);
      setError(null);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!conversationId) return;

    try {
      setIsLoading(true);

      // Add user message immediately to UI
      const userMessage: Message = {
        id: Date.now(),
        conversation_id: conversationId,
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, userMessage]);

      // Send message to AI and get response
      const response = await aiClient.sendMessage(conversationId, message);

      // Add AI response to messages
      const aiMessage: Message = {
        id: Date.now() + 1,
        conversation_id: conversationId,
        role: 'assistant',
        content: response.aiResponse,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      setError(null);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');

      // Remove the user message if sending failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    setConversationId(undefined);
    setMessages([]);
    setError(null);
  };

  return (
    <div className="flex flex-col h-full bg-dark-surface rounded-2xl border border-dark-border shadow-lifted overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-dark-bg/50 backdrop-blur-md border-b border-dark-border flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-900/30 rounded-xl flex items-center justify-center border border-primary-600/30">
            <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-100">Task Assistant</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-neutral-400 font-medium">Online</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleNewConversation}
          className="p-2 text-neutral-400 hover:text-white hover:bg-dark-elevated rounded-lg transition-all"
          title="New Conversation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-dark-bg scrollbar-hide">
        {error && (
          <div className="mb-4 p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl animate-shake">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {messages.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-accent-600 rounded-3xl flex items-center justify-center shadow-glow">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-neutral-100">How can I help you?</h3>
              <p className="text-neutral-400 max-w-xs mx-auto text-sm">
                I can help you organize tasks, set reminders, and manage your productivity.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
              <button
                onClick={() => handleSendMessage("Show my tasks")}
                className="p-3 bg-dark-elevated hover:bg-dark-border border border-dark-border text-neutral-300 rounded-xl text-sm font-medium transition-all text-left flex items-center gap-3 group"
              >
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full group-hover:scale-150 transition-transform"></span>
                "Show my tasks"
              </button>
              <button
                onClick={() => handleSendMessage("Add a task to prepare the presentation")}
                className="p-3 bg-dark-elevated hover:bg-dark-border border border-dark-border text-neutral-300 rounded-xl text-sm font-medium transition-all text-left flex items-center gap-3 group"
              >
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full group-hover:scale-150 transition-transform"></span>
                "Add a task to..."
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-dark-elevated text-neutral-100 px-4 py-3 rounded-2xl rounded-bl-none border border-dark-border flex items-center gap-2">
                  <div className="flex space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-dark-surface border-t border-dark-border">
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading || !conversationId} />
      </div>
    </div>
  );
};

export default ChatInterface;