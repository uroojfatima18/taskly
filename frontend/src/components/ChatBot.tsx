'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, MessageSquare, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';

interface ChatBotProps {
  userId: string;
  onTaskAction?: () => void; // Callback to refresh tasks in the dashboard
}

export function ChatBot({ userId, onTaskAction }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi! I\'m your Taskly AI. I can help you add, list, complete, or update tasks. How can I assist you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.chat({
        user_id: userId,
        message: input,
        conversation_id: conversationId,
      });

      setConversationId(response.conversation_id);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      // If the AI called a tool, tell the parent to refresh tasks
      if (response.tool_calls && response.tool_calls.length > 0) {
        onTaskAction?.();
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <MessageSquare size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-dark-surface border border-dark-border rounded-2xl shadow-2xl w-[380px] sm:w-[450px] h-[550px] flex flex-col animate-scale-in overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-dark-elevated border-b border-dark-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600/20 text-primary-500 rounded-xl flex items-center justify-center border border-primary-500/30">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold text-neutral-100">Taskly AI</h3>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-neutral-400 hover:text-neutral-100 hover:bg-dark-surface rounded-lg transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 max-w-[85%]",
                  message.role === 'user' ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border",
                    message.role === 'user' 
                      ? "bg-dark-elevated border-dark-border text-neutral-300" 
                      : "bg-primary-600/10 border-primary-500/30 text-primary-500"
                  )}
                >
                  {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div
                  className={cn(
                    "p-3 rounded-2xl text-sm leading-relaxed",
                    message.role === 'user'
                      ? "bg-primary-600 text-white rounded-tr-none"
                      : "bg-dark-elevated text-neutral-200 border border-dark-border rounded-tl-none"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-lg bg-primary-600/10 border border-primary-500/30 text-primary-500 flex items-center justify-center flex-shrink-0">
                  <Bot size={16} />
                </div>
                <div className="bg-dark-elevated text-neutral-200 border border-dark-border p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-primary-500" />
                  <span className="text-xs font-medium italic">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 bg-dark-elevated border-t border-dark-border">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me to add a task..."
                className="w-full pl-4 pr-12 py-3 bg-dark-surface border border-dark-border rounded-xl text-neutral-100 placeholder-neutral-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:bg-neutral-600 text-white rounded-lg transition-all"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-[10px] text-neutral-500 text-center mt-2">
              Powered by Stepfun 3.5 via OpenRouter
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
