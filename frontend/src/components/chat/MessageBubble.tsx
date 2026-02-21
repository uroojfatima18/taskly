import React from 'react';
import { Message } from '../../services/chat_api';
import TaskListDisplay from './TaskListDisplay';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // Check if the message contains task data (JSON-like structure)
  const containsTasks = () => {
    try {
      const parsed = JSON.parse(message.content);
      return Array.isArray(parsed.tasks) || (parsed.data && Array.isArray(parsed.data.tasks));
    } catch (e) {
      return false;
    }
  };

  // Extract tasks from message content if available
  const extractTasks = () => {
    try {
      const parsed = JSON.parse(message.content);
      return parsed.tasks || (parsed.data && parsed.data.tasks) || [];
    } catch (e) {
      try {
        // Try to extract tasks from a more flexible format
        const lowerContent = message.content.toLowerCase();
        if (lowerContent.includes('tasks') && lowerContent.includes('found')) {
          // Look for task-like structures in the message
          const taskMatches = message.content.match(/(\d+)\.\s*(.*?)\s*-?\s*(.*?)(?=\n|$)/g);
          if (taskMatches) {
            return taskMatches.map((match, index) => ({
              id: index + 1,
              title: match.replace(/^\d+\.\s*/, '').split('-')[0]?.trim() || match,
              completed: false
            }));
          }
        }
        return [];
      } catch (e) {
        return [];
      }
    }
  };

  const renderContent = () => {
    if (containsTasks()) {
      const tasks = extractTasks();
      return (
        <div>
          <p className="mb-2">{message.content.split('{')[0]}</p> {/* Show text before JSON */}
          <TaskListDisplay tasks={tasks} />
        </div>
      );
    }

    return <p className="whitespace-pre-wrap">{message.content}</p>;
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div
        className={`max-w-[85%] lg:max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${isUser
            ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-br-none glow-purple'
            : 'bg-dark-elevated text-neutral-100 rounded-bl-none border border-dark-border'
          } animate-scale-in`}
      >
        <div className="text-[15px] leading-relaxed">
          {renderContent()}
        </div>
        <div className={`text-[10px] mt-1.5 font-medium uppercase tracking-wider ${isUser ? 'text-primary-200' : 'text-neutral-500'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;