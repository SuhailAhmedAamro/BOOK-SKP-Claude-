import React from 'react';
import { Source } from '../../services/chatService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
}

interface Props {
  message: Message;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>

        {/* Sources */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
            <p className="text-xs font-semibold mb-2 opacity-75">Sources:</p>
            <div className="space-y-1">
              {message.sources.map((source, idx) => (
                <div key={idx} className="text-xs opacity-75">
                  📖 Chapter {source.chapter}: {source.section}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
