'use client';

import React from 'react';
import ChatInterface from '../../../components/chat/ChatInterface';

const ChatPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Task Management Assistant</h1>
      <div className="h-[calc(100vh-200px)]">
        <ChatInterface />
      </div>
    </div>
  );
};

export default ChatPage;