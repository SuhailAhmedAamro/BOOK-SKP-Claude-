import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, sendMessage } = useChat();
  const { isAuthenticated } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut: Ctrl/Cmd + K to toggle chat
  useKeyboardShortcut('k', useCallback(() => {
    if (isAuthenticated) {
      setIsOpen(prev => !prev);
    }
  }, [isAuthenticated]), { ctrl: true });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle selection event
  useEffect(() => {
    const handleOpenWithSelection = (event: CustomEvent) => {
      const selectedText = sessionStorage.getItem('selectedTextForChat');
      if (selectedText) {
        setIsOpen(true);
        sessionStorage.removeItem('selectedTextForChat');
      }
    };

    window.addEventListener('openChatWithSelection', handleOpenWithSelection as EventListener);
    return () => {
      window.removeEventListener('openChatWithSelection', handleOpenWithSelection as EventListener);
    };
  }, []);

  const handleSendMessage = async (content: string, selectedText?: string) => {
    // Get current chapter number from URL if on a chapter page
    const chapterMatch = window.location.pathname.match(/Chapter-(\d+)/);
    const chapterNumber = chapterMatch ? parseInt(chapterMatch[1]) : undefined;

    await sendMessage(content, selectedText, chapterNumber);
  };

  // Require authentication everywhere for chatbot
  if (!isAuthenticated) {
    return null; // Don't show chatbot if not authenticated
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 pulse-glow"
            aria-label="Open AI Chatbot"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
              duration: 0.4
            }}
            className="fixed bottom-6 right-6 w-[450px] h-[700px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col z-50 border-2 border-blue-500/30 dark:border-blue-500/50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 glass-card">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-3 h-3 bg-green-500 rounded-full"
                />
                <h3 className="font-semibold">AI Tutor</h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label="Close chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center text-gray-500 dark:text-gray-400 mt-8"
                >
                  <p className="text-lg font-semibold mb-2">Welcome! 👋</p>
                  <p className="text-sm">
                    I'm your AI tutor for Physical AI & Robotics.
                    <br />
                    Ask me anything about the chapters!
                  </p>
                </motion.div>
              )}

              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ChatMessage message={message} />
                </motion.div>
              ))}

              {isLoading && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <ChatInput onSend={handleSendMessage} disabled={isLoading} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
