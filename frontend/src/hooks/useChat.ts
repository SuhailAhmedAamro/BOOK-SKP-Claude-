import { useState, useEffect } from 'react';
import { chatService, ChatResponse, Source } from '../services/chatService';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => uuidv4());

  const sendMessage = async (
    content: string,
    selectedText?: string,
    chapterNumber?: number
  ) => {
    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content }]);
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage({
        message: content,
        selected_text: selectedText,
        chapter_number: chapterNumber,
        session_id: sessionId,
      });

      // Add assistant response
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.message, sources: response.sources },
      ]);
    } catch (error: any) {
      console.error('Chat error:', error);

      // Provide more helpful error messages based on error type
      let errorMessage = 'Sorry, I encountered an error. Please try again.';

      if (error.response) {
        // Server responded with error
        if (error.response.status === 401 || error.response.status === 403) {
          errorMessage = 'Authentication error. Please sign in again.';
        } else if (error.response.status === 429) {
          errorMessage = 'Too many requests. Please wait a moment and try again.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Server error. Our AI tutor is temporarily unavailable. Please try again in a moment.';
        }
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'Connection error. Please check your internet connection and try again.';
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    sessionId,
  };
}
